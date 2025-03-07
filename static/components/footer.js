class Footer extends HTMLElement  {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                color: white;
                padding: 10px;
                text-align: center;
                position: fixed;
                bottom: 0;
                left: 0;
                width: calc(100% - 20px);
                height: var(--footer-height, 100px);
            }
            h2 {
                margin: 0;
                font-size: 1.2em;
                color: var(--text-color, white);
                font-family: var(--font-style);
            }
        </style>
        <h2>My Footer</h2>
        `;
    }
}

customElements.define('footer-component', Footer);