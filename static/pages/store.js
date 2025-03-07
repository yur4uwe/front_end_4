
class Store extends HTMLElement  {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                text-align: center;
                margin-top: calc(var(--header-height) + 20px);
                padding: 20px;
            }
        </style>
        <div>
            <filter-component></filter-component>
            <content-component></content-component>
        </div>
        `;
    }
}

customElements.define('store-page', Store);