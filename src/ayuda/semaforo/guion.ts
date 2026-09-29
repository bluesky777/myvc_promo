import { Punto } from '../../comunes/Cursor';
import { escrito } from '../../comunes/movimiento';
import { impresoDe } from '../cierre-6/datos-catalogo';
import { rectanguloDeMando } from '../BarraDeHoy';
import { acercamientoAUnaHoja, encuadreDeUnaHoja, enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, foco, holgura, punto, union } from '../informes/Comun';
import { Ajustes, GRUPOS, MESA, Rect, VIS, Valores, X_PANEL, Y_PANEL, disponer, disponerAjustes, rectDeFicha } from '../informes/datos';
import { rectDeOpcion, rectDeSegmento } from '../informes/Piezas';
import { ENTREGA, HOY } from './datos';
import { FOLIO, MEDIA, RECTS_MEDIA } from './Papeles';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «SEMÁFORO». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): «fecha de entrega y número/valoración; sin escala del año sale sin
 * azul». Todo del código de app2:
 *   · Los dos ajustes son SUYOS y salen abiertos, en el configurador y en el panel
 *     (`catalogo-informes.html`, «Qué sale en la casilla» y «Fecha de entrega»; `opciones-del-
 *     informe.ts:179`). La fecha **arranca en hoy** (`seleccion-informe.ts:87`) y no se guarda de
 *     una vez para otra; el número o la valoración sí, en la galleta (`semaforo_valoracion`).
 *   · Sale PRIMERO una hoja de riesgo, «Esta hoja no se entrega: se queda en el colegio»
 *     (`resumen-de-riesgo.html`), y después media hoja por alumno, dos por folio.
 *   · Los colores (`semaforo.scss:496`): perdida roja con recuadro, básica amarilla, media y alta
 *     verdes, la más alta con recuadro verde. **El azul del plan ya no existe en el papel**: la hoja
 *     pinta verde. Pero el aviso de pantalla lo sigue nombrando, literal: «…sale con el rojo de lo
 *     perdido y sin el azul». El vídeo enseña el aviso tal cual y su rótulo no dice «azul».
 *   · Sin escala del año sólo se tiñe lo perdido (sale de la nota mínima, que siempre existe) y la
 *     leyenda vuelve a su frase de respaldo. Lo avisa el `nz-alert` amarillo antes de las hojas.
 *
 * El vídeo no afirma: qué pasa con el informe de corte (la columna «%» y el gris «Sin valorar»),
 * porque depende de cuánto del plan esté evaluado; aquí el periodo va entero.
 *
 * 56 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaBuscador: 132,
	pulsaBuscador: 142,
	teclea: 150,
	llegaFicha: 206,
	pulsaFicha: 218,
	llegaGrupo: 272,
	abreGrupo: 282,
	llegaOpcion: 298,
	eligeGrupo: 310,
	bajaDesde: 548,
	bajaHasta: 568,
	llegaFecha: 578,
	pulsaFecha: 590,
	tecleaFecha: 600,
	llegaCargar: 672,
	pulsaCargar: 684,
	monta: 690,
	trae: 712,
	cursorSale1: 850,
	/* Los papeles a pantalla completa. */
	seVa1: 876,
	planoA: 882,
	planoB: 940,
	vuelve: 1262,
	llegaSegmento: 1286,
	pulsaSegmento: 1298,
	seVa2: 1334,
	planoB2: 1340,
	planoC: 1404,
	cursorSale: 1350,
};
export const POR_TECLA = 4;
export const BUSCA = 'preinforme';
export const FECHA_TECLA = 3;

export const IMPRESO = impresoDe('semaforo');
export const GRUPO = '7°A';

/* ── El estado del catálogo ───────────────────────────────────────────────────────────────── */

export const consulta = (f: number) => escrito(f, BUSCA, T.teclea, POR_TECLA);
export const valores = (f: number): Valores => ({ grupo: f >= T.eligeGrupo ? GRUPO : null });

export function fecha(f: number): string {
	if (f < T.tecleaFecha) { return HOY; }
	return escrito(f, ENTREGA, T.tecleaFecha, FECHA_TECLA);
}

export function ajustes(f: number): Ajustes {
	return {
		interruptores: [{ etiqueta: 'Firma del titular', encendido: false }],
		casilla: f >= T.pulsaSegmento ? 1 : 0,
		fecha: fecha(f),
		hoja: 0,
	};
}

const estado = (f: number, desplazamiento = 0) => ({
	consulta: consulta(f),
	familia: 'todo' as const,
	elegida: f >= T.pulsaFicha ? IMPRESO.clave : null,
	valores: valores(f),
	ajustes: ajustes(f),
	desplazamiento,
});

const SIN_BAJAR = disponer(estado(T.eligeGrupo));
export const BAJA = Math.max(0, Math.ceil(SIN_BAJAR.conf!.apilar!.y + SIN_BAJAR.conf!.apilar!.alto - 826));
export function desplazamiento(f: number) {
	if (f < T.bajaDesde) { return 0; }
	const t = Math.min(1, (f - T.bajaDesde) / (T.bajaHasta - T.bajaDesde));
	return Math.round(BAJA * (t * t * (3 - 2 * t)));
}
export const estadoEn = (f: number) => estado(f, desplazamiento(f));

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const D_BUSCA = disponer(estado(T.teclea + BUSCA.length * POR_TECLA));
const D_GRUPO = disponer(estado(T.pulsaFicha));
const D_AJUSTES = disponer(estado(T.eligeGrupo, BAJA));
const pl = (que: string) => D_AJUSTES.conf!.plegables.find((p) => p.que === que)!;
const casilla = pl('casilla');
const fechaPl = pl('fecha');

/** La hoja de riesgo en la mesa: pegada a la izquierda y un poco más pequeña, para que el panel no la tape. */
export const RIESGO_EN_LA_MESA = { x: 24, y: 18, escala: 0.86 };
const enLaMesa = (r: Rect): Rect => ({
	x: MESA.x + RIESGO_EN_LA_MESA.x + r.x * RIESGO_EN_LA_MESA.escala,
	y: MESA.y + RIESGO_EN_LA_MESA.y + r.y * RIESGO_EN_LA_MESA.escala,
	ancho: r.ancho * RIESGO_EN_LA_MESA.escala,
	alto: r.alto * RIESGO_EN_LA_MESA.escala,
});

/** Los planos a pantalla completa: el folio entero, la media hoja de arriba de cerca, y la del aviso. */
export const PLANO_A = encuadreDeUnaHoja(FOLIO);
export const PLANO_B = acercamientoAUnaHoja(FOLIO, { y: 0, alto: MEDIA.alto });
export const CON_AVISO = { ancho: MEDIA.ancho, alto: MEDIA.alto + 104 };
export const PLANO_C = encuadreDeUnaHoja(CON_AVISO, 30);

const enElPlano = (p: { escala: number; x: number; y: number }, r: Rect, radio = 8) => ({
	x: p.x + r.x * p.escala,
	y: p.y + r.y * p.escala,
	ancho: r.ancho * p.escala,
	alto: r.alto * p.escala,
	radio,
});

const panel = disponerAjustes(ajustes(0), X_PANEL, Y_PANEL + 8, VIS.panel, true);
const segmento = panel.plegables.find((p) => p.que === 'casilla')!.controles[0];
const segValoracion = rectDeSegmento(segmento, 2, 1);

export const FOCOS = {
	informes: FOCO_INFORMES,
	buscador: foco(holgura(D_BUSCA.buscador, 4)),
	grupo: foco(holgura({ ...D_GRUPO.conf!.campos.grupo!, y: D_GRUPO.conf!.campos.grupo!.y - 26, alto: D_GRUPO.conf!.campos.grupo!.alto + 26 }, 8)),
	ajustes: foco(holgura(union(casilla.cabeza, casilla.cuerpo!, fechaPl.cabeza, fechaPl.cuerpo!), 2)),
	fecha: foco(holgura(union(fechaPl.cabeza, fechaPl.cuerpo!), 2)),
	cargar: foco(holgura(D_AJUSTES.conf!.cargar, 6)),
	riesgo: foco(holgura(enLaMesa({ x: 0, y: 0, ancho: 816, alto: 190 }), 6)),
	entrega: enElPlano(PLANO_B, { x: RECTS_MEDIA.entrega.x - 8, y: RECTS_MEDIA.entrega.y - 4, ancho: RECTS_MEDIA.entrega.ancho + 16, alto: RECTS_MEDIA.entrega.alto + 8 }),
	colores: enElPlano(PLANO_B, union(RECTS_MEDIA.tabla, RECTS_MEDIA.leyenda)),
	firmas: enElPlano(PLANO_B, RECTS_MEDIA.firmas),
	periodo: { ...enElFotograma(holgura(rectanguloDeMando('selector'), 4)), radio: 20 },
	segmento: foco(holgura(union(casilla.cabeza, segmento), 4)),
	aviso: enElPlano(PLANO_C, { x: -6, y: -6, ancho: MEDIA.ancho + 12, alto: 96 }),
};

const P = {
	buscador: punto(D_BUSCA.buscador, -200),
	ficha: punto(rectDeFicha(D_BUSCA, IMPRESO.clave), 30),
	grupo: punto(D_GRUPO.conf!.campos.grupo!, 60),
	opcion: punto(rectDeOpcion(D_GRUPO.conf!.campos.grupo!, 3), -40),
	fecha: punto(fechaPl.controles[0], 20),
	cargar: punto(D_AJUSTES.conf!.cargar, 40),
	segmento: punto(segValoracion),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaBuscador, ...P.buscador },
	{ frame: T.pulsaBuscador + 6, ...P.buscador },
	{ frame: T.teclea + 20, x: P.buscador.x + 60, y: P.buscador.y + 150 },
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 10, ...P.ficha },
	{ frame: T.llegaGrupo, ...P.grupo },
	{ frame: T.abreGrupo + 6, ...P.grupo },
	{ frame: T.llegaOpcion, ...P.opcion },
	{ frame: T.eligeGrupo + 20, ...P.opcion },
	{ frame: T.llegaFecha - 24, x: P.opcion.x - 120, y: P.opcion.y + 100 },
	{ frame: T.llegaFecha, ...P.fecha },
	{ frame: T.tecleaFecha + 60, ...P.fecha },
	{ frame: T.llegaCargar, ...P.cargar },
	{ frame: T.pulsaCargar + 30, ...P.cargar },
	{ frame: T.cursorSale1, x: P.cargar.x - 300, y: P.cargar.y + 60 },
	{ frame: T.vuelve + 10, x: P.segmento.x - 200, y: P.segmento.y + 260 },
	{ frame: T.llegaSegmento, ...P.segmento },
	{ frame: T.pulsaSegmento + 20, ...P.segmento },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaBuscador, T.pulsaFicha, T.abreGrupo, T.eligeGrupo, T.pulsaFecha, T.pulsaCargar, T.pulsaSegmento];

export function senal(f: number): string | null {
	const entre = (a: number, b: number) => f >= a && f < b;
	if (entre(T.llegaBuscador, T.pulsaBuscador)) { return 'buscador'; }
	if (entre(T.llegaFicha, T.pulsaFicha + 8)) { return `ficha-${IMPRESO.clave}`; }
	if (entre(T.llegaGrupo, T.abreGrupo)) { return 'campo-grupo'; }
	if (entre(T.llegaFecha, T.pulsaFecha)) { return 'fecha'; }
	if (entre(T.llegaCargar, T.pulsaCargar + 4)) { return 'cargar'; }
	if (entre(T.llegaSegmento, T.pulsaSegmento + 6)) { return 'segmento-casilla-1'; }
	return null;
}

/** Cuánto está fuera la cáscara: sale al folio, vuelve para la valoración, y sale otra vez. */
export function fuera(f: number): number {
	const rampa = (a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
	if (f < T.vuelve) { return rampa(T.seVa1, T.seVa1 + 16); }
	if (f < T.seVa2) { return 1 - rampa(T.vuelve, T.vuelve + 16); }
	return rampa(T.seVa2, T.seVa2 + 16);
}

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_SEMAFORO = { ubicacion: 'Menú ▸ Informes ▸ Semáforo académico', url: '/informes/semaforo/48/3' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'El semáforo académico se saca en Informes.', ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 125, texto: 'Búscalo como lo llames: «preinforme» también sirve.', ...EN_INFORMES, foco: FOCOS.buscador, focoHasta: T.llegaFicha - 6 },
	{ desde: 264, texto: 'Pide sólo el grupo: aquí, 7°A.', voz: 'Pide sólo el grupo: aquí, séptimo A.', ...EN_INFORMES, foco: FOCOS.grupo, focoHasta: T.eligeGrupo + 20 },
	{ desde: 386, texto: 'No pregunta el periodo: usa el de arriba. Compruébalo.', ...EN_INFORMES, foco: FOCOS.periodo },
	{ desde: 546, texto: 'La fecha arranca en hoy: pon el día del reparto.', ...EN_INFORMES, foco: FOCOS.fecha },
	{ desde: 668, texto: 'Carga el informe.', ...EN_INFORMES, foco: FOCOS.cargar, focoHasta: T.pulsaCargar + 4 },
	{ desde: 740, texto: 'Primero, la hoja de quién va en rojo: no se entrega.', ...EN_EL_SEMAFORO, foco: FOCOS.riesgo, focoHasta: T.seVa1 - 12 },
	{ desde: 879, texto: 'Después, media hoja por alumno, con la fecha de entrega.', ...EN_EL_SEMAFORO, foco: FOCOS.entrega },
	{ desde: 1025, texto: 'Cada casilla lleva el color de su banda.', ...EN_EL_SEMAFORO, foco: FOCOS.colores },
	{ desde: 1124, texto: 'Firman acudiente y titular: esa media hoja es el recibo.', ...EN_EL_SEMAFORO, foco: FOCOS.firmas, focoHasta: T.vuelve - 12 },
	{ desde: 1262, texto: 'Con «La valoración», sale ALTO o BÁSICO, no el número.', voz: 'Con la valoración, sale alto o básico, no el número.', ...EN_EL_SEMAFORO, foco: FOCOS.segmento, focoHasta: T.seVa2 - 8 },
	{ desde: 1407, texto: 'Sin escala en el año, sólo sale el rojo, y lo avisa.', ...EN_EL_SEMAFORO, foco: FOCOS.aviso },
];

/** La media hoja de cerca llega a mitad del paso 8: el foco de la fecha espera a que esté. */
export const FOCO_DESDE: Record<number, number> = { 7: T.planoB + 12 };

export const TARJETA = 1548;
export const DURACION = 1668;

export const CLAVE = 'semaforo';
export const TITULO = 'Semáforo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Buscarlo: «preinforme»' },
	{ desde: PASOS[3].desde, titulo: 'El periodo y la fecha de entrega' },
	{ desde: PASOS[6].desde, titulo: 'La hoja de riesgo y las medias hojas' },
	{ desde: PASOS[10].desde, titulo: 'El número o la valoración' },
	{ desde: PASOS[11].desde, titulo: 'Sin escala del año' },
];

export const CIERRE: Cierre = {
	hiciste: `Sacaste el semáforo de ${GRUPO} con la fecha del día en que se reparte.`,
	seVe: `Cada media hoja dice «Entrega: ${ENTREGA}» y lleva las dos firmas.`,
	despues: 'Siguiente: los cuatro papeles de puestos.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaFicha, 1) || !dentro(T.eligeGrupo, 2) || !dentro(T.tecleaFecha + ENTREGA.length * FECHA_TECLA, 4) || !dentro(T.pulsaCargar, 5) || !dentro(T.pulsaSegmento, 10)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
if (T.planoC - T.planoB2 < 60) {
	throw new Error('Guion: la media hoja con la valoración no se ve ni dos segundos.');
}
export const GRUPOS_VISIBLES = GRUPOS.slice(0, 6);
