import { Punto } from '../../comunes/Cursor';
import { impresoDe } from '../cierre-6/datos-catalogo';
import { acercamientoAUnaHoja } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, enElPlano, foco, holgura, punto, union } from '../informes/Comun';
import { Ajustes, IMPRIMIR, MESA, RECARGAR, Rect, Valores, disponer, rectDeFicha, rectDePastilla } from '../informes/datos';
import { rectDeOpcion } from '../informes/Piezas';
import { EMPATE } from './datos';
import { G, HOJA, RECT_FECHA, RECT_PUESTOS, X_TABLA, ANCHO_TABLA, Y_TABLA, yFila } from './HojaPuestos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «LOS CUATRO PAPELES DE PUESTOS». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): «el puesto no se guarda, se calcula: nivelar en enero cambia el de
 * marzo». Lo que confirma el código:
 *   · Cuatro papeles en DOS fichas (`impresos.ts`): «Puestos por periodo» y «Puestos por año», y
 *     cada una de un grupo o de todos, porque su desplegable empieza por «Todos los grupos»
 *     (`todos`). El del año pide además «Calcular hasta el periodo».
 *   · El puesto se CALCULA al cargar, sobre los promedios que devuelve el servidor en esa llamada:
 *     `puestosDelGrupo` cuenta cuántos tienen un total mayor (`puestos.ts:389`). No hay columna de
 *     puesto guardada. Dos empatados comparten puesto, y entonces sale la columna «No».
 *   · La hoja lleva la fecha y la hora en que se sacó (`fechaDeAhora`, `puestos-comun.ts:207`).
 *   · «Recargar» vuelve a pedir y a calcular (`cargar()`).
 *
 * Lo que el vídeo NO afirma: el caso concreto «nivelar en enero cambia el de marzo». Que la
 * nivelación cambie la nota que el servidor devuelve para ese periodo es del backend y aquí no se
 * lee; el vídeo dice lo que sí está en el front: si cambia una nota, el puesto de la próxima carga
 * cambia con ella.
 *
 * 48 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaPastilla: 162,
	pulsaPastilla: 174,
	llegaFicha: 270,
	pulsaFicha: 282,
	llegaGrupo: 300,
	abreGrupo: 310,
	llegaOpcion: 336,
	eligeGrupo: 352,
	llegaAno: 390,
	pulsaAno: 402,
	llegaCargar: 490,
	pulsaCargar: 502,
	monta: 508,
	trae: 530,
	seVa: 662,
	plano: 668,
	vuelve: 1170,
	llegaRecargar: 1185,
	cursorSale: 1290,
};

export const PERIODO = impresoDe('puestos-periodo');
export const ANO = impresoDe('puestos-ano');
export const OPCIONES = ['Todos los grupos', '5°A', '6°A', '6°B', '7°A', '7°B'];
export const OPCION_7A = OPCIONES.indexOf('7°A');

export const elegida = (f: number) => (f >= T.pulsaAno ? ANO.clave : f >= T.pulsaFicha ? PERIODO.clave : null);
export const valores = (f: number): Valores => ({ grupo: f >= T.eligeGrupo ? '7°A' : null, hasta: 3 });
export const ajustes = (): Ajustes => ({ interruptores: [{ etiqueta: 'Mostrar foto', encendido: true }], hoja: 0 });

const estado = (f: number) => ({ consulta: '', familia: (f >= T.pulsaPastilla ? 'seguimiento' : 'todo') as 'seguimiento' | 'todo', elegida: elegida(f), valores: valores(f), ajustes: ajustes() });
export const estadoEn = estado;

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const D0 = disponer(estado(0));
const D_SEG = disponer(estado(T.pulsaPastilla));
const D_PER = disponer(estado(T.pulsaFicha));
const D_ANO = disponer(estado(T.pulsaAno));

/** La hoja en la mesa: a la izquierda y un poco más pequeña, para que el panel no tape el total. */
export const HOJA_EN_LA_MESA = { x: 24, y: 18, escala: 0.86 };
const enLaMesa = (r: Rect): Rect => ({
	x: MESA.x + HOJA_EN_LA_MESA.x + r.x * HOJA_EN_LA_MESA.escala,
	y: MESA.y + HOJA_EN_LA_MESA.y + r.y * HOJA_EN_LA_MESA.escala,
	ancho: r.ancho * HOJA_EN_LA_MESA.escala,
	alto: r.alto * HOJA_EN_LA_MESA.escala,
});

/** El plano de cerca: el encabezado y las diez primeras filas. */
export const CERCA = acercamientoAUnaHoja(HOJA, { y: 16, alto: yFila(10) - 16 });

const fichasSeg = union(rectDeFicha(D_SEG, PERIODO.clave), rectDeFicha(D_SEG, ANO.clave));
const campoGrupo = D_PER.conf!.campos.grupo!;

export const FOCOS = {
	informes: FOCO_INFORMES,
	fichas: foco(holgura(fichasSeg, 6)),
	desplegable: foco(holgura({ x: campoGrupo.x, y: campoGrupo.y - 26, ancho: campoGrupo.ancho, alto: 26 + campoGrupo.alto + 8 + OPCIONES.length * 36 + 8 }, 6)),
	hasta: foco(holgura(union({ ...D_ANO.conf!.campos.grupo!, y: D_ANO.conf!.campos.grupo!.y - 26 }, D_ANO.conf!.campos.hasta!), 8)),
	cargar: foco(holgura(D_ANO.conf!.cargar, 6)),
	hoja: foco(holgura(enLaMesa({ x: X_TABLA, y: Y_TABLA, ancho: ANCHO_TABLA, alto: G.cab + 20 * G.fila }), 4)),
	empate: enElPlano(CERCA, { x: X_TABLA - 4, y: yFila(EMPATE) - 3, ancho: ANCHO_TABLA + 8, alto: G.fila * 2 + 6 }),
	puesto: enElPlano(CERCA, { ...RECT_PUESTOS, x: RECT_PUESTOS.x - 4, y: RECT_PUESTOS.y - 4, ancho: RECT_PUESTOS.ancho + 8, alto: yFila(10) - RECT_PUESTOS.y + 4 }),
	fecha: enElPlano(CERCA, { x: RECT_FECHA.x - 8, y: RECT_FECHA.y - 4, ancho: RECT_FECHA.ancho + 16, alto: RECT_FECHA.alto + 8 }),
	recargar: foco(holgura(union(RECARGAR, IMPRIMIR), 6)),
};

const P = {
	pastilla: punto(rectDePastilla(D0, 'seguimiento')),
	ficha: punto(rectDeFicha(D_SEG, PERIODO.clave), 30),
	grupo: punto(campoGrupo, 60),
	opcion: punto(rectDeOpcion(campoGrupo, OPCION_7A), -40),
	ano: punto(rectDeFicha(D_SEG, ANO.clave), 30),
	cargar: punto(D_ANO.conf!.cargar, 40),
	recargar: punto(RECARGAR),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaPastilla, ...P.pastilla },
	{ frame: T.pulsaPastilla + 30, ...P.pastilla },
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 6, ...P.ficha },
	{ frame: T.llegaGrupo, ...P.grupo },
	{ frame: T.abreGrupo + 10, ...P.grupo },
	{ frame: T.llegaOpcion, ...P.opcion },
	{ frame: T.eligeGrupo + 10, ...P.opcion },
	{ frame: T.llegaAno, ...P.ano },
	{ frame: T.pulsaAno + 20, ...P.ano },
	{ frame: T.llegaCargar, ...P.cargar },
	{ frame: T.pulsaCargar + 30, ...P.cargar },
	{ frame: T.seVa - 20, x: P.cargar.x - 360, y: P.cargar.y + 60 },
	{ frame: T.vuelve + 10, x: P.recargar.x - 200, y: P.recargar.y + 260 },
	{ frame: T.llegaRecargar, ...P.recargar },
	{ frame: T.cursorSale - 40, ...P.recargar },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaPastilla, T.pulsaFicha, T.abreGrupo, T.eligeGrupo, T.pulsaAno, T.pulsaCargar];

export function senal(f: number): string | null {
	const entre = (a: number, b: number) => f >= a && f < b;
	if (entre(T.llegaPastilla, T.pulsaPastilla + 8)) { return 'pastilla-seguimiento'; }
	if (entre(T.llegaFicha, T.pulsaFicha + 8)) { return `ficha-${PERIODO.clave}`; }
	if (entre(T.llegaGrupo, T.abreGrupo)) { return 'campo-grupo'; }
	if (entre(T.llegaAno, T.pulsaAno + 8)) { return `ficha-${ANO.clave}`; }
	if (entre(T.llegaCargar, T.pulsaCargar + 4)) { return 'cargar'; }
	if (f >= T.llegaRecargar) { return 'recargar'; }
	return null;
}

export const fuera = (f: number) => {
	const r = (a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
	return f < T.vuelve ? r(T.seVa, T.seVa + 16) : 1 - r(T.vuelve, T.vuelve + 16);
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_PUESTOS = { ubicacion: 'Menú ▸ Informes ▸ Puestos por año', url: '/informes/puestos-grupo-year/48/3' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Los puestos están en Informes, en «Cómo va el grupo».', ...EN_EL_MENU, foco: FOCO_INFORMES, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 154, texto: 'Dos fichas: por periodo y por año.', ...EN_INFORMES, foco: FOCOS.fichas },
	{ desde: 264, texto: '«Todos los grupos» saca una hoja por grupo.', ...EN_INFORMES, foco: FOCOS.desplegable, focoHasta: T.eligeGrupo + 6 },
	{ desde: 382, texto: 'El del año pide hasta qué periodo acumular.', ...EN_INFORMES, foco: FOCOS.hasta },
	{ desde: 486, texto: 'Carga el informe.', ...EN_INFORMES, foco: FOCOS.cargar, focoHasta: T.pulsaCargar + 4 },
	{ desde: 553, texto: 'Una fila por alumno, del primero al último.', ...EN_PUESTOS, foco: FOCOS.hoja, focoHasta: T.seVa - 12 },
	{ desde: 668, texto: 'Si dos empatan, comparten puesto y sale la columna «No».', voz: 'Si dos empatan, comparten puesto y sale la columna de número.', ...EN_PUESTOS, foco: FOCOS.empate },
	{ desde: 817, texto: 'El puesto no se guarda: se calcula al abrir el papel.', ...EN_PUESTOS, foco: FOCOS.puesto },
	{ desde: 945, texto: 'Por eso lleva arriba la fecha y la hora del cálculo.', ...EN_PUESTOS, foco: FOCOS.fecha },
	{ desde: 1062, texto: 'Si después cambia una nota, cambia el puesto.', ...EN_PUESTOS },
	{ desde: 1177, texto: 'Imprímelo el mismo día; «Recargar» lo recalcula.', ...EN_PUESTOS, foco: FOCOS.recargar },
];

/* Cuándo se enciende el foco, si lo que señala aún no está al empezar el rótulo: antes del clic, el
 * recuadro alumbraría las fichas de otra familia, o el configurador del periodo que se está yendo. */
export const FOCO_DESDE: Record<number, number> = { 1: T.pulsaPastilla, 3: T.pulsaAno + 10 };

export const TARJETA = 1312;
export const DURACION = 1447;

export const CLAVE = 'puestos';
export const TITULO = 'Los cuatro papeles de puestos';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde: «Cómo va el grupo»' },
	{ desde: PASOS[1].desde, titulo: 'Cuatro papeles en dos fichas' },
	{ desde: PASOS[5].desde, titulo: 'La hoja y los empates' },
	{ desde: PASOS[7].desde, titulo: 'El puesto se calcula, no se guarda' },
];

export const CIERRE: Cierre = {
	hiciste: 'Sacaste los puestos del año de 7°A, hasta el periodo 3.',
	seVe: 'Arriba, la fecha y la hora en que se calcularon.',
	despues: 'Siguiente: las notas perdidas para la comisión.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaPastilla, 1) || !dentro(T.abreGrupo, 2) || !dentro(T.pulsaAno, 3) || !dentro(T.pulsaCargar, 4) || !dentro(T.llegaRecargar, 10)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
if (EMPATE < 0) {
	throw new Error('Guion: los datos no traen ningún empate y el paso lo nombra.');
}
