
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
        <div id="content"><div id="loading-spinner"></div></div>
        <nav id="pages"></nav>
        `;

        document.addEventListener('filters-applied', (e) => this.navigateToPage(1, 1, e.detail));

        window.addEventListener('resize', () => {
            const currentPage = parseInt(this.shadowRoot.querySelector(".page-nav.active").textContent);
            this.navigateToPage(currentPage, 1, false);
        });
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/content.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    // connectedCallback() {
    //     this.navigateToPage(1, 1, false);
    // }

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

            productElement.setProduct(product);

            

            contentDiv.appendChild(productElement);
        });


        this.appendPageNavButtons(total_pages, currentPage);
    }

    appendPageNavButtons(total_pages, currentPage = 1) {
        const pagesBox = this.shadowRoot.getElementById("pages")
        if (!pagesBox) {
            console.error("Pages box not found");
            return;
        }
        pagesBox.innerHTML = "";

        if (total_pages <= 1) {
            return;
        }

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
        for (let i = 0; i < total_pages; i++) {
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

    navigateToPage(page, total_pages, applyFilters = true) {
        const spinner = this.shadowRoot.getElementById('content').querySelector("#loading-spinner");
        if (spinner) {
            this.shadowRoot.getElementById('content').removeChild(spinner);
        }

        console.log(`Navigating to page ${page}`);
        if (page < 1) {
            console.log(`Page ${page} is out of bounds`);
            
            return;
        } else if (page > total_pages) {
            console.log(`Page ${page} is out of bounds`);
            
            return;
        }

        const filters = JSON.parse(localStorage.getItem("filters"));
        if (!filters || Object.keys(filters).length === 0) {
            applyFilters = false;
        }
        
        const contentWidth = this.shadowRoot.getElementById("content").clientWidth;
        const columnsNum = Math.floor(contentWidth / 210);
        console.log(`Columns: ${columnsNum}`);

        API.requestBuilder()
            .method(API.Methods.PUT)
            .url("/api/products")
            .q_params({ page: page, page_len: 5 * columnsNum, apply_filters: applyFilters })
            .body(JSON.parse(localStorage.getItem("filters")))
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