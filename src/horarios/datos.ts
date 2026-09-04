/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL COLEGIO DEL CLIP. Pequeño a propósito: **tres días y cinco franjas**, cinco grupos.
 *
 * El colegio que se está midiendo de verdad tiene 13 grupos × 35 casillas, y ésa es la rejilla que
 * el coordinador ve. Pero 455 casillas en un vídeo son una cuadrícula de puntos: no se distingue la
 * ficha que se mueve, que es lo único que hay que mirar. Se enseña un trozo legible de la misma
 * pantalla, con las mismas reglas.
 */

export const DIAS = ['Lunes', 'Martes', 'Miércoles'];
export const FRANJAS = [1, 2, 3, 4, 5];

/** La jornada entera para la disponibilidad del salón: ahí sí se ven los cinco días. */
export const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const FRANJAS_SEMANA = [1, 2, 3, 4, 5, 6, 7];

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL SALÓN «IGLESIA», Y POR QUÉ ES EL EJEMPLO BUENO
 *
 * Un colegio adventista tiene iglesia, y la iglesia **no es un aula**: se usa para el culto, para
 * ensayos, para actos. Está libre dos horas a la semana y ya. Eso, dicho en la pantalla de
 * disponibilidad, es 33 casillas con ✕ y dos en blanco -- y a partir de ahí el generador **no puede**
 * poner ahí nada más, por bien que le viniera.
 *
 * Es el caso que explica para qué sirve la pantalla mejor que cualquier docente con una tarde libre.
 */
export const SALONES = [
	{ nombre: 'Aula 9°B', marcas: 0 },
	{ nombre: 'Laboratorio', marcas: 8 },
	{ nombre: 'Iglesia', marcas: 0 },
	{ nombre: 'Coliseo', marcas: 4 },
	{ nombre: 'Sala de sistemas', marcas: 0 },
];

export const SALON_ELEGIDO = 2;

/** Lo único que la iglesia deja libre: la tercera hora del martes y la del miércoles. */
export const LIBRES_EN_IGLESIA = [
	{ dia: 1, franja: 3 },
	{ dia: 2, franja: 3 },
];

export function estaLibreEnIglesia(dia: number, franja: number): boolean {
	return LIBRES_EN_IGLESIA.some((l) => l.dia === dia && l.franja === franja);
}

/* ── La rejilla ───────────────────────────────────────────────────────────────────────────── */

export interface Ficha {
	materia: string;
	docente: string;
	tono: number;
	icono: string;
}

/** El catálogo: abreviatura, quién la da, su tono y el dibujo del informe. */
export const CATALOGO: Record<string, Ficha> = {
	MAT: { materia: 'MAT', docente: 'J. Ochoa', tono: 210, icono: 'matematicas' },
	LEN: { materia: 'LEN', docente: 'M. Ruiz', tono: 24, icono: 'lengua' },
	ING: { materia: 'ING', docente: 'S. Peña', tono: 150, icono: 'ingles' },
	REL: { materia: 'REL', docente: 'A. Mejía', tono: 275, icono: 'religion' },
	SOC: { materia: 'SOC', docente: 'C. Lozano', tono: 45, icono: 'sociales' },
	NAT: { materia: 'NAT', docente: 'D. Cardona', tono: 110, icono: 'naturales' },
	EDF: { materia: 'EDF', docente: 'R. Bermúdez', tono: 320, icono: 'deporte' },
	ART: { materia: 'ART', docente: 'L. Salazar', tono: 340, icono: 'artistica' },
	QUI: { materia: 'QUI', docente: 'V. Torres', tono: 185, icono: 'quimica' },
	TEC: { materia: 'TEC', docente: 'N. Gómez', tono: 250, icono: 'tecnologia' },
};

export const GRUPOS = ['6°A', '7°A', '8°B', '9°B', '10°A'];

/*
 * LA REJILLA LLENA. Cada fila es un grupo y cada casilla la abreviatura de lo que tiene puesto.
 * `null` es una casilla libre -- y hay pocas a propósito: el clip empieza con el horario **ya
 * cuadrado**, que es de donde parte un coordinador que retoca.
 */
export const REJILLA: (string | null)[][] = [
	['MAT', 'MAT', 'LEN', 'ING', 'REL', 'SOC', 'NAT', 'EDF', 'MAT', 'LEN', 'ART', 'QUI', 'MAT', 'ING', 'TEC'],
	['LEN', 'ING', 'MAT', 'NAT', 'SOC', 'MAT', 'REL', 'LEN', 'TEC', 'EDF', 'MAT', 'ART', 'ING', 'QUI', 'SOC'],
	['SOC', 'NAT', 'EDF', 'MAT', 'LEN', 'ING', 'MAT', 'QUI', 'REL', 'SOC', 'LEN', 'MAT', 'TEC', 'ART', 'ING'],
	['ING', 'REL', 'MAT', 'LEN', 'QUI', 'NAT', 'ART', 'MAT', 'SOC', 'ING', 'EDF', 'LEN', 'MAT', 'TEC', 'NAT'],
	['NAT', 'LEN', 'SOC', 'ART', 'MAT', 'EDF', 'ING', 'REL', 'LEN', 'MAT', 'QUI', 'TEC', 'SOC', 'MAT', 'ING'],
];

/** De dónde sale la ficha que se mueve, y a dónde va. Fila y columna de `REJILLA`. */
export const ORIGEN = { fila: 1, columna: 4 };   /* 7°A, lunes 5ª — «SOC» */
export const DESTINO = { fila: 1, columna: 12 }; /* 7°A, miércoles 3ª — donde hay «ING» */

/** Lo que ya había en la bandeja antes de tocar nada. */
export const BANDEJA = [
	{ etiqueta: '10°A · FIL', docente: 'P. Arango', tono: 60 },
	{ etiqueta: '8°B · ECO', docente: 'H. Vélez', tono: 200 },
];

/* ── El informe ───────────────────────────────────────────────────────────────────────────── */

export const COLEGIO = 'Colegio Adventista del Norte';
export const ANIO = '2026';
export const GRUPO_DEL_INFORME = '9°B';

export const TIMBRES = [
	{ inicio: '06:30', fin: '07:20' },
	{ inicio: '07:20', fin: '08:10' },
	{ inicio: '08:30', fin: '09:20' },
	{ inicio: '09:20', fin: '10:10' },
	{ inicio: '10:30', fin: '11:20' },
	{ inicio: '11:20', fin: '12:10' },
];

/** La hoja del 9°B: seis franjas por cinco días. Es la fila 3 de la rejilla, ya cuadrada. */
export const HOJA: string[][] = [
	['MAT', 'ING', 'LEN', 'NAT', 'MAT'],
	['MAT', 'REL', 'QUI', 'ART', 'ING'],
	['LEN', 'MAT', 'SOC', 'MAT', 'TEC'],
	['ING', 'LEN', 'EDF', 'ING', 'LEN'],
	['QUI', 'NAT', 'MAT', 'SOC', 'MAT'],
	['REL', 'ART', 'ING', 'TEC', 'NAT'],
];

export const SALON_DE = (m: string): string | null => (m === 'QUI' ? 'Laboratorio' : m === 'EDF' ? 'Coliseo' : m === 'REL' ? 'Iglesia' : m === 'TEC' ? 'Sala de sistemas' : null);
