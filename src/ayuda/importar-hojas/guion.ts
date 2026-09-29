import { MENU_DIRECTIVO } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, LLEGADA, centro, crece, foco, puntoDelMenu, rectDelMenu, type Rect } from '../personas/comun';
import { BOTONES_DIRECTORIO } from '../secretaria/planoDirectorio';
import { botonesDeCabecera, enCascara } from '../secretaria/piezas';
import { LA_MALA, LA_QUE_FALTA } from '../importar/datos';
import {
	ALTO_LEYENDO,
	ALTO_SOLTAR,
	type EstadoImportar,
	rectBloqueo,
	rectContenido,
	rectElegir,
	rectFila,
	rectNav,
	rectSiguiente,
	rectTabla,
} from '../importar/Pantalla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «IMPORTAR DE EXCEL: HOJAS Y COLUMNAS». El primero de dos.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **El ensayo lee el libro y no escribe nada.** Lo dice la pantalla cuatro veces
 *     (`importar-alumnos.html`: «Todavía no escribe nada», «Se sube para leerlo, no para
 *     importarlo», «No se escribe nada» mientras lee) y lo firma el servidor: el ensayo contesta
 *     `escribe: false` (`ImportarController`). Quien pulsa «Elegir fichero» con miedo a haber
 *     metido 142 alumnos de golpe es a quien va este vídeo.
 *
 * Y las dos cosas que se miran antes de decidir nada: **cada pestaña es un grupo y se llama como
 * su abreviatura** («Séptimo A» no es «7A», y detiene la importación: el `motivo` de
 * `hoja_sin_grupo` en `ImportarController`), y **las columnas se buscan por su nombre**; si falta
 * una, la tercera columna dice qué se guardaría (`EnsayoDeLaImportacion::COLUMNAS`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Personas -> Alumnos -> «Importar alumnos»
 *     2. EL ENSAYO    «Elegir fichero», se lee, y salen los pasos
 *     3. LO QUE HAY   Hojas (la pestaña mal nombrada) y Columnas (la que falta)
 *
 * NO SE ELIGE NADA EN «QUÉ HACEMOS» a propósito: la decisión («Saltarla entera» / «Parar la
 * importación») no se refleja en el plan hasta «Volver a leer», y saltarla deja fuera a sus 35
 * alumnos. El vídeo recomienda renombrarla, que es lo que dice la propia alerta del front.
 *
 * LO QUE TARDA LA LECTURA (2 s) es del vídeo: depende del libro y del servidor, y la pantalla no
 * promete ningún tiempo.
 */

export const FPS = 30;
const MENU = MENU_DIRECTIVO;

export const T = {
	...LLEGADA,
	/* La llegada por el menú, apretada (como en alumnos-directorio): el camino se ve entero. */
	cursorEntra: 12,
	llegaPersonas: 34,
	pulsaPersonas: 40,
	abrePersonas: 42,
	llegaEntrada: 70,
	pulsaEntrada: 80,
	monta: 84,
	llegaImportar: 185,
	pulsaImportar: 195,
	montaImportar: 199,
	llegaElegir: 240,
	pulsaElegir: 250,
	empiezaALeer: 254,
	terminaDeLeer: 314,
	ensayo: 322,
	llegaSiguiente: 460,
	pulsaSiguiente: 472,
	hojas: 474,
	encimaHoja: 797,
	bajaDesde: 890,
	bajaHasta: 920,
	llegaSiguiente2: 924,
	pulsaSiguiente2: 932,
	columnas: 934,
	bajaColumnasDesde: 990,
	bajaColumnasHasta: 1026,
	cursorSale: 1061,
};

export const BAJA_HOJAS = 75;
export const BAJA_COLUMNAS = 800;

/* Los estados de la pantalla en los momentos que el guion señala. */
export const E_INICIO: EstadoImportar = { fase: 'inicio', malaLaHoja: true, paso: 'archivo' };
export const E_LEYENDO: EstadoImportar = { fase: 'leyendo', malaLaHoja: true, paso: 'archivo', progreso: 40 };
export const E_ARCHIVO: EstadoImportar = { fase: 'ensayo', malaLaHoja: true, paso: 'archivo' };
export const E_HOJAS: EstadoImportar = { fase: 'ensayo', malaLaHoja: true, paso: 'hojas' };
export const E_HOJAS_ABAJO: EstadoImportar = { ...E_HOJAS, desplazada: BAJA_HOJAS };
export const E_COLUMNAS: EstadoImportar = { fase: 'ensayo', malaLaHoja: true, paso: 'columnas' };
export const E_COLUMNAS_ABAJO: EstadoImportar = { ...E_COLUMNAS, desplazada: BAJA_COLUMNAS };

const importar: Rect = enCascara(botonesDeCabecera(BOTONES_DIRECTORIO.slice(0, 4))[2]);
const union = (a: Rect, b: Rect): Rect => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), ancho: Math.max(a.x + a.ancho, b.x + b.ancho) - Math.min(a.x, b.x), alto: Math.max(a.y + a.alto, b.y + b.alto) - Math.min(a.y, b.y) });

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(MENU, null, false),
	alumnos: puntoDelMenu(MENU, 'Alumnos', true),
	importar: centro(importar),
	elegir: centro(rectElegir(E_INICIO)),
	siguiente: centro(rectSiguiente(E_ARCHIVO)),
	select: { x: rectFila(E_HOJAS, LA_MALA).x + 680 + 120, y: rectFila(E_HOJAS, LA_MALA).y + 25 },
	siguiente2: centro(rectSiguiente(E_HOJAS_ABAJO)),
};

const filaMala = rectFila(E_HOJAS, LA_MALA);
export const FOCOS = {
	personas: foco(rectDelMenu(MENU, null, false), 8),
	importar: foco(crece(importar, 6), 8),
	soltar: foco(crece(rectContenido(E_INICIO, ALTO_SOLTAR), 6), 10),
	leyendo: foco(crece(rectContenido(E_LEYENDO, ALTO_LEYENDO), 6), 10),
	nav: foco(crece(rectNav(E_ARCHIVO), 6), 12),
	tablaHojas: foco(crece(rectTabla(E_HOJAS), 4), 10),
	laMala: foco(crece(union(filaMala, rectBloqueo(E_HOJAS)), 4), 10),
	select: foco(crece({ x: filaMala.x + 680, y: filaMala.y, ancho: filaMala.ancho - 680, alto: filaMala.alto }, 2), 8),
	cabeceraColumnas: foco(crece({ ...rectTabla(E_COLUMNAS), alto: 36 + 4 * 58 }, 4), 10),
	laQueFalta: foco(crece(rectFila(E_COLUMNAS_ABAJO, LA_QUE_FALTA), 4), 8),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_ALUMNOS = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };
const EN_IMPORTAR = { ubicacion: 'Menú ▸ Personas ▸ Alumnos ▸ Importar alumnos', url: '/alumnos/importar' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Personas, Alumnos.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: T.pulsaPersonas + 16 },
	{ desde: 113, texto: 'Arriba, Importar alumnos.', ...EN_ALUMNOS, foco: FOCOS.importar, focoHasta: T.pulsaImportar - 2 },
	{ desde: 210, texto: 'Se sube para leerlo: dice qué pasaría, sin escribir nada.', ...EN_IMPORTAR, foco: FOCOS.soltar, focoHasta: T.pulsaElegir - 2 },
	{ desde: 365, texto: 'Arriba, los pasos: mira los de número amarillo.', ...EN_IMPORTAR, foco: FOCOS.nav, focoHasta: T.pulsaSiguiente - 4 },
	{ desde: 501, texto: 'Cada pestaña es un grupo, y se llama como su abreviatura.', ...EN_IMPORTAR, foco: FOCOS.tablaHojas },
	{ desde: 635, texto: '«Séptimo A» no es un grupo: detendría la importación.', ...EN_IMPORTAR, foco: FOCOS.laMala },
	{ desde: 776, texto: 'Renómbrala «7A» en tu Excel, o decide aquí: saltarla o parar.', voz: 'Renómbrala siete A en tu Excel, o decide aquí: saltarla o parar.', ...EN_IMPORTAR, foco: FOCOS.select, focoHasta: T.bajaDesde - 2 },
	{ desde: 938, texto: 'Las columnas se buscan por nombre.', ...EN_IMPORTAR, foco: FOCOS.cabeceraColumnas, focoHasta: T.bajaColumnasDesde - 2 },
	{ desde: 1033, texto: 'Si falta una, dice qué se guardaría.', ...EN_IMPORTAR, foco: FOCOS.laQueFalta },
	{ desde: 1144, texto: 'Si un documento cambió, corrígelo antes: si no, crea otro alumno.', ...EN_IMPORTAR },
];

export const TARJETA = 1324;
export const DURACION = TARJETA + 120;

export const CLAVE = 'importar-hojas';
export const TITULO = 'Importar de Excel: hojas y columnas';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Alumnos, Importar alumnos' },
	{ desde: 210, titulo: 'El ensayo: lee sin escribir' },
	{ desde: 501, titulo: 'Las hojas: una por grupo' },
	{ desde: 938, titulo: 'Las columnas y la que falta' },
];

export const CIERRE: Cierre = {
	hiciste: 'Subiste el libro a leer y revisaste sus hojas y sus columnas.',
	seVe: '«Séptimo A» en rojo y «Fecha de nacim» como «No está»; nada escrito todavía.',
	despues: 'Siguiente: importar de Excel, decidir y comprobar.',
	voz: 'Siguiente: decidir e importar.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.ensayo >= PASOS[3].desde || T.hojas >= PASOS[4].desde || T.columnas >= PASOS[7].desde) {
	throw new Error('Guion: una pantalla llega después del paso que la explica.');
}
