import { LitElement, html } from "../vendor/lit-element.min.js"
class XChannel extends LitElement {
    render() {
        return html`Channel ${JSON.stringify(this.location.params)}`
    }
}
customElements.define("x-channel", XChannel)