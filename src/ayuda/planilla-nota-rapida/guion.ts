import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { RITMO_AYUDA } from '../planilla/guion';
import { FOCOS_LLEGADA } from './Llegada';
import { LLEGADA_RAPIDA, PASOS_DE_LLEGADA } from './llegada-rapida';
import { EN_EL_PANEL, GEOMETRIA, LO_QUE_TARDA_EL_LOTE, QUIZ, Tiempos, VALENTINA, estadoEn, fotograma } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «LA NOTA RÁPIDA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA, Y SON DOS MITADES
 *
 *     1. **El campo vacío BORRA, y 0 no es vacío.** Con el valor en blanco cada clic quita la nota
 *        (la deja sin calificar, y el promedio la ignora); un 0 es una nota y baja el promedio. Se
 *        ve con números: la misma fila de Valentina da 60 con la casilla vacía y 40 con un 0.
 *     2. **La cabecera respeta el buscador.** Con «val» puesto, pulsar «Quiz» escribe en las dos
 *        filas que se ven y no en las seis. (`columnaRapida` recorre `alumnosFiltrados()`.)
 *
 * Y de propina, porque sin eso las dos mitades dejarían notas cambiadas: **otro clic deshace**.
 * Todo lo que el vídeo pone lo quita, y la planilla acaba como la dejó `planilla-teclear`.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO ES EL DE LA APLICACIÓN
 *
 * Un clic de la nota rápida no espera a que dejes de teclear: va derecho al lote. Así que del clic
 * al aviso son la ventana del lote y la ida y vuelta:
 *
 *     clic ─┬─ 2 s    la ventana del lote            (60 fotogramas)
 *           └─ 0,5 s  la ida y vuelta                (15)
 *
 * y entre dos clics a la misma casilla se deja pasar el aviso: dos clics dentro de la misma ventana
 * irían en un solo lote, y el vídeo no puede afirmar qué diría ese aviso.
 */

export const FPS = 30;

export const LLEGADA = LLEGADA_RAPIDA;

/** Donde se monta la planilla. Todo lo de la planilla va en fotogramas LOCALES, desde aquí. */
export const ENTRA = LLEGADA.entraLaPlanilla;

/* ── La planilla, en fotogramas locales ───────────────────────────────────────────────────── */

export const PLANILLA = {
	cursorEntra: 40,
	llegaInterruptor: 70,
	activa: 80,
	borra: 200,
	deshaceBorrar: 300,
	pulsaValor: 400,
	tecleaCero: 412,
	pone0: 440,
	deshace0: 520,
	pulsaBuscador: 615,
	busca: 625,
	cabecera: 700,
	deshaceCabecera: 790,
	borraBusqueda: 830,
	cursorSale: 950,
};

export const TIEMPOS: Tiempos = {
	activa: PLANILLA.activa,
	valores: [
		{ desde: 0, valor: null },
		{ desde: PLANILLA.tecleaCero, valor: 0 },
	],
	busca: { empieza: PLANILLA.busca, borra: PLANILLA.borraBusqueda, porTecla: 5 },
	clics: [
		{ frame: PLANILLA.borra, fila: VALENTINA, columna: QUIZ },
		{ frame: PLANILLA.deshaceBorrar, fila: VALENTINA, columna: QUIZ },
		{ frame: PLANILLA.pone0, fila: VALENTINA, columna: QUIZ },
		{ frame: PLANILLA.deshace0, fila: VALENTINA, columna: QUIZ },
		{ frame: PLANILLA.cabecera, fila: null, columna: QUIZ },
		{ frame: PLANILLA.deshaceCabecera, fila: null, columna: QUIZ },
	],
};

/** Los avisos de cada lote, ya en fotogramas del clip. */
export const AVISOS = estadoEn(TIEMPOS, Infinity).avisos.map((a) => ({ ...a, desde: a.desde + ENTRA }));

/** Lo que dura cada aviso: los 2,5 s de la aplicación (`nzDuration: 2500`). */
export const AVISO_DURA = 75;

/** El ritmo de la planilla: sin tecleos y sin lote propio (los avisos los pone la escena). */
export const RITMO_RAPIDA: Ritmo = {
	...RITMO_AYUDA,
	TECLEOS: [],
	CONFIRMA: 100000,
	SALIDA: 100000,
};

/* ── Los focos: en el fotograma, sacados de la misma geometría que el dibujo ─────────────────── */

const casillaDeValentina = GEOMETRIA.casilla(VALENTINA, QUIZ);

export const FOCOS = {
	...FOCOS_LLEGADA,
	franja: fotograma(EN_EL_PANEL.franja),
	valorYHace: fotograma(EN_EL_PANEL.valorYHace),
	buscador: fotograma(EN_EL_PANEL.buscador),
	nombre: fotograma(GEOMETRIA.celda(VALENTINA, 'alumno')),
	casilla: fotograma(casillaDeValentina),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };

const L = (f: number) => ENTRA + f;

export const PASOS: Paso[] = [
	...PASOS_DE_LLEGADA(),
	{ desde: L(8), texto: 'Marca Nota rápida: cada clic pone el valor.', ...EN_LA_PLANILLA, foco: FOCOS.franja, focoHasta: L(110) },
	{ desde: L(128), texto: 'Con el campo vacío, cada clic borra la nota.', ...EN_LA_PLANILLA, foco: FOCOS.valorYHace, focoHasta: L(186) },
	{ desde: L(275), texto: 'El promedio la ignora; otro clic lo deshace.', ...EN_LA_PLANILLA },
	{ desde: L(389), texto: 'Un 0 no es vacío: baja el promedio.', voz: 'Un cero no es vacío: baja el promedio.', ...EN_LA_PLANILLA, foco: FOCOS.valorYHace, focoHasta: L(430) },
	{ desde: L(499), texto: 'Otro clic, y vuelve el 55.', ...EN_LA_PLANILLA },
	{ desde: L(609), texto: 'Con el buscador, la cabecera sólo toca las filas visibles.', ...EN_LA_PLANILLA, foco: FOCOS.buscador, focoHasta: L(650) },
	{ desde: L(758), texto: 'Otro clic en la cabecera lo deshace.', ...EN_LA_PLANILLA },
	{ desde: L(857), texto: 'Un clic en el nombre hace lo mismo con la fila.', ...EN_LA_PLANILLA, foco: FOCOS.nombre },
];

export const TARJETA = L(967);
export const DURACION = TARJETA + 140;

export const CLAVE = 'planilla-nota-rapida';

export const TITULO = 'La nota rápida';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la planilla' },
	{ desde: L(8), titulo: 'Encender la nota rápida' },
	{ desde: L(128), titulo: 'El campo vacío borra' },
	{ desde: L(389), titulo: 'Un 0 no es vacío' },
	{ desde: L(609), titulo: 'Columna y fila, con el buscador' },
];

export const CIERRE: Cierre = {
	hiciste: 'Pusiste, borraste y deshiciste notas con un clic.',
	seVe: 'Cada clic sale en el aviso: «Cambiada: 55», o «(vacía)» si la borró.',
	despues: 'Con el periodo cerrado, la nota rápida no aparece.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* ── Las puertas propias ──────────────────────────────────────────────────────────────────── */

/* Cada aviso sale donde toca y el siguiente clic no cae dentro de la ventana del anterior. */
TIEMPOS.clics.forEach((c, i) => {
	const siguiente = TIEMPOS.clics[i + 1];
	if (siguiente && siguiente.frame - c.frame <= LO_QUE_TARDA_EL_LOTE) {
		throw new Error(`Guion: el clic ${i + 2} cae dentro del lote del ${i + 1}; irían juntos.`);
	}
});

/* El paso que dice «el promedio la ignora» empieza con el aviso del borrado ya fuera. */
if (PASOS[4].desde < AVISOS[0].desde) {
	throw new Error('Guion: el paso 5 habla del borrado antes de que vuelva su aviso.');
}

/* Y la cuenta que el rótulo afirma: vacía da 60, un 0 da 40, y al final todo vuelve a como estaba. */
{
	const conVacia = estadoEn(TIEMPOS, PLANILLA.borra).notas[VALENTINA];
	const conCero = estadoEn(TIEMPOS, PLANILLA.pone0).notas[VALENTINA];
	const media = (n: (number | null)[]) => {
		const p = n.filter((x): x is number => x !== null);
		return Math.round(p.reduce((a, b) => a + b, 0) / p.length);
	};
	if (media(conVacia) !== 60 || media(conCero) !== 40) {
		throw new Error(`Guion: los totales de Valentina son ${media(conVacia)} y ${media(conCero)}, no 60 y 40.`);
	}
	const alFinal = estadoEn(TIEMPOS, Infinity).notas;
	const alPrincipio = estadoEn(TIEMPOS, -1).notas;
	if (JSON.stringify(alFinal) !== JSON.stringify(alPrincipio)) {
		throw new Error('Guion: la planilla no acaba como empezó; algún clic se quedó sin deshacer.');
	}
}
