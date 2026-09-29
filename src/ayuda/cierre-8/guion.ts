import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { rectanguloDeMando } from '../BarraDeHoy';
import { acercamientoAUnaHoja, encuadreDeUnaHoja, enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import { GRUPO_9B_ID } from '../cierre-5/datos';
import {
	ACTA_NIVELACION, CIERRE_DE_ANO, PASTILLAS, enLaCascara as delCatalogo, rectanguloDeCargar, rectanguloDeFichaEnContenido,
	rectanguloDelConfigurador, rectanguloDelSelectorDeGrupo,
} from '../cierre-6/datos-catalogo';
import { OPCION_9B, rectanguloDeOpcion } from '../cierre-6/Catalogo';
import {
	CERCA_A, CERCA_B, HN, HOJA_NIV, SECCION_A, SECCION_B, Y_B, Y_FILAS_A, Y_FIRMAS, Y_REGLA, discrepa, enLaCascara,
	rectanguloDelAviso,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 8 DE 8 (EL ÚLTIMO): «EL ACTA DE NIVELACIÓN».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Dos secciones con reglas distintas.** La A --indicadores del periodo-- sigue la regla
 *        de nivelación del año, que el acta imprime arriba; la B --asignaturas del año
 *        recuperadas-- no sigue ninguna: queda la nota escrita. Por eso Valentina sale con 70 en
 *        la B, cuando la regla «topada» la habría dejado en 60.
 *     2. **El asterisco no es un error.** Marca una fila registrada cuando el colegio tenía otra
 *        regla; cambiar la regla no reescribe lo ya nivelado, y la nota al pie lo dice.
 *
 * El aviso «Antes de firmarla» es de la pantalla y no se imprime (`hidden-print`); el vídeo lo
 * dice así. El periodo no se elige: la ficha sólo pide el grupo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. EL CATÁLOGO   Informes → «Cierre de año» → la ficha → Grupo 9°B → «Cargar el informe»
 *     2. LA PANTALLA   el aviso de antes de firmar
 *     3. EL PAPEL      tres planos quietos: la hoja entera, la A de cerca, la B de cerca
 *
 * ES EL ÚLTIMO DE LA SERIE: la tarjeta no anuncia un siguiente.
 */

export const FPS = 30;

/*
 * LOS TIEMPOS SE ENCADENAN SOLOS (2026-09-29, con voz): cada paso empieza cuando el anterior terminó
 * de decirse (`dura()`, la misma cuenta que la puerta) y los clics y los planos cuelgan de los pasos.
 */
type Texto = { texto: string; voz?: string; rojo?: boolean };

const T: Texto[] = [
	{ texto: 'El acta está en Informes, Cierre de año.' },
	{ texto: 'Sólo pide el grupo. Mira el periodo de arriba antes de imprimir.' },
	{ texto: '«Antes de firmarla» avisa lo que no cuadra. No se imprime.' },
	{ texto: 'Tiene dos secciones, cada una con su regla.' },
	{ texto: 'Sección A: lo nivelado queda en la mínima.' },
	{ texto: 'El asterisco: se niveló con otra regla. Está bien así.' },
	{ texto: 'Sección B: la recuperación del año, tal cual se escribió.' },
	{ texto: 'Al pie firman titular, coordinación y rector.' },
];

const dura = (t: Texto): number => {
	/* Como la puerta: con `tools/voz.mjs` cargando el guion, la voz todavía no manda. */
	const voz = (globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ ? null : segundosDeVoz(t.voz ?? t.texto);
	return (voz === null ? fotogramasDeLectura(t.texto, FPS) : RETRASO_VOZ + Math.ceil(voz * FPS) + RESPIRO_VOZ) + (t.rojo ? FPS : 0);
};

const D: number[] = [];
D[0] = 8;
D[1] = D[0] + dura(T[0]);

const pulsaFicha = D[1] - 6;
/** El foco del configurador se queda un rato antes de que se abra el grupo. */
const abreGrupo = D[1] + Math.max(60, dura(T[1]) - 70);
const eligeOpcion = abreGrupo + 24;
const pulsaCargar = eligeOpcion + 26;

export const LLEGADA = {
	cursorEntra: 12,
	llegaInformes: 26,
	pulsaInformes: 32,
	montaCatalogo: 38,
	llegaFamilia: pulsaFicha - 42,
	pulsaFamilia: pulsaFicha - 34,
	llegaFicha: pulsaFicha - 10,
	pulsaFicha,
	llegaGrupo: abreGrupo - 10,
	abreGrupo,
	llegaOpcion: eligeOpcion - 10,
	eligeOpcion,
	llegaCargar: pulsaCargar - 12,
	pulsaCargar,
	seVaCatalogo: pulsaCargar + 4,
	montaActa: pulsaCargar + 28,
	cursorSale: pulsaCargar + 34,
};

D[2] = Math.max(D[1] + dura(T[1]), LLEGADA.montaActa + 12);
D[3] = D[2] + dura(T[2]);
D[4] = D[3] + dura(T[3]);
D[5] = D[4] + dura(T[4]);
D[6] = D[5] + dura(T[5]);
D[7] = D[6] + dura(T[6]);

export const TARJETA = D[7] + dura(T[7]);

export const PAPEL_T = {
	seVaLaCascara: D[3] - 40,
	entraLaHoja: D[3],
	aA: D[4] - 16,
	aB: D[6] - 16,
};

export const INFORMES = entradaDe(MENU_DIRECTIVO, 'Informes').seccion;
const yInformes = alturaEnMenu(MENU_DIRECTIVO, INFORMES, null, null);
const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const HOJA_ENTERA = encuadreDeUnaHoja(HOJA_NIV);
export const HOJA_A = acercamientoAUnaHoja(HOJA_NIV, CERCA_A);
export const HOJA_B = acercamientoAUnaHoja(HOJA_NIV, CERCA_B);

const enPlano = (p: { x: number; y: number; escala: number }, r: { x: number; y: number; ancho: number; alto: number }) => ({
	x: p.x + r.x * p.escala, y: p.y + r.y * p.escala, ancho: r.ancho * p.escala, alto: r.alto * p.escala, radio: 6,
});
const ANCHO_DENTRO = HOJA_NIV.ancho - HN.pad * 2;
const primeraQueDiscrepa = SECCION_A.findIndex(discrepa);

export const FOCOS = {
	informes: enElFotograma({ x: 0, y: yInformes, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	configurador: enElFotograma(delCatalogo(rectanguloDelConfigurador(true))),
	/** El selector «2026 · Periodo 4» de la barra: el acta usa ese periodo, no lo pregunta. */
	selector: enElFotograma(rectanguloDeMando('selector')),
	aviso: enElFotograma(enLaCascara(rectanguloDelAviso())),
	reglaYA: enPlano(HOJA_A, { x: HN.pad, y: Y_REGLA, ancho: ANCHO_DENTRO, alto: Y_FILAS_A + HN.fila * SECCION_A.length - Y_REGLA }),
	asterisco: enPlano(HOJA_A, { x: HN.pad, y: Y_FILAS_A + HN.fila * primeraQueDiscrepa, ancho: ANCHO_DENTRO, alto: HN.fila * 2 + (SECCION_A.length - primeraQueDiscrepa - 2) * HN.fila + HN.pie }),
	seccionB: enPlano(HOJA_B, { x: HN.pad, y: Y_B, ancho: ANCHO_DENTRO, alto: HN.banda + HN.notaB + HN.cab + HN.fila * SECCION_B.length }),
	firmas: enPlano(HOJA_B, { x: HN.pad + 30, y: Y_FIRMAS + 22, ancho: ANCHO_DENTRO - 60, alto: 40 }),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	informes: { x: 150, y: yInformes + MEDIDAS.seccion / 2 },
	familia: centro(delCatalogo(PASTILLAS[CIERRE_DE_ANO])),
	ficha: centro(delCatalogo(rectanguloDeFichaEnContenido(ACTA_NIVELACION))),
	grupo: centro(delCatalogo(rectanguloDelSelectorDeGrupo())),
	opcion: centro(delCatalogo(rectanguloDeOpcion(OPCION_9B))),
	cargar: centro(delCatalogo(rectanguloDeCargar(true))),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Informes', url: 'micolegio.micolevirtual.com/up2/' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes ▸ Cierre de año', url: '/informes' };
const EN_EL_ACTA = { ubicacion: 'Menú ▸ Informes ▸ Acta de nivelación', url: `/informes/acta-nivelacion/${GRUPO_9B_ID}` };

const DONDE: Pick<Paso, 'ubicacion' | 'url' | 'foco' | 'focoHasta'>[] = [
	{ ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ ...EN_INFORMES, foco: FOCOS.selector },
	{ ...EN_EL_ACTA, foco: FOCOS.aviso, focoHasta: PAPEL_T.seVaLaCascara - 4 },
	{ ...EN_EL_ACTA },
	{ ...EN_EL_ACTA, foco: FOCOS.reglaYA },
	{ ...EN_EL_ACTA, foco: FOCOS.asterisco, focoHasta: PAPEL_T.aB - 4 },
	{ ...EN_EL_ACTA, foco: FOCOS.seccionB },
	{ ...EN_EL_ACTA, foco: FOCOS.firmas },
];

export const PASOS: Paso[] = T.map((t, i) => ({ desde: D[i], ...t, ...DONDE[i] }));

export const CLAVE = 'cierre-8-acta-nivelacion';
export const TITULO = 'El acta de nivelación';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Informes, Cierre de año' },
	{ desde: LLEGADA.montaActa, titulo: 'Antes de firmarla' },
	{ desde: PAPEL_T.aA, titulo: 'Sección A: la regla y el asterisco' },
	{ desde: PAPEL_T.aB, titulo: 'Sección B: la recuperación del año' },
];

export const CIERRE: Cierre = {
	hiciste: 'Sacaste el acta de nivelación y recuperación de 9°B.',
	seVe: `La A con la regla vigente y su asterisco explicado; la B con la nota escrita: ${SECCION_B[0].recuperacion}.`,
	voz: 'El acta queda lista para firmar.',
};

const VOZ_TARJETA = segundosDeVoz(CIERRE.voz!);
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Los focos de cerca sólo se encienden cuando su plano ya está puesto. */
if (PASOS[4].desde < PAPEL_T.aA + 12 || PASOS[6].desde < PAPEL_T.aB + 12) {
	throw new Error('Guion: un foco de cerca se enciende antes de que su plano esté quieto.');
}
