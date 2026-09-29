import { ALUMNOS } from '../../notas/planilla';
import { MEDIDAS } from '../medidas';
import { ANO_MATEMATICAS_9B, ARRASTRAN, SAMUEL, VALENTINA } from '../cierre-5/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL TABLERO VIEJO (`/informes-old`) Y EL PAPEL DE PROMOVIDOS DE 9°B.
 *
 * El tablero se dibuja con lo que este vídeo usa y en su orden (`informes/tablero/tablero.html`):
 * la tarjeta de arriba con «Informes» y, sólo si el servidor dice que hay periodos con notas
 * editadas después del último cálculo, el aviso amarillo «Hay definitivas sin recalcular» y una
 * fila por periodo con un botón por grupo y «Recalcular los N». Debajo, la tarjeta de pestañas; en
 * «Finales», el botón «Calcular promovidos…».
 *
 * EL COLEGIO TIENE TRECE GRUPOS (los que dicen los comentarios del tablero y del acta). Tres de
 * ellos tienen definitivas del periodo 4 sin recalcular: 8°A, 9°B y 10°A, inventado.
 */

export const TB_TEXTOS = {
	titulo: 'Informes',
	avisoTitulo: 'Hay definitivas sin recalcular',
	avisoTexto:
		'Se editaron notas después del último cálculo. Recalcular borra las notas finales de ese grupo y periodo y las vuelve a calcular; las marcadas «manual» y las recuperadas se conservan.',
	periodo: 'Periodo 4',
	pestanas: ['Boletines', 'Puestos', 'Planillas', 'Finales', 'Varios'],
	tipoBoletin: { rotulo: 'Tipo de boletín', opciones: ['Tipo 1', 'Tipo 2', 'Tipo 3', 'Tipo 4', 'Tipo 5'] },
	tipoFinal: { rotulo: 'Tipo de informe final', opciones: ['Boletín final', 'Libros finales', 'Certificado final', 'Certificado por periodos'] },
	paraQuien: { rotulo: '¿Para quién?', opciones: ['Todo el grupo', 'Los alumnos que marque'] },
	selectores: [
		{ rotulo: 'Grupo', valor: 'Elija un grupo' },
		{ rotulo: 'Profesor', valor: '' },
		{ rotulo: 'Calcular hasta el periodo', valor: '4' },
	],
	botonesBoletines: ['Cargar boletines', 'Notas del año', 'Notas perdidas del año', 'Semáforo académico'],
	botonesFinales: ['Ver el informe final', 'Boletines finales de preescolar', 'Acta de evaluación y promoción'],
	calcular: 'Calcular promovidos…',
	confirmaTitulo: 'Esto decide, alumno por alumno, quién pasa de año',
	confirmaTexto:
		'Recorre los grupos uno detrás de otro y escribe en la base de datos quién queda promovido. Es lo que después lee el acta de evaluación y promoción. Tarda: son todas las notas del año, recuperaciones incluidas.',
	cancelar: 'Cancelar',
};

export const GRUPOS_DEL_COLEGIO = 13;
export const CONFIRMA = `Calcular promovidos de los ${GRUPOS_DEL_COLEGIO} grupos`;
export const SIN_RECALCULAR = ['8°A', '9°B', '10°A'];
export const RECALCULAR_LOS = `Recalcular los ${SIN_RECALCULAR.length}`;

export const TB = {
	arriba: 20,
	lados: 28,
	pad: 22,
	h1: 46,
	trasH1: 12,
	aviso: 112,
	trasAviso: 12,
	fila: 40,
	progreso: 34,
	entreTarjetas: 16,
	pestanas: 54,
	rotulo: 26,
	control: 44,
	trasControl: 16,
	botones: 44,
	trasBotones: 20,
	confirma: 118,
};

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
export const ANCHO_TARJETA = ANCHO_CONTENIDO - TB.lados * 2;

export const ALTO_TARJETA_1_CON_AVISO = TB.pad * 2 + TB.h1 + TB.trasH1 + TB.aviso + TB.trasAviso + TB.fila + TB.progreso;
export const ALTO_TARJETA_1_SIN_AVISO = TB.pad * 2 + TB.h1;

/** El ancho de un botón pequeño por su texto. Calculado, no medido. */
export const anchoDeBoton = (t: string, porLetra = 9.2) => Math.round(t.length * porLetra + 34);

const X0 = TB.lados + TB.pad;

/* ── Coordenadas del CONTENIDO ─────────────────────────────────────────────────────────────── */

export function rectanguloDelAviso() {
	return { x: TB.lados, y: TB.arriba, ancho: ANCHO_TARJETA, alto: ALTO_TARJETA_1_CON_AVISO };
}

const Y_FILA = TB.arriba + TB.pad + TB.h1 + TB.trasH1 + TB.aviso + TB.trasAviso;
export const ANCHO_ROTULO_PERIODO = 120;

export function rectanguloDeBotonDeGrupo(i: number) {
	let x = X0 + ANCHO_ROTULO_PERIODO;
	for (let k = 0; k < i; k++) { x += anchoDeBoton(SIN_RECALCULAR[k]) + 10; }
	return { x, y: Y_FILA, ancho: anchoDeBoton(SIN_RECALCULAR[i]), alto: TB.fila };
}

export function rectanguloDeRecalcularLos() {
	const u = rectanguloDeBotonDeGrupo(SIN_RECALCULAR.length - 1);
	return { x: u.x + u.ancho + 10, y: Y_FILA, ancho: anchoDeBoton(RECALCULAR_LOS), alto: TB.fila };
}

export function rectanguloDeLaFilaDelPeriodo() {
	const r = rectanguloDeRecalcularLos();
	return { x: X0 - 8, y: Y_FILA - 6, ancho: r.x + r.ancho + 8 - (X0 - 8), alto: TB.fila + 12 };
}

/** Arriba de la tarjeta de pestañas, con el aviso ya recogido. */
export const Y_TARJETA_2 = TB.arriba + ALTO_TARJETA_1_SIN_AVISO + TB.entreTarjetas;

export const anchoDePestana = (t: string) => Math.round(t.length * 10.5 + 40);

export function rectanguloDePestana(i: number) {
	let x = TB.lados + 8;
	for (let k = 0; k < i; k++) { x += anchoDePestana(TB_TEXTOS.pestanas[k]); }
	return { x, y: Y_TARJETA_2, ancho: anchoDePestana(TB_TEXTOS.pestanas[i]), alto: TB.pestanas };
}
export const FINALES = TB_TEXTOS.pestanas.indexOf('Finales');

/** Lo de dentro de una pestaña: dos segmentados, la rejilla y la fila de botones. */
export const Y_DENTRO = Y_TARJETA_2 + TB.pestanas + TB.pad;
const ALTO_BLOQUE = TB.rotulo + TB.control + TB.trasControl;
export const Y_BOTONES = Y_DENTRO + ALTO_BLOQUE * 3 + 4;
export const Y_PROMOVIDOS = Y_BOTONES + TB.botones + TB.trasBotones;

export function rectanguloDeCalcularPromovidos() {
	return { x: X0, y: Y_PROMOVIDOS, ancho: anchoDeBoton(TB_TEXTOS.calcular), alto: TB.botones };
}

export function rectanguloDeLaConfirmacion() {
	return { x: X0, y: Y_PROMOVIDOS, ancho: ANCHO_TARJETA - TB.pad * 2, alto: TB.confirma + 12 + TB.botones };
}

export function rectanguloDeConfirmar() {
	return { x: X0, y: Y_PROMOVIDOS + TB.confirma + 12, ancho: anchoDeBoton(CONFIRMA), alto: TB.botones };
}

export const enLaCascara = (r: { x: number; y: number; ancho: number; alto: number }) => ({ ...r, x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra });

/* ── El papel: «Promovidos y no promovidos» de 9°B, hoja 1 ────────────────────────────────── */

export type Decision = 'Promovido' | 'NO PROMOVIDO' | 'Promoción pendiente' | 'Sin definir';

export interface FilaDePromocion {
	nombre: string;
	prom: string;
	asig: number;
	areas: number;
	quedan: string;
	faltas: number;
	decision: Decision;
}

/*
 * LOS PROMEDIOS DEL AÑO SON INVENTADOS (de todas las asignaturas, no sólo Matemáticas). Lo que
 * cuadra con la serie: Valentina ya no debe nada --recuperó Matemáticas en el vídeo 5-- y Samuel
 * sigue debiendo Inglés, que es lo que lista «Recuperación del año».
 */
const PROMEDIOS = ['86.4', '76.1', '93.8', '71.2', '72.5', '81.9'];
const FALTAS = [1, 4, 0, 6, 9, 2];

const debeDe = (i: number) => (i === SAMUEL ? ARRASTRAN.find((a) => a.nombre.startsWith('Delgado'))!.filas.map((f) => f.materia) : []);

export const PROMOCION_9B: FilaDePromocion[] = ALUMNOS.map((a, i) => {
	const debe = debeDe(i);
	return {
		nombre: a.nombre,
		prom: PROMEDIOS[i],
		asig: debe.length,
		areas: debe.length,
		quedan: debe.join(', '),
		faltas: FALTAS[i],
		decision: debe.length ? 'Promoción pendiente' : 'Promovido',
	};
});

/** Lo que dice la hoja ANTES de calcular: todo el grupo «Sin definir». */
export const SIN_CALCULAR: Decision = 'Sin definir';

/* Matemáticas de Valentina va perdida en el año y recuperada: por eso sale Promovido. */
if (ANO_MATEMATICAS_9B[VALENTINA].ano >= 60 || PROMOCION_9B[VALENTINA].asig !== 0) {
	throw new Error('Datos: Valentina tiene que llegar aquí con Matemáticas perdida en el año y ya recuperada.');
}

/** La hoja apaisada: la caja útil de una Letter horizontal con 8 mm de margen. */
export const HOJA_APAISADA = { ancho: 980, alto: 740 };

/** La franja que se lee de cerca: la tabla. Coordenadas de la hoja. */
export const ACERCAMIENTO_PROMOVIDOS = { y: 60, alto: 240 };
