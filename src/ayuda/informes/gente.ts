/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA GENTE DE LA SERIE «INFORMES». TODO INVENTADO: nombres, documentos, teléfonos y notas se
 * escribieron a mano para estos vídeos. No sale de ninguna base, prueba ni captura. Las caras son
 * el avatar dibujado (`comunes/Avatar.tsx`), por su `sexo` y su `variante`.
 */

export interface Alumno {
	apellidos: string;
	nombres: string;
	sexo: 'mujer' | 'hombre';
	variante: number;
}

/** 7°A, el grupo que sale en casi todos los papeles de la serie. Por apellidos, como en la aplicación. */
export const SEPTIMO_A: Alumno[] = [
	{ apellidos: 'Agudelo Sierra', nombres: 'Juan Pablo', sexo: 'hombre', variante: 1 },
	{ apellidos: 'Arboleda Cuesta', nombres: 'María José', sexo: 'mujer', variante: 2 },
	{ apellidos: 'Barrera Quintero', nombres: 'Santiago', sexo: 'hombre', variante: 3 },
	{ apellidos: 'Cáceres Montoya', nombres: 'Luciana', sexo: 'mujer', variante: 4 },
	{ apellidos: 'Castrillón Vega', nombres: 'Emmanuel', sexo: 'hombre', variante: 5 },
	{ apellidos: 'Duarte Pineda', nombres: 'Isabella', sexo: 'mujer', variante: 6 },
	{ apellidos: 'Galvis Rendón', nombres: 'Miguel Ángel', sexo: 'hombre', variante: 7 },
	{ apellidos: 'Henao Buitrago', nombres: 'Salomé', sexo: 'mujer', variante: 8 },
	{ apellidos: 'Jaramillo Ortiz', nombres: 'Daniel Felipe', sexo: 'hombre', variante: 2 },
	{ apellidos: 'Londoño Parra', nombres: 'Antonella', sexo: 'mujer', variante: 3 },
	{ apellidos: 'Marulanda Gil', nombres: 'Jerónimo', sexo: 'hombre', variante: 4 },
	{ apellidos: 'Muñoz Carvajal', nombres: 'Sara Sofía', sexo: 'mujer', variante: 5 },
	{ apellidos: 'Ocampo Restrepo', nombres: 'Matías', sexo: 'hombre', variante: 6 },
	{ apellidos: 'Palacio Serna', nombres: 'Violeta', sexo: 'mujer', variante: 7 },
	{ apellidos: 'Quiceno Arias', nombres: 'Samuel David', sexo: 'hombre', variante: 8 },
	{ apellidos: 'Rengifo Tabares', nombres: 'Mariana', sexo: 'mujer', variante: 1 },
	{ apellidos: 'Salazar Uribe', nombres: 'Tomás', sexo: 'hombre', variante: 2 },
	{ apellidos: 'Tobón Giraldo', nombres: 'Valeria', sexo: 'mujer', variante: 3 },
	{ apellidos: 'Urrego Zapata', nombres: 'Martín', sexo: 'hombre', variante: 4 },
	{ apellidos: 'Villegas Mora', nombres: 'Gabriela', sexo: 'mujer', variante: 5 },
];

export const nombreDe = (a: Alumno) => `${a.apellidos} ${a.nombres}`;

/** Los docentes, con la asignatura que dan en 7°A. */
export const DOCENTES = [
	{ nombre: 'Beatriz Elena Cortés Ramírez', materia: 'Matemáticas', alias: 'MAT' },
	{ nombre: 'Hernán Darío Pulgarín Soto', materia: 'Lengua castellana', alias: 'LEN' },
	{ nombre: 'Claudia Patricia Vélez Marín', materia: 'Ciencias naturales', alias: 'CNA' },
	{ nombre: 'Óscar Iván Betancur Ríos', materia: 'Ciencias sociales', alias: 'SOC' },
	{ nombre: 'Natalia Andrea Gómez Osorio', materia: 'Inglés', alias: 'ING' },
	{ nombre: 'Fabio Alberto Mesa Correa', materia: 'Educación física', alias: 'EDF' },
	{ nombre: 'Luz Adriana Ramírez Toro', materia: 'Artística', alias: 'ART' },
	{ nombre: 'Jairo Andrés Holguín Pérez', materia: 'Tecnología', alias: 'TEC' },
	{ nombre: 'Gloria Inés Castaño Duque', materia: 'Ética y valores', alias: 'ETI' },
	{ nombre: 'Rubén Darío Echeverri Soto', materia: 'Religión', alias: 'REL' },
];

/** La titular de 7°A. */
export const TITULAR_7A = 'Beatriz Elena Cortés Ramírez';

/** La escala del colegio inventado (la nacional con 60 de mínima), como en `certificado-imprimir`. */
export const ESCALA = [
	{ nombre: 'BAJO', desde: 0, hasta: 59 },
	{ nombre: 'BÁSICO', desde: 60, hasta: 79 },
	{ nombre: 'ALTO', desde: 80, hasta: 94 },
	{ nombre: 'SUPERIOR', desde: 95, hasta: 100 },
];
export const MINIMA = 60;
export const desempeno = (n: number) => ESCALA.find((e) => n >= e.desde && n <= e.hasta)?.nombre ?? '';
