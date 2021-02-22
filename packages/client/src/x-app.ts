import { LitElement, html, css } from "lit-element"
import { Store } from "./store/Store"
import { Router } from '@vaadin/router';
import "./components/x-channel"
import "./components/x-login-screen"

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
