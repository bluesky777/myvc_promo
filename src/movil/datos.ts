/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA APP DE LOS ACUDIENTES. Es **`myvc_flutter`**, otra aplicación: una sola app para los quince
 * colegios, en Android y en iOS. Su color es el morado `#6A62B7` y no el del colegio, y por eso este
 * clip no se parece a los de la web.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL TEXTO DEL AVISO NO ME LO HE INVENTADO: está escrito en
 * `myvc_flutter/docs/notificaciones.md`, en la tabla de los cinco tipos.
 *
 *     Asistencia -> «Se registró una ausencia de Juan hoy»
 *
 * Y con él va una regla que **este clip tiene que respetar**: *ninguna notificación lleva la nota
 * dentro*. «Laura tiene 4 notas nuevas en Matemáticas», nunca «Laura sacó 45». Una notificación se ve
 * en la pantalla bloqueada, en el bus, con gente al lado, y la nota de un menor no es algo que deba
 * aparecer ahí. Enseñar en el vídeo un aviso con la nota dentro sería vender lo contrario de lo que
 * el sistema hace a propósito.
 */

export const APP = 'Mi Cole Virtual';

export interface Hijo {
	nombre: string;
	corto: string;
	sexo: 'mujer' | 'hombre';
	grupo: string;
	parentesco: string;
}

export const HIJOS: Hijo[] = [
	{ nombre: 'Bermúdez Ochoa, Juan David', corto: 'Juan David', sexo: 'hombre', grupo: '9°B', parentesco: 'Hijo' },
	{ nombre: 'Bermúdez Ochoa, Valentina', corto: 'Valentina', sexo: 'mujer', grupo: '5°A', parentesco: 'Hija' },
];

/** El que se abre y el del aviso: el mismo, que es lo que hace que la historia se sostenga. */
export const EL_HIJO = 0;

export const AVISO = {
	app: APP,
	cuando: 'ahora',
	texto: `Se registró una ausencia de ${HIJOS[EL_HIJO].corto} hoy`,
};

/* ── Las notas ────────────────────────────────────────────────────────────────────────────── */

export const PERIODO = 'Periodo 2';
export const ANIO = '2026';
export const TITULAR = 'Ramírez Osorio, Andrés';

export const ASIGNATURAS: { nombre: string; nota: number }[] = [
	{ nombre: 'Matemáticas', nota: 79 },
	{ nombre: 'Lengua castellana', nota: 85 },
	{ nombre: 'Ciencias naturales', nota: 92 },
	{ nombre: 'Inglés', nota: 74 },
	{ nombre: 'Sociales', nota: 68 },
	{ nombre: 'Educación física', nota: 95 },
	{ nombre: 'Religión', nota: 88 },
	{ nombre: 'Artística', nota: 91 },
	{ nombre: 'Tecnología', nota: 77 },
];

/** Lo último del muro. Va en la portada porque es lo que hace que el acudiente abra la app sin aviso. */
export const DEL_COLEGIO = {
	titulo: 'Salida pedagógica del viernes',
	pie: 'Publicado ayer · Coordinación académica',
};

export const MINIMA = 60;
export const ALTA = 90;

/* ── La asistencia ────────────────────────────────────────────────────────────────────────── */

/*
 * SON CUATRO CUENTAS Y LA SEPARACIÓN IMPORTA: **llegar tarde al colegio no es faltar a una clase**.
 * Un alumno puede tener el colegio impecable y faltar a media asignatura, y juntarlo en un número
 * escondería justo eso. Aquí son dos ausencias frente a la institución: no vino en todo el día.
 */
export const ASISTENCIA = {
	tardanzasInstitucion: 0,
	ausenciasInstitucion: 2,
	tardanzasClases: 0,
	ausenciasClases: 0,
};

export const DIAS_SIN_VENIR = [
	{ dia: 'Lunes 1 de septiembre', detalle: 'No vino al colegio', extra: 'Sin excusa registrada' },
	{ dia: 'Miércoles 3 de septiembre', detalle: 'No vino al colegio', extra: 'Hoy · sin excusa registrada' },
];
