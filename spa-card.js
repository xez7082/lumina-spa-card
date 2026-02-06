import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

/**
 * ÉDITEUR STABILISÉ (Mémoire d'onglet persistante)
 */
class SpaCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {}, _currentTab: { type: Number } }; }

  constructor() {
    super();
    this._currentTab = 0; // Initialisation simple
  }

  setConfig(config) {
    this._config = config;
  }

  _selectTab(idx) {
    this._currentTab = idx;
  }

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

    const schemas = [
      // 0: GÉNÉRAL
      [
        { name: "card_title", label: "Titre de la Carte", selector: { text: {} } },
        { name: "background_image", label: "Image de fond (URL)", selector: { text: {} } }
      ],
      // 1: BOUTONS (LES 8 DU HAUT)
      [
        { name: "show_top_bar", label: "Afficher les boutons ?", selector: { boolean: {} } },
        ...Array.from({length: 8}, (_, i) => [
          { name: `switch_${i+1}_entity`, label: `Bouton ${i+1} : Entité`, selector: { entity: {} } },
          { name: `switch_${i+1}_label`, label: `Bouton ${i+1} : Nom`, selector: { text: {} } }
        ]).flat()
      ],
      // 2: SONDES (TEMP & CHIMIE)
      [
        { name: "entity_water_temp", label: "Température Eau", selector: { entity: {} } },
        { name: "entity_ambient_temp", label: "Température Air", selector: { entity: {} } },
        { name: "pos_temp_x", label: "Bloc Temp X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
        { name: "pos_temp_y", label: "Bloc Temp Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
        { name: "entity_ph", label: "pH", selector: { entity: {} } },
        { name: "entity_orp", label: "ORP", selector: { entity: {} } },
        { name: "entity_bromine", label: "Brome", selector: { entity: {} } },
        { name: "entity_alkalinity", label: "TAC", selector: { entity: {} } },
        { name: "pos_chem_x", label: "Bloc Chimie X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
        { name: "pos_chem_y", label: "Bloc Chimie Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }
      ],
      // 3: SYSTÈME (LES 14)
      [
        ...Array.from({length: 14}, (_, i) => [
          { name: `sys_entity_${i+1}`, label: `Entité ${i+1}`, selector: { entity: {} } },
          { name: `sys_label_${i+1}`, label: `Label ${i+1}`, selector: { text: {} } }
        ]).flat(),
        { name: "pos_elec_x", label: "Système X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
        { name: "pos_elec_y", label: "Système Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }
      ],
      // 4: CAMÉRA
      [
        { name: "camera_entity", label: "Entité Caméra", selector: { entity: { domain: "camera" } } },
        { name: "camera_width", label: "Largeur (px)", selector: { number: { min: 100, max: 600 } } },
        { name: "pos_cam_x", label: "Caméra X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
        { name: "pos_cam_y", label: "Caméra Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }
      ],
      // 5: VALEURS IDÉALES
      [
        { name: "show_ideal_table", label: "Afficher Idéal ?", selector: { boolean: {} } },
        { name: "pos_ideal_x", label: "Idéal X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
        { name: "pos_ideal_y", label: "Idéal Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }
      ]
    ];

    const tabNames = ["Général", "Boutons", "Sondes", "Système", "Caméra", "Idéal"];

    return html`
      <div class="tabs">
        ${tabNames.map((name, i) => html`
          <div class="tab ${this._currentTab === i ? 'active' : ''}" @click=${() => this._selectTab(i)}>${name}</div>
        `)}
      </div>
      <div class="editor-content">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${schemas[this._currentTab]}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `;
  }

  static styles = css`
    .tabs { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 15px; }
    .tab { padding: 8px 12px; background: #333; color: white; border-radius: 5px; cursor: pointer; font-size: 11px; border: 1px solid #555; }
    .tab.active { background: #00f9f9; color: black; font-weight: bold; border-color: #00f9f9; }
    .editor-content { padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; }
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
    return {
      val: !isNaN(s.state) ? parseFloat(s.state).toFixed(1) : s.state,
      unit: s.attributes.unit_of_measurement || '',
      icon: s.attributes.icon || 'mdi:circle-outline',
      active: !['off', 'unavailable', 'unknown', 'standby'].includes(s.state.toLowerCase())
    };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const c = this.config;

    // 14 Entités Système
    const sysItems = [];
    for (let i = 1; i <= 14; i++) {
      const ent = c[`sys_entity_${i}`];
      if (ent) {
        const s = this._getState(ent);
        sysItems.push(html`
          <div class="sys-item">
            <ha-icon icon="${s.icon}" class="${s.active ? 'neon-text' : ''}"></ha-icon>
            <span class="sys-lbl">${c[`sys_label_${i}`] || ''}:</span>
            <span class="sys-val">${s.val}${s.unit}</span>
          </div>
        `);
      }
    }

    // 8 Boutons du haut
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
        <div class="card-title-main">${c.card_title || 'SPA CONTROL'}</div>
        
        ${c.show_top_bar !== false ? html`<div class="top-bar-grid">${topButtons}</div>` : ''}

        <div class="glass-box" style="left:${c.pos_temp_x || 5}%; top:${c.pos_temp_y || 20}%;">
          <div class="box-h">TEMPERATURES</div>
          <div class="box-b"><ha-icon icon="mdi:thermometer-water"></ha-icon> ${this._getState(c.entity_water_temp).val}° | <ha-icon icon="mdi:weather-windy"></ha-icon> ${this._getState(c.entity_ambient_temp).val}°</div>
        </div>

        <div class="glass-box" style="left:${c.pos_chem_x || 5}%; top:${c.pos_chem_y || 30}%;">
          <div class="box-h">CHIMIE</div>
          <div class="box-b">pH: ${this._getState(c.entity_ph).val} | ORP: ${this._getState(c.entity_orp).val}</div>
          <div class="box-b">Br: ${this._getState(c.entity_bromine).val} | TAC: ${this._getState(c.entity_alkalinity).val}</div>
        </div>

        <div class="glass-box sys-box" style="left:${c.pos_elec_x || 5}%; top:${c.pos_elec_y || 42}%;">
          <div class="box-h">SYSTÈME</div>
          <div class="sys-grid">${sysItems}</div>
        </div>

        ${c.camera_entity ? html`
          <div class="glass-box" style="left:${c.pos_cam_x || 5}%; top:${c.pos_cam_y || 70}%; width:${c.camera_width || 250}px; padding: 5px;">
            <div class="box-h">DIRECT VIDEO</div>
            <div class="cam-frame"><hui-image .hass=${this.hass} .cameraImage=${c.camera_entity} cameraView="live"></hui-image></div>
          </div>
        ` : ''}

        ${c.show_ideal_table !== false ? html`
          <div class="glass-box" style="left:${c.pos_ideal_x || 65}%; top:${c.pos_ideal_y || 42}%;">
            <div class="box-h">VALEURS CIBLES</div>
            <div class="ideal-line"><span>pH</span> <span>7.2-7.6</span></div>
            <div class="ideal-line"><span>Brome</span> <span>3.0-5.0</span></div>
            <div class="ideal-line"><span>TAC</span> <span>80-120</span></div>
          </div>
        ` : ''}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { height: 850px; background-size: cover; background-position: center; border: 2.5px solid #00f9f9; border-radius: 25px; overflow: hidden; position: relative; color: white; font-family: sans-serif; }
    .card-title-main { position: absolute; top: 15px; left: 20px; font-weight: 900; color: #00f9f9; text-transform: uppercase; letter-spacing: 2px; }
    .top-bar-grid { position: absolute; top: 45px; left: 10px; right: 10px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px; }
    .sw-btn { background: rgba(0,0,0,0.75); border: 1px solid #00f9f9; border-radius: 8px; padding: 5px; text-align: center; cursor: pointer; transition: 0.3s; }
    .sw-btn.on { background: rgba(0,249,249,0.3); box-shadow: 0 0 12px #00f9f9; }
    .sw-lbl { font-size: 9px; font-weight: bold; margin-bottom: 2px; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
    .glass-box { position: absolute; background: rgba(0,0,0,0.65); backdrop-filter: blur(12px); border: 1px solid #00f9f9; border-radius: 15px; padding: 12px; min-width: 190px; }
    .box-h { color: #00f9f9; font-size: 10px; font-weight: bold; border-bottom: 1px solid rgba(0,249,249,0.3); margin-bottom: 8px; padding-bottom: 3px; }
    .box-b { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: bold; margin-bottom: 4px; }
    .sys-box { min-width: 260px; }
    .sys-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 12px; }
    .sys-item { display: flex; align-items: center; font-size: 11px; font-weight: bold; }
    .sys-lbl { color: #bbb; margin: 0 5px; }
    .cam-frame { border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,249,249,0.4); }
    hui-image { width: 100%; height: auto; display: block; }
    .ideal-line { display: flex; justify-content: space-between; font-size: 11px; color: #00ff88; font-weight: bold; margin-bottom: 3px; }
    .neon-text { color: #00f9f9; filter: drop-shadow(0 0 4px #00f9f9); }
    ha-icon { --mdc-icon-size: 17px; }
  `;
}

customElements.define("spa-card-editor", SpaCardEditor);
customElements.define("spa-card", SpaCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "spa-card", name: "SPA FINAL STABLE", preview: true });
