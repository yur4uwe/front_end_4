
/**
 * @typedef {{id: number, name: string, price: number, description: string, photo: string}} Product
 */

class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div id="img-container"></div>
        <div id="info-container"></div>
        <div id="button-container"></div>
        `;

        this.addEventListener("click", () => {
            console.log("clicked");
            const dest = document.getElementById("modal");

            const modal = document.createElement('modal-window');

            modal.setProduct(this.product);

            dest.appendChild(modal);
            dest.classList.add("show");
        });
    }

    async loadStyles() {
        if (!Card.styleContent) {
            const style = await fetch('/static/components/low/card.css');
            Card.styleContent = await style.text();
        }

        const styleElement = document.createElement('style');
        styleElement.textContent = Card.styleContent;
        this.shadowRoot.appendChild(styleElement);
    }

    /**
     * 
     * @param {Product} product 
     */
    setProduct(product) {
        this.product = product;

        this.setImage("/photos/" + product.photo);

        const infoContainer = this.shadowRoot.getElementById('info-container');

        const name = document.createElement('h3');
        name.textContent = product.name;

        infoContainer.appendChild(name);

        const priceElement = document.createElement('p');
        priceElement.textContent = product.price + "$";

        infoContainer.appendChild(priceElement);

        const buttonContainer = this.shadowRoot.getElementById('button-container');

        const buyButton = document.createElement('button');
        buyButton.textContent = "Buy";
        buyButton.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log(`Buying ${product.name}`);
            document.dispatchEvent(new CustomEvent('buy', { detail: product }));
        });

        buttonContainer.appendChild(buyButton);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = "Add to cart";
        addToCartButton.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log(`Adding ${product.name} to cart`);

            const itemsInCart = localStorage.getItem("cart");
            if (itemsInCart) {
                /**
                 * @type {number[]} cart
                 */
                const cart = JSON.parse(itemsInCart);

                let productAlreadyInCart = false;
                for (const item of cart) {
                    if (item.id === product.id) {
                        productAlreadyInCart = true;
                        break;
                    }
                }

                if (productAlreadyInCart) {
                    console.log("Product already in cart");
                    return;
                } else {
                    cart.push({id: product.id, name: product.name});
                }

                localStorage.setItem("cart", JSON.stringify(cart));
            } else {
                localStorage.setItem("cart", JSON.stringify([{id: product.id, name: product.name}]));
            }

            document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
        });

        buttonContainer.appendChild(addToCartButton);
    }

    /**
     * 
     * @param {string} photo 
     */
    setImage(photo) {
        this.shadowRoot.getElementById("img-container").innerHTML = `<img src="${photo}">`;
    }
}

customElements.define('card-component', Card);