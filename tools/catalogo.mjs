#!/usr/bin/env node
/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PONE AL DÍA CATALOGO-AYUDA.json DESDE LOS GUIONES.
 *
 *     node tools/catalogo.mjs
 *
 * Por cada vídeo del catálogo carga su `guion` y reescribe `titulo`, `dura_s` y `capitulos` con lo
 * que exporta (`TITULO`, `DURACION`, `CAPITULOS`, a `FPS`). Lo demás (rutas, serie, youtube…) no lo
 * toca: eso no está en el guion. Avisa de los guiones a los que les falta algo y de los MP4 que
 * faltan. El guion es la fuente; este fichero, la copia.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */
import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';

const CATALOGO = 'CATALOGO-AYUDA.json';
const CACHE = 'node_modules/.cache/catalogo';
fs.mkdirSync(CACHE, { recursive: true });
globalThis.SIN_PUERTA_DE_VOZ = true;

const c = JSON.parse(fs.readFileSync(CATALOGO, 'utf8'));
const redondea = (s) => Math.round(s * 10) / 10;
const avisos = [];

for (const v of c.videos) {
	const r = await esbuild.build({
		entryPoints: [v.guion], bundle: true, write: false, format: 'esm', platform: 'node', packages: 'external',
		logLevel: 'silent', loader: { '.png': 'empty', '.jpg': 'empty', '.svg': 'empty', '.json': 'json' },
	});
	const tmp = path.resolve(CACHE, `${v.clave}.mjs`);
	fs.writeFileSync(tmp, r.outputFiles[0].text);
	const g = await import(tmp);
	const fps = g.FPS ?? c.fps;
	if (g.CLAVE && g.CLAVE !== v.clave) { avisos.push(`${v.clave}: el guion dice CLAVE ${g.CLAVE}`); }
	if (g.TITULO) { v.titulo = g.TITULO; } else { avisos.push(`${v.clave}: sin TITULO`); }
	if (g.DURACION) { v.dura_s = redondea(g.DURACION / fps); } else { avisos.push(`${v.clave}: sin DURACION`); }
	if (g.CAPITULOS) {
		v.capitulos = g.CAPITULOS.map((k) => ({ s: redondea(k.desde / fps), titulo: k.titulo }));
	} else { avisos.push(`${v.clave}: sin CAPITULOS`); }
	if (!fs.existsSync(v.fichero)) { avisos.push(`${v.clave}: falta ${v.fichero}`); }
}

c.version = new Date().toISOString().slice(0, 10);
c._leeme = c._leeme.map((l) =>
	l.startsWith('volver a escribirlo a mano') ? 'volver a pasar `node tools/catalogo.mjs`, que lo reescribe desde los guiones.' : l);
fs.writeFileSync(CATALOGO, `${JSON.stringify(c, null, 2)}\n`);
const total = c.videos.reduce((n, v) => n + v.dura_s, 0);
console.log(`${c.videos.length} vídeos, ${Math.round(total / 60)} min en total`);
console.log(avisos.join('\n') || 'sin avisos');
