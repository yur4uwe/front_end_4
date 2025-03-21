

class ModalWindow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //this.loadStyles();
        this.shadowRoot.innerHTML = `
        <main>
        <div id="modal-window-flex-content">
            <div id="modal-window-content">
                <div id="modal-window-controls">
                    <button id="close-btn">X</button>
                </div>
            </div>
        </div>
        </main>
        `;

        const btn = this.shadowRoot.getElementById('close-btn');
        console.log('Close button found:', btn);

        btn.addEventListener('click', () => {
            const modal = document.getElementById('modal');
            if (modal) {
                modal.classList.remove('show');
                modal.innerHTML = "";
            }
        });

        this.modalContent = this.shadowRoot.getElementById('modal-window-content');

        console.log("button event listener added");
    }

    /**
     * 
     * @param {Product} product 
     */
    setProduct(product) {
        this.product = product;

        this.setImage("/photos/" + product.photo);

        const infoContainer = document.createElement('div');
        infoContainer.id = "info-container";

        const name = document.createElement('h3');
        name.textContent = product.name;

        infoContainer.appendChild(name);

        const priceElement = document.createElement('p');
        priceElement.textContent = product.price + "$";

        infoContainer.appendChild(priceElement);

        const description = document.createElement('p');
        description.textContent = product.description;

        infoContainer.appendChild(description);

        const buttonContainer = document.createElement('div');
        buttonContainer.id = "button-container";

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = "Add to cart";
        addToCartButton.addEventListener('click', () => {
            /**
             * @type {number[]} cart
             */
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (cart.includes(product.id)) {
                console.log('Product already in cart');
                return;
            } else {
                cart.push(product.id);
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
        // Use proper DOM manipulation instead of innerHTML
        const imgContainer = document.createElement('div');
        imgContainer.id = "img-container";
        imgContainer.innerHTML = `<img src="${photo}">`;

        // Insert image before controls
        this.modalContent.appendChild(imgContainer);
    }
}

customElements.define('modal-window', ModalWindow);