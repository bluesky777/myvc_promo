import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, centro, foco, puntoDe, rectDelMenu } from '../comun-directivo/lugar';
import {
	CIUDADES, EL_DEPARTAMENTO, FICHA_FRASE, FRASES, LAS_FRASES, LA_NUEVA, rectBotonCiudad, rectCeldaFrase, rectCumple, rectOpcionDepartamento,
	rectQuienLaVe, rectQuitar, rejillaFrases, MURO,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «FRASES, CIUDADES, CALENDARIO Y MURO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Son cuatro pantallas pequeñas y cada una está en un sitio.** Frases en Referencias; las
 *     otras tres en Configuración. Y cada una tiene su trampa, que es lo que llega por teléfono:
 *
 *       - Frases: el Tipo no se edita después (`frases.ts`, la columna Tipo es `editable: false`);
 *         el texto sí, en la celda, y se guarda al salir.
 *       - Ciudades: la papelera no pregunta (`ciudades.ts`, `enviarAPapelera` sin confirmación), y
 *         renombrar un departamento lo renombra en todas sus ciudades.
 *       - Calendario: los cumpleaños salen solos de la fecha de nacimiento; aquí no se editan.
 *       - Publicaciones: «Quitar» no borra: vuelve desde «Mis publicaciones».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS, uno por pantalla, y el menú recorrido entre cada uno.
 *
 * 57 s, aun con cuatro llegadas por el menú.
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaRef: 36,
	pulsaRef: 42,
	abreRef: 44,
	llegaFrases: 80,
	pulsaFrases: 92,
	montaFrases: 96,

	llegaCrearNueva: 212,
	pulsaCrearNueva: 222,
	abreFicha: 224,
	llegaFrase: 244,
	pulsaFrase: 254,
	teclea: 264,
	porTecla: 2,
	llegaCrear: 420,
	pulsaCrear: 432,
	/** `postStore` vuelve: «Frase creada con éxito», la fila entra y el campo se vacía. */
	creada: 442,
	llegaCelda: 490,
	pulsaCelda: 500,
	sueltaCelda: 596,

	llegaConfig: 624,
	pulsaConfig: 636,
	cierraRef: 638,
	abreConfig: 654,
	llegaCiudades: 684,
	pulsaCiudades: 696,
	seVaFrases: 696,
	montaCiudades: 714,
	llegaDepto: 740,
	pulsaDepto: 752,
	abreDepto: 754,
	llegaOpcion: 780,
	pulsaOpcion: 790,
	elegido: 792,

	llegaCalendario: 1150,
	pulsaCalendario: 1162,
	seVaCiudades: 1162,
	montaCalendario: 1182,

	llegaMuro: 1370,
	pulsaMuro: 1382,
	seVaCalendario: 1382,
	montaMuro: 1400,
	llegaEscribir: 1444,
	pulsaEscribir: 1456,
	abreEditor: 1458,
	cursorSale: 1690,
};

export const finDelTecleo = T.teclea + LA_NUEVA.frase.length * T.porTecla;

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const EN_FRASES = { ubicacion: 'Menú ▸ Referencias ▸ Frases', url: '/frases' };
const EN_CIUDADES = { ubicacion: 'Menú ▸ Configuración ▸ Ciudades', url: '/ciudades' };
const EN_CALENDARIO = { ubicacion: 'Menú ▸ Configuración ▸ Calendario', url: '/calendario' };
const EN_MURO = { ubicacion: 'Menú ▸ Configuración ▸ Publicaciones', url: '/publicaciones' };

export const MENU_R = {
	referencias: rectDelMenu('Referencias', null, null),
	frases: rectDelMenu('Referencias', 'Frases', 'Referencias'),
	/** Configuración mientras Referencias sigue abierta: ahí la pulsa el puntero. */
	configuracion: rectDelMenu('Configuración', null, 'Referencias'),
	ciudades: rectDelMenu('Configuración', 'Ciudades', 'Configuración'),
	calendario: rectDelMenu('Configuración', 'Calendario', 'Configuración'),
	publicaciones: rectDelMenu('Configuración', 'Publicaciones', 'Configuración'),
};

export const FOCOS = {
	referencias: enElFotograma(MENU_R.referencias),
	rejilla: foco(rejillaFrases(0, 6), 2),
	frase: foco(FICHA_FRASE.frase),
	tipo: foco(FICHA_FRASE.tipoConEtiqueta),
	celda: foco(rectCeldaFrase(1, LAS_FRASES.length, 'frase'), 2),
	configuracion: enElFotograma(MENU_R.configuracion),
	departamento: foco(CIUDADES.departamento),
	papelera: foco(rectBotonCiudad(2, 'papelera'), 8),
	departamentoEditar: foco(rectBotonCiudad(2, 'departamento'), 8),
	calendario: enElFotograma(MENU_R.calendario),
	cumple: foco(rectCumple(9), 4),
	publicaciones: enElFotograma(MENU_R.publicaciones),
	quienLaVe: foco(rectQuienLaVe(), 6),
	quitar: foco(rectQuitar(1, 0), 4),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDe(MENU_R.referencias),
	frases: puntoDe(MENU_R.frases),
	crearNueva: centro(FRASES.crearNueva),
	frase: centro(FICHA_FRASE.frase),
	crear: centro(FICHA_FRASE.crear),
	celda: { x: rectCeldaFrase(1, LAS_FRASES.length, 'frase').x + 200, y: centro(rectCeldaFrase(1, LAS_FRASES.length, 'frase')).y },
	configuracion: puntoDe(MENU_R.configuracion),
	ciudades: puntoDe(MENU_R.ciudades),
	departamento: centro(CIUDADES.departamento),
	opcion: centro(rectOpcionDepartamento(EL_DEPARTAMENTO)),
	calendario: puntoDe(MENU_R.calendario),
	publicaciones: puntoDe(MENU_R.publicaciones),
	escribir: centro(MURO.escribir),
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Frases está en Referencias.', ...EN_EL_MENU, foco: FOCOS.referencias, focoHasta: T.pulsaRef + 10 },
	{ desde: 100, texto: 'Frases del año: las de boletines y observador.', ...EN_FRASES, foco: FOCOS.rejilla, focoHasta: T.llegaCrearNueva - 10 },
	{ desde: 228, texto: 'Crear nueva abre la ficha.', ...EN_FRASES, foco: FOCOS.frase },
	{ desde: 316, texto: 'El Tipo no se cambia después: se borra y se crea otra.', ...EN_FRASES, foco: FOCOS.tipo, focoHasta: T.llegaCrear - 12 },
	{ desde: 466, texto: 'El texto sí: clic en la celda, y se guarda al salir.', ...EN_FRASES, foco: FOCOS.celda, focoHasta: T.sueltaCelda - 10 },
	{ desde: 614, texto: 'Las otras tres están en Configuración.', ...EN_FRASES, foco: FOCOS.configuracion, focoHasta: T.pulsaConfig + 2 },
	{ desde: 722, texto: 'Ciudades: falta elegir el departamento.', ...EN_CIUDADES, foco: FOCOS.departamento, focoHasta: T.pulsaDepto - 2 },
	{ desde: 846, texto: 'La papelera de una ciudad no pregunta: un clic y se va.', ...EN_CIUDADES, foco: FOCOS.papelera },
	{ desde: 986, texto: 'Renombrar un departamento lo cambia en todas sus ciudades.', ...EN_CIUDADES, foco: FOCOS.departamentoEditar, focoHasta: 1106 },
	{ desde: 1114, texto: 'Calendario también está en Configuración.', ...EN_CIUDADES, foco: FOCOS.calendario, focoHasta: T.pulsaCalendario + 6 },
	{ desde: 1220, texto: 'Los cumpleaños salen solos de la fecha de nacimiento.', ...EN_CALENDARIO, foco: FOCOS.cumple },
	{ desde: 1344, texto: 'Publicaciones: el muro que sale en la entrada.', ...EN_CALENDARIO, foco: FOCOS.publicaciones, focoHasta: T.pulsaMuro + 6 },
	{ desde: 1470, texto: 'Al escribir, se elige quién la ve.', ...EN_MURO, foco: FOCOS.quienLaVe },
	{ desde: 1574, texto: 'Quitar una publicación no la borra: vuelve desde Mis publicaciones.', ...EN_MURO, foco: FOCOS.quitar },
];

/** `this.aviso.success('Frase creada con éxito', { nzDuration: 2000 })`. */
export const AVISO = { desde: T.creada, dura: 60, texto: 'Frase creada con éxito' };

export const TARJETA = 1728;
export const DURACION = TARJETA + 120;

export const CLAVE = 'frases-ciudades-calendario-muro';
export const TITULO = 'Frases, ciudades, calendario y muro';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Frases: el texto y su Tipo' },
	{ desde: 614, titulo: 'Ciudades y departamentos' },
	{ desde: 1114, titulo: 'Calendario y cumpleaños' },
	{ desde: 1344, titulo: 'Publicaciones: el muro' },
];

export const CIERRE: Cierre = {
	hiciste: 'Creaste una frase y pasaste por Ciudades, Calendario y el muro.',
	seVe: 'La fila nueva en Frases del año, con su Tipo: Fortaleza.',
	despues: 'Siguiente: las votaciones del colegio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Cada pantalla se monta cuando la anterior ya se fue entera (16 fotogramas de salida). */
for (const [sale, entra] of [[T.seVaFrases, T.montaCiudades], [T.seVaCiudades, T.montaCalendario], [T.seVaCalendario, T.montaMuro]]) {
	if (entra < sale + 17) { throw new Error(`Guion: una pantalla se monta en ${entra} y la anterior no acaba de irse hasta ${sale + 16}.`); }
}
if (finDelTecleo >= T.llegaCrear) { throw new Error('Guion: se pulsa Crear antes de acabar de escribir la frase.'); }
/* El foco de la celda nueva no puede salir antes de que la fila exista. */
if (PASOS[4].desde < T.creada + 14) { throw new Error('Guion: el paso 5 señala la fila nueva antes de que entre.'); }
