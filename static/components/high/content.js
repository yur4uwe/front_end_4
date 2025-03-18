
/**
 * @typedef {{id: number, name: string, price: number, description: string, photo: string}} Product
 */

import API from "../../api/requester.js";

class Content extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div id="content"></div>
        <nav id="pages"></nav>
        `;
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/content.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    connectedCallback() {
        this.navigateToPage(1, 1);
    }

    /**
     * 
     * @param {Product[]} products
     * @param {number} total_pages
     */
    setProducts(products, total_pages, currentPage = 1) {
        const contentDiv = this.shadowRoot.getElementById("content");
        contentDiv.innerHTML = "";

        localStorage.setItem("products", JSON.stringify(products));

        products.forEach(product => {
            const productElement = document.createElement('card-component');
            const productElementShadowRoot = productElement.shadowRoot;

            productElement.setImage(product.photo);

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
            });

            buttonContainer.appendChild(buyButton);

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = "Add to cart";
            addToCartButton.addEventListener('click', () => {
                console.log(`Adding ${product.name} to cart`);
            });

            buttonContainer.appendChild(addToCartButton);

            productElementShadowRoot.appendChild(infoContainer);

            productElementShadowRoot.appendChild(buttonContainer);

            contentDiv.appendChild(productElement);
        });

        const pagesBox = this.shadowRoot.getElementById("pages")
        if (!pagesBox) {
            console.error("Pages box not found");
            return;
        }
        pagesBox.innerHTML = "";
        const appendPageNav = (content, listener = null) => {
            const pageNav = document.createElement('button');
            pageNav.id = `page-${content}`;
            pageNav.classList.add("page-nav");
            pageNav.textContent = content;
            if (listener) {
                pageNav.addEventListener('click', listener);
            } else {
                pageNav.addEventListener('click', () => {
                    console.log(`Going to page ${content}`);
                    this.navigateToPage(content, total_pages);
                });
            }
            pagesBox.appendChild(pageNav);
        };
        appendPageNav("<<", () => {
            console.log("Going to first page");
            this.navigateToPage(1, total_pages);
        });
        appendPageNav("<", () => {
            console.log("Going to previous page");
            this.navigateToPage(currentPage - 1, total_pages);
        });
        for (let i = 0; i < total_pages && i <= 6; i++) {
            appendPageNav(i + 1);
        }
        appendPageNav(">", () => {
            console.log("Going to next page");
            this.navigateToPage(currentPage + 1, total_pages);
        });
        appendPageNav(">>", () => {
            console.log("Going to last page");
            this.navigateToPage(total_pages, total_pages);
        });
    }

    navigateToPage(page, total_pages) {
        console.log(`Navigating to page ${page}`);
        if (page < 1) {
            return;
        } else if (page > total_pages) {
            return;
        }

        API.requestBuilder()
            .method(API.Methods.GET)
            .url("/api/products")
            .q_params({ page: page })
            .send()
            .then(response => {
                if (response.status === "error") {
                    console.error(response.error);
                    return;
                }
                this.setProducts(response.data.products, response.data.pages, page);

                this.shadowRoot.querySelectorAll(".page-nav").forEach(nav => nav.classList.remove("active"));
                this.shadowRoot.getElementById(`page-${page}`).classList.add("active");
            });
    }

}

customElements.define('content-component', Content); 