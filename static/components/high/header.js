import API from '../../api/requester.js';

class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML += `
        <div id="main-header">
            <h1>Buy Your Brainrot</h1>
            <nav>
                <a href="/home"><img src="/static/img/home.png"></a>
                <a href="/cart"><img src="/static/img/cart.png"></a>
            </nav>    
        </div>
        <div id="img-header"><img src="/photos/header_2.png"></div>
        `;
    }

    async loadStyles() {
        const style = await fetch('/static/components/high/header.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }
}

customElements.define('header-component', Header);