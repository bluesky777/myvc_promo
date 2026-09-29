import { VOCABULARIO } from '../../comunes/vocabulario';
import { COLEGIO as COLEGIO_DE_TODOS } from '../colegio';
import { MEDIDAS } from '../medidas';
import { ANCHO_LISTA } from '../planilla/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN EL VÍDEO DE COMPETENCIAS, Y DÓNDE CAE CADA COSA.
 *
 * TRES PANTALLAS NUEVAS --Unidades, Mis desempeños y el boletín-- y una prestada: el catálogo de
 * informes, del que sólo se dibuja lo que el vídeo usa.
 *
 * LOS NOMBRES SON INVENTADOS y la asignatura es **Matemáticas de 9°B**, la misma del otro vídeo de
 * ayuda y la misma de `notas/planilla.ts`. Las columnas también son las mismas --Taller, Quiz,
 * Examen--: quien vea los dos vídeos seguidos tiene que reconocer la misma clase, o creerá que cada
 * pantalla habla de un colegio distinto.
 *
 * LA GEOMETRÍA VIVE AQUÍ, como en `planilla/datos.ts`, y por el mismo motivo: el foco señala
 * rectángulos que el guion calcula, no que alguien mida en la imagen. Cada pantalla declara el alto
 * de sus bloques y `arribaDe...()` los suma; si un bloque cambia de alto, el foco se mueve solo.
 */

/* ─────────────────────────────────────────────────────────────────────────────────────────────
 * LA CLASE DEL VÍDEO
 * ───────────────────────────────────────────────────────────────────────────────────────────── */

export const CLASE = {
	materia: 'Matemáticas',
	/** En «Mis desempeños» el alcance no es el grupo: es la materia y el GRADO. */
	materiaEnMayusculas: 'MATEMÁTICAS',
	grado: 'Noveno',
	grupo: '9°B',
	/*
	 * EL PERIODO DE LA BARRA ES EL 2, y es el de todo el vídeo: la planilla, el boletín y el catálogo
	 * hablan del 2. Lo que el vídeo enseña es que **esta pantalla puede estar mirando otro**: a mitad
	 * se pulsa el 3 y salta la franja. Si en cambio la barra dijera 3 y esta pantalla 2, el boletín
	 * del final --que sale del periodo de la barra-- no contendría lo que se acaba de escribir, y el
	 * vídeo estaría enseñando un camino que no lleva a su propio desenlace.
	 */
	periodoDeLaSesion: 2,
	/** El que se mira al llegar: el mismo. */
	periodo: 2,
	/** Y el que se pulsa a mitad, para que se vea saltar el aviso. */
	periodoAjeno: 3,
};

/* ─────────────────────────────────────────────────────────────────────────────────────────────
 * PANTALLA 1 · UNIDADES  (`/unidades/:asignatura_id`)
 * ───────────────────────────────────────────────────────────────────────────────────────────── */

/*
 * EL PÁRRAFO DE AYUDA ES LA CADENA LITERAL DE LA APLICACIÓN (`unidades.ts:284-286`), y es el centro
 * del vídeo: es donde la pantalla dice, con sus palabras, qué deja de hacer el docente.
 */
export const AYUDA_DE_UNIDADES =
	'Las columnas son instrumentos: un examen, un taller. El desempeño que sale en el boletín lo pone ' +
	'el colegio, una vez, en el plan de evaluación del año.';

export const PLACEHOLDER_COLUMNA = 'Añadir una columna: «Examen 1», «Taller»…';
export const BOTON_COLUMNA = 'Añadir columna';

export interface Unidad {
	nombre: string;
	porcentaje: number;
	/** Las columnas de dentro: los instrumentos. Son las de `notas/planilla.ts`. */
	columnas: { nombre: string; porcentaje: number }[];
	/** Las que sembró la plantilla del colegio llevan candado: «Lo puso el colegio». */
	delColegio?: boolean;
}

/*
 * LOS NOMBRES LLEVAN LA PALABRA DEL COLEGIO, no la de la base de datos. En la pantalla de verdad el
 * título dice `unidades_displayname` --aquí «Logros»-- y lo mismo la miga; «Unidad» y «subunidad»
 * sólo se ven en el esquema. Ver `comunes/vocabulario.ts`.
 */
export const UNIDADES: Unidad[] = [
	{
		nombre: `${VOCABULARIO.unidad} 2 · Álgebra`,
		porcentaje: 60,
		delColegio: true,
		columnas: [
			{ nombre: 'Taller', porcentaje: 30 },
			{ nombre: 'Quiz', porcentaje: 30 },
			{ nombre: 'Examen', porcentaje: 40 },
		],
	},
	{
		nombre: `${VOCABULARIO.unidad} 3 · Funciones`,
		porcentaje: 40,
		columnas: [
			{ nombre: 'Taller', porcentaje: 50 },
			{ nombre: 'Exposición', porcentaje: 50 },
		],
	},
];

export const UNIDADES_ALTO = {
	arriba: 26,
	lados: 32,
	/** El título con su migaja de abajo. */
	titulo: 72,
	/** El párrafo de ayuda, que es lo que el vídeo señala. */
	ayuda: 62,
	huecoTrasAyuda: 16,
	unidad: 52,
	columna: 40,
	huecoTrasUnidad: 14,
	formulario: 52,
};

/** Dónde empieza el párrafo de ayuda, en coordenadas de la cáscara. */
export function arribaDeLaAyuda(): number {
	return MEDIDAS.barra + UNIDADES_ALTO.arriba + UNIDADES_ALTO.titulo;
}

/* ─────────────────────────────────────────────────────────────────────────────────────────────
 * PANTALLA 2 · MIS DESEMPEÑOS  (`/mis-desempenos`)
 * ───────────────────────────────────────────────────────────────────────────────────────────── */

export const DESEMPENOS_TEXTOS = {
	/* El `<h1>` de `docente-competencias.html` desde el 26 sep 2026. */
	titulo: 'Mis competencias',
	entradilla:
		'Lo que va a salir en el boletín de tus clases. Son las mismas filas que escribe la coordinación: ' +
		'lo que cambies aquí lo ve ella, y lo que ella escriba lo ves tú.',
	rotuloClases: 'Mis clases',
	rotuloPeriodos: 'Desempeños del periodo',
	placeholder: 'Escribe un desempeño para MATEMÁTICAS en Noveno…',
	marca: 'marca (opcional)',
	anadir: 'Añadir',
	/** El bloque del final: lo de la coordinación, con candado. */
	tituloPlanDeArea: 'Del plan de área · todos los grados',
	avisoPlanDeArea:
		'Estos desempeños los escribe la coordinación para toda la materia, y se suman a los tuyos en el ' +
		'boletín del alumno. Aquí se ven y no se editan.',
	/*
	 * LA FRANJA ÁMBAR. Es el aviso que existe porque **ya pasó**: docentes que borran y editan lo de
	 * un periodo pasado creyendo que era el siguiente. Las cadenas son las de la aplicación.
	 */
	franjaTitulo: 'Estás en el periodo 3, y arriba tienes puesto el 2',
	franjaCuerpo: 'Lo que escribas o borres aquí es del periodo 3.',
};

/** Las clases de la tira de arriba. La primera es la del vídeo. */
/*
 * Las de Ana María (`montar-el-ano/reparto.ts`): Matemáticas y Estadística en noveno --9°A y 9°B son
 * una sola clase, porque los desempeños son de un par (materia, grado)--, Ciencias Naturales en 8°A y
 * Estadística en 10°A. El rótulo es el de la aplicación: el corto del grado, punto, el de la materia.
 */
export const MIS_CLASES = ['9. MAT', '9. EST', '8. NAT', '10. EST'];

/** Cada pastilla de la tira mide lo mismo, para que el foco de «tu clase» salga de la cuenta. */
export const PASTILLA_CLASE = { ancho: 96, hueco: 10 };
export const ANCHO_TIRA_CLASES = MIS_CLASES.length * PASTILLA_CLASE.ancho + (MIS_CLASES.length - 1) * PASTILLA_CLASE.hueco;

export interface Desempeno {
	texto: string;
	/** Los de la coordinación no se editan: llevan candado en vez de lápiz y papelera. */
	delColegio?: boolean;
	/** Se escribe delante, al teclearlo, para que se vea aparecer. */
	seEscribe?: boolean;
}

/*
 * LOS TEXTOS VAN EN SINTAGMA NOMINAL --«la resolución de…», no «Resuelve…»-- y eso no es estilo: el
 * backend les antepone la banda de la escala («Fortaleza en…»), así que un verbo conjugado imprime
 * «Fortaleza en Resuelve problemas». La coordinación tiene una previsualización que se lo avisa;
 * **el docente no la tiene**, y por eso el vídeo lo dice.
 */
export const DESEMPENOS: Desempeno[] = [
	{ texto: 'la interpretación de gráficas de funciones lineales' },
	{ texto: 'la resolución de problemas con ecuaciones de primer grado', seEscribe: true },
];

export const DESEMPENOS_DEL_COLEGIO: Desempeno[] = [
	{ texto: 'el trabajo en equipo durante la clase', delColegio: true },
	{ texto: 'la entrega puntual de los trabajos', delColegio: true },
];

export const DESEMPENOS_ALTO = {
	arriba: 26,
	lados: 32,
	titulo: 96,
	tira: 52,
	periodos: 58,
	franja: 70,
	huecoTrasFranja: 14,
	fila: 46,
	/** Lo que hay entre una fila y la siguiente. Cuenta: sin él, el foco de abajo se desplaza. */
	huecoFila: 6,
	huecoTrasLista: 12,
	formulario: 64,
	huecoTrasFormulario: 18,
	planDeArea: 130,
};

const D = DESEMPENOS_ALTO;

/** La tira de periodos: el bloque que lleva los puntos de «aquí hay algo escrito». */
export function arribaDeLosPeriodos(): number {
	return MEDIDAS.barra + D.arriba + D.titulo + D.tira;
}

/** La franja ámbar, justo debajo de los periodos. */
export function arribaDeLaFranja(): number {
	return arribaDeLosPeriodos() + D.periodos;
}

/** Y el formulario de añadir, después de la lista. */
export function arribaDelFormulario(cuantos: number): number {
	return arribaDeLaFranja() + D.franja + D.huecoTrasFranja + cuantos * (D.fila + D.huecoFila) + D.huecoTrasLista;
}

/** El bloque de la coordinación, el último. */
export function arribaDelPlanDeArea(cuantos: number): number {
	return arribaDelFormulario(cuantos) + D.formulario + D.huecoTrasFormulario;
}

/* ─────────────────────────────────────────────────────────────────────────────────────────────
 * PANTALLA 3 · EL CATÁLOGO DE INFORMES  (`/informes`), del que sólo se dibuja lo que el vídeo usa
 * ───────────────────────────────────────────────────────────────────────────────────────────── */

export const INFORMES_TEXTOS = {
	titulo: '¿Qué necesitas imprimir?',
	/** Lo que el puntero teclea en el buscador. */
	busqueda: 'competencias',
	/** La ficha, con su nombre y su «para qué» literales del catálogo. */
	fichaNombre: 'Boletín por competencias',
	fichaPara: 'Los desempeños del periodo debajo de cada asignatura, con su valoración.',
	/** Lo que el configurador pide: dos cosas, y el periodo NO es una de ellas. */
	paraQuien: '¿Para quién?',
	opcionesDestinatario: ['Todo el grupo', 'Los alumnos que marque'],
	grupo: 'Grupo',
	cargar: 'Cargar el informe',
	/** El aviso que hay que saber: el periodo no se elige, es el que el colegio tiene abierto. */
	periodoFijo: 'Periodo 2, el que el colegio tiene abierto',
};

export const INFORMES_ALTO = {
	arriba: 26,
	lados: 32,
	titulo: 64,
	buscador: 56,
	huecoTrasBuscador: 20,
	ficha: 132,
	/** El configurador de la derecha, y el hueco que lo separa del buscador. */
	config: 330,
	huecoConfig: 24,
};

/** El buscador ocupa lo que dejan el configurador y su hueco: de aquí sale también su foco. */
export function anchoDelBuscador(): number {
	return ANCHO - INFORMES_ALTO.lados * 2 - INFORMES_ALTO.config - INFORMES_ALTO.huecoConfig;
}

export function arribaDelBuscador(): number {
	return MEDIDAS.barra + INFORMES_ALTO.arriba + INFORMES_ALTO.titulo;
}

/** El ancho útil de las tres pantallas es el mismo: el de la cáscara menos el menú. */
export const ANCHO = ANCHO_LISTA;

/* ─────────────────────────────────────────────────────────────────────────────────────────────
 * PANTALLA 4 · EL BOLETÍN POR COMPETENCIAS (tipo 6)
 * ───────────────────────────────────────────────────────────────────────────────────────────── */

/*
 * LA HOJA ES VERTICAL Y SE DIBUJA A SU TAMAÑO: 740 × 980, la caja útil de una Letter con 10 mm de
 * margen, que es lo que mide de verdad (`boletines.scss`). Se encoge después para entrar en el
 * fotograma, en `guion.ts`.
 *
 * LO QUE SE DIBUJA ES EL PAPEL DE HOY, no el que prometen los textos del catálogo. El cuerpo de la
 * 6 es **una lista plana de frases**: ni medidor, ni icono, ni el nivel repetido en cada renglón.
 * El nivel se dice una vez, arriba, en la cabecera de la asignatura --«ALTO 88»--, y dentro de cada
 * frase por el prefijo de la banda que le antepone el servidor.
 */
export const HOJA = { ancho: 740, alto: 980 };

/* El colegio es el de todos los vídeos (`colegio/`); aquí sólo se le añade la pastilla del papel. */
export const COLEGIO = {
	...COLEGIO_DE_TODOS,
	/** La pastilla azul del membrete. Va sin tilde en el código de la aplicación. */
	pastilla: 'BOLETIN PERIODO 2 - 2026',
};

export const ALUMNO = {
	apellidosYNombres: 'ACOSTA RIVERA SARA ISABEL',
	grupo: '9°B',
	titular: 'Herrera Lugo, Ana María',
	/** «Puntaje: 77 ALTO - Puesto: 3/38». El puesto lo compone la pantalla y no lo ve la familia. */
	puntaje: 'Puntaje: 77 ALTO - Puesto: 3/38',
};

export interface AsignaturaDelBoletin {
	materia: string;
	profesor: string;
	ausencias: number;
	tardanzas: number;
	/** La palabra de la banda, en la celda de 66 px. */
	nivel: string;
	nota: number;
	perdida?: boolean;
	/** Las frases, ya con el prefijo de la banda puesto por el servidor. */
	desempenos: string[];
}

export interface AreaDelBoletin {
	area: string;
	asignaturas: AsignaturaDelBoletin[];
}

export const BOLETIN: AreaDelBoletin[] = [
	{
		area: 'MATEMÁTICAS',
		asignaturas: [
			{
				materia: 'Matemáticas',
				profesor: 'Herrera Lugo, Ana María',
				ausencias: 2,
				tardanzas: 1,
				nivel: 'ALTO',
				nota: 88,
				desempenos: [
					'Fortaleza en la resolución de problemas con ecuaciones de primer grado.',
					'Fortaleza en la interpretación de gráficas de funciones lineales.',
					'Fortaleza en el trabajo en equipo durante la clase.',
				],
			},
			{
				materia: 'Estadística',
				profesor: 'Herrera Lugo, Ana María',
				ausencias: 0,
				tardanzas: 0,
				nivel: 'BÁSICO',
				nota: 72,
				/*
				 * LA ASIGNATURA SIN PLAN ESCRITO. Sale en el vídeo a propósito: es lo que el colegio
				 * se va a encontrar el primer periodo, y conviene que sepa que no es una avería.
				 */
				desempenos: [],
			},
		],
	},
	{
		area: 'CIENCIAS NATURALES Y EDUCACIÓN AMBIENTAL',
		asignaturas: [
			{
				materia: 'Biología',
				profesor: 'Ocampo Ruiz, Diego',
				ausencias: 1,
				tardanzas: 0,
				nivel: 'SUPERIOR',
				nota: 95,
				desempenos: ['Excelencia en la explicación de los sistemas del cuerpo humano.'],
			},
			{
				materia: 'Química',
				profesor: 'Ocampo Ruiz, Diego',
				ausencias: 4,
				tardanzas: 2,
				nivel: 'BAJO',
				nota: 54,
				perdida: true,
				desempenos: ['Dificultad en el balanceo de ecuaciones químicas.'],
			},
		],
	},
	/*
	 * LAS DOS ÁREAS DE ABAJO NO SE LEEN EN EL VÍDEO: están para que la hoja se vea **llena**. Un
	 * boletín de bachillerato trae doce o quince asignaturas, y una hoja con cuatro y dos tercios en
	 * blanco no se reconoce como el papel que el colegio imprime -- que es justo lo que el plano
	 * general tiene que conseguir antes de que la cámara se acerque.
	 */
	{
		area: 'CIENCIAS SOCIALES',
		asignaturas: [
			{
				materia: 'Ciencias Sociales',
				profesor: 'Bernal Pino, Luisa',
				ausencias: 0,
				tardanzas: 1,
				nivel: 'ALTO',
				nota: 84,
				desempenos: ['Fortaleza en el análisis de los procesos de independencia.'],
			},
			{
				materia: 'Cátedra de la Paz',
				profesor: 'Bernal Pino, Luisa',
				ausencias: 0,
				tardanzas: 0,
				nivel: 'SUPERIOR',
				nota: 96,
				desempenos: ['Excelencia en la mediación de conflictos entre compañeros.'],
			},
		],
	},
	{
		area: 'HUMANIDADES',
		asignaturas: [
			{
				materia: 'Lengua Castellana',
				profesor: 'Zapata Iregui, Marcela',
				ausencias: 1,
				tardanzas: 0,
				nivel: 'ALTO',
				nota: 86,
				desempenos: [
					'Fortaleza en la comprensión de textos argumentativos.',
					'Fortaleza en la exposición oral ante el grupo.',
				],
			},
			{
				materia: 'Inglés',
				profesor: 'Zapata Iregui, Marcela',
				ausencias: 2,
				tardanzas: 0,
				nivel: 'BÁSICO',
				nota: 76,
				desempenos: ['Dificultad en el uso del pasado simple.'],
			},
		],
	},
	{
		area: 'EDUCACIÓN FÍSICA, RECREACIÓN Y DEPORTES',
		asignaturas: [
			{
				materia: 'Educación Física',
				profesor: 'Salcedo Rúa, Andrés',
				ausencias: 0,
				tardanzas: 3,
				nivel: 'ALTO',
				nota: 89,
				desempenos: ['Fortaleza en el trabajo de resistencia aeróbica.'],
			},
		],
	},
];

/*
 * EL ACERCAMIENTO. La hoja entera a 1080p deja el renglón del desempeño en ocho píxeles: se
 * reconoce el papel y no se lee ni una palabra. Así que el plano general enseña **qué es**, y
 * después la cámara se acerca a la primera área, que es donde están las dos cosas que el vídeo
 * afirma -- las frases debajo de la asignatura, y la que no tiene ninguna.
 *
 * Son coordenadas DE LA HOJA, medidas sobre su propio dibujo: desde la banda de «MATEMÁTICAS»
 * hasta el final de «Estadística».
 */
export const ACERCAMIENTO = { y: 160, alto: 240 };

/** El relleno literal de la asignatura sin una sola fila escrita. */
export const SIN_DESEMPENOS = 'Sin desempeños evaluados en este periodo.';

/** Cuántas frases se pintan en total: lo usa el guion para saber si la hoja cabe. */
export const CUANTOS_DESEMPENOS = BOLETIN.reduce(
	(n, area) => n + area.asignaturas.reduce((m, a) => m + a.desempenos.length, 0),
	0,
);
