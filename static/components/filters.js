
/**
 * @typedef {{name: string, type: string, options: string[], range: number[]}} Filter
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
                const range = document.createElement('input');
                range.type = 'range';
                range.min = filter.range[0];
                range.max = filter.range[1];
                filterElement.appendChild(range);
            }

            this.shadowRoot.appendChild(filterElement);
        });
    }
}

customElements.define('filters-component', Filters);