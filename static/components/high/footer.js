class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <h2>My Footer</h2>
        `;
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/footer.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }
}

customElements.define('footer-component', Footer);