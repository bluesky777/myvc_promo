import { ALMENDROS, COLEGIO } from '../colegio';
import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS PERIODOS DE «ENTREGA DE NOTAS»: una copia de `cierre-2/datos.ts` con el periodo 3 en curso.
 *
 * El vídeo cierra el periodo 3 y después imprime el periodo 3 en Informes, que es el que dicen el
 * selector de arriba y el catálogo («Periodo 3 abierto»). `cierre-2` cierra el 2 y lleva sus datos
 * atados al módulo (`PERIODOS`, `EL_QUE_SE_CIERRA`), sin props: por eso esta copia, con `Periodos` y
 * `DialogoCierre` copiados tal cual al lado. Si algún día esas piezas aceptan el periodo como prop,
 * esta carpeta vuelve a importarlas de `cierre-2` y se borran las tres copias.
 *
 * Lo demás es lo de `cierre-2`: la pantalla de hoy (el tramo de cuatro pasos por periodo, de
 * `app2/src/app/paginas/colegio/colegio-periodos.html` y `comunes/tramo-de-periodo.ts`) y el diálogo
 * de cierre con dos asignaturas con casillas vacías (inventadas).
 *
 * TODO VA EN COORDENADAS DEL CONTENIDO (a la derecha del menú, debajo de la barra) salvo lo que
 * diga «EN LA CÁSCARA». El foco y el puntero salen de estas mismas funciones.
 */

export const NOMBRE_COLEGIO = COLEGIO.nombre;
export const ANIO = 2026;
/** El id del año en la dirección: el de `colegio/`, el mismo que los vídeos de certificados. */
export const YEAR_ID = ALMENDROS.yearId;

export const PISTA =
	'El tramo dice en qué momento está el periodo y escribe los dos permisos de los profesores. ' +
	'«Calificando» abre poner notas y pasar asistencia —las dos a la vez—; «Nivelando» es la semana de ' +
	'nivelaciones: ya no se califica, pero se nivela lo perdido y se tocan las definitivas. Pasar de ' +
	'calificar a nivelar es cerrar el periodo, y eso pregunta antes qué falta.';

export type Tramo = 'calificando' | 'calificando-y-nivelando' | 'nivelando' | 'cerrado';
export const TRAMOS: Tramo[] = ['calificando', 'calificando-y-nivelando', 'nivelando', 'cerrado'];

/** Los nombres cortos del mando (`nombreDelTramo`). */
export const NOMBRE_TRAMO: Record<Tramo, string> = {
	calificando: 'Calificando',
	'calificando-y-nivelando': '+ nivelando',
	nivelando: 'Nivelando',
	cerrado: 'Cerrado',
};

/** El pie de la fila: «Profesores: …» (`quePuedenLosProfes`). */
export const QUE_PUEDEN: Record<Tramo, string> = {
	calificando: 'Poner notas y asistencia',
	'calificando-y-nivelando': 'Poner notas, asistencia y nivelar',
	nivelando: 'Nivelar lo perdido y tocar definitivas',
	cerrado: 'Nada. Sólo mirar.',
};

export interface PeriodoFila {
	numero: number;
	actual: boolean;
	tramo: Tramo;
	inicio: string;
	fin: string;
	entrega: string | null;
}

/** Los cuatro periodos de 2026. Fechas inventadas. El 3 cambia de tramo en el vídeo. */
export const PERIODOS: PeriodoFila[] = [
	{ numero: 1, actual: false, tramo: 'cerrado', inicio: '26 ene', fin: '10 abr', entrega: '24 abr' },
	{ numero: 2, actual: false, tramo: 'cerrado', inicio: '13 abr', fin: '19 jun', entrega: '3 jul' },
	{ numero: 3, actual: true, tramo: 'calificando', inicio: '6 jul', fin: '25 sep', entrega: '2 oct' },
	{ numero: 4, actual: false, tramo: 'calificando', inicio: '28 sep', fin: '27 nov', entrega: null },
];

/** El que se cierra: el 3, el que está en curso. */
export const EL_QUE_SE_CIERRA = 2;

export const PESTANAS = ['Periodos', 'Ficha del colegio', 'Ajustes del año', 'Certificados', 'Compromisos', 'Plantilla del compromiso'];

/* ── La geometría ─────────────────────────────────────────────────────────────────────────── */

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;

export const PG = {
	lados: 32,
	arriba: 22,
	h1: 40,
	subtitulo: 28,
	/** Donde empieza la tira de pestañas. */
	pestanas: 104,
	pestanasAlto: 44,
	/** Donde empieza el panel de los periodos. */
	panel: 164,
	panelRelleno: 20,
	cabecera: 38,
	pista: 70,
	huecoTrasPista: 12,
	fila: 122,
	filaRelleno: 14,
	tramoAlto: 34,
	fechasAlto: 26,
	pieAlto: 22,
	nombre: 170,
};

/** Los anchos de los cuatro segmentos del mando, fijos para que el puntero sepa dónde cae cada uno. */
export const ANCHO_TRAMO: Record<Tramo, number> = {
	calificando: 124,
	'calificando-y-nivelando': 126,
	nivelando: 112,
	cerrado: 98,
};

export const PANEL_IZQ = PG.lados;
export const PANEL_ANCHO = ANCHO_CONTENIDO - PG.lados * 2;

/** Donde empieza la lista de periodos (su raya de arriba). */
export const ARRIBA_LISTA = PG.panel + PG.panelRelleno + PG.cabecera + 10 + PG.pista + PG.huecoTrasPista;

export function arribaDeLaFila(i: number): number {
	return ARRIBA_LISTA + i * PG.fila;
}

/** Donde empieza la columna del centro (el mando, las fechas, el pie). */
export const IZQ_CENTRO = PANEL_IZQ + PG.panelRelleno + 12 + PG.nombre;

export function rectDeLaFila(i: number) {
	return { x: PANEL_IZQ + PG.panelRelleno, y: arribaDeLaFila(i), ancho: PANEL_ANCHO - PG.panelRelleno * 2, alto: PG.fila };
}

export function rectDelNombre(i: number) {
	return { x: PANEL_IZQ + PG.panelRelleno + 4, y: arribaDeLaFila(i) + 10, ancho: PG.nombre, alto: PG.fila - 20 };
}

export function rectDelMando(i: number) {
	const ancho = TRAMOS.reduce((n, t) => n + ANCHO_TRAMO[t], 0) + 2;
	return { x: IZQ_CENTRO, y: arribaDeLaFila(i) + PG.filaRelleno, ancho, alto: PG.tramoAlto };
}

export function rectDelTramo(i: number, t: Tramo) {
	const antes = TRAMOS.slice(0, TRAMOS.indexOf(t)).reduce((n, x) => n + ANCHO_TRAMO[x], 0);
	return { x: IZQ_CENTRO + 1 + antes, y: arribaDeLaFila(i) + PG.filaRelleno + 1, ancho: ANCHO_TRAMO[t], alto: PG.tramoAlto - 2 };
}

export function rectDelPie(i: number) {
	return {
		x: IZQ_CENTRO - 6,
		y: arribaDeLaFila(i) + PG.filaRelleno + PG.tramoAlto + 8 + PG.fechasAlto + 4 - 3,
		ancho: 470,
		alto: PG.pieAlto + 6,
	};
}

/** La pestaña «Periodos», la primera. */
export function rectDeLaPestana() {
	return { x: PG.lados - 6, y: PG.pestanas, ancho: 124, alto: PG.pestanasAlto };
}

/** De coordenadas del contenido a coordenadas de la cáscara. */
export function enLaCascara(r: { x: number; y: number; ancho: number; alto: number }) {
	return { x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra, ancho: r.ancho, alto: r.alto };
}

/* ── Lo que queda a la derecha de cada fila (EN COORDENADAS DEL CONTENIDO) ─────────────────── */

const DERECHA_FILA = PANEL_IZQ + 1 + PANEL_ANCHO - 2 - PG.panelRelleno;
const BOTON_FILA = 32;

/** «Poner en curso» de la fila `i` (en la del periodo en curso es la palabra «en curso»). */
export function rectDelPonerEnCurso(i: number) {
	return { x: DERECHA_FILA - 34 - 6 - 140, y: arribaDeLaFila(i) + (PG.fila - BOTON_FILA) / 2, ancho: 140, alto: BOTON_FILA };
}

/** El «⋯» de la fila `i`. */
export function rectDelMas(i: number) {
	return { x: DERECHA_FILA - 34, y: arribaDeLaFila(i) + (PG.fila - BOTON_FILA) / 2, ancho: 34, alto: BOTON_FILA };
}

/** El menú del «⋯», abierto hacia abajo y pegado a su derecha (`nzPlacement="bottomRight"`). */
export const MENU_MAS = { ancho: 220, alto: 44 };
export function rectDelMenuMas(i: number) {
	const mas = rectDelMas(i);
	return { x: mas.x + mas.ancho - MENU_MAS.ancho, y: mas.y + mas.alto + 4, ancho: MENU_MAS.ancho, alto: MENU_MAS.alto };
}

/* ── El diálogo de cierre (`cierre-de-periodo.ts`), EN LA CÁSCARA: el modal cubre la app entera ──
 *
 * AHORA ENSEÑA EL CASO CON VACÍAS, no «Todo calificado»: es el único en el que sale la casilla
 * «Poner en cero las N casillas vacías», que es el error caro del cierre (3.094 casillas en dos
 * cierres de un colegio). El colegio de los vídeos tiene la política «cero» (`lo.salida === 'cero'`),
 * y la casilla se deja SIN marcar: lo vacío queda fuera de la cuenta.
 */

export const DIALOGO = {
	ancho: 780,
	titulo: 62,
	relleno: 24,
	alerta: 96,
	fila: 58,
	avisar: 34,
	resumen: 30,
	aviso: 72,
	ceros: 52,
	pie: 68,
};

/** Las asignaturas que deben notas. Inventadas: materias, grupos y docentes. */
export const FALTAN = [
	{ materia: 'Ciencias sociales', grupo: '8°A', docente: 'Jorge Iván Mejía Toro', cara: { tipo: 'hombre' as const, variante: 5 }, alumnos: 3, indicadores: 3 },
	{ materia: 'Educación artística', grupo: '10°B', docente: 'Paula Andrea Giraldo Ríos', cara: { tipo: 'mujer' as const, variante: 4 }, alumnos: 5, indicadores: 1 },
];
export const CASILLAS = FALTAN.reduce((n, a) => n + a.alumnos * a.indicadores, 0);

const ARRIBA_ALERTA = DIALOGO.titulo + DIALOGO.relleno;
const ARRIBA_LISTA_D = ARRIBA_ALERTA + DIALOGO.alerta + 12;
const ARRIBA_AVISAR = ARRIBA_LISTA_D + FALTAN.length * DIALOGO.fila + 2 + 12;
const ARRIBA_RESUMEN = ARRIBA_AVISAR + DIALOGO.avisar + 8;
const ARRIBA_AVISO = ARRIBA_RESUMEN + DIALOGO.resumen + 8;
const ARRIBA_CEROS = ARRIBA_AVISO + DIALOGO.aviso + 10;

/** Dónde cae cada bloque, desde el borde de arriba del diálogo. */
export const POS_DIALOGO = { alerta: ARRIBA_ALERTA, lista: ARRIBA_LISTA_D, avisar: ARRIBA_AVISAR, resumen: ARRIBA_RESUMEN, aviso: ARRIBA_AVISO, ceros: ARRIBA_CEROS };

export const ALTO_DIALOGO = ARRIBA_CEROS + DIALOGO.ceros + DIALOGO.relleno + DIALOGO.pie;

export const DIALOGO_X = (MEDIDAS.ancho - DIALOGO.ancho) / 2;
export const DIALOGO_Y = Math.round((MEDIDAS.alto - ALTO_DIALOGO) / 2);

export const TEXTOS_DIALOGO = {
	titulo: `Cerrar el periodo ${PERIODOS[EL_QUE_SE_CIERRA].numero} de ${ANIO}`,
	cargando: 'Mirando qué falta por calificar…',
	/** `tituloDelAviso()` sin bloquear. */
	alerta: `Quedan ${CASILLAS} casillas sin calificar en ${FALTAN.length} asignaturas`,
	/** `PeriodosController::comoSeLee('cero', abierto)`: la frase la escribe el servidor. */
	alertaDescripcion: 'Al cerrar se preguntará si lo que no se haya calificado pasa a cero; si no se confirma, queda fuera de la cuenta.',
	/** Inventado: cuántas asignaturas ya cerró su docente. */
	resumen: { cerradas: 31, asignaturas: 36 },
	enCurso: 'Es el periodo en curso: a los profesores les cambia ahora mismo. Dejarán de poder poner notas y de pasar asistencia.',
	/** `quePasaConNivelar` con destino «nivelando» y la nivelación cerrada. */
	nivelar: 'Y se abrirá la nivelación: podrán nivelar lo perdido y cambiar las definitivas.',
	ceros: `Poner en cero las ${CASILLAS} casillas vacías`,
	/** La pista de debajo de la casilla, sin marcar. */
	sinCeros: 'Se quedan vacías y no cuentan en la definitiva.',
	dejar: 'Dejarlo abierto',
	cerrar: `Cerrar el periodo ${PERIODOS[EL_QUE_SE_CIERRA].numero}`,
};

const enDialogo = (y: number, alto: number, h = 0) => ({
	x: DIALOGO_X + DIALOGO.relleno - h,
	y: DIALOGO_Y + y - h,
	ancho: DIALOGO.ancho - DIALOGO.relleno * 2 + h * 2,
	alto: alto + h * 2,
});

export function rectDeLaAlerta() {
	return enDialogo(POS_DIALOGO.alerta, DIALOGO.alerta);
}

export function rectDeLaLista() {
	return enDialogo(POS_DIALOGO.alerta, POS_DIALOGO.avisar - 12 - POS_DIALOGO.alerta, 6);
}

export function rectDelAviso() {
	return enDialogo(POS_DIALOGO.aviso, DIALOGO.aviso, 6);
}

export function rectDeLosCeros() {
	return enDialogo(POS_DIALOGO.ceros, DIALOGO.ceros, 6);
}

export const BOTON_CERRAR = { ancho: 206, alto: 40 };

export function rectDelBotonCerrar() {
	return {
		x: DIALOGO_X + DIALOGO.ancho - DIALOGO.relleno - BOTON_CERRAR.ancho,
		y: DIALOGO_Y + ALTO_DIALOGO - DIALOGO.pie + (DIALOGO.pie - BOTON_CERRAR.alto) / 2,
		ancho: BOTON_CERRAR.ancho,
		alto: BOTON_CERRAR.alto,
	};
}
