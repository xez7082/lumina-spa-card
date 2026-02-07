🛁 SPA Card Master Ultimate
SPA Card Master est la solution ultime pour transformer votre dashboard Home Assistant en une véritable console de contrôle futuriste pour votre spa. Alliant esthétique Glassmorphism et monitoring de précision, elle centralise toutes les données critiques de votre bassin.

🖼️ Aperçu de l'interface
✨ Points Forts
💎 Design Glassmorphism : Effet de flou d'arrière-plan (backdrop-filter) pour une intégration élégante sur n'importe quel fond.

🚨 Smart Alerts : Colorisation dynamique des capteurs. Les valeurs de pH, ORP et Brome passent au rouge instantanément en cas de dépassement des seuils de sécurité.

📏 Full Control (UI) : Éditeur visuel complet avec 6 onglets pour régler au pixel près la position (X/Y) et la taille (W/H) de chaque élément.

📱 Adaptative Height : Réglage de la hauteur de la carte en % de l'écran (vh), idéal pour un affichage plein écran sur tablettes (Fully Kiosk).

🛠️ Ultra-Complet :

Jusqu'à 8 boutons de commande (Bulles, LED, Pompe, etc.).

Jusqu'à 14 indicateurs système (Énergie, Aspirateur, Statut TV, etc.).

Monitoring Chimie complet : pH, ORP, Brome, TAC.

Intégration Flux Vidéo (Caméra).

🧪 Seuils de Sécurité Intégrés
La carte surveille pour vous la qualité de l'eau : | Paramètre | Plage Idéale | Alerte Visuelle | | :--- | :--- | :--- | | pH | 7.2 — 7.6 | 🔴 Rouge si hors plage | | ORP | > 650 mV | 🔴 Rouge si trop bas | | Brome | 3.0 — 5.0 | 🔴 Rouge si hors plage |

📦 Installation
Via HACS (Recommandé)
Ouvrez HACS → Frontend.

Cliquez sur les 3 points (⋮) en haut à droite → Dépôts personnalisés.

Collez l'URL : https://github.com/xez7082/spa-card.

Sélectionnez la catégorie Lovelace.

Recherchez "SPA Master Ultimate" et installez.

Redémarrez/Rafraîchissez votre interface Home Assistant.

🧩 Utilisation & Configuration
Plus besoin de toucher au YAML ! Ajoutez la carte à votre tableau de bord et utilisez l'éditeur visuel interactif pour configurer vos entités.

Onglets de l'éditeur :
Général : Titre, Image de fond, Hauteur de la carte.

Boutons : Assignation des 8 switchs et icônes.

Sondes : Températures et capteurs chimiques.

Système : Les 14 entités pour le suivi technique.

Caméra : Intégration live de votre caméra de surveillance.

Idéal : Affichage du tableau de rappel des cibles AquaChek.

🛠️ Développement
Si vous souhaitez modifier le style ou ajouter des fonctions :

Bash
# Clonez le dépôt
git clone https://github.com/xez7082/spa-card.git
📜 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE
 pour plus de détails.
