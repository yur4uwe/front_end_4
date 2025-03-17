/**
 * @typedef {{name: string, type: string, options: string[], range: number[]}} Filter
 * @typedef {{[key: string]: string | number | boolean}} FilterState
 */

class CheckboxFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();

        this.shadowRoot.innerHTML = ``;
    }

    async loadStyles() {
        const style = await fetch('/static/components/low/checkbox_filter.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    filterState() {
        if (this.shadowRoot.children.length === 0) {
            return {};
        }

        let checkboxFilters = Array.from(this.shadowRoot.querySelectorAll('input[type="checkbox"]'));
        checkboxFilters = checkboxFilters.reduce((acc, filter) => {
            acc[filter.id] = filter.checked;
            return acc;
        }, {});

        return checkboxFilters;
    }

    clearFilter() {
        console.log('clearing checkboxes');
        this.shadowRoot.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
            checkbox.checked = false;
        });
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
        const divElement = document.createElement('div');
        divElement.classList.add('checkbox-container');
        filterState.options.forEach(option => {
            const checkboxElement = document.createElement('input');
            checkboxElement.id = option;
            checkboxElement.type = 'checkbox';
            checkboxElement.classList.add('checkbox-input');

            divElement.appendChild(checkboxElement);

            const optionNameElement = document.createElement('span');
            optionNameElement.classList.add('checkbox');
            optionNameElement.onclick = () => {
                const name = option;
                const checkbox = this.shadowRoot.getElementById(name);
                checkbox.checked = !checkbox.checked;
            };

            optionNameElement.innerHTML = `<span>${option}</span>`;

            divElement.appendChild(optionNameElement);

            this.shadowRoot.appendChild(labelElement.appendChild(divElement));
        });
    }
}

customElements.define('checkbox-filter', CheckboxFilter);