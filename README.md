# 🛁 Lumina Spa Card

[![HACS](https://img.shields.io/badge/HACS-Default-blue.svg)](https://github.com/hacs/integration)
![Version](https://img.shields.io/github/v/release/xez7082/lumina-spa-card?include_prereleases)
![License](https://img.shields.io/github/license/xez7082/lumina-spa-card)

**Lumina Spa Card** est une carte Lovelace premium pour Home Assistant, conçue pour transformer le monitoring de votre spa en une interface futuriste. Surveillez la température, la chimie de l'eau et pilotez vos équipements avec style.

---

## 🖼️ Aperçu

![Lumina Spa Preview](sparond2.png)

---

## ✨ Fonctionnalités

* 💎 **Design Glassmorphism** : Interface translucide avec flou d'arrière-plan (backdrop-filter).
* 🌡️ **Double Température** : Suivi de l'eau et de l'environnement.
* 🧪 **Laboratoire de Chimie** : pH, ORP, Brome (Br) et Alcalinité (TAC).
* ⚡ **Système Énergie** : Monitoring de la puissance (Watts) et ampérage du SPA + **Aspirateur**.
* 🔘 **Commandes Intégrées** : Boutons interactifs pour les bulles, le filtre et les **LED**.
* 📊 **Tableau AquaChek** : Références idéales directement affichées sur la carte.
* 📍 **Positionnement Libre** : Déplacez chaque bloc (X/Y) via l'éditeur visuel.

---

## 📦 Installation via HACS

1. Ouvrir **HACS** → **Frontend** → **⋮** → **Dépôts personnalisés**.
2. Ajouter l'URL de ce dépôt : `https://github.com/xez7082/lumina-spa-card`.
3. Choisir le type **Lovelace**.
4. Installer **Lumina Spa Card**.
5. Rafraîchir votre navigateur (**Ctrl + F5**).

---

## 🧩 Exemple de configuration (YAML)

La carte dispose d'un **éditeur visuel complet**, mais voici à quoi ressemble la configuration YAML :

```yaml
type: custom:lumina-spa-card
card_title: "SPA HYPERION"
background_image: "/local/sparond2.jpg"
show_buttons: true
show_table: true
entity_water_temp: sensor.spa_water_temp
entity_ambient_temp: sensor.spa_air_temp
entity_ph: sensor.spa_ph
entity_orp: sensor.spa_orp
entity_bromine: sensor.spa_bromine
entity_alkalinity: sensor.spa_tac
entity_power: sensor.spa_watts
entity_amp: sensor.spa_amps
entity_vac_current: sensor.aspirateur_current
switch_bubbles: switch.spa_bulles
switch_filter: switch.spa_filtration
switch_light: switch.spa_led
