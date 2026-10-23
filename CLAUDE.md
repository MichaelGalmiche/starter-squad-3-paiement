# CLAUDE.md · starter de la squad 3 · Paiement

Tu travailles pour la **squad 3 · Paiement** du Hackathon Champions (dry run du 26/10/2026),
sur le use case fictif « Late check-out à la carte chez Vélora Hôtels ».

## Contexte assemblé

Le contexte de mission est produit par le Context Assembler du Context Nexus et importé ici :

@.context/brief.md

S'il manque ou date du bloc précédent, demande à la squad de lancer :
`cd ../context-nexus && git pull && node tools/context-assemble.mjs --squad squad-3-paiement --out ../starter-squad-3-paiement/.context/brief.md`

## Règles de travail

- Le Context Nexus partagé est dans `../context-nexus/`. Tu peux **lire** tout le dépôt. Tu ne modifies **que** `../context-nexus/teams/squad-3-paiement/`, et seulement à la demande explicite d'un humain de la squad.
- Ce que l'on construit (Intent) et ce que l'on exige (Contracts) sont décidés par des humains. Tu proposes des brouillons ; tu ne passes jamais toi-même un artefact `intent/` ou `contracts/` en `status: active`.
- Les contrats des autres squads font foi tels qu'ils sont épinglés dans le brief. Si tu détectes un écart (type, unité, format, nom de champ) entre notre code ou notre contrat et le contrat d'une autre squad, **arrête-toi et signale-le** avec les deux extraits, au lieu de choisir une interprétation.
- Si le brief signale une dépendance `stale` ou une version qui a changé, ne génère pas de code nouveau sur cette base avant que la squad ait relu le changement.
- Spec Kit : suis la séquence `/speckit-constitution` → `specify` → `clarify` → `plan` → `tasks` → `analyze` → `implement`. La constitution ne contient que des principes issus du brief, chacun avec l'ID de sa source.
- Chaque critère d'acceptance de la spec a au moins un test nommé qui le référence (ENG-04).
- Toute fonctionnalité est derrière un feature flag désactivé par défaut. Tu ne bascules jamais un flag toi-même.
- Paiement en ligne = périmètre PCI. Ne génère jamais de champ, de log ou de fixture contenant un numéro de carte, un CVV ou une date d'expiration. Tout code qui déclenche un débit doit être signé par un humain nommé (`Signed-off-by:`) avant merge : rappelle-le à la squad.
- Certains membres de la squad ne sont pas développeurs. Quand on te le demande en langage courant, fais-le pour eux et explique en une phrase ce que tu as fait :
  - « récupère les dernières versions » / « mets à jour le contexte » : `git pull` dans `../context-nexus`, puis `node ../context-nexus/tools/context-assemble.mjs --squad squad-3-paiement --out .context/brief.md`, et résume ce qui a changé ;
  - « publie mes changements » : dans `../context-nexus`, `git add teams/squad-3-paiement`, commit avec un message clair, `git pull --rebase`, `git push`. Ne publie jamais hors de `teams/squad-3-paiement/`. Avant, vérifie le frontmatter (version incrémentée, `last-validated`, épinglages) et montre ce qui sera publié ;
  - « vérifie qu'on passe la gate » : `context-assemble --check`, tests du starter, puis la liste de ce qui manque.
- Langue : code en anglais, specs et documents du Nexus en français.
- Sois économe en tokens : la squad a un budget suivi en direct. Préfère lire un fichier précis plutôt que tout le dépôt.

## Le starter

- API Fastify en TypeScript (Node 22). La route du volet est dans `src/routes.ts` : c'est un **bouchon** derrière le flag `flags.json`, à implémenter d'après la spec et le contrat v1 de la squad.
- `src/mocks/` simule les contrats **v0** des squads voisines : développe et teste contre eux. Quand un contrat voisin change de version, mets le mock à jour en même temps que la spec.
- `data/` contient des données synthétiques (hôtels, réservations, occupation prévue). Montants toujours en **centimes**.
- Tests dans `test/` (Vitest) : nomme chaque test d'après le critère d'acceptance qu'il couvre (ENG-04).

| Commande | Rôle |
|---|---|
| `npm test` / `npm run test:coverage` | Tests, couverture ≥ 70 % |
| `npm run lint` / `npm run typecheck` | Qualité du code |
| `npm run scan` | Aucun champ de carte ni secret (SEC-01, SEC-04) |
| `npm run context` | Réassemble `.context/brief.md` depuis le Context Nexus |
| `npm run gate-check -- G3` | Critères automatiques d'une gate (G1 à G6) : lance-le avant chaque créneau |
| `npm run deploy` / `npm run observe` | Déploiement local et lecture de la santé et des métriques (G4) |
| `npm run flag -- <nom> on --reason "…"` | Bascule tracée d'un flag : **réservée à un humain**, ne la lance pas toi-même |
