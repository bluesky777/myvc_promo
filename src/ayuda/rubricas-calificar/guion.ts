import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { FOCOS_LLEGADA } from '../planilla-nota-rapida/Llegada';
import { ASIGNATURA_ID, alFotograma as alFotogramaR, planoEditor, rectAlerta as rectAlertaR, rectFilaLista } from '../rubricas-montar/datos';
import { BOTON_RUBRICAS, FOCO_BOTON_RUBRICAS, LLEGADA as LLEGADA_RUBRICAS } from '../rubricas-montar/tiempo';
import {
	CRITERIOS, ISABELLA, MARCAS, alFotograma, notaDe, rectAlerta, rectCabecera, rectColumnaNota, rectFila, rectGuardar,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «RÚBRICAS: CALIFICAR».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Una rúbrica a medias no da nota.** Isabella se queda sin el tercer criterio: al guardar
 *        su Nota dice «incompleta» y el aviso cuenta sólo las completas («2 notas escritas»). Lo
 *        dice la propia pantalla debajo de la tabla, y `escribirLasNotas` sólo escribe `completa`.
 *     2. **«Sin casilla» se arregla abriendo antes la planilla.** Emilio no tiene selectores: su
 *        fila de `notas` no existe hasta que la planilla se abre. El aviso amarillo lo dice así.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Académico -> Mis asignaturas -> «Rúbricas» de 9°A -> la rúbrica del taller ->
 *                     el nombre del indicador en «Esta rúbrica ya está en uso»
 *     2. LA PARRILLA  ocho marcas: Daniela y Juan José completos, Isabella a medias
 *     3. GUARDAR      «Guardar marcas y notas»: dos escrituras (las marcas, y las notas del lote)
 *
 * EL RITMO: cada marca es abrir el `<select>`, bajar a la opción y soltar: 14 fotogramas, y 7 entre
 * una y la siguiente. Guardar son dos peticiones seguidas (`rubricas/valorar` y `notas/lote`):
 * un segundo hasta el aviso.
 */

export const FPS = 30;

/** La misma llegada que «Rúbricas: montar»: el camino es el mismo y tiene que verse igual. */
export const LLEGADA = LLEGADA_RUBRICAS;
export const ENTRA = LLEGADA.entraLaPlanilla;
const L = (f: number) => ENTRA + f;

export { BOTON_RUBRICAS };

/** El id del indicador «Taller» de 9°A: el de la dirección de la parrilla. Inventado. */
export const SUBUNIDAD_ID = 8841;

/* ── En fotogramas LOCALES, desde que se monta la pantalla de rúbricas ────────────────────── */

export const T = {
	cursorEntra: 16,
	llegaTaller: 60,
	pulsaTaller: 75,
	llegaEnlace: 200,
	pulsaEnlace: 215,
	/** La parrilla llega: su GET. */
	montaGrupo: 230,
	cursorGrupo: 240,
	/** La primera marca; luego una cada `PASO_MARCA`. */
	marcas: 392,
	llegaGuardar: 899,
	pulsaGuardar: 914,
	cursorSale: 1063,
};

export const DURA_MARCA = 14;
export const PASO_MARCA = 21;
/** Las dos escrituras de Guardar: la ida y vuelta de cada una. */
export const LO_QUE_TARDA_GUARDAR = 30;
export const VUELVE_GUARDAR = T.pulsaGuardar + LO_QUE_TARDA_GUARDAR;

export const inicioDeMarca = (k: number) => T.marcas + k * PASO_MARCA;

/** Las notas que escribe el lote: las completas. */
export const ESCRITAS = (() => {
	const m = [0, 1, 2].map((fila) => CRITERIOS.map((_, c) => MARCAS.find((x) => x.fila === fila && x.criterio === c)?.nivel ?? null));
	return m.filter((f) => notaDe(f) !== null).length;
})();

export const AVISO = { desde: L(VUELVE_GUARDAR), dura: 75 };

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 5) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });
const alertaEnUso = rectAlertaR(planoEditor({ enUso: true, pesos: false, sinNiveles: false }, 3).alertas.enUso!);

export const FOCOS = {
	...FOCOS_LLEGADA,
	boton: FOCO_BOTON_RUBRICAS,
	filaTaller: alFotogramaR(holgado(rectFilaLista(1), 4)),
	enUso: alFotogramaR(holgado(alertaEnUso, 4)),
	cabecera: alFotograma(holgado(rectCabecera(), 3)),
	isabella: alFotograma(holgado(rectFila(ISABELLA), 3)),
	sinCasilla: alFotograma(holgado(rectAlerta(), 4)),
	guardar: alFotograma(holgado(rectGuardar())),
	nota: alFotograma(holgado(rectColumnaNota(), 3)),
};

/** Dónde queda el enlace «Taller» del aviso, en coordenadas del panel de rúbricas. */
export const ENLACE = { x: alertaEnUso.x + 44 + 205, y: alertaEnUso.y + 14 + 26 + 4 + 14 };

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_RUBRICAS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Rúbricas', url: `/rubricas/${ASIGNATURA_ID}` };
const EN_EL_GRUPO = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Rúbricas ▸ Calificar', url: `/rubricas/calificar/${SUBUNIDAD_ID}` };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Ve a Académico, Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 116, texto: 'En 9°A, el botón Rúbricas.', voz: 'En noveno A, el botón Rúbricas.', ...EN_LA_LISTA, foco: FOCOS.boton, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: L(10), texto: 'Abre la rúbrica del indicador que vas a calificar.', ...EN_RUBRICAS, foco: FOCOS.filaTaller, focoHasta: L(T.pulsaTaller - 10) },
	{ desde: L(140), texto: 'El aviso nombra el indicador: púlsalo.', ...EN_RUBRICAS, foco: FOCOS.enUso, focoHasta: L(T.pulsaEnlace) },
	{ desde: L(250), texto: 'Una fila por estudiante; un criterio por columna.', ...EN_EL_GRUPO, foco: FOCOS.cabecera },
	{ desde: L(382), texto: 'Elige un nivel en cada criterio.', ...EN_EL_GRUPO },
	{ desde: L(555), texto: 'A Isabella le falta uno: su rúbrica no da nota.', ...EN_EL_GRUPO, foco: FOCOS.isabella },
	{ desde: L(687), texto: '¿Fila sin selectores? Abre antes la planilla.', ...EN_EL_GRUPO, foco: FOCOS.sinCasilla },
	{ desde: L(830), texto: 'Guardar: la nota la calcula el servidor.', ...EN_EL_GRUPO, foco: FOCOS.guardar, focoHasta: L(T.pulsaGuardar + 6) },
	{ desde: L(VUELVE_GUARDAR), texto: `Sale «Marcas guardadas y ${ESCRITAS} notas escritas».`, ...EN_EL_GRUPO, foco: FOCOS.nota },
];

export const TARJETA = L(1078);
export const DURACION = TARJETA + 120;

export const CLAVE = 'rubricas-calificar';

export const TITULO = 'Rúbricas: calificar';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la rúbrica y su indicador' },
	{ desde: L(250), titulo: 'La parrilla: un nivel por criterio' },
	{ desde: L(555), titulo: 'A medias no da nota; sin casilla' },
	{ desde: L(830), titulo: 'Guardar marcas y notas' },
];

export const CIERRE: Cierre = {
	hiciste: 'Calificaste el taller con la rúbrica: un nivel por criterio.',
	seVe: `Sale «Marcas guardadas y ${ESCRITAS} notas escritas», y la nota en su columna.`,
	despues: 'Emilio: abre la planilla y vuelve; ya tendrá casilla.',
	voz: 'Emilio: abre la planilla y vuelve.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* ── Las puertas propias ──────────────────────────────────────────────────────────────────── */

if (PASOS[9].desde !== AVISO.desde) {
	throw new Error('Guion: el aviso de guardar no sale donde empieza el paso que lo cuenta.');
}
if (L(inicioDeMarca(MARCAS.length - 1) + DURA_MARCA) > PASOS[6].desde) {
	throw new Error('Guion: las marcas siguen cuando el rótulo ya habla de Isabella.');
}
if (ESCRITAS !== 2) {
	throw new Error(`Guion: el rótulo cuenta 2 notas escritas y las marcas dan ${ESCRITAS}.`);
}
