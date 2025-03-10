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
}

customElements.define('filters-component', Filters);