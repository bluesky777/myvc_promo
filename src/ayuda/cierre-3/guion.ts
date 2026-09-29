import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS, alturaDeEntrada } from '../medidas';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import { LA_QUE_SE_ABRE, PLANILLA, rectanguloDelBoton } from '../planilla/datos';
import {
	COLUMNA_NIVELADA, INICIAL, NIVELACION, QUEDA, RECTS_DLG, VALENTINA, avisoEnElFotograma, casillaEnElFotograma,
	checkEnElFotograma, modoEnElFotograma, unidadEnElFotograma,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 3 DE 8: «NIVELAR NO ES CORREGIR». Para el docente, en la semana de nivelaciones.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS TRES COSAS QUE MATA
 *
 *     1. **Nivelar no es cambiar la nota.** En la planilla, cambiar un 55 por un 85 es el mismo
 *        gesto tanto si se arregla un teclazo como si se registra una superación; la aplicación los
 *        separa: la corrección va a la auditoría y la nivelación a las columnas de la nota, y de
 *        ahí al boletín (`planilla-notas.ts:676-681`). Por eso la nivelación se hace con el «Modo
 *        nivelación» y un diálogo, y la corrección es un enlace aparte dentro de él.
 *     2. **La valoración inicial no se pierde**: quedan las dos, y la casilla la enseña tachada.
 *     3. **La regla del colegio topa la nota.** Con «topada» (la de por defecto), el 85 queda en
 *        60, la mínima. El diálogo lo dice mientras se escribe, y el aviso lo repite al guardar.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA     menú -> Académico -> Mis asignaturas -> «Planilla» de 9°B
 *     2. LA PLANILLA    el aviso del periodo, «Modo nivelación»
 *     3. EL DIÁLOGO     la nota perdida -> 85 -> la regla -> corregir es aparte -> registrar
 *
 * EL TIEMPO DE LA APLICACIÓN. Registrar es un PUT y la planilla espera la respuesta para pintar la
 * casilla (no hay pintado optimista: `planilla-notas.ts:1880`), así que el diálogo se queda con la
 * rueda medio segundo y la casilla cambia cuando se va. No hay retardo de tecleo que respetar: el
 * diálogo no guarda al escribir.
 */

export const FPS = 30;

/* ── Los textos (cada paso dura lo que tarda en decirse) ───────────────────────────────────── */

type Texto = { texto: string; voz?: string; rojo?: boolean };

const T_: Texto[] = [
	{ texto: 'Se nivela en Académico, Mis asignaturas.' },
	{ texto: 'En la fila de 9°B, pulsa «Planilla».', voz: 'En la fila de noveno B, pulsa Planilla.' },
	{ texto: 'En «Nivelando» ya no se califica.', voz: 'En nivelando ya no se califica.' },
	{ texto: 'Marca «Modo nivelación»: sólo deja tocar lo perdido.', voz: 'Marca modo nivelación: sólo deja tocar lo perdido.' },
	{ texto: 'Pulsa la nota perdida.' },
	{ texto: `El ${INICIAL} no se borra: quedan los dos.` },
	{ texto: `Escribe lo que sacó: ${NIVELACION}.` },
	{ texto: `La regla del colegio la deja en ${QUEDA}.` },
	{ texto: 'Si fue un error al teclear, no niveles: corrige aquí.' },
	{ texto: 'En el boletín y la constancia sale como nivelada.' },
	{ texto: `Queda ${QUEDA}, con el ${INICIAL} tachado.` },
];

/** Lo que dura un paso: lo mismo que exige `compruebaElGuion`. */
const dura = (t: Texto): number => {
	/* Dentro de `tools/voz.mjs` la puerta usa el tiempo de lectura: aquí también. */
	const voz = (globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ ? null : segundosDeVoz(t.voz ?? t.texto);
	return (voz === null ? fotogramasDeLectura(t.texto, FPS) : RETRASO_VOZ + Math.ceil(voz * FPS) + RESPIRO_VOZ) + (t.rojo ? FPS : 0);
};

/* ── Los arranques de cada paso, encadenados, y lo que pasa colgado de ellos ──────────────── */

const D: number[] = [];
D[0] = 8;

const LL = {
	cursorEntra: 12,
	llegaAcademico: 32,
	pulsaAcademico: 38,
	abreAcademico: 40,
	llegaMisAsignaturas: 62,
	pulsaMisAsignaturas: 70,
	montaLista: 74,
};
/* El 2 señala el botón: la lista tiene que haber entrado. */
D[1] = Math.max(D[0] + dura(T_[0]), LL.montaLista + 30);
const llegaBoton = D[1] + 22;
const pulsaBoton = llegaBoton + 10;

export const LLEGADA = {
	...LL,
	llegaBoton,
	pulsaBoton,
	cursorSale: pulsaBoton + 14,
	seVaLaCascara: pulsaBoton + 20,
	entraLaPlanilla: pulsaBoton + 50,
};

/* El 3 habla del aviso de la planilla: tiene que estar ya en pantalla. */
D[2] = Math.max(D[1] + dura(T_[1]), LLEGADA.entraLaPlanilla + 12);
D[3] = D[2] + dura(T_[2]);
D[4] = D[3] + dura(T_[3]);

const cursorEntra = D[3];
const llegaModo = cursorEntra + 20;
const pulsaModo = llegaModo + 10;

const llegaCasilla = D[4] + 16;
const pulsaCasilla = llegaCasilla + 12;
const abreDialogo = pulsaCasilla + 6;

/* El 6 habla de la inicial, que está en el diálogo. */
D[5] = Math.max(D[4] + dura(T_[4]), abreDialogo + 12);
D[6] = D[5] + dura(T_[5]);
const teclea = D[6] + 20;
const porTecla = 6;
D[7] = Math.max(D[6] + dura(T_[6]), teclea + NIVELACION.length * porTecla + 6);
D[8] = D[7] + dura(T_[7]);
D[9] = D[8] + dura(T_[8]);

/** Registrar cae al final del 10, y el 11 empieza con la casilla ya cambiada. */
D[10] = D[9] + dura(T_[9]);
const pulsaRegistrar = D[10] - 17;

export const EN_LA_PLANILLA = {
	cursorEntra,
	llegaModo,
	pulsaModo,
	llegaCasilla,
	pulsaCasilla,
	abreDialogo,
	teclea,
	porTecla,
	llegaRegistrar: pulsaRegistrar - 20,
	pulsaRegistrar,
	/** La ida y vuelta del PUT: medio segundo. */
	cierraDialogo: pulsaRegistrar + 15,
	niveladaDesde: pulsaRegistrar + 17,
	cursorSale: 0,
};

export const TARJETA = D[10] + dura(T_[10]);
EN_LA_PLANILLA.cursorSale = TARJETA - 10;

/* El aviso que sale al guardar, con la frase del servidor. */
export const AVISO = { desde: EN_LA_PLANILLA.niveladaDesde, dura: Math.min(150, TARJETA - EN_LA_PLANILLA.niveladaDesde - 14) };

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const PUNTOS_CASCARA = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	misAsignaturas: { x: 150, y: alturaDeEntrada(ACADEMICO, MIS_ASIGNATURAS, true) + MEDIDAS.hija / 2 },
	botonPlanilla: centro(rectanguloDelBoton(LA_QUE_SE_ABRE, PLANILLA)),
};

/** En el fotograma: la planilla y el diálogo se pintan fuera de la cáscara. */
export const PUNTOS = {
	entrada: { x: 1500, y: 900 },
	modo: checkEnElFotograma(),
	casilla: centro(casillaEnElFotograma(VALENTINA, COLUMNA_NIVELADA)),
	campo: centro(RECTS_DLG.campo),
	registrar: centro(RECTS_DLG.registrar),
};

export const FOCOS = {
	academico: enElFotograma({ x: 0, y: alturaDeEntrada(ACADEMICO, null, false), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	botonPlanilla: enElFotograma(rectanguloDelBoton(LA_QUE_SE_ABRE, PLANILLA)),
	aviso: avisoEnElFotograma(),
	unidad: unidadEnElFotograma(),
	modo: modoEnElFotograma(),
	casilla: casillaEnElFotograma(VALENTINA, COLUMNA_NIVELADA),
	inicial: RECTS_DLG.inicial,
	campo: { ...RECTS_DLG.campo, x: RECTS_DLG.campo.x - 6, y: RECTS_DLG.campo.y - 6, ancho: RECTS_DLG.campo.ancho + 12, alto: RECTS_DLG.campo.alto + 12, radio: 10 },
	regla: RECTS_DLG.regla,
	enlace: RECTS_DLG.enlace,
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };

const T = EN_LA_PLANILLA;

const UBIC = [EN_EL_MENU, EN_LA_LISTA, EN_PLANILLA, EN_PLANILLA, EN_PLANILLA, EN_PLANILLA, EN_PLANILLA, EN_PLANILLA, EN_PLANILLA, EN_PLANILLA, EN_PLANILLA];
const FOCO: (Paso['foco'] | undefined)[] = [
	FOCOS.academico, FOCOS.botonPlanilla, FOCOS.aviso, FOCOS.modo, FOCOS.casilla,
	FOCOS.inicial, FOCOS.campo, FOCOS.regla, FOCOS.enlace, undefined, FOCOS.casilla,
];
const FOCO_HASTA: (number | undefined)[] = [];
FOCO_HASTA[0] = LLEGADA.pulsaAcademico + 20;
FOCO_HASTA[1] = LLEGADA.pulsaBoton;
FOCO_HASTA[4] = T.pulsaCasilla - 4;

export const PASOS: Paso[] = T_.map((t, i) => ({
	desde: D[i],
	...t,
	...UBIC[i],
	...(FOCO[i] ? { foco: FOCO[i] } : {}),
	...(FOCO_HASTA[i] !== undefined ? { focoHasta: FOCO_HASTA[i] } : {}),
}));

const DESPUES = 'Siguiente, 4 de 8: los boletines.';
const VOZ_TARJETA = segundosDeVoz(DESPUES);
/** La tarjeta dura lo que su voz, y nunca menos de cuatro segundos. */
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);


export const CLAVE = 'cierre-3-nivelaciones';

export const TITULO = 'Nivelar no es corregir';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde: Mis asignaturas, Planilla' },
	{ desde: LLEGADA.entraLaPlanilla, titulo: 'La semana de nivelaciones' },
	{ desde: PASOS[3].desde, titulo: 'Modo nivelación y su diálogo' },
	{ desde: PASOS[7].desde, titulo: 'La regla del colegio topa la nota' },
	{ desde: PASOS[8].desde, titulo: 'Corregir no es nivelar' },
];

export const CIERRE: Cierre = {
	hiciste: `Nivelaste el quiz de Valentina: sacó ${NIVELACION} y quedó ${QUEDA}.`,
	seVe: `En la casilla: ${QUEDA}, con el ${INICIAL} tachado al lado.`,
	despues: DESPUES,
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* La regla tiene que estar escrita entera cuando su paso empieza. */
if (T.teclea + NIVELACION.length * T.porTecla > PASOS[7].desde) {
	throw new Error('Guion: el paso de la regla empieza antes de que la nota de la nivelación esté escrita.');
}
/* La casilla cambia cuando vuelve el PUT, y el paso que lo cuenta empieza justo después. */
if (T.niveladaDesde < T.pulsaRegistrar + 15 || PASOS[10].desde < T.niveladaDesde) {
	throw new Error('Guion: la casilla nivelada tiene que salir medio segundo después del clic y antes de su paso.');
}
/* Y el diálogo se abre dentro del paso que lo anuncia. */
if (T.abreDialogo < PASOS[4].desde || T.abreDialogo > PASOS[5].desde) {
	throw new Error('Guion: el diálogo se abre fuera del paso que lo anuncia.');
}
