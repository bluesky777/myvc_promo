import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, SECCIONES, alturaEnMenu } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_ASISTENCIAS, EL_GRUPO, GRUPOS, HOY, MATEO, SIN_GRUPO, alFotograma, botonDeGrupoEnCascara, rectAlerta, rectCabecera, rectCelda, rectPar } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ASISTENCIAS» (`/asistencias`, Disciplina ▸ Asistencias).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Las de clase aquí sólo se miran.** Los dos pares de columnas no son lo mismo: las de
 *        CLASES las pone cada docente en su planilla y aquí salen como fichas sin casilla (el
 *        tooltip de «Ver clases» lo dice así); las de la INSTITUCIÓN se editan con el número.
 *     2. **El candado de notas cierra también la asistencia.** Con el periodo cerrado sale el aviso
 *        «Este periodo está bloqueado y no se puede modificar la asistencia.» y las casillas se
 *        apagan (`puedeEditar` = `periodoAbiertoParaEscribir`, el mismo candado que las notas).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO ES EL DE LA APLICACIÓN
 *
 * La casilla espera un segundo después de la última tecla (`escribirContador`, 1000 ms) y crea la
 * falta con la fecha de ahora (`ausencias/store`): un segundo y la ida y vuelta hasta la ficha.
 * No sale ningún aviso verde: la pantalla sólo avisa si falla.
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 14,
	llegaSeccion: 40,
	pulsaSeccion: 46,
	llegaEntrada: 95,
	pulsaEntrada: 105,
	montaPagina: 109,
	llegaGrupo: 200,
	pulsaGrupo: 215,
	seVaLaCascara: 220,
	entraPanel: 260,
};

export const ENTRA = LLEGADA.entraPanel;
const L = (f: number) => ENTRA + f;

/* ── El panel, en fotogramas LOCALES ──────────────────────────────────────────────────────── */

export const PANEL = {
	cursorEntra: 40,
	llegaContador: 199,
	pulsaContador: 211,
	tecla: 229,
	cierra: 394,
	cursorSale: 380,
};
const ESPERA = 30;
const IDA_Y_VUELTA = 15;
export const VUELVE = PANEL.tecla + ESPERA + IDA_Y_VUELTA;
export const RELEVO = 10;

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const DISCIPLINA = ENTRADA_ASISTENCIAS.seccion;
const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 5) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

export const PUNTOS_LLEGADA = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 },
	seccion: { x: 150, y: alturaEnMenu(SECCIONES, DISCIPLINA, null, null) + MEDIDAS.seccion / 2 },
	hija: { x: 150, y: alturaEnMenu(SECCIONES, DISCIPLINA, ENTRADA_ASISTENCIAS.hija, DISCIPLINA) + MEDIDAS.hija / 2 },
	grupo: (() => { const r = botonDeGrupoEnCascara(EL_GRUPO); return { x: r.x + r.ancho / 2, y: r.y + r.alto / 2 }; })(),
};

const filaDeGrupos = (() => {
	const a = botonDeGrupoEnCascara(0);
	return { x: a.x, y: a.y, ancho: GRUPOS.length * (SIN_GRUPO.selector.ancho + SIN_GRUPO.selector.hueco) - SIN_GRUPO.selector.hueco, alto: a.alto };
})();

export const FOCOS = {
	disciplina: enElFotograma({ x: 0, y: alturaEnMenu(SECCIONES, DISCIPLINA, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	grupos: enElFotograma(holgado(filaDeGrupos)),
	cabecera: alFotograma(holgado(rectCabecera(false), 3)),
	clases: alFotograma(holgado(rectPar(0, false), 3)),
	institucion: alFotograma(holgado(rectPar(1, false), 3)),
	celda: alFotograma(holgado(rectCelda(MATEO, 2, false), 3)),
	alerta: alFotograma(holgado(rectAlerta(), 4)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Disciplina', url: 'micolegio.micolevirtual.com/up2/' };
const EN_ASISTENCIAS = { ubicacion: 'Menú ▸ Disciplina ▸ Asistencias', url: '/asistencias' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Las asistencias están en Disciplina, Asistencias.', ...EN_EL_MENU, foco: FOCOS.disciplina, focoHasta: LLEGADA.pulsaSeccion + 20 },
	{ desde: 148, texto: 'Elige el grupo arriba: aquí, 9B.', voz: 'Elige el grupo arriba: aquí, noveno B.', ...EN_ASISTENCIAS, foco: FOCOS.grupos, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: L(12), texto: 'Las de clase vienen de la planilla: aquí sólo se miran.', ...EN_ASISTENCIAS, foco: FOCOS.clases },
	{ desde: L(143), texto: 'Las de la institución sí se editan: sube el número.', ...EN_ASISTENCIAS, foco: FOCOS.institucion, focoHasta: L(PANEL.llegaContador - 10) },
	{ desde: L(VUELVE), texto: 'Un segundo después se anota, con la fecha de hoy.', ...EN_ASISTENCIAS, foco: FOCOS.celda },
	{ desde: L(PANEL.cierra), texto: 'Con el periodo cerrado se cierra también; lo reabre el administrador.', ...EN_ASISTENCIAS, foco: FOCOS.alerta },
];

export const TARJETA = L(545);
export const DURACION = TARJETA + 120;

export const CLAVE = 'asistencias-consulta';

export const TITULO = 'Asistencias';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Disciplina, Asistencias' },
	{ desde: L(12), titulo: 'Las de clase sólo se miran' },
	{ desde: L(143), titulo: 'Las de la institución se editan' },
	{ desde: L(PANEL.cierra), titulo: 'Periodo cerrado: también la asistencia' },
];

export const CIERRE: Cierre = {
	hiciste: 'Anotaste una ausencia a la institución y viste las de clase.',
	seVe: `Sale la ficha «${HOY}» junto al número, sin aviso: sólo avisa si falla.`,
	despues: 'Las de clase se pasan en la planilla: «Pasar asistencia desde la planilla».',
	voz: 'Las de clase se pasan en la planilla.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* La ficha nueva sale donde empieza el paso que la cuenta, y el cierre no pilla el puntero. */
if (PASOS[4].desde !== L(VUELVE)) { throw new Error('Guion: la falta nueva no sale donde empieza su paso.'); }
if (PANEL.cursorSale > PANEL.cierra) { throw new Error('Guion: el puntero sigue cuando cambia el periodo.'); }
