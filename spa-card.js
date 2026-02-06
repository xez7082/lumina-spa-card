import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

/**
 * ÉDITEUR COMPLET ET CLAIR
 */
class SpaCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {} }; }
  setConfig(config) { this._config = config; }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: ev.detail.value },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const schema = [
      { name: "card_title", label: "Titre de la Carte", selector: { text: {} } },
      { name: "background_image", label: "Image de fond (URL)", selector: { text: {} } },
      { name: "show_top_bar", label: "Afficher les 8 boutons du haut", selector: { boolean: {} } },
      
      // Configuration des 8 boutons du haut
      ...Array.from({length: 8}, (_, i) => [
        { name: `switch_${i+1}_entity`, label: `Bouton ${i+1} : Entité`, selector: { entity: {} } },
        { name: `switch_${i+1}_label`, label: `Bouton ${i+1} : Nom`, selector: { text: {} } }
      ]).flat(),

      // Bloc Températures
      { name: "title_temp", label: "Titre Bloc Température", selector: { text: {} } },
      { name: "entity_water_temp", label: "Capteur Eau", selector: { entity: {} } },
      { name: "entity_ambient_temp", label: "Capteur Air", selector: { entity: {} } },
      { name: "pos_temp_x", label: "Temp Position X (%)", selector: { number: { min: 0, max: 100 } } },
      { name: "pos_temp_y", label: "Temp Position Y (%)", selector: { number: { min: 0, max: 100 } } },

      // Bloc Chimie
      { name: "entity_ph", label: "Capteur pH", selector: { entity: {} } },
      { name: "entity_orp", label: "Capteur ORP", selector: { entity: {} } },
      { name: "entity_bromine", label: "Capteur Brome", selector: { entity: {} } },
      { name: "entity_alkalinity", label: "Capteur TAC", selector: { entity: {} } },
      { name: "pos_chem_x", label: "Chimie Position X (%)", selector: { number: { min: 0, max: 100 } } },
      { name: "pos_chem_y", label: "Chimie Position Y (%)", selector: { number: { min: 0, max: 100 } } },

      // Bloc Système / Énergie
      { name: "entity_power", label: "Consommation (Watts)", selector: { entity: {} } },
      { name: "entity_amp", label: "Intensité SPA (A)", selector: { entity: {} } },
      { name: "entity_vac_current", label: "Intensité Aspirateur (A)", selector: { entity: {} } },
      { name: "entity_tv", label: "État TV (Entité)", selector: { entity: {} } },
      { name: "entity_alexa", label: "État Alexa (Entité)", selector: { entity: {} } },
      { name: "pos_elec_x", label: "Système Position X (%)", selector: { number: { min: 0, max: 100 } } },
      { name: "pos_elec_y", label: "Système Position Y (%)", selector: { number: { min: 0, max: 100 } } },

      // Bloc Valeurs Idéales
      { name: "show_ideal_table", label: "Afficher Bloc IDÉAL", selector: { boolean: {} } },
      { name: "pos_ideal_x", label: "Idéal Position X (%)", selector: { number: { min: 0, max: 100 } } },
      { name: "pos_ideal_y", label: "Idéal Position Y (%)", selector: { number: { min: 0, max: 100 } } }
    ];

    return html`<ha-form .hass=${this.hass} .data=${this._config} .schema=${schema} @value-changed=${this._valueChanged}></ha-form>`;
  }
}

/**
 * CARTE SPA ULTIME
 */
class SpaCard extends LitElement {
  static getConfigElement() { return document.createElement("spa-card-editor"); }
  static get properties() { return { hass: {}, config: {} }; }
  setConfig(config) { this.config = config; }

  _getState(entityId) {
    if (!this.hass || !entityId || !this.hass.states[entityId]) return { val: '?', unit: '', active: false };
    const s = this.hass.states[entityId];
    return {
      val: !isNaN(s.state) ? parseFloat(s.state).toFixed(1) : s.state,
      unit: s.attributes.unit_of_measurement || '',
      active: !['off', 'unavailable', 'unknown', 'standby'].includes(s.state.toLowerCase())
    };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const c = this.config;

    // Rendu des 8 boutons du haut
    const topButtons = [];
    for (let i = 1; i <= 8; i++) {
      const ent = c[`switch_${i}_entity`];
      if (ent) {
        const s = this._getState(ent);
        topButtons.push(html`
          <div class="sw-item ${s.active ? 'active' : ''}" @click=${() => this.hass.callService("homeassistant", "toggle", {entity_id: ent})}>
            <div class="sw-text">${c[`switch_${i}_label`] || 'S'+i}</div>
            <ha-icon icon="mdi:power"></ha-icon>
          </div>
        `);
      }
    }

    return html`
      <ha-card style="background-image: url('${c.background_image || '/local/sparond2.jpg'}');">
        <div class="glass-header">${c.card_title || 'MON SPA'}</div>

        ${c.show_top_bar !== false ? html`<div class="top-grid">${topButtons}</div>` : ''}

        <div class="glass-box" style="left:${c.pos_temp_x || 5}%; top:${c.pos_temp_y || 22}%;">
          <div class="box-title">${c.title_temp || 'TEMPERATURES'}</div>
          <div class="box-row">Eau: ${this._getState(c.entity_water_temp).val}° | Air: ${this._getState(c.entity_ambient_temp).val}°</div>
        </div>

        <div class="glass-box" style="left:${c.pos_chem_x || 5}%; top:${c.pos_chem_y || 40}%;">
          <div class="box-title">CHIMIE</div>
          <div class="box-row">pH: ${this._getState(c.entity_ph).val} | ORP: ${this._getState(c.entity_orp).val}</div>
          <div class="box-row">Br: ${this._getState(c.entity_bromine).val} | TAC: ${this._getState(c.entity_alkalinity).val}</div>
        </div>

        <div class="glass-box" style="left:${c.pos_elec_x || 5}%; top:${c.pos_elec_y || 58}%;">
          <div class="box-title">SYSTÈME</div>
          <div class="box-row">${this._getState(c.entity_power).val}W | ${this._getState(c.entity_amp).val}A</div>
          <div class="box-row">
             <ha-icon icon="mdi:television" class="${this._getState(c.entity_tv).active ? 'neon-text' : ''}"></ha-icon>
             <ha-icon icon="mdi:google-assistant" class="${this._getState(c.entity_alexa).active ? 'neon-text' : ''}"></ha-icon>
             <span>Aspi: ${this._getState(c.entity_vac_current).val}A</span>
          </div>
        </div>

        ${c.show_ideal_table !== false ? html`
        <div class="glass-box" style="left:${c.pos_ideal_x || 55}%; top:${c.pos_ideal_y || 40}%;">
          <div class="box-title">VALEURS IDÉALES</div>
          <div class="box-row-ideal"><span>pH</span> <span>7.2 - 7.6</span></div>
          <div class="box-row-ideal"><span>Brome</span> <span>3.0 - 5.0</span></div>
          <div class="box-row-ideal"><span>TAC</span> <span>80 - 120</span></div>
        </div>` : ''}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { height: 580px; background-size: cover; border: 3px solid #00f9f9; border-radius: 25px; position: relative; overflow: hidden; color: white; }
    
    .glass-header { position: absolute; top: 12px; left: 20px; font-weight: 900; color: #00f9f9; letter-spacing: 2px; text-transform: uppercase; }
    
    .top-grid { position: absolute; top: 45px; left: 10px; right: 10px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; }
    .sw-item { background: rgba(0,0,0,0.7); border: 1px solid #00f9f9; border-radius: 8px; padding: 5px 2px; text-align: center; cursor: pointer; transition: 0.3s; }
    .sw-item.active { background: rgba(0,249,249,0.4); box-shadow: 0 0 10px #00f9f9; }
    .sw-text { font-size: 0.5em; font-weight: 900; text-transform: uppercase; margin-bottom: 2px; }
    
    .glass-box { position: absolute; background: rgba(0,0,0,0.6); backdrop-filter: blur(15px); border: 1px solid #00f9f9; border-radius: 15px; padding: 12px; min-width: 175px; }
    .box-title { color: #00f9f9; font-size: 0.6em; font-weight: 900; border-bottom: 1px solid rgba(0,249,249,0.3); margin-bottom: 6px; padding-bottom: 3px; }
    .box-row { display: flex; align-items: center; gap: 8px; font-size: 0.85em; font-weight: bold; margin-bottom: 4px; }
    
    .box-row-ideal { display: flex; justify-content: space-between; font-size: 0.75em; font-weight: bold; color: #00ff88; margin-bottom: 3px; }
    
    .neon-text { color: #00f9f9; filter: drop-shadow(0 0 5px #00f9f9); }
    ha-icon { --mdc-icon-size: 18px; }
  `;
}

customElements.define("spa-card-editor", SpaCardEditor);
customElements.define("spa-card", SpaCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "spa-card", name: "SPA Ultimate Final", preview: true });
