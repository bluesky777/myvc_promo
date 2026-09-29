import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ASIGNATURAS, ENTRADA_DEL_PUNTERO, puntoDelMenu, rectDelMenu } from '../montar-el-ano/EnLaCascara';
import { centro, rectAjuste, rectBotonDeCelda, rectCeldas, rectFiltro, rectOpcion, rectPulgar, type Rect } from '../montar-el-ano/planoAsignaturas';
import { DIAS_QUE_SE_MARCAN, LA_QUE_SE_MARCA, M, estadoEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «LOS DÍAS DE CLASE DE UNA ASIGNATURA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Los días alimentan «Clases de hoy» del docente: NO son el horario del colegio.** Son cinco
 *     sí/no por asignatura, sin hora ni salón. Mientras el colegio no publique un horario oficial,
 *     el panel del docente sale de aquí (`ChangeAskedController::asignaturas_dia`, que filtra por
 *     la columna del día). Cuando se publica uno, manda el horario: marcarlo oficial rehace estas
 *     columnas para el año entero (`HorarioController`, la derivación de la §7).
 *
 * Y el interruptor de al lado, que es la otra mitad: «Mostrar todas las materias al docente,
 * ignorando el horario» (`show_materias_todas`, del año) hace que `asignaturas_dia` no mire el día.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LO QUE EL VÍDEO NO ENSEÑA: la portada del docente con «Clases de hoy». Se dice con palabras y no
 * se dibuja; dibujarla sería otra pantalla entera para un rótulo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Referencias -> Asignaturas; el filtro por la docente
 *     2. LOS DÍAS     se desplaza la rejilla; lunes, miércoles y viernes pasan a «Sí»
 *     3. QUÉ SON      Clases de hoy; no son el horario; el interruptor del año
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => enElFotograma({ x: r.x - margen, y: r.y - margen, ancho: r.ancho + margen * 2, alto: r.alto + margen * 2 });

const conDias = estadoEn(M.pulsaDia[2] + M.vuelo + 4);

export const FOCOS = {
	menu: enElFotograma(rectDelMenu(null, false)),
	filtro: f(rectFiltro(estadoEn(M.llegaFiltro), 'profesor')),
	barra: f(rectPulgar(estadoEn(M.llegaBarra)), 10),
	dias: f(rectCeldas(conDias, LA_QUE_SE_MARCA, 'd0', 'd4'), 2),
	fila: f(rectCeldas(conDias, LA_QUE_SE_MARCA, 'materia', 'd4'), 2),
	ajuste: f(rectAjuste(conDias), 8),
};

const pulgar = centro(rectPulgar(estadoEn(M.llegaBarra)));
const opcion = (frame: number) => {
	const e = estadoEn(frame);
	return centro(rectOpcion(e, e.desplegable!, 0));
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu(null, false),
	asignaturas: puntoDelMenu(ASIGNATURAS, true),
	filtro: centro(rectFiltro(estadoEn(M.llegaFiltro), 'profesor')),
	opcionFiltro: opcion(M.llegaOpcionFiltro),
	pulgar,
	pulgarSuelto: centro(rectPulgar(estadoEn(M.sueltaBarra))),
	dias: DIAS_QUE_SE_MARCAN.map((d) => centro(rectBotonDeCelda(conDias, LA_QUE_SE_MARCA, `d${d}`))),
	ajuste: (() => { const r = rectAjuste(conDias); return { x: r.x + 16, y: r.y + r.alto / 2 }; })(),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Asignaturas', url: '/asignaturas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Ve a Referencias ▸ Asignaturas.', voz: 'Ve a Referencias, Asignaturas.', ...EN_EL_MENU, foco: FOCOS.menu, focoHasta: M.pulsaReferencias + 10 },
	{ desde: 120, texto: 'Filtra por profesor: sólo las de Marcela.', ...AQUI, foco: FOCOS.filtro, focoHasta: M.pulsaFiltro + 8 },
	{ desde: 240, texto: 'Desplaza la rejilla: los días van al final.', ...AQUI, foco: FOCOS.barra, focoHasta: M.agarraBarra - 2 },
	{ desde: 363, texto: 'Cada botón es un día: se pulsa y pasa a Sí.', ...AQUI, foco: FOCOS.dias },
	{ desde: 483, texto: 'Se guarda solo; sólo avisa si falla.', ...AQUI, foco: FOCOS.dias },
	{ desde: 593, texto: 'Esto alimenta «Clases de hoy» de Marcela.', ...AQUI, foco: FOCOS.fila },
	{ desde: 725, texto: 'No es el horario: si se publica uno, manda ése.', ...AQUI, foco: FOCOS.fila },
	{ desde: 863, texto: 'Encendido, cada docente ve todas sus materias todos los días.', ...AQUI, foco: FOCOS.ajuste },
];

export const TARJETA = 1011;
export const DURACION = 1125;

export const CLAVE = 'asignaturas-dias';
export const TITULO = 'Los días de clase de una asignatura';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Asignaturas' },
	{ desde: 240, titulo: 'Marcar los días' },
	{ desde: 593, titulo: 'Para qué sirven: Clases de hoy' },
	{ desde: 725, titulo: 'El horario y el interruptor del año' },
];

export const CIERRE: Cierre = {
	hiciste: 'Marcaste lunes, miércoles y viernes para Lengua Castellana de 9°B.',
	seVe: 'Los tres «Sí» en azul; y esos días, la clase en «Clases de hoy» de Marcela.',
	despues: 'Siguiente: crear los grupos del año.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Los tres días se pulsan con el rótulo que lo explica en pantalla, y acaban de volar antes del siguiente. */
M.pulsaDia.forEach((p) => {
	if (p < PASOS[3].desde || p + M.vuelo > PASOS[4].desde) {
		throw new Error(`Guion: un día se pulsa en ${p}, fuera del paso 4 (${PASOS[3].desde}–${PASOS[4].desde}).`);
	}
});
