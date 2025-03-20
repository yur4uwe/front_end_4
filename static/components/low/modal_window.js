

class ModalWindow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <main>
        <div id="modal-window-controls">
            <button id="close">X</button>
        </div>
        <div id="modal-window-flex-content">
            <div id="modal-window-content">
            </div>
        </div>
        </main>
        `;

        this.shadowRoot.getElementById('close').addEventListener('click', () => {
            document.getElementById('modal').classList.remove('show');
            document.getElementById('modal').innerHTML = "";
        });
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

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = "Add to cart";
        addToCartButton.addEventListener('click', () => {
            /**
             * @type {number[]} cart
             */
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (cart.includes(product)) {
                console.log('Product already in cart');
                return;
            } else {
                cart.push(product);
            }
                
            localStorage.setItem('cart', JSON.stringify(cart));
            document.dispatchEvent(new Event('add-to-cart'));
        });

        buttonContainer.appendChild(addToCartButton);

        infoContainer.appendChild(buttonContainer);

        this.shadowRoot.getElementById("modal-window-content").appendChild(infoContainer);
    }

    async loadStyles() {
        const style = await fetch('/static/components/low/modal_window.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    /**
     * 
     * @param {string} photo 
     */
    setImage(photo) {
        const container = this.shadowRoot.getElementById("modal-window-content");
        container.innerHTML += `<div id="img-container"><img src="${photo}"></div>`;
    }
}

customElements.define('modal-window', ModalWindow);