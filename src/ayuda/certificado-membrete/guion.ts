import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import {
	CERTIFICADOS,
	EN_BLANCO,
	ESTADO_INICIAL,
	EstadoPantalla,
	MEMBRETADA,
	PLANTILLAS,
	PRUEBA,
	disposicion,
	enLaCascara,
	rectAbrir,
	rectAlturaEncabezado,
	rectCabecera,
	rectChips,
	rectEliminar,
	rectFilaDelAnio,
	rectGuardarPlantilla,
	rectPapelera,
	rectPestana,
	rectPie,
	rectPistaMembretes,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS, 1: «LOS MEMBRETES DEL COLEGIO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     Las plantillas son del COLEGIO, no del año: tocar una cambia lo que imprimen los años que la
 *     usan, **incluidos los cerrados** (`colegio-certificados.ts`, cabecera: «la tabla no tiene
 *     `year_id`»). En pantalla eso se lee en dos sitios, y los dos salen: «la usan N años» en la
 *     cabecera de cada plantilla, y «Al guardar cambia lo que imprimen N años.» en su pie.
 *
 * Y lo irreversible de verdad: **borrar es para siempre** («no hay `deleted_at` en esa tabla»). Los
 * dos pasos que lo cuentan van con el cartel rojo y un segundo más (PLAN §2.8).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA     Configuración -> El colegio -> pestaña Certificados
 *     2. DEL COLEGIO    arriba lo del año; abajo, «Los membretes del colegio» y quién los usa
 *     3. CAMBIAR UNO    se abre la membretada, se teclea la altura, el pie avisa, se guarda
 *     4. BORRAR UNO     la papelera apagada mientras alguien la usa; «Prueba» se borra
 *
 * EL RITMO: nada aquí se guarda solo --«Guardar la plantilla» es un botón y el aviso sale al
 * volver el PUT--, así que el aviso cae a medio segundo del clic, como la ida y vuelta de la
 * planilla. La pestaña «Periodos» es la que abre un admin (`colegio.ts`): por eso se pasa por ella.
 */

export const FPS = 30;

/* ── Los estados de la pantalla, por los que pasa el vídeo ───────────────────────────────── */

/** Al entrar: se abre sola la plantilla con la que imprime 2026 (`abierta()`). */
export const E0: EstadoPantalla = ESTADO_INICIAL;
/** Con la membretada abierta. */
export const E1: EstadoPantalla = { ...E0, abiertas: [1, 1, 0] };
/** Con la altura tecleada: el pie de «sin guardar» asoma. */
export const E2: EstadoPantalla = { ...E1, pies: [1, 0, 0] };

/* ── Los tiempos ──────────────────────────────────────────────────────────────────────────── */

export const T = {
	/* ACTO 1 */
	cursorEntra: 16,
	llegaConfig: 44,
	pulsaConfig: 50,
	abreConfig: 52,
	llegaColegio: 96,
	pulsaColegio: 106,
	montaColegio: 110,
	llegaPestana: 140,
	pulsaPestana: 150,
	montaCertificados: 154,

	/* ACTO 2 */
	bajaDesde: 290,
	bajaHasta: 316,

	/* ACTO 3 */
	llegaAbrir: 560,
	pulsaAbrir: 572,
	abreDesde: 574,
	abreHasta: 594,
	baja2Desde: 594,
	baja2Hasta: 622,
	llegaAltura: 640,
	pulsaAltura: 650,
	/** Doble clic selecciona el 150; se teclea «170» a seis fotogramas la tecla. */
	teclea: 666,
	porTecla: 6,
	pieDesde: 668,
	pieHasta: 684,
	llegaGuardar: 938,
	pulsaGuardar: 959,
	/** La ida y vuelta del PUT: medio segundo. */
	guardada: 974,

	/* ACTO 4 */
	llegaPapelera: 1008,
	baja3Desde: 1098,
	baja3Hasta: 1128,
	llegaPapelera2: 1144,
	pulsaPapelera2: 1156,
	popconfirm: 1160,
	llegaEliminar: 1228,
	pulsaEliminar: 1240,
	eliminada: 1255,
	cursorSale: 1278,
};

export const TECLEADO = '170';

/** Cuánto se ha bajado la página, en cada tramo. */
export const SCROLL = {
	arriba: 0,
	/** «Los membretes del colegio» arriba del todo. */
	membretes: disposicion(E0).c.y - 18,
	/** La cabecera de la membretada arriba. */
	membretada: disposicion(E1).plantillas[MEMBRETADA].y - 14,
	/** «Prueba» a media altura, con sitio encima para el popconfirm. */
	prueba: disposicion(E1).plantillas[PRUEBA].y - 470,
};

/* ── Dónde se pulsa y qué se señala: del mismo rectángulo ─────────────────────────────────── */

const MENU = MENU_DIRECTIVO;
export const CONFIG = entradaDe(MENU, 'Configuración');
export const EL_COLEGIO = entradaDe(MENU, 'Configuración', 'El colegio');

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
/** Rectángulo del contenido -> fotograma, con el scroll de ese momento. */
const foco = (r: { x: number; y: number; ancho: number; alto: number }, scroll: number, radio = 10) => ({
	...enElFotograma(enLaCascara(r, scroll)),
	radio,
});

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	config: { x: 150, y: alturaEnMenu(MENU, CONFIG.seccion, null, null) + MEDIDAS.seccion / 2 },
	colegio: { x: 150, y: alturaEnMenu(MENU, EL_COLEGIO.seccion, EL_COLEGIO.hija, CONFIG.seccion) + MEDIDAS.hija / 2 },
	pestana: centro(enLaCascara(rectPestana(CERTIFICADOS), SCROLL.arriba)),
	abrir: centro(enLaCascara(rectAbrir(E0, MEMBRETADA), SCROLL.membretes)),
	altura: centro(enLaCascara(rectAlturaEncabezado(E1, MEMBRETADA), SCROLL.membretada)),
	guardar: centro(enLaCascara(rectGuardarPlantilla(E2, MEMBRETADA), SCROLL.membretada)),
	papelera: centro(enLaCascara(rectPapelera(E1, MEMBRETADA), SCROLL.membretada)),
	papelera2: centro(enLaCascara(rectPapelera(E1, PRUEBA), SCROLL.prueba)),
	eliminar: centro(enLaCascara(rectEliminar(E1, PRUEBA), SCROLL.prueba)),
};

export const FOCOS = {
	config: enElFotograma({ x: 0, y: alturaEnMenu(MENU, CONFIG.seccion, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	pestana: foco(rectPestana(CERTIFICADOS), SCROLL.arriba, 6),
	delAnio: foco(rectFilaDelAnio(E0), SCROLL.arriba, 14),
	pista: foco(rectPistaMembretes(E0), SCROLL.membretes, 10),
	/** Las cabeceras de las dos que se usan: sus chips. */
	chips: foco(
		(() => {
			const a = rectChips(E0, MEMBRETADA);
			const b = rectCabecera(E0, EN_BLANCO);
			return { x: a.x - 300, y: a.y - 10, ancho: a.ancho + 300, alto: b.y + 62 - (a.y - 10) };
		})(),
		SCROLL.membretes,
		10,
	),
	/** La columna de los campos del encabezado: la imagen y las tres medidas. */
	altura: foco(
		(() => {
			const r = rectAlturaEncabezado(E1, MEMBRETADA);
			return { x: r.x - 8, y: r.y - 26, ancho: 170, alto: 70 };
		})(),
		SCROLL.membretada,
		8,
	),
	pie: foco(rectPie(E2, MEMBRETADA), SCROLL.membretada, 10),
	/** La papelera apagada y su globo («No se puede borrar…»), que sale encima. */
	papelera: foco(
		(() => {
			const p = rectPapelera(E1, MEMBRETADA);
			return { x: p.x - 404, y: p.y - 54, ancho: 450, alto: 100 };
		})(),
		SCROLL.membretada,
		10,
	),
	papelera2: foco(
		(() => {
			const p = rectPapelera(E1, PRUEBA);
			return { x: p.x - 400, y: p.y - 136, ancho: 448, alto: 180 };
		})(),
		SCROLL.prueba,
		12,
	),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const URL_BASE = `/colegio/${7}`;
const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_CERTIFICADOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Certificados', url: `${URL_BASE}/certificados` };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Configuración, El colegio, pestaña Certificados.', ...EN_EL_MENU, foco: FOCOS.config, focoHasta: T.pulsaConfig + 20 },
	{ desde: 170, texto: 'Arriba, lo de 2026: qué membrete usa.', ...EN_CERTIFICADOS, foco: FOCOS.delAnio, focoHasta: T.bajaDesde - 8 },
	{ desde: T.bajaHasta, texto: 'Abajo, los del colegio: los comparten todos los años.', ...EN_CERTIFICADOS, foco: FOCOS.pista },
	{ desde: 462, texto: 'Éste lo usan 2024 y 2025, ya cerrados.', ...EN_CERTIFICADOS, foco: FOCOS.chips, focoHasta: T.pulsaAbrir - 4 },
	{ desde: 624, texto: 'Dentro, se cambia una medida.', ...EN_CERTIFICADOS, foco: FOCOS.altura },
	{
		desde: 722,
		texto: 'Guardar también cambia 2024 y 2025. Si no quieres, crea otra.',
		...EN_CERTIFICADOS,
		foco: FOCOS.pie,
		focoHasta: T.pulsaGuardar - 6,
		rojo: true,
	},
	{ desde: T.guardada, texto: 'Guardada. Si algún año la usa, no se puede borrar.', ...EN_CERTIFICADOS, foco: FOCOS.papelera, focoHasta: T.baja3Desde - 8 },
	{
		desde: 1127,
		texto: 'Borrar es para siempre. Para cambiar de membrete, crea uno nuevo.',
		...EN_CERTIFICADOS,
		foco: FOCOS.papelera2,
		focoHasta: T.pulsaEliminar + 4,
		rojo: true,
	},
];

/** El aviso de guardar se queda mientras el paso que lo explica. */
export const AVISO_GUARDADA = { desde: T.guardada, dura: 1127 - T.guardada - 12 };
export const AVISO_ELIMINADA = { desde: T.eliminada, dura: 70 };

export const TARJETA = 1338;
export const DURACION = TARJETA + 120;

export const CLAVE = 'certificado-membrete';
export const TITULO = 'Los membretes del colegio';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: El colegio, Certificados' },
	{ desde: T.bajaHasta, titulo: 'Son del colegio, no del año' },
	{ desde: 624, titulo: 'Cambiar un membrete' },
	{ desde: T.guardada, titulo: 'Borrar una plantilla' },
];

export const CIERRE: Cierre = {
	hiciste: 'Cambiaste un membrete del colegio y borraste uno que nadie usaba.',
	seVe: 'Salen «Guardada…» y «Eliminada…»; y cada plantilla dice cuántos años la usan.',
	despues: 'Siguiente: lo que imprime este año.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El aviso de «Guardada» sale donde empieza el paso que lo explica. */
if (PASOS[6].desde !== T.guardada) {
	throw new Error('Guion: el aviso de «Guardada» no cae en el paso que lo explica.');
}
/* La membretada la usan dos años cerrados: es lo que dicen los pasos 4 y 6. */
if (PLANTILLAS[MEMBRETADA].usanOtros.join() !== '2024,2025') {
	throw new Error('Guion: los pasos 4 y 6 nombran 2024 y 2025, y la plantilla dice otra cosa.');
}
