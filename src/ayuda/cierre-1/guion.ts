import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS, NOTAS_PERDIDAS, alturaDeEntrada } from '../medidas';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { DEFINITIVAS as BOTON_DEFINITIVAS, LA_QUE_SE_ABRE, rectanguloDelBoton } from '../planilla/datos';
import { LA_QUE_SE_CAMBIA, focoDeColumnas, rectanguloDeLaNota } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 1 DE 8: «ANTES DE CERRAR: A QUIÉN LE FALTA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Una nota perdida se califica desde «Notas perdidas», sin abrir la planilla.** El docente
 *        que tiene cinco grupos no va planilla por planilla buscando rojos: la lista ya los junta.
 *     2. **«Auto» no se redondea a propósito.** El 73.3333 al lado del 73 no es un fallo de
 *        formato: es la columna enseñando en qué se diferencia la calculada de la que sale en el
 *        informe. Es la pregunta que llega cuando alguien ve decimales por primera vez.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA       menú -> Académico -> Notas perdidas
 *     2. LA LISTA         se teclea la nota nueva de Felipe, se guarda sola, sale el aviso
 *     3. LAS DEFINITIVAS  Mis asignaturas -> «Definitivas» de 9°B, a pantalla completa
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO ES EL DE LA APLICACIÓN
 *
 * La casilla de «Notas perdidas» guarda **un segundo después de la última tecla** si el valor
 * cambió (`myvcGuardarSiCambia`), y el PUT va y vuelve en medio segundo:
 *
 *     última tecla ─┬─ 1 s    la casilla espera a que dejes de teclear  (30 fotogramas)
 *                   └─ 0,5 s  la ida y vuelta                           (15)
 *
 * Y como en la planilla, la cuenta va **hacia atrás** desde el paso que explica el aviso: el aviso
 * sale donde empieza ese paso, y la puerta de abajo lo exige.
 */

export const FPS = 30;

/* ── ACTO 1: la llegada ───────────────────────────────────────────────────────────────────── */

export const LLEGADA = {
	cursorEntra: 14,
	llegaAcademico: 40,
	pulsaAcademico: 46,
	abreAcademico: 48,
	llegaNotasPerdidas: 104,
	pulsaNotasPerdidas: 114,
	montaLista: 118,
};

/* ── ACTO 2: la lista ─────────────────────────────────────────────────────────────────────── */

export const LISTA = {
	/** El puntero baja hasta la casilla de Felipe y la pincha. */
	llegaCasilla: 206,
	pulsaCasilla: 212,
	/** Dos teclas, a cinco fotogramas: «6», «5». */
	empieza: 241,
	porTecla: 5,
	aviso: 296,
};

/** 1 s de la casilla + la ida y vuelta. */
const LO_QUE_TARDA = 45;
const ULTIMA_TECLA = LISTA.empieza + LA_QUE_SE_CAMBIA.valor.length * LISTA.porTecla;

if (LISTA.aviso - ULTIMA_TECLA !== LO_QUE_TARDA) {
	throw new Error(
		`Guion: el aviso sale ${LISTA.aviso - ULTIMA_TECLA} fotogramas después de la última tecla, y la ` +
			`aplicación tarda ${LO_QUE_TARDA}.`,
	);
}

/* ── ACTO 3: a las definitivas ────────────────────────────────────────────────────────────── */

export const IDA = {
	/** El puntero sale de la casilla --y la casilla pierde el foco-- camino del menú. */
	sueltaCasilla: 426,
	llegaMisAsignaturas: 444,
	pulsaMisAsignaturas: 454,
	/** La lista vieja se va desde el clic (4 grupos a 4 fotogramas, 14 cada uno) y luego entra esta. */
	montaMisAsignaturas: 481,
	llegaBoton: 546,
	pulsaBoton: 560,
	cursorSale: 572,
	seVaLaCascara: 576,
	entranLasDefinitivas: 610,
};

export const FOCOS = {
	academico: enElFotograma({
		x: 0,
		y: alturaDeEntrada(ACADEMICO, null, false),
		ancho: MEDIDAS.menu,
		alto: MEDIDAS.seccion,
	}),
	casilla: enElFotograma(rectanguloDeLaNota(LA_QUE_SE_CAMBIA.grupo, LA_QUE_SE_CAMBIA.alumno, LA_QUE_SE_CAMBIA.linea)),
	misAsignaturas: enElFotograma({
		x: 0,
		y: alturaDeEntrada(ACADEMICO, MIS_ASIGNATURAS, true),
		ancho: MEDIDAS.menu,
		alto: MEDIDAS.hija,
	}),
	botonDefinitivas: enElFotograma(rectanguloDelBoton(LA_QUE_SE_ABRE, BOTON_DEFINITIVAS)),
	/** Periodo 2 (índice 1): Auto con Final. */
	autoYFinal: focoDeColumnas(1, 0, 1),
	/** La columna Manual del periodo 1: la marca que deja fija una definitiva tecleada. */
	manual: focoDeColumnas(0, 2, 2),
};

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	notasPerdidas: { x: 150, y: alturaDeEntrada(ACADEMICO, NOTAS_PERDIDAS, true) + MEDIDAS.hija / 2 },
	casilla: centro(rectanguloDeLaNota(LA_QUE_SE_CAMBIA.grupo, LA_QUE_SE_CAMBIA.alumno, LA_QUE_SE_CAMBIA.linea)),
	misAsignaturas: { x: 150, y: alturaDeEntrada(ACADEMICO, MIS_ASIGNATURAS, true) + MEDIDAS.hija / 2 },
	botonDefinitivas: centro(rectanguloDelBoton(LA_QUE_SE_ABRE, BOTON_DEFINITIVAS)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Notas perdidas', url: '/notas-perdidas' };
const EN_MIS_ASIGNATURAS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_DEFINITIVAS = {
	ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Definitivas',
	url: '/definitivas-periodos/1222',
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Lo pendiente está en Académico, en Notas perdidas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 142, texto: 'Cada nota perdida sale aquí, y se califica sin abrir la planilla.', ...EN_LA_LISTA, foco: FOCOS.casilla },
	{ desde: LISTA.aviso, texto: 'Al segundo de la última tecla, se guarda y lo avisa.', ...EN_LA_LISTA },
	{ desde: IDA.sueltaCasilla, texto: 'Para ver el periodo entero: Mis asignaturas.', ...EN_LA_LISTA, foco: FOCOS.misAsignaturas, focoHasta: IDA.pulsaMisAsignaturas + 10 },
	{ desde: IDA.llegaBoton, texto: 'En la fila de 9°B, Definitivas.', voz: 'En la fila de noveno B, Definitivas.', ...EN_MIS_ASIGNATURAS, foco: FOCOS.botonDefinitivas, focoHasta: IDA.pulsaBoton },
	{ desde: 662, texto: 'Auto es la calculada, sin redondear; Final, la del informe.', ...EN_DEFINITIVAS, foco: FOCOS.autoYFinal },
	/* ADVERTENCIAS-AYUDA.md: la Final tecleada a mano queda fija y «Recalcular definitivas» no la toca. */
	{ desde: 825, texto: 'No teclees la Final: queda fija, y ni Recalcular la cambia.', ...EN_DEFINITIVAS, foco: FOCOS.manual },
	{ desde: 981, texto: 'Corrige el indicador; si ya la tecleaste, desmarca Manual.', ...EN_DEFINITIVAS, foco: FOCOS.manual },
];

/**
 * LO QUE DURA EL AVISO. En la aplicación son 2 s; aquí se queda mientras el paso 3 lo explica, que
 * es la misma licencia que se toma la planilla y por lo mismo: quitarlo antes dejaría al rótulo
 * hablando de algo que ya no está.
 */
export const AVISO_DURA = PASOS[3].desde - LISTA.aviso;

export const TARJETA = 1136;
export const DURACION = TARJETA + 150;

export const CLAVE = 'cierre-1-quien-falta';

export const TITULO = 'Antes de cerrar: a quién le falta';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Académico, Notas perdidas' },
	{ desde: LLEGADA.montaLista, titulo: 'La lista: una fila por alumno' },
	{ desde: LISTA.pulsaCasilla, titulo: 'Calificar sin abrir la planilla' },
	{ desde: IDA.entranLasDefinitivas, titulo: 'Definitivas: Auto al lado de Final' },
	{ desde: PASOS[6].desde, titulo: 'Corregir una Final: el indicador, no a mano' },
];

export const CIERRE: Cierre = {
	hiciste: 'Calificaste una nota perdida sin abrir la planilla.',
	seVe: 'Sale «Cambiada: 65», y en Definitivas, Auto sin redondear junto a la Final.',
	despues: 'Siguiente, 2 de 8: cerrar el periodo con el semáforo.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El aviso tiene que salir donde empieza el paso que lo explica. */
if (PASOS[2].desde !== LISTA.aviso) {
	throw new Error(`Guion: el aviso sale en ${LISTA.aviso} y el paso que lo explica empieza en ${PASOS[3].desde}.`);
}
