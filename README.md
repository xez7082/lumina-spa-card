# 🛁 SPA Card Master Ultimate

[![HACS](https://img.shields.io/badge/HACS-Default-blue.svg)](https://github.com/hacs/integration)
![Version](https://img.shields.io/github/v/release/xez7082/spa-card?include_prereleases)
[![License](https://img.shields.io/github/license/xez7082/spa-card)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/xez7082/spa-card/graphs/commit-activity)

**SPA Card Master** est une carte Lovelace premium conçue pour transformer votre dashboard Home Assistant en une console de contrôle futuriste. Alliant esthétique **Glassmorphism** et monitoring de précision, elle centralise toutes les données critiques de votre spa sur une interface unique et ultra-personnalisable.

---

## 🖼️ Aperçu

![Spa Preview](https://raw.githubusercontent.com/xez7082/lumina-spa-card/main/sparond2.png)
*[Image indicative de l'interface avec effet de flou et monitoring chimique]*

---

## ✨ Fonctionnalités Clés

* 💎 **Design Glassmorphism** : Interface translucide avec effet de flou d'arrière-plan (`backdrop-filter`) pour un rendu moderne et épuré.
* 🚨 **Alertes de Santé Intelligentes** : Les valeurs de **pH**, **ORP** et **Brome** changent de couleur (Rouge) dynamiquement dès qu'elles sortent des seuils de sécurité.
* 📏 **Éditeur Visuel Avancé (UI)** : Configuration complète via l'interface Home Assistant. Plus besoin de YAML pour régler les positions (X/Y) ou les tailles (W/H) des blocs.
* 📱 **Responsive & Tablet Ready** : Réglage de la hauteur globale en `% écran` (vh), parfait pour un affichage plein écran sur tablettes de contrôle.
* 🔘 **Contrôle Interactif** : Jusqu'à 8 boutons tactiles pour piloter filtration, bulles, pompes et éclairages LED.
* 📊 **Monitoring Système Exhaustif** : Emplacement pour 14 entités supplémentaires (puissance Watts, ampérage, statut TV, Alexa, aspirateur, etc.).

---

## 🧪 Analyse de l'eau (Seuils Automatiques)

La carte intègre une logique de surveillance basée sur les standards de l'industrie :

| Paramètre | Plage Idéale | Comportement Alerte |
| :--- | :--- | :--- |
| **pH** | `7.2` — `7.6` | 🔴 Rouge si déséquilibré |
| **ORP** | `> 650 mV` | 🔴 Rouge si désinfection insuffisante |
| **Brome** | `3.0` — `5.0` | 🔴 Rouge si hors limites |

---

## 📦 Installation

### Via HACS (Recommandé)
1. Ouvrez **HACS** → **Frontend**.
2. Cliquez sur les **3 points (⋮)** en haut à droite → **Dépôts personnalisés**.
3. Ajoutez l'URL suivante : `https://github.com/xez7082/spa-card`.
4. Sélectionnez la catégorie **Lovelace**.
5. Cliquez sur **Installer**.
6. Rafraîchissez votre navigateur (`Ctrl + F5`).

---

## 🧩 Configuration

La carte est dotée d'un éditeur "Drag & Drop" simulé par des curseurs de précision.

### Exemple de structure YAML (généré par l'UI) :
```yaml
type: custom:spa-card
card_title: "MON SPA"
card_height_v: 80
background_image: "/local/spa_bg.jpg"
entity_water_temp: sensor.spa_water_temp
entity_ph: sensor.spa_ph
entity_orp: sensor.spa_orp
pos_chem_x: 10
pos_chem_y: 45
chem_w: 250
