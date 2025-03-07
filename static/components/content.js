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
                position: absolute;
                top: 50px;
                left: 0;
                right: 0;
                bottom: 0;
            }
        </style>
        <div>
            <slot></slot>
        </div>
        `;
    }
}

customElements.define('content-component', Content); 