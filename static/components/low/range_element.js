const min = (a, b) => a < b ? a : b;
const max = (a, b) => a > b ? a : b;

class Range extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadStyles();
        this.shadowRoot.innerHTML = `
        <div id="track" class="range-track">
            <div id="thumb-min" class="range-thumb"></div>
            <div id="thumb-max" class="range-thumb"></div>
            <div id="selected" class="selected-range"></div>
        </div>
        `;

        this.addEventListener('min-value-change', this.handleValueChange.bind(this));
        this.addEventListener('max-value-change', this.handleValueChange.bind(this));
    }

    /**
     * @param {number} min 
     * @param {number} max 
     * @param {number} minValue 
     * @param {number} maxValue 
     */
    setAttributes(min, max, minValue, maxValue) {
        this.min = min;
        this.max = max;
        this.minValue = Math.max(min, Math.min(minValue, max));
        this.maxValue = Math.min(max, Math.max(maxValue, this.minValue));
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
        const thumbMin = this.shadowRoot.getElementById('thumb-min');
        const thumbMax = this.shadowRoot.getElementById('thumb-max');
        thumbMin.addEventListener('mousedown', this.handleMouseDown.bind(this));
        thumbMax.addEventListener('mousedown', this.handleMouseDown.bind(this));
    }

    handleMouseDown(event) {
        this.currentThumb = event.target;
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseMove(event) {
        const thumb = this.currentThumb;
        if (!thumb) return;

        const isLeftThumb = thumb.id === 'thumb-min';
        const track = this.shadowRoot.getElementById('track');
        const trackRect = track.getBoundingClientRect();
        const thumbWidth = thumb.offsetWidth;
        const trackWidth = trackRect.width;
        const trackLeft = trackRect.left;

        let newPosition = event.clientX - trackLeft - thumbWidth / 2;
        newPosition = max(newPosition, 0);
        newPosition = min(newPosition, trackWidth - thumbWidth);

        if (isLeftThumb) {
            const thumbMaxPos = this.shadowRoot.getElementById('thumb-max').offsetLeft;
            newPosition = min(newPosition, thumbMaxPos - thumbWidth);
        } else {
            const thumbMinPos = this.shadowRoot.getElementById('thumb-min').offsetLeft;
            newPosition = max(newPosition, thumbMinPos + thumbWidth);
        }

        thumb.style.left = `${newPosition}px`;
        this.updateSelectedRange();
        this.updateValuesFromPosition();
    }

    updateSelectedRange() {
        const thumbMin = this.shadowRoot.getElementById('thumb-min');
        const thumbMax = this.shadowRoot.getElementById('thumb-max');
        const selected = this.shadowRoot.getElementById('selected');
        const trackWidth = this.shadowRoot.getElementById('track').offsetWidth;
        const thumbWidth = thumbMin.offsetWidth;

        const selectedMin = thumbMin.offsetLeft + thumbWidth / 2;
        const selectedMax = thumbMax.offsetLeft + thumbWidth / 2;
        selected.style.left = `${selectedMin}px`;
        selected.style.width = `${selectedMax - selectedMin}px`;
    }

    updateValuesFromPosition() {
        const track = this.shadowRoot.getElementById('track');
        const trackWidth = track.offsetWidth;
        const thumbMin = this.shadowRoot.getElementById('thumb-min');
        const thumbMax = this.shadowRoot.getElementById('thumb-max');

        const minPosition = thumbMin.offsetLeft + thumbMin.offsetWidth / 2;
        const maxPosition = thumbMax.offsetLeft + thumbMax.offsetWidth / 2;

        this.minValue = Math.round((minPosition / trackWidth) * (this.max - this.min) + this.min);
        this.maxValue = Math.round((maxPosition / trackWidth) * (this.max - this.min) + this.min);

        this.dispatchEvent(new CustomEvent('input-change', {
            detail: { minValue: this.minValue, maxValue: this.maxValue }
        }));
    }

    handleMouseUp() {
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        this.currentThumb = null;
    }

    handleValueChange(event) {
        if (event.type === 'min-value-change') {
            const newMin = Number(event.detail.minValue);
            this.minValue = Math.max(this.min, Math.min(newMin, this.maxValue));
            this.maxValue = Math.max(this.maxValue, this.minValue);
        } else if (event.type === 'max-value-change') {
            const newMax = Number(event.detail.maxValue);
            this.maxValue = Math.min(this.max, Math.max(newMax, this.minValue));
            this.minValue = Math.min(this.minValue, this.maxValue);
        }
        this.changeSelectedWidthByValue();
    }

    changeSelectedWidthByValue() {
        const track = this.shadowRoot.getElementById('track');
        const trackWidth = track.offsetWidth;
        if (trackWidth === 0 || this.max === this.min) return;

        const thumbMin = this.shadowRoot.getElementById('thumb-min');
        const thumbMax = this.shadowRoot.getElementById('thumb-max');
        const thumbWidth = thumbMin.offsetWidth;

        const minPosition = ((this.minValue - this.min) / (this.max - this.min)) * (trackWidth - thumbWidth);
        const maxPosition = ((this.maxValue - this.min) / (this.max - this.min)) * (trackWidth - thumbWidth);

        thumbMin.style.left = `${minPosition}px`;
        thumbMax.style.left = `${maxPosition}px`;
        this.updateSelectedRange();
    }
}

customElements.define('range-input', Range);