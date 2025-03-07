class Filters extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                background-color: #333;
                color: white;
                padding: 10px;
                text-align: center;
                position: absolute;
                top: 0;
                width: 100%;
            }
        </style>
        <div>
            <h2>My Filters</h2>
        </div>
        `;
    }
}

customElements.define('filters-component', Filters);