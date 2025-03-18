import API from "../../api/requester.js"
import "../low/checkbox_filter.js"
import "../low/range_filter.js"
import "../low/select_filter.js"

/**
 * @typedef {{name: string, type: string, options: string[], range: number[]}} Filter
 * @typedef {{[key: string]: string | number | boolean}} FilterState
 */
class Filters extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div>
            <div class="filters-header">
                <h2>Filters</h2>
                <div>
                    <button id="apply-filters"><img src="/static/img/apply.png"></button>
                    <button id="clear-filters"><img src="/static/img/bin.png"><button>
                </div>                
            </div>
            
            <form id="filter-form"></form>
            <slot></slot>
        </div>
        `;
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/filters.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    connectedCallback() {
        API.requestBuilder()
            .method(API.Methods.GET)
            .url("/api/filters")
            .send()
            .then(response => {
                if (response.status === "error") {
                    console.error(response.error);
                    return;
                }
                this.setFilters(response.data)
            });

        const clearFilters = this.shadowRoot.getElementById("clear-filters");
        clearFilters.addEventListener("click", () => {
            console.log("Clearing filters");
            const filterForm = this.shadowRoot.getElementById("filter-form");
            filterForm.reset();

            const filters = this.shadowRoot.querySelectorAll('select-filter, checkbox-filter, range-filter');
            console.log(filters.length);
            filters.forEach(filter => filter.clearFilter());

            this.submitFilters(new Event('submit'));
        });
    }

    /**
     * 
     * @param {Filter[]} filters 
     */
    setFilters(filters) {
        const filterForm = this.shadowRoot.getElementById("filter-form");
        filterForm.addEventListener("submit", this.submitFilters.bind(this)); // Use addEventListener for form submission

        const applyFilters = this.shadowRoot.getElementById("apply-filters");
        applyFilters.addEventListener("click", this.submitFilters.bind(this)); // Use addEventListener for form submission

        filters.forEach(filter => {
            const { type } = filter;

            const filterElement = document.createElement(`${type}-filter`);

            filterElement.setFilterState(filter);

            filterForm.appendChild(filterElement);
        });
    }

    /**
     * @returns {FilterState}
     */
    filterState() {
        const filterStates = {
            checkboxFilters: {},
            selectFilters: {},
            rangeFilters: {}
        };

        for (const filterElement of this.shadowRoot.querySelectorAll('select-filter, checkbox-filter, range-filter')) {
            if (filterElement.filterState) {
                const state = filterElement.filterState();

                if (filterElement.tagName === 'SELECT-FILTER') {
                    filterStates.selectFilters = { ...filterStates.selectFilters, ...state };
                } else if (filterElement.tagName === 'CHECKBOX-FILTER') {
                    filterStates.checkboxFilters = { ...filterStates.checkboxFilters, ...state };
                } else if (filterElement.tagName === 'RANGE-FILTER') {
                    filterStates.rangeFilters = { ...filterStates.rangeFilters, ...state };
                }
            }
        }
        return filterStates;
    }

    /**
     * 
     * @param {SubmitEvent} e 
     */
    async submitFilters(e) {
        e.preventDefault()

        API.requestBuilder()
            .url("/api/submit-filters")
            .body(this.filterState())
            .method(API.Methods.POST)
            .q_params({ page: 1 })
            .send()
            .then((response) => {
                /**
                 * @type {Product[]} filteredContent
                 */
                const filteredContent = response.data.products;

                const contentElement = document.querySelector("store-page")
                    .shadowRoot
                    .getElementById("content");

                contentElement.setProducts(filteredContent);
            }).catch((err) => console.error(err))
    }
}

customElements.define('filters-component', Filters);