class Store extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div class="store-container">
            <filters-component id="filter"></filters-component>
            <content-component id="content"></content-component>
        </div>
        `;
    }

    async loadStyles() {
        const style = await fetch('/static/pages/store.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    loadProducts() {
        const content = this.shadowRoot.getElementById('content');
        
        content.navigateToPage(1, -1, false);   
    }
}

customElements.define('store-page', Store);