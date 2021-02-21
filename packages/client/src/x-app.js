import { LitElement, html, css } from "./lib/lit-element.bundle.js"
import { Store } from "./store/Store.js"
import { Router } from 'https://unpkg.com/@vaadin/router';
import "./components/x-channel.js"
import "./components/x-login-screen.js"

class XApp extends LitElement {
    static get properties() {
        return {
            username: { type: String, default: null }
        };
    }
    firstUpdated() {
        const outlet = this.shadowRoot.getElementById('wrapper-router');

        const router = new Router(outlet);
        router.setRoutes([
            { path: '/', component: 'x-login-screen' },
            { path: '/:channelName', component: 'x-channel' },
        ]);
    }
    connect() {
        console.log("Connecting", { Store })
    }
    static get styles() {
        return css`
        #wrapper-router{
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content:center;
        }`
    }
    render() {
        return html`
            <div id="wrapper-router"></div>
        `
    }
}

customElements.define('x-app', XApp);
