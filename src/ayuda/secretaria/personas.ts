/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS ALUMNOS DE LA SERIE «SECRETARÍA». **TODO INVENTADO**: esto se publica en YouTube.
 *
 * Ningún nombre, documento, teléfono ni dirección sale de fixtures, seeds, capturas ni bases de datos
 * de `myvc_front`. Los documentos son a propósito números que no puede tener nadie --un 1 seguido
 * de ceros y el número de lista-- y los celulares lo mismo: 300 000 00 más dos cifras. Las caras son
 * el `Avatar` dibujado, nunca una foto.
 *
 * EL COLEGIO ES EL DE LOS OTROS VÍDEOS (`montar-el-ano/reparto.ts`): 9°B es de Ana María Herrera Lugo
 * y sus seis primeros alumnos son los de la planilla (`notas/planilla.ts`). Los demás se añaden aquí.
 * 9°A es de Diego Ocampo Ruiz, y 8°A (de donde salen los candidatos de 9°) de Luisa Bernal Pino.
 */

export interface Alumno {
	id: number;
	nombres: string;
	apellidos: string;
	sexo: 'M' | 'F';
	/** Para el `Avatar`: cambia pelo, piel y ropa. */
	variante: number;
	documento: string;
	celular: string;
	/** Nº de matrícula del colegio. */
	matricula: string;
	nacimiento: string;
	/** El nombre de usuario con el que entra hoy. */
	usuario: string;
}

const doc = (n: number) => `10000${String(n).padStart(5, '0')}`;
const cel = (n: number) => `30000000${String(n % 100).padStart(2, '0')}`;

let siguiente = 4101;
const alumno = (
	nombres: string, apellidos: string, sexo: 'M' | 'F', variante: number, nacimiento: string, usuario: string,
): Alumno => {
	const id = siguiente++;
	return { id, nombres, apellidos, sexo, variante, documento: doc(id), celular: cel(id), matricula: String(id - 3900), nacimiento, usuario };
};

/** 9°B, 2026. Los seis primeros son los de la planilla; el orden es el de la rejilla, por apellido. */
export const NOVENO_B: Alumno[] = [
	alumno('Sara Isabel', 'Acosta Rivera', 'F', 1, '2011-03-14', 'sara.acosta'),
	alumno('Mariana', 'Cardona Ruiz', 'F', 3, '2011-07-02', 'mariana.cardona'),
	alumno('Samuel', 'Delgado Peña', 'M', 2, '2011-01-29', 'samuel.delgado'),
	alumno('Valentina', 'Escobar Lozano', 'F', 5, '2011-10-11', 'valentina.escobar'),
	alumno('Tomás Andrés', 'Fajardo Mejía', 'M', 4, '2011-05-23', 'tomas.fajardo'),
	alumno('Martín', 'Gallego Soto', 'M', 0, '2011-08-17', 'martin.gallego'),
	alumno('Juliana', 'Hoyos Arbeláez', 'F', 2, '2011-12-05', 'juliana.hoyos'),
	alumno('Nicolás', 'Londoño Pardo', 'M', 5, '2011-02-20', 'nicolas.londono'),
	alumno('Daniela', 'Naranjo Vélez', 'F', 4, '2011-06-09', 'daniela.naranjo'),
	alumno('Juan José', 'Ospina Correa', 'M', 1, '2011-09-30', 'juanjose.ospina'),
	alumno('Laura Sofía', 'Pineda Uribe', 'F', 0, '2011-04-16', 'laura.pineda'),
	alumno('Mateo David', 'Rojas Valencia', 'M', 3, '2011-11-21', 'mateo.rojas'),
	alumno('Emilio', 'Salazar Montoya', 'M', 1, '2011-01-08', 'emilio.salazar'),
	alumno('Camila', 'Torres Giraldo', 'F', 2, '2011-07-27', 'camila.torres'),
];

/** 9°A, 2026: los que el vídeo de matricular cambia de grupo salen de aquí. */
export const NOVENO_A: Alumno[] = [
	alumno('Felipe', 'Arango Buitrago', 'M', 4, '2011-02-11', 'felipe.arango'),
	alumno('Manuela', 'Bedoya Castaño', 'F', 1, '2011-05-03', 'manuela.bedoya'),
	alumno('Santiago', 'Cifuentes Mora', 'M', 3, '2011-08-25', 'santiago.cifuentes'),
	alumno('Gabriela', 'Duque Serna', 'F', 0, '2011-10-19', 'gabriela.duque'),
	alumno('Alejandro', 'Echeverri Gil', 'M', 5, '2011-03-07', 'alejandro.echeverri'),
	alumno('Paula Andrea', 'Franco Ramírez', 'F', 2, '2011-12-13', 'paula.franco'),
	alumno('David', 'García Henao', 'M', 1, '2011-06-30', 'david.garcia'),
	alumno('Antonia', 'Hurtado Zuluaga', 'F', 3, '2011-09-01', 'antonia.hurtado'),
];

/**
 * 8°A DE 2025 QUE NO ESTÁN TODAVÍA EN 9°B: los candidatos de «Matricular». Salen del grado anterior
 * del año anterior, que es lo que hace la pantalla (`matriculas.ts:204-210`, 322-325).
 */
export const OCTAVO_2025: Alumno[] = [
	alumno('Isabella', 'Montoya Rendón', 'F', 4, '2011-01-15', 'isabella.montoya'),
	alumno('Salomé', 'Restrepo Álzate', 'F', 5, '2011-02-09', 'salome.restrepo'),
	alumno('Emmanuel', 'Suárez Patiño', 'M', 0, '2011-07-18', 'emmanuel.suarez'),
	alumno('Luciana', 'Vargas Ochoa', 'F', 1, '2011-03-26', 'luciana.vargas'),
	alumno('Jerónimo', 'Zuluaga Ríos', 'M', 2, '2011-04-22', 'jeronimo.zuluaga'),
];

export const avatarDe = (a: Alumno) => ({ tipo: a.sexo === 'F' ? ('mujer' as const) : ('hombre' as const), variante: a.variante });

export const nombreCompleto = (a: Alumno) => `${a.nombres} ${a.apellidos}`;

export const buscar = (lista: Alumno[], nombres: string) => {
	const a = lista.find((x) => x.nombres === nombres);
	if (!a) { throw new Error(`Secretaría: no hay alumno «${nombres}».`); }
	return a;
};

/** Los grupos de 2026 que salen en el selector de grupos, en su orden (los de `reparto.ts`). */
export const GRUPOS_DEL_SELECTOR = ['6A', '7A', '8A', '9A', '9B', '10A', '11A'];
