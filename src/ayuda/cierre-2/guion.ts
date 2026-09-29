import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import {
	EL_QUE_SE_CIERRA, YEAR_ID, enLaCascara, rectDeLaFila, rectDeLaLista, rectDeLosCeros, rectDelAviso, rectDelBotonCerrar,
	rectDelMando, rectDelMas, rectDelMenuMas, rectDelPonerEnCurso, rectDelTramo,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 2 DE 8: «CERRAR EL PERIODO: EL SEMÁFORO». Para rectoría y coordinación.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LO QUE ENSEÑA (rehecho el 2026-09-29, con voz)
 *
 *     El semáforo de cuatro tramos por periodo (Calificando | + nivelando | Nivelando | Cerrado),
 *     el diálogo «Cerrar el periodo 2 de 2026» con casillas vacías, y las tres advertencias de
 *     ADVERTENCIAS-AYUDA.md: la casilla de los ceros (roja: no se deshace), «Poner en curso» (no
 *     pregunta) y «Eliminar periodo» (roja: no hay restaurar).
 *
 * LOS TIEMPOS SE ENCADENAN SOLOS: cada paso empieza cuando el anterior terminó de decirse
 * (`dura()`, la misma cuenta que la puerta), y los clics cuelgan de los pasos. Si cambia un texto,
 * el vídeo se reacomoda sin tocar un número.
 * ────────────────────────────────────────────────────────────────────────────────────────────
 */

export const FPS = 30;

const CONFIG = entradaDe(MENU_DIRECTIVO, 'Configuración');
const EL_COLEGIO = entradaDe(MENU_DIRECTIVO, 'Configuración', 'El colegio');
export const SECCION_CONFIG = CONFIG.seccion;
export const HIJA_EL_COLEGIO = EL_COLEGIO.hija!;

/** La fila de otro periodo, la del 3: su «Poner en curso» y su «⋯». */
export const OTRA_FILA = 2;

/* ── Los textos, antes que los tiempos: los tiempos salen de lo que tardan en decirse ─────── */

type Texto = { texto: string; voz?: string; rojo?: boolean };

const T: Texto[] = [
	{ texto: 'Los periodos están en Configuración, El colegio.' },
	{ texto: 'Cuatro tramos: «Calificando», «+ nivelando», «Nivelando» y «Cerrado».', voz: 'Cuatro tramos: calificando, más nivelando, nivelando y cerrado.' },
	{ texto: 'Cerrar el periodo es pasarlo a «Nivelando».' },
	{ texto: 'Antes te dice quién debe notas.' },
	{ texto: 'No marques «Poner en cero» a ciegas: no se deshace.', rojo: true },
	{ texto: 'Cerrar corta a la vez notas y asistencia.' },
	{ texto: 'El 2 queda en «Nivelando»: sólo se nivela.' },
	{ texto: '«Poner en curso» no pregunta: cambia el colegio entero.' },
	{ texto: 'No elimines un periodo: no se restaura.', rojo: true },
]

/** Lo que dura un paso: lo mismo que exige `compruebaElGuion`. */
const dura = (t: Texto): number => {
	/* Como la puerta: con `tools/voz.mjs` cargando el guion, la voz todavía no manda. */
	const voz = (globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ ? null : segundosDeVoz(t.voz ?? t.texto);
	return (voz === null ? fotogramasDeLectura(t.texto, FPS) : RETRASO_VOZ + Math.ceil(voz * FPS) + RESPIRO_VOZ) + (t.rojo ? FPS : 0);
};

/* ── ACTO 1: la llegada ───────────────────────────────────────────────────────────────────── */

export const LLEGADA = {
	cursorEntra: 12,
	llegaConfig: 30,
	pulsaConfig: 36,
	abreConfig: 38,
	llegaColegio: 60,
	pulsaColegio: 70,
	montaColegio: 74,
};

/* ── Los arranques de cada paso, encadenados ──────────────────────────────────────────────── */

const D: number[] = [];
D[0] = 8;
/* El 2 señala el mando: la fila tiene que haber entrado (unos 40 fotogramas tras montar). */
D[1] = Math.max(D[0] + dura(T[0]), LLEGADA.montaColegio + 40);
D[2] = D[1] + dura(T[1]);

const pulsaNivelando = D[2] + 22;
const abreDialogo = pulsaNivelando + 6;
/** «Mirando qué falta por calificar…»: lo que tarda en contestar. */
const cargaHasta = abreDialogo + 24;

D[3] = Math.max(D[2] + dura(T[2]), cargaHasta + 6);
D[4] = D[3] + dura(T[3]);
D[5] = D[4] + dura(T[4]);

/** El clic en «Cerrar el periodo 2» cae al final de su paso, y el siguiente empieza con la fila ya cambiada. */
const DEL_CLIC_AL_PASO = 24;
const pulsaCerrar = D[5] + dura(T[5]) - DEL_CLIC_AL_PASO;
D[6] = pulsaCerrar + DEL_CLIC_AL_PASO;
D[7] = D[6] + dura(T[6]);
D[8] = D[7] + dura(T[7]);

export const TARJETA = D[8] + dura(T[8]);

export const CIERRE: Cierre = {
	hiciste: 'Cerraste el periodo 2 sin poner en cero lo que faltaba.',
	seVe: 'En su fila: «Profesores: nivelar lo perdido y tocar definitivas.»',
	despues: 'Siguiente, 3 de 8: nivelar no es corregir.',
};

/** La tarjeta dura lo que su voz, y nunca menos de cuatro segundos. */
const VOZ_TARJETA = segundosDeVoz(CIERRE.despues!);
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);

export const CIERRE_T = {
	llegaNivelando: pulsaNivelando - 10,
	pulsaNivelando,
	abreDialogo,
	cargaHasta,
	llegaCerrar: pulsaCerrar - 12,
	pulsaCerrar,
	/** El servidor contesta, el diálogo se va y la fila cambia de tramo. */
	cierraDialogo: pulsaCerrar + 16,
	cambiaLaFila: pulsaCerrar + 20,
	/** El puntero se posa en «Poner en curso» del 3, sin pulsarlo. */
	llegaPoner: D[7] + 16,
	/** Y abre el «⋯» del 3 para enseñar «Eliminar periodo 3», sin pulsarlo. */
	llegaMas: D[8] + 12,
	pulsaMas: D[8] + 18,
	cursorSale: TARJETA - 4,
};

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	config: { x: 150, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, null, null) + MEDIDAS.seccion / 2 },
	colegio: { x: 150, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, HIJA_EL_COLEGIO, SECCION_CONFIG) + MEDIDAS.hija / 2 },
	nivelando: centro(enLaCascara(rectDelTramo(EL_QUE_SE_CIERRA, 'nivelando'))),
	cerrar: centro(rectDelBotonCerrar()),
	poner: centro(enLaCascara(rectDelPonerEnCurso(OTRA_FILA))),
	mas: centro(enLaCascara(rectDelMas(OTRA_FILA))),
};

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 6) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });
const juntos = (a: { x: number; y: number; ancho: number; alto: number }, b: { x: number; y: number; ancho: number; alto: number }) => {
	const x = Math.min(a.x, b.x);
	const y = Math.min(a.y, b.y);
	return { x, y, ancho: Math.max(a.x + a.ancho, b.x + b.ancho) - x, alto: Math.max(a.y + a.alto, b.y + b.alto) - y };
};

export const FOCOS = {
	config: enElFotograma({ x: 0, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	mando: enElFotograma(holgado(enLaCascara(rectDelMando(EL_QUE_SE_CIERRA)))),
	nivelando: enElFotograma(holgado(enLaCascara(rectDelTramo(EL_QUE_SE_CIERRA, 'nivelando')), 4)),
	lista: enElFotograma(rectDeLaLista()),
	ceros: enElFotograma(rectDeLosCeros()),
	aviso: enElFotograma(rectDelAviso()),
	fila: enElFotograma(enLaCascara(rectDeLaFila(EL_QUE_SE_CIERRA))),
	poner: enElFotograma(holgado(enLaCascara(rectDelPonerEnCurso(OTRA_FILA)), 5)),
	eliminar: enElFotograma(holgado(enLaCascara(juntos(rectDelMas(OTRA_FILA), rectDelMenuMas(OTRA_FILA))), 5)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_PERIODOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Periodos', url: `/colegio/${YEAR_ID}/periodos` };

const DONDE: Pick<Paso, 'ubicacion' | 'url' | 'foco' | 'focoHasta'>[] = [
	{ ...EN_EL_MENU, foco: FOCOS.config, focoHasta: LLEGADA.pulsaConfig + 20 },
	{ ...EN_PERIODOS, foco: FOCOS.mando },
	{ ...EN_PERIODOS, foco: FOCOS.nivelando, focoHasta: pulsaNivelando + 6 },
	{ ...EN_PERIODOS, foco: FOCOS.lista },
	{ ...EN_PERIODOS, foco: FOCOS.ceros },
	{ ...EN_PERIODOS, foco: FOCOS.aviso, focoHasta: pulsaCerrar - 14 },
	{ ...EN_PERIODOS, foco: FOCOS.fila },
	{ ...EN_PERIODOS, foco: FOCOS.poner },
	{ ...EN_PERIODOS, foco: FOCOS.eliminar },
];

export const PASOS: Paso[] = T.map((t, i) => ({ desde: D[i], ...t, ...DONDE[i] }));

export const CLAVE = 'cierre-2-candados';

export const TITULO = 'Cerrar el periodo: el semáforo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Configuración, El colegio' },
	{ desde: D[1], titulo: 'El semáforo: cuatro tramos' },
	{ desde: D[2], titulo: 'Cerrar: pasar a «Nivelando»' },
	{ desde: D[6], titulo: 'Después, y lo que no se toca' },
];


compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El diálogo tiene que estar abierto y cargado mientras se habla de él, y cerrarse antes del paso 9. */
if (D[3] < cargaHasta || CIERRE_T.cambiaLaFila > D[6] || pulsaCerrar < D[5] + 20) {
	throw new Error('Guion: los pasos del diálogo tienen que caer con el diálogo abierto, y la fila cambiar antes del paso 7.');
}
