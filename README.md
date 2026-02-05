# Lumina Spa Card

**Lumina Spa Card** est une carte Lovelace premium pour Home Assistant permettant de surveiller facilement l’état de votre spa : températures, qualité de l’eau et consommation électrique, le tout avec un design moderne et élégant.

---

## ✨ Fonctionnalités

* 🌡️ Température de l’eau et de l’air
* 🧪 Qualité de l’eau (pH, ORP)
* ⚡ Consommation électrique et intensité
* 🖼️ Image de fond personnalisable
* 💎 Design "glass" moderne
* 🔌 Compatible HACS (frontend)

---

## 📦 Installation via HACS

1. Ouvrir **HACS → Frontend → ⋮ → Dépôts personnalisés**
2. Ajouter l’URL du dépôt GitHub
3. Choisir le type **Frontend**
4. Installer **Lumina Spa Card**
5. Redémarrer Home Assistant
6. Rafraîchir le navigateur (**Ctrl + F5**)

---

## 🛠️ Installation manuelle

1. Copier `lumina-spa-card.js` dans :

   ```
   /config/www/
   ```
2. Ajouter la ressource Lovelace :

   ```
   URL : /local/lumina-spa-card.js
   Type : module
   ```
3. Rafraîchir le navigateur.

---

## 🧩 Exemple de configuration

```yaml
type: custom:lumina-spa-card
card_title: SPA MONITORING
background_image: /local/community/lumina-spa-card/preview.png
entity_water_temp: sensor.spa_water_temp
entity_air_temp: sensor.spa_air_temp
entity_ph: sensor.spa_ph
entity_orp: sensor.spa_orp
entity_power: sensor.spa_power
entity_amps: sensor.spa_current
```

---

## 🖼️ Aperçu

Ajoutez une capture d’écran ici :

```
preview.png
```

---

## 🗺️ Feuille de route

* Animations d’eau et vapeur
* Couleur dynamique selon température
* Mode sombre adaptatif
* Jauges circulaires pour la consommation

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork du dépôt
2. Création d’une branche
3. Pull Request

---

## 📄 Licence

Licence **MIT**.

---

## 👤 Auteur

**xez7082**
