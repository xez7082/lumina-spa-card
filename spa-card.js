import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

/**
 * ÉDITEUR AVEC PERSISTANCE D'ONGLET RENFORCÉE
 */
class SpaCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {}, _tab: { type: Number } }; }
  
  constructor() {
    super();
    this._tab = 0; // État local qui survit aux rafraîchissements de données
  }

  setConfig(config) {
    this._config = config;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    if (this._config[target.configValue] === target.value) return;

    // On déclenche l'événement pour HA
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: ev.detail.value },
      bubbles: true,
      composed: true,
    }));
  }

  _handleTabClick(idx) {
    this._tab = idx;
    this.requestUpdate(); // Force le rendu sans toucher à la config
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const schemas = [
      // 0: Général
      [{ name: "card_title", label: "Titre de la Carte", selector: { text: {} } },
       { name: "background_image", label: "Image de fond (URL)", selector: { text: {} } }],
      // 1: Boutons du haut
      [{ name: "show_top_bar", label: "Afficher la barre ?", selector: { boolean: {} } },
        ...Array.from({length: 8}, (_, i) => [
          { name: `switch_${i+1}_entity`, label: `Bouton ${i+1} : Entité`, selector: { entity: {} } },
          { name: `switch_${i+1}_label`, label: `Bouton ${i+1} : Nom`, selector: { text: {} } }
        ]).flat()],
      // 2: Temp & Chimie
      [{ name: "title_temp", label: "Titre Bloc Température", selector: { text: {} } },
       { name: "entity_water_temp", label: "Sonde Eau", selector: { entity: {} } },
       { name: "entity_ambient_temp", label: "Sonde Air", selector: { entity: {} } },
       { name: "pos_temp_x", label: "Position X %", selector: { number: { min: 0, max: 100, mode: "slider" } } },
       { name: "pos_temp_y", label: "Position Y %", selector: { number: { min: 0, max: 100, mode: "slider" } } },
       { name: "entity_ph", label: "Entité pH", selector: { entity: {} } },
       { name: "entity_orp", label: "Entité ORP", selector: { entity: {} } },
       { name: "entity_bromine", label: "Entité Brome", selector: { entity: {} } },
       { name: "entity_alkalinity", label: "Entité TAC", selector: { entity: {} } },
       { name: "pos_chem_x", label: "Chimie X %", selector: { number: { min: 0, max: 100, mode: "slider" } } },
       { name: "pos_chem_y", label: "Chimie Y %", selector: { number: { min: 0, max: 100, mode: "slider" } } }],
      // 3: Système (14 entités)
      [{ name: "title_sys", label: "Titre Bloc Système", selector: { text: {} } },
        ...Array.from({length: 14}, (_, i) => [
          { name: `sys_entity_${i+1}`, label: `Entité ${i+1}`, selector: { entity: {} } },
          { name: `sys_label_${i+1}`, label: `Nom ${i+1}`, selector: { text: {} } }
        ]).flat(),
       { name: "pos_elec_x", label: "Système X %", selector: { number: { min: 0, max: 100, mode: "slider" } } },
       { name: "pos_elec_y", label: "Système Y %", selector: { number: { min: 0, max: 100, mode: "slider" } } }],
      // 4: Caméra
      [{ name: "camera_entity", label: "Entité Caméra", selector: { entity: { domain: "camera" } } },
       { name: "camera_width", label: "Largeur Caméra (px)", selector: { number: { min: 100, max: 600 } } },
       { name: "pos_cam_x", label: "Caméra X %", selector: { number: { min: 0, max: 100, mode: "slider" } } },
       { name: "pos_cam_y", label: "Caméra Y %", selector: { number: { min: 0, max: 100, mode: "slider" } } }],
      // 5: Idéal
      [{ name: "show_ideal_table", label: "Afficher Bloc Idéal", selector: { boolean: {} } },
       { name: "pos_ideal_x", label: "Idéal X %", selector: { number: { min: 0, max: 100, mode: "slider" } } },
       { name: "pos_ideal_y", label: "Idéal Y %", selector: { number: { min: 0, max: 100, mode: "slider" } } }]
    ];

    const tabs = ["Général", "Boutons", "Sondes", "Système", "Caméra", "Idéal"];

    return html`
      <div class="editor-container">
        <div class="tabs-bar">
          ${tabs.map((t, i) => html`
            <div class="tab-btn ${this._tab === i ? 'active' : ''}" @click=${() => this._handleTabClick(i)}>
              ${t}
            </div>
          `)}
        </div>
        <div class="tab-content">
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${schemas[this._tab]}
            .computeLabel=${(s) => s.label}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `;
  }

  static styles = css`
    .editor-container { display: flex; flex-direction: column; }
    .tabs-bar { display: flex; flex-wrap: wrap; gap: 4px; padding-bottom: 12px; border-bottom: 1px solid var(--divider-color); }
    .tab-btn { 
      background: var(--secondary-background-color); 
      padding: 8px 12px; cursor: pointer; border-radius: 4px; font-size: 12px; 
      border: 1px solid var(--divider-color); transition: all 0.2s;
    }
    .tab-btn.active { background: #00f9f9; color: #000; font-weight: bold; border-color: #00f9f9; }
    .tab-content { padding-top: 16px; }
  `;
}

/**
 * CARTE SPA PRINCIPALE
 */
class SpaCard extends LitElement {
  static getConfigElement() { return document.createElement("spa-card-editor"); }
  static get properties() { return { hass: {}, config: {} }; }
  
  setConfig(config) { this.config = config; }

  _getState(entityId) {
    if (!this.hass || !entityId || !this.hass.states[entityId]) return { val: '?', unit: '', active: false, icon: 'mdi:help-circle' };
    const s = this.hass.states[entityId];
    const raw = s.state;
    return {
      val: !isNaN(raw) ? parseFloat(raw).toFixed(1) : raw,
      unit: s.attributes.unit_of_measurement || '',
      icon: s.attributes.icon || 'mdi:circle',
      active: !['off', 'unavailable', 'unknown', 'standby', 'none'].includes(raw.toLowerCase())
    };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const c = this.config;

    const sysItems = [];
    for (let i = 1; i <= 14; i++) {
      const ent = c[`sys_entity_${i}`];
      if (ent) {
        const s = this._getState(ent);
        sysItems.push(html`
          <div class="sys-item">
            <ha-icon icon="${s.icon}" class="${s.active ? 'neon-text' : ''}"></ha-icon>
            <span class="sys-label">${c[`sys_label_${i}`] || ''}:</span>
            <span class="sys-val">${s.val}${s.unit}</span>
          </div>
        `);
      }
    }

    const topButtons = [];
    for (let i = 1; i <= 8; i++) {
      const ent = c[`switch_${i}_entity`];
      if (ent) {
        const s = this._getState(ent);
        topButtons.push(html`
          <div class="sw-btn ${s.active ? 'on' : ''}" @click=${() => this.hass.callService("homeassistant", "toggle", {entity_id: ent})}>
            <div class="sw-lbl">${c[`switch_${i}_label`] || 'S'+i}</div>
            <ha-icon icon="mdi:power"></ha-icon>
          </div>
        `);
      }
    }

    return html`
      <ha-card style="background-image: url('${c.background_image || '/local/sparond2.jpg'}');">
        <div class="main-title">${c.card_title || 'MON SPA'}</div>
        
        ${c.show_top_bar !== false ? html`<div class="top-bar">${topButtons}</div>` : ''}

        <div class="glass-box" style="left:${c.pos_temp_x || 5}%; top:${c.pos_temp_y || 18}%;">
          <div class="box-head">TEMPERATURES</div>
          <div class="box-body"><ha-icon icon="mdi:thermometer-water"></ha-icon> ${this._getState(c.entity_water_temp).val}° | <ha-icon icon="mdi:weather-windy"></ha-icon> ${this._getState(c.entity_ambient_temp).val}°</div>
        </div>

        <div class="glass-box" style="left:${c.pos_chem_x || 5}%; top:${c.pos_chem_y || 28}%;">
          <div class="box-head">CHIMIE</div>
          <div class="box-body">pH: ${this._getState(c.entity_ph).val} | ORP: ${this._getState(c.entity_orp).val}</div>
        </div>

        <div class="glass-box" style="left:${c.pos_elec_x || 5}%; top:${c.pos_elec_y || 38}%;">
          <div class="box-head">${c.title_sys || 'SYSTÈME'}</div>
          <div class="sys-grid">${sysItems}</div>
        </div>

        ${c.camera_entity ? html`
          <div class="glass-box" style="left:${c.pos_cam_x || 5}%; top:${c.pos_cam_y || 65}%; width:${c.camera_width || 250}px; padding: 5px;">
            <div class="box-head">CAMERA</div>
            <div class="cam-wrap"><hui-image .hass=${this.hass} .cameraImage=${c.camera_entity} cameraView="live"></hui-image></div>
          </div>
        ` : ''}

        ${c.show_ideal_table !== false ? html`
          <div class="glass-box" style="left:${c.pos_ideal_x || 65}%; top:${c.pos_ideal_y || 38}%;">
            <div class="box-head">CIBLES</div>
            <div class="ideal-row"><span>pH</span> <span>7.2-7.6</span></div>
            <div class="ideal-row"><span>Brome</span> <span>3.0-5.0</span></div>
          </div>
        ` : ''}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { height: 800px; background-size: cover; background-position: center; border: 2px solid #00f9f9; border-radius: 20px; overflow: hidden; position: relative; color: #fff; }
    .main-title { position: absolute; top: 15px; left: 20px; font-weight: bold; color: #00f9f9; text-transform: uppercase; letter-spacing: 2px; }
    .top-bar { position: absolute; top: 45px; left: 10px; right: 10px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px; }
    .sw-btn { background: rgba(0,0,0,0.7); border: 1px solid #00f9f9; border-radius: 6px; padding: 4px; text-align: center; cursor: pointer; transition: 0.3s; }
    .sw-btn.on { background: rgba(0,249,249,0.3); box-shadow: 0 0 10px #00f9f9; }
    .sw-lbl { font-size: 0.5em; font-weight: bold; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .glass-box { position: absolute; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border: 1px solid #00f9f9; border-radius: 12px; padding: 10px; min-width: 180px; }
    .box-head { color: #00f9f9; font-size: 0.6em; font-weight: bold; border-bottom: 1px solid rgba(0,249,249,0.2); margin-bottom: 6px; padding-bottom: 2px; }
    .box-body { display: flex; align-items: center; gap: 8px; font-size: 0.85em; font-weight: bold; }
    .sys-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 8px; }
    .sys-item { display: flex; align-items: center; font-size: 0.65em; font-weight: bold; }
    .sys-label { color: #ccc; margin: 0 4px; }
    .cam-wrap { border-radius: 8px; overflow: hidden; border: 1px solid rgba(0,249,249,0.3); }
    hui-image { width: 100%; height: auto; display: block; }
    .ideal-row { display: flex; justify-content: space-between; font-size: 0.7em; color: #00ff88; font-weight: bold; }
    .neon-text { color: #00f9f9; filter: drop-shadow(0 0 3px #00f9f9); }
    ha-icon { --mdc-icon-size: 16px; }
  `;
}

customElements.define("spa-card-editor", SpaCardEditor);
customElements.define("spa-card", SpaCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "spa-card", name: "SPA Ultimate Ultra-Stable", preview: true });
