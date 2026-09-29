#!/usr/bin/env node
/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PASADA DE GLITCHES SOBRE EL MP4 MONTADO: resta cada fotograma del anterior y avisa de lo que
 * aparece, desaparece o parpadea de golpe.
 *
 *     node tools/revisar-video.mjs out/ayuda/<clave>.mp4 [--fotos <dir>] [--picos]
 *
 * Es el método de RELEVO-AYUDA.md §6 --restar dos fotogramas seguidos--, pero sobre el vídeo de
 * verdad y no sobre stills: decodifica con el ffmpeg que trae Remotion
 * (`@remotion/compositor-darwin-arm64/ffmpeg`), en gris y a 480×270, que sobra para ver un salto y
 * hace que un vídeo se revise en un par de segundos.
 *
 * QUÉ CUENTA COMO SOSPECHOSO. El H.264 mete ruido --en cada fotograma clave cambia el 1 % del cuadro
 * en unos 30 niveles de gris--, así que un píxel sólo «cambia» si salta más de 60: eso deja fuera
 * el ruido y deja dentro cualquier texto o caja que aparezca.
 *
 *   PARPADEO  el fotograma t se separa del anterior Y del siguiente, pero el anterior y el siguiente
 *             se parecen entre sí: algo estuvo un solo fotograma. Nunca es a propósito.
 *   GOLPE     un salto en un solo fotograma, con quietud antes y después, dentro de la franja de la
 *             aplicación (la cabecera y el rótulo cambian en seco en cada paso, y eso es a propósito).
 *             Puede ser legítimo --un diálogo que abre en seco, como en la aplicación--: se lista con
 *             su foto para mirarlo, no se da por fallo sin verlo.
 *
 * Con `--fotos` guarda de cada sospechoso sus tres fotogramas (t-1, t, t+1) en fila, sacados de los
 * mismos datos que se restaron: pedirle a ffmpeg «el fotograma t» con -ss se equivoca en uno.
 * Sale con código 1 si hay algún PARPADEO.
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BIN = path.join(RAIZ, 'node_modules/@remotion/compositor-darwin-arm64');
/* Los binarios buscan sus .dylib en el directorio de trabajo: se lanzan desde el suyo. */
const CON_LIBS = { cwd: BIN, env: { ...process.env, DYLD_LIBRARY_PATH: BIN } };

const W = 480;
const H = 270;
const N = W * H;
/** Diferencia de gris a partir de la cual un píxel «cambió». Por debajo es ruido del códec. */
const UMBRAL_PIXEL = 60;
/** Un golpe: al menos este tanto del fotograma cambia en un solo paso... */
const GOLPE = 0.0015;
/** ...y alrededor casi nada se mueve. */
const QUIETO = 0.0003;
/** La franja de la aplicación, entre la cabecera (108 px) y el rótulo (desde 876), en filas de 480×270. */
const DENTRO = [Math.round(108 / 4), Math.round(876 / 4)];

const args = process.argv.slice(2);
const arg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--fotos');
const video = arg ? path.resolve(arg) : null;
const iFotos = args.indexOf('--fotos');
const dirFotos = iFotos >= 0 ? path.resolve(args[iFotos + 1]) : null;
if (!video) {
	console.error('uso: node tools/revisar-video.mjs <video.mp4> [--fotos <dir>] [--picos]');
	process.exit(2);
}

const fps = (() => {
	const r = spawnSync(path.join(BIN, 'ffprobe'), ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', video], CON_LIBS);
	const [a, b] = String(r.stdout).trim().split('/').map(Number);
	return a / (b || 1);
})();

const frames = [];
await new Promise((ok, mal) => {
	const p = spawn(path.join(BIN, 'ffmpeg'), ['-v', 'error', '-i', video, '-vf', `scale=${W}:${H},format=gray`, '-f', 'image2pipe', '-c:v', 'rawvideo', '-pix_fmt', 'gray', '-'], CON_LIBS);
	let resto = Buffer.alloc(0);
	p.stdout.on('data', (d) => {
		resto = Buffer.concat([resto, d]);
		while (resto.length >= N) {
			frames.push(Buffer.from(resto.subarray(0, N)));
			resto = resto.subarray(N);
		}
	});
	p.stderr.on('data', (d) => process.stderr.write(d));
	p.on('close', (c) => (c === 0 ? ok() : mal(new Error(`ffmpeg salió con ${c}`))));
});

/** Qué fracción del fotograma cambió entre a y b: entera, y dentro de la franja con su caja. */
function resta(a, b) {
	let n = 0, nd = 0, x0 = W, y0 = H, x1 = -1, y1 = -1;
	for (let i = 0; i < N; i++) {
		if (Math.abs(a[i] - b[i]) > UMBRAL_PIXEL) {
			n++;
			const x = i % W, y = (i / W) | 0;
			if (y >= DENTRO[0] && y < DENTRO[1]) {
				nd++;
				if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
			}
		}
	}
	return { f: n / N, fd: nd / N, caja: nd ? [x0 * 4, y0 * 4, (x1 + 1) * 4, (y1 + 1) * 4] : null };
}

const dd = [0];
const cajas = [null];
for (let t = 1; t < frames.length; t++) {
	const r = resta(frames[t - 1], frames[t]);
	dd.push(r.fd);
	cajas.push(r.caja);
}

const hallazgos = [];
for (let t = 1; t < frames.length - 1; t++) {
	if (dd[t] > GOLPE && dd[t + 1] > GOLPE) {
		const vuelta = resta(frames[t - 1], frames[t + 1]).fd;
		if (vuelta < dd[t] * 0.25) { hallazgos.push({ tipo: 'PARPADEO', t, f: dd[t], caja: cajas[t] }); continue; }
	}
	if (dd[t] > GOLPE && dd[t - 1] < QUIETO && dd[t + 1] < QUIETO) {
		hallazgos.push({ tipo: 'GOLPE', t, f: dd[t], caja: cajas[t] });
	}
}

if (args.includes('--picos')) {
	const picos = dd.map((f, t) => ({ f, t })).sort((x, y) => y.f - x.f).slice(0, 12);
	for (const p of picos) {
		console.log(`  pico f${p.t} ${(p.f * 100).toFixed(2)}%  antes ${(dd[p.t - 1] * 100).toFixed(2)}%  después ${((dd[p.t + 1] ?? 0) * 100).toFixed(2)}%`);
	}
}

const mmss = (t) => { const s = t / fps; return `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`; };
const cuantos = (tipo) => hallazgos.filter((h) => h.tipo === tipo).length;
console.log(`${path.basename(video)} · ${frames.length} fotogramas · ${cuantos('PARPADEO')} parpadeos · ${cuantos('GOLPE')} golpes`);
for (const h of hallazgos) {
	console.log(`  ${h.tipo.padEnd(8)} f${String(h.t).padStart(5)} ${mmss(h.t)}  ${(h.f * 100).toFixed(1)}% del cuadro  caja ${h.caja?.join(',')}`);
}

/** Un PNG en gris, a mano: no hay dependencias de imagen en esta máquina. */
function png(ancho, alto, gris) {
	const tabla = new Int32Array(256).map((_, n) => {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		return c;
	});
	const crc = (b) => { let c = -1; for (const x of b) c = tabla[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
	const trozo = (tipo, datos) => {
		const t = Buffer.concat([Buffer.from(tipo), datos]);
		const l = Buffer.alloc(4); l.writeUInt32BE(datos.length);
		const c = Buffer.alloc(4); c.writeUInt32BE(crc(t));
		return Buffer.concat([l, t, c]);
	};
	const cab = Buffer.alloc(13); cab.writeUInt32BE(ancho, 0); cab.writeUInt32BE(alto, 4); cab[8] = 8; cab[9] = 0;
	const crudo = Buffer.alloc((ancho + 1) * alto);
	for (let y = 0; y < alto; y++) gris.copy(crudo, y * (ancho + 1) + 1, y * ancho, (y + 1) * ancho);
	return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), trozo('IHDR', cab), trozo('IDAT', deflateSync(crudo)), trozo('IEND', Buffer.alloc(0))]);
}

if (dirFotos && hallazgos.length) {
	mkdirSync(dirFotos, { recursive: true });
	const base = path.basename(video, '.mp4');
	for (const h of hallazgos) {
		const fila = Buffer.alloc(W * 3 * H);
		[h.t - 1, h.t, h.t + 1].forEach((t, k) => {
			const f = frames[Math.min(Math.max(t, 0), frames.length - 1)];
			for (let y = 0; y < H; y++) f.copy(fila, y * W * 3 + k * W, y * W, (y + 1) * W);
		});
		writeFileSync(path.join(dirFotos, `${base}-f${h.t}.png`), png(W * 3, H, fila));
	}
}

process.exit(cuantos('PARPADEO') > 0 ? 1 : 0);
