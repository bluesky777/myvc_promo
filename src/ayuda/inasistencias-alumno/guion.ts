import { Punto } from '../../comunes/Cursor';
import { escrito } from '../../comunes/movimiento';
import { impresoDe } from '../cierre-6/datos-catalogo';
import { acercamientoAUnaHoja } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, enElPlano, foco, holgura, punto, union } from '../informes/Comun';
import { CABEZA, MESA, RECARGAR, Rect, disponer, rectDeFicha, rectDePastilla } from '../informes/datos';
import { rectDeOpcion } from '../informes/Piezas';
import { COLUMNAS, COL_PCT, FILAS, G, HOJA, X_TABLA, Y_PIE, Y_TABLA, faltasDe, porcentaje, xColumna, yFila } from './Hoja';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «INASISTENCIAS POR ALUMNO». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): «el % se teclea porque el sistema no tiene fechas de periodo desde
 * 2021». Matizada por el código (`inasistencias-alumno.ts`, cabecera): lo que se teclea no es el
 * porcentaje sino **los días de clase**, que son su denominador --los periodos tienen `fecha_inicio`
 * y `fecha_fin` en NULL, «lo normal desde 2021»--; sin ellos la columna «%» sale vacía y el pie lo
 * dice. El otro número que se teclea es el umbral: marca con «!» las filas que lo alcanzan. Los dos
 * van en la cabecera del papel, no en el configurador.
 *
 * Y el pie trae la advertencia que más importa: **sólo cuenta las faltas de portería**; las que el
 * docente anota en su planilla de clase no las ve este listado.
 *
 * 42 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaPastilla: 176,
	pulsaPastilla: 186,
	llegaFicha: 200,
	pulsaFicha: 210,
	llegaGrupo: 222,
	abreGrupo: 232,
	llegaOpcion: 246,
	eligeGrupo: 256,
	llegaCargar: 266,
	pulsaCargar: 278,
	monta: 286,
	trae: 316,
	seVa: 416,
	plano: 422,
	vuelve: 546,
	llegaDias: 566,
	pulsaDias: 578,
	tecleaDias: 588,
	llegaUmbral: 706,
	pulsaUmbral: 718,
	tecleaUmbral: 728,
	cursorSale: 800,
	seVa2: 830,
	plano2: 836,
};
export const POR_TECLA = 5;
export const DIAS = '150';
export const UMBRAL = '5';

export const IMPRESO = impresoDe('inasistencias-alumno');
export const OPCIONES = ['5°A', '6°A', '6°B', '7°A', '7°B', '8°A'];

export const dias = (f: number) => (f >= T.tecleaDias ? escrito(f, DIAS, T.tecleaDias, POR_TECLA) || null : null);
export const umbral = (f: number) => (f >= T.tecleaUmbral ? escrito(f, UMBRAL, T.tecleaUmbral, POR_TECLA) || null : null);

export const estadoEn = (f: number) => ({
	consulta: '',
	familia: (f >= T.pulsaPastilla ? 'asistencia' : 'todo') as 'asistencia' | 'todo',
	elegida: f >= T.pulsaFicha ? IMPRESO.clave : null,
	valores: { grupo: f >= T.eligeGrupo ? '7°A' : null },
	ajustes: { hoja: 1 },
});

export const marcadas = (f: number) => {
	const d = dias(f);
	const u = umbral(f);
	if (!d || !u) { return 0; }
	return FILAS.filter((x) => (porcentaje(faltasDe(x), Number(d)) ?? -1) >= Number(u)).length;
};

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const D0 = disponer(estadoEn(0));
const D_QUIEN = disponer(estadoEn(T.pulsaPastilla));
const D_ELEGIDA = disponer(estadoEn(T.pulsaFicha));

/** Los dos números de la cabecera, pegados a «Recargar»: «Días de clase» y «Umbral %». */
export const DERECHA_UMBRAL = RECARGAR.x - 12;
export const DERECHA_DIAS = DERECHA_UMBRAL - 136 - 16;
export const DERECHA_RESUMEN = DERECHA_DIAS - 176 - 16;
const casilla = (derecha: number): Rect => ({ x: derecha - 60, y: CABEZA.y + (CABEZA.alto - 28) / 2, ancho: 60, alto: 28 });
export const CASILLA_DIAS = casilla(DERECHA_DIAS);
export const CASILLA_UMBRAL = casilla(DERECHA_UMBRAL);

/** La hoja en la mesa: apaisada y entera, sin panel (su panel sólo tendría «La hoja» y nace cerrado). */
export const EN_LA_MESA = { x: (MESA.ancho - HOJA.ancho) / 2, y: 18 };
const enLaMesa = (r: Rect): Rect => ({ ...r, x: MESA.x + EN_LA_MESA.x + r.x, y: MESA.y + EN_LA_MESA.y + r.y });

/** De cerca: la tabla (arriba) y el pie (abajo). */
export const CERCA = acercamientoAUnaHoja(HOJA, { y: Y_TABLA - 8, alto: 12 * G.fila + G.cab });
export const PIE = acercamientoAUnaHoja(HOJA, { y: yFila(10), alto: HOJA.alto - 40 - yFila(10) });

const OCAMPO = FILAS.findIndex((x) => x.nombre.startsWith('Ocampo'));

export const FOCOS = {
	informes: FOCO_INFORMES,
	configurador: foco(holgura(union(rectDeFicha(D_QUIEN, IMPRESO.clave), D_ELEGIDA.conf!.campos.grupo!), 6)),
	hoja: foco(holgura(enLaMesa({ x: X_TABLA, y: Y_TABLA, ancho: COLUMNAS.reduce((a, c) => a + c.ancho, 0), alto: G.cab + FILAS.length * G.fila }), 3)),
	pct: enElPlano(CERCA, { x: xColumna(COL_PCT) - 3, y: Y_TABLA - 3, ancho: COLUMNAS[COL_PCT].ancho + 6, alto: G.cab + 11 * G.fila + 6 }),
	dias: foco(holgura({ x: CASILLA_DIAS.x - 110, y: CASILLA_DIAS.y, ancho: 170, alto: 28 }, 6)),
	umbral: foco(holgura({ x: CASILLA_UMBRAL.x - 72, y: CASILLA_UMBRAL.y, ancho: 132, alto: 28 }, 6)),
	marcada: enElPlano(PIE, { x: X_TABLA - 3, y: yFila(OCAMPO) - 3, ancho: xColumna(COL_PCT + 1) - X_TABLA + 6, alto: G.fila + 6 }),
	pie: enElPlano(PIE, { x: X_TABLA - 4, y: Y_PIE - 4, ancho: 610, alto: 36 }),
};

const P = {
	pastilla: punto(rectDePastilla(D0, 'asistencia')),
	ficha: punto(rectDeFicha(D_QUIEN, IMPRESO.clave), 30),
	grupo: punto(D_ELEGIDA.conf!.campos.grupo!, 60),
	opcion: punto(rectDeOpcion(D_ELEGIDA.conf!.campos.grupo!, 3), -40),
	cargar: punto(disponer(estadoEn(T.eligeGrupo)).conf!.cargar, 40),
	dias: punto(CASILLA_DIAS),
	umbral: punto(CASILLA_UMBRAL),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaPastilla, ...P.pastilla },
	{ frame: T.pulsaPastilla + 4, ...P.pastilla },
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 4, ...P.ficha },
	{ frame: T.llegaGrupo, ...P.grupo },
	{ frame: T.abreGrupo + 2, ...P.grupo },
	{ frame: T.llegaOpcion, ...P.opcion },
	{ frame: T.eligeGrupo + 2, ...P.opcion },
	{ frame: T.llegaCargar, ...P.cargar },
	{ frame: T.pulsaCargar + 30, ...P.cargar },
	{ frame: T.seVa - 10, x: P.cargar.x - 300, y: P.cargar.y + 60 },
	{ frame: T.vuelve + 10, x: P.dias.x - 120, y: P.dias.y + 240 },
	{ frame: T.llegaDias, ...P.dias },
	{ frame: T.tecleaDias + 40, ...P.dias },
	{ frame: T.llegaUmbral, ...P.umbral },
	{ frame: T.tecleaUmbral + 30, ...P.umbral },
	{ frame: T.cursorSale - 10, x: P.umbral.x - 200, y: P.umbral.y + 300 },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaPastilla, T.pulsaFicha, T.abreGrupo, T.eligeGrupo, T.pulsaCargar, T.pulsaDias, T.pulsaUmbral];

export function senal(f: number): string | null {
	const entre = (a: number, b: number) => f >= a && f < b;
	if (entre(T.llegaPastilla, T.pulsaPastilla + 8)) { return 'pastilla-asistencia'; }
	if (entre(T.llegaFicha, T.pulsaFicha + 8)) { return `ficha-${IMPRESO.clave}`; }
	if (entre(T.llegaGrupo, T.abreGrupo)) { return 'campo-grupo'; }
	if (entre(T.llegaCargar, T.pulsaCargar + 4)) { return 'cargar'; }
	return null;
}

export function fuera(f: number): number {
	const r = (a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
	if (f < T.vuelve) { return r(T.seVa, T.seVa + 16); }
	if (f < T.seVa2) { return 1 - r(T.vuelve, T.vuelve + 16); }
	return r(T.seVa2, T.seVa2 + 16);
}

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_HOJA = { ubicacion: 'Menú ▸ Informes ▸ Inasistencias por alumno', url: '/informes/inasistencias-alumno/48' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Las inasistencias por alumno están en Informes, en «Quién vino».', ...EN_EL_MENU, foco: FOCO_INFORMES, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 173, texto: 'Pide sólo el grupo: aquí, 7°A.', voz: 'Pide sólo el grupo: aquí, séptimo A.', ...EN_INFORMES, foco: FOCOS.configurador, focoHasta: T.pulsaCargar - 8 },
	{ desde: 294, texto: 'Faltas y tardanzas de cada alumno, con sus rachas.', ...EN_LA_HOJA, foco: FOCOS.hoja, focoHasta: T.seVa - 10 },
	{ desde: 427, texto: 'El % sale vacío: faltan los días de clase.', voz: 'El porcentaje sale vacío: faltan los días de clase.', ...EN_LA_HOJA, foco: FOCOS.pct, focoHasta: T.vuelve - 8 },
	{ desde: 559, texto: 'Tecléalos en «Días de clase» y el % se calcula.', voz: 'Tecléalos en días de clase, y el porcentaje se calcula.', ...EN_LA_HOJA, foco: FOCOS.dias },
	{ desde: 700, texto: '«Umbral %» marca con «!» a quien llega a ese porcentaje.', voz: 'El umbral marca con una exclamación a quien llega a ese porcentaje.', ...EN_LA_HOJA, foco: FOCOS.umbral, focoHasta: T.seVa2 - 8 },
	{ desde: 839, texto: 'La fila lleva «!» y el pie dice los días usados.', voz: 'La fila lleva la exclamación, y el pie dice los días usados.', ...EN_LA_HOJA, foco: FOCOS.marcada },
	{ desde: 984, texto: 'Ojo: sólo cuenta las faltas de portería, no las de clase.', ...EN_LA_HOJA, foco: FOCOS.pie },
];

/* Cuándo se enciende el foco, si lo que señala aún no está al empezar el rótulo: antes del clic, el
 * recuadro alumbraría las fichas de otra familia, el hueco del configurador o el «Cargando…» del papel. */
export const FOCO_DESDE: Record<number, number> = { 1: T.pulsaFicha, 2: T.trae };

export const TARJETA = 1136;
export const DURACION = 1256;

export const CLAVE = 'inasistencias-alumno';
export const TITULO = 'Inasistencias por alumno';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde: «Quién vino»' },
	{ desde: PASOS[3].desde, titulo: 'El % vacío, y por qué' },
	{ desde: PASOS[4].desde, titulo: 'Días de clase y umbral' },
	{ desde: PASOS[7].desde, titulo: 'Sólo faltas de portería' },
];

export const CIERRE: Cierre = {
	hiciste: `Sacaste las inasistencias de 7°A con ${DIAS} días de clase y un umbral del ${UMBRAL} %.`,
	seVe: 'La columna % llena, y «!» en quien llega al umbral.',
	despues: 'Siguiente: la ficha de matrícula.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaCargar, 1) || !dentro(T.pulsaDias, 4) || !dentro(T.pulsaUmbral, 5)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
if (marcadas(T.tecleaUmbral + 20) < 1) {
	throw new Error('Guion: con esos días y ese umbral no se marca a nadie, y el paso lo enseña.');
}
