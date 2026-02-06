import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class LuminaSpaCard extends LitElement {
  
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object }
    };
  }

  setConfig(config) {
    this.config = config;
  }

  _getDisplayState(entityId) {
    if (!this.hass || !this.hass.states[entityId]) return { state: '--', unit: '' };
    const stateObj = this.hass.states[entityId];
    return {
      state: stateObj.state,
      unit: stateObj.attributes.unit_of_measurement || ''
    };
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const water = this._getDisplayState(this.config.entity_water_temp);
    const ph = this._getDisplayState(this.config.entity_ph);
    const orp = this._getDisplayState(this.config.entity_orp);
    const power = this._getDisplayState(this.config.entity_power);

    return html`
      <ha-card style="background-image: url('${this.config.background_image}');">
        <div class="header">${this.config.card_title || 'MON SPA'}</div>

        <div class="glass-block" style="left: ${this.config.pos_temp_x || '10%'}; top: ${this.config.pos_temp_y || '20%'};">
          <div class="block-title">TEMPÉRATURE</div>
          <div class="row">
            <ha-icon icon="mdi:thermometer"></ha-icon>
            <span class="val">${water.state}${water.unit}</span>
          </div>
        </div>

        <div class="glass-block" style="left: ${this.config.pos_chem_x || '10%'}; top: ${this.config.pos_chem_y || '45%'};">
          <div class="block-title">CHIMIE SPA</div>
          <div class="row">
            <ha-icon icon="mdi:ph"></ha-icon><span class="val">${ph.state}</span>
            <ha-icon icon="mdi:test-tube" style="margin-left:8px"></ha-icon><span class="val">${orp.state}</span>
          </div>
        </div>

        <div class="glass-block" style="left: ${this.config.pos_energy_x || '10%'}; top: ${this.config.pos_energy_y || '70%'};">
          <div class="block-title">ÉNERGIE</div>
          <div class="row">
            <ha-icon icon="mdi:lightning-bolt"></ha-icon>
            <span class="val">${power.state}${power.unit}</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        background-size: cover;
        background-position: center;
        border-radius: 20px;
        height: 500px; /* Hauteur fixe pour faciliter le placement */
        position: relative;
        color: white;
        overflow: hidden;
      }
      .header {
        position: absolute;
        top: 20px;
        left: 20px;
        font-weight: 800;
        font-size: 1.2em;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .glass-block {
        position: absolute; /* Permet le placement libre */
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 10px 15px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        min-width: 100px;
      }
      .block-title {
        font-size: 9px;
        font-weight: 900;
        color: rgba(0, 212, 255, 0.9);
        margin-bottom: 4px;
      }
      .row { display: flex; align-items: center; gap: 5px; }
      .val { font-size: 15px; font-weight: bold; }
      ha-icon { --mdc-icon-size: 18px; color: white; }
    `;
  }
}
customElements.define("lumina-spa-card", LuminaSpaCard);
