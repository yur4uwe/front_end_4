import API from '../api/requester.js';

class Store extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                text-align: center;
                margin-top: calc(var(--header-height) + 20px);
                padding: 20px;
            }
            div {  
                display: flex;
                justify-content: center;
                width: 100%;              
            }
            filters-component {
                width: min-content;
                padding: 10px;
                margin-right: 5px;
                max-width: 300px;
            }
            content-component {
                width: 100%;
                margin-left: 5px;
            }
        </style>
        <div>
            <filters-component id="filter"></filters-component>
            <content-component id="content"></content-component>
        </div>
        `;

        const filterComponent = this.shadowRoot.getElementById('filter');
        const contentComponent = this.shadowRoot.getElementById('content');

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
}

customElements.define('store-page', Store);