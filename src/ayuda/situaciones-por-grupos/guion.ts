import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EL_GRUPO, GEO_SIT, MENU_SIT, centro } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «SITUACIONES POR GRUPOS».
 *
 * LA DUDA QUE MATA: **no pide nada, y sale sólo quien tiene algo.** No hay grupo que elegir ni
 * filtro: al abrirla trae todo el colegio (`cargar()` en `ngOnInit`, «Trayendo las situaciones de
 * todo el colegio…»), y de cada grupo sólo salen los alumnos con alguna situación en algún periodo
 * (`putSituacionesPorGrupos` descarta al que tiene los cuatro vacíos). Quien busca a un alumno que
 * «no sale» está buscando a alguien que no tiene ninguna.
 *
 * 40 s: es la pantalla más simple de la serie y no hay más que contar.
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 16,
	llegaSeccion: 44,
	pulsaSeccion: 50,
	abreSeccion: 52,
	llegaEntrada: 96,
	pulsaEntrada: 108,
	monta: 114,
	/** «Trayendo…» y el informe. */
	cargado: 162,
};

export const RECORRIDO = {
	bajaDesde: 232,
	bajaHasta: 272,
	scroll: 490,
	subeDesde: 523,
	subeHasta: 553,
	llegaImprimir: 571,
};

const f = enElFotograma;

export const FOCOS = {
	disciplina: f(MENU_SIT.seccion),
	grupo: f(GEO_SIT.grupo(EL_GRUPO, RECORRIDO.scroll)),
	alumno: f(GEO_SIT.alumno(EL_GRUPO, 0, RECORRIDO.scroll)),
	imprimir: f(GEO_SIT.imprimir),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	seccion: { x: 150, y: MENU_SIT.seccion.y + MEDIDAS.seccion / 2 },
	entradaSit: { x: 150, y: MENU_SIT.hija.y + MEDIDAS.hija / 2 },
	reposo: { x: MEDIDAS.ancho - 170, y: MEDIDAS.alto - 40 },
	imprimir: centro(GEO_SIT.imprimir),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Disciplina', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Disciplina ▸ Situaciones por grupos', url: '/disciplina/situaciones-por-grupos' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Disciplina, Situaciones por grupos.', ...EN_EL_MENU, foco: FOCOS.disciplina, focoHasta: LLEGADA.pulsaSeccion + 20 },
	{ desde: 122, texto: 'No pide nada: trae todos los grupos.', ...AQUI },
	{ desde: 232, texto: 'Sólo sale quien tiene alguna situación.', ...AQUI, foco: FOCOS.grupo },
	{ desde: 329, texto: 'De Noveno B salen tres.', ...AQUI, foco: FOCOS.grupo },
	{ desde: 410, texto: 'Una columna por periodo, con tipo y fecha.', ...AQUI, foco: FOCOS.alumno, focoHasta: RECORRIDO.subeDesde - 4 },
	{ desde: 527, texto: 'Imprimir saca la hoja sin los botones.', ...AQUI, foco: FOCOS.imprimir },
];

export const TARJETA = 634;
export const DURACION = 754;

export const CLAVE = 'situaciones-por-grupos';
export const TITULO = 'Situaciones por grupos';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Disciplina, Situaciones por grupos' },
	{ desde: PASOS[2].desde, titulo: 'Sale sólo quien tiene alguna' },
	{ desde: PASOS[5].desde, titulo: 'Imprimir' },
];

export const CIERRE: Cierre = {
	hiciste: 'Abriste el resumen de situaciones de todo el colegio, por grupos.',
	seVe: 'Cada alumno con alguna situación, con sus cuatro periodos al lado; el resto no sale.',
	despues: 'Para el detalle de un alumno: Disciplina, Disciplina, y su grupo.',
	voz: 'El detalle de un alumno está en Disciplina.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (LLEGADA.cargado > PASOS[1].desde + 60) {
	throw new Error('Guion: el informe tiene que llegar mientras el paso 2 dice que se trae solo.');
}
