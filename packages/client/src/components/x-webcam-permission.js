import { LitElement, html } from "../vendor/lit-element.min.js"


class XWebCamPermission extends LitElement {
    render() {
        return html`
        Please allow your browser to access your webcam !
        `;
    }
}

customElements.define('x-web-cam-permission', XWebCamPermission);
