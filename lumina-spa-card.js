const LitElement = window.LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const html = LitElement.prototype.html || window.html;
const css = LitElement.prototype.css || window.css;

class LuminaSpaCard extends LitElement {

  static properties = {
    hass: {},
    config: {}
  };

  setConfig(config) {
    this.config = config;
  }

  render() {
    if (!this.hass) return html``;

    return html`
      <ha-card header="${this.config.card_title || "SPA"}">
        <div style="padding:16px">
          Lumina SPA Card OK
        </div>
      </ha-card>
    `;
  }
}

customElements.define("lumina-spa-card", LuminaSpaCard);
