class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML += `<h1>Buy Your Brainrot</h1>`;
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/header.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }
}

customElements.define('header-component', Header);