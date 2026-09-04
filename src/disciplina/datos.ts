/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN EL CLIP DE COMPORTAMIENTO Y DISCIPLINA.
 *
 * LOS TRES TIPOS DE SITUACIÓN son los del manual de convivencia, y **cada colegio les pone nombre**
 * (`falta_tipo1_displayname`…). Los números romanos son lo que suele poner un manual; el sistema
 * enseña lo que el colegio escriba.
 *
 * LOS COLORES SON LOS DE LA REJILLA DE VERDAD, no unos parecidos: oro, volcán y rojo de la escala de
 * Ant --`--paleta-aviso`, `--paleta-alerta`, `--paleta-peligro` de `styles.scss`--. Tres colores y
 * no cinco: el uniforme y la tardanza se distinguen por su icono, que ya lo llevan.
 */

export interface TipoDeSituacion {
	plural: string;
	singular: string;
	tinte: string;
	borde: string;
	legible: string;
	fuerte: string;
}

export const TIPOS: TipoDeSituacion[] = [
	{ plural: 'Situaciones tipo I', singular: 'Situación tipo I', tinte: '#fffbe6', borde: '#ffe58f', legible: '#874d00', fuerte: '#faad14' },
	{ plural: 'Situaciones tipo II', singular: 'Situación tipo II', tinte: '#fff2e8', borde: '#ffbb96', legible: '#ad2102', fuerte: '#fa541c' },
	{ plural: 'Situaciones tipo III', singular: 'Situación tipo III', tinte: '#fff1f0', borde: '#ffccc7', legible: '#a8071a', fuerte: '#ff4d4f' },
];

/** El que se abre en el clip: el de en medio. Ni el leve ni el gravísimo. */
export const TIPO_ABIERTO = 1;

export interface AlumnoDisciplina {
	nombre: string;
	sexo: 'mujer' | 'hombre';
	/** Por periodo: uniformes, tardanzas y los tres tipos. */
	periodos: { uniformes: number; tardanzas: number; tipos: [number, number, number] }[];
}

export const ALUMNOS: AlumnoDisciplina[] = [
	{
		nombre: 'Acosta Rivera, Sara Isabel',
		sexo: 'mujer',
		periodos: [
			{ uniformes: 0, tardanzas: 1, tipos: [0, 0, 0] },
			{ uniformes: 2, tardanzas: 3, tipos: [1, 1, 0] },
			{ uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] },
			{ uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] },
		],
	},
	{
		nombre: 'Bermúdez Ochoa, Juan David',
		sexo: 'hombre',
		periodos: [
			{ uniformes: 1, tardanzas: 0, tipos: [0, 0, 0] },
			{ uniformes: 0, tardanzas: 2, tipos: [2, 0, 0] },
			{ uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] },
			{ uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] },
		],
	},
	{
		nombre: 'Cardona Ruiz, Mariana',
		sexo: 'mujer',
		periodos: [
			{ uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] },
			{ uniformes: 0, tardanzas: 1, tipos: [0, 0, 1] },
			{ uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] },
			{ uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] },
		],
	},
];

/** La fila y el periodo donde pasa todo. */
export const FILA_ABIERTA = 0;
export const PERIODO_ABIERTO = 1;

export interface SituacionEnPantalla {
	fecha: string;
	descripcion: string;
	ordinales: string[];
}

/** La que YA estaba. La nueva se pinta debajo de ésta, que es lo que se enseña. */
export const SITUACION_EXISTENTE: SituacionEnPantalla = {
	fecha: '12 ago',
	descripcion: 'Interrumpió la clase de forma reiterada tras dos llamados de atención.',
	ordinales: ['II 4. Obstaculizar el normal desarrollo de las clases.'],
};

/*
 * LA NUEVA, LA QUE SE CREA EN EL CLIP. La descripción es lo ÚNICO que llega vacío al diálogo y lo
 * único que se teclea: todo lo demás --tipo, fecha, testigos, descargo, profesor y ordinales-- viene
 * puesto, que es la bondad que se está enseñando.
 */
export const DESCRIPCION_NUEVA = 'No contrató con Mi Cole Virtual';

export const SITUACION_NUEVA: SituacionEnPantalla = {
	fecha: '3 sep',
	descripcion: DESCRIPCION_NUEVA,
	ordinales: ['II 7. Incumplir los compromisos adquiridos con la institución.'],
};

/** Lo que el diálogo trae ya escrito. */
export const MODAL = {
	alumno: 'Acosta Rivera, Sara Isabel',
	sexo: 'mujer' as const,
	fecha: '03/09/2026 10:15',
	testigos: 'Ramírez Osorio, Andrés · Salazar Gómez, Luisa',
	descargo: 'Dice que sí lo iba a contratar.',
	profesor: 'Ramírez Osorio, Andrés',
	ordinales: ['II 7. Incumplir los compromisos adquiridos con la institución.'],
	tardanzas: '0',
};

/* ── Comportamiento ───────────────────────────────────────────────────────────────────────── */

/** Las tres columnas del libro TIENEN NOMBRE, y no son «Observación 1, 2 y 3». Es lo que dice qué va en cada una. */
export const COLUMNAS_DEL_LIBRO = ['Convivencia', 'Académico', 'Compromiso'];

export const PERIODOS = [1, 2, 3, 4];

/** El periodo en el que se escribe: el último, que es el que cierra el año. */
export const PERIODO_DEL_LIBRO = 4;

export const LO_QUE_SE_ESCRIBE = 'Lideró la izada de bandera y acompañó a los de séptimo.';

export interface FichaDeComportamiento {
	nombre: string;
	sexo: 'mujer' | 'hombre';
	nota: string;
	/** Qué hay escrito en cada periodo. El distintivo de la pestaña cuenta las columnas con algo. */
	libros: Record<number, [string, string, string]>;
	/** La pestaña que se ve al abrir. */
	pestanaInicial: number;
}

export const FICHAS: FichaDeComportamiento[] = [
	{
		nombre: 'Acosta Rivera, Sara Isabel',
		sexo: 'mujer',
		nota: '95',
		pestanaInicial: 1,
		libros: {
			1: ['Buen trato con sus compañeras.', '', ''],
			2: ['', 'Subió dos puntos el promedio.', ''],
			3: ['', '', ''],
			4: ['', 'Sostiene el promedio más alto del grupo.', ''],
		},
	},
	{
		nombre: 'Bermúdez Ochoa, Juan David',
		sexo: 'hombre',
		nota: '78',
		pestanaInicial: 1,
		libros: {
			1: ['Mejoró el trato con sus compañeros.', '', 'Cumplió el compromiso de junio.'],
			2: ['', '', ''],
			3: ['', '', ''],
			4: ['', '', ''],
		},
	},
];

/** Cuántas de las tres columnas de ese periodo tienen algo escrito. Es el distintivo de la pestaña. */
export function escritasEnPeriodo(ficha: FichaDeComportamiento, periodo: number): number {
	return (ficha.libros[periodo] ?? ['', '', '']).filter((t) => t.trim() !== '').length;
}
