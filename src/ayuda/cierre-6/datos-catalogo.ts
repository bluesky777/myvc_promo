import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CATÁLOGO DE INFORMES (`/informes`), TAL COMO LO USAN LOS VÍDEOS 6, 7 Y 8 DEL CIERRE: el
 * buscador con sus familias, la familia «Cierre de año» abierta, y el configurador de la derecha.
 *
 * Los textos son los de `informes/catalogo/impresos.ts` y `catalogo-informes.html`, literales: el
 * `h1` es «Informes», el buscador dice «¿Qué necesitas imprimir? …», las familias son un filtro con
 * su cuenta, y cada ficha lleva su «para qué» debajo del nombre. Las cuentas son las de
 * `impresos.ts` contadas por familia; a un usuario con menos permisos le saldrían menos.
 *
 * LA GEOMETRÍA SE CALCULA AQUÍ: las pastillas llevan un ancho fijo por letra, y así el puntero sabe
 * dónde cae «Cierre de año» sin medir el dibujo.
 */

export const CAT_TEXTOS = {
	titulo: 'Informes',
	busqueda: '¿Qué necesitas imprimir? Boletines, certificado, planilla, quién falta…',
	contexto: { periodo: '4', grupos: 13 },
	sinCampos: 'Este informe no necesita que elijas nada.',
	cargar: 'Cargar el informe',
	pila: 'Añadir a la pila de impresión',
	grupo: 'Grupo',
	eligeGrupo: 'Elige un grupo',
};

export const FAMILIAS = [
	{ titulo: 'Todo', cuenta: 63 },
	{ titulo: 'Para la familia', cuenta: 13 },
	{ titulo: 'Para el aula', cuenta: 7 },
	{ titulo: 'Cómo va el grupo', cuenta: 6 },
	{ titulo: 'Cifras y tendencias', cuenta: 7 },
	{ titulo: 'Quién vino', cuenta: 3 },
	{ titulo: 'Convivencia e inclusión', cuenta: 6 },
	{ titulo: 'Cierre de año', cuenta: 6 },
	{ titulo: 'Horario', cuenta: 8 },
	{ titulo: 'Secretaría y dirección', cuenta: 7 },
];
export const CIERRE_DE_ANO = FAMILIAS.findIndex((f) => f.titulo === 'Cierre de año');

export interface Ficha {
	nombre: string;
	para: string;
	/** Lo que pide el configurador: sólo el grupo, o nada. */
	pideGrupo: boolean;
	firma?: boolean;
	alerta?: boolean;
}

/** Lo que se ve antes de elegir familia: el principio de «Para la familia». */
export const PARA_LA_FAMILIA = {
	titulo: 'Para la familia',
	para: 'Lo que sale del colegio en un sobre.',
	fichas: [
		{ nombre: 'Boletín del periodo', para: 'El detallado, con la gráfica. Es el que recibe la familia al cerrar el periodo.', pideGrupo: true },
		{ nombre: 'Boletín con definitivas por periodo', para: 'Corto, con la columna de cada periodo. No lleva la leyenda del pie.', pideGrupo: true },
		{ nombre: 'Boletín descriptivo de preescolar', para: 'Sin gráfica y sin rojos: valoraciones en palabras.', pideGrupo: true },
		{ nombre: 'Boletín por competencias', para: 'La competencia arriba y sus desempeños debajo, con el nivel de cada uno en palabras.', pideGrupo: true },
		{ nombre: 'Notas del año', para: 'Todo lo que lleva el alumno en el año, periodo a periodo.', pideGrupo: true },
		{ nombre: 'Notas perdidas del año', para: 'Sólo lo que va perdido, para avisar en casa.', pideGrupo: true },
	] as Ficha[],
};

/** «Cierre de año», las seis, en el orden de `impresos.ts`. */
export const CIERRE_DE_ANO_FAMILIA = {
	titulo: 'Cierre de año',
	para: 'Lo que se firma en diciembre.',
	fichas: [
		{ nombre: 'Boletín final', para: 'El del año, con la firma del titular del grupo.', pideGrupo: true },
		{ nombre: 'Boletín final de preescolar', para: 'El descriptivo de fin de año.', pideGrupo: true },
		{ nombre: 'Acta de evaluación y promoción', para: 'La del colegio entero. Se firma después de calcular promovidos.', pideGrupo: false, firma: true },
		{ nombre: 'Promovidos y no promovidos', para: 'De un grupo, con lo que le queda a cada alumno. El papel de la comisión.', pideGrupo: true },
		{ nombre: 'Libros finales', para: 'El mismo papel del boletín final, con la firma de secretaría.', pideGrupo: true },
		{ nombre: 'Acta de nivelación y recuperación', para: 'Lo que se firma cuando un alumno recupera: qué presentó y con qué nota quedó.', pideGrupo: true, firma: true, alerta: true },
	] as Ficha[],
};

export const ACTA_PROMOCION = 2;
export const PROMOVIDOS = 3;
export const ACTA_NIVELACION = 5;

export const CAT = {
	arriba: 20,
	lados: 28,
	pad: 22,
	fila1: 44,
	busca: 50,
	hueco: 14,
	pastilla: 36,
	huecoPastilla: 10,
	trasTarjeta: 20,
	cabezaFamilia: 70,
	ficha: 98,
	huecoFicha: 12,
	config: 340,
	huecoConfig: 22,
};

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
const ANCHO_UTIL = ANCHO_CONTENIDO - CAT.lados * 2;
const ANCHO_DENTRO_TARJETA = ANCHO_UTIL - CAT.pad * 2;

/** El ancho de una pastilla: por letra, más el hueco de la cuenta. Sale de aquí y no del dibujo. */
export const anchoDePastilla = (f: { titulo: string; cuenta: number }) => Math.round((f.titulo.length + String(f.cuenta).length) * 8.4 + 40);

/** Dónde cae cada pastilla, en coordenadas del CONTENIDO, envolviendo como el `flex-wrap`. */
export const PASTILLAS = (() => {
	const arriba = CAT.arriba + CAT.pad + CAT.fila1 + CAT.hueco + CAT.busca + CAT.hueco;
	let x = 0;
	let fila = 0;
	return FAMILIAS.map((f) => {
		const ancho = anchoDePastilla(f);
		if (x + ancho > ANCHO_DENTRO_TARJETA) { x = 0; fila++; }
		const r = { x: CAT.lados + CAT.pad + x, y: arriba + fila * (CAT.pastilla + CAT.huecoPastilla), ancho, alto: CAT.pastilla };
		x += ancho + CAT.huecoPastilla;
		return r;
	});
})();

const FILAS_DE_PASTILLAS = PASTILLAS[PASTILLAS.length - 1].y - PASTILLAS[0].y + CAT.pastilla;
export const ALTO_TARJETA = CAT.pad * 2 + CAT.fila1 + CAT.hueco + CAT.busca + CAT.hueco + FILAS_DE_PASTILLAS;

export const ANCHO_LISTA_FICHAS = ANCHO_UTIL - CAT.config - CAT.huecoConfig;
export const ANCHO_FICHA = (ANCHO_LISTA_FICHAS - CAT.huecoFicha) / 2;
const ARRIBA_FICHAS = CAT.arriba + ALTO_TARJETA + CAT.trasTarjeta + CAT.cabezaFamilia;

/** Una ficha, en coordenadas del contenido. Dos columnas. */
export function rectanguloDeFichaEnContenido(i: number) {
	return {
		x: CAT.lados + (i % 2) * (ANCHO_FICHA + CAT.huecoFicha),
		y: ARRIBA_FICHAS + Math.floor(i / 2) * (CAT.ficha + CAT.huecoFicha),
		ancho: ANCHO_FICHA,
		alto: CAT.ficha,
	};
}

/* ── El configurador ──────────────────────────────────────────────────────────────────────── */

export const CONF = { pad: 20, cabeza: 128, campo: 86, boton: 46, huecoBoton: 12 };
export const X_CONFIG = CAT.lados + ANCHO_LISTA_FICHAS + CAT.huecoConfig;
export const Y_CONFIG = CAT.arriba + ALTO_TARJETA + CAT.trasTarjeta;

export function rectanguloDelSelectorDeGrupo() {
	return { x: X_CONFIG + CONF.pad, y: Y_CONFIG + CONF.pad + CONF.cabeza + 24, ancho: CAT.config - CONF.pad * 2, alto: 44 };
}

export function rectanguloDeCargar(pideGrupo: boolean) {
	return {
		x: X_CONFIG + CONF.pad,
		y: Y_CONFIG + CONF.pad + CONF.cabeza + (pideGrupo ? CONF.campo : 54),
		ancho: CAT.config - CONF.pad * 2,
		alto: CONF.boton,
	};
}

/** El configurador entero. */
export function rectanguloDelConfigurador(pideGrupo: boolean) {
	const c = rectanguloDeCargar(pideGrupo);
	return { x: X_CONFIG, y: Y_CONFIG, ancho: CAT.config, alto: c.y + CONF.boton * 2 + CONF.huecoBoton + CONF.pad - Y_CONFIG };
}

/** De coordenadas del contenido a las de la CÁSCARA. */
export const enLaCascara = (r: { x: number; y: number; ancho: number; alto: number }) => ({
	...r,
	x: r.x + MEDIDAS.menu,
	y: r.y + MEDIDAS.barra,
});

/* ══════════════════════════════════════════════════════════════════════════════════════════════
 * AÑADIDO PARA LA SERIE «INFORMES» (encontrar, ajustes, pila, semáforo, puestos…). No cambia nada
 * de lo de arriba: los vídeos del cierre siguen pintando lo mismo.
 *
 * EL CATÁLOGO ENTERO, las 63 entradas de `informes/catalogo/impresos.ts` en su orden, con lo que
 * el buscador lee (nombre, para y sinónimos) y lo que el configurador pide. Los textos son
 * literales. Con él se puede buscar como busca la aplicación --`casa()`: todas las palabras, sin
 * tildes y en minúscula, sobre nombre + para + sinónimos-- en vez de escribir a mano qué sale.
 * ══════════════════════════════════════════════════════════════════════════════════════════════ */

export type ClaveFamilia = 'familia' | 'aula' | 'seguimiento' | 'cifras' | 'asistencia' | 'convivencia' | 'cierre' | 'horario' | 'secretaria';
export type Pide = 'destinatario' | 'grupo' | 'profesor' | 'alumno' | 'hasta';

/** Las nueve familias, en el orden de `FAMILIAS` de `impresos.ts`, con su «para». */
export const FAMILIAS_DEL_CATALOGO: { clave: ClaveFamilia; titulo: string; para: string }[] = [
	{ clave: 'familia', titulo: 'Para la familia', para: 'Lo que sale del colegio en un sobre.' },
	{ clave: 'aula', titulo: 'Para el aula', para: 'Lo que el docente se lleva a clase.' },
	{ clave: 'seguimiento', titulo: 'Cómo va el grupo', para: 'Lo que se mira en comisión de evaluación.' },
	{ clave: 'cifras', titulo: 'Cifras y tendencias', para: 'Con gráficas, para rectoría y para el consejo académico.' },
	{ clave: 'asistencia', titulo: 'Quién vino', para: 'Asistencia, tardanzas y ausencias.' },
	{ clave: 'convivencia', titulo: 'Convivencia e inclusión', para: 'Observador, situaciones y ruta de inclusión.' },
	{ clave: 'cierre', titulo: 'Cierre de año', para: 'Lo que se firma en diciembre.' },
	{ clave: 'horario', titulo: 'Horario', para: 'Lo que se cuelga en la sala de profesores.' },
	{ clave: 'secretaria', titulo: 'Secretaría y dirección', para: 'Listados, cartera y cifras del colegio.' },
];

export interface Impreso {
	clave: string;
	nombre: string;
	/** La palabra del nombre que va en negrita: lo que distingue a dos hermanos. */
	realce?: string;
	para: string;
	familia: ClaveFamilia;
	papel: 'vertical' | 'apaisado';
	pide: Pide[];
	/** Cómo lo llama la gente. No se pinta: sólo lo lee el buscador. */
	sinonimos: string;
	/** `fuera`: se imprime desde otra pantalla («Vive fuera»); `propuesto`: todavía no existe («Todavía no»). */
	estado?: 'fuera' | 'propuesto';
	/** Con `fuera`: cómo se llama la pantalla donde vive. */
	dondeVive?: string;
	/** Si el desplegable de grupo ofrece «Todos los grupos». */
	todos?: boolean;
	todosPorDefecto?: boolean;
}

export const IMPRESOS: Impreso[] = [
	{ clave: 'boletin-detallado', nombre: 'Boletín del periodo', familia: 'familia', papel: 'vertical', pide: ['destinatario', 'grupo'],
		para: 'El detallado, con la gráfica. Es el que recibe la familia al cerrar el periodo.',
		sinonimos: 'boletin boletines notas del periodo entrega informe academico tipo 1' },
	{ clave: 'boletin-definitivas', nombre: 'Boletín con definitivas por periodo', familia: 'familia', papel: 'vertical', pide: ['destinatario', 'grupo'],
		para: 'Corto, con la columna de cada periodo. No lleva la leyenda del pie.',
		sinonimos: 'boletin definitivas por periodo columnas tipo 3 corto' },
	{ clave: 'boletin-preescolar', nombre: 'Boletín descriptivo de preescolar', familia: 'familia', papel: 'vertical', pide: ['grupo'],
		para: 'Sin gráfica y sin rojos: valoraciones en palabras.',
		sinonimos: 'preescolar transicion jardin descriptivo tipo 4 sin grafica' },
	{ clave: 'boletin-competencias', nombre: 'Boletín por competencias', familia: 'familia', papel: 'vertical', pide: ['destinatario', 'grupo'],
		para: 'La competencia arriba y sus desempeños debajo, con el nivel de cada uno en palabras.',
		sinonimos: 'competencias desempenos niveles tipo 6' },
	{ clave: 'notas-ano', nombre: 'Notas del año', familia: 'familia', papel: 'vertical', pide: ['destinatario', 'grupo'],
		para: 'Todo lo que lleva el alumno en el año, periodo a periodo.',
		sinonimos: 'notas actuales del ano acumulado consolidado del alumno' },
	{ clave: 'perdidas-ano', nombre: 'Notas perdidas del año', familia: 'familia', papel: 'vertical', pide: ['destinatario', 'grupo'],
		para: 'Sólo lo que va perdido, para avisar en casa.',
		sinonimos: 'perdidas reprobadas rojas del ano alerta' },
	{ clave: 'semaforo', nombre: 'Semáforo académico', familia: 'familia', papel: 'vertical', pide: ['grupo'],
		para: 'Media hoja por alumno, dos por folio: sus notas con color, faltas, situaciones y las firmas de recibido.',
		sinonimos: 'semaforo preinforme informe parcial mitad de periodo alerta temprana citacion acudiente firma de recibido' },
	{ clave: 'certificado-estudio', nombre: 'Certificado de estudio', familia: 'familia', papel: 'vertical', pide: ['destinatario', 'grupo'],
		para: 'Con todos los periodos calculados. Para un traslado.',
		sinonimos: 'certificado de estudio traslado notas certificadas constancia con notas' },
	{ clave: 'certificado-periodos', nombre: 'Certificado hasta un periodo', familia: 'familia', papel: 'vertical', pide: ['destinatario', 'grupo', 'hasta'],
		para: 'El mismo, calculado hasta el periodo que elijas.',
		sinonimos: 'certificado por periodos parcial traslado a mitad de ano' },
	{ clave: 'certificados-alumno', nombre: 'Certificados de todos los años', familia: 'familia', papel: 'vertical', pide: ['grupo', 'alumno'],
		para: 'Un certificado por cada año que el alumno estudió aquí, cada año en su hoja.',
		sinonimos: 'certificado todos los anos historial academico grados cursados hoja de vida traslado bachiller' },
	{ clave: 'constancia', nombre: 'Constancia de estudio', familia: 'familia', papel: 'vertical', pide: ['grupo', 'alumno'],
		para: 'Una hoja firmada que dice que está matriculado. Sin notas, para el banco o el subsidio.',
		sinonimos: 'constancia de estudio matricula certificacion carta banco subsidio icbf' },
	{ clave: 'citacion', nombre: 'Citación al acudiente', familia: 'familia', papel: 'vertical', pide: ['grupo', 'alumno'],
		para: 'Con el motivo ya escrito: inasistencias, desempeño o convivencia.',
		sinonimos: 'citacion acudiente padre madre llamado reunion motivo compromiso desprendible' },
	{ clave: 'compromiso', nombre: 'Compromiso académico', familia: 'familia', papel: 'vertical', pide: [], estado: 'propuesto',
		para: 'El plan de apoyo que firma la familia, con lo perdido y su nota congelada. Cuando vuelve el veredicto, el mismo papel dice qué pasó.',
		sinonimos: 'compromiso academico acta de compromiso plan de apoyo nivelacion firma acudiente perdidas resultado' },
	{ clave: 'planillas-grupo', nombre: 'Planillas del grupo', familia: 'aula', papel: 'apaisado', pide: ['grupo'],
		para: 'Una por asignatura, en blanco, para anotar a mano.',
		sinonimos: 'planilla planillas en blanco anotar notas a mano grupo' },
	{ clave: 'planillas-profesor', nombre: 'Planillas del profesor', familia: 'aula', papel: 'apaisado', pide: ['profesor'],
		para: 'Las de un docente, de todos sus grupos.',
		sinonimos: 'planilla profesor docente sus grupos' },
	{ clave: 'control-entrada', nombre: 'Control de entrada', familia: 'aula', papel: 'apaisado', pide: [],
		para: 'Para la puerta: llegadas tarde y firma de quien recibe.',
		sinonimos: 'control entrada tardanza puerta llegada tarde retardo' },
	{ clave: 'control-clase', nombre: 'Planilla de asistencia a clase', familia: 'aula', papel: 'apaisado', pide: [],
		para: 'La rejilla en blanco para pasar lista.',
		sinonimos: 'asistencia clase pasar lista rejilla en blanco llamado' },
	{ clave: 'listas', nombre: 'Listas personalizadas', familia: 'aula', papel: 'vertical', pide: [],
		para: 'Eliges las columnas y sale la lista.',
		sinonimos: 'listas personalizadas columnas a medida directorio telefonos' },
	{ clave: 'directorio', nombre: 'Directorio del grupo', familia: 'aula', papel: 'vertical', pide: [], estado: 'propuesto',
		para: 'Acudientes y teléfonos, con el celular del propio alumno en el primer renglón.',
		sinonimos: 'directorio telefonos celulares acudientes contactos grupo lista' },
	{ clave: 'planilla-notas-docente', nombre: 'Planilla de notas del docente', familia: 'aula', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Mis asignaturas',
		para: 'La planilla donde se digita, tal como la ve quien califica.',
		sinonimos: 'planilla notas docente digitar calificar asignatura en blanco' },
	{ clave: 'puestos-periodo', nombre: 'Puestos por periodo', realce: 'periodo', familia: 'seguimiento', papel: 'vertical', pide: ['grupo'], todos: true,
		para: 'El orden de mérito del periodo abierto, de un grupo o de todos.',
		sinonimos: 'puestos ranking orden de merito primer puesto periodo todos los grupos colegio entero' },
	{ clave: 'puestos-ano', nombre: 'Puestos por año', realce: 'año', familia: 'seguimiento', papel: 'vertical', pide: ['grupo', 'hasta'], todos: true,
		para: 'Acumulado hasta el periodo que elijas, de un grupo o de todos.',
		sinonimos: 'puestos ano acumulado ranking orden de merito todos los grupos colegio entero' },
	{ clave: 'nota-faltante', nombre: 'Nota que necesita en el periodo 4', familia: 'seguimiento', papel: 'vertical', pide: ['grupo'], todos: true, todosPorDefecto: true,
		para: 'Cuánto le falta a cada alumno, asignatura por asignatura, para ganar el año. De un grupo o de todos.',
		sinonimos: 'nota faltante falta necesita cuanto le falta ganar el ano pasar cuarto periodo p4 proyeccion recuperar' },
	{ clave: 'perdidas-profesor', nombre: 'Notas perdidas del profesor', familia: 'seguimiento', papel: 'apaisado', pide: ['profesor', 'hasta'],
		para: 'Lo que va perdido en las asignaturas de un docente.',
		sinonimos: 'perdidas profesor docente reprobadas rojas' },
	{ clave: 'perdidas-todos', nombre: 'Notas perdidas de todos', familia: 'seguimiento', papel: 'apaisado', pide: ['hasta'],
		para: 'El colegio entero. Es el papel de la comisión de evaluación.',
		sinonimos: 'perdidas todos colegio comision de evaluacion reprobadas' },
	{ clave: 'consolidado', nombre: 'Consolidado del grupo (la sábana)', familia: 'seguimiento', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Definitivas por periodo',
		para: 'Todas las definitivas de un grupo en un solo cuadro.',
		sinonimos: 'sabana consolidado definitivas por periodo cuadro general resumen' },
	{ clave: 'tablero-colegio', nombre: 'Tablero del colegio', familia: 'cifras', papel: 'apaisado', pide: [], estado: 'propuesto',
		para: 'Matrícula, retirados, promedio y aprobación del colegio entero, en una hoja.',
		sinonimos: 'tablero resumen colegio rectoria indicadores matricula desercion aprobacion como vamos' },
	{ clave: 'mapa-calor', nombre: 'Mapa de calor: asignatura × grupo', familia: 'cifras', papel: 'apaisado', pide: [], estado: 'propuesto',
		para: 'Una celda por cruce, con el porcentaje que gana cada asignatura en cada grupo.',
		sinonimos: 'mapa de calor asignatura grupo cruce porcentaje ganan pierden semaforo general' },
	{ clave: 'rendimiento-asignatura', nombre: 'Rendimiento por asignatura', familia: 'cifras', papel: 'apaisado', pide: [], estado: 'propuesto',
		para: 'Barras de mayor a menor, en rojo lo que baja del mínimo del colegio.',
		sinonimos: 'rendimiento por asignatura barras ranking peores materias umbral' },
	{ clave: 'perfil-grupo', nombre: 'Perfil del grupo', familia: 'cifras', papel: 'apaisado', pide: [], estado: 'propuesto',
		para: 'Cuántos quedan en Bajo, Básico, Alto y Superior en cada asignatura.',
		sinonimos: 'perfil del grupo desempenos bajo basico alto superior distribucion apiladas' },
	{ clave: 'evolucion-alumno', nombre: 'Evolución del alumno', familia: 'cifras', papel: 'vertical', pide: [], estado: 'propuesto',
		para: 'Su línea contra la del grupo, y qué asignaturas subieron o bajaron.',
		sinonimos: 'evolucion del alumno progreso linea periodos subio bajo tendencia' },
	{ clave: 'asistencia-vistazo', nombre: 'Asistencia en un vistazo', familia: 'cifras', papel: 'apaisado', pide: [], estado: 'propuesto',
		para: 'Ausencias y tardanzas por mes y por día de la semana. En cuentas, no en porcentaje.',
		sinonimos: 'asistencia vistazo grafica ausencias tardanzas mes dia semana tendencia' },
	{ clave: 'convivencia-cifras', nombre: 'Convivencia en cifras', familia: 'cifras', papel: 'apaisado', pide: [], estado: 'propuesto',
		para: 'Situaciones I, II y III por mes, y de dónde salen.',
		sinonimos: 'convivencia cifras situaciones tipo i ii iii disciplina mes estadistica' },
	{ clave: 'ver-ausencias', nombre: 'Ver ausencias', familia: 'asistencia', papel: 'vertical', pide: [],
		para: 'Las faltas registradas, tal como las manda la app móvil.',
		sinonimos: 'ausencias faltas inasistencia quien falta quien falto fallas' },
	{ clave: 'asistencia-padres', nombre: 'Asistencia de padres', familia: 'asistencia', papel: 'vertical', pide: [],
		para: 'La planilla de firmas de la entrega de boletines.',
		sinonimos: 'asistencia padres acudientes firma entrega de boletines reunion' },
	{ clave: 'inasistencias-alumno', nombre: 'Inasistencias por alumno', familia: 'asistencia', papel: 'apaisado', pide: ['grupo'],
		para: 'Faltas y tardanzas de cada alumno del grupo, contadas por separado y con las rachas.',
		sinonimos: 'inasistencias faltas por alumno ausencias tardanzas rachas seguidas citacion reprobar' },
	{ clave: 'observador-vertical', nombre: 'Observador del grupo', familia: 'convivencia', papel: 'vertical', pide: ['grupo'],
		para: 'Dos hojas por alumno: la ficha con sus renglones y el reverso por periodos.',
		sinonimos: 'observador vertical anotaciones seguimiento alumno' },
	{ clave: 'observador-todos', nombre: 'Observador — el colegio entero', familia: 'convivencia', papel: 'vertical', pide: [],
		para: 'Todos los grupos, dos hojas por alumno. La cuenta sale arriba antes de darle.',
		sinonimos: 'observador todos colegio entero' },
	{ clave: 'observador-horizontal', nombre: 'Observador apaisado', familia: 'convivencia', papel: 'apaisado', pide: ['grupo'],
		para: 'Dos alumnos por hoja.',
		sinonimos: 'observador horizontal apaisado dos por hoja' },
	{ clave: 'observador-alumno', nombre: 'Observador de un alumno', familia: 'convivencia', papel: 'vertical', pide: [], estado: 'fuera', dondeVive: 'Disciplina',
		para: 'La ficha de un solo alumno, con sus anotaciones del año.',
		sinonimos: 'observador de un alumno ficha anotacion individual seguimiento' },
	{ clave: 'situaciones', nombre: 'Situaciones disciplinarias', familia: 'convivencia', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Situaciones por grupos',
		para: 'Las situaciones tipo I, II y III de cada grupo.',
		sinonimos: 'situaciones disciplinarias tipo i ii iii convivencia procesos debido proceso' },
	{ clave: 'informe-pedagogico', nombre: 'Informe pedagógico (ruta de inclusión)', familia: 'convivencia', papel: 'vertical', pide: [], estado: 'fuera', dondeVive: 'Ruta de inclusión',
		para: 'El PIAR: ajustes razonables y seguimiento del alumno con necesidades educativas.',
		sinonimos: 'piar inclusion informe pedagogico ajustes razonables nee discapacidad flexibilizacion' },
	{ clave: 'boletin-final', nombre: 'Boletín final', familia: 'cierre', papel: 'vertical', pide: ['destinatario', 'grupo', 'hasta'],
		para: 'El del año, con la firma del titular del grupo.',
		sinonimos: 'boletin final de ano firma titular cierre' },
	{ clave: 'final-preescolar', nombre: 'Boletín final de preescolar', familia: 'cierre', papel: 'vertical', pide: ['grupo'],
		para: 'El descriptivo de fin de año.',
		sinonimos: 'final preescolar transicion descriptivo' },
	{ clave: 'acta-promocion', nombre: 'Acta de evaluación y promoción', familia: 'cierre', papel: 'apaisado', pide: [],
		para: 'La del colegio entero. Se firma después de calcular promovidos.',
		sinonimos: 'acta evaluacion promocion promovidos consejo diciembre firma' },
	{ clave: 'promovidos-grupo', nombre: 'Promovidos y no promovidos', familia: 'cierre', papel: 'apaisado', pide: ['grupo'],
		para: 'De un grupo, con lo que le queda a cada alumno. El papel de la comisión.',
		sinonimos: 'promovidos no promovidos repite repitente pasa promocion comision grupo pendientes' },
	{ clave: 'libros-finales', nombre: 'Libros finales', familia: 'cierre', papel: 'vertical', pide: ['grupo'],
		para: 'El mismo papel del boletín final, con la firma de secretaría.',
		sinonimos: 'libros finales libro secretaria firma archivo fin de ano' },
	{ clave: 'acta-nivelacion', nombre: 'Acta de nivelación y recuperación', familia: 'cierre', papel: 'apaisado', pide: ['grupo'],
		para: 'Lo que se firma cuando un alumno recupera: qué presentó y con qué nota quedó.',
		sinonimos: 'acta de nivelacion recuperacion habilitacion refuerzo superacion pendientes comision' },
	{ clave: 'horario-grupo', nombre: 'Horario por grupo', familia: 'horario', papel: 'vertical', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Una rejilla por grupo.',
		sinonimos: 'horario por grupo rejilla clases salon' },
	{ clave: 'horario-docente', nombre: 'Horario por docente', familia: 'horario', papel: 'vertical', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Una hoja por profesor.',
		sinonimos: 'horario por docente profesor carga clases' },
	{ clave: 'horario-colegio', nombre: 'El colegio entero', familia: 'horario', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Todo el horario en una tabla grande.',
		sinonimos: 'horario general colegio entero mural completo' },
	{ clave: 'horario-salon', nombre: 'Horario por salón', familia: 'horario', papel: 'vertical', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Para pegar en la puerta del aula.',
		sinonimos: 'horario por salon aula puerta pegar' },
	{ clave: 'horario-carga', nombre: 'Carga por docente', familia: 'horario', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Horas semanales y ventanas de cada profesor.',
		sinonimos: 'carga horas semanales ventanas docente asignacion' },
	{ clave: 'horario-libre', nombre: 'Quién está libre', familia: 'horario', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Para cubrir una ausencia hoy mismo.',
		sinonimos: 'quien esta libre reemplazo cubrir ausencia disponible ahora' },
	{ clave: 'horario-dispo', nombre: 'Disponibilidad declarada', familia: 'horario', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Lo que cada docente dijo que puede dar.',
		sinonimos: 'disponibilidad declarada docente restricciones puede' },
	{ clave: 'horario-sin-colocar', nombre: 'Clases sin colocar', familia: 'horario', papel: 'vertical', pide: [], estado: 'fuera', dondeVive: 'Horario',
		para: 'Lo que queda por cuadrar.',
		sinonimos: 'sin colocar pendiente cuadrar horario falta ubicar' },
	{ clave: 'listado-docentes', nombre: 'Listado de docentes', familia: 'secretaria', papel: 'apaisado', pide: [],
		para: 'Con cédula, título y asignaturas.',
		sinonimos: 'listado docentes profesores planta personal' },
	{ clave: 'alumnos-en-grupos', nombre: 'Alumnos en grupos', familia: 'secretaria', papel: 'vertical', pide: [],
		para: 'Cuántos hay en cada grupo, con el total.',
		sinonimos: 'cantidad alumnos por grupo matricula total cuantos' },
	{ clave: 'cumpleanos', nombre: 'Cumpleaños por meses', familia: 'secretaria', papel: 'apaisado', pide: [],
		para: 'Para la cartelera.',
		sinonimos: 'cumpleanos cumples meses cartelera fechas de nacimiento' },
	{ clave: 'unidades-profesor', nombre: 'Unidades del profesor', familia: 'secretaria', papel: 'vertical', pide: ['profesor'],
		para: 'Lo planeado por un docente en el periodo.',
		sinonimos: 'unidades plan de aula planeacion profesor' },
	{ clave: 'formularios-inscripcion', nombre: 'Formularios de inscripción', familia: 'secretaria', papel: 'vertical', pide: [],
		para: 'El papel que se le entrega a la familia. En blanco para los nuevos, con los datos puestos para renovar.',
		sinonimos: 'formulario inscripcion matricula prematricula renovacion admision aspirante hoja de matricula solicitud de cupo' },
	{ clave: 'cartera', nombre: 'Cartera por grupo', familia: 'secretaria', papel: 'apaisado', pide: [], estado: 'fuera', dondeVive: 'Cartera',
		para: 'Quién debe y cuánto.',
		sinonimos: 'cartera deuda pension cobro pagos mora paz y salvo' },
	{ clave: 'ficha-matricula', nombre: 'Ficha de matrícula del alumno', familia: 'secretaria', papel: 'vertical', pide: ['grupo', 'alumno'],
		para: 'La hoja que la familia firma al matricular, con sus datos, sus acudientes y los requisitos.',
		sinonimos: 'ficha de matricula hoja de vida carpeta datos alumno acudiente documentos requisitos firma' },
];

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** `casa()` de `catalogo-informes.ts`: TODAS las palabras, en cualquier orden, sin tildes. */
export function casaConLaBusqueda(impreso: Impreso, consulta: string): boolean {
	if (!consulta.trim()) { return true; }
	const heno = sinTildes(`${impreso.nombre} ${impreso.para} ${impreso.sinonimos}`);
	return sinTildes(consulta).split(/\s+/).filter(Boolean).every((p) => heno.includes(p));
}

export function buscarImpresos(consulta: string): Impreso[] {
	return IMPRESOS.filter((i) => casaConLaBusqueda(i, consulta));
}

export function impresoDe(clave: string): Impreso {
	const i = IMPRESOS.find((x) => x.clave === clave);
	if (!i) { throw new Error(`No hay impreso «${clave}» en el catálogo.`); }
	return i;
}
