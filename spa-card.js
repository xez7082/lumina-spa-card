import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

/**
 * ÉDITEUR DE LA CARTE
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
    
    // Génération dynamique du schéma pour les 8 switchs
    const switchSchema = [];
    for (let i = 1; i <= 8; i++) {
      switchSchema.push({
        name: "", type: "grid", schema: [
          { name: `switch_${i}_entity`, label: `Entité Switch ${i}`, selector: { entity: { domain: "switch" } } },
          { name: `switch_${i}_label`, label: `Nom affiché ${i}`, selector: { text: {} } }
        ]
      });
    }

    const schema = [
      { name: "card_title", label: "Nom du SPA", selector: { text: {} } },
      { name: "background_image", label: "Image (/local/sparond2.jpg)", selector: { text: {} } },
      {
        title: "🕹️ Barre de Contrôle (Haut)",
        type: "expandable",
        schema: [
          { name: "show_top_bar", label: "Afficher la barre", selector: { boolean: {} } },
          ...switchSchema
        ]
      },
      {
        title: "🌡️ Températures",
        type: "expandable",
        schema: [
          { name: "entity_water_temp", label: "Entité Temp Eau", selector: { entity: {} } },
          { name: "entity_ambient_temp", label: "Entité Temp Env", selector: { entity: {} } },
          { name: "", type: "grid", schema: [
            { name: "pos_temp_x", label: "Horizontal (X)", selector: { number: { min: 0, max: 100, mode: "box" } } },
            { name: "pos_temp_y", label: "Vertical (Y)", selector: { number: { min: 0, max: 100, mode: "box" } } },
          ]}
        ]
      },
      // ... Les autres sections (Chimie, Système, etc.) restent identiques à la version précédente
      {
        title: "🧪 Chimie de l'eau",
        type: "expandable",
        schema: [
          { name: "entity_ph", label: "Entité pH", selector: { entity: {} } },
          { name: "entity_orp", label: "Entité ORP", selector: { entity: {} } },
          { name: "entity_bromine", label: "Entité Brome", selector: { entity: {} } },
          { name: "entity_alkalinity", label: "Entité Alcalinité", selector: { entity: {} } },
          { name: "", type: "grid", schema: [
            { name: "pos_chem_x", label: "Horizontal (X)", selector: { number: { min: 0, max: 100, mode: "box" } } },
            { name: "pos_chem_y", label: "Vertical (Y)", selector: { number: { min: 0, max: 100, mode: "box" } } },
          ]}
        ]
      }
    ];

    return html`<ha-form .hass=${this.hass} .data=${this._config} .schema=${schema} @value-changed=${this._valueChanged}></ha-form>`;
  }
}

/**
 * CARTE PRINCIPALE
 */
class SpaCard extends LitElement {
  static getConfigElement() { return document.createElement("spa-card-editor"); }
  static get properties() { return { hass: {}, config: {} }; }
  setConfig(config) { this.config = config; }

  _getState(entityId) {
    if (!this.hass || !entityId || !this.hass.states[entityId]) return { val: '?', active: false };
    const state = this.hass.states[entityId].state;
    return { val: state, active: state === 'on' };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const c = this.config;

    // Rendu des 8 switchs du haut
    const topSwitches = [];
    for (let i = 1; i <= 8; i++) {
      const entity = c[`switch_${i}_entity`];
      const label = c[`switch_${i}_label`] || `S${i}`;
      if (entity) {
        const state = this._getState(entity);
        topSwitches.push(html`
          <div class="top-switch ${state.active ? 'on' : ''}" @click=${() => this.hass.callService("switch", "toggle", {entity_id: entity})}>
            <div class="sw-label">${label}</div>
            <ha-icon icon="mdi:power"></ha-icon>
          </div>
        `);
      }
    }

    return html`
      <ha-card style="background-image: url('${c.background_image || '/local/sparond2.jpg'}');">
        <div class="header">${c.card_title || 'SPA CARD'}</div>

        ${c.show_top_bar !== false && topSwitches.length > 0 ? html`
          <div class="top-bar">
            ${topSwitches}
          </div>
        ` : ''}

        <div class="glass" style="left:${c.pos_temp_x || 5}%; top:${c.pos_temp_y || 18}%;">
           <div class="titre">TEMPÉRATURES</div>
           </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { background-size: cover; background-position: center; height: 550px; position: relative; color: white; border-radius: 20px; overflow: hidden; }
    .header { position: absolute; top: 15px; left: 20px; font-weight: 900; color: #00d4ff; text-transform: uppercase; }
    
    /* STYLE DE LA NOUVELLE BARRE DE SWITCHS */
    .top-bar { 
      position: absolute; top: 50px; left: 10px; right: 10px; 
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; 
    }
    .top-switch { 
      background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); border-radius: 8px; 
      padding: 5px; text-align: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);
      transition: 0.3s;
    }
    .top-switch.on { background: rgba(0, 212, 255, 0.4); border-color: #00d4ff; }
    .sw-label { font-size: 0.6em; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    ha-icon { --mdc-icon-size: 16px; }

    /* Reste du CSS habituel (Glass, titre, btns...) */
    .glass { position: absolute; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border-radius: 12px; padding: 10px; min-width: 175px; }
    .titre { font-size: 0.55em; color: #00d4ff; font-weight: 900; border-bottom: 1px solid rgba(0,212,255,0.2); }
  `;
}

customElements.define("spa-card-editor", SpaCardEditor);
customElements.define("spa-card", SpaCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "spa-card", name: "SPA Card", preview: true });
