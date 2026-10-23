#!/usr/bin/env bash
# Prépare le Codespace d'une squad : outils, Context Nexus cloné à côté, contexte assemblé.
set -euo pipefail

NEXUS_URL="https://github.com/zenika-dev/ai4d-hackathon-context-nexus.git"
SQUADS="squad-1-offre squad-2-prix squad-3-paiement squad-4-experience"
STARTER_DIR="$(pwd)"
NEXUS_DIR="$(dirname "$STARTER_DIR")/context-nexus"
export PATH="$HOME/.local/bin:$PATH"

echo "▸ uv et Spec Kit (${SPEC_KIT_REF:-main})"
command -v uv >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | env UV_NO_MODIFY_PATH=1 sh
uv tool install --force --quiet --python 3.13 specify-cli --from "git+https://github.com/github/spec-kit.git@${SPEC_KIT_REF:-main}"

echo "▸ Claude Code"
command -v claude >/dev/null || curl -fsSL https://claude.ai/install.sh | bash

# PATH et secret vide : à chaque nouveau terminal.
grep -q 'Hackathon Champions' "$HOME/.bashrc" 2>/dev/null || cat >> "$HOME/.bashrc" <<'RC'
# Hackathon Champions
export PATH="$HOME/.local/bin:$PATH"
for v in ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN ANTHROPIC_BASE_URL; do [ -z "${!v:-}" ] && unset "$v"; done
RC

echo "▸ Context Nexus"
# Vrai dossier dans le projet (visible dans l'explorateur, on peut y copier-coller des fichiers),
# exclu de git via .git/info/exclude : rien à committer dans le starter.
NEXUS_REAL="$STARTER_DIR/context-nexus"
[ -d "$NEXUS_REAL/.git" ] || git clone --quiet "$NEXUS_URL" "$NEXUS_REAL"
grep -qx '/context-nexus' "$STARTER_DIR/.git/info/exclude" 2>/dev/null || echo '/context-nexus' >> "$STARTER_DIR/.git/info/exclude"
# Les chemins ../context-nexus des consignes et des commandes restent valables.
[ -e "$NEXUS_DIR" ] || ln -s "$NEXUS_REAL" "$NEXUS_DIR"

# La squad se déduit du nom du dépôt starter (starter-squad-1-offre → squad-1-offre), ou de $SQUAD.
SQUAD="${SQUAD:-$(basename "$STARTER_DIR" | sed 's/^starter-//')}"
if [[ " $SQUADS " == *" $SQUAD "* ]]; then
  echo "▸ Contexte de $SQUAD"
  node "$NEXUS_DIR/tools/context-assemble.mjs" --squad "$SQUAD" --out "$STARTER_DIR/.context/brief.md" | tail -3
else
  echo "⚠ Squad non reconnue (« $SQUAD »). Lancez à la main :"
  echo "  node ../context-nexus/tools/context-assemble.mjs --squad <squad> --out .context/brief.md"
fi

if [ -f package.json ]; then echo "▸ npm install"; npm install --silent; fi
[ -d .specify ] || echo "⚠ Spec Kit n'est pas initialisé dans ce starter : specify init --here --integration claude"

echo
echo "✓ Codespace prêt."
echo "  1. Connectez Claude à votre compte : claude auth login"
echo "  2. Puis parlez à l'agent : icône Claude à gauche, ou claude dans le terminal"
