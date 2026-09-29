#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════════════════════
# RENDERIZA UN VÍDEO SIN NADIE MÁS RENDERIZANDO A LA VEZ, y lo pasa por el revisor de glitches.
#
#     tools/render-solo.sh <composición> <salida.mp4> [entrada.tsx]
#
# Con el Chrome del sistema, varios renders a la vez metían fotogramas en mosaico 3×3 (2026-09-28: 23
# de 27 vídeos). Con el headless de Remotion (ver remotion.config.ts) aguanta dos a la vez sin uno
# solo, así que hay DOS plazas: se hace cola con candados de directorio (`mkdir` es atómico) y
# después se revisa el MP4 con `tools/revisar-video.mjs`. Sale con el código del revisor: 1 si
# quedó algún parpadeo.
# ═══════════════════════════════════════════════════════════════════════════════════════════════
set -u
cd "$(dirname "$0")/.."
COMP="$1"; SALIDA="$2"; ENTRADA="${3:-}"
CANDADO=""
until [ -n "$CANDADO" ]; do
	for c in /tmp/myvc-promo-render.lock.2 /tmp/myvc-promo-render.lock; do
		if mkdir "$c" 2>/dev/null; then CANDADO="$c"; break; fi
	done
	[ -n "$CANDADO" ] || sleep 5
done
trap 'rmdir "$CANDADO"' EXIT
if [ -n "$ENTRADA" ]; then
	npx remotion render "$ENTRADA" "$COMP" "$SALIDA" ${RENDER_FLAGS:-} > /tmp/myvc-render-$$.log 2>&1
else
	npx remotion render "$COMP" "$SALIDA" ${RENDER_FLAGS:-} > /tmp/myvc-render-$$.log 2>&1
fi
R=$?
if [ $R -ne 0 ]; then tail -20 /tmp/myvc-render-$$.log; echo "FALLO EL RENDER de $COMP"; exit 2; fi
node tools/revisar-video.mjs "$SALIDA" --fotos "${TMPDIR:-/tmp}/revision-$(basename "$SALIDA" .mp4)"
