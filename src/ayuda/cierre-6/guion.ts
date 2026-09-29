import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { acercamientoAUnaHoja, encuadreDeUnaHoja, enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import { GRUPO_9B_ID } from '../cierre-5/datos';
import { CIERRE_DE_ANO, PASTILLAS, enLaCascara as delCatalogo } from './datos-catalogo';
import {
	ACERCAMIENTO_PROMOVIDOS, CONFIRMA, FINALES, GRUPOS_DEL_COLEGIO, HOJA_APAISADA, SIN_RECALCULAR, enLaCascara,
	rectanguloDeCalcularPromovidos, rectanguloDeConfirmar, rectanguloDeLaConfirmacion, rectanguloDeLaFilaDelPeriodo,
	rectanguloDePestana, rectanguloDeRecalcularLos, rectanguloDelAviso,
} from './datos';
import { ANCHOS_PROMOVIDOS, ARRIBA_TABLA_PROMOVIDOS, FILA, FILA_CAB } from './HojaPromovidos';
import { PROMOCION_9B } from './datos';
import { BARRA_DIRECCIONES } from './Piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 6 DE 8: «RECALCULAR DEFINITIVAS Y CALCULAR PROMOVIDOS». Cartel rojo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 * **Esos dos botones NO están en el menú nuevo, ni en el catálogo de Informes**: viven en el
 * tablero viejo, `/informes-old`, que salió del menú el 2026-09-19 y al que se llega escribiendo
 * la dirección (`app.routes.ts`, `menu.ts`). Sin ellos, el acta y el papel de promovidos salen
 * «Sin definir»: la matrícula nace con `promovido = 'Automático'` y eso se lee como sin definir
 * hasta que alguien pulsa «Calcular promovidos» (`pendientes-del-alumno.ts`).
 *
 * LOS DOS BOTONES ESCRIBEN, y por eso llevan cartel rojo y un segundo más:
 *   · recalcular BORRA las finales de ese grupo y periodo y las vuelve a calcular --sin diálogo:
 *     el aviso amarillo es la explicación-- y respeta las «manual» y las recuperadas;
 *   · calcular promovidos escribe en la base de datos quién pasa de año; lo pide confirmado.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CINCO ACTOS
 *
 *     1. INFORMES          menú → Informes; «Cierre de año» no tiene esos botones
 *     2. LA DIRECCIÓN      se escribe `/informes-old` en el navegador
 *     3. RECALCULAR        el aviso amarillo, «Recalcular los 3»
 *     4. PROMOVIDOS        pestaña Finales, «Calcular promovidos…», el rojo
 *     5. COMPROBAR         el papel «Promovidos y no promovidos» de 9°B, dos planos quietos
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO, Y LOS DOS CORTES
 *
 * Los dos cálculos van grupo por grupo, en serie, y **el código no dice cuánto tardan** (del de
 * promovidos sólo dice «Tarda»; no se ha medido). El vídeo no se inventa una cifra: enseña la barra
 * de progreso poco más de dos segundos y pone encima una pastilla oscura --fuera de la aplicación--
 * que dice que la espera está acortada. Los avisos de después son los literales de `tablero.ts`.
 *
 * DURA 77 s, dentro del tope: se deja fuera recalcular un solo grupo (los botones sueltos se ven
 * pero no se pulsan) y la pestaña Finales no se recorre entera.
 */

export const FPS = 30;

/*
 * LOS TIEMPOS SE ENCADENAN SOLOS (2026-09-29, con voz): cada paso empieza cuando el anterior terminó
 * de decirse (`dura()`, la misma cuenta que la puerta) y los clics y los planos cuelgan de los pasos.
 */
type Texto = { texto: string; voz?: string; rojo?: boolean };

const T: Texto[] = [
	{ texto: 'Recalcular y promovidos no están en el menú nuevo.' },
	{ texto: 'Ni en Informes. Sin ellos, el acta dice «Sin definir».' },
	{ texto: 'Están en el tablero viejo: escribe la dirección.' },
	{ texto: 'Si alguien editó notas después, sale este aviso.' },
	{ texto: 'Recalcular rehace las finales, salvo manuales y recuperadas.' },
	{ texto: 'Al acabar, lo avisa.' },
	{ texto: 'En la pestaña Finales, Calcular promovidos.' },
	{ texto: 'Decide quién pasa de año. Es lo que lee el acta.' },
	{ texto: 'Y avisa en cuántos grupos.' },
	{ texto: 'Se comprueba en Informes: Promovidos y no promovidos.' },
	{ texto: 'Cada alumno con su decisión: ya no dice «Sin definir».' },
];

const dura = (t: Texto): number => {
	/* Como la puerta: con `tools/voz.mjs` cargando el guion, la voz todavía no manda. */
	const voz = (globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ ? null : segundosDeVoz(t.voz ?? t.texto);
	return (voz === null ? fotogramasDeLectura(t.texto, FPS) : RETRASO_VOZ + Math.ceil(voz * FPS) + RESPIRO_VOZ) + (t.rojo ? FPS : 0);
};

const D: number[] = [];
D[0] = 8;
D[1] = D[0] + dura(T[0]);
D[2] = D[1] + dura(T[1]);

export const LLEGADA = {
	cursorEntra: 12,
	llegaInformes: 26,
	pulsaInformes: 32,
	montaCatalogo: 38,
	llegaFamilia: D[1] + 14,
	pulsaFamilia: D[1] + 24,
};

const TRAMO = 'informes-old';
const teclea = D[2] + 16;
const intro = teclea + TRAMO.length * 3 + 10;

export const DIRECCION = {
	aparece: D[2],
	teclea,
	porTecla: 3,
	intro,
	seVaCatalogo: intro + 4,
	montaTablero: intro + 32,
};

D[3] = Math.max(D[2] + dura(T[2]), DIRECCION.montaTablero + 30);
D[4] = D[3] + dura(T[3]);

/** «Recalcular los N» al final del paso que lo explica; la espera va acortada, con su corte. */
const pulsaRecalcular = D[4] + dura(T[4]) - 20;
export const RECALCULA = {
	llega: pulsaRecalcular - 14,
	pulsa: pulsaRecalcular,
	fin: pulsaRecalcular + 70,
};

D[5] = RECALCULA.fin;
D[6] = D[5] + dura(T[5]);

export const FINALES_T = {
	llega: D[6] - 34,
	pulsa: D[6] - 20,
};

D[7] = D[6] + dura(T[6]);
const confirma = D[7] + dura(T[7]) - 20;

export const PROMOVIDOS_T = {
	llegaCalcular: D[7] - 16,
	abre: D[7],
	llegaConfirmar: confirma - 16,
	confirma,
	fin: confirma + 60,
	cursorSale: confirma + 100,
};

D[8] = PROMOVIDOS_T.fin;
D[9] = D[8] + dura(T[8]);
D[10] = D[9] + dura(T[9]);

export const TARJETA = D[10] + dura(T[10]);

export const PAPEL_T = {
	seVaLaCascara: D[9] - 5,
	entraLaHoja: D[9] + 35,
	empiezaElAcercamiento: D[10] - 15,
	acabaElAcercamiento: D[10] - 3,
};

export const INFORMES = entradaDe(MENU_DIRECTIVO, 'Informes').seccion;
const yInformes = alturaEnMenu(MENU_DIRECTIVO, INFORMES, null, null);

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const HOJA_EN_EL_FOTOGRAMA = encuadreDeUnaHoja(HOJA_APAISADA);
export const HOJA_DE_CERCA = acercamientoAUnaHoja(HOJA_APAISADA, ACERCAMIENTO_PROMOVIDOS);

const DECISION = 7;
const xDecision = 22 + ANCHOS_PROMOVIDOS.slice(0, DECISION).reduce((a, b) => a + b, 0);
const enLaHojaDeCerca = (r: { x: number; y: number; ancho: number; alto: number }) => ({
	x: HOJA_DE_CERCA.x + r.x * HOJA_DE_CERCA.escala,
	y: HOJA_DE_CERCA.y + r.y * HOJA_DE_CERCA.escala,
	ancho: r.ancho * HOJA_DE_CERCA.escala,
	alto: r.alto * HOJA_DE_CERCA.escala,
	radio: 6,
});

export const FOCOS = {
	informes: enElFotograma({ x: 0, y: yInformes, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	familia: enElFotograma(delCatalogo(PASTILLAS[CIERRE_DE_ANO])),
	direccion: { ...BARRA_DIRECCIONES, radio: 32 },
	aviso: enElFotograma(enLaCascara(rectanguloDelAviso())),
	fila: enElFotograma(enLaCascara(rectanguloDeLaFilaDelPeriodo())),
	calcular: enElFotograma(enLaCascara(rectanguloDeCalcularPromovidos())),
	confirmacion: enElFotograma(enLaCascara(rectanguloDeLaConfirmacion())),
	decision: enLaHojaDeCerca({ x: xDecision, y: ARRIBA_TABLA_PROMOVIDOS, ancho: ANCHOS_PROMOVIDOS[DECISION], alto: FILA_CAB + FILA * PROMOCION_9B.length }),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	informes: { x: 150, y: yInformes + MEDIDAS.seccion / 2 },
	familia: centro(delCatalogo(PASTILLAS[CIERRE_DE_ANO])),
	recalcular: centro(enLaCascara(rectanguloDeRecalcularLos())),
	finales: centro(enLaCascara(rectanguloDePestana(FINALES))),
	calcular: centro(enLaCascara(rectanguloDeCalcularPromovidos())),
	confirmar: centro(enLaCascara(rectanguloDeConfirmar())),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Informes', url: 'micolegio.micolevirtual.com/up2/' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes', url: '/informes' };
const EN_EL_TABLERO = { ubicacion: 'Sin entrada en el menú ▸ Informes old', url: '/informes-old' };
const EN_EL_PAPEL = { ubicacion: 'Menú ▸ Informes ▸ Promovidos y no promovidos', url: `/informes/promovidos/${GRUPO_9B_ID}` };

const DONDE: Pick<Paso, 'ubicacion' | 'url' | 'foco' | 'focoHasta'>[] = [
	{ ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ ...EN_INFORMES, foco: FOCOS.familia, focoHasta: LLEGADA.pulsaFamilia + 20 },
	{ ...EN_INFORMES, foco: FOCOS.direccion, focoHasta: DIRECCION.intro + 8 },
	{ ...EN_EL_TABLERO, foco: FOCOS.aviso },
	{ ...EN_EL_TABLERO, foco: FOCOS.fila },
	{ ...EN_EL_TABLERO },
	{ ...EN_EL_TABLERO, foco: FOCOS.calcular, focoHasta: PROMOVIDOS_T.abre - 10 },
	{ ...EN_EL_TABLERO, foco: FOCOS.confirmacion, focoHasta: PROMOVIDOS_T.confirma + 6 },
	{ ...EN_EL_TABLERO },
	{ ...EN_EL_PAPEL },
	{ ...EN_EL_PAPEL, foco: FOCOS.decision },
];

export const PASOS: Paso[] = T.map((t, i) => ({ desde: D[i], ...t, ...DONDE[i] }));

export const AVISO_RECALCULO = `Definitivas del periodo 4 recalculadas`;
export const AVISO_PROMOVIDOS = `Promovidos calculados en ${GRUPOS_DEL_COLEGIO} grupos`;


export const CLAVE = 'cierre-6-definitivas-promovidos';
export const TITULO = 'Recalcular definitivas y calcular promovidos';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'No están en el menú nuevo' },
	{ desde: DIRECCION.aparece, titulo: 'El tablero viejo: /informes-old' },
	{ desde: D[3], titulo: 'Recalcular definitivas' },
	{ desde: FINALES_T.pulsa, titulo: 'Calcular promovidos' },
	{ desde: PAPEL_T.seVaLaCascara, titulo: 'Comprobarlo: Promovidos y no promovidos' },
];

export const CIERRE: Cierre = {
	hiciste: 'Recalculaste las definitivas y calculaste los promovidos, en el tablero viejo.',
	seVe: `Avisa «${AVISO_PROMOVIDOS}», y el papel de 9°B ya no dice «Sin definir».`,
	despues: 'Siguiente, 7 de 8: el acta de promoción.',
};

const VOZ_TARJETA = segundosDeVoz(CIERRE.despues!);
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Los clics que escriben caen DENTRO de su paso rojo: primero se lee, después se pulsa. */
if (RECALCULA.pulsa < PASOS[4].desde + 60 || RECALCULA.pulsa >= PASOS[5].desde) {
	throw new Error('Guion: «Recalcular los 3» se pulsa fuera del paso rojo que lo explica, o antes de poder leerlo.');
}
if (PROMOVIDOS_T.confirma < PASOS[7].desde + 60 || PROMOVIDOS_T.confirma >= PASOS[8].desde) {
	throw new Error(`Guion: «${CONFIRMA}» se pulsa fuera del paso rojo que lo explica, o antes de poder leerlo.`);
}
if (SIN_RECALCULAR.length < 2) {
	throw new Error('Guion: con un solo grupo no sale «Recalcular los N» (tablero.html).');
}
