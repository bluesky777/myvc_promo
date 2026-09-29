import { enElFotograma } from '../encuadre';
import { MANDOS } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { rectMensajeBorrar, PIE_BORRAR } from '../secretaria/Borrar';
import { ENTRADA_DEL_PUNTERO, PERSONAS, dePersonas, puntoDelMenu, rectDelMenu } from '../secretaria/menu';
import { anchoDeBoton, centro, enCascara, MAIN, type Rect } from '../secretaria/piezas';
import {
	TEXTO_BOTON_SIN_MATRICULA, disposicionDirectorio, rectAccion, rectBotonCabecera, rectCajaBuscar, rectCelda, rectEstado, rectEstadoSinMatricula,
	rectGrupo, rectListaSinMatricula, rectPorNombre, rectRestaurar,
} from '../secretaria/planoDirectorio';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import {
	BORRADO, DESPLAZADA_ABAJO, DESPLAZADA_CAJA, DESPLAZADA_LISTA, DESPLAZADA_RAPIDA, FILA_BORRADA, FILA_CORREGIDA, M, QUIEN_SIGUE, SIN_MATRICULA,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «EL DIRECTORIO DE ALUMNOS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Se guarda al salir de la celda.** No hay botón de guardar: la rejilla tiene
 *        `stopEditingWhenCellsLoseFocus` (`rejilla.ts:450`) y al salir manda `alumnos/guardar-valor`
 *        y avisa «Alumno actualizado.» (`panel-alumnos.ts:675`, 1361).
 *     2. **La papelera se deshace desde el buscador de abajo.** Borrar quita la fila del grupo
 *        («Se va a la papelera con su historial. Se puede restaurar buscándolo abajo.»); quien lo
 *        busca en «Buscar en todo el sistema» lo encuentra con la flecha verde de «Restaurar», y
 *        el aviso pide recargar el grupo (`panel-alumnos.ts:1085-1120`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   Personas ▸ Alumnos, y el grupo 9B
 *     2. LA CELDA     el apellido mal escrito de Valentina se corrige y se guarda al salir
 *     3. LA PAPELERA  el icono rojo, el diálogo con su «¡PELIGRO!», la fila se va
 *     4. LA VUELTA    abajo, «Martín» «Por nombre», la flecha verde, y Recargar
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

const unir = (a: Rect, b: Rect): Rect => ({ x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: a.alto });

const D = disposicionDirectorio(false, false);
/* Desde que se abre, la lista «sin matrícula» se queda abierta: todo lo de debajo baja con ella. */
const DL = disposicionDirectorio(false, false, true, true);
const DR = disposicionDirectorio(false, true, true, true);

/** El botón de la opción rápida, con el texto de `panel-alumnos.html:346`. */
const BOTON_LISTA = TEXTO_BOTON_SIN_MATRICULA(false, SIN_MATRICULA.length);

export const FOCOS = {
	personas: enElFotograma(rectDelMenu(PERSONAS, null, null)),
	grupos: f(enCascara({ x: 0, y: D.selector, ancho: MAIN.ancho, alto: 32 }), 8),
	celda: f(rectCelda(D, FILA_CORREGIDA, 'apellidos'), 2),
	papelera: f(rectAccion(D, FILA_BORRADA, 2), 6),
	/* «Reti» y «Dese», juntos: son las dos maneras de sacar a alguien sin borrarlo. */
	reti: f(unir(rectEstado(D, FILA_BORRADA, 'Reti'), rectEstado(D, FILA_BORRADA, 'Dese')), 6),
	/* El año de arriba, en la barra: sin `f`, que recorta por debajo de la barra. */
	ano: enElFotograma({ x: MANDOS.selector.x - 4, y: MANDOS.selector.y - 4, ancho: MANDOS.selector.ancho + 8, alto: MANDOS.selector.alto + 8 }),
	sinMatricula: f(enCascara({ x: 0, y: D.sinMatricula, ancho: anchoDeBoton(BOTON_LISTA), alto: 32 }, DESPLAZADA_RAPIDA), 6),
	lista: f(rectListaSinMatricula(DL, DESPLAZADA_LISTA), 6),
	matric: f(rectEstadoSinMatricula(DL, 0, 'Matric', DESPLAZADA_LISTA), 6),
	mensaje: f(rectMensajeBorrar(), 4),
	buscador: f(enCascara({ x: 0, y: DL.buscador, ancho: 760, alto: 64 }, DESPLAZADA_CAJA), 8),
	restaurar: f(rectRestaurar(DR, 0, DESPLAZADA_ABAJO), 6),
	recargar: f(rectBotonCabecera(4), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(PERSONAS, null, null),
	alumnos: puntoDelMenu(PERSONAS, dePersonas('Alumnos'), PERSONAS),
	g9B: centro(rectGrupo('9B')),
	celda: { x: rectCelda(D, FILA_CORREGIDA, 'apellidos').x + 110, y: centro(rectCelda(D, FILA_CORREGIDA, 'apellidos')).y },
	fuera: { x: MAIN.x + 700, y: MAIN.y + D.claves + 16 },
	papelera: centro(rectAccion(D, FILA_BORRADA, 2)),
	reti: centro(rectEstado(D, FILA_BORRADA, 'Reti')),
	ano: centro(MANDOS.selector),
	sinMatricula: { x: MAIN.x + anchoDeBoton(BOTON_LISTA) - 40, y: centro(enCascara({ x: 0, y: D.sinMatricula, ancho: 10, alto: 32 }, DESPLAZADA_RAPIDA)).y },
	/* Mientras se mira la lista, el puntero descansa sobre la fila de la retirada, a la derecha. */
	lista: { x: MAIN.x + MAIN.ancho - 260, y: centro(rectEstadoSinMatricula(DL, 1, 'Matric', DESPLAZADA_LISTA)).y + 30 },
	matric: centro(rectEstadoSinMatricula(DL, 0, 'Matric', DESPLAZADA_LISTA)),
	eliminar: centro(PIE_BORRAR[1]),
	caja: { x: rectCajaBuscar(DL, DESPLAZADA_CAJA).x + 160, y: centro(rectCajaBuscar(DL, DESPLAZADA_CAJA)).y },
	porNombre: centro(rectPorNombre(DL, DESPLAZADA_CAJA)),
	restaurar: centro(rectRestaurar(DR, 0, DESPLAZADA_ABAJO)),
	recargar: centro(rectBotonCabecera(4)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'El directorio está en Personas, en Alumnos.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: M.pulsaPersonas + 10 },
	{ desde: 134, texto: 'Pulsas el grupo, 9B, y salen sus alumnos.', voz: 'Pulsas el grupo, noveno B, y salen sus alumnos.', ...AQUI, foco: FOCOS.grupos, focoHasta: M.pulsa9B + 10 },
	{ desde: 275, texto: 'Clic en la celda y escribes; se guarda al salir de ella.', ...AQUI, foco: FOCOS.celda, focoHasta: M.sale + 4 },
	/*
	 * LA REGLA DE JOSETH, en rojo y dicha: los alumnos no se borran nunca. El puntero se queda
	 * sobre la papelera mientras suena, para que se sepa de qué icono se habla.
	 */
	{ desde: 417, texto: 'Los alumnos no se borran nunca: el que se va, «Reti» o «Dese».', voz: 'Los alumnos no se borran nunca: al que se va, se le marca Reti o Dese.', ...AQUI, foco: FOCOS.reti, focoHasta: M.bajaRapidaDesde, rojo: true },
	/* LA OPCIÓN RÁPIDA, HECHA (Joseth, 2026-09-29): se abre la lista, se ve la retirada, y «Matric». */
	{ desde: 618, texto: 'Al cambiar de año, la opción rápida: «Ver alumnos sin matrícula».', voz: 'Al cambiar de año, la opción rápida: Ver alumnos sin matrícula.', ...AQUI, foco: FOCOS.sinMatricula, focoHasta: M.pulsaSinMatricula + 8 },
	{ desde: 774, texto: 'Salen los del grado anterior, también los retirados.', ...AQUI, foco: FOCOS.lista },
	{ desde: 902, texto: 'Antes de «Matric», mira que el año de arriba sea el nuevo.', voz: 'Antes de pulsar Matric, mira que el año de arriba sea el nuevo.', ...AQUI, foco: FOCOS.ano, rojo: true },
	{ desde: 1072, texto: '«Matric» a los que siguen: pasan a su grupo. Los demás se ignoran.', voz: 'Matric a los que siguen: pasan a su grupo. Los demás se ignoran.', ...AQUI, foco: FOCOS.matric, focoHasta: M.pulsaMatric + 8 },
	{ desde: 1246, texto: 'La papelera roja no es retirar: sólo para fichas creadas por error.', ...AQUI, foco: FOCOS.papelera, focoHasta: M.pulsaPapelera + 6, rojo: true },
	{ desde: 1438, texto: 'Si se borró por error, búscalo abajo: la flecha verde lo restaura.', ...AQUI, foco: FOCOS.buscador, focoHasta: M.pulsaPorNombre },
	{ desde: 1650, texto: 'Luego Recargar, arriba, y vuelve a su grupo.', ...AQUI, foco: FOCOS.recargar, focoHasta: M.pulsaRecargar + 8 },
];

export const AVISOS = [
	{ desde: M.guardado, dura: fotogramasDe(3000), texto: 'Alumno actualizado.', tono: 'exito' as const },
	{ desde: M.matriculado, dura: fotogramasDe(3000), texto: 'Alumno matriculado con éxito.', tono: 'exito' as const },
	{ desde: M.eliminado, dura: fotogramasDe(2000), texto: 'Eliminado: Alumno enviado a la papelera.', tono: 'info' as const },
	{ desde: M.restaurado, dura: fotogramasDe(3000), texto: 'Alumno restaurado. Recarga el grupo para verlo.', tono: 'exito' as const },
];

export const TARJETA = 1782;
export const DURACION = 1922;

export const CLAVE = 'alumnos-directorio';
export const TITULO = 'El directorio de alumnos';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Personas, Alumnos' },
	{ desde: 275, titulo: 'Editar en la celda: se guarda al salir' },
	{ desde: 417, titulo: 'Los alumnos no se borran: se retiran' },
	{ desde: 618, titulo: 'La opción rápida al cambiar de año' },
	{ desde: 1246, titulo: 'La papelera no es retirar' },
	{ desde: 1438, titulo: 'Restaurar desde el buscador' },
];

export const CIERRE: Cierre = {
	hiciste: `Corregiste un apellido, matriculaste a ${QUIEN_SIGUE.nombres} desde «sin matrícula» y sacaste a ${BORRADO.nombres} de la papelera.`,
	seVe: 'Sale «Alumno actualizado.», y tras Recargar vuelve a estar en 9B.',
	despues: 'Siguiente: las prematrículas del año que viene.',
	voz: 'Recuerda: los alumnos no se borran, se retiran.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El paso que explica el guardado tiene que estar en pantalla cuando llega el aviso. */
if (!(PASOS[2].desde <= M.guardado && M.guardado < PASOS[3].desde)) {
	throw new Error('Guion: «Alumno actualizado.» tiene que salir durante el paso que lo explica.');
}
/* Cada cosa se señala con la página quieta: la lista ya abierta y abajo, y arriba antes de la papelera. */
if (M.bajaListaHasta > PASOS[5].desde || M.subeHasta1 > M.llegaPapelera || M.subeDesde1 < PASOS[8].desde) {
	throw new Error('Guion: la lista «sin matrícula» se señala con la página quieta.');
}
/* «Matric» se pulsa después de la advertencia del año, y el aviso sale durante su paso. */
if (!(PASOS[7].desde <= M.pulsaMatric && M.matriculado + 100 < PASOS[8].desde)) {
	throw new Error('Guion: «Matric» y su fila nueva van en el paso que los cuenta.');
}
/* La fecha de retiro se enseña durante «también los retirados», y la rejilla vuelve antes de «Matric». */
if (!(PASOS[5].desde <= M.ladoDesde && M.vuelveLadoHasta <= PASOS[6].desde)) {
	throw new Error('Guion: la fecha de retiro se ve durante el paso que habla de los retirados.');
}
/* La advertencia se dice ANTES de pulsar la papelera, no mientras se borra. */
if (M.pulsaPapelera < PASOS[8].desde) {
	throw new Error('Guion: la papelera se pulsa durante su advertencia en rojo.');
}
if (!(PASOS[9].desde <= M.restaurado && M.restaurado < PASOS[10].desde)) {
	throw new Error('Guion: la flecha verde se pulsa durante el paso que la explica.');
}
