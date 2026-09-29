import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, centro, foco, puntoDe, rectDelMenu } from '../comun-directivo/lugar';
import {
	COPIAR, EL_ALUMNO, FILAS, PERIODO, UBICACION_DESTINO, UBICACION_ORIGEN, rectAlumno, rectColumnas, rectCopiarDialogo, rectFila, rectLado,
	rectListaDialogo, rectOpcionAlumno, rectPeriodo, rectTabla,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «PROMOCIONAR NOTAS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **El pareo va por materia y se enseña antes de copiar.** En cuanto hay periodo a los dos
 *     lados, la tabla ya dice, fila por fila, qué va a pasar --«Se creará», «Reemplaza el 65»,
 *     «Ya vale lo mismo», «No existe en el destino»-- y nada se escribe hasta el botón. El pareo es
 *     por `materia_id` (`tipos.ts`, `parear()`), no por nombre ni por posición.
 *
 *     Y copiar **no tiene vuelta atrás**: lo dice el propio diálogo. Ese paso va en rojo y se queda
 *     un segundo más (PLAN §2.8). Lo copiado queda marcado Manual (`escrituras.ts`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS: la llegada; elegir el alumno y los dos periodos; el pareo; copiar.
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaAca: 40,
	pulsaAca: 46,
	abreAca: 48,
	llegaEntrada: 90,
	pulsaEntrada: 100,
	monta: 104,

	llegaAlumno: 240,
	pulsaAlumno: 250,
	abreAlumno: 252,
	llegaOpcion: 272,
	pulsaOpcion: 282,
	/** `years-con-notas` vuelve: las ubicaciones entran a los dos lados (la derecha copia a la izquierda). */
	ubicaciones: 294,

	llegaOrigen: 385,
	pulsaOrigen: 397,
	llegaDestino: 470,
	pulsaDestino: 482,
	/** `notas/alumno-periodo-grupo` vuelve y la tabla se pinta, con las copiables ya marcadas. */
	tabla: 494,

	llegaCopiar: 975,
	pulsaCopiar: 987,
	abreDialogo: 989,
	llegaConfirmar: 1140,
	pulsaConfirmar: 1152,
	cierraDialogo: 1154,
	/** Una petición por materia marcada; vuelven y sale un solo aviso. */
	copiado: 1176,
	cursorSale: 1240,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Académico ▸ Promocionar notas', url: '/promocionar-notas' };

export const MENU_R = {
	academico: rectDelMenu('Académico', null, null),
	entrada: rectDelMenu('Académico', 'Promocionar notas', 'Académico'),
};

const losDosLados = () => {
	const a = rectLado('origen');
	const b = rectLado('destino');
	return { x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: a.alto };
};

export const FOCOS = {
	academico: enElFotograma(MENU_R.academico),
	lados: foco(losDosLados(), 8),
	origen: foco(rectLado('origen'), 6),
	destino: foco(rectLado('destino'), 6),
	tabla: foco(rectTabla(), 4),
	pareo: foco(rectColumnas('materia', 'destino'), 4),
	sinPareja: foco(rectFila(FILAS.findIndex((f) => f.estado === 'sin-pareja')), 4),
	quePasara: foco(rectColumnas('pasara'), 4),
	dialogo: foco(rectListaDialogo(), 10),
	manual: foco(rectColumnas('manual'), 4),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	academico: puntoDe(MENU_R.academico),
	promocionar: puntoDe(MENU_R.entrada),
	alumno: centro(rectAlumno('origen')),
	opcion: centro(rectOpcionAlumno(EL_ALUMNO)),
	origen: centro(rectPeriodo('origen', UBICACION_ORIGEN, PERIODO)),
	destino: centro(rectPeriodo('destino', UBICACION_DESTINO, PERIODO)),
	copiar: centro(COPIAR),
	confirmar: centro(rectCopiarDialogo()),
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Promocionar notas está en Académico.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: T.pulsaAca + 10 },
	{ desde: 125, texto: 'Copia las definitivas de un periodo a otro.', ...AQUI, foco: FOCOS.lados, focoHasta: T.llegaAlumno - 30 },
	{ desde: 235, texto: 'Al elegir el alumno, a la derecha sale el mismo.', ...AQUI },
	{ desde: 365, texto: 'Un clic en el periodo de donde salen.', ...AQUI, foco: FOCOS.origen },
	{ desde: 465, texto: 'Otro clic, a dónde van: 9°A.', voz: 'Otro clic, a dónde van: noveno A.', ...AQUI, foco: FOCOS.destino, focoHasta: T.tabla - 4 },
	{ desde: 580, texto: 'La tabla enseña el pareo: va por materia, no por fila.', ...AQUI, foco: FOCOS.tabla },
	{ desde: 730, texto: 'Lo que el destino no tiene, no se copia.', ...AQUI, foco: FOCOS.sinPareja },
	{ desde: 840, texto: 'Lee cada fila: «Reemplaza el 65» pisaría una nota.', ...AQUI, foco: FOCOS.quePasara, focoHasta: T.llegaCopiar - 8 },
	{ desde: 1000, texto: 'Copiar pisa las notas que ya había, y no hay vuelta atrás.', ...AQUI, foco: FOCOS.dialogo, focoHasta: T.llegaConfirmar - 6, rojo: true },
	{ desde: 1170, texto: 'Lo copiado queda Manual: ya no se recalcula solo.', ...AQUI, foco: FOCOS.manual },
];

/** `this.aviso.exito('4 copiadas')`: uno solo por la tanda, no uno por materia. */
export const AVISO = { desde: T.copiado, dura: 60, texto: '4 copiadas' };

export const TARJETA = 1300;
export const DURACION = TARJETA + 120;

export const CLAVE = 'promocionar-notas';
export const TITULO = 'Promocionar notas';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Académico' },
	{ desde: 235, titulo: 'De aquí y a aquí: alumno y periodos' },
	{ desde: 580, titulo: 'El pareo, antes de copiar' },
	{ desde: 975, titulo: 'Copiar: no hay vuelta atrás' },
];

export const CIERRE: Cierre = {
	hiciste: 'Copiaste las definitivas del periodo 2 de 9°B a las de 9°A.',
	seVe: 'Las filas copiadas dicen «Ya vale lo mismo» y quedan Manual.',
	despues: 'Siguiente: el horario del colegio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[5].desde < T.tabla + 14) { throw new Error('Guion: el paso 6 señala la tabla antes de que se pinte.'); }
if (PASOS[8].desde < T.abreDialogo + 10 || PASOS[8].desde > T.pulsaConfirmar - 150) {
	throw new Error('Guion: el aviso rojo tiene que salir con el diálogo abierto y quedarse antes del clic.');
}
