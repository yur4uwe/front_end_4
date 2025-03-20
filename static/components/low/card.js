
/**
 * @typedef {{id: number, name: string, price: number, description: string, photo: string}} Product
 */

class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();

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

        this.setImage("/photos/"+product.photo);

        const infoContainer = document.createElement('div');
            infoContainer.id = "info-container";

            const name = document.createElement('h3');
            name.textContent = product.name;

            infoContainer.appendChild(name);

            const priceElement = document.createElement('p');
            priceElement.textContent = product.price + "$";

            infoContainer.appendChild(priceElement);

            const buttonContainer = document.createElement('div');
            buttonContainer.id = "button-container";

            const buyButton = document.createElement('button');
            buyButton.textContent = "Buy";
            buyButton.addEventListener('click', () => {
                console.log(`Buying ${product.name}`);
                document.dispatchEvent(new CustomEvent('buy', { detail: product }));
            });

            buttonContainer.appendChild(buyButton);

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = "Add to cart";
            addToCartButton.addEventListener('click', () => {
                console.log(`Adding ${product.name} to cart`);

                const itemsInCart = localStorage.getItem("cart");
                if (itemsInCart) {
                    /**
                     * @type {number[]} cart
                     */
                    const cart = JSON.parse(itemsInCart);
                    if (cart.includes(product.id)) {
                        console.log("Product already in cart");
                        return;
                    } else {
                        cart.push(product.id);
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));
                } else {
                    localStorage.setItem("cart", JSON.stringify([product.id]));
                }

                document.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
            });

            buttonContainer.appendChild(addToCartButton);

            this.shadowRoot.appendChild(infoContainer);

            this.shadowRoot.appendChild(buttonContainer);
    }

    /**
     * 
     * @param {string} photo 
     */
    setImage(photo) {
        
        this.shadowRoot.innerHTML += `<div id="img-container"><img src="${photo}"></div>`;
    }
}

customElements.define('card-component', Card);