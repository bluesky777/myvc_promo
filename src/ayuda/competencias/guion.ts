import { ACADEMICO, MEDIDAS, SECCIONES, alturaDeEntrada } from '../medidas';

const MIS_COMPETENCIAS = SECCIONES[ACADEMICO].hijas!.indexOf('Mis competencias');
import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { acercamientoAUnaHoja, encuadreDeUnaHoja, enElFotograma } from '../encuadre';
import { AVISO_DEL_VOCABULARIO, VOCABULARIO } from '../../comunes/vocabulario';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { LA_QUE_SE_ABRE, rectanguloDelBoton } from '../planilla/datos';
import {
	ACERCAMIENTO, ANCHO, ANCHO_TIRA_CLASES, DESEMPENOS, DESEMPENOS_ALTO, HOJA, INFORMES_ALTO, INFORMES_TEXTOS,
	UNIDADES_ALTO, arribaDeLaAyuda, arribaDeLaFranja, arribaDelBuscador, arribaDelPlanDeArea,
	anchoDelBuscador, arribaDeLosPeriodos,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «CALIFICAR POR COMPETENCIAS». Era de 109 s; con la voz (2026-09-29) quedó en 73.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ NO SON DOS VÍDEOS, QUE ES LO QUE MANDA LA NORMA
 *
 * `PLAN-VIDEOS-AYUDA.md` dice 45-90 s, y que si una tarea no cabe son dos vídeos. Aquí se hace una
 * excepción **a propósito y con motivo**: lo que el docente pregunta no es «cómo escribo un
 * desempeño», es **«y esto para qué»**. La respuesta es el boletín, y un vídeo que termina antes de
 * enseñarlo deja la pregunta abierta y manda a buscar el segundo, que nadie busca.
 *
 * Así que el vídeo tiene un arco y no una lista: *esto es lo que cambia · esto es lo que escribes ·
 * y esto es lo que sale*. Lo que se paga son trece segundos por encima del tope.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LO QUE ESTE VÍDEO **NO** PUEDE ENSEÑAR
 *
 * Un conmutador «Notas | Desempeños» en la planilla. Existió seis días de septiembre de 2026 y se
 * borró: la planilla vuelve a ser byte a byte la misma en los dos modelos. Sigue dibujado en
 * `PLAN-FRONT-MODELO-DE-EVALUACION.md` §4.2 y un guion de capturas todavía lo busca -- las dos
 * fuentes están desfasadas. Por eso el paso 12 dice justo lo contrario: **la planilla no cambia**.
 *
 * Y tampoco el medidor de cuatro tramos ni el icono por renglón del boletín: eso fue la maqueta de
 * antes del 17 de septiembre. Hoy el cuerpo del tipo 6 es una lista plana de frases.
 */

export const FPS = 30;

/* ── Los actos, en fotogramas ─────────────────────────────────────────────────────────────── */

export const T = {
	/* ACTO 1 · la llegada y «Mis asignaturas» */
	cursorEntra: 4,
	llegaAcademico: 22,
	pulsaAcademico: 28,
	abreAcademico: 30,
	llegaMisAsignaturas: 50,
	pulsaMisAsignaturas: 56,
	montaMisAsignaturas: 60,
	/** Cruza al botón «Unidades» --el primero de la fila, no el de la planilla-- y pulsa. */
	llegaUnidades: 188,
	pulsaUnidades: 205,

	/* ACTO 2 · Unidades */
	montaUnidades: 250,
	/** Vuelve al menú, que sigue abierto, y entra en «Mis competencias». */
	llegaMisDesempenos: 610,
	pulsaMisDesempenos: 620,
	cursorSale: 636,

	/* ACTO 3 · Mis desempeños */
	montaDesempenos: 630,
	/** Se teclea el desempeño nuevo y se pulsa «Añadir». */
	tecleaDesempeno: 814,
	anadeDesempeno: 886,
	/*
	 * Y SE PULSA EL PERIODO 3, que no es el de la barra: es lo que hace saltar la franja ámbar. El
	 * puntero vuelve a entrar para esto -- se había ido después de abrir la pantalla.
	 */
	vuelveElCursor: 995,
	llegaPeriodo3: 1015,
	pulsaPeriodo3: 1032,
	cursorSale3: 1050,
	seVaDesempenos: 1281,

	/* ACTO 4 · la planilla, que no cambia */
	entraLaPlanilla: 1326,

	/* ACTO 5 · el catálogo de informes */
	vuelveLaCascara: 1496,
	montaInformes: 1521,
	tecleaBusqueda: 1546,
	sale_la_ficha: 1596,
	cursorEntra2: 1662,
	llegaCargar: 1692,
	pulsaCargar: 1760,
	cursorSale2: 1776,
	seVaInformes: 1770,

	/* ACTO 6 · el boletín */
	entraElBoletin: 1800,
	/*
	 * LA HOJA ENTERA SE VE DOS SEGUNDOS --lo que se tarda en reconocer que es un boletín-- y luego
	 * se pasa al plano corto. **Es un encadenado corto y no un acercamiento**, y eso no es pereza:
	 * un papel tiene filetes de menos de un píxel a esa escala, y reescalarlos poco a poco los hace
	 * aparecer y desaparecer fotograma a fotograma. Dos planos quietos encadenados no parpadean --
	 * medido: dos fotogramas seguidos de una pantalla quieta salen idénticos byte a byte.
	 */
	empiezaElAcercamiento: 1860,
	acabaElAcercamiento: 1872,
};

/* ── El encuadre del papel ────────────────────────────────────────────────────────────────── */

/**
 * EL BOLETÍN NO SE ENCUADRA COMO UNA PANTALLA. Es una hoja vertical, y lo que la limita es el alto
 * de la banda libre, no el ancho del fotograma: sale estrecha y alta, con aire a los lados, que es
 * exactamente como se ve una hoja de papel.
 */
export const HOJA_EN_EL_FOTOGRAMA = encuadreDeUnaHoja(HOJA);

/** Y a dónde se mueve la cámara para que las frases se lean. */
export const HOJA_DE_CERCA = acercamientoAUnaHoja(HOJA, ACERCAMIENTO);

/* ── Dónde se pulsa y qué se señala ───────────────────────────────────────────────────────── */

const LADOS = UNIDADES_ALTO.lados;
const DENTRO = { x: MEDIDAS.menu + LADOS, ancho: ANCHO - LADOS * 2 };

export const FOCOS = {
	academico: enElFotograma({
		x: 0,
		y: alturaDeEntrada(ACADEMICO, null, false),
		ancho: MEDIDAS.menu,
		alto: MEDIDAS.seccion,
	}),
	/** El botón de las unidades («Logros»): el PRIMERO de la fila. El segundo es la planilla, y es otro vídeo. */
	botonUnidades: enElFotograma(rectanguloDelBoton(LA_QUE_SE_ABRE, 0)),
	ayudaDeUnidades: enElFotograma({ ...DENTRO, y: arribaDeLaAyuda(), alto: UNIDADES_ALTO.ayuda }),
	/** La tira de clases y la de periodos juntas: el rótulo dice «tu clase y el periodo». */
	periodos: enElFotograma({
		x: DENTRO.x - 6,
		y: arribaDeLosPeriodos() - DESEMPENOS_ALTO.tira,
		ancho: Math.max(300, ANCHO_TIRA_CLASES) + 12,
		alto: DESEMPENOS_ALTO.tira + DESEMPENOS_ALTO.periodos,
	}),
	franja: enElFotograma({ ...DENTRO, y: arribaDeLaFranja(), alto: DESEMPENOS_ALTO.franja }),
	planDeArea: enElFotograma({
		...DENTRO,
		y: arribaDelPlanDeArea(DESEMPENOS.length),
		alto: DESEMPENOS_ALTO.planDeArea,
	}),
	buscador: enElFotograma({ x: DENTRO.x, y: arribaDelBuscador(), ancho: anchoDelBuscador(), alto: INFORMES_ALTO.buscador }),
};

/** A dónde va el puntero, en coordenadas de la cáscara. */
export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	misAsignaturas: { x: 150, y: alturaDeEntrada(ACADEMICO, 0, true) + MEDIDAS.hija / 2 },
	/** «Mis competencias» es la SEGUNDA hija de Académico, justo debajo de «Mis asignaturas». */
	misDesempenos: { x: 150, y: alturaDeEntrada(ACADEMICO, MIS_COMPETENCIAS, true) + MEDIDAS.hija / 2 },
	botonUnidades: (() => {
		const r = rectanguloDelBoton(LA_QUE_SE_ABRE, 0);
		return { x: r.x + r.ancho / 2, y: r.y + r.alto / 2 };
	})(),
	/*
	 * EL BOTÓN DEL PERIODO 3 en la tira de «Mis desempeños». Los botones miden 58 con 10 de hueco, y
	 * la tira empieza 23 px por debajo de su rótulo -- de ahí salen los dos números.
	 */
	periodo3: { x: MEDIDAS.menu + LADOS + 2 * 68 + 29, y: arribaDeLosPeriodos() + 40 },
	/** El botón «Cargar el informe», abajo del configurador de la derecha. */
	entrada2: { x: MEDIDAS.menu + 300, y: MEDIDAS.alto - 160 },
	cargar: { x: MEDIDAS.ancho - LADOS - 165, y: MEDIDAS.barra + 274 },
};

/* ── El ritmo de la planilla: corto, porque aquí sólo viene a decir que no cambia ──────────── */

/*
 * TRES ACTOS EN DIEZ SEGUNDOS: se monta, se teclea una nota, vuelve el lote. Es el mismo `Ritmo`
 * que el vídeo de la planilla pero apretado, y con la misma regla: entre la última tecla y el aviso
 * pasan los 105 fotogramas de la aplicación (1 s de la celda + 2 s del lote + la ida y vuelta).
 */
export const RITMO_PLANILLA: Ritmo = {
	TITULO: 8,
	CABECERAS: 18,
	PASO_CABECERA: 5,
	FILAS: 40,
	PASO_FILA: 5,
	POR_TECLA: 5,
	FOCO_ANTES: 8,
	TECLEOS: [{ fila: 1, valor: '92', empieza: 50 }],
	CONFIRMA: 165,
	SALIDA: 190,
	PASO_SALIDA: 4,
};

export const AVISO_DURA = RITMO_PLANILLA.SALIDA - RITMO_PLANILLA.CONFIRMA;

/* ── Los pasos ────────────────────────────────────────────────────────────────────────────── */

const EN_ASIGNATURAS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_UNIDADES = {
	/* La miga lleva la palabra del colegio, como en la aplicación. */
	ubicacion: `Menú ▸ Académico ▸ Mis asignaturas ▸ ${VOCABULARIO.unidades}`,
	url: '/unidades/1222',
};
const EN_DESEMPENOS = { ubicacion: 'Menú ▸ Académico ▸ Mis competencias', url: '/mis-competencias' };
const EN_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes', url: '/informes' };
const EN_BOLETIN = {
	ubicacion: 'Menú ▸ Informes ▸ Boletín por competencias',
	url: '/informes/boletines-periodo-6/95/2',
};

export const PASOS: Paso[] = [
	{ desde: 0, texto: 'Con competencias cambian dos pantallas.', ...EN_ASIGNATURAS, foco: FOCOS.academico },
	{ desde: 120, texto: `Entra en Mis asignaturas y pulsa ${VOCABULARIO.unidades}.`, ...EN_ASIGNATURAS, foco: FOCOS.botonUnidades, focoHasta: T.pulsaUnidades + 6 },
	{ desde: 256, texto: 'Aquí cada columna es un examen o un taller.', ...EN_UNIDADES },
	/* La advertencia de ADVERTENCIAS-AYUDA.md: borrar va a la papelera y recalcula las definitivas. */
	{ desde: 364, texto: 'No borres una columna con notas; si pasa, restáurala de la papelera.', ...EN_UNIDADES },
	{ desde: 533, texto: 'El texto del boletín se escribe en Mis competencias.', ...EN_UNIDADES, foco: FOCOS.ayudaDeUnidades, focoHasta: T.llegaMisDesempenos },
	{ desde: 656, texto: 'Eliges tu clase y el periodo; el punto lleno ya tiene texto.', ...EN_DESEMPENOS, foco: FOCOS.periodos },
	{ desde: 804, texto: 'Escríbelo en sustantivo y pulsa Añadir.', ...EN_DESEMPENOS },
	{ desde: 914, texto: 'El boletín le pone delante «Fortaleza en».', voz: 'El boletín le pone delante: Fortaleza en.', ...EN_DESEMPENOS },
	{ desde: 1040, texto: 'Si no es el periodo de arriba, la franja ámbar avisa.', ...EN_DESEMPENOS, foco: FOCOS.franja },
	{ desde: 1168, texto: 'Lo de «todos los grados» lo pone la coordinación.', voz: 'Lo de todos los grados lo pone la coordinación.', ...EN_DESEMPENOS, foco: FOCOS.planDeArea },
	{ desde: 1276, texto: 'La planilla no cambia: se califica igual que siempre.', ...EN_PLANILLA },
	{ desde: T.montaInformes, texto: 'El boletín sale en Informes: busca «competencias».', voz: 'El boletín sale en Informes: busca competencias.', ...EN_INFORMES, foco: FOCOS.buscador },
	{ desde: 1657, texto: 'Pide para quién y el grupo; el periodo es el de arriba.', ...EN_INFORMES },
	{ desde: 1815, texto: 'Los desempeños salen debajo de cada asignatura.', ...EN_BOLETIN },
	{ desde: 1929, texto: 'La asignatura sin plan escrito lo dice: no es una avería.', ...EN_BOLETIN },
];

export const TARJETA = 2066;
export const DURACION = 2196;

/** La clave con la que la aplicación pide este vídeo: `data: { ayuda: '…' }` en `app.routes.ts`. */
export const CLAVE = 'competencias-docente';

export const TITULO = 'Calificar por competencias';

/*
 * LOS CINCO MOMENTOS. Salen de los actos, no de los pasos: el «?» pegado a «Mis desempeños» abre
 * este vídeo en el 0:32, y el de la ficha del boletín en el 1:31.
 */
export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Qué cambia: la columna es un instrumento' },
	{ desde: T.montaDesempenos, titulo: 'Mis competencias: lo que sale en el boletín' },
	{ desde: T.entraLaPlanilla, titulo: 'La planilla no cambia' },
	{ desde: T.montaInformes, titulo: 'Sacar el boletín en Informes' },
	{ desde: T.entraElBoletin, titulo: 'El boletín por competencias' },
];

export const CIERRE: Cierre = {
	hiciste: 'Escribiste los desempeños de tu clase para el periodo.',
	seVe: 'Salen debajo de cada asignatura en el boletín por competencias.',
	despues: 'Las notas siguen en la planilla, como siempre.',
};

/* ── Las puertas ──────────────────────────────────────────────────────────────────────────── */

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/*
 * EL LOTE DE LA PLANILLA TIENE QUE TARDAR LO QUE TARDA LA APLICACIÓN, también aquí, donde la
 * planilla sólo viene de paso: si se acelerase «porque este vídeo no va de eso», los dos vídeos
 * enseñarían la misma pantalla a dos velocidades y uno de los dos estaría mintiendo.
 */
const ULTIMA_TECLA = (() => {
	const t = RITMO_PLANILLA.TECLEOS[RITMO_PLANILLA.TECLEOS.length - 1];
	return t.empieza + t.valor.length * RITMO_PLANILLA.POR_TECLA;
})();

if (RITMO_PLANILLA.CONFIRMA - ULTIMA_TECLA !== 105) {
	throw new Error(
		`Guion: el lote vuelve ${RITMO_PLANILLA.CONFIRMA - ULTIMA_TECLA} fotogramas después de la última ` +
			'tecla, y la aplicación tarda 105.',
	);
}

/* Y que la hoja del boletín quepa entera en la banda, que es lo único que la limita. */
if (HOJA_EN_EL_FOTOGRAMA.escala <= 0 || HOJA.alto * HOJA_EN_EL_FOTOGRAMA.escala > 1080) {
	throw new Error('Guion: el boletín no cabe en el fotograma.');
}

/*
 * LA BÚSQUEDA TIENE QUE ENCONTRAR LA FICHA. En la aplicación el catálogo busca en el nombre, en el
 * «para qué» y en los sinónimos; aquí se comprueba lo mínimo --que la palabra que se teclea esté en
 * el nombre de la ficha-- para que nadie cambie una de las dos y deje al vídeo tecleando algo que
 * no encontraría nada.
 */
if (!INFORMES_TEXTOS.fichaNombre.toLowerCase().includes(INFORMES_TEXTOS.busqueda.toLowerCase())) {
	throw new Error(
		`Guion: se teclea «${INFORMES_TEXTOS.busqueda}» y la ficha se llama «${INFORMES_TEXTOS.fichaNombre}».`,
	);
}
