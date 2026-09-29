import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS, alturaDeEntrada } from '../medidas';
import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { LA_QUE_SE_ABRE, PLANILLA, rectanguloDelBoton } from './datos';
import { HISTORIAL, historialEnElFotograma } from './historial-geometria';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DEL PRIMER VÍDEO DE AYUDA: «LA PLANILLA: TECLEAR Y QUE QUEDE GUARDADO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * QUÉ CONTESTA, Y ES UNA SOLA PREGUNTA
 *
 * **«¿Se guardó?»** No «cómo se califica» --eso se aprende solo, es teclear un número--, sino qué
 * significa el aro, por qué el aviso tarda y por qué sale uno para tres notas. Es la llamada que
 * más llega, y la pantalla ya la contesta: lo que falta es que alguien lo haya visto una vez.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * DOS ACTOS, Y EL PRIMERO NO SE SALTA NUNCA
 *
 *     1. LA LLEGADA   menú -> Académico -> Mis asignaturas -> el botón «Planilla» de una fila
 *     2. LA PLANILLA  se teclean tres notas, se espera, vuelve el lote
 *
 * El acto 1 es el que contesta «¿y eso dónde está?», que es la pregunta de debajo de casi todas las
 * demás. En un promocional sobraría; aquí es la mitad del encargo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO ES EL DE VERDAD, Y AHÍ ESTE VÍDEO SE SEPARA DEL PROMOCIONAL
 *
 * `notas/guion.ts` comprime a 0,4 s los hasta tres segundos que la aplicación tarda en confirmar,
 * porque en un promocional tres segundos de pantalla quieta pierden a quien mira. **Aquí esos tres
 * segundos son el contenido**: el paso 6 dice «tarda un par de segundos» mientras tarda, y eso es
 * exactamente la llamada que se evita. Así que este clip pasa su propio `Ritmo`, con 1 s de espera
 * de la celda, 2 s de ventana del lote y la ida y vuelta.
 */

export const FPS = 30;

/*
 * EL ENCUADRE --a qué escala se pinta la aplicación y dónde cae-- vive en `ayuda/encuadre.ts`, que
 * lo comparten todos los vídeos de ayuda. Aquí sólo se usa.
 */

/* ── ACTO 1: la llegada ───────────────────────────────────────────────────────────────────── */

export const LLEGADA = {
	/** El puntero entra por abajo, que es de donde viene una mano. */
	cursorEntra: 4,
	/** Llega a «Académico» y pulsa. */
	llegaAcademico: 30,
	pulsaAcademico: 36,
	/** La sección se despliega empujando a las de abajo. */
	abreAcademico: 38,
	/** Baja a «Mis asignaturas» y pulsa. */
	llegaMisAsignaturas: 86,
	pulsaMisAsignaturas: 94,
	/** La lista se monta. */
	montaLista: 98,
	/** Se queda quieto mientras la lista llega, y cruza hasta el botón «Planilla» de la fila de 9°B. */
	dejaMisAsignaturas: 150,
	llegaBoton: 168,
	pulsaBoton: 208,
	cursorSale: 218,
	/** La cáscara se va acercando y se apaga: no es un corte, es entrar en la pantalla. */
	seVaLaCascara: 222,
	/** Y la planilla empieza a montarse. */
	entraLaPlanilla: 248,
};

/** Dónde caen las dos cosas que hay que señalar, ya en coordenadas del fotograma. */
export const FOCOS = {
	academico: enElFotograma({
		x: 0,
		y: alturaDeEntrada(ACADEMICO, null, false),
		ancho: MEDIDAS.menu,
		alto: MEDIDAS.seccion,
	}),
	botonPlanilla: enElFotograma(rectanguloDelBoton(LA_QUE_SE_ABRE, PLANILLA)),
};

/** El centro de una entrada del menú, en coordenadas de la cáscara: es a donde va el puntero. */
export const PUNTOS = {
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	misAsignaturas: { x: 150, y: alturaDeEntrada(ACADEMICO, MIS_ASIGNATURAS, true) + MEDIDAS.hija / 2 },
	botonPlanilla: (() => {
		const r = rectanguloDelBoton(LA_QUE_SE_ABRE, PLANILLA);
		return { x: r.x + r.ancho / 2, y: r.y + r.alto / 2 };
	})(),
	/** Por donde entra el puntero: abajo, dentro del contenido. */
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
};

/* ── ACTO 2: la planilla, al ritmo de verdad ──────────────────────────────────────────────── */

/*
 * LOS TIEMPOS DE LA APLICACIÓN, sumados a la vista para que se puedan discutir:
 *
 *     última tecla ─┬─ 1 s   la celda espera a que dejes de teclear   (30 fotogramas)
 *                   ├─ 2 s   la ventana del lote junta lo que haya    (60)
 *                   └─ 0,5 s la ida y vuelta                          (15)
 *                                                                     ───
 *                                                              105 fotogramas
 *
 * La última tecla del tercer tecleo cae en 384 (empieza en 374, dos teclas a 5 fotogramas), así que
 * el lote vuelve en 489. Eso son 3,5 s de pantalla quieta **y son el paso 6 entero**.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * Y LOS TRES TECLEOS ESTÁN COLOCADOS HACIA ATRÁS DESDE AHÍ, no hacia delante desde el principio.
 *
 * La primera versión los puso pronto y el lote volvía **58 fotogramas antes** de que el rótulo del
 * paso 7 empezara a explicarlo: durante dos segundos se leía «tarda un par de segundos» con el
 * aviso de «Cambiadas» ya puesto encima, o sea el vídeo desmintiéndose solo. Se vio mirando el
 * fotograma 900, no leyendo el guion -- en la hoja los números cuadraban.
 *
 * Así que la cuenta va al revés: el lote vuelve donde empieza el paso 7 (934 del clip, 489 de la
 * escena), y de ahí para atrás se restan los 105 fotogramas de la aplicación y los tecleos.
 */
export const RITMO_AYUDA: Ritmo = {
	TITULO: 8,
	CABECERAS: 18,
	PASO_CABECERA: 5,
	FILAS: 40,
	PASO_FILA: 5,
	POR_TECLA: 5,
	FOCO_ANTES: 8,
	TECLEOS: [
		{ fila: 1, valor: '92', empieza: 200 },
		{ fila: 3, valor: '78', empieza: 287 },
		{ fila: 4, valor: '55', empieza: 374 },
	],
	CONFIRMA: 489,
	SALIDA: 655,
	PASO_SALIDA: 4,
};

/*
 * EL RITMO DE ESTE VÍDEO (2026-09-29, encargo de voz: un tercio más corto). `RITMO_AYUDA` se queda
 * como estaba porque lo importan otros vídeos (cierre-1, cierre-3, docente-asistencia, nota rápida…);
 * este clip adelanta los tecleos y los junta, y **no toca la espera de la aplicación**: la puerta de
 * abajo exige los mismos 105 fotogramas entre la última tecla y el lote.
 */
const PRIMER_TECLEO = 143;
const ENTRE_TECLEOS = 56;
export const RITMO_TECLEAR: Ritmo = {
	...RITMO_AYUDA,
	TECLEOS: [
		{ fila: 1, valor: '92', empieza: PRIMER_TECLEO },
		{ fila: 3, valor: '78', empieza: PRIMER_TECLEO + ENTRE_TECLEOS },
		{ fila: 4, valor: '55', empieza: PRIMER_TECLEO + 2 * ENTRE_TECLEOS },
	],
	CONFIRMA: PRIMER_TECLEO + 2 * ENTRE_TECLEOS + 10 + 105,
	SALIDA: 0,
};

/*
 * LA PUERTA DEL RITMO: el lote tiene que volver **exactamente** cuando empieza el paso que lo
 * explica, y la espera tiene que ser la de la aplicación. Las dos cosas se rompen solas en cuanto
 * alguien mueve un rótulo, y ninguna de las dos da error al renderizar: lo que sale es un vídeo que
 * dice una cosa mientras en pantalla pasa otra. Vale para `RITMO_AYUDA`, que usan otros vídeos, y
 * para el de éste.
 */
const ultimaTecla = (r: Ritmo): number => {
	const t = r.TECLEOS[r.TECLEOS.length - 1];
	return t.empieza + t.valor.length * r.POR_TECLA;
};

/** 1 s de la celda + 2 s de la ventana del lote + la ida y vuelta. */
const LO_QUE_TARDA_EL_LOTE = 105;

for (const r of [RITMO_AYUDA, RITMO_TECLEAR]) {
	if (r.CONFIRMA - ultimaTecla(r) !== LO_QUE_TARDA_EL_LOTE) {
		throw new Error(
			`Guion: el lote vuelve ${r.CONFIRMA - ultimaTecla(r)} fotogramas después de la última ` +
				`tecla, y la aplicación tarda ${LO_QUE_TARDA_EL_LOTE}.`,
		);
	}
}

/* ── Los pasos: lo que se lee abajo ───────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_LA_PLANILLA = {
	ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla',
	url: '/planilla-notas/1222',
};

/** Fotograma del clip: la escena de la planilla empieza en `entraLaPlanilla`. */
const E = LLEGADA.entraLaPlanilla;

/*
 * EL HISTORIAL (2026-09-29, pedido por Joseth; app2 ya se lo enseña al docente). Después del aviso
 * del lote, la cámara se corre a la izquierda y aparece la última columna, «Historial», con su reloj
 * y su fecha; el puntero pulsa la de la primera fila y se abre el diálogo con un cambio que hizo
 * otra persona. Fotogramas del clip.
 */
export const EL_HISTORIAL = {
	/** El aviso de «Cambiadas» se va (en la aplicación dura 2,5 s). */
	seVaElAviso: E + RITMO_TECLEAR.CONFIRMA + 90,
	/** La cámara se corre y la columna aparece. */
	seCorre: E + RITMO_TECLEAR.CONFIRMA + 88,
	yaCorrida: E + RITMO_TECLEAR.CONFIRMA + 106,
	cursorEntra: E + RITMO_TECLEAR.CONFIRMA + 110,
	llegaCelda: E + RITMO_TECLEAR.CONFIRMA + 132,
	pulsaCelda: 0,
	abreDialogo: 0,
	cierraDialogo: 0,
	cursorSale: 0,
};

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Abre Académico y entra en Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaMisAsignaturas - 4 },
	{ desde: 124, texto: 'En la fila de 9°B, pulsa Planilla.', voz: 'En la fila de noveno B, pulsa Planilla.', ...EN_LA_LISTA, foco: FOCOS.botonPlanilla, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: E + 8, texto: 'Una fila por alumno y una columna por nota.', ...EN_LA_PLANILLA },
	{ desde: E + RITMO_TECLEAR.TECLEOS[0].empieza - 20, texto: 'Escribes la nota y sale el aro: sin confirmar.', ...EN_LA_PLANILLA },
	{ desde: E + RITMO_TECLEAR.TECLEOS[2].empieza, texto: 'Tarda dos segundos: junta la tanda.', ...EN_LA_PLANILLA },
	{ desde: E + RITMO_TECLEAR.CONFIRMA, texto: 'Se apagan a la vez y sale un aviso.', ...EN_LA_PLANILLA },
	{
		desde: E + RITMO_TECLEAR.CONFIRMA + 100,
		texto: 'El historial siempre deja ver tu actividad.',
		...EN_LA_PLANILLA,
	},
	{ desde: 0, texto: 'Cada cambio a tus notas, tuyo o de otra persona, queda con su nombre y la hora.', ...EN_LA_PLANILLA },
];

/* El diálogo se abre justo antes de que el último rótulo lo cuente, y se cierra con la tarjeta. */
const H1 = PASOS.length - 2;
const H2 = PASOS.length - 1;
PASOS[H2].desde = PASOS[H1].desde + 112;
EL_HISTORIAL.pulsaCelda = PASOS[H2].desde - 12;
EL_HISTORIAL.abreDialogo = PASOS[H2].desde - 8;
EL_HISTORIAL.cursorSale = PASOS[H2].desde + 6;
PASOS[H1].focoHasta = EL_HISTORIAL.abreDialogo;

/** Cuándo entra la tarjeta del final, y cuánto se queda quieta. */
export const TARJETA = PASOS[H2].desde + 190;
export const DURACION = TARJETA + 136;
EL_HISTORIAL.cierraDialogo = TARJETA - 14;

/*
 * LA SALIDA de la planilla, ya que la tarjeta está puesta: las filas se apartan cuando el diálogo ya
 * se cerró, y la tarjeta entra encima.
 */
RITMO_TECLEAR.SALIDA = TARJETA - E - 12;

/* El foco del primer paso del historial: la columna entera, ya con la cámara corrida. */
PASOS[H1].foco = historialEnElFotograma(HISTORIAL.columna, EL_HISTORIAL.yaCorrida - E, RITMO_TECLEAR.SALIDA);
/** El aviso del lote dura lo que en la aplicación, más o menos: se va antes de que llegue el historial. */
export const AVISO_DURA = EL_HISTORIAL.seVaElAviso - E - RITMO_TECLEAR.CONFIRMA;

/** La clave con la que la aplicación pide este vídeo: `data: { ayuda: '…' }` en `app.routes.ts`. */
export const CLAVE = 'planilla-teclear';

export const TITULO = 'La planilla: teclear y que quede guardado';

/** Los cinco momentos, para el índice del panel de ayuda y para el `?start=` de cada «?». */
export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está la planilla' },
	{ desde: E, titulo: 'La pantalla: una fila por alumno' },
	{ desde: PASOS[3].desde, titulo: 'El aro: escrita y sin confirmar' },
	{ desde: E + RITMO_TECLEAR.CONFIRMA, titulo: 'Un aviso por tanda' },
	{ desde: PASOS[H1].desde, titulo: 'El historial de cada fila' },
];

export const CIERRE: Cierre = {
	hiciste: 'Calificaste tres notas en la planilla de 9°B.',
	seVe: 'El aro se apaga y sale un aviso con las notas de la tanda.',
	despues: 'Si el aro se queda puesto, esa nota todavía no salió.',
};

/*
 * LA PUERTA. Si un rótulo dura menos de lo que se tarda en decirlo, esto revienta **al abrir el
 * estudio**, con el paso y el texto delante. Ver `ayuda/tiempos.ts`.
 */
compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/*
 * Y la otra mitad: que el aviso caiga donde lo explica el último paso. Va aquí abajo porque
 * necesita `PASOS`, y `PASOS` necesita los focos, que necesitan la geometría.
 */
const EXPLICA_EL_AVISO = PASOS.length - 3;
if (E + RITMO_TECLEAR.CONFIRMA !== PASOS[EXPLICA_EL_AVISO].desde) {
	throw new Error(
		`Guion: el lote vuelve en el fotograma ${E + RITMO_TECLEAR.CONFIRMA} y el paso ` +
			`que lo explica empieza en el ${PASOS[EXPLICA_EL_AVISO].desde}. Tienen que ser el mismo.`,
	);
}

/* Y una comprobación del montaje: el foco del botón no puede señalar donde no hay fila. */
if (LA_QUE_SE_ABRE < 0) {
	throw new Error('Guion: la asignatura que el vídeo abre no está en ASIGNATURAS.');
}
if (rectanguloDelBoton(LA_QUE_SE_ABRE, PLANILLA).ancho < 90) {
	throw new Error('Guion: el botón es más estrecho de lo que su texto necesita.');
}
