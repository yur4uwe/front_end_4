class Menu extends HTMLElement  {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                background-color: #333;
                color: white;
                padding: 10px;
                text-align: center;
            }
        </style>
        <header>
            <h1>My App</h1>
        </header>
        `;
    }
}

customElements.define('menu-component', Menu);