import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';

import VOCES from './voces.json';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA VOZ. Cada rótulo se dice en voz alta, y el audio se encuentra **por su texto**, no por el vídeo:
 * `public/ayuda-voz/<huella>.mp3`, con la huella sacada del texto hablado. Así ningún guion tiene que
 * declarar sus audios: si el texto cambia, cambia la huella, y hasta que `tools/voz.mjs` genere el
 * nuevo el paso sale mudo en vez de decir lo de antes.
 *
 * `voces.json` lo escribe `tools/voz.mjs`: huella → segundos. Es lo que deja a `compruebaElGuion`
 * exigir que cada paso dure lo que tarda en decirse.
 *
 * La voz es es-CO-SalomeNeural (la eligió Joseth el 2026-09-29 oyendo el piloto de la planilla).
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */

/** La voz entra un poco después que el rótulo: primero se ve, luego se oye. */
export const RETRASO_VOZ = 6;
/** Lo que queda de silencio entre el final de una frase y el rótulo siguiente. */
export const RESPIRO_VOZ = 6;

/** FNV-1a de 32 bits: la misma huella aquí y en `tools/voz.mjs`. */
export function huella(texto: string): string {
	let h = 0x811c9dc5;
	for (const c of texto.normalize('NFC')) {
		h ^= c.codePointAt(0)!;
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h.toString(16).padStart(8, '0');
}

/** Los segundos que dura ese texto dicho, o `null` si todavía no se ha generado. */
export function segundosDeVoz(texto: string): number | null {
	return (VOCES as Record<string, number>)[huella(texto)] ?? null;
}

/** Dice `texto` a partir del fotograma `en` (relativo a la secuencia que lo contiene). */
export const Voz: React.FC<{ texto: string; en: number }> = ({ texto, en }) =>
	segundosDeVoz(texto) === null ? null : (
		<Sequence from={en} layout="none">
			<Audio src={staticFile(`ayuda-voz/${huella(texto)}.mp3`)} />
		</Sequence>
	);

/*
 * LOS EFECTOS. Están sintetizados (`public/ayuda-sfx`), no bajados de ningún sitio: nada que licenciar.
 * Sólo suenan en los vídeos de ayuda: el `Cursor` y lo demás son comunes con los promocionales.
 */
export type Efecto = 'clic' | 'tecla1' | 'tecla2' | 'tecla3' | 'aviso' | 'whoosh' | 'tarjeta';

const VOLUMEN: Record<Efecto, number> = { clic: 0.5, tecla1: 0.45, tecla2: 0.45, tecla3: 0.45, aviso: 0.4, whoosh: 0.35, tarjeta: 0.3 };

export const useSuena = (): boolean => useVideoConfig().id.startsWith('Ayuda-');

export const Efecto: React.FC<{ cual: Efecto; en: number }> = ({ cual, en }) =>
	useSuena() ? (
		<Sequence from={en} layout="none">
			<Audio src={staticFile(`ayuda-sfx/${cual}.wav`)} volume={VOLUMEN[cual]} />
		</Sequence>
	) : null;
