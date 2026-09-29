import { ALUMNOS } from '../../notas/planilla';
import { MEDIDAS } from '../medidas';
import { ANO_MATEMATICAS_9B, MINIMA, RECUPERACION_VALENTINA, VALENTINA, sinComa } from '../cierre-5/datos';
import { RECTOR, TITULAR_9B } from '../cierre-6/Papel';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL ACTA DE NIVELACIÓN Y RECUPERACIÓN DE 9°B (`/informes/acta-nivelacion/:grupo_id`).
 *
 * DOS SECCIONES CON REGLAS DISTINTAS (`acta-nivelacion.ts`, `cuentas-del-acta.ts`):
 *
 *   A · los INDICADORES del periodo que se nivelaron. Esos SÍ siguen la regla del año
 *       (`regla_nivelacion`); aquí es la «topada»: quien aprueba la superación queda en la mínima.
 *       Una fila registrada con OTRA regla --el colegio la cambió después-- lleva un asterisco rojo
 *       en «Queda», y la nota al pie dice que **no está mal** y que no se reescribe.
 *   B · las ASIGNATURAS DEL AÑO recuperadas. **Sin regla**: queda la nota que el docente escribió.
 *       Es la de Valentina del vídeo 5: 57 en el año, 70 en la recuperación, y aquí sale 70 --con la
 *       topada saldría 60, y por eso el acta lo explica en su propia sección--.
 *
 * INVENTADO: que el colegio pasó de «reemplaza» a «topada» el 15/11/2026, y las cuatro
 * nivelaciones de la sección A. Las dos anteriores a esa fecha son las del asterisco.
 */

export const REGLA = `La nivelación se topa en la mínima aprobatoria (${MINIMA}): quien aprueba la superación queda en la mínima.`;

export interface FilaA {
	estudiante: string;
	asignatura: string;
	indicador: string;
	inicial: number;
	superacion: number;
	queda: number;
	fecha: string;
	registro: string;
	actividad: string;
}

const n = (i: number) => sinComa(ALUMNOS[i].nombre);
const DOCENTE_INGLES = 'Ocampo Ruiz, Diego';
const DOCENTE_CIENCIAS = 'Bernal Pino, Luisa';

/** La que aplica la regla vigente: topada en la mínima si aprueba la superación. */
const topada = (sup: number) => (sup >= MINIMA ? MINIMA : sup);

export const SECCION_A: FilaA[] = [
	{ estudiante: n(3), asignatura: 'Ciencias Naturales', indicador: 'Explica el ciclo del carbono', inicial: 50, superacion: 78, queda: topada(78), fecha: '20/11/2026', registro: DOCENTE_CIENCIAS, actividad: 'Exposición y taller' },
	/* Las dos de antes del cambio: se registraron con «reemplaza», y quedaron en la de la superación. */
	{ estudiante: n(3), asignatura: 'Inglés', indicador: 'Comprende textos cortos', inicial: 45, superacion: 64, queda: 64, fecha: '07/11/2026', registro: DOCENTE_INGLES, actividad: 'Lectura guiada' },
	{ estudiante: n(5), asignatura: 'Matemáticas', indicador: 'Resuelve ecuaciones lineales', inicial: 55, superacion: 66, queda: 66, fecha: '08/11/2026', registro: TITULAR_9B, actividad: 'Taller de problemas' },
	{ estudiante: n(1), asignatura: 'Matemáticas', indicador: 'Resuelve sistemas por sustitución', inicial: 52, superacion: 70, queda: topada(70), fecha: '21/11/2026', registro: TITULAR_9B, actividad: 'Taller de sistemas' },
];

/** Una fila «no cuadra» si lo que quedó no es lo que daría hoy la regla (`loQueQueda`). */
export const discrepa = (f: FilaA) => f.queda !== topada(f.superacion);
export const CUANTAS_DISCREPAN = SECCION_A.filter(discrepa).length;

export const SECCION_B = [
	{
		estudiante: n(VALENTINA),
		asignatura: 'Matemáticas',
		definitiva: ANO_MATEMATICAS_9B[VALENTINA].ano,
		recuperacion: Number(RECUPERACION_VALENTINA),
		fecha: '25/11/2026',
		registro: TITULAR_9B,
		actividad: '',
	},
];

export const TEXTOS = {
	titulo: 'ACTA DE NIVELACIÓN Y RECUPERACIÓN',
	datos: '9°B · Periodo 4 · Año 2026',
	fecha: '27/11/2026',
	reglaRotulo: 'Regla de nivelación vigente:',
	tituloA: 'A · Nivelación de indicadores del periodo 4',
	columnasA: ['Estudiante', 'Asignatura', 'Indicador', 'Inicial', 'Superación', 'Queda', 'Fecha', 'Registró', 'Actividad de superación'],
	tituloB: 'B · Recuperación de asignaturas del año',
	notaB: ['En esta sección ', 'no se aplica la regla de nivelación del año', ': la recuperación de una asignatura se registra con la nota que el docente escribe.'],
	columnasB: ['Estudiante', 'Asignatura', 'Definitiva', 'Recuperación', 'Fecha', 'Registró', 'Actividad'],
	perdida: 'perdida',
	firmas: [
		{ nombre: TITULAR_9B, cargo: 'Titular del grupo' },
		{ cargo: 'Coordinación académica' },
		{ nombre: RECTOR.nombre, cargo: 'Rector' },
	],
	/* La pantalla. */
	pantalla: 'Acta de nivelación',
	resumen: `9°B · ${SECCION_A.length} del periodo · ${SECCION_B.length} del año`,
	queSeNivela: 'Qué se nivela',
	lasDos: 'Las dos',
	antes: 'Antes de firmarla',
	antesTexto: `${CUANTAS_DISCREPAN} filas no cuadran con la regla vigente del año. No están mal: se registraron cuando el colegio tenía otra regla, y la hoja las marca con un asterisco.`,
};

export const ANCHOS_A = [150, 108, 200, 44, 66, 46, 70, 136, 116];
export const ANCHOS_B = [190, 170, 70, 90, 90, 170, 156];
export const QUEDA = 5;

/* ── La hoja: apaisada, y dónde cae cada cosa (coordenadas de la hoja) ─────────────────────── */

export const HOJA_NIV = { ancho: 980, alto: 740 };
export const HN = { pad: 20, membrete: 56, hueco: 10, regla: 34, banda: 26, cab: 26, fila: 26, pie: 34, notaB: 24 };

export const Y_REGLA = HN.pad + HN.membrete + HN.hueco;
export const Y_A = Y_REGLA + HN.regla + 8;
export const Y_FILAS_A = Y_A + HN.banda + HN.cab;
export const Y_PIE_A = Y_FILAS_A + HN.fila * SECCION_A.length;
export const Y_B = Y_PIE_A + HN.pie + 8;
export const Y_FILAS_B = Y_B + HN.banda + HN.notaB + HN.cab;
export const Y_FIRMAS = HOJA_NIV.alto - HN.pad - 60;

export const CERCA_A = { y: Y_REGLA - 10, alto: Y_PIE_A + HN.pie - Y_REGLA + 20 };
export const CERCA_B = { y: Y_B - 10, alto: HOJA_NIV.alto - HN.pad - Y_B + 20 };

/* ── La pantalla ─────────────────────────────────────────────────────────────────────────── */

export const PN = { lados: 28, arriba: 18, barra: 64, aviso: 92, trasAviso: 18 };
export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
export const ANCHO_UTIL = ANCHO_CONTENIDO - PN.lados * 2;
export function rectanguloDelAviso() {
	return { x: PN.lados, y: PN.arriba + PN.barra, ancho: ANCHO_UTIL, alto: PN.aviso };
}
export const enLaCascara = (r: { x: number; y: number; ancho: number; alto: number }) => ({ ...r, x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra });

/* Lo que el vídeo afirma de la sección B tiene que ser verdad en los números. */
if (SECCION_B[0].recuperacion === topada(SECCION_B[0].recuperacion)) {
	throw new Error('Datos: la recuperación de la sección B tiene que ser una que la regla toparía; si no, no enseña nada.');
}
if (CUANTAS_DISCREPAN !== 2) {
	throw new Error(`Datos: el aviso y el pie dicen dos filas con asterisco, y hay ${CUANTAS_DISCREPAN}.`);
}
