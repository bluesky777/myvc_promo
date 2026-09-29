/*
 * LAS CUATRO ASIGNATURAS DEL DOCENTE DE LOS VÍDEOS. Aparte de `datos.ts` para que la lista y el
 * dibujo de «Mis asignaturas» (`mis-asignaturas/datos.ts`) la lean los dos sin importarse en redondo.
 *
 * LOS NOMBRES SON INVENTADOS, como en `notas/planilla.ts` y por lo mismo: esto se publica en
 * YouTube. La asignatura que se abre es **Matemáticas de 9°B**, que es exactamente la que enseña
 * después el clip de la planilla (`notas/planilla.ts`, `CABECERA`).
 */

export interface Asignatura {
	materia: string;
	grupo: string;
	/** La abreviatura del bloque de color, como en la fila de la aplicación. */
	sigla: string;
	color: string;
	/** El resumen de debajo: intensidad horaria e indicadores del periodo. */
	resumen: string;
}

export const ASIGNATURAS: Asignatura[] = [
	{ materia: 'Ciencias Naturales', grupo: '8°A', sigla: '8A', color: '#2e9e6b', resumen: 'IH 4 · 3 indicadores' },
	{ materia: 'Matemáticas', grupo: '9°B', sigla: '9B', color: '#1677ff', resumen: 'IH 5 · 3 indicadores' },
	{ materia: 'Matemáticas', grupo: '9°A', sigla: '9A', color: '#7b5cd6', resumen: 'IH 5 · 3 indicadores' },
	{ materia: 'Estadística', grupo: '10°A', sigla: '10A', color: '#d97706', resumen: 'IH 2 · 2 indicadores' },
];
