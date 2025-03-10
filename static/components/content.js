class Content extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                padding: 10px;
                text-align: center;
                color: var(--text-color, black);
                border-radius: 10px;
                border: 2px solid var(--text-color, black);
            }
        </style>
        <div>
            <h2>My Content</h2>
            <slot></slot>
        </div>
        `;
    }
}

customElements.define('content-component', Content); 