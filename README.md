# Starter · Squad 3 · Paiement

> Hackathon Champions AI4D, dry run du lundi 26 octobre 2026 · volet **Encaissement du supplément**.
> Use case fictif : late check-out à la carte chez Vélora Hôtels (société inventée, données 100 % synthétiques).

## Démarrer

**Sans rien installer (Codespace)** : connectez-vous à GitHub, puis

[![Ouvrir dans GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/zenika-dev/starter-squad-3-paiement)

Laissez vides les champs `ANTHROPIC_…`, cliquez sur **Create codespace**, attendez « ✓ Codespace prêt », puis dans le terminal :
`claude auth login` (connexion avec votre compte Claude), et parlez à l'agent depuis l'icône Claude.

**Sur votre poste** : une ligne installe les outils, clone ce dépôt et le contexte partagé dans `hackathon/`, et assemble le contexte.

```powershell
# Windows, dans PowerShell
$env:SQUAD = "squad-3-paiement"; irm https://raw.githubusercontent.com/zenika-dev/ai4d-hackathon-kit/main/installation/installer-prerequis.ps1 | iex
```

```bash
# macOS, dans Terminal
curl -fsSL https://raw.githubusercontent.com/zenika-dev/ai4d-hackathon-kit/main/installation/installer-prerequis.sh | bash -s -- squad-3-paiement
```

Puis `cd ~/hackathon/starter-squad-3-paiement`, `claude auth login` et `claude`.

Pas à pas complet : [fiche de démarrage, section Squad 3](https://github.com/zenika-dev/ai4d-hackathon-kit/blob/main/commun/fiche-demarrage.md#squad-3).

## Ce que contient ce dépôt

| Élément | Rôle |
|---|---|
| `CLAUDE.md` | Consignes de l'agent pour la squad 3 : contexte assemblé, règles de publication, Spec Kit |
| `.devcontainer/` | Environnement Codespace : Node 22, Claude Code, Spec Kit, contexte partagé cloné à côté |
| `.specify/`, `.claude/skills/` | Spec Kit initialisé pour Claude : `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`… |
| `.context/brief.md` | Contexte de la squad, généré par `context-assemble` (non versionné) |

Le code du starter (API TypeScript, tests, CI, feature flags) est ajouté par l'équipe Zenika avant le 26/10.

## Liens

- Fiche de la squad : [squads/squad-3-paiement/KIT.md](https://github.com/zenika-dev/ai4d-hackathon-kit/blob/main/squads/squad-3-paiement/KIT.md)
- Contexte partagé : [ai4d-hackathon-context-nexus](https://github.com/zenika-dev/ai4d-hackathon-context-nexus) · dossier de la squad : [teams/squad-3-paiement](https://github.com/zenika-dev/ai4d-hackathon-context-nexus/tree/main/teams/squad-3-paiement)
