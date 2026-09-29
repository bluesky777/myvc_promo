import { Punto } from '../../comunes/Cursor';
import { escrito } from '../../comunes/movimiento';
import { impresoDe } from '../cierre-6/datos-catalogo';
import { acercamientoAUnaHoja } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, enElPlano, foco, holgura, punto, union } from '../informes/Comun';
import { Ajustes, MESA, Rect, disponer, rectDeFicha } from '../informes/datos';
import { ANCHO_TABLA, COL, DOCENTES_PENDIENTES, H, HOJA, X_BLANCAS, X_TABLA, X_TEMA, tablasDe } from './Hoja';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «NOTAS PERDIDAS PARA LA COMISIÓN». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): «una hoja por docente, con columnas en blanco para rellenar a mano».
 * Confirmado:
 *   · La ficha es «Notas perdidas de todos» --«El colegio entero. Es el papel de la comisión de
 *     evaluación.»-- y sólo pide «Calcular hasta el periodo» (`impresos.ts`). Carta apaisada.
 *   · Una hoja por docente: `.hoja + .hoja { break-before: page }` (`notas-perdidas.scss:14`).
 *   · Las columnas «Nota nueva», «Asist Sí/No», «Fecha», «Método refuerzo» y «Firma» salen en blanco
 *     a propósito: se llenan con bolígrafo en la recuperación (`tabla-pendientes.ts`, cabecera).
 *   · La columna del tema lleva el nombre que el colegio da a la subunidad (`nombreSubunidad`).
 *
 * Para un solo docente está «Notas perdidas del profesor», que pide además el profesor; el vídeo no
 * la recorre.
 *
 * 40 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaBuscador: 146,
	pulsaBuscador: 156,
	teclea: 164,
	llegaFicha: 214,
	pulsaFicha: 226,
	llegaCargar: 436,
	pulsaCargar: 448,
	monta: 454,
	trae: 480,
	cursorSale: 560,
	seVa: 670,
	plano: 676,
	planoDos: 948,
};
export const POR_TECLA = 4;
export const BUSCA = 'comision';
export const IMPRESO = impresoDe('perdidas-todos');

export const consulta = (f: number) => escrito(f, BUSCA, T.teclea, POR_TECLA);
export const ajustes = (): Ajustes => ({ hoja: 1 });
export const estadoEn = (f: number) => ({ consulta: consulta(f), familia: 'todo' as const, elegida: f >= T.pulsaFicha ? IMPRESO.clave : null, valores: { hasta: 3 }, ajustes: ajustes() });

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const D_BUSCA = disponer(estadoEn(T.teclea + BUSCA.length * POR_TECLA));
const D_ELEGIDA = disponer(estadoEn(T.pulsaFicha));

/** La primera hoja en la mesa, bajo el título de la página. */
export const EN_LA_MESA = { x: (MESA.ancho - HOJA.ancho) / 2, y: 46 };

/** De cerca: las dos tablas de la primera docente. */
export const CERCA = acercamientoAUnaHoja(HOJA, { y: 30, alto: 440 });
/** Las dos hojas, una al lado de otra: una por docente. */
export const DOS = { ancho: HOJA.ancho * 2 + 48, alto: HOJA.alto };
export const PLANO_DOS = (() => {
	const escala = Math.min((784 - 60) / DOS.alto, (1920 - 100) / DOS.ancho);
	return { escala, x: (1920 - DOS.ancho * escala) / 2, y: 108 + (784 - DOS.alto * escala) / 2 };
})();

const tablas = tablasDe(DOCENTES_PENDIENTES[0]);
const finTablas = tablas[tablas.length - 1].y + tablas[tablas.length - 1].alto;
const enLaMesa = (r: Rect): Rect => ({ ...r, x: MESA.x + EN_LA_MESA.x + r.x, y: MESA.y + EN_LA_MESA.y + r.y });

export const FOCOS = {
	informes: FOCO_INFORMES,
	resultados: foco(holgura(union(...D_BUSCA.secciones.flatMap((s) => s.fichas.map((f) => f.rect))), 6)),
	hasta: foco(holgura({ ...D_ELEGIDA.conf!.campos.hasta!, y: D_ELEGIDA.conf!.campos.hasta!.y - 26, alto: D_ELEGIDA.conf!.campos.hasta!.alto + 26 }, 8)),
	cargar: foco(holgura(D_ELEGIDA.conf!.cargar, 6)),
	hoja: foco(holgura(enLaMesa({ x: 0, y: 0, ancho: HOJA.ancho, alto: finTablas + 10 }), 2)),
	loPerdido: enElPlano(CERCA, { x: X_TEMA - COL.per - 2, y: tablas[0].cabeza - 2, ancho: COL.per + COL.tema + COL.nota + 4, alto: tablas[0].alto - H.titulo + 4 }),
	indicador: enElPlano(CERCA, { x: X_TEMA - 2, y: tablas[0].cabeza - 2, ancho: COL.tema + 4, alto: H.cab1 + H.cab2 + 4 }),
	blancas: enElPlano(CERCA, { x: X_BLANCAS - 2, y: tablas[0].cabeza - 2, ancho: X_TABLA + ANCHO_TABLA - X_BLANCAS + 4, alto: finTablas - tablas[0].cabeza + 4 }),
};

const P = {
	buscador: punto(D_BUSCA.buscador, -200),
	ficha: punto(rectDeFicha(D_BUSCA, IMPRESO.clave), 30),
	cargar: punto(D_ELEGIDA.conf!.cargar, 40),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaBuscador, ...P.buscador },
	{ frame: T.pulsaBuscador + 6, ...P.buscador },
	{ frame: T.teclea + 20, x: P.buscador.x + 60, y: P.buscador.y + 150 },
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 20, ...P.ficha },
	{ frame: T.llegaCargar, ...P.cargar },
	{ frame: T.pulsaCargar + 30, ...P.cargar },
	{ frame: T.cursorSale - 10, x: P.cargar.x - 300, y: P.cargar.y + 60 },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaBuscador, T.pulsaFicha, T.pulsaCargar];

export function senal(f: number): string | null {
	if (f >= T.llegaBuscador && f < T.pulsaBuscador) { return 'buscador'; }
	if (f >= T.llegaFicha && f < T.pulsaFicha + 8) { return `ficha-${IMPRESO.clave}`; }
	if (f >= T.llegaCargar && f < T.pulsaCargar + 4) { return 'cargar'; }
	return null;
}

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_HOJA = { ubicacion: 'Menú ▸ Informes ▸ Notas perdidas de todos', url: '/informes/notas-perdidas-todos/3/false' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Las notas perdidas para la comisión salen de Informes.', ...EN_EL_MENU, foco: FOCO_INFORMES, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 141, texto: 'Busca «comision»: la primera es «Notas perdidas de todos».', ...EN_INFORMES, foco: FOCOS.resultados, focoHasta: T.pulsaFicha + 12 },
	{ desde: 305, texto: 'Sólo pide hasta qué periodo: sale el colegio entero.', ...EN_INFORMES, foco: FOCOS.hasta },
	{ desde: 431, texto: 'Carga el informe: una hoja por docente.', ...EN_INFORMES, foco: FOCOS.cargar, focoHasta: T.pulsaCargar + 4 },
	{ desde: 547, texto: 'Arriba, el docente; debajo, quién perdió.', ...EN_LA_HOJA, foco: FOCOS.hoja, focoHasta: T.seVa - 12 },
	{ desde: 682, texto: 'Por alumno: el periodo, el indicador y la nota perdida.', ...EN_LA_HOJA, foco: FOCOS.loPerdido },
	{ desde: 831, texto: 'Las columnas en blanco se llenan en la recuperación.', ...EN_LA_HOJA, foco: FOCOS.blancas, focoHasta: T.planoDos - 8 },
	{ desde: 951, texto: 'Una hoja por docente: se reparten sin cortar papel.', ...EN_LA_HOJA },
];

export const TARJETA = 1089;
export const DURACION = 1209;

export const CLAVE = 'notas-perdidas-comision';
export const TITULO = 'Notas perdidas para la comisión';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Buscarla: «comision»' },
	{ desde: PASOS[2].desde, titulo: 'Sólo pide hasta qué periodo' },
	{ desde: PASOS[4].desde, titulo: 'La hoja: lo perdido por alumno' },
	{ desde: PASOS[6].desde, titulo: 'Las columnas en blanco, y una hoja por docente' },
];

export const CIERRE: Cierre = {
	hiciste: 'Sacaste las notas perdidas del colegio hasta el periodo 3.',
	seVe: 'Una hoja por docente, con las columnas de la recuperación en blanco.',
	despues: 'Siguiente: planillas y controles del aula.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.pulsaFicha >= PASOS[2].desde || T.pulsaCargar < PASOS[3].desde || T.pulsaCargar >= PASOS[4].desde) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
