import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { ENTRADA_DEL_PUNTERO, PERSONAS, dePersonas, puntoDelMenu, rectDelMenu } from '../secretaria/menu';
import { centro, type Rect } from '../secretaria/piezas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { DE_LA_FAMILIA, FILA_10A, M, S1, S2, TABLERO } from './datos';
import { bandejaFamiliaEn, botonGrupoEn, disposicion, papelerasEn, escalonPremEn, resumenEn, revisadaEn, viaEn } from './Prematriculas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «PREMATRÍCULAS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Son cinco estados y no cuatro.** Llevó formulario, Prematriculado, **Prematriculó la
 *     familia**, Asistente y Matriculado (`prematriculas.ts:42-48`, 1363-1371). El de la familia
 *     (PREA) lo pone el acudiente desde su panel, sin pasar por secretaría; el Prematriculado
 *     (PREM) lo pone secretaría. La pantalla junta los de la familia en su bandeja para revisarlos,
 *     y «Revisada» los pasa a Prematriculado (`prematriculas.html:400`, `cambiarEstado(alumno,
 *     'PREM')`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA    Personas ▸ Prematrículas: la campaña de 2027 y el resumen del colegio
 *     2. EL GRUPO      Paso 1, el tablero: 10°A. Paso 2, la vía: «4 · 1 los apuntó su familia»
 *     3. LA FAMILIA    la papelera (se vuelve a apuntar en un clic), su bandeja y «Revisada»
 *
 * No se afirma que al elegir el grupo la página baje sola: aquí baja la rueda.
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

const CON = disposicion(TABLERO.length, true);

export const FOCOS = {
	personas: enElFotograma(rectDelMenu(PERSONAS, null, null)),
	resumen: f(resumenEn(CON, 0), 8),
	grupo: f(botonGrupoEn(CON, FILA_10A, S1), 6),
	via: f(viaEn(CON, S2), 6),
	prem: f(escalonPremEn(CON, S2), 6),
	bandeja: f(bandejaFamiliaEn(CON, S2), 6),
	papelera: f(papelerasEn(CON, S2), 4),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(PERSONAS, null, null),
	prematriculas: puntoDelMenu(PERSONAS, dePersonas('Prematrículas'), PERSONAS),
	grupo: { x: botonGrupoEn(CON, FILA_10A, S1).x + 40, y: centro(botonGrupoEn(CON, FILA_10A, S1)).y },
	revisada: centro(revisadaEn(CON, S2)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Personas ▸ Prematrículas', url: '/prematriculas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Están en Personas, en Prematrículas.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: M.pulsaPersonas + 10 },
	{ desde: 126, texto: 'Antes, crea el año 2027 y sus grupos.', ...AQUI, foco: FOCOS.resumen, focoHasta: M.bajaTablero - 4 },
	{ desde: 268, texto: 'Paso 1: eliges el grupo; aquí, 10°A.', voz: 'Paso uno: eliges el grupo; aquí, décimo A.', ...AQUI, foco: FOCOS.grupo, focoHasta: M.cargaGrupo },
	{ desde: 416, texto: 'Prematricula secretaría… o la familia, desde su panel.', ...AQUI, foco: FOCOS.prem },
	{ desde: 570, texto: 'La papelera la quita; si la quitas por error, vuelve a apuntarlo.', ...AQUI, foco: FOCOS.papelera },
	{ desde: 728, texto: 'Lo de la familia sale aparte: «Revisada» lo deja prematriculado.', ...AQUI, foco: FOCOS.bandeja },
];

export const AVISOS = [{ desde: M.revisada, dura: fotogramasDe(3000), texto: 'Alumno prematriculado.' }];

export const TARJETA = 892;
export const DURACION = TARJETA + 132;

export const CLAVE = 'prematriculas';
export const TITULO = 'Prematrículas';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Personas, Prematrículas' },
	{ desde: 268, titulo: 'Paso 1: el tablero de grupos' },
	{ desde: 416, titulo: 'Paso 2: quién prematricula' },
	{ desde: 570, titulo: 'Quitar una prematrícula' },
	{ desde: 728, titulo: 'Lo que apuntó la familia' },
];

export const CIERRE: Cierre = {
	hiciste: `Revisaste la prematrícula que hizo la familia de ${DE_LA_FAMILIA.nombres}.`,
	seVe: 'Sale «Alumno prematriculado.», y ya es de secretaría.',
	despues: 'Siguiente: los requisitos y compromisos del alumno.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (M.bajaPaso2Hasta > PASOS[3].desde) {
	throw new Error('Guion: la página tiene que haber llegado antes de encender el foco del paso.');
}
