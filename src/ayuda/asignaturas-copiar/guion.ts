import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ASIGNATURAS, ENTRADA_DEL_PUNTERO, puntoDelMenu, rectDelMenu } from '../montar-el-ano/EnLaCascara';
import { centro, rectColumnas, rectCopia, rectOpcion, rectVerSus, type Rect } from '../montar-el-ano/planoAsignaturas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { M, estadoEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «COPIAR LAS ASIGNATURAS DE UN GRUPO A OTRO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Copia el reparto, no las notas.** Materia, docente, IH y orden: eso es lo que viaja
 *     (`postCopiar`, un INSERT con esas columnas). Ni notas, ni días de clase, ni el porcentaje del
 *     área. Y una segunda, que muerde en enero: **no reemplaza, suma**. Copiar sobre un grupo que
 *     ya tiene asignaturas las duplica, porque el servidor no mira qué hay en el destino.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA    Referencias -> Asignaturas; el cuadre dice que 9°B tiene 0 de 30
 *     2. LA COPIA      se filtra 9°B (vacío), abajo: origen 9°A, destino 9°B, Copiar
 *     3. LO QUE LLEGÓ  las diez filas con sus docentes; lo que no viaja; el cuadre en verde
 *
 * El aviso «Asignaturas copiadas» dura 3 s (`duration: 3000`) y la lista se recarga sola: ya no
 * hace falta el «Actualice» de la vieja.
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => enElFotograma({ x: r.x - margen, y: r.y - margen, ancho: r.ancho + margen * 2, alto: r.alto + margen * 2 });

export const FOCOS = {
	menu: enElFotograma(rectDelMenu(null, false)),
	verSus: f(rectVerSus(estadoEn(M.llegaVerSus), 0)),
	tarjeta: f(rectCopia(estadoEn(M.bajaHasta + 2), 'tarjeta'), 4),
	reparto: f(rectColumnas(estadoEn(M.subeHasta + 2), 'materia', 'ih'), 2),
	loQueNo: f(rectColumnas(estadoEn(M.subeHasta + 2), 'area', 'd1'), 2),
};

const opcion = (frame: number) => {
	const e = estadoEn(frame);
	return centro(rectOpcion(e, e.desplegable!, 0));
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu(null, false),
	asignaturas: puntoDelMenu(ASIGNATURAS, true),
	verSus: centro(rectVerSus(estadoEn(M.llegaVerSus), 0)),
	origen: centro(rectCopia(estadoEn(M.llegaOrigen), 'origen')),
	opcionOrigen: opcion(M.llegaOpcionOrigen),
	destino: centro(rectCopia(estadoEn(M.llegaDestino), 'destino')),
	opcionDestino: opcion(M.llegaOpcionDestino),
	copiar: centro(rectCopia(estadoEn(M.llegaCopiar), 'boton')),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Asignaturas', url: '/asignaturas' };

/** `focoDesde`: el foco espera a que la página acabe de bajar, para no recortar algo que todavía se mueve. */
export const PASOS: (Paso & { focoDesde?: number })[] = [
	{ desde: 10, texto: 'Está en Referencias ▸ Asignaturas.', voz: 'Está en Referencias, Asignaturas.', ...EN_EL_MENU, foco: FOCOS.menu, focoHasta: M.pulsaReferencias + 10 },
	{ desde: 125, texto: '«Ver sus asignaturas»: 9°B está vacío.', voz: 'Ver sus asignaturas: nueve B está vacío.', ...AQUI, foco: FOCOS.verSus, focoHasta: M.pulsaVerSus - 6 },
	{ desde: 245, texto: 'Va igual que 9°A: se copia, abajo.', voz: 'Va igual que nueve A: se copia, abajo.', ...AQUI, foco: FOCOS.tarjeta, focoDesde: M.bajaHasta },
	{ desde: 373, texto: 'Primero el grupo hecho, luego el vacío, y Copiar.', ...AQUI },
	{ desde: 548, texto: 'Llegan con su docente, IH y orden.', voz: 'Llegan con su docente, intensidad y orden.', ...AQUI, foco: FOCOS.reparto },
	{ desde: 669, texto: 'Sin notas, ni días, ni % del área.', voz: 'Sin notas, ni días, ni porcentaje del área.', ...AQUI, foco: FOCOS.loQueNo },
	{ desde: 807, texto: 'Copia sólo a grupos vacíos: si no, se duplican.', ...AQUI },
];

export const AVISO = { desde: M.copiadas, dura: fotogramasDe(3000), texto: 'Asignaturas copiadas' };

export const TARJETA = 946;
export const DURACION = TARJETA + 125;

export const CLAVE = 'asignaturas-copiar';
export const TITULO = 'Copiar las asignaturas de un grupo a otro';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Asignaturas' },
	{ desde: 245, titulo: 'Copiar de 9°A a 9°B' },
	{ desde: 548, titulo: 'Qué copia y qué no' },
];

export const CIERRE: Cierre = {
	hiciste: 'Copiaste a 9°B las diez asignaturas de 9°A, con sus docentes.',
	seVe: '«Asignaturas copiadas», y arriba «30 de 30 h asignadas · cuadra».',
	despues: 'Siguiente: los días de clase de una asignatura.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[4].desde < M.subeHasta) {
	throw new Error(`Guion: el paso 5 señala las filas copiadas en ${PASOS[4].desde} y la página no ha subido hasta ${M.subeHasta}.`);
}
if (M.pulsaCopiar < PASOS[3].desde) {
	throw new Error(`Guion: se pulsa Copiar en ${M.pulsaCopiar}, antes del rótulo que lo dice.`);
}
