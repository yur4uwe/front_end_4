class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                color: white;
                padding: 10px;
                text-align: center;
                width: calc(100% - 20px);
                height: var(--header-height);
                background-color: linear-gradient(90deg, var(--pr-color), var(--sc-color));
                position: absolute;
                top: 0;
                left 0;
            }
            h1 {
                margin: 0;
                font-family: var(--font-style);
                color: var(--text-color, white);
            }
        </style>
        <h1>My App</h1>
        `;
    }
}

customElements.define('header-component', Header);