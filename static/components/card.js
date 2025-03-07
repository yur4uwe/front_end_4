class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                background-color: white;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                color: var(--text-color, black);
                margin: 10px;
                padding: 10px;
                text-align: center;
            }
        </style>
        <slot></slot>
        `;
    }
}

customElements.define('card-component', Card);