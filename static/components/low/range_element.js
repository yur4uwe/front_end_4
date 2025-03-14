
const min = (a, b) => a < b ? a : b;

class Range extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div id="track" class="range-track">
            <div id="thumb" class="range-thumb"></div>
            <div id="selected" class="selected-range"></div>
        </div>
        `;

        this.addEventListener('value-change', this.handleValueChange);
    }

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @param {number} value 
     */
    setAttributes(min, max, value) {
        this.min = min;
        this.max = max;
        this.value = value;



        this.changeSelectedWidthByValue();
    }

    async loadStyles() {
        const style = await fetch('/static/components/low/range_element.css');
        const styleText = await style.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = styleText;
        this.shadowRoot.appendChild(styleElement);
    }

    connectedCallback() {
        this.addEventListener('mousedown', this.handleMouseDown);
    }

    handleMouseDown(event) {
        this.addEventListener('mousemove', this.handleMouseMove);
        this.addEventListener('mouseup', this.handleMouseUp);
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    handleMouseMove(event) {
        const thumb = this.shadowRoot.getElementById('thumb');
        const selected = this.shadowRoot.getElementById('selected');
        const track = this.shadowRoot.getElementById('track');

        const thumbWidth = thumb.offsetWidth;
        const trackWidth = track.offsetWidth;

        const thumbPosition = event.clientX - this.getBoundingClientRect().left - thumbWidth / 2;
        //console.log(thumbPosition);
        const selectedWidth = min(thumbPosition, trackWidth);
        //console.log(min(selectedWidth, trackWidth));

        if (thumbPosition < thumbWidth / 2) {
            thumb.style.left = `${thumbWidth / 2}px`;
        } else if (thumbPosition > trackWidth - thumbWidth / 2) {
            thumb.style.left = `${trackWidth - thumbWidth / 2}px`;
        } else {
            thumb.style.left = `${thumbPosition}px`;
        }

        if (selectedWidth < thumbWidth / 2) {
            selected.style.width = `${thumbWidth}px`;
            selected.style.left = `${thumbWidth / 2 - 1}px`;
        } else if (selectedWidth > trackWidth - thumbWidth / 2) {
            selected.style.width = `${trackWidth - thumbWidth / 2}px`;
            selected.style.left = `${(trackWidth - thumbWidth / 2) / 2 - 1}px`;
        } else {
            selected.style.width = `${selectedWidth}px`;
            selected.style.left = `${selectedWidth / 2 - 1}px`;
        }

        const value = Math.round((selectedWidth / trackWidth) * this.max);

        if (value > this.max) {
            this.value = this.max;
        } else if (value < this.min) {
            this.value = this.min;
        } else {
            this.value = value;
        }

        if (this.dispatchEvent(new CustomEvent('input-change', { detail: this.value }))) {
            // console.log('input event dispatched');
        }
    }

    handleMouseUp(event) {
        //console.log('mouse up');
        this.removeEventListener('mousemove', this.handleMouseMove);
        this.removeEventListener('mouseup', this.handleMouseUp);
    }

    /**
     * 
     * @param {CustomEvent} event 
     */
    handleValueChange(event) {
        console.log('value change:', event.detail);
        this.value = event.detail;

        this.changeSelectedWidthByValue();
    }

    changeSelectedWidthByValue() {
        console.log(this.value, this.max);

        const thumb = this.shadowRoot.getElementById('thumb');
        const selected = this.shadowRoot.getElementById('selected');
        const track = this.shadowRoot.getElementById('track');

        const thumbWidth = thumb.offsetWidth ? thumb.offsetWidth : 20;
        const trackWidth = track.offsetWidth ? track.offsetWidth : 200;

        const selectedWidth = (this.value / this.max) * trackWidth;

        if (selectedWidth <= thumbWidth / 2) {
            selected.style.width = `${selectedWidth}px`;
            selected.style.left = `${selectedWidth / 2}px`;

            thumb.style.left = `${thumbWidth / 2}px`;
        } else if (selectedWidth >= trackWidth - thumbWidth / 2) {
            selected.style.width = `${trackWidth - thumbWidth / 2}px`;
            selected.style.left = `${(trackWidth - thumbWidth / 2) / 2}px`;

            thumb.style.left = `${trackWidth - thumbWidth / 2}px`;
        } else {
            selected.style.width = `${selectedWidth}px`;
            selected.style.left = `${selectedWidth / 2}px`;

            thumb.style.left = `${selectedWidth}px`;
        }
    }
}

customElements.define('range-input', Range);