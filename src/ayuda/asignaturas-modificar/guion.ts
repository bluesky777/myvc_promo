import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ASIGNATURAS, ENTRADA_DEL_PUNTERO, puntoDelMenu, rectDelMenu } from '../montar-el-ano/EnLaCascara';
import {
	centro, rectBotonDeCelda, rectBotonDelModal, rectBotonFicha, rectCampo, rectCeldas, rectCuadre, rectDetalleDelModal, rectFiltro,
	rectOpcion, rectPapelera, rectRestaurar, type Rect,
} from '../montar-el-ano/planoAsignaturas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { BIOLOGIA, CATEDRA, DETALLE_CATEDRA, M, estadoEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «CAMBIAR O QUITAR UNA ASIGNATURA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Cambiar el docente a mitad de año no mueve las notas.** Son de la asignatura, no de
 *        quien la dicta: `putUpdate` cambia `profesor_id` y nada más. La nueva docente las
 *        encuentra en su planilla, y el que se va deja de ver esa asignatura (Mis asignaturas
 *        filtra por `a.profesor_id`) pero conserva las demás.
 *     2. **La papelera devuelve la fila.** Eliminar sólo marca `deleted_at` (`SoftDeletes`), y
 *        «Restaurar» lo desmarca (`putRestaurar`): vuelve con todo lo que colgaba de ella. Y el
 *        diálogo de antes enseña qué cuelga --95 notas en dos periodos--, que es lo que asusta.
 *
 * Lo que NO se afirma: que la nueva docente «vea las notas» en otro sitio que no sea su planilla,
 * ni nada sobre boletines ya impresos. El vídeo dice sólo lo que el código hace.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA     Referencias -> Asignaturas; el filtro en 9°B
 *     2. EL DOCENTE     el lápiz de Biología, Profesor: Sandra, Guardar cambios
 *     3. QUITAR         la papelera roja de Cátedra: el diálogo, Eliminar; el cuadre lo nota
 *     4. DEVOLVER       abajo, Mostrar papelera, Restaurar; el cuadre vuelve a verde
 *
 * Dura 74 s. Son dos tareas y no cabrían por separado en vídeos útiles: cambiar el docente son
 * quince segundos, y quitar sin enseñar que se devuelve es justo el vídeo que asusta.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LOS AVISOS SON LOS DE LA APLICACIÓN, con su duración: «Asignatura actualizada con éxito» (2 s),
 * «Asignatura Cátedra de la Paz eliminada con éxito» (3 s), «Asignatura Cátedra de la Paz
 * restaurada» (3 s).
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => enElFotograma({ x: r.x - margen, y: r.y - margen, ancho: r.ancho + margen * 2, alto: r.alto + margen * 2 });

export const FOCOS = {
	menu: enElFotograma(rectDelMenu(null, false)),
	filtro: f(rectFiltro(estadoEn(M.llegaFiltro), 'grupo')),
	lapiz: f(rectBotonDeCelda(estadoEn(M.llegaEditar), BIOLOGIA, 'editar'), 8),
	biologia: f(rectCeldas(estadoEn(M.guardada + 30), BIOLOGIA, 'materia', 'profesor'), 2),
	papeleraRoja: f(rectBotonDeCelda(estadoEn(M.llegaBorrar), CATEDRA, 'borrar'), 8),
	notas: f(rectDetalleDelModal(DETALLE_CATEDRA), 2),
	botonPapelera: f(rectPapelera(estadoEn(M.bajaHasta + 4))),
	restaurar: f(rectRestaurar(estadoEn(M.abrePapelera + 4), 0)),
	cuadreDeVuelta: f(rectCuadre(estadoEn(M.subeHasta + 4)), 4),
};

const opcion = (frame: number) => {
	const e = estadoEn(frame);
	return centro(rectOpcion(e, e.desplegable!, 0));
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu(null, false),
	asignaturas: puntoDelMenu(ASIGNATURAS, true),
	filtro: centro(rectFiltro(estadoEn(M.llegaFiltro), 'grupo')),
	opcionFiltro: opcion(M.llegaOpcionFiltro),
	lapiz: centro(rectBotonDeCelda(estadoEn(M.llegaEditar), BIOLOGIA, 'editar')),
	profesor: centro(rectCampo(estadoEn(M.llegaProfesor), 'profesor')),
	opcionProfesor: opcion(M.llegaOpcionProfesor),
	guardar: centro(rectBotonFicha(estadoEn(M.llegaGuardar), 'primero')),
	papeleraRoja: centro(rectBotonDeCelda(estadoEn(M.llegaBorrar), CATEDRA, 'borrar')),
	eliminar: centro(rectBotonDelModal(DETALLE_CATEDRA, 'eliminar')),
	botonPapelera: centro(rectPapelera(estadoEn(M.llegaPapelera))),
	restaurar: centro(rectRestaurar(estadoEn(M.llegaRestaurar), 0)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Asignaturas', url: '/asignaturas' };

/** `focoDesde`: el foco espera a que la página acabe de bajar, para no recortar algo que todavía se mueve. */
export const PASOS: (Paso & { focoDesde?: number })[] = [
	{ desde: 10, texto: 'Está en Referencias ▸ Asignaturas.', voz: 'Está en Referencias, Asignaturas.', ...EN_EL_MENU, foco: FOCOS.menu, focoHasta: M.pulsaReferencias + 10 },
	{ desde: 125, texto: 'El filtro de grupo deja las de 9°B.', voz: 'El filtro de grupo deja las de nueve B.', ...AQUI, foco: FOCOS.filtro, focoHasta: M.pulsaFiltro + 8 },
	{ desde: 224, texto: 'Diego se va: el lápiz de Biología.', ...AQUI, foco: FOCOS.lapiz, focoHasta: M.pulsaEditar - 8 },
	{ desde: 330, texto: 'En Profesor, quien lo reemplaza; y Guardar.', ...AQUI },
	{ desde: 456, texto: 'Las notas son de la asignatura: Sandra ve las de Diego.', ...AQUI, foco: FOCOS.biologia },
	{ desde: 594, texto: 'Para quitarla, la papelera roja de su fila.', ...AQUI, foco: FOCOS.papeleraRoja, focoHasta: M.pulsaBorrar + 10 },
	{ desde: 711, texto: 'Antes, avisa lo que cuelga de ella: 95 notas.', ...AQUI, foco: FOCOS.notas },
	{ desde: 861, texto: 'Eliminar la manda a la papelera; sus notas se quedan.', ...AQUI },
	{ desde: 992, texto: '¿Borraste la que no era? Abajo, «Mostrar papelera».', voz: '¿Borraste la que no era? Abajo, Mostrar papelera.', ...AQUI, foco: FOCOS.botonPapelera, focoDesde: M.bajaHasta, focoHasta: M.pulsaPapelera + 10 },
	{ desde: 1143, texto: 'Restaurar la devuelve a la rejilla, con sus notas.', ...AQUI, foco: FOCOS.restaurar, focoHasta: M.pulsaRestaurar + 2 },
	{ desde: 1275, texto: 'Y 9°B vuelve a cuadrar: 30 de 30.', voz: 'Y nueve B vuelve a cuadrar: 30 de 30.', ...AQUI, foco: FOCOS.cuadreDeVuelta },
];

export const AVISOS = [
	{ desde: M.guardada, dura: fotogramasDe(2000), texto: 'Asignatura actualizada con éxito' },
	{ desde: M.eliminada, dura: fotogramasDe(3000), texto: 'Asignatura Cátedra de la Paz eliminada con éxito' },
	{ desde: M.restaurada, dura: fotogramasDe(3000), texto: 'Asignatura Cátedra de la Paz restaurada' },
];

export const TARJETA = 1395;
export const DURACION = TARJETA + 130;

export const CLAVE = 'asignaturas-modificar';
export const TITULO = 'Cambiar o quitar una asignatura';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Asignaturas' },
	{ desde: 224, titulo: 'Cambiar el docente a mitad de año' },
	{ desde: 594, titulo: 'Quitar una asignatura' },
	{ desde: 992, titulo: 'La papelera la devuelve' },
];

export const CIERRE: Cierre = {
	hiciste: 'Pasaste Biología de 9°B a Sandra, y quitaste y devolviste Cátedra de la Paz.',
	seVe: 'Sandra en la fila de Biología, y «Asignatura Cátedra de la Paz restaurada».',
	despues: 'Siguiente: copiar las asignaturas de un grupo a otro.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Los rótulos que explican un efecto empiezan cuando el efecto ya está en pantalla. */
const despuesDe = (paso: number, momento: number, que: string) => {
	if (PASOS[paso].desde < momento) {
		throw new Error(`Guion: el paso ${paso + 1} habla de ${que} desde ${PASOS[paso].desde}, y eso pasa en ${momento}.`);
	}
};
despuesDe(4, M.guardada, 'la fila cambiada');
despuesDe(6, M.llegaDetalle, 'el detalle del diálogo');
despuesDe(10, M.subeHasta, 'el cuadre de vuelta');
