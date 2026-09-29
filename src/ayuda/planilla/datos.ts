import { BOTONES as BOTONES_DE_LA_FILA, ANCHO, geometriaDeLaFila } from '../mis-asignaturas/datos';
import { ASIGNATURAS } from './asignaturas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS ASIGNATURAS» PARA LOS VÍDEOS QUE PASAN POR ELLA CAMINO DE OTRA PANTALLA, Y DÓNDE CAE CADA COSA.
 *
 * DESDE EL 2026-09-28 ES EL DIBUJO DE HOY (`mis-asignaturas/`): la franja del grupo, el primer botón
 * con la palabra del colegio («Logros») y azul, «Planilla», «Definitivas», «Rúbricas» apagados y
 * «Cerrar» detrás, y el marco rojo con las etiquetas ámbar donde la planeación no cuadra. Aquí sólo
 * quedan los nombres con los que los vídeos señalan un botón: la geometría es la de allí, y el foco
 * y el puntero salen de la misma cuenta que el dibujo.
 */

export { ASIGNATURAS };
export type { Asignatura } from './asignaturas';

/** La que se abre en el vídeo. */
export const LA_QUE_SE_ABRE = ASIGNATURAS.findIndex((a) => a.materia === 'Matemáticas' && a.grupo === '9°B');

/**
 * LOS CINCO BOTONES DE LA FILA, en el orden de la aplicación (`fila-asignatura.html:81-173`). **La
 * planilla es el segundo**, detrás del de las unidades, que lleva la palabra del colegio.
 */
export const BOTONES = BOTONES_DE_LA_FILA.map((b) => b.texto);
export const UNIDADES = 0;
export const PLANILLA = BOTONES.indexOf('Planilla');
export const DEFINITIVAS = BOTONES.indexOf('Definitivas');
export const RUBRICAS = BOTONES.indexOf('Rúbricas');

/** El ancho útil: el de la cáscara menos el menú. */
export const ANCHO_LISTA = ANCHO;

/** EL RECTÁNGULO DE UN BOTÓN, en coordenadas de la cáscara (con la barra y el menú ya contados). */
export function rectanguloDelBoton(fila: number, boton: number) {
	const r = geometriaDeLaFila(fila).botones[boton];
	if (!r) { throw new Error(`Mis asignaturas: la fila ${fila} no tiene botón ${boton}.`); }
	return r;
}
