import { MEDIDAS } from '../medidas';
import { ALMENDROS } from '../colegio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN INFORMES Y EN EL CERTIFICADO, Y DÓNDE CAE CADA COSA.
 *
 * El catálogo de Informes lo usan dos vídeos --el certificado y la constancia--, y por eso sus
 * textos y su geometría viven aquí y no en cada uno. Lo literal es de la aplicación
 * (`informes/catalogo/catalogo-informes.html` e `impresos.ts`): el título, el marcador del
 * buscador, la familia «Para la familia» con su «para», el nombre y el «para» de cada ficha, los
 * rótulos del configurador y el botón que dice lo que falta. El colegio, el grupo, los alumnos y
 * las notas son inventados.
 */

/* ── El catálogo ──────────────────────────────────────────────────────────────────────────── */

export interface Ficha {
	clave: string;
	nombre: string;
	para: string;
	/** Lo que pide el configurador, en su orden. */
	pide: ('destinatario' | 'grupo' | 'alumno' | 'hasta')[];
}

/** Las fichas de la familia «Para la familia» que salen al buscar en estos vídeos (`impresos.ts:242-283`). */
export const FICHAS: Record<string, Ficha> = {
	estudio: {
		clave: 'certificado-estudio',
		nombre: 'Certificado de estudio',
		para: 'Con todos los periodos calculados. Para un traslado.',
		pide: ['destinatario', 'grupo'],
	},
	periodos: {
		clave: 'certificado-periodos',
		nombre: 'Certificado hasta un periodo',
		para: 'El mismo, calculado hasta el periodo que elijas.',
		pide: ['destinatario', 'grupo', 'hasta'],
	},
	todos: {
		clave: 'certificados-alumno',
		nombre: 'Certificados de todos los años',
		para: 'Un certificado por cada año que el alumno estudió aquí, cada año en su hoja.',
		pide: ['grupo', 'alumno'],
	},
	constancia: {
		clave: 'constancia',
		nombre: 'Constancia de estudio',
		para: 'Una hoja firmada que dice que está matriculado. Sin notas, para el banco o el subsidio.',
		pide: ['grupo', 'alumno'],
	},
};

/*
 * LO QUE ENCUENTRA CADA BÚSQUEDA. Comprobado contra `casa()` del catálogo (todas las palabras,
 * sin tildes, en nombre + para + sinónimos) sobre las 72 entradas de `impresos.ts`:
 *     «certificado» -> las tres de certificado;  «constancia» -> el certificado de estudio (lleva
 *     «constancia con notas» en sus sinónimos) y la constancia.
 */
export const BUSQUEDAS = {
	certificado: [FICHAS.estudio, FICHAS.periodos, FICHAS.todos],
	constancia: [FICHAS.estudio, FICHAS.constancia],
};

export const CATALOGO = {
	titulo: 'Informes',
	marcador: '¿Qué necesitas imprimir? Boletines, certificado, planilla, quién falta…',
	/** «Periodo **2** abierto · **13** grupos» (los 13 de Los Almendros en todos los vídeos). El periodo es el que el colegio tiene abierto. */
	periodo: 2,
	grupos: 13,
	familia: 'Para la familia',
	familiaPara: 'Lo que sale del colegio en un sobre.',
	vacio: 'Elige un informe y aquí aparecen sólo los datos que ese papel necesita.',
	paraQuien: '¿Para quién?',
	destinatarios: ['Todo el grupo', 'Los alumnos que marque'],
	grupo: 'Grupo',
	grupoMarcador: 'Elige un grupo',
	estudiante: 'Estudiante',
	estudianteMarcador: 'Elige un estudiante',
	hasta: 'Calcular hasta el periodo',
	como: 'Cómo sale este informe',
	cargar: 'Cargar el informe',
	pila: 'Añadir a la pila de impresión',
};

export const GRUPOS = ['7°A', '7°B', '8°A', '8°B', '9°A'];
export const EL_GRUPO = 3;

/* ── La geometría del catálogo (coordenadas del contenido) ────────────────────────────────── */

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
export const CAT = {
	lado: 20,
	arriba: 20,
	buscadorAlto: 134,
	/** Dentro del buscador: la fila del título y la caja, y la de las pastillas. */
	fila: 50,
	hueco: 16,
	configurador: 420,
	/** La lista: la cabecera de la familia y las fichas. */
	familia: 44,
	ficha: { alto: 104, hueco: 10 },
	relleno: 20,
};

export const CUERPO_Y = CAT.arriba + CAT.buscadorAlto + CAT.hueco;
export const LISTA = { x: CAT.lado, y: CUERPO_Y, ancho: ANCHO_CONTENIDO - CAT.lado * 2 - CAT.configurador - CAT.hueco };
export const CONFIG = { x: LISTA.x + LISTA.ancho + CAT.hueco, y: CUERPO_Y, ancho: CAT.configurador };
export const ANCHO_FICHA = (LISTA.ancho - CAT.relleno * 2 - CAT.ficha.hueco) / 2;

/** La caja del buscador, en coordenadas del contenido. */
export const BUSCADOR = { x: CAT.lado + CAT.relleno + 128, y: CAT.arriba + 16, ancho: 560, alto: CAT.fila };

export function rectFicha(i: number) {
	return {
		x: LISTA.x + CAT.relleno + (i % 2) * (ANCHO_FICHA + CAT.ficha.hueco),
		y: LISTA.y + CAT.relleno + CAT.familia + Math.floor(i / 2) * (CAT.ficha.alto + CAT.ficha.hueco),
		ancho: ANCHO_FICHA,
		alto: CAT.ficha.alto,
	};
}

/*
 * EL CONFIGURADOR, de arriba abajo: cabecera (nombre y «para»), y los campos que pide la ficha. Cada
 * campo es rótulo (22) + control (48) + 18 de aire. Devuelve el rectángulo del control de cada uno
 * y el del botón grande, que es lo que el puntero pulsa.
 */
export const CAMPO = { rotulo: 24, control: 48, aire: 18 };
export const CABEZA_CONFIG = 96;

export function camposDe(ficha: Ficha) {
	const x = CONFIG.x + CAT.relleno;
	const ancho = CONFIG.ancho - CAT.relleno * 2;
	let y = CONFIG.y + CAT.relleno + CABEZA_CONFIG;
	const campos: Record<string, { x: number; y: number; ancho: number; alto: number }> = {};
	for (const que of ficha.pide) {
		campos[que] = { x, y: y + CAMPO.rotulo, ancho, alto: CAMPO.control };
		y += CAMPO.rotulo + CAMPO.control + CAMPO.aire;
	}
	const como = { x, y, ancho, alto: 40 };
	y += 40 + 14;
	const cargar = { x, y, ancho, alto: 52 };
	const pila = { x, y: y + 52 + 10, ancho, alto: 42 };
	return { campos, como, cargar, pila, fin: pila.y + pila.alto + CAT.relleno };
}

/** Una opción del desplegable abierto bajo un control. */
export const OPCION = 44;
export function rectOpcion(control: { x: number; y: number; ancho: number; alto: number }, i: number) {
	return { x: control.x, y: control.y + control.alto + 6 + 4 + i * OPCION, ancho: control.ancho, alto: OPCION };
}

export function enLaCascara(r: { x: number; y: number; ancho: number; alto: number }) {
	return { x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra, ancho: r.ancho, alto: r.alto };
}

/* ── El certificado ───────────────────────────────────────────────────────────────────────── */

/** La hoja de `.certificado`: 21 × 27 cm, en píxeles de pantalla. */
export const HOJA = { ancho: 794, alto: 1020 };

export const ALUMNO = {
	/** Como lo pinta el párrafo: apellidos y nombres, tal como están guardados. */
	nombre: 'CARDONA MEJÍA JUAN ESTEBAN',
	nombreLista: 'Cardona Mejía Juan Esteban',
	tipoDoc: 'TI',
	tipoDocLargo: 'Tarjeta de identidad',
	documento: '1.234.567.890',
	matricula: '0412',
	folio: '37',
	grupo: GRUPOS[EL_GRUPO],
	nivel: 'educación básica secundaria',
	fechaMatricula: '20 de enero de 2026',
};

/** Los alumnos del grupo, en el desplegable de «Estudiante» (apellidos y nombres). */
export const ALUMNOS_DEL_GRUPO = ['Arango Vélez Samuel', 'Bedoya Ríos Valeria', ALUMNO.nombreLista, 'Duque Salazar Mariana'];
export const EL_ALUMNO = 2;

export interface Asignatura {
	materia: string;
	profesor: string;
	ih: number;
	/** Las definitivas de los periodos 1 y 2; el 3 y el 4 aún no tienen. */
	per: [number, number];
}

export interface Area {
	area: string;
	asignaturas: Asignatura[];
}

export const AREAS: Area[] = [
	{ area: 'CIENCIAS NATURALES Y EDUCACIÓN AMBIENTAL', asignaturas: [{ materia: 'Biología', profesor: 'Paula Andrea Gil Montes', ih: 4, per: [82, 78] }] },
	{ area: 'CIENCIAS SOCIALES', asignaturas: [{ materia: 'Sociales', profesor: 'Jorge Iván Castaño Ruiz', ih: 4, per: [75, 81] }] },
	{ area: 'EDUCACIÓN ARTÍSTICA', asignaturas: [{ materia: 'Artística', profesor: 'Natalia Osorio Vélez', ih: 2, per: [90, 94] }] },
	{ area: 'EDUCACIÓN ÉTICA Y EN VALORES', asignaturas: [{ materia: 'Ética y valores', profesor: 'Carlos Andrés Loaiza Pérez', ih: 1, per: [88, 85] }] },
	{ area: 'EDUCACIÓN FÍSICA', asignaturas: [{ materia: 'Educación física', profesor: 'Wilson Arbeláez Ramírez', ih: 2, per: [96, 95] }] },
	{
		area: 'HUMANIDADES',
		asignaturas: [
			{ materia: 'Lengua castellana', profesor: 'Diana Marcela Ospina Toro', ih: 4, per: [70, 74] },
			{ materia: 'Inglés', profesor: 'Andrés Felipe Henao Gómez', ih: 3, per: [66, 72] },
		],
	},
	{
		area: 'MATEMÁTICAS',
		asignaturas: [
			{ materia: 'Matemáticas', profesor: 'Luisa Fernanda Zapata Cano', ih: 4, per: [62, 58] },
			{ materia: 'Geometría', profesor: 'Luisa Fernanda Zapata Cano', ih: 1, per: [71, 69] },
		],
	},
	{ area: 'TECNOLOGÍA E INFORMÁTICA', asignaturas: [{ materia: 'Tecnología', profesor: 'Héctor Fabio Rendón Marín', ih: 2, per: [84, 87] }] },
];

/** La escala del colegio (inventada, la nacional con 60 de mínima). */
export const ESCALA = [
	{ nombre: 'BAJO', desde: 0, hasta: 59 },
	{ nombre: 'BÁSICO', desde: 60, hasta: 79 },
	{ nombre: 'ALTO', desde: 80, hasta: 94 },
	{ nombre: 'SUPERIOR', desde: 95, hasta: 100 },
];
export const MINIMA = 60;
export const MINUTOS_CLASE = 55;

export function desempeno(nota: number): string {
	return ESCALA.find((e) => nota >= e.desde && nota <= e.hasta)?.nombre ?? '';
}

export const promedio = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** El número que imprime el certificado de periodo: el contador del año, que al cargarlo sube uno. */
export const NUMERO_TRAS_CARGAR = ALMENDROS.contador + 1;

/**
 * DÓNDE CAE EL NÚMERO Y EL PÁRRAFO EN LA HOJA: el plano corto del vídeo encuadra de la cabecera al
 * final del párrafo. Coordenadas de la hoja, medidas sobre su propio dibujo.
 */
export const ACERCAMIENTO_CERT = { y: 150, alto: 250 };
