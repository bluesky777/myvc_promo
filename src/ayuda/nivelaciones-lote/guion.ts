import { Cierre } from '../Tarjeta';
import { unidadEnElFotograma } from '../cierre-3/datos';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { FOCOS_LLEGADA } from '../planilla-nota-rapida/Llegada';
import { LLEGADA_RAPIDA, PASOS_DE_LLEGADA } from '../planilla-nota-rapida/llegada-rapida';
import { ACTIVIDAD, ENLACE_EN_PLANILLA, NIVELACION, alFotograma, rectBoton, rectCelda, rectFila, rectTabla } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «NIVELACIONES DEL GRUPO, EN LOTE».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Aquí se guarda con botón, y NO se previsualiza la regla del colegio.** Se escribe lo que
 *     sacó (85) y nada dice que va a quedar en 60: eso lo decide el servidor al escribir, y la
 *     pantalla lo enseña DESPUÉS, en la columna Inicial (55 tachado, 60). El diálogo de la celda
 *     --el de `cierre-3`-- es el que la enseña antes.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Académico -> Mis asignaturas -> Planilla de 9°B -> el enlace del modo
 *                     nivelación, «Ver todo lo perdido del grupo en una lista»
 *     2. LA LISTA     un bloque por alumno; 85 en el quiz de Valentina y la actividad
 *     3. REGISTRAR    el botón; «Se registró 1 nivelación.» y el quiz con 55 tachado y 60
 *
 * EL RITMO: se teclea a una letra cada 3 fotogramas; el lote es un PUT (`notas/nivelar/lote`):
 * medio segundo hasta el aviso, que dura 4 s (`duration: 4000`).
 */

export const FPS = 30;

export const LLEGADA = LLEGADA_RAPIDA;
export const ENTRA = LLEGADA.entraLaPlanilla;
const L = (f: number) => ENTRA + f;

/* ── En fotogramas LOCALES, desde que se monta la planilla ────────────────────────────────── */

export const T = {
	cursorEntra: 40,
	llegaEnlace: 110,
	pulsaEnlace: 128,
	montaLista: 148,
	cursorLista: 160,
	pulsaNivelacion: 290,
	teclaNivelacion: 302,
	pulsaActividad: 330,
	teclaActividad: 342,
	llegaBoton: 640,
	pulsaBoton: 660,
	cursorSale: 740,
};

export const POR_LETRA = 3;
export const VUELVE = T.pulsaBoton + 15;
export const AVISO = { desde: L(VUELVE), dura: 120 };

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 5) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

export const FOCOS = {
	...FOCOS_LLEGADA,
	enlace: { ...holgado(ENLACE_EN_PLANILLA, 6), radio: 8 },
	/* «Logro 2 · Álgebra», la cabecera del logro en la planilla de `cierre-3`. */
	unidad: unidadEnElFotograma(),
	tabla: alFotograma(holgado(rectTabla(), 4)),
	nivelacion: alFotograma(holgado(rectCelda(1, 'nivelacion'), 2)),
	fila: alFotograma(holgado(rectFila(1), 3)),
	boton: alFotograma(holgado(rectBoton())),
	inicial: alFotograma(holgado(rectCelda(1, 'inicial'), 2)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };
const EN_NIVELACIONES = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla ▸ Nivelaciones', url: '/nivelaciones/1222' };

export const PASOS: Paso[] = [
	...PASOS_DE_LLEGADA(),
	{ desde: L(8), texto: 'En nivelaciones, la planilla trae «Ver todo lo perdido…».', voz: 'En nivelaciones, la planilla trae este enlace.', ...EN_LA_PLANILLA, foco: FOCOS.enlace, focoHasta: L(T.pulsaEnlace + 4) },
	{ desde: L(150), texto: 'Todo lo perdido del grupo, un bloque por alumno.', ...EN_NIVELACIONES, foco: FOCOS.tabla },
	{ desde: L(271), texto: `En Nivelación va lo que sacó en la superación: ${NIVELACION}.`, ...EN_NIVELACIONES, foco: FOCOS.fila },
	{ desde: L(415), texto: `La regla del colegio no se ve aquí: el ${NIVELACION} no avisa.`, ...EN_NIVELACIONES, foco: FOCOS.nivelacion },
	{ desde: L(560), texto: 'Se guarda con el botón «Registrar 1 nivelación».', voz: 'Se guarda con el botón Registrar una nivelación.', ...EN_NIVELACIONES, foco: FOCOS.boton, focoHasta: L(T.pulsaBoton + 4) },
	{ desde: L(VUELVE), texto: 'Sale el aviso, con la regla aplicada: 55 tachado, 60.', voz: 'Sale el aviso, con la regla ya aplicada.', ...EN_NIVELACIONES, foco: FOCOS.inicial },
	/* La advertencia de ADVERTENCIAS-AYUDA.md (cierre-3): nivelar no es corregir. */
	{ desde: L(785), texto: 'No niveles para corregir: si fue un error, corrige la nota.', ...EN_NIVELACIONES },
	{ desde: L(938), texto: 'Para ver antes lo que quedará: el diálogo de la celda.', ...EN_NIVELACIONES },
];

export const TARJETA = L(1069);
export const DURACION = TARJETA + 90;

export const CLAVE = 'nivelaciones-lote';

export const TITULO = 'Nivelaciones del grupo, en lote';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la planilla, en nivelaciones' },
	{ desde: L(150), titulo: 'La lista: lo perdido del grupo' },
	{ desde: L(415), titulo: 'La regla no se ve antes' },
	{ desde: L(560), titulo: 'Registrar con el botón' },
];

export const CIERRE: Cierre = {
	hiciste: `Registraste la nivelación del quiz de Valentina desde la lista del grupo.`,
	seVe: 'Sale «Se registró 1 nivelación.», y en Inicial, 55 tachado y 60.',
	despues: 'Uno a uno y viendo la regla: «Nivelar no es corregir».',
	voz: 'Nivelar no es corregir.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[7].desde !== AVISO.desde) { throw new Error('Guion: el aviso no sale donde empieza el paso que lo cuenta.'); }
if (L(T.teclaActividad + ACTIVIDAD.length * POR_LETRA) > PASOS[5].desde) { throw new Error('Guion: la actividad se sigue escribiendo cuando el rótulo ya habla de la regla.'); }
