import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EL_ESTUDIANTE, EL_GRUPO, GEO_RUTA, MENU_RUTA, centro } from '../ruta-inclusion/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * RUTA DE INCLUSIÓN, 1: «EL GRUPO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA, Y LO QUE DE ELLA SIGUE SIENDO VERDAD EN APP2
 *
 *     El plan la escribió así: «hay que pasar por el grupo antes que por la ficha, o subir un
 *     documento da 404». En app2 **la segunda mitad ya no pasa**: la ficha vuelve a pedir el grupo
 *     entero al abrirse (`alumno-inclusion.ts`, «entrar por la dirección funciona igual que llegar
 *     desde el listado»), justo para que un enlace suelto no dé 404. Lo que sigue siendo cierto, y
 *     es lo que el vídeo enseña, es el orden: **sin grupo no hay lista**, y es al elegir el grupo
 *     cuando el servidor prepara las fichas de sus estudiantes con ERE (`ruta-inclusion.ts`:
 *     «Y ESE GET ESCRIBE. Crea la fila de `piars_grupos` que falte, una de `piars_alumnos` por cada
 *     alumno con ERE…»). El vídeo no enseña ni promete el 404.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * DATOS DE MENORES: dos estudiantes inventados, sin diagnóstico (la pantalla no tiene ese campo) y
 * con observaciones de aula genéricas. Ver `ruta-inclusion/datos.ts`.
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 16,
	llegaAcademico: 44,
	pulsaAcademico: 50,
	abreAcademico: 52,
	llegaRuta: 110,
	pulsaRuta: 122,
	monta: 128,
};

export const GRUPO_T = {
	llega: 452,
	pulsa: 470,
	/** «Cargando el grupo…», y el grupo. */
	cargado: 520,
	llegaContexto: 722,
	pulsaContexto: 735,
	llegaFila: 1153,
	pulsaFila: 1165,
	/** La ficha, cuando el listado ha acabado de irse. */
	montaFicha: 1225,
};

const f = enElFotograma;

export const FOCOS = {
	academico: f(MENU_RUTA.academico),
	selector: f(GEO_RUTA.selector),
	estrella: f(GEO_RUTA.boton(EL_GRUPO)),
	titular: f(GEO_RUTA.titular),
	contexto: f(GEO_RUTA.contexto(true)),
	lista: f(GEO_RUTA.lista(true)),
	pie: f(GEO_RUTA.pie(true)),
	fila: f(GEO_RUTA.fila(EL_ESTUDIANTE, true)),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: MENU_RUTA.academico.y + MEDIDAS.seccion / 2 },
	ruta: { x: 150, y: MENU_RUTA.ruta.y + MEDIDAS.hija / 2 },
	reposo: { x: MEDIDAS.ancho - 170, y: MEDIDAS.alto - 40 },
	grupo: centro(GEO_RUTA.boton(EL_GRUPO)),
	contexto: centro(GEO_RUTA.resumenContexto),
	fila: { x: MEDIDAS.menu + 520, y: centro(GEO_RUTA.fila(EL_ESTUDIANTE, true)).y },
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_RUTA = { ubicacion: 'Menú ▸ Académico ▸ Ruta de inclusión', url: '/ruta-inclusion' };
const EN_LA_FICHA = { ubicacion: 'Menú ▸ Académico ▸ Ruta de inclusión ▸ Ficha de inclusión', url: '/ruta-inclusion/318/2047' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Académico, al final: Ruta de inclusión.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 138, texto: 'El PIAR de cada estudiante con ERE lo escriben varios.', ...EN_LA_RUTA },
	{ desde: 260, texto: 'Primero se elige el grupo: sin grupo no hay lista.', ...EN_LA_RUTA, foco: FOCOS.selector },
	{ desde: 383, texto: 'La estrella: el grupo del que eres titular.', ...EN_LA_RUTA, foco: FOCOS.estrella, focoHasta: GRUPO_T.pulsa + 6 },
	{ desde: 502, texto: 'Se preparan las fichas de sus estudiantes con ERE.', ...EN_LA_RUTA },
	{ desde: 619, texto: 'Arriba, el titular y cuántos tienen el PIAR al día.', ...EN_LA_RUTA, foco: FOCOS.titular, focoHasta: GRUPO_T.llegaContexto - 10 },
	{ desde: 747, texto: 'El contexto es del grupo, y lo escribe el titular.', ...EN_LA_RUTA, foco: FOCOS.contexto },
	{ desde: 869, texto: 'Una fila por estudiante, con lo que le falta.', ...EN_LA_RUTA, foco: FOCOS.lista },
	{ desde: 989, texto: 'La cuenta mira cuatro partes, no los ajustes por materia.', ...EN_LA_RUTA, foco: FOCOS.pie },
	{ desde: 1133, texto: 'La fila abre la ficha del estudiante.', ...EN_LA_RUTA, foco: FOCOS.fila, focoHasta: GRUPO_T.pulsaFila + 6 },
];

export const TARJETA = 1268;
export const DURACION = 1388;

export const CLAVE = 'ruta-inclusion-grupo';
export const TITULO = 'Ruta de inclusión: el grupo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Académico, Ruta de inclusión' },
	{ desde: PASOS[2].desde, titulo: 'Primero, el grupo' },
	{ desde: PASOS[5].desde, titulo: 'El titular, el contexto y la lista' },
	{ desde: PASOS[9].desde, titulo: 'Abrir la ficha' },
];

export const CIERRE: Cierre = {
	hiciste: 'Elegiste el grupo y abriste la ficha de un estudiante con ERE.',
	seVe: 'La franja del titular dice cuántos tienen el PIAR al día; cada fila, lo que falta.',
	despues: 'Siguiente: las cinco partes de la ficha, y quién escribe cada una.',
	voz: 'Siguiente: las cinco partes de la ficha.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (!(GRUPO_T.pulsa > PASOS[3].desde && GRUPO_T.cargado <= PASOS[4].desde + 20)) {
	throw new Error('Guion: el grupo se pulsa en el paso 4 y se carga cuando empieza el 5.');
}
if (GRUPO_T.pulsaContexto >= PASOS[6].desde) {
	throw new Error('Guion: el contexto se abre antes del paso que lo cuenta.');
}
