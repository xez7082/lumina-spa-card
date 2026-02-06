import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

// --- L'ÉDITEUR DE CONFIGURATION (Interface visuelle) ---
class LuminaSpaEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }
  setConfig(config) { this._config = config; }
  configChanged(newConfig) {
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <paper-input label="Titre" .value="${this._config.card_title}" @value-changed="${e => this.configChanged({...this._config, card_title: e.detail.value})}"></paper-input>
        <paper-input label="Image (URL)" .value="${this._config.background_image}" @value-changed="${e => this.configChanged({...this._config, background_image: e.detail.value})}"></paper-input>
        
        <h3>Positions (en %)</h3>
        <div class="grid">
          <paper-input label="Temp X" type="number" .value="${this._config.pos_temp_x}" @value-changed="${e => this.configChanged({...this._config, pos_temp_x: e.detail.value})}"></paper-input>
          <paper-input label="Temp Y" type="number" .value="${this._config.pos_temp_y}" @value-changed="${e => this.configChanged({...this._config, pos_temp_y: e.detail.value})}"></paper-input>
        </div>
      </div>
    `;
  }
}
customElements.define("lumina-spa-card-editor", LuminaSpaEditor);

// --- LA CARTE PRINCIPALE ---
class LuminaSpaCard extends LitElement {
  static getConfigElement() { return document.createElement("lumina-spa-card-editor"); }
  static getStubConfig() { 
    return { 
      card_title: "MON SPA", 
      background_image: "/local/preview.png",
      pos_temp_x: 10, pos_temp_y: 20,
      pos_chem_x: 10, pos_chem_y: 50,
      pos_energy_x: 10, pos_energy_y: 80
    }; 
  }

  static get properties() {
    return { hass: { type: Object }, config: { type: Object } };
  }

  setConfig(config) { this.config = config; }

  _getDisplayState(entityId) {
    if (!this.hass || !this.hass.states[entityId]) return { state: '--', unit: '' };
    const stateObj = this.hass.states[entityId];
    return { state: stateObj.state, unit: stateObj.attributes.unit_of_measurement || '' };
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const water = this._getDisplayState(this.config.entity_water_temp);
    const ph = this._getDisplayState(this.config.entity_ph);
    const orp = this._getDisplayState(this.config.entity_orp);
    const power = this._getDisplayState(this.config.entity_power);

    return html`
      <ha-card style="background-image: url('${this.config.background_image}');">
        <div class="header">${this.config.card_title}</div>

        <div class="glass-block" style="left: ${this.config.pos_temp_x}%; top: ${this.config.pos_temp_y}%;">
          <div class="block-title">TEMPÉRATURE</div>
          <div class="row"><ha-icon icon="mdi:thermometer"></ha-icon><span class="val">${water.state}${water.unit}</span></div>
        </div>

        <div class="glass-block" style="left: ${this.config.pos_chem_x}%; top: ${this.config.pos_chem_y}%;">
          <div class="block-title">CHIMIE SPA</div>
          <div class="row">
            <ha-icon icon="mdi:ph"></ha-icon><span class="val">${ph.state}</span>
            <ha-icon icon="mdi:test-tube" style="margin-left:8px"></ha-icon><span class="val">${orp.state}</span>
          </div>
        </div>

        <div class="glass-block" style="left: ${this.config.pos_energy_x}%; top: ${this.config.pos_energy_y}%;">
          <div class="block-title">ÉNERGIE</div>
          <div class="row"><ha-icon icon="mdi:lightning-bolt"></ha-icon><span class="val">${power.state}${power.unit}</span></div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card { background-size: cover; background-position: center; height: 500px; position: relative; color: white; border-radius: 20px; overflow: hidden; }
      .header { position: absolute; top: 20px; left: 20px; font-weight: 800; font-size: 1.2em; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
      .glass-block { position: absolute; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.1); }
      .block-title { font-size: 9px; font-weight: 900; color: #00d4ff; margin-bottom: 4px; }
      .row { display: flex; align-items: center; gap: 5px; }
      .val { font-size: 15px; font-weight: bold; }
    `;
  }
}
customElements.define("lumina-spa-card", LuminaSpaCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lumina-spa-card",
  name: "Lumina SPA Card",
  preview: true,
  description: "Carte SPA avec positionnement libre"
});
