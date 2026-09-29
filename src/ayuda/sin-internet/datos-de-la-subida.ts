import { ARCHIVO } from './datos';
import { DESCARGADA, DOCENTE } from './datos-del-libro';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE DICE LA PANTALLA «SUBIR UNA PLANILLA» AL LEER EL LIBRO, inventado pero cuadrado.
 *
 * Es el libro del vídeo anterior (`datos-del-libro.ts`), ya relleno: en 9B Matemáticas la nota que
 * faltaba y la borrada con guion; en 9A Matemáticas catorce notas nuevas, veintiocho en una columna
 * de reserva (una exposición), tres que chocan con cambios hechos en la web, y los totales de
 * ausencias de dos alumnos cambiados. 9B Geometría y 10A Estadística, sin tocar.
 *
 * LAS CIFRAS SE SUMAN AQUÍ, NO SE ESCRIBEN A MANO EN CADA PANTALLA: el resumen de antes y el de
 * después de volver a leer salen de las mismas cuentas, y si una cambia, cambian las dos.
 */

export { ARCHIVO, DESCARGADA, DOCENTE };
export const DESCARGADO_EL = DESCARGADA.split(' ')[0];

export const HOJAS_DEL_LIBRO = 4;
export const CASILLAS = 352;

export interface HojaLeida {
	nombre: string;
	asignatura: string;
	alumnos: number;
	problemas: number;
	cambiaron: number;
	entran: number;
}

/* ── Lo que cambió ────────────────────────────────────────────────────────────────────────── */

export const NUEVAS_9B = 1;
export const BORRADAS_9B = 1;
export const NUEVAS_9A = 14;
export const EN_LA_RESERVA = 28;

export const RESERVA = {
	hoja: '9A Matemáticas',
	columna: 'G',
	numero: 4,
	unidad: 'Resuelve y plantea ecuaciones lineales',
	notas: EN_LA_RESERVA,
	pesoSugerido: 20,
	nombre: 'Exposición oral',
};

export interface Choque {
	alumno: string;
	indicador: string;
	archivo: number;
	sistema: number;
	cuando: string;
}

export const CHOQUES: Choque[] = [
	{ alumno: 'Ospina Vélez, Mariana', indicador: '9A · Matemáticas · Indicador 2', archivo: 78, sistema: 82, cuando: '24/09/2026 · Diana Marcela Rueda' },
	{ alumno: 'Quintero Ríos, Samuel', indicador: '9A · Matemáticas · Indicador 1', archivo: 65, sistema: 70, cuando: '25/09/2026 · Diana Marcela Rueda' },
	{ alumno: 'Zapata Mejía, Daniela', indicador: '9A · Matemáticas · Indicador 3', archivo: 90, sistema: 88, cuando: '26/09/2026 · no consta quién' },
];
/** La que se decide a mano en el vídeo 4: manda el archivo. */
export const EL_CHOQUE_A_MANO = 2;

export interface CambioDeAusencias {
	alumno: string;
	enElSistema: number;
	enElLibro: number;
}

export const SE_ANADEN: CambioDeAusencias[] = [
	{ alumno: 'Ospina Vélez, Mariana', enElSistema: 1, enElLibro: 3 },
];
export const SE_BORRAN: CambioDeAusencias[] = [
	{ alumno: 'Pardo Gil, Martín', enElSistema: 2, enElLibro: 1 },
];
export const FILAS_QUE_SE_ANADEN = SE_ANADEN.reduce((n, c) => n + c.enElLibro - c.enElSistema, 0);
export const FILAS_QUE_SE_BORRAN = SE_BORRAN.reduce((n, c) => n + c.enElSistema - c.enElLibro, 0);

/* ── Las cuentas ──────────────────────────────────────────────────────────────────────────── */

export interface Cuentas {
	entran: number;
	seBorran: number;
	fuera: number;
	descartadas: number;
	definitivas: number;
}

/** Lo que entra según las decisiones: si se crea el indicador, y cuántos choques gana el archivo. */
export function cuentas(creaElIndicador: boolean, choquesDelArchivo: number): Cuentas {
	return {
		entran: NUEVAS_9B + NUEVAS_9A + (creaElIndicador ? EN_LA_RESERVA : 0) + choquesDelArchivo,
		seBorran: BORRADAS_9B,
		fuera: CHOQUES.length - choquesDelArchivo + (creaElIndicador ? 0 : EN_LA_RESERVA),
		descartadas: 0,
		definitivas: 2,
	};
}

export const HOJAS_LEIDAS: HojaLeida[] = [
	{ nombre: '9B Matemáticas', asignatura: '9°B · Matemáticas', alumnos: 30, problemas: 0, cambiaron: NUEVAS_9B + BORRADAS_9B, entran: NUEVAS_9B },
	{ nombre: '9A Matemáticas', asignatura: '9°A · Matemáticas', alumnos: 31, problemas: 3, cambiaron: NUEVAS_9A + EN_LA_RESERVA + CHOQUES.length, entran: NUEVAS_9A },
];
export const HOJAS_EN_CERO = HOJAS_DEL_LIBRO - HOJAS_LEIDAS.length;

/** Los pasos que salen con este libro, en el orden de `pasosDeLaSubida` (planilla-offline.ts). */
export const PASOS_DE_LA_SUBIDA = [
	{ clave: 'archivo', etiqueta: 'Archivo', contador: null },
	{ clave: 'reserva', etiqueta: 'Columnas nuevas', contador: 1 },
	{ clave: 'choques', etiqueta: 'Choques', contador: CHOQUES.length },
	{ clave: 'ausencias', etiqueta: 'Ausencias', contador: FILAS_QUE_SE_ANADEN + FILAS_QUE_SE_BORRAN },
	{ clave: 'resumen', etiqueta: 'Qué va a pasar', contador: null },
] as const;

/** Los que NO salen, porque este libro no tiene ese problema. */
export const PASOS_QUE_NO_SALEN = ['Estructura', 'Celdas', 'Alumnos'];

export type ClaveDePaso = (typeof PASOS_DE_LA_SUBIDA)[number]['clave'];
