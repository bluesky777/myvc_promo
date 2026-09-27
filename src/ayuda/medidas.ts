/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS MEDIDAS DE LA CÁSCARA Y LO QUE DICE EL MENÚ.
 *
 * Están en datos y no dentro del dibujo por el mismo motivo por el que en la aplicación el menú es
 * un fichero de datos (`app2/src/app/cascara/menu/menu.ts`): **el guion tiene que poder señalar una
 * entrada sin dibujarla**. El foco del vídeo necesita saber en qué renglón cae «Académico», y eso
 * sale de contar entradas con estas medidas, no de mirar el resultado.
 *
 * EL ANCHO DE DISEÑO ES 1440, el de la aplicación. Lo que se cambia para que quepa en el fotograma
 * es la escala, en un solo sitio (`planilla/encuadre.ts`), nunca estas medidas.
 */

export const MEDIDAS = {
	ancho: 1440,
	alto: 900,
	/** La barra de arriba: marca, «Navegar…», el selector de año y periodo, y el retrato. */
	barra: 56,
	/** La columna del menú, desplegada. Plegada a iconos son 64, pero el vídeo la enseña entera. */
	menu: 248,
	/** Una entrada de sección. */
	seccion: 46,
	/** Una hija, dentro de una sección abierta. Más baja: es lo que hace que se lean como hijas. */
	hija: 40,
	/** Lo que el menú respira por arriba antes de la primera sección. */
	menuArriba: 12,
};

export interface Seccion {
	etiqueta: string;
	icono: Icono;
	/** Lo que hay dentro. Sólo se pinta si la sección está abierta. */
	hijas?: string[];
}

export type Icono =
	| 'inicio' | 'personas' | 'academico' | 'disciplina' | 'referencias'
	| 'horario' | 'informes' | 'configuracion' | 'docentes';

/*
 * LAS NUEVE SECCIONES, en el orden de la aplicación. Las hijas que se pintan son las de «Académico»
 * y sólo ésas: son las que el vídeo abre. Poner las de las otras ocho llenaría el menú de texto que
 * nunca se ve abierto, y el menú de verdad tampoco las enseña hasta que se pulsa.
 */
export const SECCIONES: Seccion[] = [
	{ etiqueta: 'Inicio', icono: 'inicio' },
	{ etiqueta: 'Docentes', icono: 'docentes' },
	{
		etiqueta: 'Académico',
		icono: 'academico',
		hijas: [
			'Mis asignaturas',
			'Mis desempeños',
			'Trabajar sin internet',
			'Notas perdidas',
			'Recuperación del año',
			'Actividades',
		],
	},
	{ etiqueta: 'Personas', icono: 'personas' },
	{ etiqueta: 'Disciplina', icono: 'disciplina' },
	{ etiqueta: 'Referencias', icono: 'referencias' },
	{ etiqueta: 'Horario', icono: 'horario' },
	{ etiqueta: 'Informes', icono: 'informes' },
	{ etiqueta: 'Configuración', icono: 'configuracion' },
];

/** Dónde está «Académico» en la lista. Lo usa el guion para saber a qué altura pulsa el puntero. */
export const ACADEMICO = SECCIONES.findIndex((s) => s.etiqueta === 'Académico');

/** Y dónde, dentro de ella, está «Mis asignaturas». */
export const MIS_ASIGNATURAS = SECCIONES[ACADEMICO].hijas!.findIndex((h) => h === 'Mis asignaturas');

/**
 * LA ALTURA DE UNA ENTRADA DEL MENÚ, en coordenadas de la cáscara. `hija` es el índice dentro de la
 * sección, o `null` para la sección misma. Cuenta con que **sólo «Académico» se abre**: si algún día
 * el vídeo abriera dos secciones, esto tendría que recibir cuáles están abiertas.
 */
export function alturaDeEntrada(seccion: number, hija: number | null, academicoAbierto: boolean): number {
	let y = MEDIDAS.barra + MEDIDAS.menuArriba;

	for (let i = 0; i < seccion; i++) {
		y += MEDIDAS.seccion;
		if (i === ACADEMICO && academicoAbierto) {
			y += SECCIONES[ACADEMICO].hijas!.length * MEDIDAS.hija;
		}
	}

	if (hija === null) { return y; }
	return y + MEDIDAS.seccion + hija * MEDIDAS.hija;
}
