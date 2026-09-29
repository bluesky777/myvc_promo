import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { RITMO_AYUDA } from '../planilla/guion';
import { FOCOS_LLEGADA, TiemposDeLlegada } from '../planilla-nota-rapida/Llegada';
import { LLEGADA_RAPIDA } from '../planilla-nota-rapida/llegada-rapida';
import { CAJA_AVISO, GEOMETRIA, NUEVA, TECLAS, fotograma } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «TOTAL, REAL, M Y R».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Real es la que va al boletín; escribirla enciende M sola, y M es lo que impide que el
 *     recálculo la pise.** Los tooltips de las cabeceras lo dicen con esas palabras
 *     (`planilla-notas.html`), y `guardarDefinitiva` pone `manual = 1` al volver el PUT.
 *
 * Y la precondición, en cartel propio y lo primero (PLAN §2.7): las tres sólo se tocan con
 * nivelar abierto (`!puedeNivelar()` las apaga).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Académico -> Mis asignaturas -> Planilla de 9°B
 *     2. REAL         Total y Real; se teclea 75 en la Real de Samuel -> «Cambiada: 75», M sola
 *     3. M Y R        qué protege M, qué es R, y quitar la M
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO ES EL DE LA APLICACIÓN
 *
 * Real guarda como las notas (`myvcGuardarSiCambia` con `ESPERA_AL_TECLEAR` = 1 s) pero NO va al
 * lote: es un PUT suelto a `notas_finales`. Así que del final del tecleo al aviso:
 *
 *     última tecla ─┬─ 1 s    la casilla espera a que dejes de teclear  (30 fotogramas)
 *                   └─ 0,5 s  la ida y vuelta                           (15)
 *
 * Y quitar M es un clic que va derecho al servidor: medio segundo hasta su aviso.
 */

export const FPS = 30;

/** La llegada rápida, con el segundo rótulo un poco más largo: dice el camino entero. */
export const LLEGADA: TiemposDeLlegada = { ...LLEGADA_RAPIDA, llegaBoton: 170, pulsaBoton: 255, cursorSale: 262, seVaLaCascara: 262, entraLaPlanilla: 290 };
export const ENTRA = LLEGADA.entraLaPlanilla;
const L = (f: number) => ENTRA + f;

/* ── La planilla, en fotogramas LOCALES ───────────────────────────────────────────────────── */

export const PLANILLA = {
	cursorEntra: 120,
	llegaReal: 421,
	pulsaReal: 433,
	teclea: 462,
	porTecla: 5,
	llegaR: 764,
	llegaM: 870,
	pulsaM: 878,
	cursorSale: 950,
};

/** 1 s de la casilla + la ida y vuelta. */
const LO_QUE_TARDA = 45;
/** El clic en una marca: sólo la ida y vuelta. */
const LO_QUE_TARDA_LA_MARCA = 15;

export const ULTIMA_TECLA = PLANILLA.teclea + TECLAS.length * PLANILLA.porTecla;
export const VUELVE_REAL = ULTIMA_TECLA + LO_QUE_TARDA;
export const VUELVE_M = PLANILLA.pulsaM + LO_QUE_TARDA_LA_MARCA;

/** Los avisos, en fotogramas del clip. «Cambiada» dura 2,5 s y el de la marca, también. */
export const AVISOS = [
	{ desde: L(VUELVE_REAL), texto: `Cambiada: ${NUEVA}`, dura: 75 },
	{ desde: L(VUELVE_M), texto: 'Ahora la calculará el sistema.', dura: 75 },
];

export const RITMO_REAL: Ritmo = { ...RITMO_AYUDA, TECLEOS: [], CONFIRMA: 100000, SALIDA: 100000 };

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 4) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

export const FOCOS = {
	...FOCOS_LLEGADA,
	aviso: fotograma(holgado(CAJA_AVISO, 6)),
	total: fotograma(GEOMETRIA.columna('total')),
	real: fotograma(GEOMETRIA.columna('real')),
	m: fotograma(GEOMETRIA.columna('m')),
	r: fotograma(GEOMETRIA.columna('r')),
	/* La cabecera del logro, «Logro 2 · Álgebra», encima de las tres columnas de nota. */
	unidad: fotograma(holgado({ x: GEOMETRIA.cabecera(0).x, y: GEOMETRIA.cabecera(0).y - 45, ancho: GEOMETRIA.anchos.nota * 3, alto: 45 }, 3)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_LA_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Real, M y R sólo se tocan con nivelar abierto.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 140, texto: 'En Mis asignaturas, fila de 9°B: Planilla.', voz: 'En Mis asignaturas, fila de noveno B: Planilla.', ...EN_LA_LISTA, foco: FOCOS.botonPlanilla, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: L(8), texto: 'En nivelaciones, las notas no; las definitivas sí.', ...EN_LA_PLANILLA, foco: FOCOS.aviso },
	{ desde: L(161), texto: 'Total: el promedio de la fila; no se guarda.', ...EN_LA_PLANILLA, foco: FOCOS.total },
	{ desde: L(287), texto: 'Real va al boletín: la automática, o la que escribas.', ...EN_LA_PLANILLA, foco: FOCOS.real },
	{ desde: L(431), texto: 'Se escribe como una nota y se guarda.', ...EN_LA_PLANILLA },
	{ desde: L(VUELVE_REAL), texto: 'Sale «Cambiada: 75», y M se enciende sola.', voz: 'Sale el aviso, y M se enciende sola.', ...EN_LA_PLANILLA, foco: FOCOS.m },
	{ desde: L(640), texto: 'Con M, el recálculo no la pisa.', ...EN_LA_PLANILLA, foco: FOCOS.m },
	{ desde: L(744), texto: 'R: viene de una recuperación, y enciende también M.', ...EN_LA_PLANILLA, foco: FOCOS.r, focoHasta: L(PLANILLA.llegaM - 16) },
	{ desde: L(VUELVE_M), texto: 'Quitar M la devuelve al sistema.', ...EN_LA_PLANILLA },
];

export const TARJETA = L(985);
export const DURACION = TARJETA + 110;

export const CLAVE = 'planilla-real-m-r';

export const TITULO = 'Total, Real, M y R';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Antes: nivelar abierto. Dónde está' },
	{ desde: L(161), titulo: 'Total y Real' },
	{ desde: L(431), titulo: 'Escribir la Real enciende M' },
	{ desde: L(640), titulo: 'Qué protege M, y qué es R' },
];

export const CIERRE: Cierre = {
	hiciste: 'Cambiaste la definitiva de un alumno en la columna Real.',
	seVe: 'Sale «Cambiada: 75» y M queda marcada: el recálculo la respeta.',
	despues: 'El recálculo lo hace coordinación: «Recalcular definitivas y calcular promovidos».',
	voz: 'El recálculo lo hace coordinación.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* ── Las puertas propias ──────────────────────────────────────────────────────────────────── */

/* El aviso de la Real sale donde empieza el paso que lo explica, y el de la M igual. */
if (PASOS[6].desde !== AVISOS[0].desde || PASOS[9].desde !== AVISOS[1].desde) {
	throw new Error('Guion: un aviso no sale donde empieza el paso que lo explica.');
}
/* El tecleo cae dentro del paso que dice «se escribe como una nota». */
if (L(PLANILLA.teclea) < PASOS[5].desde) {
	throw new Error('Guion: se teclea antes de que el rótulo lo cuente.');
}
