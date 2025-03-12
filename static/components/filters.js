
/**
 * @typedef {{name: string, type: string, options: string[], range: number[]}} Filter
 * @typedef {{[key: string]: string | number | boolean}} FilterState
 */

class Filters extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                color: var(--text-color, black);
                padding: 10px;
                height: 100%;
                text-align: center;
                width: 100%;
                border-radius: 10px;
                border: 2px solid var(--text-color, black);
            }
            label {
                display: flex;
                justify-content: space-between;
            }
            input[type="checkbox"] {
                display: none;
            }
            input[type="checkbox"]:checked + span {
                background-color: var(--pr-color);
            }
            input[type="checkbox"]:not(checked) + span {
                background-color: var(--sc-color);
            }
            span.checkbox {
                border: 1px solid var(--text-color, black);
                border-radius: 5px;
                padding: 5px;
                margin: 2px 10px 2px 0;
                background-color: var(--sc-color);
                cursor: pointer
            }
            .checkbox-container {
                display: inline-flex;
                flex-wrap: wrap;
                white-space: nowrap;
            }
        </style>
        <div>
            <h2>My Filters</h2>
            <slot></slot>
        </div>
        `;
    }

    /**
     * 
     * @param {Filter[]} filters 
     */
    setFilters(filters) {
        filters.forEach(filter => {
            const filterElement = document.createElement('div');

            const name = document.createElement('h3');
            name.textContent = filter.name;

            filterElement.appendChild(name);

            if (filter.type === 'select') {
                const select = document.createElement('select');
                filter.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                });

                filterElement.appendChild(select);
            } else if (filter.type === 'range') {
                const labelElement = document.createElement('label');
                labelElement.innerHTML = filter.range[0];

                const range = document.createElement('input');
                range.type = 'range';
                range.min = filter.range[0];
                range.max = filter.range[1];

                labelElement.appendChild(range);

                const valueSpanElement = document.createElement('span');
                valueSpanElement.id = filter.name + '-value';
                valueSpanElement.innerHTML = range.value;
                const maxValueLength = filter.range[1].toString().length;
                valueSpanElement.style.width = `${maxValueLength}ch`;

                labelElement.appendChild(valueSpanElement);

                range.onchange = () => {
                    const valueSpanElement = this.shadowRoot.getElementById(filter.name + '-value');
                    valueSpanElement.innerHTML = range.value;
                };

                filterElement.appendChild(labelElement);
            } else if (filter.type === 'checkbox') {
                const labelElement = document.createElement('label');
                const divElement = document.createElement('div');
                divElement.classList.add('checkbox-container');
                filter.options.forEach(option => {
                    const checkboxElement = document.createElement('input');
                    checkboxElement.id = option + '-checkbox';
                    checkboxElement.type = 'checkbox';

                    divElement.appendChild(checkboxElement);

                    const optionNameElement = document.createElement('span');
                    optionNameElement.classList.add('checkbox');
                    optionNameElement.textContent = option;
                    optionNameElement.onclick = () => {
                        const name = option + '-checkbox';
                        const checkbox = this.shadowRoot.getElementById(name);
                        checkbox.checked = !checkbox.checked;
                    };

                    divElement.appendChild(optionNameElement);

                    filterElement.appendChild(labelElement.appendChild(divElement));
                });
            }

            this.shadowRoot.appendChild(filterElement);
        });
    }

    /**
     * @returns {FilterState}
     */
    filterState() {
        const checkboxFilters = Array.from(this.shadowRoot.querySelectorAll('input[type="checkbox"]'));
        checkboxFilters.reduce((acc, filter) => {
            acc[filter.id] = filter.checked;
            return acc;
        }, {});

        const selectFilters = Array.from(this.shadowRoot.querySelectorAll('select'));
        selectFilters.reduce((acc, filter) => {
            acc[filter.id] = filter.value;
            return acc;
        }, {});

        const rangeFilters = Array.from(this.shadowRoot.querySelectorAll('input[type="range"]'));
        rangeFilters.reduce((acc, filter) => {
            acc[filter.id] = filter.value;
            return acc;
        }, {});

        return { ...checkboxFilters, ...selectFilters, ...rangeFilters };
    }
}

customElements.define('filters-component', Filters);