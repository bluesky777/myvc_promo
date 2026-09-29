import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ALMENDROS } from '../colegio';
import {
	CERTIFICADOS,
	EstadoPantalla,
	MEMBRETADA,
	PLANTILLAS,
	PRUEBA,
	disposicion,
	enLaCascara,
	rectBarraTextos,
	rectBotonDelAnio,
	rectEditor,
	rectGuardarTextos,
	rectPestana,
} from '../certificado-membrete/datos';
import { HOJA } from '../certificado-imprimir/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS, 2: «LO QUE IMPRIME ESTE AÑO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     El logo sale sólo si no hay membrete. `certificado-estudio.html:44`:
 *     `@if (year().logo && !cabeceraMembrete())` --«el membrete ya trae el logo dentro»--, y los
 *     dos casos están en su `spec` (266 y 303). Así que elegir una plantilla con imagen QUITA el
 *     escudo suelto, y elegir la hoja en blanco lo DEVUELVE. El vídeo lo enseña con las dos
 *     cabeceras, una al lado de la otra.
 *
 * Y las dos cosas que son del año y no del colegio: cuál plantilla usa (un clic, se guarda solo:
 * `PUT certificados/actual`) y sus textos (esos NO: «Guardar los textos»).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA     Configuración -> El colegio -> pestaña Certificados
 *     2. LO DEL AÑO     se elige «Membrete Los Almendros» para 2026; se añade el NIT al texto
 *     3. LAS CABECERAS  el certificado con membrete y con la hoja en blanco, lado a lado
 *
 * VIENE DESPUÉS DE «LOS MEMBRETES DEL COLEGIO» y hereda su estado: «Prueba» ya está borrada, y
 * 2026 sigue imprimiendo con «Hoja en blanco».
 */

export const FPS = 30;

export const T = {
	cursorEntra: 16,
	llegaConfig: 44,
	pulsaConfig: 50,
	abreConfig: 52,
	llegaColegio: 96,
	pulsaColegio: 106,
	montaColegio: 110,
	llegaPestana: 136,
	pulsaPestana: 146,
	montaCertificados: 150,
	llegaOpcion: 262,
	pulsaOpcion: 281,
	/** La ida y vuelta del PUT: medio segundo, y entonces el aviso y la marca cambian. */
	cambia: 296,
	llegaEditor: 440,
	pulsaEditor: 452,
	teclea: 466,
	porTecla: 2,
	barraDesde: 468,
	barraHasta: 484,
	llegaGuardar: 550,
	pulsaGuardar: 570,
	guardados: 585,
	cursorSale: 598,
	seVaLaCascara: 620,
	entranLasHojas: 648,
};

export const ANADIDO = ALMENDROS.encabezadoAnadido;

/** Los estados de la pantalla: «Prueba» ya no está (se borró en el vídeo anterior). */
export const E0: EstadoPantalla = { abiertas: [0, 1, 0], pies: [0, 0, 0], barraTextos: 0, vivas: [1, 1, 0] };
export const E1: EstadoPantalla = { ...E0, barraTextos: 1 };

/* ── El plano de las dos cabeceras ─────────────────────────────────────────────────────────── */

/** Cuánto de la hoja se enseña: el membrete, la cabecera y el arranque del párrafo. */
export const RECORTE = { alto: 370 };
export const CABECERAS = (() => {
	const escala = 1.1;
	const hueco = 44;
	const ancho = HOJA.ancho * escala;
	const x0 = (1920 - (ancho * 2 + hueco)) / 2;
	const alto = RECORTE.alto * escala;
	const y = 108 + (784 - alto - 52) / 2 + 52;
	return { escala, hueco, ancho, alto, y, x: [x0, x0 + ancho + hueco] };
})();

/* ── Dónde se pulsa y qué se señala ───────────────────────────────────────────────────────── */

const MENU = MENU_DIRECTIVO;
export const CONFIG = entradaDe(MENU, 'Configuración');
export const EL_COLEGIO = entradaDe(MENU, 'Configuración', 'El colegio');

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const foco = (r: { x: number; y: number; ancho: number; alto: number }, radio = 10) => ({ ...enElFotograma(enLaCascara(r, 0)), radio });

const ed = rectEditor(E0);

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	config: { x: 150, y: alturaEnMenu(MENU, CONFIG.seccion, null, null) + MEDIDAS.seccion / 2 },
	colegio: { x: 150, y: alturaEnMenu(MENU, EL_COLEGIO.seccion, EL_COLEGIO.hija, CONFIG.seccion) + MEDIDAS.hija / 2 },
	pestana: centro(enLaCascara(rectPestana(CERTIFICADOS), 0)),
	opcion: centro(enLaCascara(rectBotonDelAnio(E0, MEMBRETADA), 0)),
	/** Al final del texto, en su segundo renglón: ahí cae el cursor de escritura. */
	editor: { x: enLaCascara(ed, 0).x + 150, y: enLaCascara(ed, 0).y + 36 + 10 + 33 },
	guardar: centro(enLaCascara(rectGuardarTextos(E1), 0)),
};

const fila = (() => {
	const { a } = disposicion(E0);
	return { x: a.x - 4, y: a.y - 4, ancho: a.ancho + 8, alto: a.alto + 8 };
})();

export const FOCOS = {
	config: enElFotograma({ x: 0, y: alturaEnMenu(MENU, CONFIG.seccion, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	pestana: foco(rectPestana(CERTIFICADOS), 6),
	delAnio: foco(fila, 12),
	editor: foco({ x: ed.x - 8, y: ed.y - 36, ancho: ed.ancho + 16, alto: ed.alto + 44 + 26 }, 10),
	barra: foco(rectBarraTextos(E1), 10),
	conMembrete: { x: CABECERAS.x[0] - 10, y: CABECERAS.y - 10, ancho: CABECERAS.ancho + 20, alto: CABECERAS.alto + 20, radio: 10 },
	sinMembrete: { x: CABECERAS.x[1] - 10, y: CABECERAS.y - 10, ancho: CABECERAS.ancho + 20, alto: CABECERAS.alto + 20, radio: 10 },
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const URL_BASE = `/colegio/${ALMENDROS.yearId}`;
const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_CERTIFICADOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Certificados', url: `${URL_BASE}/certificados` };
const EN_EL_PAPEL = { ubicacion: 'Así sale en el papel: Informes ▸ Certificado de estudio', url: '/informes/certificados-estudio/:grupo_id' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Configuración, El colegio, pestaña Certificados.', ...EN_EL_MENU, foco: FOCOS.config, focoHasta: T.pulsaConfig + 20 },
	{ desde: 156, texto: 'Arriba, qué membrete del colegio usa 2026.', ...EN_CERTIFICADOS, foco: FOCOS.delAnio, focoHasta: T.pulsaOpcion - 4 },
	{ desde: T.cambia, texto: 'Un clic y queda puesto: no hay botón de guardar.', ...EN_CERTIFICADOS },
	{ desde: 419, texto: 'Los textos también son del año.', ...EN_CERTIFICADOS, foco: FOCOS.editor },
	{ desde: 506, texto: 'Estos sí se guardan: Guardar los textos.', ...EN_CERTIFICADOS, foco: FOCOS.barra, focoHasta: T.pulsaGuardar - 4 },
	{ desde: 640, texto: 'Con membrete, el escudo va dentro de la imagen.', ...EN_EL_PAPEL, foco: FOCOS.conMembrete },
	{ desde: 757, texto: 'Sin membrete, el escudo sale junto al título.', ...EN_EL_PAPEL, foco: FOCOS.sinMembrete },
];

export const AVISO_CAMBIA = { desde: T.cambia, dura: 419 - T.cambia - 12 };
export const AVISO_GUARDADOS = { desde: T.guardados, dura: 640 - T.guardados };

export const TARJETA = 880;
export const DURACION = TARJETA + 120;

export const CLAVE = 'certificado-del-ano';
export const TITULO = 'Lo que imprime este año';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: El colegio, Certificados' },
	{ desde: 156, titulo: 'Qué membrete usa 2026' },
	{ desde: 419, titulo: 'Los textos del año' },
	{ desde: T.entranLasHojas, titulo: 'El escudo sólo sale sin membrete' },
];

export const CIERRE: Cierre = {
	hiciste: 'Pusiste el membrete del colegio a 2026 y le añadiste el NIT al texto.',
	seVe: `La marca de ${ALMENDROS.year} pasa a «${PLANTILLAS[MEMBRETADA].nombre}», y dos avisos lo confirman.`,
	despues: 'Siguiente: sacar certificados de estudio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[2].desde !== T.cambia) {
	throw new Error('Guion: el aviso del cambio no cae en el paso que lo explica.');
}
if (E0.vivas[PRUEBA] !== 0) {
	throw new Error('Guion: «Prueba» se borró en el vídeo anterior y aquí sigue viva.');
}
