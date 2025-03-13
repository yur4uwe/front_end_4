
/**
 * @typedef {{id: number, name: string, price: number, description: string, photo: string}} Product
 */

class Content extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div id="header">
            <h2>My Content</h2>
            <slot></slot>
        </div>
        <div id="content"></div>
        `;
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/content.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    /**
     * 
     * @param {Product[]} products 
     */
    setProducts(products) {
        const contentDiv = this.shadowRoot.getElementById("content");
        contentDiv.innerHTML = "";

        products.forEach(product => {
            const productElement = document.createElement('card-component');
            const productElementShadowRoot = productElement.shadowRoot;

            const photo = document.createElement('img');
            photo.src = product.photo;

            productElementShadowRoot.appendChild(photo);

            const name = document.createElement('h3');
            name.textContent = product.name;

            productElementShadowRoot.appendChild(name);

            const priceElement = document.createElement('p');
            priceElement.textContent = product.price;

            productElementShadowRoot.appendChild(priceElement);

            const description = document.createElement('p');
            description.textContent = product.description;

            productElementShadowRoot.appendChild(description);

            contentDiv.appendChild(productElement);
        });
    }
}

customElements.define('content-component', Content); 