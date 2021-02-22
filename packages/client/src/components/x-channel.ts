import { LitElement, html } from "lit-element"
class XChannel extends LitElement {
    render() {
        return html`Channel ${JSON.stringify(this.location.params)}`
    }
}
customElements.define("x-channel", XChannel)