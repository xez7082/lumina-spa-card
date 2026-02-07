import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

/**
 * ÉDITEUR MAÎTRE - ULTRA STABLE
 */
class SpaCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {}, _tab: { type: Number } }; }
  constructor() { super(); this._tab = 0; }
  setConfig(config) { this._config = config; }
  _selectTab(idx) { this._tab = idx; this.requestUpdate(); }
  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: ev.detail.value },
      bubbles: true, composed: true,
    }));
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const schemas = [
      // ONGLET 0: GÉNÉRAL
      [{ name: "card_title", label: "Titre de la carte", selector: { text: {} } }, 
       { name: "background_image", label: "Image de fond (URL)", selector: { text: {} } },
       { name: "text_scale", label: "Facteur de Zoom (Texte & Cadres)", selector: { number: { min: 1, max: 2, step: 0.05, mode: "slider" } } }],
      
      // ONGLET 1: BOUTONS (8)
      [{ name: "show_top_bar", label: "Afficher les boutons ?", selector: { boolean: {} } },
        ...Array.from({length: 8}, (_, i) => [
          { name: `switch_${i+1}_entity`, label: `Bouton ${i+1} : Entité`, selector: { entity: {} } },
          { name: `switch_${i+1}_label`, label: `Bouton ${i+1} : Nom`, selector: { text: {} } }
        ]).flat()],

      // ONGLET 2: SONDES (TEMP & CHIMIE)
      [{ name: "entity_water_temp", label: "Temp. Eau", selector: { entity: {} } }, 
       { name: "entity_ambient_temp", label: "Temp. Air", selector: { entity: {} } },
       { name: "pos_temp_x", label: "Temp X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }, 
       { name: "pos_temp_y", label: "Temp Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
       { name: "entity_ph", label: "Entité pH", selector: { entity: {} } }, 
       { name: "entity_orp", label: "Entité ORP", selector: { entity: {} } }, 
       { name: "entity_bromine", label: "Entité Brome", selector: { entity: {} } }, 
       { name: "entity_alkalinity", label: "Entité TAC", selector: { entity: {} } },
       { name: "pos_chem_x", label: "Chimie X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }, 
       { name: "pos_chem_y", label: "Chimie Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }],

      // ONGLET 3: SYSTÈME (14 ENTITÉS + ICONES)
      [...Array.from({length: 14}, (_, i) => [
          { name: `sys_entity_${i+1}`, label: `Entité ${i+1}`, selector: { entity: {} } },
          { name: `sys_label_${i+1}`, label: `Nom ${i+1}`, selector: { text: {} } },
          { name: `sys_icon_${i+1}`, label: `Icône perso ${i+1}`, selector: { icon: {} } }
        ]).flat(),
       { name: "pos_elec_x", label: "Système X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }, 
       { name: "pos_elec_y", label: "Système Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }],

      // ONGLET 4: CAMÉRA
      [{ name: "camera_entity", label: "Entité Caméra", selector: { entity: { domain: "camera" } } }, 
       { name: "camera_width", label: "Largeur Caméra (px)", selector: { number: { min: 100, max: 500 } } },
       { name: "pos_cam_x", label: "Caméra X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }, 
       { name: "pos_cam_y", label: "Caméra Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }],

      // ONGLET 5: IDÉAL
      [{ name: "show_ideal_table", label: "Afficher Tableau Idéal ?", selector: { boolean: {} } }, 
       { name: "pos_ideal_x", label: "Cibles X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }, 
       { name: "pos_ideal_y", label: "Cibles Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } }]
    ];

    const tabNames = ["Général", "Boutons", "Sondes", "Système", "Caméra", "Idéal"];
    return html`
      <div class="tabs">
        ${tabNames.map((name, i) => html`<div class="tab ${this._tab === i ? 'active' : ''}" @click=${() => this._selectTab(i)}>${name}</div>`)}
      </div>
      <div class="editor-content">
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${schemas[this._tab]} @value-changed=${this._valueChanged}></ha-form>
      </div>
    `;
  }
  static styles = css`
    .tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
    .tab { padding: 6px 10px; background: #444; color: white; border-radius: 4px; cursor: pointer; font-size: 10px; border: 1px solid #666; }
    .tab.active { background: #00f9f9; color: black; font-weight: bold; border-color: #00f9f9; }
    .editor-content { padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; }
  `;
}

/**
 * CARTE SPA COMPLÈTE - FULLY KIOSK READY
 */
class SpaCard extends LitElement {
  static getConfigElement() { return document.createElement("spa-card-editor"); }
  static get properties() { return { hass: {}, config: {} }; }
  setConfig(config) { this.config = config; }

  _getState(entityId, customIcon) {
    if (!this.hass || !entityId || !this.hass.states[entityId]) return { val: '?', unit: '', active: false, icon: customIcon || 'mdi:circle-outline' };
    const s = this.hass.states[entityId];
    const val = !isNaN(s.state) ? parseFloat(s.state).toFixed(1) : s.state;
    const unit = s.attributes.unit_of_measurement || '';
    const icon = customIcon || s.attributes.icon || 'mdi:circle-outline';
    return { 
      val, unit, icon, 
      active: !['off', 'unavailable', 'unknown', 'standby'].includes(s.state.toLowerCase()) 
    };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const c = this.config;
    const zoom = c.text_scale || 1.0;

    // Rendu Système (14)
    const sysItems = [];
    for (let i = 1; i <= 14; i++) {
      if (c[`sys_entity_${i}`]) {
        const s = this._getState(c[`sys_entity_${i}`], c[`sys_icon_${i}`]);
        sysItems.push(html`<div class="sys-item"><ha-icon icon="${s.icon}" class="${s.active ? 'neon' : ''}"></ha-icon><span>${c[`sys_label_${i}`] || ''}: ${s.val}${s.unit}</span></div>`);
      }
    }

    // Rendu Boutons (8)
    const buttons = [];
    for (let i = 1; i <= 8; i++) {
      if (c[`switch_${i}_entity`]) {
        const s = this._getState(c[`switch_${i}_entity`]);
        buttons.push(html`<div class="sw-btn ${s.active ? 'on' : ''}" @click=${() => this.hass.callService("homeassistant", "toggle", {entity_id: c[`switch_${i}_entity`]})}>${c[`switch_${i}_label`] || 'S'+i}</div>`);
      }
    }

    return html`
      <ha-card style="background-image: url('${c.background_image || ''}'); --z: ${zoom};">
        <div class="main-title" style="font-size: calc(10px * ${zoom})">${c.card_title || 'SPA CONTROL'}</div>
        
        ${c.show_top_bar !== false ? html`<div class="top-bar">${buttons}</div>` : ''}

        <div class="glass-box" style="left:${c.pos_temp_x || 5}%; top:${c.pos_temp_y || 11}%;">
          <div class="box-h">TEMPERATURES</div>
          <div class="box-b"><span><ha-icon icon="mdi:thermometer"></ha-icon> EAU:</span> <span>${this._getState(c.entity_water_temp).val}${this._getState(c.entity_water_temp).unit}</span></div>
          <div class="box-b"><span><ha-icon icon="mdi:weather-windy"></ha-icon> AIR:</span> <span>${this._getState(c.entity_ambient_temp).val}${this._getState(c.entity_ambient_temp).unit}</span></div>
        </div>

        <div class="glass-box" style="left:${c.pos_chem_x || 5}%; top:${c.pos_chem_y || 22}%;">
          <div class="box-h">CHIMIE</div>
          <div class="chem-grid">
            <div class="box-b"><span>pH:</span> <span class="neon">${this._getState(c.entity_ph).val}</span></div>
            <div class="box-b"><span>ORP:</span> <span class="neon">${this._getState(c.entity_orp).val}${this._getState(c.entity_orp).unit}</span></div>
            <div class="box-b"><span>Br:</span> <span class="neon">${this._getState(c.entity_bromine).val}${this._getState(c.entity_bromine).unit}</span></div>
            <div class="box-b"><span>TAC:</span> <span class="neon">${this._getState(c.entity_alkalinity).val}${this._getState(c.entity_alkalinity).unit}</span></div>
          </div>
        </div>

        <div class="glass-box" style="left:${c.pos_elec_x || 5}%; top:${c.pos_elec_y || 35}%;">
          <div class="box-h">SYSTÈME</div>
          <div class="sys-grid">${sysItems}</div>
        </div>

        ${c.camera_entity ? html`
          <div class="glass-box" style="left:${c.pos_cam_x || 5}%; top:${c.pos_cam_y || 72}%; width:${c.camera_width || 180}px; padding:2px;">
            <hui-image .hass=${this.hass} .cameraImage=${c.camera_entity} cameraView="live"></hui-image>
          </div>` : ''}

        ${c.show_ideal_table !== false ? html`
          <div class="glass-box" style="left:${c.pos_ideal_x || 70}%; top:${c.pos_ideal_y || 35}%;">
            <div class="box-h">CIBLES</div>
            <div class="target-row"><span>pH</span><span>7.2-7.6</span></div>
            <div class="target-row"><span>ORP</span><span>650-750</span></div>
            <div class="target-row"><span>Brome</span><span>3-5 mg/l</span></div>
            <div class="target-row"><span>TAC</span><span>80-120</span></div>
          </div>` : ''}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { height: 550px; background-size: cover; background-position: center; border: 2px solid #00f9f9; border-radius: 15px; overflow: hidden; position: relative; color: #fff; font-family: 'Roboto', sans-serif; }
    .main-title { position: absolute; top: 4px; left: 10px; font-weight: 900; color: #00f9f9; text-transform: uppercase; letter-spacing: 1px; }
    .top-bar { position: absolute; top: 20px; left: 5px; right: 5px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 3px; }
    .sw-btn { background: rgba(0,0,0,0.8); border: 1px solid #00f9f9; border-radius: 4px; padding: 4px 1px; text-align: center; cursor: pointer; font-size: calc(7px * var(--z)); font-weight: bold; text-transform: uppercase; }
    .sw-btn.on { background: rgba(0,249,249,0.4); box-shadow: 0 0 5px #00f9f9; }
    .glass-box { position: absolute; background: rgba(0,0,0,0.7); border: 1px solid #00f9f9; border-radius: 10px; padding: calc(6px * var(--z)); min-width: fit-content; white-space: nowrap; }
    .box-h { color: #00f9f9; font-size: calc(8px * var(--z)); font-weight: 900; border-bottom: 1px solid rgba(0,249,249,0.3); margin-bottom: 5px; text-transform: uppercase; }
    .box-b { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-weight: 700; font-size: calc(10px * var(--z)); margin-bottom: 2px; }
    .chem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
    .sys-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 10px; }
    .sys-item { display: flex; align-items: center; font-size: calc(9px * var(--z)); }
    .target-row { display: flex; justify-content: space-between; color: #00ff88; font-size: calc(9px * var(--z)); gap: 15px; font-weight: bold; }
    .neon { color: #00f9f9; text-shadow: 0 0 3px #00f9f9; }
    ha-icon { --mdc-icon-size: calc(12px * var(--z)); margin-right: 5px; }
    hui-image { width: 100%; height: auto; display: block; border-radius: 5px; }
  `;
}

customElements.define("spa-card-editor", SpaCardEditor);
customElements.define("spa-card", SpaCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "spa-card", name: "SPA FINAL COMPLETE", preview: true });
