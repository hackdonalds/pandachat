import { LitElement, html } from "../vendor/lit-element.min.js"
import "./x-webcam-permission.js"

class XWebCam extends LitElement {
    static get properties() {
        return { webCamAllowed: { type: Boolean } };
    }

    constructor() {
        super();
        this.webCamAllowed = true;

    }
    firstUpdated() {
        const video = this.shadowRoot.getElementById("video")
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then( (stream) => {
                    video.srcObject = stream;
                    this.webCamAllowed = true
                })
                .catch((err0r) => {
                    this.webCamAllowed = false
                });
        }

    }
    render() {
        return html`
        ${
            this.webCamAllowed ? html`<video id="video" autoplay playsinline></video>` : html`<x-web-cam-permission></x-web-cam-permission>`
        }
        
        `;
    }
}

customElements.define('x-web-cam', XWebCam);
