/**
 * @typedef {{name: string, type: string, options: string[], range: number[]}} Filter
 * @typedef {{[key: string]: string | number | boolean}} FilterState
 */

class SelectFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //this.loadStyles();
        this.shadowRoot.innerHTML = ``;
    }

    async loadStyles() {
        const style = await fetch('/static/components/low/select_filter.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    filterState() {
        if (this.shadowRoot.children.length === 0) {
            return {};
        }

        let selectFilters = Array.from(this.shadowRoot.querySelectorAll('select'));
        selectFilters = selectFilters.reduce((acc, filter) => {
            acc[filter.id] = filter.value;
            return acc;
        }, {});

        return selectFilters;
    }

    clearFilter() {
        console.log('clearing select');
        this.shadowRoot.querySelectorAll("select").forEach(select => {
            select.selectedIndex = 0;
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

        const select = document.createElement('select');
        select.id = filterState.name;
        filterState.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });

        select.addEventListener('change', () => {
            // Dispatch the filter-change event
            document.dispatchEvent(new Event('filter-change'));
        });

        this.shadowRoot.appendChild(select);
    }
}

customElements.define('select-filter', SelectFilter);