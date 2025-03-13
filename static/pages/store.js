import API from '../api/requester.js';

class Store extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div>
            <filters-component id="filter"></filters-component>
            <content-component id="content"></content-component>
        </div>
        `;

        const filterComponent = this.shadowRoot.getElementById('filter');
        if (!filterComponent) {
            console.error("Filter component not found");
            return;
        }

        const contentComponent = this.shadowRoot.getElementById('content');
        if (!contentComponent) {
            console.error("Content component not found");
            return;
        }

        API.requestBuilder()
            .method(API.Methods.GET)
            .url("/api/products")
            .q_params({ page: 1 })
            .send()
            .then(response => {
                if (response.status === "error") {
                    console.error(response.error);
                    return;
                }
                contentComponent.setProducts(response.data)
            });

        API.requestBuilder()
            .method(API.Methods.GET)
            .url("/api/filters")
            .send()
            .then(response => {
                if (response.status === "error") {
                    console.error(response.error);
                    return;
                }
                filterComponent.setFilters(response.data)
            });
    }

    async loadStyles() {
        const style = await fetch('/static/pages/store.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }
}

customElements.define('store-page', Store);