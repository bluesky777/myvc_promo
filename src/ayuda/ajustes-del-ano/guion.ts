import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, focoDelMenu, puntoDelMenu } from '../el-ano/Aplicacion';
import { P_AJUSTES, enLaCascara, rectAvisoViejo, rectNav, rectOpcionDeAnio, rectPestana, rectSelector } from '../el-ano/colegio';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { MEDIDAS } from '../medidas';
import { EL_BOLETIN, EL_PUESTO, TEXTOS, Y2026, Y2027, rectAnio, rectBotonAnio, rectInterruptor, rectMando, rectPapelera } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «LOS AJUSTES DEL AÑO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     «Año actual» mueve el colegio entero; cada interruptor se guarda solo.
 *
 * Las dos cosas salen de `colegio-ajustes.ts`: `conmutar()` guarda en cuanto cambia el interruptor
 * (aviso de 2 s con el texto de `YearsController`), y `ponerComoActual()` es lo único de la
 * pestaña que pregunta antes, con un popconfirm que el paso 7 resume. Sin rojo: ADVERTENCIAS-AYUDA.md dice que se
 * puede volver atrás; la advertencia es cuándo hacerlo. Al final, la papelera del año. El año en
 * curso NO se cambia desde el año en curso: hay que ir al otro año con el selector de arriba
 * («Para cambiarlo, ve al año que quieras poner en curso y púlsalo allí»), y el selector conserva
 * la pestaña (`colegio.ts:215-232`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA       Configuración -> El colegio (abre en Periodos) -> Ajustes del año
 *     2. EL AÑO EN CURSO  el panel de arriba, en 2026
 *     3. UN INTERRUPTOR   «Mostrar el puesto»: se enciende y el aviso sale solo
 *     4. MOVER EL AÑO     selector -> 2027 -> aviso amarillo -> botón -> popconfirm -> hecho
 *     5. LA PAPELERA      la página baja hasta la zona de riesgo: no con datos
 */

export const FPS = 30;

export const T = {
	cursorEntra: 20,
	llegaConfig: 56,
	pulsaConfig: 62,
	abreConfig: 64,
	llegaColegio: 124,
	pulsaColegio: 138,
	montaColegio: 142,
	llegaPestana: 200,
	pulsaPestana: 214,
	montaAjustes: 218,

	llegaPuesto: 420,
	pulsaPuesto: 436,
	/** La ida y vuelta del PUT: medio segundo con el interruptor cargando. */
	puestoGuardado: 450,

	llegaSelector: 540,
	pulsaSelector: 550,
	llegaOpcion: 578,
	pulsaOpcion: 588,
	/** 2027 montado: la cabecera cambia y el aviso amarillo crece. */
	en2027: 592,

	llegaBoton: 724,
	pulsaBoton: 738,
	popconfirm: 742,
	llegaOk: 990,
	pulsaOk: 1014,
	/** `PUT years/set-actual` vuelve: «Ahora es año actual.» */
	actual: 1030,
	cursorSale: 1100,

	/** La página baja hasta el final: la zona de riesgo. */
	bajaDesde: 1134,
	bajaHasta: 1156,
};

/* ── Dónde se pulsa y qué se señala: del mismo rectángulo ─────────────────────────────────── */

const cas = (r: { x: number; y: number; ancho: number; alto: number }) => enLaCascara(r);
const cas2 = (r: { x: number; y: number; ancho: number; alto: number }) => enLaCascara(r, SCROLL);

/** Dónde cae el OK del popconfirm: la burbuja sale encima del botón, anclada a su izquierda. */
export const POP = { ancho: 400, ancla: 0.22 };
export function rectOk() {
	const b = cas(rectBotonAnio(1));
	const x = b.x + b.ancho / 2;
	const derecha = x - POP.ancho * POP.ancla + POP.ancho - 16;
	return { x: derecha - 176, y: b.y - 10 - 12 - 24, ancho: 176, alto: 24 };
}

/** Hasta dónde baja la página: el final, con la papelera abajo del todo (ya sin aviso amarillo). */
export const SCROLL = (() => { const r = rectPapelera(0); return r.y + r.alto + 24 - (MEDIDAS.alto - MEDIDAS.barra); })();

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	config: puntoDelMenu('Configuración'),
	colegio: puntoDelMenu('Configuración', 'El colegio'),
	pestana: centro(cas(rectPestana(P_AJUSTES))),
	puesto: centro(cas(rectMando(EL_BOLETIN, EL_PUESTO, 0))),
	selector: centro(cas(rectSelector())),
	opcion: centro(cas(rectOpcionDeAnio(0))),
	boton: centro(cas(rectBotonAnio(1))),
	ok: centro(rectOk()),
};

export const FOCOS = {
	config: focoDelMenu('Configuración'),
	pestana: alFotograma(cas(rectPestana(P_AJUSTES)), 4, 6),
	anio: alFotograma(cas(rectAnio(0)), 4, 12),
	puesto: alFotograma(cas(rectInterruptor(EL_BOLETIN, EL_PUESTO, 0)), 10, 10),
	selector: alFotograma(cas(rectSelector()), 6, 8),
	/** El selector con su desplegable abierto debajo. */
	desplegable: alFotograma((() => { const s = cas(rectSelector()); return { ...s, alto: s.alto + 4 + 8 + 4 * 34 }; })(), 6, 8),
	aviso: alFotograma(cas(rectAvisoViejo()), 6, 10),
	boton: alFotograma(cas(rectBotonAnio(1)), 8, 8),
	popconfirm: alFotograma(
		(() => {
			const b = cas(rectBotonAnio(1));
			const x = b.x + b.ancho / 2 - POP.ancho * POP.ancla;
			return { x, y: b.y - 10 - 134, ancho: POP.ancho, alto: 134 + 10 + b.alto };
		})(),
		8,
		12,
	),
	papelera: alFotograma(cas2(rectPapelera(0)), 8, 10),
	/** Después: el panel del año y la cabecera, que ya dicen 2027 en curso. */
	hecho: alFotograma(
		(() => {
			const n = cas(rectNav(0));
			const a = cas(rectAnio(0));
			return { x: n.x, y: n.y, ancho: n.ancho, alto: a.y + a.alto - n.y };
		})(),
		4,
		12,
	),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_PERIODOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Periodos', url: `/colegio/${Y2026.id}/periodos` };
const AQUI = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Ajustes del año', url: `/colegio/${Y2026.id}/ajustes` };
const EN_2027 = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Ajustes del año', url: `/colegio/${Y2027.id}/ajustes` };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Configuración, El colegio, Ajustes del año.', ...EN_EL_MENU, foco: FOCOS.config, focoHasta: T.pulsaConfig + 20 },
	{ desde: T.montaColegio, texto: 'Abre en Periodos; Ajustes es otra pestaña.', ...EN_PERIODOS, foco: FOCOS.pestana, focoHasta: T.pulsaPestana + 10 },
	{ desde: 282, texto: 'Arriba, el año en que trabaja el colegio.', ...AQUI, foco: FOCOS.anio },
	{ desde: 392, texto: 'Cada interruptor se guarda solo, con aviso verde.', ...AQUI, foco: FOCOS.puesto },
	{ desde: 520, texto: 'Para cambiarlo, se va a ese año.', ...AQUI, foco: FOCOS.desplegable, focoHasta: T.pulsaOpcion + 4 },
	{ desde: 620, texto: 'Aviso amarillo: 2027 no está en curso.', ...EN_2027, foco: FOCOS.aviso },
	{ desde: 750, texto: 'Sólo esto pregunta: el colegio entero pasa a 2027.', ...EN_2027, foco: FOCOS.popconfirm },
	{ desde: 902, texto: 'Hazlo al empezar el año, con sus periodos creados.', ...EN_2027, foco: FOCOS.popconfirm, focoHasta: T.pulsaOk + 2 },
	{ desde: T.actual, texto: 'Hecho: 2027 queda en curso.', ...EN_2027, foco: FOCOS.hecho },
	{ desde: T.bajaDesde + 16, texto: 'No envíes a la papelera un año con datos.', ...EN_2027, foco: FOCOS.papelera },
];

export const AVISO_PUESTO = { desde: T.puestoGuardado, dura: fotogramasDe(2000), texto: TEXTOS.avisoPuesto };
export const AVISO_ACTUAL = { desde: T.actual, dura: fotogramasDe(3000), texto: TEXTOS.avisoActual };

export const TARJETA = 1266;
export const DURACION = TARJETA + 120;

export const CLAVE = 'ajustes-del-ano';
export const TITULO = 'Los ajustes del año';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: El colegio, Ajustes del año' },
	{ desde: 392, titulo: 'Los interruptores se guardan solos' },
	{ desde: 520, titulo: 'Cambiar el año en curso' },
	{ desde: T.bajaDesde + 16, titulo: 'Enviar un año a la papelera' },
];

export const CIERRE: Cierre = {
	hiciste: 'Encendiste «Mostrar el puesto» y pusiste 2027 como año en curso.',
	seVe: 'El aviso verde de cada cambio, y «2027 · en curso» en el selector del año.',
	despues: 'Siguiente: la ficha del colegio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El aviso del cambio de año sale donde empieza el paso que lo cuenta. */
if (PASOS[8].desde !== T.actual) {
	throw new Error('Guion: «Ahora es año actual.» no cae en el paso que lo explica.');
}
/* El interruptor se pulsa, y su aviso sale, dentro del paso que dice que se guarda solo. */
if (T.pulsaPuesto < PASOS[3].desde || T.puestoGuardado >= PASOS[4].desde) {
	throw new Error('Guion: el interruptor no se pulsa, o su aviso no sale, en el paso 4.');
}
/* El popconfirm sale con el paso que lo cuenta, y el OK se pulsa con la advertencia ya dicha. */
if (T.popconfirm > PASOS[6].desde || T.pulsaOk < PASOS[7].desde + 100) {
	throw new Error('Guion: el popconfirm no está al contar lo que pregunta, o el OK se pulsa antes de la advertencia.');
}
