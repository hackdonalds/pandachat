import { LitElement, html, css } from "./lib/lit-element.bundle.js"
import { Store } from "./store/Store.js"
import mobx from "./lib/mobx.js"
class XApp extends LitElement {
    static get properties() {
        return {
            username: { type: String, default: null }
        };
    }
    firstUpdated() {
        mobx.autorun(() => {
            this.username = Store.username
        })

        this.shadowRoot.getElementById("username-input").addEventListener("blur", (event) => {
            const { target: { value } } = event
            Store.username = value
        })
        const connectButton = this.shadowRoot.getElementById("connect-button")
        connectButton.addEventListener("click", this.connect)
    }
    connect() {
        console.log("Connecting", { Store })
    }
    static get styles() {
        return css`
            #username-input {
                padding:10px;
                border: 1px solid #ddd;
                font-size: 14px;
            }
            #username-card {
                padding: 2px;
                border: 1px solid #ddd;
            }
            #username-card-wrapper {
                height: 100vh;
                display: flex;
                align-items: center;
            }
        `
    }
    render() {
        return html`
        ${!this.username ? html`<div id="username-card-wrapper">
            <div class="username-card">
                <input placeholder="Enter username" id="username-input" />
                <button id="connect-button">Connect</button>
            </div>
        </div>` : html`<x-web-cam></x-web-cam>`}
        `
    }
}

customElements.define('x-app', XApp);
