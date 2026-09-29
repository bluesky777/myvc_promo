import { DOCENTES, SEPTIMO_A, nombreDe } from '../informes/gente';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN EL SEMÁFORO DE 7°A. Todo inventado: los alumnos son los de `informes/gente.ts`,
 * y las notas y las faltas se escribieron a mano. María José lleva las mismas notas que su boletín
 * del vídeo de ajustes (57 en Ciencias naturales).
 */

export interface MateriaDelSemaforo {
	materia: string;
	docente: string;
	nota: number;
	/** «A/T»: ausencias / tardanzas de la asignatura. */
	at: string;
}

export interface AlumnoDelSemaforo {
	nombre: string;
	sexo: 'mujer' | 'hombre';
	variante: number;
	materias: MateriaDelSemaforo[];
	tardanzas: number;
	ausencias: number;
	situaciones: number;
	perdidas: number;
}

const materias = (notas: number[], at: string[]): MateriaDelSemaforo[] =>
	DOCENTES.map((d, i) => ({ materia: d.materia, docente: d.nombre, nota: notas[i], at: at[i] }));

const JUAN_PABLO = SEPTIMO_A[0];
const MARIA_JOSE = SEPTIMO_A[1];

export const ALUMNOS: AlumnoDelSemaforo[] = [
	{
		nombre: nombreDe(JUAN_PABLO),
		sexo: JUAN_PABLO.sexo,
		variante: JUAN_PABLO.variante,
		materias: materias([58, 72, 81, 76, 64, 97, 88, 83, 90, 85], ['2/0', '0/0', '1/0', '0/1', '0/0', '0/0', '0/0', '0/0', '0/0', '0/0']),
		tardanzas: 1,
		ausencias: 3,
		situaciones: 1,
		perdidas: 1,
	},
	{
		nombre: nombreDe(MARIA_JOSE),
		sexo: MARIA_JOSE.sexo,
		variante: MARIA_JOSE.variante,
		materias: materias([74, 82, 57, 88, 91, 95, 79, 86, 90, 84], ['0/0', '0/0', '2/1', '0/0', '0/0', '1/0', '0/0', '0/0', '0/0', '0/0']),
		tardanzas: 1,
		ausencias: 3,
		situaciones: 0,
		perdidas: 1,
	},
];

/** La hoja de riesgo de 7°A: las cuatro cifras y quién va en rojo. */
export const RIESGO = {
	cifras: [
		{ n: 6, texto: 'de 20 con alguna perdida', alarma: false },
		{ n: 1, texto: 'con 3 o más', alarma: true },
		{ n: 1, texto: 'con 10 ausencias o más', alarma: true },
		{ n: 2, texto: 'con situaciones abiertas', alarma: false },
	],
	filas: [
		{ nombre: 'Galvis Rendón Miguel Ángel', perdidas: 3, cuales: 'Matemáticas, Inglés, Ciencias naturales', ausencias: 11, tardanzas: 2, situaciones: 1 },
		{ nombre: 'Marulanda Gil Jerónimo', perdidas: 2, cuales: 'Matemáticas, Lengua castellana', ausencias: 4, tardanzas: 0, situaciones: 0 },
		{ nombre: 'Agudelo Sierra Juan Pablo', perdidas: 1, cuales: 'Matemáticas', ausencias: 3, tardanzas: 1, situaciones: 1 },
		{ nombre: 'Arboleda Cuesta María José', perdidas: 1, cuales: 'Ciencias naturales', ausencias: 3, tardanzas: 1, situaciones: 0 },
		{ nombre: 'Ocampo Restrepo Matías', perdidas: 1, cuales: 'Inglés', ausencias: 6, tardanzas: 3, situaciones: 0 },
		{ nombre: 'Villegas Mora Gabriela', perdidas: 1, cuales: 'Tecnología', ausencias: 1, tardanzas: 0, situaciones: 0 },
	],
};

export const HOY = '28/09/2026';
export const ENTREGA = '02/10/2026';
