/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL COLEGIO DE LA SERIE «MONTAR EL AÑO»: sus quince grupos, sus docentes y lo que dicta cada uno.
 *
 * **TODO INVENTADO**, como en el resto de vídeos: esto se publica en YouTube. Ningún nombre sale de
 * fixtures, seeds ni capturas de `myvc_front`.
 *
 * Y TODO COHERENTE CON LOS VÍDEOS QUE YA ESTÁN: Ana María Herrera Lugo es la titular de 9°B y dicta
 * Matemáticas en 9°B y 9°A, Ciencias Naturales en 8°A y Estadística en 10°A (`planilla/datos.ts`);
 * las demás materias de 9°B y sus docentes son las del boletín de `competencias/datos.ts`. 9°B tiene
 * 38 alumnos, que es el «Puesto: 3/38» de aquel boletín.
 *
 * Los seis vídeos cuentan momentos distintos del mismo colegio (antes de crear 11°A, con 9°B vacío,
 * con Biología ya cambiada…), pero siempre sobre esta lista: cada vídeo toma de aquí y cambia lo
 * suyo, nunca inventa otra.
 */

export interface Docente {
	/** `nombres apellidos`, que es como lo compone la aplicación: no existe `nombre_completo`. */
	nombre: string;
	/** El nombre de pila con el que lo llaman los rótulos. */
	corto: string;
	tipo: 'mujer' | 'hombre';
	variante: number;
}

export const DOCENTES = {
	herrera: { nombre: 'Ana María Herrera Lugo', corto: 'Ana María', tipo: 'mujer', variante: 1 },
	ocampo: { nombre: 'Diego Ocampo Ruiz', corto: 'Diego', tipo: 'hombre', variante: 3 },
	bernal: { nombre: 'Luisa Bernal Pino', corto: 'Luisa', tipo: 'mujer', variante: 4 },
	zapata: { nombre: 'Marcela Zapata Iregui', corto: 'Marcela', tipo: 'mujer', variante: 2 },
	salcedo: { nombre: 'Andrés Salcedo Rúa', corto: 'Andrés', tipo: 'hombre', variante: 5 },
	pena: { nombre: 'Óscar Iván Peña Salazar', corto: 'Óscar', tipo: 'hombre', variante: 0 },
	rojas: { nombre: 'Sandra Milena Rojas Duque', corto: 'Sandra', tipo: 'mujer', variante: 5 },
	quintero: { nombre: 'Paola Andrea Quintero Mesa', corto: 'Paola', tipo: 'mujer', variante: 3 },
	castro: { nombre: 'Gloria Inés Castro Ríos', corto: 'Gloria', tipo: 'mujer', variante: 0 },
	ortiz: { nombre: 'Yamile Ortiz Bermúdez', corto: 'Yamile', tipo: 'mujer', variante: 4 },
	soto: { nombre: 'Liliana Patricia Soto Galvis', corto: 'Liliana', tipo: 'mujer', variante: 2 },
	lozano: { nombre: 'Jorge Enrique Lozano Rincón', corto: 'Jorge', tipo: 'hombre', variante: 1 },
	duarte: { nombre: 'Carolina Duarte Villa', corto: 'Carolina', tipo: 'mujer', variante: 1 },
	alzate: { nombre: 'Mauricio Alzate Henao', corto: 'Mauricio', tipo: 'hombre', variante: 2 },
	munoz: { nombre: 'Beatriz Elena Muñoz Cano', corto: 'Beatriz', tipo: 'mujer', variante: 5 },
	velez: { nombre: 'Hernán Darío Vélez Mora', corto: 'Hernán', tipo: 'hombre', variante: 4 },
} satisfies Record<string, Docente>;

export type ClaveDocente = keyof typeof DOCENTES;

export interface Grupo {
	orden: number;
	nombre: string;
	abrev: string;
	grado: string;
	titular: ClaveDocente;
	alumnos: number;
	cupo: number;
	/** `grupos.ih`: las horas de clase del grupo a la semana. Contra ella cuadran sus asignaturas. */
	ih: number;
}

/* Quince, que es lo que la propia aplicación dice que tiene un año («los grupos de un año son quince»). */
export const GRUPOS: Grupo[] = [
	{ orden: 1, nombre: 'Prejardín', abrev: 'PJ', grado: 'Prejardín', titular: 'quintero', alumnos: 12, cupo: 15, ih: 25 },
	{ orden: 2, nombre: 'Jardín', abrev: 'J', grado: 'Jardín', titular: 'quintero', alumnos: 14, cupo: 15, ih: 25 },
	{ orden: 3, nombre: 'Transición', abrev: 'T', grado: 'Transición', titular: 'quintero', alumnos: 16, cupo: 20, ih: 25 },
	{ orden: 4, nombre: '1°A', abrev: '1A', grado: 'Primero', titular: 'castro', alumnos: 28, cupo: 30, ih: 25 },
	{ orden: 5, nombre: '2°A', abrev: '2A', grado: 'Segundo', titular: 'ortiz', alumnos: 30, cupo: 30, ih: 25 },
	{ orden: 6, nombre: '3°A', abrev: '3A', grado: 'Tercero', titular: 'soto', alumnos: 27, cupo: 30, ih: 25 },
	{ orden: 7, nombre: '4°A', abrev: '4A', grado: 'Cuarto', titular: 'lozano', alumnos: 31, cupo: 32, ih: 25 },
	{ orden: 8, nombre: '5°A', abrev: '5A', grado: 'Quinto', titular: 'duarte', alumnos: 29, cupo: 32, ih: 25 },
	{ orden: 9, nombre: '6°A', abrev: '6A', grado: 'Sexto', titular: 'alzate', alumnos: 36, cupo: 38, ih: 30 },
	{ orden: 10, nombre: '7°A', abrev: '7A', grado: 'Séptimo', titular: 'munoz', alumnos: 35, cupo: 38, ih: 30 },
	{ orden: 11, nombre: '8°A', abrev: '8A', grado: 'Octavo', titular: 'bernal', alumnos: 34, cupo: 38, ih: 30 },
	{ orden: 12, nombre: '9°A', abrev: '9A', grado: 'Noveno', titular: 'ocampo', alumnos: 37, cupo: 38, ih: 30 },
	{ orden: 13, nombre: '9°B', abrev: '9B', grado: 'Noveno', titular: 'herrera', alumnos: 38, cupo: 38, ih: 30 },
	{ orden: 14, nombre: '10°A', abrev: '10A', grado: 'Décimo', titular: 'zapata', alumnos: 33, cupo: 38, ih: 30 },
	{ orden: 15, nombre: '11°A', abrev: '11A', grado: 'Undécimo', titular: 'velez', alumnos: 30, cupo: 38, ih: 30 },
];

export const grupo = (nombre: string): Grupo => {
	const g = GRUPOS.find((x) => x.nombre === nombre);
	if (!g) { throw new Error(`Reparto: no hay grupo «${nombre}».`); }
	return g;
};

/** «(9B) 9°B», que es como nombra un grupo el cuadre de la IH (`asignaturas.ts`, `cuadres`). */
export const enElCuadre = (g: Grupo) => `(${g.abrev}) ${g.nombre}`;

/** Las materias con su alias, que es como las ofrece el desplegable: `materia + ' - ' + alias`. */
export const MATERIAS: { materia: string; alias: string }[] = [
	{ materia: 'Artística', alias: 'ART' },
	{ materia: 'Biología', alias: 'BIO' },
	{ materia: 'Cátedra de la Paz', alias: 'CPZ' },
	{ materia: 'Ciencias Naturales', alias: 'CNA' },
	{ materia: 'Ciencias Sociales', alias: 'SOC' },
	{ materia: 'Educación Física', alias: 'EDF' },
	{ materia: 'Estadística', alias: 'EST' },
	{ materia: 'Ética y Valores', alias: 'ETI' },
	{ materia: 'Inglés', alias: 'ING' },
	{ materia: 'Lengua Castellana', alias: 'LEN' },
	{ materia: 'Matemáticas', alias: 'MAT' },
	{ materia: 'Química', alias: 'QUI' },
	{ materia: 'Tecnología e Informática', alias: 'TEC' },
];

export const etiquetaDeMateria = (m: { materia: string; alias: string }) => `${m.materia} - ${m.alias}`;

/** Una fila de la rejilla de Asignaturas. */
export interface Asignatura {
	id: number;
	materia: string;
	grupo: string;
	profesor: ClaveDocente;
	/** `creditos`: la columna «IH» de la rejilla, y «Créditos» en la ficha. */
	ih: number;
	/** `% del área`: `null` es la raya; `'solo'` es la celda bloqueada que dice «100 %». */
	area: number | null | 'solo';
	dias: [boolean, boolean, boolean, boolean, boolean];
}

const NO: Asignatura['dias'] = [false, false, false, false, false];

/*
 * LAS DIEZ DE NOVENO. 9°A y 9°B dan lo mismo y con los mismos docentes --por eso se copian de uno a
 * otro--, y suman las 30 horas del grupo. Matemáticas y Estadística se reparten su área 80/20, y
 * Biología y Química la suya a medias; Sociales con Cátedra y Lengua con Inglés comparten área sin
 * porcentajes, que es la elección por defecto (se promedian) y la pantalla no avisa de ella.
 */
const NOVENO: Omit<Asignatura, 'id' | 'grupo'>[] = [
	{ materia: 'Matemáticas', profesor: 'herrera', ih: 5, area: 80, dias: NO },
	{ materia: 'Estadística', profesor: 'herrera', ih: 2, area: 20, dias: NO },
	{ materia: 'Biología', profesor: 'ocampo', ih: 3, area: 50, dias: NO },
	{ materia: 'Química', profesor: 'ocampo', ih: 3, area: 50, dias: NO },
	{ materia: 'Ciencias Sociales', profesor: 'bernal', ih: 4, area: null, dias: NO },
	{ materia: 'Cátedra de la Paz', profesor: 'bernal', ih: 1, area: null, dias: NO },
	{ materia: 'Lengua Castellana', profesor: 'zapata', ih: 4, area: null, dias: NO },
	{ materia: 'Inglés', profesor: 'zapata', ih: 4, area: null, dias: NO },
	{ materia: 'Educación Física', profesor: 'salcedo', ih: 2, area: 'solo', dias: NO },
	{ materia: 'Tecnología e Informática', profesor: 'pena', ih: 2, area: 'solo', dias: NO },
];

/** Las de un grupo de noveno, con ids seguidos desde `primerId`. */
export function asignaturasDeNoveno(grupoNombre: '9°A' | '9°B', primerId: number): Asignatura[] {
	return NOVENO.map((a, i) => ({ ...a, id: primerId + i, grupo: grupoNombre }));
}

export const PRIMER_ID_9A = 1488;
export const PRIMER_ID_9B = 1512;

/*
 * CUÁNTAS HAY EN EL AÑO ENTERO, con los quince grupos montados. Sólo se ve en el «Viendo 9 de 146»
 * de la pista cuando hay un filtro puesto, pero tiene que cuadrar entre vídeos: cada uno resta o
 * suma lo que su historia cambia.
 */
export const EN_EL_ANO = 147;

export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const;

/*
 * LAS PRIMERAS FILAS DEL AÑO, las que se ven al entrar sin filtro: la rejilla va por el orden del
 * grupo, así que empiezan por Prejardín y Jardín. Preescolar no tiene materias sino dimensiones, y
 * casi todas las dicta la titular; Educación Física e Inglés vienen de fuera, como en 9°B.
 */
const PREESCOLAR: Omit<Asignatura, 'id' | 'grupo'>[] = [
	{ materia: 'Dimensión Cognitiva', profesor: 'quintero', ih: 5, area: 'solo', dias: NO },
	{ materia: 'Dimensión Comunicativa', profesor: 'quintero', ih: 5, area: 'solo', dias: NO },
	{ materia: 'Dimensión Corporal', profesor: 'salcedo', ih: 3, area: 'solo', dias: NO },
	{ materia: 'Dimensión Estética', profesor: 'quintero', ih: 3, area: 'solo', dias: NO },
	{ materia: 'Dimensión Ética', profesor: 'quintero', ih: 2, area: 'solo', dias: NO },
	{ materia: 'Dimensión Socioafectiva', profesor: 'quintero', ih: 3, area: 'solo', dias: NO },
	{ materia: 'Dimensión Espiritual', profesor: 'quintero', ih: 2, area: 'solo', dias: NO },
	{ materia: 'Inglés', profesor: 'zapata', ih: 2, area: 'solo', dias: NO },
];

/** Las quince primeras sin filtro: las ocho de Prejardín y siete de Jardín. */
export const AL_ENTRAR: Asignatura[] = [
	...PREESCOLAR.map((a, i) => ({ ...a, id: 1001 + i, grupo: 'Prejardín' })),
	...PREESCOLAR.slice(0, 7).map((a, i) => ({ ...a, id: 1009 + i, grupo: 'Jardín' })),
];
