import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS, alturaDeEntrada } from '../medidas';
import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Paso, compruebaElGuion } from '../tiempos';
import { LA_QUE_SE_ABRE, LISTA, PLANILLA, rectanguloDelBoton } from './datos';

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
	cursorEntra: 20,
	/** Llega a «Académico» y pulsa. */
	llegaAcademico: 58,
	pulsaAcademico: 64,
	/** La sección se despliega empujando a las de abajo. */
	abreAcademico: 66,
	/** Baja a «Mis asignaturas» y pulsa. */
	llegaMisAsignaturas: 170,
	pulsaMisAsignaturas: 182,
	/** La lista se monta. */
	montaLista: 186,
	/** Cruza hasta el botón «Planilla» de la fila de 9°B y pulsa. */
	llegaBoton: 340,
	pulsaBoton: 366,
	cursorSale: 380,
	/** La cáscara se va acercando y se apaga: no es un corte, es entrar en la pantalla. */
	seVaLaCascara: 400,
	/** Y la planilla empieza a montarse. */
	entraLaPlanilla: 445,
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

/**
 * LO QUE DURA EL AVISO EN PANTALLA. En la aplicación son 2,5 s (`nzDuration: 2500`) y aquí se queda
 * hasta que la pantalla se va, que son nueve. **Es la única licencia del clip y va dicha aquí**: el
 * aviso es la prueba de que las tres se guardaron, y el paso 7 lo está explicando mientras se ve.
 * Quitarlo antes dejaría el rótulo hablando de algo que ya no está en pantalla.
 */
export const AVISO_DURA = RITMO_AYUDA.SALIDA - RITMO_AYUDA.CONFIRMA;

/*
 * LA PUERTA DEL RITMO: el lote tiene que volver **exactamente** cuando empieza el paso que lo
 * explica, y la espera tiene que ser la de la aplicación. Las dos cosas se rompen solas en cuanto
 * alguien mueve un rótulo, y ninguna de las dos da error al renderizar: lo que sale es un vídeo que
 * dice una cosa mientras en pantalla pasa otra.
 */
const ULTIMA_TECLA = (() => {
	const t = RITMO_AYUDA.TECLEOS[RITMO_AYUDA.TECLEOS.length - 1];
	return t.empieza + t.valor.length * RITMO_AYUDA.POR_TECLA;
})();

/** 1 s de la celda + 2 s de la ventana del lote + la ida y vuelta. */
const LO_QUE_TARDA_EL_LOTE = 105;

if (RITMO_AYUDA.CONFIRMA - ULTIMA_TECLA !== LO_QUE_TARDA_EL_LOTE) {
	throw new Error(
		`Guion: el lote vuelve ${RITMO_AYUDA.CONFIRMA - ULTIMA_TECLA} fotogramas después de la última ` +
			`tecla, y la aplicación tarda ${LO_QUE_TARDA_EL_LOTE}.`,
	);
}

/* ── Los pasos: lo que se lee abajo ───────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_LA_PLANILLA = {
	ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla',
	url: '/planilla-notas/1222',
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Todo lo del docente está en el menú, en Académico.', ...EN_EL_MENU, foco: FOCOS.academico },
	{ desde: 160, texto: 'Mis asignaturas: una fila por cada una de las tuyas.', ...EN_EL_MENU },
	{ desde: 310, texto: 'Cada fila lleva cuatro botones. El segundo es la planilla.', ...EN_LA_LISTA, foco: FOCOS.botonPlanilla },
	{ desde: 460, texto: 'Cada fila es un alumno y cada columna, una nota.', ...EN_LA_PLANILLA },
	{ desde: 610, texto: 'Escribes la nota y aparece el aro: escrita, todavía sin confirmar.', ...EN_LA_PLANILLA },
	{ desde: 772, texto: 'Tarda un par de segundos: espera a juntar toda la tanda.', ...EN_LA_PLANILLA },
	{ desde: 934, texto: 'Se apagan los tres a la vez y sale un aviso con las tres notas.', ...EN_LA_PLANILLA },
];

/** Cuándo entra la tarjeta del final, y cuánto se queda quieta. */
export const TARJETA = 1150;
export const DURACION = 1260;

export const CIERRE: Cierre = {
	hiciste: 'Calificaste tres notas en la planilla de 9°B.',
	seVe: 'El aro se apaga y sale un aviso con las notas de la tanda.',
	despues: 'Si el aro se queda puesto, esa nota todavía no salió.',
};

/*
 * LA PUERTA. Si un rótulo dura menos de lo que se tarda en leerlo, esto revienta **al abrir el
 * estudio**, con el paso y el texto delante. Ver `ayuda/tiempos.ts`.
 */
compruebaElGuion(PASOS, FPS, TARJETA);

/*
 * Y la otra mitad: que el aviso caiga donde lo explica el paso 7. Va aquí abajo porque necesita
 * `PASOS`, y `PASOS` necesita los focos, que necesitan la geometría.
 */
const EXPLICA_EL_AVISO = PASOS.length - 1;
if (LLEGADA.entraLaPlanilla + RITMO_AYUDA.CONFIRMA !== PASOS[EXPLICA_EL_AVISO].desde) {
	throw new Error(
		`Guion: el lote vuelve en el fotograma ${LLEGADA.entraLaPlanilla + RITMO_AYUDA.CONFIRMA} y el paso ` +
			`que lo explica empieza en el ${PASOS[EXPLICA_EL_AVISO].desde}. Tienen que ser el mismo.`,
	);
}

/* Y una comprobación del montaje: el foco del botón no puede señalar donde no hay fila. */
if (LA_QUE_SE_ABRE < 0) {
	throw new Error('Guion: la asignatura que el vídeo abre no está en ASIGNATURAS.');
}
if (LISTA.boton.ancho < 90) {
	throw new Error('Guion: el botón es más estrecho de lo que su texto necesita.');
}
