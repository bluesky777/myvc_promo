import { Punto } from '../../comunes/Cursor';
import { impresoDe } from '../cierre-6/datos-catalogo';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, foco, holgura, punto, union } from '../informes/Comun';
import {
	Ajustes, ENGRANAJE, GRUPOS, MESA, Rect, Valores, VIS, X_PANEL, Y_PANEL, disponer, disponerAjustes, rectDeFicha,
} from '../informes/datos';
import { rectDeOpcion } from '../informes/Piezas';
import { rectDelPanel } from '../informes/Visor';
import { rectanguloDeMando } from '../BarraDeHoy';
import { enElFotograma } from '../encuadre';
import { HOJA_BOLETIN, Y_GRAFICA, ALTO_GRAFICA } from './Boletin';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «LOS AJUSTES DE IMPRESIÓN». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): «están tras el engranaje y dicen "3 de 7"; y la galleta se comparte
 * con la aplicación vieja». **El plan se quedó corto respecto a app2, y manda el código:**
 *
 *   · NO están sólo tras el engranaje. Salen en DOS sitios con la misma plantilla
 *     (`ajustesDelInforme`, `catalogo-informes.html`): plegados en el configurador ANTES de cargar,
 *     y en un panel flotante con el papel delante, que **nace abierto** en los papeles que tienen
 *     algo más que «La hoja» (`ajustesAbiertos`, desde el 2026-09-18). El engranaje --«Ajustes»,
 *     sólo icono, con el globo «Ajustes: cómo sale este informe»-- abre y cierra ese panel, y lo
 *     que se diga ahí no se repone al cambiar de informe.
 *   · «N de M» es la cuenta del plegable «Cómo sale este informe»: las encendidas de las que ese
 *     papel lee. El boletín del periodo lee siete (`opciones-del-informe.ts:90`): foto, firma del
 *     rector, firma del titular, rojos, gráfico, escalas y notas pendientes del año. Aquí están
 *     cinco encendidas; en un navegador sin galleta saldrían las siete (`DEFECTOS`).
 *   · Tocar una casilla cambia la hoja sin recargar: los informes leen la galleta por una señal.
 *   · LA GALLETA ES LA DE LA APLICACIÓN VIEJA: `config`, mismo dominio, mismas claves
 *     (`config-informe.ts`, cabecera). Es del navegador, no del usuario.
 *
 * SEIS ACTOS: llegar · el configurador ya los trae · cargar · el panel abierto y una casilla · el
 * engranaje · «La hoja» y la galleta. 57 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaFicha: 150,
	pulsaFicha: 166,
	llegaGrupo: 715,
	abreGrupo: 725,
	llegaOpcion: 741,
	eligeGrupo: 753,
	llegaCargar: 771,
	pulsaCargar: 783,
	monta: 789,
	/** «Trayendo los boletines…»: la espera no está medida; se deja corta. */
	trae: 811,
	llegaGrafico: 956,
	pulsaGrafico: 970,
	llegaEngranaje: 1203,
	pulsaEngranaje: 1215,
	llegaEngranaje2: 1265,
	pulsaEngranaje2: 1275,
	llegaHoja: 1317,
	pulsaHoja: 1329,
	cursorSale: 1440,
};

export const GRUPO = '7°A';
export const OPCION_GRUPO = GRUPOS.indexOf(GRUPO);
export const IMPRESO = impresoDe('boletin-detallado');

/** Las siete casillas del boletín, en el orden en que las pide (`opciones-del-informe.ts:90`). */
const ETIQUETAS = ['Mostrar foto', 'Firma del rector', 'Firma del titular', 'Mostrar rojos', 'Mostrar gráfico', 'Mostrar escalas', 'Notas pendientes del año'];
const ANTES = [true, true, false, true, true, true, false];
export const GRAFICO = 4;
export const HOJA_EN_LA_MESA = { x: 140, y: 18, desplazamiento: 250 };

export function ajustes(frame: number): Ajustes {
	return {
		interruptores: ETIQUETAS.map((etiqueta, i) => ({ etiqueta, encendido: i === GRAFICO && frame >= T.pulsaGrafico ? false : ANTES[i] })),
		hoja: 0,
		abiertos: frame >= T.pulsaHoja ? { hoja: true } : undefined,
	};
}

export function valores(frame: number): Valores {
	return { destinatario: 0, grupo: frame >= T.eligeGrupo ? GRUPO : null };
}

export const panelAbierto = (frame: number) => frame < T.pulsaEngranaje || frame >= T.pulsaEngranaje2;

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const D0 = disponer({ consulta: '', familia: 'todo', elegida: null, valores: {} });
const D1 = disponer({ consulta: '', familia: 'todo', elegida: IMPRESO.clave, valores: valores(0), ajustes: ajustes(0) });
const D2 = disponer({ consulta: '', familia: 'todo', elegida: IMPRESO.clave, valores: valores(T.eligeGrupo), ajustes: ajustes(0) });

const plegableComo = D1.conf!.plegables.find((p) => p.que === 'como')!.cabeza;
const plegableHoja = D1.conf!.plegables.find((p) => p.que === 'hoja')!.cabeza;
const selectGrupo = D1.conf!.campos.grupo!;

const PANEL_ANTES = rectDelPanel(ajustes(0));
const panelDespues = disponerAjustes(ajustes(T.pulsaGrafico), X_PANEL, Y_PANEL + 8, VIS.panel, true);
const filaGrafico = panelDespues.plegables[0].controles[GRAFICO];
const cabezaComoPanel = panelDespues.plegables[0].cabeza;
const conHoja = disponerAjustes(ajustes(T.pulsaHoja), X_PANEL, Y_PANEL + 8, VIS.panel, true);
const cabezaHojaPanel = conHoja.plegables[1].cabeza;
const cuerpoHojaPanel = conHoja.plegables[1].cuerpo!;

/** La gráfica, en coordenadas del contenido, recortada a lo que el panel deja ver. */
const GRAFICA: Rect = {
	x: MESA.x + HOJA_EN_LA_MESA.x + 20,
	y: MESA.y + HOJA_EN_LA_MESA.y - HOJA_EN_LA_MESA.desplazamiento + Y_GRAFICA,
	ancho: X_PANEL - 16 - (MESA.x + HOJA_EN_LA_MESA.x + 20),
	alto: ALTO_GRAFICA,
};

export const FOCOS = {
	informes: FOCO_INFORMES,
	ficha: foco(holgura(rectDeFicha(D0, IMPRESO.clave), 6)),
	plegables: foco(holgura(union(plegableComo, plegableHoja), 2)),
	como: foco(holgura(plegableComo, 2)),
	configurador: foco(holgura(union({ ...selectGrupo, y: selectGrupo.y - 26, alto: selectGrupo.alto + 26 }, D2.conf!.cargar), 10)),
	panel: foco(holgura(PANEL_ANTES, 4), 14),
	grafica: foco(holgura(GRAFICA, 6)),
	cuenta: foco(holgura(cabezaComoPanel, 2)),
	engranaje: foco(holgura(ENGRANAJE, 6), 12),
	hoja: foco(holgura(union(cabezaHojaPanel, cuerpoHojaPanel), 2)),
	periodo: { ...enElFotograma(holgura(rectanguloDeMando('selector'), 4)), radio: 20 },
	panelEntero: foco(holgura(rectDelPanel(ajustes(T.pulsaHoja)), 4), 14),
};

const P = {
	ficha: punto(rectDeFicha(D0, IMPRESO.clave), 30),
	grupo: punto(selectGrupo, 60),
	opcion: punto(rectDeOpcion(selectGrupo, OPCION_GRUPO), -40),
	cargar: punto(D2.conf!.cargar, 40),
	grafico: punto({ ...filaGrafico, ancho: 40 }, -2),
	engranaje: punto(ENGRANAJE),
	hoja: punto(cabezaHojaPanel, -60),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 20, ...P.ficha },
	{ frame: T.llegaGrupo - 20, x: P.ficha.x + 120, y: P.ficha.y + 60 },
	{ frame: T.llegaGrupo, ...P.grupo },
	{ frame: T.abreGrupo + 8, ...P.grupo },
	{ frame: T.llegaOpcion, ...P.opcion },
	{ frame: T.eligeGrupo + 6, ...P.opcion },
	{ frame: T.llegaCargar, ...P.cargar },
	{ frame: T.pulsaCargar + 30, ...P.cargar },
	{ frame: T.llegaGrafico - 18, ...P.cargar },
	{ frame: T.llegaGrafico, ...P.grafico },
	{ frame: T.pulsaGrafico + 30, ...P.grafico },
	{ frame: T.llegaEngranaje - 18, ...P.grafico },
	{ frame: T.llegaEngranaje, ...P.engranaje },
	{ frame: T.pulsaEngranaje + 16, ...P.engranaje },
	{ frame: T.llegaEngranaje2 - 16, x: P.engranaje.x - 60, y: P.engranaje.y + 60 },
	{ frame: T.llegaEngranaje2, ...P.engranaje },
	{ frame: T.pulsaEngranaje2 + 6, ...P.engranaje },
	{ frame: T.llegaHoja, ...P.hoja },
	{ frame: T.pulsaHoja + 20, ...P.hoja },
	{ frame: T.cursorSale - 30, x: P.hoja.x - 260, y: P.hoja.y + 240 },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaFicha, T.abreGrupo, T.eligeGrupo, T.pulsaCargar, T.pulsaGrafico, T.pulsaEngranaje, T.pulsaEngranaje2, T.pulsaHoja];

export function senal(frame: number): string | null {
	if (frame >= T.llegaFicha && frame < T.pulsaFicha + 8) { return `ficha-${IMPRESO.clave}`; }
	if (frame >= T.llegaGrupo && frame < T.abreGrupo) { return 'campo-grupo'; }
	if (frame >= T.llegaCargar && frame < T.pulsaCargar + 4) { return 'cargar'; }
	if (frame >= T.llegaGrafico && frame < T.pulsaGrafico + 10) { return `interruptor-${GRAFICO}`; }
	if (frame >= T.llegaEngranaje && frame < T.pulsaEngranaje + 30) { return 'ajustes'; }
	if (frame >= T.llegaEngranaje2 && frame < T.pulsaEngranaje2 + 10) { return 'ajustes'; }
	if (frame >= T.llegaHoja && frame < T.pulsaHoja + 10) { return 'plegable-hoja'; }
	return null;
}

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_BOLETIN = { ubicacion: 'Menú ▸ Informes ▸ Boletín del periodo', url: '/informes/boletines-periodo/48/3' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Cada papel de Informes trae sus ajustes de impresión.', ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 131, texto: 'Elige el papel: aquí, el Boletín del periodo.', ...EN_INFORMES, foco: FOCOS.ficha, focoHasta: T.pulsaFicha + 20 },
	{ desde: 267, texto: 'No pregunta el periodo: usa el de arriba. Compruébalo.', ...EN_INFORMES, foco: FOCOS.periodo },
	{ desde: 428, texto: 'El configurador trae sus ajustes, plegados.', ...EN_INFORMES, foco: FOCOS.plegables },
	{ desde: 558, texto: '«5 de 7»: siete casillas, cinco encendidas.', voz: 'Cinco de siete: siete casillas, cinco encendidas.', ...EN_INFORMES, foco: FOCOS.como },
	{ desde: 709, texto: 'Elige el grupo y carga el informe.', ...EN_INFORMES, foco: FOCOS.configurador, focoHasta: T.pulsaCargar - 4 },
	{ desde: 811, texto: 'Con el papel delante, los ajustes salen en un panel.', ...EN_EL_BOLETIN, foco: FOCOS.panel },
	{ desde: 946, texto: 'Apaga «Mostrar gráfico»: la hoja cambia sin recargar.', ...EN_EL_BOLETIN, foco: FOCOS.grafica },
	{ desde: 1098, texto: 'La cuenta ya dice «4 de 7».', voz: 'La cuenta ya dice cuatro de siete.', ...EN_EL_BOLETIN, foco: FOCOS.cuenta },
	{ desde: 1195, texto: 'El engranaje de arriba cierra y abre el panel.', ...EN_EL_BOLETIN, foco: FOCOS.engranaje },
	{ desde: 1307, texto: '«La hoja» viene puesta: cada informe sabe su papel.', ...EN_EL_BOLETIN, foco: FOCOS.hoja },
	{ desde: 1444, texto: 'Se guardan en este navegador, también para la aplicación vieja.', ...EN_EL_BOLETIN, foco: FOCOS.panelEntero },
];

/* El panel entra con el boletín (`trae`) y «La hoja» se despliega al pulsarla: antes, el foco recortaría un hueco. */
export const FOCO_DESDE: Record<number, number> = { 6: T.trae, 10: T.pulsaHoja };

export const TARJETA = 1592;
export const DURACION = 1712;

export const CLAVE = 'informes-ajustes';
export const TITULO = 'Los ajustes de impresión';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde: con cada papel, en Informes' },
	{ desde: PASOS[3].desde, titulo: 'Antes de cargar: «Cómo sale este informe»' },
	{ desde: PASOS[6].desde, titulo: 'Con el papel delante: el panel' },
	{ desde: PASOS[9].desde, titulo: 'El engranaje' },
	{ desde: PASOS[10].desde, titulo: '«La hoja» y la galleta compartida' },
];

export const CIERRE: Cierre = {
	hiciste: 'Apagaste la gráfica del boletín desde sus ajustes de impresión.',
	seVe: 'La cuenta dice «4 de 7» y la hoja sale sin gráfica.',
	despues: 'Siguiente: la pila de impresión.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaGrafico, 7) || !dentro(T.pulsaEngranaje, 9) || !dentro(T.pulsaEngranaje2, 9) || !dentro(T.pulsaHoja, 10) || !dentro(T.pulsaCargar, 5)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
if (HOJA_BOLETIN.ancho + HOJA_EN_LA_MESA.x > MESA.ancho) {
	throw new Error('Guion: el boletín no cabe en la mesa.');
}
