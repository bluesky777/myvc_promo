import { MANDOS, MEDIDAS_HOY, rectanguloDeMando } from '../BarraDeHoy';
import { MEDIDAS, MENU_DOCENTE_HOY, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { Rect, alFotograma, centro, holgura, rectDeEntrada, union } from '../moverse/comun';
import { ASPECTO } from '../moverse/Aspecto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «DÓNDE ESTÁ CADA COSA: EL MENÚ» (Moverse por MyVC, ola 2).
 *
 * LA DUDA QUE MATA: las secciones, plegar a iconos con el botón de la barra, y lateral o superior.
 *
 * LO QUE CAMBIA RESPECTO AL PLAN, Y SE DICE: el plan hablaba de «nueve secciones». En `menu.ts` hoy
 * son doce, y cada cargo ve las suyas: `menuPara` quita la sección que se queda sin hijas visibles
 * (`cascara/menu/visibilidad.ts:203`). Al docente de este vídeo le salen diez (`MENU_DOCENTE_HOY`).
 * Por eso el rótulo no da un número.
 *
 * Y DOS COSAS QUE EL VÍDEO AFIRMA PORQUE ESTÁN EN EL CÓDIGO:
 *   - plegar NO se guarda: `plegado = linkedSignal(() => this.casa(ANGOSTO))`, «es un gesto del
 *     momento y no una preferencia que se guarda» (`cascara/menu/estado-menu.ts:106-114`);
 *   - «Dónde va el menú» (Lateral / Superior) SÍ, en este navegador (`myvc_tema_disposicion`).
 *
 * CUATRO ACTOS: las secciones; abrir una (y lo que no está: la planilla cuelga de Mis asignaturas);
 * plegar a iconos y la lista al pasar; lateral o superior, en el engranaje.
 */

export const FPS = 30;
export const MENU = MENU_DOCENTE_HOY;
export const ACADEMICO = entradaDe(MENU, 'Académico').seccion;

export const T = {
	cursorEntra: 20,
	llegaAcademico: 244,
	pulsaAcademico: 256,
	abreAcademico: 258,
	llegaPlegar: 458,
	pulsaPlegar: 470,
	pliega: 472,
	llegaIcono: 549,
	flyout: 557,
	dejaIcono: 672,
	llegaDesplegar: 690,
	pulsaDesplegar: 702,
	despliega: 704,
	llegaAspecto: 830,
	pulsaAspecto: 842,
	abreAspecto: 844,
	cursorSale: 900,
};

/* ── Dónde cae cada cosa ──────────────────────────────────────────────────────────────────── */

const ALTO_MENU = alturaEnMenu(MENU, MENU.length - 1, null, null) + MEDIDAS.seccion - MEDIDAS.barra + 8;
const academicoAbierto: Rect = (() => {
	const a = rectDeEntrada(MENU, 'Académico');
	const h = MENU[ACADEMICO].hijas!.length * MEDIDAS.hija;
	return { x: 0, y: a.y, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion + h, radio: 6 };
})();

/** La lista que sale al pasar por un icono con el menú plegado: la cabecera y las hijas. */
export const FLYOUT = {
	x: MEDIDAS_HOY.menuPlegado + 6,
	y: alturaEnMenu(MENU, ACADEMICO, null, null) - 4,
	ancho: 260,
	cabecera: 40,
	hija: 40,
};
export const RECT_FLYOUT: Rect = {
	x: FLYOUT.x,
	y: FLYOUT.y,
	ancho: FLYOUT.ancho,
	alto: FLYOUT.cabecera + MENU[ACADEMICO].hijas!.length * FLYOUT.hija + 12,
	radio: 8,
};

export const FOCOS = {
	menu: alFotograma({ x: 0, y: MEDIDAS.barra, ancho: MEDIDAS.menu, alto: ALTO_MENU, radio: 0 }, 6),
	academico: alFotograma(holgura(academicoAbierto, 2), 8),
	misAsignaturas: alFotograma(rectDeEntrada(MENU, 'Académico', 'Mis asignaturas'), 6),
	plegar: alFotograma(holgura(rectanguloDeMando('plegar'), 4), 10),
	flyout: alFotograma(union(holgura(RECT_FLYOUT, 4), { ...rectDeEntrada(MENU, 'Académico', undefined, MEDIDAS_HOY.menuPlegado) }), 10),
	disposicion: alFotograma(ASPECTO.disposicion(), 10),
};

export const PUNTOS = {
	entrada: { x: 760, y: 640 },
	reposo: { x: 520, y: 700 },
	academico: { x: 130, y: centro(rectDeEntrada(MENU, 'Académico')).y },
	plegar: centro(rectanguloDeMando('plegar')),
	icono: { x: MEDIDAS_HOY.menuPlegado / 2 + 2, y: centro(rectDeEntrada(MENU, 'Académico')).y },
	aspecto: centro(MANDOS.aspecto),
};

const AQUI = { ubicacion: 'Menú (a la izquierda)', url: 'En todas las pantallas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'El menú de la izquierda reúne todas las pantallas.', ...AQUI, foco: FOCOS.menu },
	{ desde: 127, texto: 'Cada cargo ve sólo lo que puede usar.', ...AQUI, foco: FOCOS.menu },
	{ desde: 224, texto: 'Un clic abre la sección y sus pantallas.', ...AQUI, foco: FOCOS.academico },
	{ desde: 334, texto: 'La planilla se abre desde Mis asignaturas.', ...AQUI, foco: FOCOS.misAsignaturas },
	{ desde: 444, texto: 'Este botón pliega el menú a iconos.', ...AQUI, foco: FOCOS.plegar, focoHasta: T.pulsaPlegar + 10 },
	{ desde: 541, texto: 'Plegado, al pasar por un icono sale su lista.', ...AQUI, foco: FOCOS.flyout, focoHasta: 651 },
	{ desde: 665, texto: 'El mismo botón lo despliega; plegado no se guarda.', ...AQUI },
	{ desde: 788, texto: '¿Arriba? En el engranaje: «Dónde va el menú».', ...AQUI },
	{ desde: 929, texto: 'Lateral o Superior: eso se guarda en este navegador.', ...AQUI, foco: FOCOS.disposicion },
];

export const TARJETA = 1062;
export const DURACION = 1182;

export const CLAVE = 'menu-secciones';
export const TITULO = 'Dónde está cada cosa: el menú';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Las secciones' },
	{ desde: PASOS[2].desde, titulo: 'Abrir una sección' },
	{ desde: PASOS[4].desde, titulo: 'Plegar a iconos' },
	{ desde: PASOS[7].desde, titulo: 'Lateral o superior' },
];

export const CIERRE: Cierre = {
	hiciste: 'Abriste una sección, plegaste el menú a iconos y lo volviste a desplegar.',
	seVe: 'Plegado queda la columna de iconos; al pasar por uno, sale su lista.',
	despues: 'Volver sobre tus pasos: el rastro de arriba.',
	voz: 'Siguiente: el rastro de arriba.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.pulsaPlegar < PASOS[4].desde || T.flyout < PASOS[5].desde || T.pulsaDesplegar < PASOS[6].desde || T.pulsaAspecto < PASOS[7].desde) {
	throw new Error('Guion: un clic cae antes del paso que lo explica.');
}
