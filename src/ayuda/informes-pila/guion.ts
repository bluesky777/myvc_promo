import { Punto } from '../../comunes/Cursor';
import { ClaveFamilia, impresoDe } from '../cierre-6/datos-catalogo';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, foco, holgura, punto, union } from '../informes/Comun';
import { Ajustes, FilaDePila, GRUPOS, Valores, disponer, rectDeFicha, rectDePastilla } from '../informes/datos';
import { rectDeOpcion } from '../informes/Piezas';
import { enElContenido, rectAviso, rectImprimirTodo, rectVaciar, rectVolver } from './PilaEntera';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «LA PILA: TRECE GRUPOS, UNA IMPRESIÓN». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): «tope 20; mezclar vertical y apaisado sale todo en el papel del
 * primero». Las dos, confirmadas en el código:
 *   · `TOPE_DE_LA_PILA = 20` (`pila-de-impresion.ts:73`); la tira dice «13 de 20», y con la pila
 *     llena el botón avisa «La pila está llena: caben 20. Saca la pila o quita alguno.» y no añade.
 *   · `@page` es global: la pila entera fija la orientación de la PRIMERA fila
 *     (`pila-entera.ts:232`), y si hay más de un papel lo dice ANTES de imprimir con el aviso
 *     amarillo «La pila mezcla papeles distintos» (literal en `pila-entera.html`).
 *
 * Y lo que el vídeo cuenta además, también del código:
 *   · «Añadir a la pila de impresión» no navega (`anadirALaPila`): avisa «“Boletín del periodo” va
 *     en la pila. Son N.» y la tira sale arriba, pegada (`sticky`).
 *   · Cada fila lleva sus datos en palabras: «5°A · periodo 3».
 *   · El aspa de cada fila la quita; «Imprimir todo» es `window.print()` y NO vacía la pila; la
 *     pila se guarda en `localStorage` (por usuario y año), así que sobrevive a una recarga.
 *   · Añadir los trece es repetir el gesto trece veces: no hay «todos los grupos» para el boletín
 *     (sólo lo tienen puestos y la nota que necesita). El vídeo enseña dos y acorta el resto, y lo
 *     dice con la pastilla oscura.
 *
 * 52 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaFicha: 150,
	pulsaFicha: 164,
	llegaGrupo: 190,
	abreGrupo: 200,
	llegaOpcion: 216,
	eligeGrupo: 230,
	llegaApilar: 262,
	pulsaApilar: 276,
	llegaGrupo2: 374,
	abreGrupo2: 384,
	llegaOpcion2: 398,
	eligeGrupo2: 410,
	llegaApilar2: 426,
	pulsaApilar2: 440,
	/** Los once que faltan, uno cada diez fotogramas: la espera acortada. */
	rapido: 470,
	cadaUno: 10,
	llegaAula: 745,
	pulsaAula: 757,
	bajaDesde: 769,
	bajaHasta: 789,
	llegaPlanillas: 800,
	pulsaPlanillas: 812,
	llegaApilar3: 828,
	pulsaApilar3: 842,
	llegaVer: 883,
	pulsaVer: 897,
	llegaVolver: 1010,
	pulsaVolver: 1022,
	llegaQuitar: 1050,
	pulsaQuitar: 1064,
	llegaVer2: 1156,
	pulsaVer2: 1168,
	llegaImprimir: 1195,
	pulsaImprimir: 1207,
	cursorSale: 1400,
};

export const BOLETIN = impresoDe('boletin-detallado');
export const PLANILLAS = impresoDe('planillas-grupo');

/** Cuándo entra cada boletín en la pila: los dos a mano y los once acortados. */
export const ANADIDOS = GRUPOS.map((_, i) => (i === 0 ? T.pulsaApilar : i === 1 ? T.pulsaApilar2 : T.rapido + (i - 2) * T.cadaUno));
export const FIN_RAPIDO = ANADIDOS[ANADIDOS.length - 1];

const filaBoletin = (g: string): FilaDePila => ({ nombre: BOLETIN.nombre, etiquetas: [g, 'periodo 3'] });
const filaPlanillas: FilaDePila = { nombre: PLANILLAS.nombre, etiquetas: ['11°B'] };

export function pila(frame: number): { filas: FilaDePila[]; desde: number[] } {
	const filas: FilaDePila[] = [];
	const desde: number[] = [];
	GRUPOS.forEach((g, i) => {
		if (frame >= ANADIDOS[i]) { filas.push(filaBoletin(g)); desde.push(ANADIDOS[i]); }
	});
	if (frame >= T.pulsaApilar3 && frame < T.pulsaQuitar) { filas.push(filaPlanillas); desde.push(T.pulsaApilar3); }
	return { filas, desde };
}

export const enLaPilaEntera = (frame: number) => (frame >= T.pulsaVer && frame < T.pulsaVolver) || frame >= T.pulsaVer2;

export function grupo(frame: number): string | null {
	let g: string | null = frame >= T.eligeGrupo2 ? GRUPOS[1] : frame >= T.eligeGrupo ? GRUPOS[0] : null;
	GRUPOS.forEach((x, i) => { if (i >= 2 && frame >= ANADIDOS[i] - 4) { g = x; } });
	return g;
}

export const valores = (frame: number): Valores => ({ destinatario: 0, grupo: grupo(frame) });
export const elegida = (frame: number) => (frame >= T.pulsaPlanillas ? PLANILLAS.clave : frame >= T.pulsaFicha ? BOLETIN.clave : null);
export const familia = (frame: number): ClaveFamilia | 'todo' => (frame >= T.pulsaAula ? 'aula' : 'todo');

const ETIQUETAS = ['Mostrar foto', 'Firma del rector', 'Firma del titular', 'Mostrar rojos', 'Mostrar gráfico', 'Mostrar escalas', 'Notas pendientes del año'];
export function ajustes(frame: number): Ajustes {
	if (elegida(frame) === PLANILLAS.clave) {
		return { interruptores: [{ etiqueta: 'Mostrar foto', encendido: true }, { etiqueta: 'Sólo números en logros e indicadores', encendido: false }], hoja: 2 };
	}
	return { interruptores: ETIQUETAS.map((etiqueta, i) => ({ etiqueta, encendido: i !== 2 && i !== 6 })), hoja: 0 };
}

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const estado = (frame: number, desplazamiento = 0) => ({
	consulta: '',
	familia: familia(frame),
	elegida: elegida(frame),
	valores: valores(frame),
	ajustes: ajustes(frame),
	pila: pila(frame).filas,
	desplazamiento,
});

/** Cuánto baja la página para que el configurador de las planillas quepa entero. */
const SIN_BAJAR = disponer(estado(T.pulsaPlanillas));
export const BAJA = Math.max(0, Math.ceil(SIN_BAJAR.conf!.apilar!.y + SIN_BAJAR.conf!.apilar!.alto - 826));
export function desplazamiento(frame: number) {
	/* Antes de bajar, y desde que se abre la pila entera (al volver, el catálogo sale desde arriba). */
	if (frame < T.bajaDesde || frame >= T.pulsaVer) { return 0; }
	const t = Math.min(1, (frame - T.bajaDesde) / (T.bajaHasta - T.bajaDesde));
	return Math.round(BAJA * (t * t * (3 - 2 * t)));
}

export const estadoEn = (frame: number) => estado(frame, desplazamiento(frame));

const D_FICHA = disponer(estado(T.llegaFicha));
const D_GRUPO = disponer(estado(T.pulsaFicha));
const D_APILAR = disponer(estado(T.eligeGrupo));
const D_UNO = disponer(estado(T.pulsaApilar));
const D_GRUPO2 = disponer(estado(T.pulsaApilar2 - 60));
const D_TRECE = disponer(estado(FIN_RAPIDO));
const D_AULA = disponer(estado(T.llegaAula));
const D_PLANILLAS = disponer(estado(T.llegaPlanillas, BAJA));
const D_APILAR3 = disponer(estado(T.pulsaPlanillas, BAJA));
const D_QUITAR = disponer(estado(T.llegaQuitar));

export const FOCOS = {
	informes: FOCO_INFORMES,
	ficha: foco(holgura(rectDeFicha(D_FICHA, BOLETIN.clave), 6)),
	apilar: foco(holgura(D_APILAR.conf!.apilar!, 6)),
	otraVez: foco(holgura(union({ ...D_GRUPO2.conf!.campos.grupo!, y: D_GRUPO2.conf!.campos.grupo!.y - 26 }, D_GRUPO2.conf!.apilar!), 8)),
	cuenta: foco(holgura(union(D_TRECE.pila!.cuenta, D_TRECE.pila!.chips[12].rect), 6)),
	planillas: foco(holgura(union(rectDeFicha(D_PLANILLAS, PLANILLAS.clave), D_APILAR3.conf!.apilar!), 8)),
	aviso: foco(holgura(enElContenido(rectAviso()), 4)),
	quitar: foco(holgura(D_QUITAR.pila!.chips[13].rect, 5), 20),
	imprimir: foco(holgura(enElContenido(rectImprimirTodo()), 5)),
	vaciar: foco(holgura(enElContenido(rectVaciar()), 5)),
};

const grupoCampo = D_GRUPO.conf!.campos.grupo!;
const grupoCampo2 = D_GRUPO2.conf!.campos.grupo!;
const P = {
	ficha: punto(rectDeFicha(D_FICHA, BOLETIN.clave), 30),
	grupo: punto(grupoCampo, 60),
	opcion: punto(rectDeOpcion(grupoCampo, 0), -40),
	apilar: punto(D_APILAR.conf!.apilar!, 40),
	grupo2: punto(grupoCampo2, 60),
	opcion2: punto(rectDeOpcion(grupoCampo2, 1), -40),
	apilar2: punto(D_GRUPO2.conf!.apilar!, 40),
	aula: punto(rectDePastilla(D_AULA, 'aula')),
	planillas: punto(rectDeFicha(D_PLANILLAS, PLANILLAS.clave), 30),
	apilar3: punto(D_APILAR3.conf!.apilar!, 40),
	ver: punto(D_APILAR3.pila!.ver),
	volver: punto(enElContenido(rectVolver())),
	quitar: punto(D_QUITAR.pila!.chips[13].quitar),
	ver2: punto(disponer(estado(T.pulsaQuitar)).pila!.ver),
	imprimir: punto(enElContenido(rectImprimirTodo())),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 16, ...P.ficha },
	{ frame: T.llegaGrupo, ...P.grupo },
	{ frame: T.abreGrupo + 8, ...P.grupo },
	{ frame: T.llegaOpcion, ...P.opcion },
	{ frame: T.eligeGrupo + 6, ...P.opcion },
	{ frame: T.llegaApilar, ...P.apilar },
	{ frame: T.pulsaApilar + 40, ...P.apilar },
	{ frame: T.llegaGrupo2, ...P.grupo2 },
	{ frame: T.abreGrupo2 + 6, ...P.grupo2 },
	{ frame: T.llegaOpcion2, ...P.opcion2 },
	{ frame: T.eligeGrupo2 + 6, ...P.opcion2 },
	{ frame: T.llegaApilar2, ...P.apilar2 },
	{ frame: T.pulsaApilar2 + 30, ...P.apilar2 },
	{ frame: T.llegaAula - 30, ...P.apilar2 },
	{ frame: T.llegaAula - 12, x: P.aula.x + 60, y: P.aula.y + 40 },
	{ frame: T.llegaAula, ...P.aula },
	{ frame: T.pulsaAula + 14, ...P.aula },
	{ frame: T.llegaPlanillas, ...P.planillas },
	{ frame: T.pulsaPlanillas + 6, ...P.planillas },
	{ frame: T.llegaApilar3, ...P.apilar3 },
	{ frame: T.pulsaApilar3 + 12, ...P.apilar3 },
	{ frame: T.llegaVer, ...P.ver },
	{ frame: T.pulsaVer + 60, ...P.ver },
	{ frame: T.llegaVolver, ...P.volver },
	{ frame: T.pulsaVolver + 16, ...P.volver },
	{ frame: T.llegaQuitar, ...P.quitar },
	{ frame: T.pulsaQuitar + 30, ...P.quitar },
	{ frame: T.llegaVer2, ...P.ver2 },
	{ frame: T.pulsaVer2 + 10, ...P.ver2 },
	{ frame: T.llegaImprimir, ...P.imprimir },
	{ frame: T.pulsaImprimir + 40, ...P.imprimir },
	{ frame: T.cursorSale - 30, x: P.imprimir.x - 300, y: P.imprimir.y + 300 },
];

export const CLICS = [
	LLEGADA.pulsaInformes, T.pulsaFicha, T.abreGrupo, T.eligeGrupo, T.pulsaApilar, T.abreGrupo2, T.eligeGrupo2, T.pulsaApilar2, T.pulsaAula,
	T.pulsaPlanillas, T.pulsaApilar3, T.pulsaVer, T.pulsaVolver, T.pulsaQuitar, T.pulsaVer2, T.pulsaImprimir,
];

export function senal(frame: number): string | null {
	const entre = (a: number, b: number) => frame >= a && frame < b;
	if (entre(T.llegaFicha, T.pulsaFicha + 8)) { return `ficha-${BOLETIN.clave}`; }
	if (entre(T.llegaGrupo, T.abreGrupo) || entre(T.llegaGrupo2, T.abreGrupo2)) { return 'campo-grupo'; }
	if (entre(T.llegaApilar, T.pulsaApilar + 4) || entre(T.llegaApilar2, T.pulsaApilar2 + 4) || entre(T.llegaApilar3, T.pulsaApilar3 + 4)) { return 'apilar'; }
	if (entre(T.llegaAula, T.pulsaAula + 8)) { return 'pastilla-aula'; }
	if (entre(T.llegaPlanillas, T.pulsaPlanillas + 8)) { return `ficha-${PLANILLAS.clave}`; }
	if (entre(T.llegaVer, T.pulsaVer + 4) || entre(T.llegaVer2, T.pulsaVer2 + 4)) { return 'ver-pila'; }
	if (entre(T.llegaVolver, T.pulsaVolver + 4)) { return 'volver'; }
	if (entre(T.llegaQuitar, T.pulsaQuitar + 4)) { return 'quitar-13'; }
	if (entre(T.llegaImprimir, T.pulsaImprimir + 12)) { return 'imprimir-todo'; }
	return null;
}

export function desplegable(frame: number) {
	const opciones = GRUPOS.slice(0, 6);
	if (frame >= T.abreGrupo && frame < T.eligeGrupo + 4) {
		return { campo: 'grupo' as const, opciones, senalada: frame >= T.llegaOpcion ? 0 : null, elegida: frame >= T.eligeGrupo ? 0 : null, desde: T.abreGrupo };
	}
	if (frame >= T.abreGrupo2 && frame < T.eligeGrupo2 + 4) {
		return { campo: 'grupo' as const, opciones, senalada: frame >= T.llegaOpcion2 ? 1 : 0, elegida: frame >= T.eligeGrupo2 ? 1 : 0, desde: T.abreGrupo2 };
	}
	return null;
}

/** Los avisos verdes de «va en la pila», literales de `anadirALaPila`. */
export const AVISOS = [
	{ desde: T.pulsaApilar + 2, texto: `«${BOLETIN.nombre}» va en la pila. Son 1.` },
	{ desde: T.pulsaApilar2 + 2, texto: `«${BOLETIN.nombre}» va en la pila. Son 2.` },
	{ desde: T.pulsaApilar3 + 2, texto: `«${PLANILLAS.nombre}» va en la pila. Son 14.` },
];

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_PILA = { ubicacion: 'Menú ▸ Informes ▸ La pila', url: '/informes/pila' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'La pila junta varios informes en una sola impresión.', ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 135, texto: 'Elige el papel y el grupo, como siempre.', ...EN_INFORMES, foco: FOCOS.ficha, focoHasta: T.pulsaFicha + 16 },
	{ desde: 253, texto: '«Añadir a la pila» no te saca de aquí.', ...EN_INFORMES, foco: FOCOS.apilar, focoHasta: T.pulsaApilar - 10 },
	{ desde: 364, texto: 'Cambia el grupo y añade otra vez.', ...EN_INFORMES, foco: FOCOS.otraVez, focoHasta: T.pulsaApilar2 - 10 },
	{ desde: 458, texto: 'Así, grupo por grupo, hasta los trece.', ...EN_INFORMES },
	{ desde: 583, texto: '«13 de 20»: caben veinte; llena, ya no añade.', voz: 'Trece de veinte: caben veinte; llena, ya no añade.', ...EN_INFORMES, foco: FOCOS.cuenta },
	{ desde: 735, texto: 'Una planilla es apaisada: la pila mezclaría papeles.', ...EN_INFORMES, foco: FOCOS.planillas, focoHasta: T.pulsaApilar3 - 10 },
	{ desde: 873, texto: 'La pila avisa: todo saldría en el papel de la primera.', ...EN_LA_PILA, foco: FOCOS.aviso },
	{ desde: 1003, texto: 'Para los dos papeles, dos pilas: quita la planilla.', ...EN_INFORMES, foco: FOCOS.quitar, focoHasta: T.pulsaQuitar - 10 },
	{ desde: 1149, texto: '«Imprimir todo» los saca seguidos, en una impresión.', ...EN_LA_PILA, foco: FOCOS.imprimir },
	{ desde: 1295, texto: 'Imprimir no la vacía: usa «Vaciar la pila».', ...EN_LA_PILA, foco: FOCOS.vaciar },
];

/** El aviso de la mezcla sale al abrir la pila entera: el foco no se enciende antes. */
export const FOCO_DESDE: Record<number, number> = { 7: T.pulsaVer + 8 };

export const TARJETA = 1430;
export const DURACION = 1550;

export const CLAVE = 'informes-pila';
export const TITULO = 'La pila: trece grupos, una impresión';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Qué es la pila' },
	{ desde: PASOS[2].desde, titulo: 'Añadir a la pila, grupo por grupo' },
	{ desde: PASOS[5].desde, titulo: 'El tope: caben veinte' },
	{ desde: PASOS[6].desde, titulo: 'Vertical y apaisado no se mezclan' },
	{ desde: PASOS[9].desde, titulo: 'Imprimir todo, y vaciarla' },
];

export const CIERRE: Cierre = {
	hiciste: 'Apilaste los boletines de los trece grupos y los imprimiste de una vez.',
	seVe: 'La pila dice «13 informes, seguidos y en una sola impresión».',
	despues: 'Siguiente: el semáforo académico.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaApilar, 2) || !dentro(T.pulsaApilar2, 3) || !dentro(FIN_RAPIDO, 4) || !dentro(T.pulsaApilar3, 6) || !dentro(T.pulsaVer, 7) || !dentro(T.pulsaQuitar, 8) || !dentro(T.pulsaImprimir, 9)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
if (pila(FIN_RAPIDO).filas.length !== 13 || pila(T.pulsaApilar3).filas.length !== 14 || pila(T.pulsaQuitar).filas.length !== 13) {
	throw new Error('Guion: las cuentas de la pila no son 13, 14 y 13.');
}
if (disponer(estado(T.pulsaAula)).pastillas.find((p) => p.clave === 'aula')!.rect.y < disponer(estado(T.pulsaAula)).pila!.rect.alto) {
	throw new Error('Guion: la pastilla «Para el aula» queda debajo de la tira de la pila.');
}
