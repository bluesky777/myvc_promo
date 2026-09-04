/*
 * LOS DATOS QUE SE VEN. Nombres inventados a propósito: esto se enseña fuera del colegio.
 *
 * LA ESCALA ES DE 0 A 100, que es la de la casa (`nota_minima_aceptada` llega como entero y las
 * pantallas redondean). 60 es el mínimo aceptado, que es el valor más común en los colegios que ya
 * usan el sistema.
 */

export const MINIMA_ACEPTADA = 60;

/** De aquí para arriba, la nota se pinta en azul: es la escala más alta. */
export const NOTA_ALTA = 90;

export interface Alumno {
	nombre: string;
	/** Para el avatar. La foto va dibujada, no es una imagen: ver `comunes/Avatar.tsx`. */
	sexo: 'mujer' | 'hombre';
	/** Taller, Quiz, Examen. `null` es la casilla vacía. */
	notas: (number | null)[];
}

export const ALUMNOS: Alumno[] = [
	{ nombre: 'Acosta Rivera, Sara Isabel', sexo: 'mujer', notas: [88, 91, 84] },
	{ nombre: 'Bermúdez Ochoa, Juan David', sexo: 'hombre', notas: [74, null, 71] },
	{ nombre: 'Cardona Ruiz, Mariana', sexo: 'mujer', notas: [95, 92, 97] },
	{ nombre: 'Delgado Peña, Samuel', sexo: 'hombre', notas: [69, null, 73] },
	{ nombre: 'Escobar Lozano, Valentina', sexo: 'mujer', notas: [58, null, 62] },
	{ nombre: 'Fajardo Mejía, Tomás Andrés', sexo: 'hombre', notas: [81, 79, 85] },
];

export const COLUMNAS = ['Taller', 'Quiz', 'Examen'];

export const UNIDAD = 'Unidad 2 · Álgebra';

export const CABECERA = {
	asignatura: 'Matemáticas',
	grupo: '9°B',
	periodo: 'Periodo 2',
};

/** El promedio de la fila: se calcula, no se guarda. Igual que el «Total» de la planilla. */
export function total(notas: (number | null)[]): number | null {
	const puestas = notas.filter((n): n is number => n !== null);
	if (puestas.length === 0) { return null; }
	return Math.round(puestas.reduce((a, b) => a + b, 0) / puestas.length);
}
