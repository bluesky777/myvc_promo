import { ACADEMICO, MEDIDAS, alturaDeEntrada } from '../medidas';
import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { acercamientoAUnaHoja, encuadreDeUnaHoja, enElFotograma } from '../encuadre';
import { AVISO_DEL_VOCABULARIO, VOCABULARIO } from '../../comunes/vocabulario';
import { Paso, compruebaElGuion } from '../tiempos';
import { LA_QUE_SE_ABRE, rectanguloDelBoton } from '../planilla/datos';
import {
	ACERCAMIENTO, ANCHO, DESEMPENOS, DESEMPENOS_ALTO, HOJA, INFORMES_ALTO, INFORMES_TEXTOS,
	UNIDADES_ALTO, arribaDeLaAyuda, arribaDeLaFranja, arribaDelBuscador, arribaDelPlanDeArea,
	arribaDeLosPeriodos,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «CALIFICAR POR COMPETENCIAS», el vídeo de ayuda más largo hasta ahora: 103 s.
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
	cursorEntra: 20,
	llegaAcademico: 58,
	pulsaAcademico: 64,
	abreAcademico: 66,
	llegaMisAsignaturas: 150,
	pulsaMisAsignaturas: 162,
	montaMisAsignaturas: 166,
	/** Cruza al botón «Unidades» --el primero de la fila, no el de la planilla-- y pulsa. */
	llegaUnidades: 300,
	pulsaUnidades: 330,

	/* ACTO 2 · Unidades */
	montaUnidades: 395,
	/** Vuelve al menú, que sigue abierto, y entra en «Mis desempeños». */
	llegaMisDesempenos: 920,
	pulsaMisDesempenos: 950,
	cursorSale: 966,

	/* ACTO 3 · Mis desempeños */
	montaDesempenos: 960,
	/** Se teclea el desempeño nuevo y se pulsa «Añadir». */
	tecleaDesempeno: 1310,
	anadeDesempeno: 1390,
	/*
	 * Y SE PULSA EL PERIODO 3, que no es el de la barra: es lo que hace saltar la franja ámbar. El
	 * puntero vuelve a entrar para esto -- se había ido después de abrir la pantalla.
	 */
	vuelveElCursor: 1570,
	llegaPeriodo3: 1625,
	pulsaPeriodo3: 1660,
	cursorSale3: 1700,
	seVaDesempenos: 2075,

	/* ACTO 4 · la planilla, que no cambia */
	entraLaPlanilla: 2120,

	/* ACTO 5 · el catálogo de informes */
	vuelveLaCascara: 2390,
	montaInformes: 2435,
	tecleaBusqueda: 2460,
	sale_la_ficha: 2510,
	cursorEntra2: 2580,
	llegaCargar: 2630,
	pulsaCargar: 2680,
	cursorSale2: 2696,
	seVaInformes: 2690,

	/* ACTO 6 · el boletín */
	entraElBoletin: 2740,
	/*
	 * LA HOJA ENTERA SE VE TRES SEGUNDOS --lo que se tarda en reconocer que es un boletín-- y luego
	 * se pasa al plano corto. **Es un encadenado corto y no un acercamiento**, y eso no es pereza:
	 * un papel tiene filetes de menos de un píxel a esa escala, y reescalarlos poco a poco los hace
	 * aparecer y desaparecer fotograma a fotograma. Dos planos quietos encadenados no parpadean --
	 * medido: dos fotogramas seguidos de una pantalla quieta salen idénticos byte a byte.
	 */
	empiezaElAcercamiento: 2850,
	acabaElAcercamiento: 2862,
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
	/** El botón «Unidades»: el PRIMERO de la fila. El segundo es la planilla, y es otro vídeo. */
	botonUnidades: enElFotograma(rectanguloDelBoton(LA_QUE_SE_ABRE, 0)),
	ayudaDeUnidades: enElFotograma({ ...DENTRO, y: arribaDeLaAyuda(), alto: UNIDADES_ALTO.ayuda }),
	periodos: enElFotograma({ x: DENTRO.x, y: arribaDeLosPeriodos(), ancho: 300, alto: DESEMPENOS_ALTO.periodos }),
	franja: enElFotograma({ ...DENTRO, y: arribaDeLaFranja(), alto: DESEMPENOS_ALTO.franja }),
	planDeArea: enElFotograma({
		...DENTRO,
		y: arribaDelPlanDeArea(DESEMPENOS.length),
		alto: DESEMPENOS_ALTO.planDeArea,
	}),
	buscador: enElFotograma({ x: DENTRO.x, y: arribaDelBuscador(), ancho: 760, alto: INFORMES_ALTO.buscador }),
};

/** A dónde va el puntero, en coordenadas de la cáscara. */
export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	misAsignaturas: { x: 150, y: alturaDeEntrada(ACADEMICO, 0, true) + MEDIDAS.hija / 2 },
	/** «Mis desempeños» es la SEGUNDA hija de Académico, justo debajo de «Mis asignaturas». */
	misDesempenos: { x: 150, y: alturaDeEntrada(ACADEMICO, 1, true) + MEDIDAS.hija / 2 },
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
	TECLEOS: [{ fila: 1, valor: '92', empieza: 110 }],
	CONFIRMA: 225,
	SALIDA: 265,
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
const EN_DESEMPENOS = { ubicacion: 'Menú ▸ Académico ▸ Mis desempeños', url: '/mis-desempenos' };
const EN_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes', url: '/informes' };
const EN_BOLETIN = {
	ubicacion: 'Menú ▸ Informes ▸ Boletín por competencias',
	url: '/informes/boletines-periodo-6/95/2',
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Tu colegio califica por competencias.', ...EN_ASIGNATURAS, foco: FOCOS.academico },
	{ desde: 110, texto: 'Te cambia dos pantallas, y la planilla no es ninguna.', ...EN_ASIGNATURAS },
	{
		desde: 270,
		texto: `Empieza en Mis asignaturas, en el botón ${VOCABULARIO.unidades}.`,
		...EN_ASIGNATURAS,
		foco: FOCOS.botonUnidades,
		/*
		 * EL FOCO NO PUEDE SOBREVIVIR A LO QUE SEÑALA. Este paso dura hasta el 410, pero la pantalla
		 * cambia en el 395: sin este tope, el recuadro se quedaba trece fotogramas flotando sobre la
		 * pantalla siguiente, señalando un botón que ya no estaba.
		 */
		focoHasta: T.pulsaUnidades + 6,
	},
	{ desde: 410, texto: 'La columna vuelve a ser lo que es: un examen, un taller.', ...EN_UNIDADES },
	{ desde: 600, texto: AVISO_DEL_VOCABULARIO, ...EN_UNIDADES },
	{ desde: 760, texto: 'El texto del boletín ya no se escribe aquí.', ...EN_UNIDADES, foco: FOCOS.ayudaDeUnidades },
	{ desde: 915, texto: 'Se escribe en Mis desempeños, una vez por periodo.', ...EN_UNIDADES },
	{ desde: 1070, texto: 'Eliges tu clase y el periodo. El punto lleno dice que ahí hay algo escrito.', ...EN_DESEMPENOS, foco: FOCOS.periodos },
	{ desde: 1290, texto: 'Escribes el desempeño y Añadir. Son las mismas filas que ve la coordinación.', ...EN_DESEMPENOS },
	{ desde: 1490, texto: 'Escríbelo en sustantivo: el boletín le pone delante «Fortaleza en».', ...EN_DESEMPENOS },
	{ desde: 1655, texto: 'Si el periodo no es el de arriba, la franja ámbar te avisa.', ...EN_DESEMPENOS, foco: FOCOS.franja },
	{ desde: 1855, texto: 'Lo de «todos los grados» lo pone la coordinación: se suma a lo tuyo.', ...EN_DESEMPENOS, foco: FOCOS.planDeArea },
	{ desde: 2070, texto: 'Las notas se ponen igual que siempre: la planilla no cambia.', ...EN_PLANILLA },
	{ desde: 2245, texto: 'El aro, la nota rápida y el Tab vertical siguen donde estaban.', ...EN_PLANILLA },
	{ desde: 2435, texto: 'El boletín se saca en Informes: busca «competencias».', ...EN_INFORMES, foco: FOCOS.buscador },
	{ desde: 2575, texto: 'Pregunta dos cosas: para quién y qué grupo. El periodo no se elige.', ...EN_INFORMES },
	{ desde: 2775, texto: 'Y así sale: los desempeños debajo de cada asignatura.', ...EN_BOLETIN },
	{ desde: 2950, texto: 'La asignatura sin plan escrito lo dice, y no es una avería.', ...EN_BOLETIN },
];

export const TARJETA = 3140;
export const DURACION = 3260;

export const CIERRE: Cierre = {
	hiciste: 'Escribiste los desempeños de tu clase para el periodo.',
	seVe: 'Salen debajo de cada asignatura en el boletín por competencias.',
	despues: 'Las notas siguen yendo en la planilla, igual que siempre.',
};

/* ── Las puertas ──────────────────────────────────────────────────────────────────────────── */

compruebaElGuion(PASOS, FPS, TARJETA);

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
