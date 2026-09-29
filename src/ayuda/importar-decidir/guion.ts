import { MENU_DIRECTIVO } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, LLEGADA, centro, crece, foco, puntoDelMenu, rectDelMenu, type Rect } from '../personas/comun';
import { BOTONES_DIRECTORIO } from '../secretaria/planoDirectorio';
import { botonesDeCabecera, enCascara } from '../secretaria/piezas';
import { A_IMPORTAR, EL_VACIO, HECHOS, TRUNCADOS } from '../importar/datos';
import {
	COL_TRUNCADOS,
	type EstadoImportar,
	rectCifras,
	rectElegir,
	rectFila,
	rectHecho,
	rectIgnorar,
	rectImportar,
	rectOpcionTruncado,
	rectPieAcciones,
	rectPildora,
	rectReleer,
	rectSelectTruncado,
	rectSiguiente,
	rectTabla,
} from '../importar/Pantalla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «IMPORTAR DE EXCEL: DECIDIR Y COMPROBAR». El segundo de dos.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA, Y UNA CORRECCIÓN AL PLAN
 *
 *     El plan (PLAN-VIDEOS-AYUDA.md §4.F) dice «hoy sólo mandan las equivalencias». **Ya no es
 *     así**: desde `8myvc@fb5a146` las cinco secciones se aplican --`RespuestasDeLaImportacion::
 *     APLICADAS = ['vocabularios', 'vacios', 'repetidos', 'duplicados', 'hojas']` y `NO_APLICADAS`
 *     está vacía («Hoy no queda ninguna»)--, y la pantalla lo dice arriba: «Lo que decidas aquí sí
 *     se aplica». El vídeo enseña lo que es verdad hoy: el informe final dice qué obedeció
 *     («El importador obedeció lo que decidiste en: vocabularios, vacios»).
 *
 *     Lo que sí sigue en pie: **el informe final marca «No cuadra»** en la fila cuyo número no
 *     coincide con el plan (`compararPrometidoConHecho`, `cuadra: prometido === hecho`). El vídeo
 *     importa un libro que cuadra entero --que es lo normal-- y señala la columna donde saldría.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA    Personas -> Alumnos -> Importar alumnos -> Elegir fichero, y a «Celdas vacías»
 *     2. DECIDIR       Barrio: «Ignorar el Excel»; Sexo «Hombre» -> M; Estado «Activo» -> MATR
 *     3. RELEER        «Volver a leer con estas correcciones», y «Qué va a pasar»
 *     4. IMPORTAR      el botón que escribe (cartel rojo), y «Lo que pasó»
 *
 * EL LIBRO ES EL DEL VÍDEO ANTERIOR CON LA PESTAÑA YA RENOMBRADA («7A»): por eso Hojas no lleva
 * contador. LA CONTRASEÑA de los usuarios nuevos, que sale en el aviso azul de «Qué va a pasar»,
 * va **borrosa** a propósito: es la de fábrica de todos los colegios y esto se publica.
 *
 * LO QUE TARDAN LA LECTURA, LA RELECTURA Y LA IMPORTACIÓN es del vídeo; la pantalla no promete
 * ningún tiempo. El aviso del final es el de `importar()`: «N creados y M actualizados.».
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
	llegaImportar: 197,
	pulsaImportar: 207,
	montaImportar: 211,
	llegaElegir: 230,
	pulsaElegir: 240,
	empiezaALeer: 244,
	terminaDeLeer: 284,
	ensayo: 292,
	llegaCeldas: 365,
	pulsaCeldas: 379,
	celdas: 381,
	llegaIgnorar: 531,
	pulsaIgnorar: 543,
	llegaSiguiente: 567,
	pulsaSiguiente: 577,
	valores: 579,
	llegaSelect1: 715,
	pulsaSelect1: 725,
	llegaOpcion1: 743,
	pulsaOpcion1: 755,
	llegaSelect2: 773,
	pulsaSelect2: 783,
	llegaOpcion2: 801,
	pulsaOpcion2: 813,
	llegaReleer: 847,
	pulsaReleer: 859,
	releido: 895,
	llegaSiguiente2: 925,
	pulsaSiguiente2: 937,
	resumen: 939,
	bajaDesde: 1193,
	bajaHasta: 1223,
	llegaImportarAlumnos: 1283,
	pulsaImportarAlumnos: 1299,
	importando: 1301,
	bajaImportandoHasta: 1331,
	hecho: 1412,
	bajaHechoDesde: 1422,
	bajaHechoHasta: 1462,
	cursorSale: 1373,
};

export const BAJA = { resumen: 75, importando: 200, hecho: 650 };

export const E_INICIO: EstadoImportar = { fase: 'inicio', malaLaHoja: false, paso: 'archivo' };
export const E_ARCHIVO: EstadoImportar = { fase: 'ensayo', malaLaHoja: false, paso: 'archivo' };
export const E_CELDAS: EstadoImportar = { fase: 'ensayo', malaLaHoja: false, paso: 'celdas' };
export const E_VALORES: EstadoImportar = { fase: 'ensayo', malaLaHoja: false, paso: 'valores', vacioConservar: true, planDeAntes: true };
export const E_VALORES_RELEIDO: EstadoImportar = { ...E_VALORES, elegidos: [true, true], planDeAntes: false };
export const E_RESUMEN: EstadoImportar = { fase: 'ensayo', malaLaHoja: false, paso: 'resumen' };
export const E_RESUMEN_ABAJO: EstadoImportar = { ...E_RESUMEN, desplazada: BAJA.resumen };
export const E_HECHO: EstadoImportar = { ...E_RESUMEN, hecho: true, desplazada: BAJA.hecho };

const importar: Rect = enCascara(botonesDeCabecera(BOTONES_DIRECTORIO.slice(0, 4))[2]);
const junta = (a: Rect, b: Rect): Rect => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), ancho: Math.max(a.x + a.ancho, b.x + b.ancho) - Math.min(a.x, b.x), alto: Math.max(a.y + a.alto, b.y + b.alto) - Math.min(a.y, b.y) });

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(MENU, null, false),
	alumnos: puntoDelMenu(MENU, 'Alumnos', true),
	importar: centro(importar),
	elegir: centro(rectElegir(E_INICIO)),
	celdas: centro(rectPildora(E_ARCHIVO, 'celdas')),
	ignorar: centro(rectIgnorar(E_CELDAS, EL_VACIO)),
	siguiente: centro(rectSiguiente(E_CELDAS)),
	select1: centro(rectSelectTruncado(E_VALORES, 0)),
	opcion1: { x: rectOpcionTruncado(E_VALORES, 0, TRUNCADOS[0].elegida).x + 80, y: centro(rectOpcionTruncado(E_VALORES, 0, TRUNCADOS[0].elegida)).y },
	select2: centro(rectSelectTruncado(E_VALORES, 1)),
	opcion2: { x: rectOpcionTruncado(E_VALORES, 1, TRUNCADOS[1].elegida).x + 80, y: centro(rectOpcionTruncado(E_VALORES, 1, TRUNCADOS[1].elegida)).y },
	releer: centro(rectReleer(E_VALORES)),
	siguiente2: centro(rectSiguiente(E_VALORES_RELEIDO)),
	importarAlumnos: centro(rectImportar(E_RESUMEN_ABAJO)),
};

const tablaValores = rectTabla(E_VALORES);
export const FOCOS = {
	personas: foco(rectDelMenu(MENU, null, false), 8),
	importar: foco(crece(importar, 6), 8),
	celdas: foco(crece(rectPildora(E_ARCHIVO, 'celdas'), 4), 18),
	tablaCeldas: foco(crece(rectTabla(E_CELDAS), 4), 10),
	barrio: foco(crece(rectFila(E_CELDAS, EL_VACIO), 3), 8),
	tablaValores: foco(crece(tablaValores, 4), 10),
	queGuardamos: foco(crece({ x: tablaValores.x + tablaValores.ancho - COL_TRUNCADOS[4], y: tablaValores.y, ancho: COL_TRUNCADOS[4], alto: tablaValores.alto }, 4), 10),
	releer: foco(crece(rectPieAcciones(E_VALORES), 4), 10),
	cifras: foco(crece(rectCifras(E_RESUMEN), 4), 10),
	importarAlumnos: foco(crece(rectImportar(E_RESUMEN_ABAJO), 6), 8),
	tablaHecho: foco(crece(junta(rectHecho(E_HECHO, 'alerta'), rectHecho(E_HECHO, 'tabla')), 4), 10),
	cuadra: foco(crece(rectHecho(E_HECHO, 'cuadra'), 4), 8),
	obedecio: foco(crece(junta(rectHecho(E_HECHO, 'correcciones'), rectHecho(E_HECHO, 'obedecio')), 4), 10),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_ALUMNOS = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };
const EN_IMPORTAR = { ubicacion: 'Menú ▸ Personas ▸ Alumnos ▸ Importar alumnos', url: '/alumnos/importar' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Personas, Alumnos.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: T.pulsaPersonas + 16 },
	{ desde: 113, texto: 'Arriba, Importar alumnos.', ...EN_ALUMNOS, foco: FOCOS.importar, focoHasta: T.pulsaImportar - 2 },
	/* Empieza cuando monta la pantalla de importar: antes la miga seguía diciendo «Alumnos» sobre ella. */
	{ desde: T.montaImportar, texto: 'El mismo libro, ya con la pestaña «7A».', voz: 'El mismo libro, ya con la pestaña siete A.', ...EN_IMPORTAR },
	{ desde: 331, texto: 'Ahora, el paso Celdas vacías.', ...EN_IMPORTAR, foco: FOCOS.celdas, focoHasta: T.pulsaCeldas - 2 },
	{ desde: 439, texto: 'Una celda vacía borra el dato: elige Ignorar el Excel.', ...EN_IMPORTAR, foco: FOCOS.tablaCeldas, focoHasta: T.pulsaSiguiente - 8 },
	{ desde: 573, texto: 'Valores: lo que se guardaría mal si no decides.', ...EN_IMPORTAR, foco: FOCOS.tablaValores },
	{ desde: 701, texto: 'Una decisión por valor: se aplica a todas sus filas.', ...EN_IMPORTAR, foco: FOCOS.queGuardamos },
	{ desde: 832, texto: 'Vuelve a leer: el plan se rehace con lo decidido.', ...EN_IMPORTAR, foco: FOCOS.releer, focoHasta: T.releido - 2 },
	{ desde: 953, texto: 'Qué va a pasar, todavía sin escribir.', ...EN_IMPORTAR, foco: FOCOS.cifras },
	{ desde: 1056, texto: 'Si un documento cambió, corrígelo antes: si no, crea otro alumno.', ...EN_IMPORTAR, foco: FOCOS.cifras, focoHasta: T.bajaDesde - 2 },
	{ desde: 1236, texto: `Importar ${A_IMPORTAR} alumnos: ahora sí se escribe.`, ...EN_IMPORTAR, foco: FOCOS.importarAlumnos, focoHasta: T.pulsaImportarAlumnos + 6, rojo: true },
	{ desde: T.hecho, texto: 'Al terminar, cada fila dice si cuadra con lo que se dijo.', ...EN_IMPORTAR, foco: FOCOS.tablaHecho },
];

export const AVISO = { desde: T.hecho, dura: 90, texto: `${HECHOS.creados} creados y ${HECHOS.actualizados} actualizados.` };

export const TARJETA = 1545;
export const DURACION = TARJETA + 120;

export const CLAVE = 'importar-decidir';
export const TITULO = 'Importar de Excel: decidir y comprobar';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está, con el libro leído' },
	{ desde: 439, titulo: 'Celdas vacías' },
	{ desde: 573, titulo: 'Valores que no caben' },
	{ desde: 832, titulo: 'Volver a leer y ver el plan' },
	{ desde: 1236, titulo: 'Importar' },
	{ desde: T.hecho, titulo: 'Lo que pasó: Cuadra o No cuadra' },
];

export const CIERRE: Cierre = {
	hiciste: `Decidiste las celdas vacías y los valores que no caben, e importaste ${A_IMPORTAR} alumnos.`,
	seVe: '«Lo que pasó» con cuatro «Cuadra», y «Se aplicaron las 2 correcciones que aprobaste».',
	despues: 'Siguiente: acudientes.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[11].desde !== T.hecho) {
	throw new Error('Guion: el aviso de la importación no cae donde empieza el paso que lo explica.');
}
