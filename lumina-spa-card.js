import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class LuminaSpaEditor extends LitElement {
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
      { name: "card_title", label: "Nom du SPA", selector: { text: {} } },
      { name: "background_image", label: "Image (/local/sparond.png)", selector: { text: {} } },
      // TEMPERATURES
      { name: "entity_water_temp", label: "Température Eau", selector: { entity: { domain: "sensor" } } },
      { name: "entity_ambient_temp", label: "Température Environnante", selector: { entity: { domain: "sensor" } } },
      // ANALYSES CHIMIE
      { name: "entity_ph", label: "Capteur pH", selector: { entity: { domain: "sensor" } } },
      { name: "entity_orp", label: "Capteur ORP", selector: { entity: { domain: "sensor" } } },
      { name: "entity_lsi", label: "Capteur LSI", selector: { entity: { domain: "sensor" } } },
      { name: "entity_tds", label: "Capteur TDS/Sel", selector: { entity: { domain: "sensor" } } },
      // ÉLECTRIQUE
      { name: "entity_power", label: "Puissance Totale (W)", selector: { entity: { domain: "sensor" } } },
      { name: "entity_amp", label: "Ampérage SPA (A)", selector: { entity: { domain: "sensor" } } },
      { name: "entity_current", label: "Intensité Courante (A)", selector: { entity: { domain: "sensor" } } },
      { name: "entity_vac_current", label: "Aspirateur Current (A)", selector: { entity: { domain: "sensor" } } },
      // MULTIMEDIA
      { name: "entity_tv", label: "Télévision", selector: { entity: {} } },
      { name: "entity_alexa", label: "Alexa", selector: { entity: {} } },
      // COMMANDES
      { name: "switch_bubbles", label: "Bulles", selector: { entity: {} } },
      { name: "switch_filter", label: "Filtration", selector: { entity: {} } },
      { name: "switch_light", label: "Lumière", selector: { entity: {} } },
      // POSITIONS
      { name: "pos_temp_x", label: "Temps X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_temp_y", label: "Temps Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_chem_x", label: "Chimie X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_chem_y", label: "Chimie Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_elec_x", label: "Élec X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_elec_y", label: "Élec Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_multi_x", label: "Multimedia X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_multi_y", label: "Multimedia Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_btn_x", label: "Boutons X (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
      { name: "pos_btn_y", label: "Boutons Y (%)", selector: { number: { min: 0, max: 100, mode: "slider" } } },
    ];
    return html`<ha-form .hass=${this.hass} .data=${this._config} .schema=${schema} @value-changed=${this._valueChanged}></ha-form>`;
  }
}

class LuminaSpaCard extends LitElement {
  static getConfigElement() { return document.createElement("lumina-spa-card-editor"); }
  static get properties() { return { hass: {}, config: {} }; }
  setConfig(config) { this.config = config; }

  _get(ent) {
    if (!this.hass || !ent || !this.hass.states[ent]) return { s: '?', u: '', a: false };
    const o = this.hass.states[ent];
    const val = o.state;
    const display = (!isNaN(parseFloat(val))) ? parseFloat(val).toFixed(1) : val;
    return { s: display, u: o.attributes.unit_of_measurement || '', a: (val !== 'off' && val !== 'unavailable' && val !== 'standby') };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const c = this.config;

    const water = this._get(c.entity_water_temp);
    const ambient = this._get(c.entity_ambient_temp);
    const ph = this._get(c.entity_ph);
    const orp = this._get(c.entity_orp);
    const lsi = this._get(c.entity_lsi);
    const tds = this._get(c.entity_tds);
    const pwr = this._get(c.entity_power);
    const amp = this._get(c.entity_amp);
    const cur = this._get(c.entity_current);
    const vac = this._get(c.entity_vac_current);
    const tv = this._get(c.entity_tv);
    const alexa = this._get(c.entity_alexa);
    const bub = this._get(c.switch_bubbles);
    const fil = this._get(c.switch_filter);
    const led = this._get(c.switch_light);

    return html`
      <ha-card style="background-image: url('${c.background_image || '/local/sparond.png'}');">
        <div class="header">${c.card_title || 'LUMINA HYPERION'}</div>

        <div class="glass" style="left:${c.pos_temp_x || 5}%; top:${c.pos_temp_y || 12}%;">
          <div class="titre">TEMPÉRATURES</div>
          <div class="row"><ha-icon icon="mdi:thermometer-water"></ha-icon> Eau: ${water.s}${water.u}</div>
          <div class="row"><ha-icon icon="mdi:thermometer"></ha-icon> Env: ${ambient.s}${ambient.u}</div>
        </div>

        <div class="glass" style="left:${c.pos_chem_x || 5}%; top:${c.pos_chem_y || 32}%;">
          <div class="titre">ANALYSE EAU</div>
          <div class="row"><ha-icon icon="mdi:ph"></ha-icon> pH: ${ph.s}</div>
          <div class="row"><ha-icon icon="mdi:flask-outline"></ha-icon> ORP: ${orp.s}</div>
          <div class="row"><ha-icon icon="mdi:water-check"></ha-icon> LSI: ${lsi.s} | TDS: ${tds.s}</div>
        </div>

        <div class="glass" style="left:${c.pos_elec_x || 5}%; top:${c.pos_elec_y || 55}%;">
          <div class="titre">ÉNERGIE</div>
          <div class="row"><ha-icon icon="mdi:lightning-bolt"></ha-icon> ${pwr.s}W</div>
          <div class="row"><ha-icon icon="mdi:current-ac"></ha-icon> Spa: ${amp.s}A | Courant: ${cur.s}A</div>
          <div class="row"><ha-icon icon="mdi:vacuum"></ha-icon> Aspirateur: ${vac.s}A</div>
        </div>

        <div class="glass" style="left:${c.pos_multi_x || 5}%; top:${c.pos_multi_y || 78}%;">
          <div class="titre">MULTIMEDIA</div>
          <div class="row">
            <ha-icon icon="mdi:television" style="color:${tv.a ? '#00d4ff' : 'white'}"></ha-icon> TV | 
            <ha-icon icon="mdi:google-assistant" style="color:${alexa.a ? '#00d4ff' : 'white'}"></ha-icon> Alexa
          </div>
        </div>

        <div class="btns" style="left:${c.pos_btn_x || 65}%; top:${c.pos_btn_y || 82}%;">
          <div class="btn ${bub.a ? 'on' : ''}" @click=${() => this.hass.callService("homeassistant", "toggle", {entity_id: c.switch_bubbles})}><ha-icon icon="mdi:airbubble"></ha-icon></div>
          <div class="btn ${fil.a ? 'on' : ''}" @click=${() => this.hass.callService("homeassistant", "toggle", {entity_id: c.switch_filter})}><ha-icon icon="mdi:hydro-power"></ha-icon></div>
          <div class="btn ${led.a ? 'on' : ''}" @click=${() => this.hass.callService("homeassistant", "toggle", {entity_id: c.switch_light})}><ha-icon icon="mdi:lightbulb"></ha-icon></div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { background-size: cover; background-position: center; height: 600px; position: relative; color: white; border-radius: 25px; overflow: hidden; border: none; }
    .header { position: absolute; top: 20px; left: 20px; font-weight: 900; font-size: 1.1em; text-shadow: 2px 2px 4px black; z-index: 10; letter-spacing: 2px; text-transform: uppercase; color: #00d4ff; }
    .glass { position: absolute; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 15px; padding: 12px; border: 1px solid rgba(255,255,255,0.1); min-width: 140px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
    .titre { font-size: 0.55em; color: #00d4ff; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px solid rgba(0,212,255,0.3); padding-bottom: 2px; }
    .row { display: flex; align-items: center; gap: 8px; font-size: 0.8em; font-weight: bold; margin-top: 4px; }
    .btns { position: absolute; display: flex; gap: 12px; }
    .btn { background: rgba(0,0,0,0.7); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .btn.on { background: #00d4ff; box-shadow: 0 0 25px #00d4ff; border: none; color: white; transform: scale(1.1); }
    ha-icon { --mdc-icon-size: 20px; }
  `;
}

customElements.define("lumina-spa-card-editor", LuminaSpaEditor);
customElements.define("lumina-spa-card", LuminaSpaCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "lumina-spa-card", name: "Lumina SPA Hyperion", preview: true });
