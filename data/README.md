# Données synthétiques du starter

Données **100 % fictives** (Vélora Hôtels n'existe pas), suffisantes pour développer et tester.
Les jeux de données complets (occupation prévue, télémétrie de 30 jours, carte de l'ancien processus) sont remis le jour J.

| Fichier | Contenu |
|---|---|
| `hotels.json` | Les 5 hôtels pilotes et leurs horaires (référentiel `programme/late-checkout/knowledge/hotels-pilotes.md`) |
| `reservations.json` | 6 réservations : confirmées, annulée, LCO déjà acheté ; prix de la nuit en centimes |
| `occupation-prevue.json` | Occupation prévue (%) par hôtel, nuits du 1er au 7 novembre 2026 (si présent) |
| `purchase-events.json` | Flux d'événements d'achat au format du contrat Expérience (si présent) |
