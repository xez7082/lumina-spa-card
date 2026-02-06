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
    this.config = {
      card_title: 'MON SPA',
      background_image: '/local/preview.png',
      ...config
    };
  }

  // Utilitaire pour récupérer l'état réel de HA
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
    const air = this._getDisplayState(this.config.entity_air_temp);
    const ph = this._getDisplayState(this.config.entity_ph);
    const orp = this._getDisplayState(this.config.entity_orp);
    const power = this._getDisplayState(this.config.entity_power);

    return html`
      <ha-card style="background-image: url('${this.config.background_image}')">
        <div class="overlay">
          <div class="header">${this.config.card_title}</div>
          
          <div class="main-container">
            <div class="data-column">
              
              <div class="glass-block">
                <div class="block-title">TEMPÉRATURE</div>
                <div class="row">
                  <div class="item">
                    <ha-icon icon="mdi:thermometer"></ha-icon>
                    <div class="info"><span class="val">${water.state}${water.unit}</span></div>
                  </div>
                </div>
              </div>

              <div class="glass-block">
                <div class="block-title">CHIMIE SPA</div>
                <div class="row">
                  <div class="item">
                    <ha-icon icon="mdi:ph"></ha-icon>
                    <div class="info"><span class="val">${ph.state}</span></div>
                  </div>
                  <div class="item">
                    <ha-icon icon="mdi:test-tube"></ha-icon>
                    <div class="info"><span class="val">${orp.state} ${orp.unit || 'mV'}</span></div>
                  </div>
                </div>
              </div>

              <div class="glass-block">
                <div class="block-title">ÉNERGIE</div>
                <div class="row">
                  <div class="item">
                    <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                    <div class="info"><span class="val">${power.state}${power.unit}</span></div>
                  </div>
                </div>
              </div>

            </div>
            
            <div class="spa-column">
              </div>
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
        border-radius: 24px;
        color: white;
        overflow: hidden;
        position: relative;
        min-height: 280px;
        border: none;
      }
      .overlay {
        background: rgba(0, 0, 0, 0.2);
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .header {
        font-weight: 800;
        font-size: 1.1em;
        margin-bottom: 15px;
        letter-spacing: 2px;
      }
      .main-container {
        display: flex;
        height: 100%;
      }
      .data-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .spa-column { flex: 1; }
      .glass-block {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border-radius: 12px;
        padding: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: fit-content;
        min-width: 120px;
      }
      .block-title {
        font-size: 9px;
        font-weight: 900;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      .row { display: flex; align-items: center; gap: 15px; }
      .item { display: flex; align-items: center; gap: 8px; }
      .val { font-size: 14px; font-weight: bold; }
      ha-icon { --mdc-icon-size: 18px; color: #00d4ff; }
    `;
  }
}

customElements.define("lumina-spa-card", LuminaSpaCard);
