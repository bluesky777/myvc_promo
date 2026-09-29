import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { acercamientoAUnaHoja, enElFotograma, encuadreDeUnaHoja } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ACERCAMIENTO_CERT, BUSCADOR, BUSQUEDAS, EL_GRUPO, FICHAS, HOJA, NUMERO_TRAS_CARGAR, camposDe, enLaCascara, rectFicha, rectOpcion } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS, 3: «SACAR CERTIFICADOS DE ESTUDIO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     El de «hasta un periodo» ESCRIBE: abrirlo pide `aumentar_contador: true` y el backend sube
 *     `years.contador_certificados` dentro de una transacción (`certificados-estudio.ts:33`,
 *     `BolfinalesController.php:272-425`). **Una vez por carga, no por hoja**: todo el grupo sale
 *     con el mismo número. El certificado del año lee el mismo contador y no lo toca.
 *
 * Es lo único irreversible del vídeo y por eso su paso lleva el cartel rojo: el número gastado no
 * vuelve (el contador se puede teclear a mano en la hoja, pero eso es otro vídeo y no se afirma).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA    menú -> Informes -> se busca «certificado»: tres fichas
 *     2. EL DE PERIODO se elige, se pide el grupo --el periodo viene puesto: el abierto-- y se carga
 *     3. LA HOJA       plano entero y plano corto de la cabecera, con su N.º
 *
 * SE ENSEÑA EL DE PERIODO Y NO EL DEL AÑO, a propósito: en septiembre el del año sale con los
 * periodos 3 y 4 vacíos y sin la frase de promoción (el alumno aún no está promovido), y quien lo
 * pide a mitad de año --un traslado-- es el de periodo el que necesita. El del año se nombra.
 */

export const FPS = 30;

export const T = {
	cursorEntra: 16,
	llegaInformes: 44,
	pulsaInformes: 50,
	montaCatalogo: 56,
	llegaBuscador: 84,
	pulsaBuscador: 94,
	teclea: 104,
	porTecla: 3,
	resultados: 144,
	llegaFicha: 236,
	pulsaFicha: 252,
	eligeFicha: 256,
	llegaGrupo: 316,
	pulsaGrupo: 328,
	abreGrupo: 330,
	llegaOpcion: 356,
	pulsaOpcion: 368,
	cierraGrupo: 370,
	llegaCargar: 426,
	pulsaCargar: 536,
	cursorSale: 542,
	seVaLaCascara: 542,
	entraLaHoja: 587,
	cercaDesde: 706,
	cercaHasta: 718,
};

export const BUSCA = 'certificado';
export const RESULTADOS = BUSQUEDAS.certificado;
export const LA_FICHA = RESULTADOS.indexOf(FICHAS.periodos);
export const CONF = camposDe(FICHAS.periodos);

/* ── El encuadre del papel: dos planos quietos ─────────────────────────────────────────────── */

export const HOJA_ENTERA = encuadreDeUnaHoja(HOJA);
export const HOJA_CERCA = acercamientoAUnaHoja(HOJA, ACERCAMIENTO_CERT, 0.8);

/* ── Dónde se pulsa y qué se señala ───────────────────────────────────────────────────────── */

const MENU = MENU_DIRECTIVO;
export const INFORMES = entradaDe(MENU, 'Informes');

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const foco = (r: { x: number; y: number; ancho: number; alto: number }, radio = 10) => ({ ...enElFotograma(enLaCascara(r)), radio });
const une = (a: { x: number; y: number; ancho: number; alto: number }, b: { x: number; y: number; ancho: number; alto: number }, m = 8) => ({
	x: Math.min(a.x, b.x) - m,
	y: Math.min(a.y, b.y) - m,
	ancho: Math.max(a.x + a.ancho, b.x + b.ancho) - Math.min(a.x, b.x) + m * 2,
	alto: Math.max(a.y + a.alto, b.y + b.alto) - Math.min(a.y, b.y) + m * 2,
});

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	informes: { x: 150, y: alturaEnMenu(MENU, INFORMES.seccion, null, null) + MEDIDAS.seccion / 2 },
	buscador: centro(enLaCascara(BUSCADOR)),
	ficha: centro(enLaCascara(rectFicha(LA_FICHA))),
	grupo: centro(enLaCascara(CONF.campos.grupo)),
	opcion: centro(enLaCascara(rectOpcion(CONF.campos.grupo, EL_GRUPO))),
	cargar: centro(enLaCascara(CONF.cargar)),
};

/** Un trozo de la hoja, en el plano corto. */
const enLaHojaDeCerca = (r: { x: number; y: number; ancho: number; alto: number }) => ({
	x: HOJA_CERCA.x + r.x * HOJA_CERCA.escala,
	y: HOJA_CERCA.y + r.y * HOJA_CERCA.escala,
	ancho: r.ancho * HOJA_CERCA.escala,
	alto: r.alto * HOJA_CERCA.escala,
	radio: 8,
});

export const FOCOS = {
	informes: enElFotograma({ x: 0, y: alturaEnMenu(MENU, INFORMES.seccion, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	dosFichas: foco(une(rectFicha(0), rectFicha(1), 8), 12),
	ficha: foco(une(rectFicha(LA_FICHA), rectFicha(LA_FICHA), 8), 12),
	campos: foco(une(CONF.campos.grupo, CONF.campos.hasta, 10), 10),
	cargar: foco(une(CONF.cargar, CONF.cargar, 8), 10),
	/** La línea del título y su número, arriba de la hoja. */
	numero: enLaHojaDeCerca({ x: 40, y: 162, ancho: HOJA.ancho - 80, alto: 50 }),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Informes', url: 'micolegio.micolevirtual.com/up2/' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes', url: '/informes' };
const EN_EL_PAPEL = {
	ubicacion: 'Menú ▸ Informes ▸ Certificado hasta un periodo',
	url: `/informes/certificados-estudio-periodo/58/2`,
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'En Informes, busca «certificado»: salen tres papeles.', ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: T.pulsaInformes + 16 },
	{ desde: 176, texto: 'Éste llega hasta el periodo que elijas.', ...EN_INFORMES, foco: FOCOS.ficha, focoHasta: T.pulsaFicha - 4 },
	{ desde: 272, texto: 'Se elige el grupo; el periodo viene puesto.', ...EN_INFORMES, foco: FOCOS.campos, focoHasta: T.llegaGrupo - 4 },
	{
		desde: 383,
		texto: 'Cargarlo gasta un número del consecutivo, aunque no lo imprimas.',
		...EN_INFORMES,
		foco: FOCOS.cargar,
		focoHasta: T.pulsaCargar - 4,
		rojo: true,
	},
	{ desde: 554, texto: 'Una hoja por alumno, con su número junto al título.', ...EN_EL_PAPEL },
	{ desde: 704, texto: 'Todo el grupo lleva el mismo número: uno por carga.', ...EN_EL_PAPEL, foco: FOCOS.numero },
];

export const TARJETA = 828;
export const DURACION = TARJETA + 120;

export const CLAVE = 'certificado-imprimir';
export const TITULO = 'Sacar certificados de estudio';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Informes' },
	{ desde: T.pulsaBuscador, titulo: 'Tres papeles: buscar «certificado»' },
	{ desde: T.eligeFicha, titulo: 'Hasta un periodo: gasta un número' },
	{ desde: T.entraLaHoja, titulo: 'La hoja y su N.º' },
];

export const CIERRE: Cierre = {
	hiciste: 'Sacaste los certificados de 8°B hasta el periodo 2.',
	seVe: `Cada hoja lleva arriba el N.º que gastó esa carga: aquí, el ${NUMERO_TRAS_CARGAR}.`,
	despues: 'Siguiente: la constancia de estudio, que no lleva notas.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El paso rojo tiene que acabar después del clic de «Cargar el informe»: es lo que cuenta. */
if (PASOS[3].desde > T.pulsaCargar || PASOS[4].desde < T.pulsaCargar) {
	throw new Error('Guion: el clic de «Cargar el informe» no cae dentro del paso rojo.');
}
/* Y la hoja no se acerca hasta que el paso del número ha empezado. */
if (T.cercaDesde < PASOS[4].desde + 150) {
	throw new Error('Guion: la hoja se acerca antes de dejar ver el plano entero.');
}
