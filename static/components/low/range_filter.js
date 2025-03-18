class RangeFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
    }

    async loadStyles() {
        const style = await fetch('/static/components/low/range_filter.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    filterState() {
        const ranges = Array.from(this.shadowRoot.querySelectorAll('range-input'));
        return ranges.reduce((acc, range) => ({
            ...acc,
            [range.id]: { min: range.minValue, max: range.maxValue }
        }), {});
    }

    clearFilter() {
        this.shadowRoot.querySelectorAll('range-input').forEach(range => {
            range.setAttributes(range.min, range.max, range.min, range.max);
            range.dispatchEvent(new CustomEvent('input-change', {
                detail: { minValue: range.min, maxValue: range.max }
            }));
        });
    }

    /**
     * @param {Filter} filterState 
     */
    setFilterState(filterState) {
        this.shadowRoot.innerHTML = '';
        const name = document.createElement('h3');
        name.textContent = filterState.name;
        this.shadowRoot.appendChild(name);

        const maxCharWidth = Math.max(...filterState.range.map(num => num.toString().length));

        const container = document.createElement('div');
        container.className = 'range-container';

        const minInput = document.createElement('input');
        minInput.className = 'range-value';
        minInput.type = 'text';
        minInput.min = filterState.range[0];
        minInput.max = filterState.range[1];
        minInput.value = filterState.range[0];
        minInput.style.width = `${maxCharWidth}ch`;
        minInput.addEventListener('input', (e) => this.handleInputChange(e, true));

        const rangeElement = document.createElement('range-input');
        rangeElement.id = filterState.name;
        rangeElement.addEventListener('input-change', (e) => this.updateInputs(e, minInput, maxInput));
        
        const maxInput = document.createElement('input');
        maxInput.className = 'range-value';
        maxInput.type = 'text';
        maxInput.min = filterState.range[0];
        maxInput.max = filterState.range[1];
        maxInput.value = filterState.range[1];
        maxInput.style.width = `${maxCharWidth}ch`;
        maxInput.addEventListener('input', (e) => this.handleInputChange(e, false));
        
        container.append(minInput, rangeElement, maxInput);
        this.shadowRoot.appendChild(container);
        
        rangeElement.setAttributes(...filterState.range, ...filterState.range);
    }

    handleInputChange(event, isMin) {
        const input = event.target;
        const range = this.shadowRoot.querySelector('range-input');
        let value = parseInt(input.value);

        if (isNaN(value)) {
            value = isMin ? range.min : range.max;
            input.value = value;
        }

        const clamped = Math.max(range.min, Math.min(value, range.max));
        if (clamped !== value) {
            input.value = clamped;
            value = clamped;
        }

        const eventType = isMin ? 'min-value-change' : 'max-value-change';
        range.dispatchEvent(new CustomEvent(eventType, {
            detail: { [isMin ? 'minValue' : 'maxValue']: value }
        }));
    }

    updateInputs(event, minInput, maxInput) {
        const { minValue, maxValue } = event.detail;
        minInput.value = minValue;
        maxInput.value = maxValue;
    }
}

customElements.define('range-filter', RangeFilter);