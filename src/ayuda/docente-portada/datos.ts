import { VOCABULARIO } from '../../comunes/vocabulario';
import { MEDIDAS } from '../medidas';
import { ASIGNATURAS } from '../planilla/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN LA PORTADA DEL DOCENTE (la ruta raíz, «Inicio»), Y DÓNDE CAE.
 *
 * LA PANTALLA ES LA DE app2 (`paginas/panel/inicio/inicio.html`) para un docente: sin saludo y sin
 * fecha --se quitaron a propósito--, y una rejilla de dos columnas (1,85fr / 0,85fr):
 *
 *     izquierda   «Clases de hoy» y debajo los azulejos de alumnos por grupo
 *     derecha     «Lo que viene» y «Avisos del colegio»
 *
 * LAS CLASES SON LAS DE SIEMPRE: las cuatro asignaturas de «Mis asignaturas» (`planilla/datos.ts`),
 * con los mismos colores y siglas. Hoy es lunes 28 de septiembre --el mismo «hoy» de
 * `docente-asistencia`--, y los lunes el docente tiene 8°A, 9°B y 10°A.
 *
 * SIN HORARIO OFICIAL, que es el caso que el vídeo enseña: la lista sale de los días marcados en
 * cada asignatura (`asignaturas.lunes … domingo`) y **no lleva hora**. Con horario oficial la lista
 * sale del horario, con hora; el vídeo lo dice pero no lo dibuja.
 *
 * LOS TRES LOGROS DE 9°B: el 1 y el 3 sin indicadores y el 2, «Álgebra», con los tres de la planilla.
 * Así cuadran «3 Logros» de Mis asignaturas y «Logro 2 · Álgebra» de la planilla; las definiciones
 * son las mismas que usa `cierre-1` en Notas perdidas.
 */

const de = (materia: string, grupo: string) => ASIGNATURAS.find((a) => a.materia === materia && a.grupo === grupo)!;

export const CLASES_HOY = [de('Ciencias Naturales', '8°A'), de('Matemáticas', '9°B'), de('Estadística', '10°A')];
export const CLASES_MANANA = [de('Matemáticas', '9°A'), de('Ciencias Naturales', '8°A')];

/** La que se abre: 9°B, la segunda de hoy. */
export const LA_QUE_SE_ABRE = CLASES_HOY.findIndex((a) => a.grupo === '9°B');

export const UNIDADES_9B = [
	{ definicion: 'Números reales', indicadores: [] as string[] },
	{
		definicion: 'Álgebra',
		indicadores: [
			'Resuelve ecuaciones lineales con una incógnita',
			'Plantea ecuaciones a partir de un problema',
			'Interpreta la solución de un sistema de ecuaciones',
		],
	},
	/* El 3, sin indicadores todavía: son los «3 Logros» que dice la fila de 9°B en Mis asignaturas. */
	{ definicion: 'Funciones', indicadores: [] as string[] },
];

export const BOTON_UNIDADES = `Ir a ${VOCABULARIO.unidades}`;
export const SIN_INDICADOR = `Sin ${VOCABULARIO.subunidad.toLowerCase()} — se crean en «${BOTON_UNIDADES}».`;

export const LO_QUE_VIENE: { dia: string; cosas: { hora?: string; texto: string; cumple?: boolean; soloPersonal?: boolean }[] }[] = [
	{ dia: 'HOY', cosas: [{ texto: '2 cumpleaños', cumple: true }] },
	{ dia: 'MAÑANA', cosas: [{ hora: '10:00', texto: 'Reunión del área de Matemáticas', soloPersonal: true }] },
	{ dia: 'JUE 1 OCT', cosas: [{ texto: 'Cierre de notas del periodo 2' }] },
	{ dia: 'VIE 2 OCT', cosas: [{ hora: '07:00', texto: 'Izada de bandera' }] },
];

export const AVISOS_DEL_COLEGIO = [
	{ autor: 'Luz Marina Ospina', fecha: '25 de septiembre', texto: 'Recordamos que el cierre de notas del periodo 2 es el jueves 1 de octubre.' },
	{ autor: 'El colegio', fecha: '22 de septiembre', texto: 'La salida pedagógica de noveno se aplaza al viernes 9 de octubre.', comentarios: 3 },
];

export const AZULEJOS = [
	{ rotulo: 'MATRICULADOS', cifra: '412', apunte: 'alumnos' },
	{ rotulo: 'GRUPOS', cifra: '14', apunte: '' },
	{ rotulo: 'HOMBRES · MUJERES', cifra: '204 / 208', apunte: '' },
];

/* ── La geometría, en coordenadas del CONTENIDO (a la derecha del menú, debajo de la barra) ─── */

export const ANCHO = MEDIDAS.ancho - MEDIDAS.menu;
export const P = {
	lados: 32,
	arriba: 28,
	hueco: 24,
	cabecera: 46,
	/** De la raya de la cabecera a la primera fila. */
	bajoCabecera: 16,
	fila: 60,
	entreFilas: 8,
};

export const COL_IZQ = { x: P.lados, ancho: Math.round((ANCHO - P.lados * 2 - P.hueco) * (1.85 / 2.7)) };
export const COL_DER = { x: COL_IZQ.x + COL_IZQ.ancho + P.hueco, ancho: ANCHO - P.lados * 2 - P.hueco - COL_IZQ.ancho };

/* El panel que se despliega debajo de la fila abierta. */
export const DESPLIEGUE = {
	relleno: 14,
	botones: 38,
	caja: { relleno: 12, titulo: 26, linea: 34, hueco: 6 },
	entreCajas: 10,
};

export function altoDeCaja(indicadores: number): number {
	const c = DESPLIEGUE.caja;
	const lineas = Math.max(1, indicadores);
	return c.relleno * 2 + c.titulo + 8 + lineas * c.linea + (lineas - 1) * c.hueco;
}

export const ALTO_DESPLIEGUE =
	DESPLIEGUE.relleno * 2 + DESPLIEGUE.botones + 12 +
	UNIDADES_9B.reduce((s, u, i) => s + altoDeCaja(u.indicadores.length) + (i > 0 ? DESPLIEGUE.entreCajas : 0), 0);

type Rect = { x: number; y: number; ancho: number; alto: number };

/** La fila `i` de las clases; si `abierta` va antes, las de después bajan lo que mide el despliegue. */
export function rectDeFila(i: number, abierta: number | null): Rect {
	const y0 = P.arriba + P.cabecera + P.bajoCabecera;
	const empuje = abierta !== null && i > abierta ? ALTO_DESPLIEGUE : 0;
	return { x: COL_IZQ.x, y: y0 + i * (P.fila + P.entreFilas) + empuje, ancho: COL_IZQ.ancho, alto: P.fila };
}

export const BOTONES_DESPLIEGUE = { asistencia: 158, unidades: 170 };

export function rectDeBoton(cual: 'asistencia' | 'unidades'): Rect {
	const fila = rectDeFila(LA_QUE_SE_ABRE, null);
	const y = fila.y + fila.alto + DESPLIEGUE.relleno;
	const x0 = fila.x + DESPLIEGUE.relleno;
	return cual === 'asistencia'
		? { x: x0, y, ancho: BOTONES_DESPLIEGUE.asistencia, alto: DESPLIEGUE.botones }
		: { x: x0 + BOTONES_DESPLIEGUE.asistencia + 10, y, ancho: BOTONES_DESPLIEGUE.unidades, alto: DESPLIEGUE.botones };
}

/** El bloque de «Clases de hoy» entero: cabecera y filas, cerrado. */
export function rectDeClases(n: number): Rect {
	const ultima = rectDeFila(n - 1, null);
	return { x: COL_IZQ.x - 6, y: P.arriba - 6, ancho: COL_IZQ.ancho + 12, alto: ultima.y + ultima.alto - P.arriba + 12 };
}

/** El enlace «Mañana…», a la derecha de la cabecera. */
export const MANANA = { x: COL_IZQ.x + COL_IZQ.ancho - 96, y: P.arriba + 6, ancho: 96, alto: 32 };

/** La columna de la derecha entera. */
export const RECT_DERECHA: Rect = { x: COL_DER.x - 8, y: P.arriba - 6, ancho: COL_DER.ancho + 16, alto: 580 };

/** De coordenadas del contenido a las de la cáscara. */
export const enLaCascara = (r: Rect): Rect => ({ x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra, ancho: r.ancho, alto: r.alto });
