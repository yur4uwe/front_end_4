
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
            div {
                display: flex;
                
            }
            filters-component {
                width: 30%;
                margin-right: 5px;
            }
            content-component {
                width: 70%;
                margin-left: 5px;
            }
        </style>
        <div>
            <filters-component></filters-component>
            <content-component></content-component>
        </div>
        `;
    }
}

customElements.define('store-page', Store);