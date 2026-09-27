import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «MIS ASIGNATURAS», Y DÓNDE CAE CADA COSA.
 *
 * LOS NOMBRES SON INVENTADOS, como en `notas/planilla.ts` y por lo mismo: esto se publica en
 * YouTube. La asignatura que se abre es **Matemáticas de 9°B**, que es exactamente la que enseña
 * después el clip de la planilla (`notas/planilla.ts`, `CABECERA`). Si no coincidieran, el vídeo
 * enseñaría pulsar una fila y abrirse otra pantalla -- y quien mira aprendería que la aplicación
 * hace eso.
 *
 * LA GEOMETRÍA VIVE AQUÍ porque el guion tiene que señalar el botón «Planilla» sin dibujarlo: el
 * puntero va a ese punto y el foco recorta ese rectángulo. Sacarlo del dibujo obligaría a medir el
 * resultado, y entonces mover un renglón dejaría el foco señalando al vecino y nada avisaría.
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

/** La que se abre en el vídeo. */
export const LA_QUE_SE_ABRE = ASIGNATURAS.findIndex((a) => a.materia === 'Matemáticas' && a.grupo === '9°B');

/*
 * LOS CUATRO BOTONES DE LA FILA, en el orden de la aplicación. **La planilla es el segundo**, y eso
 * el rótulo lo dice con esas palabras: quien vuelva a la pantalla de verdad no cuenta botones de
 * izquierda a derecha, reconoce el sitio.
 */
export const BOTONES = ['Unidades', 'Planilla', 'Definitivas', 'Rúbricas'];
export const PLANILLA = BOTONES.indexOf('Planilla');

export const LISTA = {
	/** Lo que la pantalla respira antes del título. */
	arriba: 30,
	lados: 32,
	/** El bloque del título con su cuenta debajo. */
	titulo: 84,
	fila: 92,
	/** Lo que hay entre una fila y la siguiente. */
	hueco: 12,
	boton: { ancho: 116, alto: 38, hueco: 10 },
};

/** El ancho útil: el de la cáscara menos el menú. */
export const ANCHO_LISTA = MEDIDAS.ancho - MEDIDAS.menu;

/** Dónde empieza una fila, en coordenadas de la CÁSCARA (con la barra y el menú ya contados). */
export function arribaDeLaFila(fila: number): number {
	return MEDIDAS.barra + LISTA.arriba + LISTA.titulo + fila * (LISTA.fila + LISTA.hueco);
}

/**
 * EL RECTÁNGULO DE UN BOTÓN, en coordenadas de la cáscara. Los cuatro van pegados a la derecha de
 * la fila, así que se cuentan desde el borde: añadir un quinto botón por la izquierda no movería a
 * los otros cuatro, que es como está hecha la fila de verdad.
 */
export function rectanguloDelBoton(fila: number, boton: number) {
	const derecha = MEDIDAS.menu + ANCHO_LISTA - LISTA.lados - 18;
	const desdeElFinal = BOTONES.length - 1 - boton;
	const x = derecha - LISTA.boton.ancho - desdeElFinal * (LISTA.boton.ancho + LISTA.boton.hueco);

	return {
		x,
		y: arribaDeLaFila(fila) + (LISTA.fila - LISTA.boton.alto) / 2,
		ancho: LISTA.boton.ancho,
		alto: LISTA.boton.alto,
	};
}
