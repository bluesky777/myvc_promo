import { Punto } from '../../comunes/Cursor';
import { rectanguloDeMando } from '../BarraDeHoy';
import { ClaveFamilia, impresoDe } from '../cierre-6/datos-catalogo';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import { EN_EL_MENU as EN_EL_MENU_INFORMES, EN_INFORMES, FOCO_INFORMES, LLEGADA as LLEGADA_INFORMES, PUNTOS_DE_LLEGADA, foco, holgura, punto, union } from '../informes/Comun';
import { Ajustes, EstadoDelCatalogo, FilaDePila, disponer, rectDeFicha, rectDePastilla } from '../informes/datos';
import {
	EL_QUE_SE_CIERRA, YEAR_ID, enLaCascara, rectDeLaFila, rectDeLaLista, rectDeLosCeros, rectDelAviso, rectDelBotonCerrar,
	rectDelMando, rectDelPonerEnCurso, rectDelTramo,
} from './datos-periodos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ENTREGA DE NOTAS: BLOQUEAR Y QUÉ IMPRIMIR». El vídeo principal de la serie informes, para el día
 * de la entrega (lo pidió Joseth; el contenido está en ADVERTENCIAS-AYUDA.md, «Vídeo nuevo»).
 *
 * DOS ACTOS, cada uno con sus propias piezas:
 *
 *   A. BLOQUEAR LA EDICIÓN DOCENTE. Configuración ▸ El colegio ▸ Periodos: el semáforo del periodo
 *      3 pasa a «Nivelando», el diálogo de cierre dice quién debe notas, la casilla de los ceros se
 *      deja sin marcar (lo irreversible, en rojo) y se cierra. Y la advertencia: «Poner en curso» no
 *      pide confirmación. Las piezas son las de `cierre-2` (copiadas con el periodo 3 en curso: ver
 *      `datos-periodos.ts`).
 *
 *   B. LO QUE SE IMPRIME. Menú ▸ Informes, con las piezas de `informes/`. Primero la advertencia
 *      clave: boletines y semáforo NO preguntan el periodo, usan el del selector de arriba. Después
 *      el catálogo por familias: el boletín del periodo; si es el 4.º, el boletín final; si es el 3.º,
 *      «Nota que necesita en el periodo 4»; los puestos por periodo y por año; la asistencia de
 *      padres; y la pila, para imprimirlo todo de una vez.
 *
 * EL ACTO B VA EN SU PROPIO RELOJ: la `Pantalla` de informes entra, pulsa Informes y monta el
 * catálogo en fotogramas fijos (`informes/Comun`, `LLEGADA`). Así que la escena lo mete en una
 * `<Sequence from={ORIGEN_B}>` y todo lo de B (`B`, `PUNTOS_B`, `estadoB`) va en fotogramas LOCALES;
 * los pasos, que son del vídeo entero, suman `ORIGEN_B`.
 *
 * LOS TIEMPOS SALEN DE LA VOZ, como en `cierre-2`: cada paso dura lo que tarda en decirse (la
 * puerta de `compruebaElGuion`), y los clics se cuelgan de esos pasos.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */

export const FPS = 30;

/* ── Los textos ────────────────────────────────────────────────────────────────────────────── */

type Texto = { texto: string; voz?: string; rojo?: boolean };

const T: Texto[] = [
	/* A. Bloquear */
	{ texto: 'Primero, bloquea las notas: Configuración, El colegio.' },
	{ texto: 'En su semáforo, pasa el periodo a «Nivelando» o a «Cerrado».' },
	{ texto: 'Antes te dice quién debe notas.' },
	{ texto: 'No marques «Poner en cero» a ciegas: no se deshace.', rojo: true },
	{ texto: 'Cerrarlo corta a la vez notas y asistencia.' },
	{ texto: 'El 3 queda en «Nivelando»: sólo se nivela.' },
	{ texto: '«Poner en curso» no pregunta: en la entrega, no lo toques.' },
	/* B. Imprimir */
	{ texto: 'Después, en Informes, lo que se imprime.' },
	{ texto: 'Boletines y semáforo usan el periodo de arriba: compruébalo.' },
	{ texto: 'El «Boletín del periodo», para cada familia.' },
	{ texto: 'Si es el cuarto periodo, también el «Boletín final».' },
	{ texto: 'Si es el tercero, «Nota que necesita en el periodo 4».', voz: 'Si es el tercero, la nota que necesita en el periodo cuatro.' },
	{ texto: 'Y los puestos, por periodo y por año.' },
	{ texto: '«Asistencia de padres»: la planilla de firmas.' },
	{ texto: 'Añádelo todo a la pila: sale en una sola impresión.' },
];

/** Lo que dura un paso: su voz entera (o la lectura, si aún no hay voz) y el segundo de más del rojo. */
const dura = (t: Texto): number => {
	/* Como la puerta: con `tools/voz.mjs` cargando el guion, la voz todavía no manda. */
	const voz = (globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ ? null : segundosDeVoz(t.voz ?? t.texto);
	return (voz === null ? fotogramasDeLectura(t.texto, FPS) : RETRASO_VOZ + Math.ceil(voz * FPS) + RESPIRO_VOZ) + (t.rojo ? FPS : 0);
};

/* ── A. Bloquear: Configuración ▸ El colegio ▸ Periodos ────────────────────────────────────── */

const CONFIG = entradaDe(MENU_DIRECTIVO, 'Configuración');
const EL_COLEGIO = entradaDe(MENU_DIRECTIVO, 'Configuración', 'El colegio');
export const SECCION_CONFIG = CONFIG.seccion;
export const HIJA_EL_COLEGIO = EL_COLEGIO.hija!;
/** La fila del periodo 4: la de «Poner en curso», que en la entrega no se toca. */
export const OTRA_FILA = EL_QUE_SE_CIERRA + 1;

export const LLEGADA = {
	cursorEntra: 12,
	llegaConfig: 30,
	pulsaConfig: 36,
	abreConfig: 38,
	llegaColegio: 60,
	pulsaColegio: 70,
	montaColegio: 74,
};

const D: number[] = [];
D[0] = 8;
D[1] = Math.max(D[0] + dura(T[0]), LLEGADA.montaColegio + 40);
/* El clic en «Nivelando» cae al final de la frase que lo pide, y el diálogo se abre detrás. */
const pulsaNivelando = D[1] + dura(T[1]) - 20;
const abreDialogo = pulsaNivelando + 6;
const cargaHasta = abreDialogo + 24;
D[2] = Math.max(D[1] + dura(T[1]), cargaHasta + 6);
D[3] = D[2] + dura(T[2]);
D[4] = D[3] + dura(T[3]);
/* «Cerrar el periodo 3» se pulsa al final del paso 5: el diálogo se va y la fila cambia antes del 6. */
const DEL_CLIC_AL_PASO = 24;
const pulsaCerrar = D[4] + dura(T[4]) - DEL_CLIC_AL_PASO;
D[5] = pulsaCerrar + DEL_CLIC_AL_PASO;
D[6] = D[5] + dura(T[5]);

export const CIERRE_T = {
	llegaMando: D[1] + 10,
	llegaNivelando: pulsaNivelando - 12,
	pulsaNivelando,
	abreDialogo,
	cargaHasta,
	llegaCerrar: pulsaCerrar - 12,
	pulsaCerrar,
	/** El servidor contesta, el diálogo se va y la fila cambia de tramo. */
	cierraDialogo: pulsaCerrar + 16,
	cambiaLaFila: pulsaCerrar + 20,
	/** El puntero se posa en «Poner en curso» del 4, sin pulsarlo. */
	llegaPoner: D[6] + 18,
};

/* ── B. Imprimir: Menú ▸ Informes, en fotogramas LOCALES ──────────────────────────────────── */

/** Cuándo entra la pantalla de Informes. Hasta aquí, la de Periodos; se cruzan en `CRUCE` fotogramas. */
export const INICIO_B = D[6] + dura(T[6]);
export const CRUCE = 12;
/** El fotograma 0 del reloj de B: la pantalla de Informes empieza a entrar `CRUCE` antes que su paso. */
export const ORIGEN_B = INICIO_B - CRUCE;

const L: number[] = [];
L[7] = CRUCE;
L[8] = L[7] + Math.max(dura(T[7]), LLEGADA_INFORMES.monta + 30 - L[7]);
L[9] = L[8] + dura(T[8]);
/* Cada paso de B pulsa algo; el paso dura su voz, o lo que tardan sus clics si es más. */
const CLICS_DE_UN_PASO = 76;
L[10] = L[9] + Math.max(dura(T[9]), 48);
L[11] = L[10] + Math.max(dura(T[10]), CLICS_DE_UN_PASO);
L[12] = L[11] + Math.max(dura(T[11]), CLICS_DE_UN_PASO);
L[13] = L[12] + dura(T[12]);
L[14] = L[13] + Math.max(dura(T[13]), CLICS_DE_UN_PASO);
const FIN_B = L[14] + Math.max(dura(T[14]), 22 + 2 + 40 + 10 + 45);

/** Los clics de B, en fotogramas locales. Llegar y pulsar, con 12 fotogramas entre los dos. */
export const B = {
	llegaFichaBoletin: L[9] + 14,
	pulsaFichaBoletin: L[9] + 26,
	llegaPastillaCierre: L[10] + 8,
	pulsaPastillaCierre: L[10] + 20,
	llegaFichaFinal: L[10] + 40,
	pulsaFichaFinal: L[10] + 52,
	llegaPastillaSeg: L[11] + 8,
	pulsaPastillaSeg: L[11] + 20,
	llegaFichaFaltante: L[11] + 40,
	pulsaFichaFaltante: L[11] + 52,
	llegaPastillaAsis: L[13] + 8,
	pulsaPastillaAsis: L[13] + 20,
	llegaFichaPadres: L[13] + 40,
	pulsaFichaPadres: L[13] + 52,
	llegaApilar: L[14] + 10,
	pulsaApilar: L[14] + 22,
	cursorSale: FIN_B - 20,
};

export const TARJETA = ORIGEN_B + FIN_B;

/* ── El catálogo en cada fotograma (local) de B ───────────────────────────────────────────── */

export const BOLETIN = impresoDe('boletin-detallado');
export const FINAL = impresoDe('boletin-final');
export const FALTANTE = impresoDe('nota-faltante');
export const PUESTOS_PERIODO = impresoDe('puestos-periodo');
export const PUESTOS_ANO = impresoDe('puestos-ano');
export const PADRES = impresoDe('asistencia-padres');

const AJUSTES: Ajustes = { hoja: 0 };
const FILA_PADRES: FilaDePila = { nombre: PADRES.nombre, etiquetas: [] };

export function familiaB(b: number): ClaveFamilia | 'todo' {
	if (b >= B.pulsaPastillaAsis) { return 'asistencia'; }
	if (b >= B.pulsaPastillaSeg) { return 'seguimiento'; }
	if (b >= B.pulsaPastillaCierre) { return 'cierre'; }
	return 'todo';
}

export function elegidaB(b: number): { clave: string | null; desde: number } {
	if (b >= B.pulsaFichaPadres) { return { clave: PADRES.clave, desde: B.pulsaFichaPadres }; }
	if (b >= B.pulsaFichaFaltante) { return { clave: FALTANTE.clave, desde: B.pulsaFichaFaltante }; }
	if (b >= B.pulsaFichaFinal) { return { clave: FINAL.clave, desde: B.pulsaFichaFinal }; }
	if (b >= B.pulsaFichaBoletin) { return { clave: BOLETIN.clave, desde: B.pulsaFichaBoletin }; }
	return { clave: null, desde: 0 };
}

/** Cuándo se pintó la lista por última vez: al pulsar cada familia. */
export function listaDesdeB(b: number): number | undefined {
	const pulsadas = [B.pulsaPastillaCierre, B.pulsaPastillaSeg, B.pulsaPastillaAsis].filter((f) => b >= f);
	return pulsadas.length ? pulsadas[pulsadas.length - 1] : undefined;
}

export const pilaB = (b: number): FilaDePila[] => (b >= B.pulsaApilar ? [FILA_PADRES] : []);

export const estadoB = (b: number): EstadoDelCatalogo => ({
	consulta: '',
	familia: familiaB(b),
	elegida: elegidaB(b).clave,
	valores: {},
	ajustes: AJUSTES,
	pila: pilaB(b),
});

export function senalB(b: number): string | null {
	const entre = (a: number, z: number) => b >= a && b < z;
	if (entre(B.llegaFichaBoletin, B.pulsaFichaBoletin + 8)) { return `ficha-${BOLETIN.clave}`; }
	if (entre(B.llegaPastillaCierre, B.pulsaPastillaCierre + 8)) { return 'pastilla-cierre'; }
	if (entre(B.llegaFichaFinal, B.pulsaFichaFinal + 8)) { return `ficha-${FINAL.clave}`; }
	if (entre(B.llegaPastillaSeg, B.pulsaPastillaSeg + 8)) { return 'pastilla-seguimiento'; }
	if (entre(B.llegaFichaFaltante, B.pulsaFichaFaltante + 8)) { return `ficha-${FALTANTE.clave}`; }
	if (entre(B.llegaPastillaAsis, B.pulsaPastillaAsis + 8)) { return 'pastilla-asistencia'; }
	if (entre(B.llegaFichaPadres, B.pulsaFichaPadres + 8)) { return `ficha-${PADRES.clave}`; }
	if (entre(B.llegaApilar, B.pulsaApilar + 4)) { return 'apilar'; }
	return null;
}

/** El aviso verde tapa la tira de la pila mientras está: el foco de la pila espera a que se vaya. */
export const AVISO_PILA = { desde: B.pulsaApilar + 2, dura: 40, texto: `«${PADRES.nombre}» va en la pila. Son 1.` };

/* ── Dónde cae cada cosa ───────────────────────────────────────────────────────────────────── */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 6) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

/* Las disposiciones del catálogo justo antes de cada clic: el foco y el puntero salen de ellas. */
const D_TODO = disponer(estadoB(B.llegaFichaBoletin));
const D_CIERRE = disponer(estadoB(B.llegaFichaFinal));
const D_SEG = disponer(estadoB(B.llegaFichaFaltante));
const D_ASIS = disponer(estadoB(B.llegaFichaPadres));
const D_APILAR = disponer(estadoB(B.llegaApilar));
const D_APILADA = disponer(estadoB(B.pulsaApilar));

if (!D_APILAR.conf?.apilar || !D_APILADA.pila) {
	throw new Error('Guion: «Asistencia de padres» tiene que poder añadirse a la pila, y la pila salir arriba.');
}

export const PUNTOS_A = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	config: { x: 150, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, null, null) + MEDIDAS.seccion / 2 },
	colegio: { x: 150, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, HIJA_EL_COLEGIO, SECCION_CONFIG) + MEDIDAS.hija / 2 },
	mando: centro(enLaCascara(rectDelTramo(EL_QUE_SE_CIERRA, 'calificando'))),
	nivelando: centro(enLaCascara(rectDelTramo(EL_QUE_SE_CIERRA, 'nivelando'))),
	cerrar: centro(rectDelBotonCerrar()),
	poner: centro(enLaCascara(rectDelPonerEnCurso(OTRA_FILA))),
};

const P = {
	boletin: punto(rectDeFicha(D_TODO, BOLETIN.clave), 30),
	cierre: punto(rectDePastilla(D_TODO, 'cierre')),
	final: punto(rectDeFicha(D_CIERRE, FINAL.clave), 30),
	seg: punto(rectDePastilla(D_CIERRE, 'seguimiento')),
	faltante: punto(rectDeFicha(D_SEG, FALTANTE.clave), 30),
	asis: punto(rectDePastilla(D_SEG, 'asistencia')),
	padres: punto(rectDeFicha(D_ASIS, PADRES.clave), 30),
	apilar: punto(D_APILAR.conf.apilar, 40),
};

/** El puntero de B, en fotogramas locales. */
export const PUNTOS_B: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: B.llegaFichaBoletin - 18, x: P.boletin.x + 80, y: P.boletin.y + 120 },
	{ frame: B.llegaFichaBoletin, ...P.boletin },
	{ frame: B.pulsaFichaBoletin + 14, ...P.boletin },
	{ frame: B.llegaPastillaCierre - 16, ...P.boletin },
	{ frame: B.llegaPastillaCierre, ...P.cierre },
	{ frame: B.pulsaPastillaCierre + 4, ...P.cierre },
	{ frame: B.llegaFichaFinal, ...P.final },
	{ frame: B.pulsaFichaFinal + 14, ...P.final },
	{ frame: B.llegaPastillaSeg - 16, ...P.final },
	{ frame: B.llegaPastillaSeg, ...P.seg },
	{ frame: B.pulsaPastillaSeg + 4, ...P.seg },
	{ frame: B.llegaFichaFaltante, ...P.faltante },
	{ frame: B.pulsaFichaFaltante + 14, ...P.faltante },
	{ frame: B.llegaPastillaAsis - 16, ...P.faltante },
	{ frame: B.llegaPastillaAsis, ...P.asis },
	{ frame: B.pulsaPastillaAsis + 4, ...P.asis },
	{ frame: B.llegaFichaPadres, ...P.padres },
	{ frame: B.pulsaFichaPadres + 12, ...P.padres },
	{ frame: B.llegaApilar - 16, ...P.padres },
	{ frame: B.llegaApilar, ...P.apilar },
	{ frame: B.pulsaApilar + 16, ...P.apilar },
	{ frame: B.cursorSale - 4, x: P.apilar.x - 260, y: P.apilar.y + 200 },
];

export const CLICS_B = [
	LLEGADA_INFORMES.pulsaInformes, B.pulsaFichaBoletin, B.pulsaPastillaCierre, B.pulsaFichaFinal, B.pulsaPastillaSeg, B.pulsaFichaFaltante,
	B.pulsaPastillaAsis, B.pulsaFichaPadres, B.pulsaApilar,
];

export const FOCOS = {
	config: enElFotograma({ x: 0, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	mando: enElFotograma(holgado(enLaCascara(rectDelMando(EL_QUE_SE_CIERRA)))),
	lista: enElFotograma(rectDeLaLista()),
	ceros: enElFotograma(rectDeLosCeros()),
	aviso: enElFotograma(rectDelAviso()),
	fila: enElFotograma(enLaCascara(rectDeLaFila(EL_QUE_SE_CIERRA))),
	poner: enElFotograma(holgado(enLaCascara(rectDelPonerEnCurso(OTRA_FILA)), 5)),
	informes: FOCO_INFORMES,
	periodo: { ...enElFotograma(holgura(rectanguloDeMando('selector'), 4)), radio: 20 },
	boletin: foco(holgura(rectDeFicha(D_TODO, BOLETIN.clave), 6)),
	final: foco(holgura(rectDeFicha(D_CIERRE, FINAL.clave), 6)),
	faltante: foco(holgura(rectDeFicha(D_SEG, FALTANTE.clave), 6)),
	puestos: foco(holgura(union(rectDeFicha(D_SEG, PUESTOS_PERIODO.clave), rectDeFicha(D_SEG, PUESTOS_ANO.clave)), 6)),
	padres: foco(holgura(rectDeFicha(D_ASIS, PADRES.clave), 6)),
	pila: foco(holgura(D_APILADA.pila!.rect, 4)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_PERIODOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Periodos', url: `/colegio/${YEAR_ID}/periodos` };

/** Lo de B va en fotogramas locales: aquí se pasa al reloj del vídeo. */
const b = (f: number) => ORIGEN_B + f;

const DONDE: Pick<Paso, 'ubicacion' | 'url' | 'foco' | 'focoHasta'>[] = [
	{ ...EN_EL_MENU, foco: FOCOS.config, focoHasta: LLEGADA.pulsaConfig + 20 },
	{ ...EN_PERIODOS, foco: FOCOS.mando, focoHasta: pulsaNivelando + 4 },
	{ ...EN_PERIODOS, foco: FOCOS.lista },
	{ ...EN_PERIODOS, foco: FOCOS.ceros },
	{ ...EN_PERIODOS, foco: FOCOS.aviso, focoHasta: pulsaCerrar - 14 },
	{ ...EN_PERIODOS, foco: FOCOS.fila },
	{ ...EN_PERIODOS, foco: FOCOS.poner, focoHasta: ORIGEN_B - 4 },
	{ ...EN_EL_MENU_INFORMES, foco: FOCOS.informes, focoHasta: b(LLEGADA_INFORMES.pulsaInformes + 16) },
	{ ...EN_INFORMES, foco: FOCOS.periodo },
	{ ...EN_INFORMES, foco: FOCOS.boletin },
	{ ...EN_INFORMES, foco: FOCOS.final },
	{ ...EN_INFORMES, foco: FOCOS.faltante },
	{ ...EN_INFORMES, foco: FOCOS.puestos },
	{ ...EN_INFORMES, foco: FOCOS.padres },
	{ ...EN_INFORMES, foco: FOCOS.pila },
];

const DESDE = [...D.slice(0, 7), ...L.slice(7).map(b)];

export const PASOS: Paso[] = T.map((t, i) => ({ desde: DESDE[i], ...t, ...DONDE[i] }));

/**
 * Cuándo se enciende el foco, en los pasos en que lo que señala sale a mitad del rótulo: la ficha
 * después de pulsar su familia, el diálogo cuando ya cargó, la pila cuando ya tiene su fila.
 */
export const FOCO_DESDE: Record<number, number> = {
	2: cargaHasta + 6,
	5: CIERRE_T.cambiaLaFila + 4,
	10: b(B.pulsaPastillaCierre + 10),
	11: b(B.pulsaPastillaSeg + 10),
	13: b(B.pulsaPastillaAsis + 10),
	14: b(AVISO_PILA.desde + AVISO_PILA.dura + 10),
};

/* ── El vídeo ──────────────────────────────────────────────────────────────────────────────── */

export const CLAVE = 'entrega-de-notas';
export const TITULO = 'Entrega de notas: bloquear y qué imprimir';

export const CIERRE: Cierre = {
	hiciste: 'Cerraste el periodo 3 y sacaste lo que se entrega.',
	seVe: 'El 3 en «Nivelando», y en la pila lo que se imprime.',
	despues: 'Siguiente: la pila de impresión.',
};

const VOZ_TARJETA = segundosDeVoz(CIERRE.despues!);
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Bloquear: Configuración, El colegio' },
	{ desde: D[1], titulo: 'Cerrar el periodo: el semáforo' },
	{ desde: D[6], titulo: '«Poner en curso» no se toca' },
	{ desde: b(L[7]), titulo: 'Informes: el periodo de arriba' },
	{ desde: b(L[9]), titulo: 'Qué imprimir según el periodo' },
	{ desde: b(L[14]), titulo: 'La pila: todo de una vez' },
];

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Cada clic cae dentro del paso que lo cuenta, y el diálogo está abierto en los pasos que lo miran. */
const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (
	!dentro(pulsaNivelando, 1) || !dentro(pulsaCerrar, 4) || CIERRE_T.cambiaLaFila >= D[5] ||
	!dentro(b(B.pulsaFichaBoletin), 9) || !dentro(b(B.pulsaFichaFinal), 10) || !dentro(b(B.pulsaFichaFaltante), 11) ||
	!dentro(b(B.pulsaFichaPadres), 13) || !dentro(b(B.pulsaApilar), 14)
) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
if (DURACION > 75 * FPS) {
	throw new Error(`Guion: el vídeo dura ${Math.round(DURACION / FPS)} s y el tope del principal es 75 s.`);
}
