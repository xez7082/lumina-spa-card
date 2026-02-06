import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

// --- EDITEUR ---
class LuminaSpaEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }
  setConfig(config) { this._config = config; }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const event = new CustomEvent("config-changed", {
      detail: { config: ev.detail.value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const schema = [
      { name: "card_title", label: "Titre", selector: { text: {} } },
      { name: "background_image", label: "Image (/local/sparond.png)", selector: { text: {} } },
      {
        name: "visibility",
        type: "grid",
        title: "Afficher les blocs",
        schema: [
          { name: "show_temp", label: "Voir Température", selector: { boolean: {} } },
          { name: "show_chem", label: "Voir Chimie", selector: { boolean: {} } },
          { name: "show_energy", label: "Voir Énergie", selector: { boolean: {} } },
          { name: "show_btns", label: "Voir Boutons", selector: { boolean: {} } },
        ]
      },
      {
        name: "entities",
        type: "grid",
        schema: [
          { name: "entity_water_temp", label: "Capteur Température", selector: { entity: { domain: "sensor" } } },
          { name: "entity_ph", label: "Capteur pH", selector: { entity: { domain: "sensor" } } },
          { name: "entity_orp", label: "Capteur ORP", selector: { entity: { domain: "sensor" } } },
          { name: "entity_power", label: "Capteur Puissance", selector: { entity: { domain: "sensor" } } },
        ]
      },
      {
        name: "controls",
        type: "grid",
        schema: [
          { name: "switch_bubbles", label: "Commande Bulles", selector: { entity: { domain: ["switch", "light", "input_boolean"] } } },
          { name: "switch_filter", label: "Commande Filtration", selector: { entity: { domain: ["switch", "light", "input_boolean"] } } },
          { name: "switch_light", label: "Commande Lumière", selector: { entity: { domain: ["switch", "light", "input_boolean"] } } },
        ]
      },
      {
        name: "positions",
        type: "expandable",
        title: "Positions des éléments",
        schema: [
          { name: "pos_temp_x", label: "Temp X", selector: { number: { min: 0, max: 100, mode: "slider" } } },
          { name: "pos_temp_y", label: "Temp Y", selector: { number: { min: 0, max: 100, mode: "slider" } } },
          { name: "pos_chem_x", label: "Chimie X", selector: { number: { min: 0, max: 100, mode: "slider" } } },
          { name: "pos_chem_y", label: "Chimie Y", selector: { number: { min: 0, max: 100, mode: "slider" } } },
          { name: "pos_energy_x", label: "Energie X", selector: { number: { min: 0, max: 100, mode: "slider" } } },
          { name: "pos_energy_y", label: "Energie Y", selector: { number: { min: 0, max: 100, mode: "slider" } } },
          { name: "pos_btn_x", label: "Boutons X", selector: { number: { min: 0, max: 100, mode: "slider" } } },
          { name: "pos_btn_y", label: "Boutons Y", selector: { number: { min: 0, max: 100, mode: "slider" } } },
        ]
      }
    ];

    return html`<ha-form .hass=${this.hass} .data=${this._config} .schema=${schema} @value-changed=${this._valueChanged}></ha-form>`;
  }
}

// --- CARTE ---
class LuminaSpaCard extends LitElement {
  static getConfigElement() { return document.createElement("lumina-spa-card-editor"); }
  static get properties() { return { hass: {}, config: {} }; }
  
  setConfig(config) { 
    this.config = {
      show_temp: true,
      show_chem: true,
      show_energy: true,
      show_btns: true,
      ...config 
    }; 
  }

  _toggle(entityId) {
    if (!entityId) return;
    this.hass.callService("homeassistant", "toggle", { entity_id: entityId });
  }

  _getState(entityId) {
    if (!this.hass || !entityId || !this.hass.states[entityId]) return { s: '--', u: '', active: false };
    const obj = this.hass.states[entityId];
    return { s: obj.state, u: obj.attributes.unit_of_measurement || '', active: obj.state === 'on' };
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const water = this._getState(this.config.entity_water_temp);
    const ph = this._getState(this.config.entity_ph);
    const orp = this._getState(this.config.entity_orp);
    const power = this._getState(this.config.entity_power);
    
    const bubbles = this._getState(this.config.switch_bubbles);
    const filter = this._getState(this.config.switch_filter);
    const light = this._getState(this.config.switch_light);

    return html`
      <ha-card style="background-image: url('${this.config.background_image || '/local/sparond.png'}');">
        <div class="header">${this.config.card_title || 'MON SPA'}</div>

        ${this.config.show_temp ? html`
        <div class="glass-block" style="left: ${this.config.pos_temp_x || 10}%; top: ${this.config.pos_temp_y || 15}%;">
          <div class="block-title">TEMPÉRATURE</div>
          <div class="row"><ha-icon icon="mdi:thermometer"></ha-icon><span class="val">${water.s}${water.u}</span></div>
        </div>` : ''}

        ${this.config.show_chem ? html`
        <div class="glass-block" style="left: ${this.config.pos_chem_x || 10}%; top: ${this.config.pos_chem_y || 40}%;">
          <div class="block-title">CHIMIE SPA</div>
          <div class="row">
            <ha-icon icon="mdi:ph"></ha-icon><span class="val">${ph.s}</span>
            <ha-icon icon="mdi:test-tube" style="margin-left:5px"></ha-icon><span class="val">${orp.s}</span>
          </div>
        </div>` : ''}

        ${this.config.show_energy ? html`
        <div class="glass-block" style="left: ${this.config.pos_energy_x || 10}%; top: ${this.config.pos_energy_y || 65}%;">
          <div class="block-title">ÉNERGIE</div>
          <div class="row"><ha-icon icon="mdi:lightning-bolt"></ha-icon><span class="val">${power.s}${power.u}</span></div>
        </div>` : ''}

        ${this.config.show_btns ? html`
        <div class="button-group" style="left: ${this.config.pos_btn_x || 70}%; top: ${this.config.pos_btn_y || 80}%;">
          <div class="btn ${bubbles.active ? 'active' : ''}" @click=${() => this._toggle(this.config.switch_bubbles)}>
            <ha-icon icon="mdi:airbubble"></ha-icon>
          </div>
          <div class="btn ${filter.active ? 'active' : ''}" @click=${() => this._toggle(this.config.switch_filter)}>
            <ha-icon icon="mdi:hydro-power"></ha-icon>
          </div>
          <div class="btn ${light.active ? 'active' : ''}" @click=${() => this._toggle(this.config.switch_light)}>
            <ha-icon icon="mdi:lightbulb"></ha-icon>
          </div>
        </div>` : ''}
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card { background-size: cover; background-position: center; height: 500px; position: relative; color: white; border-radius: 20px; overflow: hidden; border: none; }
      .header { position: absolute; top: 20px; left: 20px; font-weight: 800; font-size: 1.2em; text-transform: uppercase; text-shadow: 2px 2px 4px black; }
      .glass-block { position: absolute; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 10px; padding: 10px; border: 1px solid rgba(255, 255, 255, 0.1); }
      .block-title { font-size: 9px; font-weight: 900; color: #00d4ff; margin-bottom: 2px; }
      .row { display: flex; align-items: center; gap: 5px; }
      .val { font-size: 14px; font-weight: bold; }
      
      .button-group { position: absolute; display: flex; gap: 10px; }
      .btn { 
        background: rgba(0, 0, 0, 0.5); border-radius: 50%; width: 45px; height: 45px; 
        display: flex; align-items: center; justify-content: center; cursor: pointer; 
        border: 1px solid rgba(255, 255, 255, 0.2); transition: 0.3s;
      }
      .btn.active { background: #00d4ff; color: white; box-shadow: 0 0 15px #00d4ff; border: none; }
      ha-icon { --mdc-icon-size: 20px; }
    `;
  }
}

customElements.define("lumina-spa-card-editor", LuminaSpaEditor);
customElements.define("lumina-spa-card", LuminaSpaCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "lumina-spa-card", name: "Lumina SPA Pro (Control)", preview: true });
