import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { acercamientoAUnaHoja, encuadreDeUnaHoja, enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import {
	ACTA_PROMOCION, CIERRE_DE_ANO, PASTILLAS, enLaCascara as delCatalogo, rectanguloDeCargar, rectanguloDeFichaEnContenido,
	rectanguloDelConfigurador,
} from '../cierre-6/datos-catalogo';
import {
	ANCHOS_LISTADO, CERCA_CUADRO, CERCA_LISTADO, GRUPOS, HA, HOJA_ACTA, LA_ACADEMICA, LISTADO_9B, PROMOVIDO, SEGUNDOS_POR_GRUPO,
	Y_LISTADO, Y_PROMOCION, enLaCascara, rectanguloDeCasilla, rectanguloDeOpciones, rectanguloDeTraer, rectanguloDelDescuadre,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 7 DE 8: «EL ACTA DE EVALUACIÓN Y PROMOCIÓN».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Dónde sale el descuadre**: «Grupos con cifras que no cuadran», con los grupos, arriba en
 *        el encabezado del acta, y **se imprime a propósito** (`acta-evaluacion.html`).
 *     2. **Qué es lo que tarda.** El catálogo dice «tarda minuto y medio», y el código dice otra
 *        cosa: el acta es una llamada y abre enseguida; lo que tarda es la «Hoja académica por
 *        grupo», opcional y apagada por defecto, que trae las notas del año con una llamada por
 *        grupo de unos 8 s («Con trece grupos es casi minuto y medio», `acta-evaluacion.ts`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA ESPERA: RITMO REAL, Y UN CORTE DICHO
 *
 * Minuto y medio de barra en un vídeo de 70 s no cabe, y acelerarla sin decirlo enseñaría una
 * aplicación más rápida que la de verdad: quien la use pensará que la suya se colgó. Así que:
 *
 *   · la primera llamada se enseña ENTERA: el contador está en «0 de 13» ocho segundos (240
 *     fotogramas; la puerta de abajo lo exige) y pasa a «1 de 13»;
 *   · en ese momento el rótulo dice «Corte» con lo que se salta --los otros 12 grupos, unos 96 s--
 *     y una pastilla oscura, fuera de la aplicación, lo repite mientras la imagen salta al final.
 *
 * Lo que cuenta el reloj es la cifra del código (8 s por grupo), no una medida de este vídeo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. EL CATÁLOGO      menú → Informes → «Cierre de año» → la ficha → «Cargar el informe»
 *     2. LA PANTALLA      qué se imprime, y el aviso de descuadre
 *     3. LA QUE TARDA     la hoja académica, con su espera y el corte
 *     4. LA HOJA          la de 9°B: listado con «Promovido», y el cuadro de promoción
 */

export const FPS = 30;

/*
 * LOS TIEMPOS SE ENCADENAN SOLOS (2026-09-29, con voz): cada paso empieza cuando el anterior terminó
 * de decirse (`dura()`, la misma cuenta que la puerta) y los clics y los planos cuelgan de los pasos.
 * Lo único fijo es lo que imita a la aplicación: los SEGUNDOS_POR_GRUPO de la primera llamada.
 */
type Texto = { texto: string; voz?: string; rojo?: boolean };

const T: Texto[] = [
	{ texto: 'El acta está en Informes, Cierre de año.' },
	{ texto: 'Antes calcula promovidos, o saldrá «Sin definir».' },
	{ texto: 'No pide nada: es del colegio entero.' },
	{ texto: 'Lo que ves en pantalla es lo que se imprime.' },
	{ texto: 'Si un grupo no cuadra, lo avisa aquí. Revísalo antes de firmar.' },
	{ texto: 'La hoja académica es opcional, y tarda.' },
	{ texto: `Unos ${SEGUNDOS_POR_GRUPO} segundos por grupo: con ${GRUPOS} grupos, más de minuto y medio.` },
	{ texto: `Corte: el vídeo se salta los otros ${GRUPOS - 1} grupos.` },
	{ texto: 'Cada grupo sale en su hoja apaisada.' },
	{ texto: 'El listado dice si es promovido: Sí o Pendiente.' },
	{ texto: 'El cuadro cuenta cuántos pasan y cuántos quedan pendientes.' },
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
D[3] = D[2] + dura(T[2]);

const pulsaFamilia = D[1] - 20;
const pulsaFicha = D[2] - 12;
/** «Cargar el informe» al final del paso 3: el acta llega justo cuando empieza el 4. */
const pulsaCargar = D[3] - 32;

export const LLEGADA = {
	cursorEntra: 12,
	llegaInformes: 26,
	pulsaInformes: 32,
	montaCatalogo: 38,
	llegaFamilia: pulsaFamilia - 10,
	pulsaFamilia,
	llegaFicha: pulsaFicha - 12,
	pulsaFicha,
	llegaCargar: pulsaCargar - 14,
	pulsaCargar,
	seVaCatalogo: pulsaCargar + 4,
	montaActa: pulsaCargar + 32,
};

D[4] = D[3] + dura(T[3]);
D[5] = D[4] + dura(T[4]);

export const ACADEMICA = {
	llegaCasilla: D[5] + 14,
	pulsaCasilla: D[5] + 20,
	llegaTraer: D[5] + 38,
	pulsaTraer: D[5] + 48,
	cursorSale: D[5] + 88,
};

/** La primera llamada dura lo que dura en la aplicación. */
export const PRIMERO = ACADEMICA.pulsaTraer + SEGUNDOS_POR_GRUPO * FPS;

D[6] = Math.max(D[5] + dura(T[5]), ACADEMICA.pulsaTraer + 24);
D[7] = Math.max(D[6] + dura(T[6]), PRIMERO + 10);
D[8] = D[7] + dura(T[7]);
D[9] = D[8] + dura(T[8]);
D[10] = D[9] + dura(T[9]);

export const TARJETA = D[10] + dura(T[10]);

export const CORTE = { desde: D[7], salto: D[7] + 12, hasta: D[8] - 30 };

export const PAPEL_T = {
	seVaLaCascara: D[8] - 40,
	entraLaHoja: D[8],
	aListado: D[9] - 16,
	aCuadro: D[10] - 16,
};

export const INFORMES = entradaDe(MENU_DIRECTIVO, 'Informes').seccion;
const yInformes = alturaEnMenu(MENU_DIRECTIVO, INFORMES, null, null);
const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const HOJA_ENTERA = encuadreDeUnaHoja(HOJA_ACTA);
export const HOJA_LISTADO = acercamientoAUnaHoja(HOJA_ACTA, CERCA_LISTADO);
export const HOJA_CUADRO = acercamientoAUnaHoja(HOJA_ACTA, CERCA_CUADRO);

const enPlano = (p: { x: number; y: number; escala: number }, r: { x: number; y: number; ancho: number; alto: number }) => ({
	x: p.x + r.x * p.escala, y: p.y + r.y * p.escala, ancho: r.ancho * p.escala, alto: r.alto * p.escala, radio: 6,
});
const xPromovido = HA.pad + ANCHOS_LISTADO.slice(0, PROMOVIDO).reduce((a, b) => a + b, 0);

export const FOCOS = {
	informes: enElFotograma({ x: 0, y: yInformes, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	ficha: enElFotograma(delCatalogo(rectanguloDeFichaEnContenido(ACTA_PROMOCION))),
	configurador: enElFotograma(delCatalogo(rectanguloDelConfigurador(false))),
	opciones: enElFotograma(enLaCascara(rectanguloDeOpciones(false))),
	descuadre: enElFotograma(enLaCascara(rectanguloDelDescuadre(false))),
	academica: enElFotograma(enLaCascara(rectanguloDeOpciones(true))),
	promovido: enPlano(HOJA_LISTADO, { x: xPromovido, y: Y_LISTADO, ancho: ANCHOS_LISTADO[PROMOVIDO], alto: HA.cab + HA.fila * LISTADO_9B.length }),
	cuadro: enPlano(HOJA_CUADRO, { x: HA.pad, y: Y_PROMOCION, ancho: HOJA_ACTA.ancho - HA.pad * 2, alto: HA.cabCuadro + HA.filaCuadro * 8 }),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	informes: { x: 150, y: yInformes + MEDIDAS.seccion / 2 },
	familia: centro(delCatalogo(PASTILLAS[CIERRE_DE_ANO])),
	ficha: centro(delCatalogo(rectanguloDeFichaEnContenido(ACTA_PROMOCION))),
	cargar: centro(delCatalogo(rectanguloDeCargar(false))),
	casilla: (() => { const r = enLaCascara(rectanguloDeCasilla(LA_ACADEMICA)); return { x: r.x + 10, y: r.y + r.alto / 2 }; })(),
	traer: centro(enLaCascara(rectanguloDeTraer())),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Informes', url: 'micolegio.micolevirtual.com/up2/' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes ▸ Cierre de año', url: '/informes' };
const EN_EL_ACTA = { ubicacion: 'Menú ▸ Informes ▸ Acta de evaluación y promoción', url: '/informes/acta-evaluacion-promocion' };

const DONDE: Pick<Paso, 'ubicacion' | 'url' | 'foco' | 'focoHasta'>[] = [
	{ ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ ...EN_INFORMES, foco: FOCOS.ficha },
	{ ...EN_INFORMES, foco: FOCOS.configurador, focoHasta: LLEGADA.pulsaCargar + 6 },
	{ ...EN_EL_ACTA, foco: FOCOS.opciones },
	{ ...EN_EL_ACTA, foco: FOCOS.descuadre },
	{ ...EN_EL_ACTA, foco: FOCOS.academica, focoHasta: ACADEMICA.pulsaTraer + 20 },
	{ ...EN_EL_ACTA },
	{ ...EN_EL_ACTA },
	{ ...EN_EL_ACTA },
	{ ...EN_EL_ACTA, foco: FOCOS.promovido, focoHasta: PAPEL_T.aCuadro - 4 },
	{ ...EN_EL_ACTA, foco: FOCOS.cuadro },
];

export const PASOS: Paso[] = T.map((t, i) => ({ desde: D[i], ...t, ...DONDE[i] }));

export const CLAVE = 'cierre-7-acta';
export const TITULO = 'El acta de evaluación y promoción';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Informes, Cierre de año' },
	{ desde: LLEGADA.montaActa, titulo: 'Qué se imprime, y el aviso de descuadre' },
	{ desde: ACADEMICA.pulsaCasilla, titulo: 'La hoja académica: la que tarda' },
	{ desde: PAPEL_T.entraLaHoja, titulo: 'La hoja de cada grupo' },
];

export const CIERRE: Cierre = {
	hiciste: 'Sacaste el acta de evaluación y promoción del colegio entero.',
	seVe: 'Promovido dice Sí o Pendiente, no «Sin definir»; y un descuadre sale arriba, antes de firmar.',
	despues: 'Siguiente, 8 de 8: el acta de nivelación.',
};

const VOZ_TARJETA = segundosDeVoz(CIERRE.despues!);
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* La primera llamada se ve entera: ocho segundos desde el clic hasta «1 de 13», y el corte después. */
if (PRIMERO - ACADEMICA.pulsaTraer !== SEGUNDOS_POR_GRUPO * FPS || CORTE.desde <= PRIMERO) {
	throw new Error('Guion: la primera llamada de la hoja académica no dura lo que dura en la aplicación.');
}
/* El rótulo del corte empieza donde empieza el corte. */
if (PASOS[7].desde !== CORTE.desde) {
	throw new Error(`Guion: el corte empieza en ${CORTE.desde} y su rótulo en ${PASOS[7].desde}.`);
}
