import { Punto } from '../../comunes/Cursor';
import { impresoDe } from '../cierre-6/datos-catalogo';
import { acercamientoAUnaHoja } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, enElPlano, foco, holgura, punto, union } from '../informes/Comun';
import { Ajustes, CABEZA, RECARGAR, TIRA, VIS, X_PANEL, Y_PANEL, disponer, disponerAjustes, rectDeFicha, rectDePastilla } from '../informes/datos';
import { rectDeOpcion } from '../informes/Piezas';
import { rectDelPanel } from '../informes/Visor';
import { ANCHO_BLOQUES, OFICIO, P, X_CASILLAS, Y_TABLA } from './Papeles';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «PLANILLAS Y CONTROLES DEL AULA». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): «mes y columnas se eligen dentro del papel; la orientación, antes de
 * imprimir». Lo que dice app2, que la matiza:
 *   · LAS COLUMNAS DE LA PLANILLA no se eligen si la asignatura tiene plan de evaluación: salen de
 *     él, cada bloque con su porcentaje, y la cabecera lo dice --«Las columnas salen del plan de
 *     evaluación, con su porcentaje.»--. Sólo si una asignatura no lo tiene aparece arriba el cajón
 *     «Los títulos», para escribirlos separados por «;» (`planillas.html`, `usaTitulos`). El vídeo
 *     enseña el caso con plan y dice el otro, sin enseñarlo.
 *   · EL MES de los controles se elige en la cabecera del papel, no en el configurador: «Mes», que
 *     arranca en el actual en el de clase, y «Sin días» deja 21 columnas en blanco
 *     (`control-planilla.ts`). Los dos controles no piden nada antes de cargar.
 *   · LA ORIENTACIÓN es «La hoja» de los ajustes: viene puesta --las planillas y los controles, en
 *     oficio apaisado (`catalogo.ts`)-- y se cambia ahí antes de imprimir.
 *
 * 47 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaPastilla: 150,
	pulsaPastilla: 162,
	llegaFicha: 294,
	pulsaFicha: 306,
	llegaGrupo: 322,
	abreGrupo: 332,
	llegaOpcion: 348,
	eligeGrupo: 360,
	llegaCargar: 376,
	pulsaCargar: 388,
	monta: 394,
	trae: 420,
	llegaHoja: 440,
	pulsaHoja: 452,
	seVa: 640,
	plano: 646,
	vuelve: 782,
	llegaBuscarOtro: 950,
	pulsaBuscarOtro: 962,
	vuelveCatalogo: 968,
	llegaControl: 990,
	pulsaControl: 1002,
	llegaCargar2: 1018,
	pulsaCargar2: 1030,
	monta2: 1036,
	trae2: 1060,
	llegaMes: 1100,
	abreMes: 1192,
	llegaSinDias: 1206,
	eligeMes: 1222,
	cursorSale: 1280,
};

export const PLANILLAS = impresoDe('planillas-grupo');
export const CONTROL = impresoDe('control-clase');
export const OPCIONES_GRUPO = ['5°A', '6°A', '6°B', '7°A', '7°B', '8°A'];
export const MESES = ['Sin días', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const elegida = (f: number) => (f >= T.pulsaControl ? CONTROL.clave : f >= T.pulsaFicha ? PLANILLAS.clave : null);
export const ajustesPlanillas = (f: number): Ajustes => ({
	interruptores: [{ etiqueta: 'Mostrar foto', encendido: true }, { etiqueta: 'Sólo números en logros e indicadores', encendido: false }],
	hoja: 2,
	abiertos: f >= T.pulsaHoja ? { hoja: true } : undefined,
});
export const ajustesCatalogo = (f: number): Ajustes => (elegida(f) === CONTROL.clave ? { hoja: 2 } : { ...ajustesPlanillas(0), abiertos: undefined });
export const estadoEn = (f: number) => ({
	consulta: '',
	familia: (f >= T.pulsaPastilla ? 'aula' : 'todo') as 'aula' | 'todo',
	elegida: elegida(f),
	valores: { grupo: f >= T.eligeGrupo ? '7°A' : null },
	ajustes: ajustesCatalogo(f),
});

export const enLaPlanilla = (f: number) => f >= T.monta && f < T.pulsaBuscarOtro;
export const enElControl = (f: number) => f >= T.monta2;
export const enElCatalogo = (f: number) => (f >= LLEGADA.monta && f < T.pulsaCargar + 10) || (f >= T.pulsaBuscarOtro && f < T.pulsaCargar2 + 10);

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const D0 = disponer(estadoEn(0));
const D_AULA = disponer(estadoEn(T.pulsaPastilla));
const D_PLAN = disponer(estadoEn(T.eligeGrupo));
const D_CONTROL = disponer(estadoEn(T.pulsaControl));

const panelConHoja = disponerAjustes(ajustesPlanillas(T.pulsaHoja), X_PANEL, Y_PANEL + 8, VIS.panel, true);
const cabezaHoja = disponerAjustes(ajustesPlanillas(0), X_PANEL, Y_PANEL + 8, VIS.panel, true).plegables.find((p) => p.que === 'hoja')!.cabeza;
const hojaAbierta = panelConHoja.plegables.find((p) => p.que === 'hoja')!;

/** La pista de la cabecera: «Las columnas salen del plan…», pegada a «Fondo». */
export const ANCHO_PISTA = 470;
export const PISTA = { x: RECARGAR.x - 10 - 96 - 12 - ANCHO_PISTA, y: CABEZA.y + 10, ancho: ANCHO_PISTA, alto: CABEZA.alto - 20 };
/** El mando «Mes» del control: el desplegable, pegado a «Recargar». */
export const SELECT_MES = { x: RECARGAR.x - 14 - 150, y: CABEZA.y + (CABEZA.alto - 32) / 2, ancho: 150, alto: 32 };

/** De cerca: la cabecera de la planilla, con los bloques y sus porcentajes. */
export const CERCA = acercamientoAUnaHoja(OFICIO, { y: 20, alto: 540 });

export const FOCOS = {
	informes: FOCO_INFORMES,
	aula: foco(holgura(union(...D_AULA.secciones[0].fichas.slice(0, 4).map((f) => f.rect)), 6)),
	configurador: foco(holgura(union(rectDeFicha(D_AULA, PLANILLAS.clave), D_PLAN.conf!.cargar), 6)),
	hoja: foco(holgura(union(hojaAbierta.cabeza, hojaAbierta.cuerpo!), 3)),
	pista: foco(holgura(PISTA, 4)),
	bloques: enElPlano(CERCA, { x: X_CASILLAS - 3, y: Y_TABLA - 3, ancho: ANCHO_BLOQUES + 6, alto: P.cab1 + P.cab2 + 6 }),
	buscarOtro: foco(holgura({ x: TIRA.x, y: TIRA.y + 4, ancho: 206, alto: 36 }, 5)),
	mes: foco(holgura({ x: SELECT_MES.x - 44, y: SELECT_MES.y, ancho: SELECT_MES.ancho + 44, alto: SELECT_MES.alto }, 6)),
};

const Pt = {
	pastilla: punto(rectDePastilla(D0, 'aula')),
	ficha: punto(rectDeFicha(D_AULA, PLANILLAS.clave), 30),
	grupo: punto(D_PLAN.conf!.campos.grupo!, 60),
	opcion: punto(rectDeOpcion(D_PLAN.conf!.campos.grupo!, 3), -40),
	cargar: punto(D_PLAN.conf!.cargar, 40),
	hoja: punto(cabezaHoja, -60),
	buscarOtro: punto({ x: TIRA.x, y: TIRA.y + 4, ancho: 206, alto: 36 }),
	control: punto(rectDeFicha(D_CONTROL, CONTROL.clave), 30),
	cargar2: punto(D_CONTROL.conf!.cargar, 40),
	mes: punto(SELECT_MES),
	sinDias: punto(rectDeOpcion(SELECT_MES, 0), -20),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaPastilla, ...Pt.pastilla },
	{ frame: T.pulsaPastilla + 30, ...Pt.pastilla },
	{ frame: T.llegaFicha, ...Pt.ficha },
	{ frame: T.pulsaFicha + 4, ...Pt.ficha },
	{ frame: T.llegaGrupo, ...Pt.grupo },
	{ frame: T.abreGrupo + 4, ...Pt.grupo },
	{ frame: T.llegaOpcion, ...Pt.opcion },
	{ frame: T.eligeGrupo + 4, ...Pt.opcion },
	{ frame: T.llegaCargar, ...Pt.cargar },
	{ frame: T.pulsaCargar + 10, ...Pt.cargar },
	{ frame: T.llegaHoja, ...Pt.hoja },
	{ frame: T.pulsaHoja + 30, ...Pt.hoja },
	{ frame: T.seVa - 10, x: Pt.hoja.x - 200, y: Pt.hoja.y + 260 },
	{ frame: T.vuelve + 10, x: Pt.buscarOtro.x + 200, y: Pt.buscarOtro.y + 200 },
	{ frame: T.llegaBuscarOtro, ...Pt.buscarOtro },
	{ frame: T.pulsaBuscarOtro + 10, ...Pt.buscarOtro },
	{ frame: T.llegaControl, ...Pt.control },
	{ frame: T.pulsaControl + 6, ...Pt.control },
	{ frame: T.llegaCargar2, ...Pt.cargar2 },
	{ frame: T.pulsaCargar2 + 30, ...Pt.cargar2 },
	{ frame: T.llegaMes - 20, x: Pt.mes.x - 160, y: Pt.mes.y + 220 },
	{ frame: T.llegaMes, ...Pt.mes },
	{ frame: T.abreMes + 6, ...Pt.mes },
	{ frame: T.llegaSinDias, ...Pt.sinDias },
	{ frame: T.eligeMes + 30, ...Pt.sinDias },
	{ frame: T.cursorSale - 20, x: Pt.sinDias.x - 160, y: Pt.sinDias.y + 300 },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaPastilla, T.pulsaFicha, T.abreGrupo, T.eligeGrupo, T.pulsaCargar, T.pulsaHoja, T.pulsaBuscarOtro, T.pulsaControl, T.pulsaCargar2, T.abreMes, T.eligeMes];

export function senal(f: number): string | null {
	const entre = (a: number, b: number) => f >= a && f < b;
	if (entre(T.llegaPastilla, T.pulsaPastilla + 8)) { return 'pastilla-aula'; }
	if (entre(T.llegaFicha, T.pulsaFicha + 8)) { return `ficha-${PLANILLAS.clave}`; }
	if (entre(T.llegaGrupo, T.abreGrupo)) { return 'campo-grupo'; }
	if (entre(T.llegaCargar, T.pulsaCargar + 4) || entre(T.llegaCargar2, T.pulsaCargar2 + 4)) { return 'cargar'; }
	if (entre(T.llegaHoja, T.pulsaHoja + 8)) { return 'plegable-hoja'; }
	if (entre(T.llegaBuscarOtro, T.pulsaBuscarOtro + 4)) { return 'buscar-otro'; }
	if (entre(T.llegaControl, T.pulsaControl + 8)) { return `ficha-${CONTROL.clave}`; }
	return null;
}

export const fuera = (f: number) => {
	const r = (a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
	return f < T.vuelve ? r(T.seVa, T.seVa + 16) : 1 - r(T.vuelve, T.vuelve + 16);
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_PLANILLA = { ubicacion: 'Menú ▸ Informes ▸ Planillas del grupo', url: '/informes/planillas/grupo/48' };
const EN_EL_CONTROL = { ubicacion: 'Menú ▸ Informes ▸ Planilla de asistencia a clase', url: '/informes/control-asistencia-clase' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Las planillas y los controles del aula están en Informes.', ...EN_EL_MENU, foco: FOCO_INFORMES, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 143, texto: 'En «Para el aula»: planillas y controles de asistencia.', ...EN_INFORMES, foco: FOCOS.aula },
	{ desde: 286, texto: 'Planillas del grupo: elige el grupo y carga.', ...EN_INFORMES, foco: FOCOS.configurador, focoHasta: T.pulsaCargar + 4 },
	{ desde: 410, texto: '«La hoja» viene en oficio apaisado: cámbiala aquí.', ...EN_LA_PLANILLA, foco: FOCOS.hoja },
	{ desde: 542, texto: 'Las columnas salen del plan de evaluación.', ...EN_LA_PLANILLA, foco: FOCOS.pista, focoHasta: T.seVa - 10 },
	{ desde: 647, texto: 'Cada bloque con su porcentaje, y dos casillas libres.', ...EN_LA_PLANILLA, foco: FOCOS.bloques, focoHasta: T.vuelve - 16 },
	{ desde: 785, texto: 'Sin plan, arriba sale «Los títulos» para escribirlos.', ...EN_LA_PLANILLA, foco: FOCOS.pista },
	{ desde: 944, texto: '«Buscar otro informe» y elige asistencia a clase.', ...EN_INFORMES, foco: FOCOS.buscarOtro, focoHasta: T.pulsaBuscarOtro + 6 },
	{ desde: 1073, texto: 'No piden nada: el mes se elige en el papel.', ...EN_EL_CONTROL, foco: FOCOS.mes },
	{ desde: 1188, texto: '«Sin días» deja 21 columnas en blanco.', voz: 'Sin días deja veintiuna columnas en blanco.', ...EN_EL_CONTROL },
];

/* Cuándo se enciende el foco, si lo que señala aún no está al empezar el rótulo: antes del clic, el
 * recuadro alumbraría las fichas de otra familia, el hueco del configurador o el «Cargando…» del papel. */
export const FOCO_DESDE: Record<number, number> = { 1: T.pulsaPastilla, 3: T.trae };

export const TARJETA = 1300;
export const DURACION = 1420;

export const CLAVE = 'planillas-aula';
export const TITULO = 'Planillas y controles del aula';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde: «Para el aula»' },
	{ desde: PASOS[3].desde, titulo: '«La hoja», antes de imprimir' },
	{ desde: PASOS[4].desde, titulo: 'Las columnas de la planilla' },
	{ desde: PASOS[7].desde, titulo: 'Los controles y su mes' },
];

export const CIERRE: Cierre = {
	hiciste: 'Sacaste las planillas de 7°A y el control de asistencia a clase.',
	seVe: 'Las columnas salen del plan; el mes y «Sin días», en la cabecera del papel.',
	despues: 'Siguiente: inasistencias por alumno.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaPastilla, 1) || !dentro(T.pulsaCargar, 2) || !dentro(T.pulsaHoja, 3) || !dentro(T.pulsaBuscarOtro, 7) || !dentro(T.pulsaCargar2, 7) || !dentro(T.eligeMes, 9)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
export const PANEL_PLANILLAS = rectDelPanel(ajustesPlanillas(T.pulsaHoja));
