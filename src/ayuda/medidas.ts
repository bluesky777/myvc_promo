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
	/** La barra de arriba: plegar, marca, «Buscador mágico…», el año y periodo, aspecto, ayuda, campana y retrato. */
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
	/**
	 * EL TERCER NIVEL: hijas que a su vez se despliegan (`menu.ts`: «Votaciones» dentro de
	 * «Configuración»). La clave es el texto de la hija. Sin esto, el menú es el de dos niveles.
	 */
	nietas?: Record<string, string[]>;
}

export type Icono =
	| 'inicio' | 'personas' | 'academico' | 'disciplina' | 'referencias'
	| 'horario' | 'informes' | 'configuracion' | 'docentes' | 'matriculas' | 'compromisos' | 'actividades';

/*
 * EL MENÚ DEL DOCENTE, como lo filtra hoy `menuPara` (`app2/src/app/cascara/menu/menu.ts` y
 * `visibilidad.ts`) para un docente de un colegio ponderado y sin permisos de más: diez secciones.
 * «Referencias» sólo sale con el permiso de editar el plan de evaluación y «Horario» no sale nunca
 * al docente, así que no están. «Docentes» sí: `seccionSePinta` la enseña en cuanto llegan.
 *
 * Es el menú de TODOS los vídeos del docente (desde el 2026-09-28): «Mis competencias» y no «Mis
 * desempeños» (renombrada el 26 sep), y «Actividades» es una sección propia, no una hija de
 * Académico. Las hijas van en el orden de `menu.ts` y con sus `visible` aplicados:
 *
 *   Académico     `esDocente`, `veMisCompetencias`, `califica`, `consulta` y `rutaDeInclusion`;
 *   Personas      `revisaPedidos` y `califica` (Acudientes es `esPersonal`: no);
 *   Matrículas    `personalDelColegio`;
 *   Compromisos   sólo «Mis compromisos» (`califica`);
 *   Configuración `conSesion`, `esDocente` (Mi firma), `personalDelColegio`, `veElMuro`.
 */
export const SECCIONES: Seccion[] = [
	{ etiqueta: 'Inicio', icono: 'inicio' },
	{ etiqueta: 'Docentes', icono: 'docentes' },
	{
		etiqueta: 'Académico',
		icono: 'academico',
		hijas: [
			'Mis asignaturas',
			'Mis competencias',
			'Trabajar sin internet',
			'Notas de un alumno',
			'Notas perdidas',
			'Recuperación del año',
			'Boletines independientes',
			'Promocionar notas',
			'Ruta de inclusión',
		],
	},
	{ etiqueta: 'Personas', icono: 'personas', hijas: ['Pedidos de cambio', 'Listado alumnos'] },
	{ etiqueta: 'Matrículas', icono: 'matriculas', hijas: ['Estaciones del día'] },
	/* Las cuatro las ve el docente (`menu.ts`: `disciplina` y `asistencias` incluyen `esDocente`). */
	{ etiqueta: 'Disciplina', icono: 'disciplina', hijas: ['Situaciones por grupos', 'Ordinales', 'Asistencias', 'Disciplina'] },
	{ etiqueta: 'Compromisos', icono: 'compromisos', hijas: ['Mis compromisos'] },
	{ etiqueta: 'Actividades', icono: 'actividades', hijas: ['Actividades', 'Banco de preguntas'] },
	{ etiqueta: 'Informes', icono: 'informes' },
	{
		etiqueta: 'Configuración',
		icono: 'configuracion',
		hijas: ['Imágenes', 'Mi firma', 'Votaciones', 'Mis sesiones', 'Calendario', 'Publicaciones'],
		nietas: { Votaciones: ['Votar', 'Resultados', 'Mesa de votacion', 'Acta en papel'] },
	},
];

/** El mismo: el nombre con el que lo pidieron los vídeos de «Moverse por MyVC». */
export const MENU_DOCENTE_HOY = SECCIONES;

/** Dónde está «Académico» en la lista. Lo usa el guion para saber a qué altura pulsa el puntero. */
export const ACADEMICO = SECCIONES.findIndex((s) => s.etiqueta === 'Académico');

/** Y dónde, dentro de ella, está «Mis asignaturas». */
export const MIS_ASIGNATURAS = SECCIONES[ACADEMICO].hijas!.findIndex((h) => h === 'Mis asignaturas');

export const NOTAS_PERDIDAS = SECCIONES[ACADEMICO].hijas!.findIndex((h) => h === 'Notas perdidas');

/**
 * LA ALTURA DE UNA ENTRADA DEL MENÚ, en coordenadas de la cáscara. `hija` es el índice dentro de la
 * sección, o `null` para la sección misma. Cuenta con que **sólo «Académico» se abre**: si algún día
 * el vídeo abriera dos secciones, esto tendría que recibir cuáles están abiertas.
 */
/**
 * LA ALTURA DE UNA ENTRADA EN CUALQUIER MENÚ, con la sección `abierta` desplegada (o ninguna).
 * Es la que usan los vídeos que no son del docente; `alturaDeEntrada` queda para los tres primeros.
 */
export function alturaEnMenu(menu: Seccion[], seccion: number, hija: number | null, abierta: number | null): number {
	let y = MEDIDAS.barra + MEDIDAS.menuArriba;
	for (let i = 0; i < seccion; i++) {
		y += MEDIDAS.seccion;
		if (i === abierta && menu[i].hijas) { y += menu[i].hijas!.length * MEDIDAS.hija; }
	}
	if (hija === null) { return y; }
	return y + MEDIDAS.seccion + hija * MEDIDAS.hija;
}

/*
 * EL MENÚ DE RECTOR Y COORDINACIÓN, sacado de `app2/src/app/cascara/menu/menu.ts` con lo que ve un
 * admin (y rector, por «Uso de la IA»).
 *
 * LO ÚNICO QUE NO ES COMO EN app2: faltan «Compromisos» (Compromisos académicos, Mis compromisos) y
 * «Actividades» (Actividades, Banco de preguntas), que van entre Disciplina y Referencias. Con ellas
 * el menú crece 92 px y lo que cuelga de Configuración --Calendario, Publicaciones y las nietas de
 * Votaciones-- se sale por abajo de los 900 de la cáscara: la aplicación desplaza el menú y aquí no
 * hay desplazamiento. Si un día se dibuja, se añaden aquí y todo lo demás sale de la cuenta.
 */
export const MENU_DIRECTIVO: Seccion[] = [
	{ etiqueta: 'Inicio', icono: 'inicio' },
	{ etiqueta: 'Docentes', icono: 'docentes' },
	{
		etiqueta: 'Académico',
		icono: 'academico',
		hijas: [
			/* `veMisCompetencias` incluye al admin: quien escribe por el docente (26 sep 2026). */
			'Mis competencias',
			'Trabajar sin internet',
			'Asignaturas por docente',
			'Notas de un alumno',
			'Notas perdidas',
			'Recuperación del año',
			'Boletines independientes',
			'Promocionar notas',
			'Ruta de inclusión',
		],
	},
	{
		etiqueta: 'Personas',
		icono: 'personas',
		/* Las trece que ve un admin, en el orden de `menu.ts` (`administraCuentas`, `llevaLaCartera`... las incluyen). */
		hijas: [
			'Alumnos',
			'Editar docentes',
			'Usuarios',
			'Matricular',
			'Cartera',
			'Pedidos de cambio',
			'Firmas por aprobar',
			'Prematrículas',
			'Acudientes',
			'Alumnos duplicados',
			'Alumnos sin matrícula',
			'Boletines de otros colegios',
			'Listado alumnos',
		],
	},
	/* «Mi matrícula» es de alumno y acudiente (`suyas`): el admin no la ve. */
	{ etiqueta: 'Matrículas', icono: 'matriculas', hijas: ['Estaciones del día', 'Tablero del día', 'Ventanilla de formularios', 'Aspirantes'] },
	{ etiqueta: 'Disciplina', icono: 'disciplina', hijas: ['Situaciones por grupos', 'Ordinales', 'Asistencias', 'Disciplina'] },
	{
		etiqueta: 'Referencias',
		icono: 'referencias',
		hijas: ['Niveles', 'Grados', 'Grupos', 'Áreas', 'Materias', 'Frases', 'Plan de evaluación', 'Asignaturas', 'Requisitos de matrícula'],
	},
	/* `menu.ts`: «El horario del colegio» (esAdmin) y las dos de `cuadraElHorario`, en ese orden. */
	{ etiqueta: 'Horario', icono: 'horario', hijas: ['El horario del colegio', 'Descargar el programa', 'Cuadrar el horario'] },
	{ etiqueta: 'Informes', icono: 'informes' },
	{ etiqueta: 'Configuración', icono: 'configuracion', hijas: ['El colegio', 'Uso de la IA', 'Ciudades', 'Bitácora', 'Imágenes', 'Votaciones', 'Mis sesiones', 'Calendario', 'Publicaciones'],
		/* Las nueve de `menu.ts`, sin tildes donde el código no las pone. */
		nietas: { Votaciones: ['Configurar', 'Candidatos', 'Votar', 'Resultados', 'Tarjetones', 'Mesas y asistentes', 'Mesa de votacion', 'Acta en papel', 'Auditoria del voto'] } },
];

/**
 * LA ALTURA DE UNA NIETA (tercer nivel), con su sección y su hija desplegadas. Cada nieta mide lo
 * que una hija: el menú de verdad las pinta de 36 a 40 px según el tema.
 */
export function alturaDeNieta(menu: Seccion[], seccion: number, hija: number, nieta: number): number {
	return alturaEnMenu(menu, seccion, hija, seccion) + MEDIDAS.hija + nieta * MEDIDAS.hija;
}

/** El índice de una sección, y de una hija dentro de ella, por su texto. Revienta si no está. */
export function entradaDe(menu: Seccion[], seccion: string, hija?: string): { seccion: number; hija: number | null } {
	const s = menu.findIndex((m) => m.etiqueta === seccion);
	if (s < 0) { throw new Error(`Menú: no hay sección «${seccion}».`); }
	if (hija === undefined) { return { seccion: s, hija: null }; }
	const h = menu[s].hijas?.indexOf(hija) ?? -1;
	if (h < 0) { throw new Error(`Menú: «${seccion}» no tiene «${hija}».`); }
	return { seccion: s, hija: h };
}

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

/*
 * EL MENÚ DE LA SECRETARIA (`menuPara` para un `Secretario` sin permisos de más). Lo que la separa
 * del de dirección: de Académico sólo «Mis competencias» (`escribePorElDocente`); en Personas ni
 * «Pedidos de cambio» (`revisaPedidos`) ni «Listado alumnos» (`califica`); sin Disciplina ni
 * Compromisos; de Referencias sólo «Requisitos de matrícula»; de Horario las dos de
 * `cuadraElHorario`; y en Configuración lo de `conSesion` y `personalDelColegio` (sin «El colegio»,
 * que es `puedeEntrarAlColegio`, ni «Publicaciones», que es `veElMuro`).
 */
export const MENU_SECRETARIA: Seccion[] = [
	{ etiqueta: 'Inicio', icono: 'inicio' },
	{ etiqueta: 'Docentes', icono: 'docentes' },
	{ etiqueta: 'Académico', icono: 'academico', hijas: ['Mis competencias'] },
	{
		etiqueta: 'Personas',
		icono: 'personas',
		hijas: [
			'Alumnos',
			'Editar docentes',
			'Usuarios',
			'Matricular',
			'Cartera',
			'Firmas por aprobar',
			'Prematrículas',
			'Acudientes',
			'Alumnos duplicados',
			'Alumnos sin matrícula',
			'Boletines de otros colegios',
		],
	},
	{ etiqueta: 'Matrículas', icono: 'matriculas', hijas: ['Estaciones del día', 'Tablero del día', 'Ventanilla de formularios', 'Aspirantes'] },
	{ etiqueta: 'Actividades', icono: 'actividades', hijas: ['Actividades', 'Banco de preguntas'] },
	{ etiqueta: 'Referencias', icono: 'referencias', hijas: ['Requisitos de matrícula'] },
	{ etiqueta: 'Horario', icono: 'horario', hijas: ['Descargar el programa', 'Cuadrar el horario'] },
	{ etiqueta: 'Informes', icono: 'informes' },
	{
		etiqueta: 'Configuración',
		icono: 'configuracion',
		hijas: ['Imágenes', 'Votaciones', 'Mis sesiones', 'Calendario'],
		nietas: { Votaciones: ['Votar', 'Resultados', 'Mesa de votacion', 'Acta en papel'] },
	},
];
