/**
 * @typedef {{name: string, type: string, options: string[], range: number[]}} Filter
 * @typedef {{[key: string]: string | number | boolean}} FilterState
 */

class RangeFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = ``;
    }

    async loadStyles() {
        const style = await fetch('/static/components/low/range_filter.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    filterState() {
        if (this.shadowRoot.children.length === 0) {
            return {};
        }

        let rangeFilters = Array.from(this.shadowRoot.querySelectorAll('input[type="range"]'));
        rangeFilters = rangeFilters.reduce((acc, filter) => {
            acc[filter.id] = filter.value;
            return acc;
        }, {});

        return rangeFilters;
    }

    /**
     *  
     * @param {Filter} filterState 
     */
    setFilterState(filterState) {
        const name = document.createElement('h3');
        name.textContent = filterState.name;

        this.shadowRoot.appendChild(name);

        const labelElement = document.createElement('label');
        labelElement.innerHTML = `<span>${filterState.range[0]}</span>`;

        const range = document.createElement('range-input');
        range.id = filterState.name;
        range.setAttributes(filterState.range[0], filterState.range[1], filterState.range[1]);

        const valueSpanElement = document.createElement('span');
        valueSpanElement.id = filterState.name + '-value';
        valueSpanElement.innerHTML = range.value;
        const maxValueLength = filterState.range[1].toString().length;
        valueSpanElement.style.width = `${maxValueLength}ch`;

        range.addEventListener('input-change', (e) => {
            const value = e.detail;
            console.log('input:', value);
            valueSpanElement.innerHTML = value;
        });

        labelElement.appendChild(range);
        labelElement.appendChild(valueSpanElement);

        this.shadowRoot.appendChild(labelElement);
    }
}

customElements.define('range-filter', RangeFilter);