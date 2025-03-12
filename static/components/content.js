/**
 * @typedef {{id: number, name: string, price: number, description: string, photo: string}} Product
 */

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
            #header {
                display: flex;
                justify-content: center;
            }
            #content {
                display: grid;
                gap: 10px;
                grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
            }
            img {
                max-width: 200px;
                max-height: 200px;
                object-fit: contain;
                border-radius: 5px;
                border: 1px solid var(--text-color, black);
            }
        </style>
        <div id="header">
            <h2>My Content</h2>
            <slot></slot>
        </div>
        <div id="content"></div>
        `;
    }

    /**
     * 
     * @param {Product[]} products 
     */
    setProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement('card-component');

            const photo = document.createElement('img');
            photo.src = product.photo;

            productElement.appendChild(photo);

            const name = document.createElement('h3');
            name.textContent = product.name;

            productElement.appendChild(name);

            const priceElement = document.createElement('p');
            priceElement.textContent = product.price;

            productElement.appendChild(priceElement);

            const description = document.createElement('p');
            description.textContent = product.description;

            productElement.appendChild(description);

            this.shadowRoot.getElementById("content").appendChild(productElement);
        });
    }
}

customElements.define('content-component', Content); 