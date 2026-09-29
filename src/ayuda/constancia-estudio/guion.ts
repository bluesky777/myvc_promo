import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { acercamientoAUnaHoja, enElFotograma, encuadreDeUnaHoja } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { BUSCADOR, BUSQUEDAS, EL_ALUMNO, EL_GRUPO, FICHAS, camposDe, enLaCascara, rectFicha, rectOpcion } from '../certificado-imprimir/datos';
import { ACERCAMIENTO_CONSTANCIA, ALUMNO_ID, COMPUESTO, IMPRIMIR, VIGENCIA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS, 4: «LA CONSTANCIA DE ESTUDIO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     No lleva ni una nota: dice que está matriculado. Es otro papel que el certificado
 *     (`app.routes.ts`: «no es el certificado de estudio: ese lleva la tabla de notas de los
 *     cuatro periodos y este no lleva ni una»). Al buscar «constancia» salen LOS DOS --el
 *     certificado lleva «constancia con notas» en sus sinónimos--, y esa es la confusión.
 *
 * Y lo que la separa del vídeo anterior: **no gasta número**. La constancia no imprime consecutivo
 * (cabecera de `constancia-estudio.ts`: «sale sin número antes que con uno repetido»).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA    menú -> Informes -> «constancia»: dos fichas
 *     2. UN ALUMNO     la constancia pide grupo y estudiante, y se carga
 *     3. LA HOJA       entera; de cerca el párrafo y los cinco datos; otra vez entera, los mandos
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
	resultados: 140,
	llegaFicha: 262,
	pulsaFicha: 278,
	eligeFicha: 282,
	llegaGrupo: 312,
	pulsaGrupo: 322,
	abreGrupo: 324,
	llegaOpcion: 342,
	pulsaOpcion: 352,
	cierraGrupo: 354,
	llegaAlumno: 370,
	pulsaAlumno: 380,
	abreAlumno: 382,
	llegaOpcion2: 398,
	pulsaOpcion2: 408,
	cierraAlumno: 410,
	llegaCargar: 426,
	pulsaCargar: 438,
	cursorSale: 444,
	seVaLaCascara: 444,
	entraLaHoja: 489,
	cercaDesde: 530,
	cercaHasta: 542,
	lejosDesde: 606,
	lejosHasta: 618,
};

export const BUSCA = 'constancia';
export const RESULTADOS = BUSQUEDAS.constancia;
export const LA_FICHA = RESULTADOS.indexOf(FICHAS.constancia);
export const CONF = camposDe(FICHAS.constancia);

export const ENTERA = encuadreDeUnaHoja(COMPUESTO);
export const CERCA = acercamientoAUnaHoja(COMPUESTO, ACERCAMIENTO_CONSTANCIA, 0.8);
/** El tercer plano: la barra de mandos y la cabecera de la hoja, para que se lean los mandos. */
export const BARRA_CERCA = acercamientoAUnaHoja(COMPUESTO, { y: 40, alto: 260 }, 0.8);

const MENU = MENU_DIRECTIVO;
export const INFORMES = entradaDe(MENU, 'Informes');

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const foco = (r: { x: number; y: number; ancho: number; alto: number }, radio = 10) => ({ ...enElFotograma(enLaCascara(r)), radio });
const enLaBarra = (r: { x: number; y: number; ancho: number; alto: number }, m = 6) => ({
	x: BARRA_CERCA.x + (r.x - m) * BARRA_CERCA.escala,
	y: BARRA_CERCA.y + (r.y - m) * BARRA_CERCA.escala,
	ancho: (r.ancho + m * 2) * BARRA_CERCA.escala,
	alto: (r.alto + m * 2) * BARRA_CERCA.escala,
	radio: 10,
});

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	informes: { x: 150, y: alturaEnMenu(MENU, INFORMES.seccion, null, null) + MEDIDAS.seccion / 2 },
	buscador: centro(enLaCascara(BUSCADOR)),
	ficha: centro(enLaCascara(rectFicha(LA_FICHA))),
	grupo: centro(enLaCascara(CONF.campos.grupo)),
	opcion: centro(enLaCascara(rectOpcion(CONF.campos.grupo, EL_GRUPO))),
	alumno: centro(enLaCascara(CONF.campos.alumno)),
	opcion2: centro(enLaCascara(rectOpcion(CONF.campos.alumno, EL_ALUMNO))),
	cargar: centro(enLaCascara(CONF.cargar)),
};

export const FOCOS = {
	informes: enElFotograma({ x: 0, y: alturaEnMenu(MENU, INFORMES.seccion, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	dosFichas: foco(
		(() => {
			const a = rectFicha(0);
			const b = rectFicha(1);
			return { x: a.x - 8, y: a.y - 8, ancho: b.x + b.ancho - a.x + 16, alto: a.alto + 16 };
		})(),
		12,
	),
	constancia: foco(
		(() => {
			const r = rectFicha(LA_FICHA);
			return { x: r.x - 8, y: r.y - 8, ancho: r.ancho + 16, alto: r.alto + 16 };
		})(),
		12,
	),
	vigencia: enLaBarra(VIGENCIA),
	imprimir: enLaBarra(IMPRIMIR),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Informes', url: 'micolegio.micolevirtual.com/up2/' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes', url: '/informes' };
const EN_EL_PAPEL = { ubicacion: 'Menú ▸ Informes ▸ Constancia de estudio', url: `/informes/constancia-estudio/${ALUMNO_ID}` };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'En Informes, busca «constancia»: salen dos papeles.', ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: T.pulsaInformes + 16 },
	{ desde: 172, texto: 'La constancia no lleva notas: dice que está matriculado.', ...EN_INFORMES, foco: FOCOS.constancia, focoHasta: T.pulsaFicha - 4 },
	{ desde: 310, texto: 'Grupo, estudiante y Cargar el informe.', ...EN_INFORMES },
	{ desde: 446, texto: 'Una hoja: grado, jornada y matrícula. Ni una nota.', ...EN_EL_PAPEL },
	{ desde: 620, texto: 'La vigencia de 30 días se quita aquí.', ...EN_EL_PAPEL, foco: FOCOS.vigencia },
	{ desde: 722, texto: 'Se imprime aquí, y no gasta número.', ...EN_EL_PAPEL, foco: FOCOS.imprimir },
];

export const TARJETA = 824;
export const DURACION = TARJETA + 120;

export const CLAVE = 'constancia-estudio';
export const TITULO = 'La constancia de estudio';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Informes' },
	{ desde: 172, titulo: 'No es el certificado: no lleva notas' },
	{ desde: T.eligeFicha, titulo: 'Grupo, estudiante y cargar' },
	{ desde: T.entraLaHoja, titulo: 'La hoja: lo que dice y lo que no' },
];

export const CIERRE: Cierre = {
	hiciste: 'Sacaste la constancia de estudio de un alumno.',
	seVe: 'La hoja dice «se encuentra matriculado y cursando actualmente», y no trae ni una nota.',
	despues: 'Si piden notas: «Sacar certificados de estudio».',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El plano corto dura el paso que lo explica, y se pasa al de la barra antes de señalarla. */
if (T.cercaDesde < PASOS[3].desde || T.lejosHasta > PASOS[4].desde + 12) {
	throw new Error('Guion: los planos de la hoja no casan con los pasos que los explican.');
}
