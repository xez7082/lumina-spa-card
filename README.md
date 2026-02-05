# Lumina Spa Card 🛁

Une carte Home Assistant inspirée du style Lumina Energy pour gérer votre spa.

## Installation via HACS
1. Ouvrez HACS.
2. Cliquez sur les 3 points (en haut à droite) -> **Custom Repositories**.
3. Ajoutez l'URL de ce dépôt GitHub.
4. Sélectionnez **Lovelace** comme catégorie.
5. Cliquez sur **Install**.

## Configuration
Ajoutez une carte manuelle dans votre dashboard :

```yaml
type: 'custom:lumina-spa-card'
entity_water_temp: sensor.spa_water_temp
entity_air_temp: sensor.spa_air_temp
entity_ph: sensor.spa_ph
entity_orp: sensor.spa_orp
entity_power: sensor.spa_consumption
entity_amps: sensor.spa_amperage
