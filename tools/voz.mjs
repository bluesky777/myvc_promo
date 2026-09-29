#!/usr/bin/env node
/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * GENERA LA VOZ DE LOS VÍDEOS DE AYUDA.
 *
 *     node tools/voz.mjs            todos los guiones
 *     node tools/voz.mjs planilla   sólo los guiones cuya ruta contiene «planilla»
 *     node tools/voz.mjs --limpia   todos, y borra las voces que ya no dice ningún guion
 *
 * Carga cada `src/ayuda/**\/guion*.ts`, saca de sus exportaciones los pasos (lo que tenga `desde` y
 * `texto`) y las tarjetas (lo que tenga `hiciste` y `seVe`), y genera con edge-tts el MP3 de cada
 * texto que todavía no lo tenga: `public/ayuda-voz/<huella>.mp3`. Después mide cada MP3 y escribe
 * `src/ayuda/voces.json` (huella → segundos), que es lo que usa `compruebaElGuion`.
 *
 * La huella tiene que ser la de `src/ayuda/voz.tsx`. Si se cambia la voz o la velocidad, hay que
 * borrar public/ayuda-voz y regenerar: la huella sólo mira el texto.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';

const VOZ = 'es-CO-SalomeNeural';
const VELOCIDAD = '+6%';
const DIR = 'public/ayuda-voz';
const MANIFIESTO = 'src/ayuda/voces.json';
const CACHE = 'node_modules/.cache/voz';
fs.mkdirSync(CACHE, { recursive: true });

const huella = (texto) => {
	let h = 0x811c9dc5;
	for (const c of texto.normalize('NFC')) {
		h ^= c.codePointAt(0);
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h.toString(16).padStart(8, '0');
};

const guiones = (d) =>
	fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(d, e.name);
		return e.isDirectory() ? guiones(p) : /^guion.*\.ts$/.test(e.name) ? [p] : [];
	});

const textosDe = (valor, fuera) => {
	const visto = new Set();
	const anda = (v) => {
		if (!v || typeof v !== 'object' || visto.has(v)) { return; }
		visto.add(v);
		if (Array.isArray(v)) { v.forEach(anda); return; }
		if (typeof v.texto === 'string' && typeof v.desde === 'number') { fuera.add(v.voz ?? v.texto); }
		if (typeof v.hiciste === 'string' && typeof v.seVe === 'string') { fuera.add(v.voz ?? v.despues ?? v.seVe); }
		Object.values(v).forEach(anda);
	};
	anda(valor);
};

globalThis.SIN_PUERTA_DE_VOZ = true;
const limpia = process.argv.includes('--limpia');
const filtro = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? '';
const textos = new Set();
for (const g of guiones('src/ayuda').filter((g) => g.includes(filtro))) {
	const r = await esbuild.build({
		entryPoints: [g], bundle: true, write: false, format: 'esm', platform: 'node', packages: 'external',
		logLevel: 'silent', loader: { '.png': 'empty', '.jpg': 'empty', '.svg': 'empty', '.json': 'json' },
	});
	/* Dentro del repo y no como `data:`, para que resuelva `remotion` y `react` en node_modules. */
	const tmp = path.resolve(CACHE, `${g.replace(/[\/]/g, '_')}.mjs`);
	fs.writeFileSync(tmp, r.outputFiles[0].text);
	try {
		textosDe(Object.values(await import(tmp)), textos);
	} catch (e) {
		console.error(`${g}: ${e.message.split('\n')[0].slice(0, 200)}`);
	}
}

fs.mkdirSync(DIR, { recursive: true });
const voces = fs.existsSync(MANIFIESTO) ? JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8')) : {};
let nuevas = 0;
for (const t of textos) {
	const h = huella(t);
	const mp3 = path.join(DIR, `${h}.mp3`);
	if (!fs.existsSync(mp3)) {
		execFileSync('uvx', ['edge-tts', '--voice', VOZ, `--rate=${VELOCIDAD}`, '--text', t, '--write-media', mp3], { stdio: 'ignore' });
		nuevas++;
	}
	if (!(h in voces)) {
		const s = execFileSync('npx', ['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
		voces[h] = Math.round(parseFloat(s.trim().split('\n').pop()) * 100) / 100;
	}
}
/*
 * Varias sesiones pueden correr esto a la vez: se relee el manifiesto y se escribe bajo un candado
 * de directorio (`mkdir` es atómico), para no perder lo que otra escribió mientras tanto.
 */
const CANDADO = `${MANIFIESTO}.lock`;
while (true) {
	try { fs.mkdirSync(CANDADO); break; } catch { await new Promise((r) => setTimeout(r, 200)); }
}
try {
	const actual = fs.existsSync(MANIFIESTO) ? JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8')) : {};
	const junto = { ...actual, ...voces };
	if (limpia && !filtro) {
		const usadas = new Set([...textos].map(huella));
		for (const h of Object.keys(junto)) {
			if (!usadas.has(h)) { delete junto[h]; fs.rmSync(path.join(DIR, `${h}.mp3`), { force: true }); }
		}
		for (const f of fs.readdirSync(DIR)) {
			if (!usadas.has(f.replace(/\.mp3$/, ''))) { fs.rmSync(path.join(DIR, f)); }
		}
	}
	const ordenado = Object.fromEntries(Object.entries(junto).sort(([a], [b]) => a.localeCompare(b)));
	fs.writeFileSync(MANIFIESTO, `${JSON.stringify(ordenado, null, '\t')}\n`);
} finally {
	fs.rmdirSync(CANDADO);
}
console.log(`${textos.size} textos, ${nuevas} voces nuevas`);
