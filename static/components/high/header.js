class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //this.loadStyles();
        this.shadowRoot.innerHTML += `
        <div id="main-header">
            <h1>Buy Your Brainrot</h1>
            <nav>
                <a href="/home"><img src="/static/img/home.png"></a>
                <a href="/cart">
                    <img src="/static/img/cart.png">
                    <div id="items-in-cart">0</div>
                </a>
            </nav>    
        </div>
        <div id="img-header"><img src="/photos/header_2.png"></div>
        `;

        const cart = localStorage.getItem("cart");
        if (!cart) {
            localStorage.setItem("cart", JSON.stringify([]));
        }

        this.checkItemsInCart();

        document.addEventListener("add-to-cart", this.checkItemsInCart.bind(this));
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/header.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    checkItemsInCart() {
        const itemsInCart = JSON.parse(localStorage.getItem("cart"));
        const numOfItems = itemsInCart ? itemsInCart.length : 0;

        if (numOfItems > 0) {
            this.shadowRoot.getElementById("items-in-cart").style.display = "flex";
        }

        this.shadowRoot.getElementById("items-in-cart").textContent = numOfItems
    }
}

customElements.define('header-component', Header);