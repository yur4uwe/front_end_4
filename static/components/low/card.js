class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
    }

    async loadStyles() {
        const style = await fetch('/static/components/low/card.css');
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
        this.shadowRoot.innerHTML += `<div id="img-container"><img src="${photo}"></div>`;
    }
}

customElements.define('card-component', Card);