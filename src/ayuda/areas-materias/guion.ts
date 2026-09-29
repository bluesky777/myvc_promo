import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, focoDelMenu, puntoDelMenu } from '../el-ano/Aplicacion';
import { MEDIDAS } from '../medidas';
import {
	A, ALTO_DIALOGO, AMBAR, AREAS, AREAS_DESPUES, CONTRATADOS, DE, FILA_MOVIDA, MOVIDA, NUEVO_DIRECTOR, TEXTOS, celdaArea, disposicionDirectores, pagMaterias,
	rectArea, rectBotonDirectores, rectMateria, rectPersona, rectTarjetaDocente,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «ÁREAS, MATERIAS Y DIRECTORES».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     La materia cambia de área arrastrándola; el director es del AÑO y se hereda sin mirar
 *     contrato.
 *
 * Lo primero es el panel «Ordenar» de Materias (`materias.html`, `cdkDropListGroup`): soltar una
 * materia en la lista de otra área le cambia el área, y NO sale aviso (`materias.ts:312-317`): lo
 * que cambia es la columna «Área» de la rejilla, y el vídeo baja a enseñarla.
 *
 * Lo segundo es Directores de área (`areas/directores`): el director vive en `jefes_de_area` por
 * año, y al crear un año se copian los del anterior sin filtro de contrato
 * (`YearsController::copiarLosJefesDeArea`). La pantalla lo avisa en ámbar y el vídeo lo arregla.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   Referencias -> Materias: el panel «Ordenar»
 *     2. ARRASTRAR    «Cátedra de la Paz» de Ciencias Sociales a Ética; la rejilla lo dice
 *     3. DIRECTORES   Referencias -> Áreas -> «Directores de área»: del año, heredados
 *     4. ARREGLAR     la fila en ámbar: elegir a alguien del año
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaReferencias: 34,
	pulsaReferencias: 40,
	abreReferencias: 42,
	llegaEntrada: 66,
	pulsaEntrada: 74,
	monta: 78,

	llegaAsa: 270,
	agarra: 282,
	suelta: 330,

	bajaDesde: 346,
	bajaHasta: 376,

	llegaAreas: 548,
	pulsaAreas: 556,
	seVaMaterias: 558,
	montaAreas: 572,
	llegaDirectores: 592,
	pulsaDirectores: 602,
	seVaAreas: 604,
	montaDirectores: 618,

	llegaPersona: 980,
	pulsaPersona: 990,
	dialogo: 994,
	llegaDocente: 1024,
	pulsaDocente: 1038,
	/** El PUT vuelve: «Director de área guardado», la fila deja de ser ámbar y el aviso se pliega. */
	guardado: 1050,
	cursorSale: 1170,
};

/** Cuánto baja Materias para enseñar la fila de la rejilla. */
export const BAJADA = Math.round(celdaArea(FILA_MOVIDA).y - (MEDIDAS.alto - 260));

const ELEGIDO = CONTRATADOS.indexOf(NUEVO_DIRECTOR);

const f = (r: { x: number; y: number; ancho: number; alto: number }, margen = 6, radio = 10) => alFotograma(r, margen, radio);
const bajado = (r: { x: number; y: number; ancho: number; alto: number }) => ({ ...r, y: r.y - BAJADA });

/** Dónde se agarra y dónde se suelta: el asa de la materia, y el hueco bajo «Ética y Valores». */
const origen = rectMateria(AREAS, DE, 1);
const destino = rectMateria(AREAS_DESPUES, A, 1);

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu('Referencias'),
	materias: puntoDelMenu('Referencias', 'Materias'),
	asa: { x: origen.x + 13, y: origen.y + origen.alto / 2 },
	suelta: { x: destino.x + 13, y: destino.y + destino.alto / 2 },
	areas: puntoDelMenu('Referencias', 'Áreas'),
	directores: centro(rectBotonDirectores()),
	persona: centro(rectPersona(1, AMBAR)),
	docente: centro(rectTarjetaDocente(ELEGIDO)),
};

export const ORIGEN = origen;

const d1 = disposicionDirectores(1);
const d0 = disposicionDirectores(0);

export const FOCOS = {
	referencias: focoDelMenu('Referencias'),
	ordenar: f(pagMaterias().encima, 4, 10),
	arrastre: f({ ...rectArea(AREAS, DE), alto: rectArea(AREAS, A).y + rectArea(AREAS, A).alto - rectArea(AREAS, DE).y }, 4, 8),
	fila: f(bajado(celdaArea(FILA_MOVIDA)), 2, 8),
	menuAreas: focoDelMenu('Referencias', 'Áreas'),
	subtitulo: f(d1.cabecera, 6, 10),
	aviso: f(d1.alerta, 4, 10),
	ambar: f(d1.filas[AMBAR], 2, 8),
	dialogo: f({ x: (1440 - 680) / 2, y: 150, ancho: 680, alto: ALTO_DIALOGO }, 4, 10),
	arreglada: f({ x: d0.filas[AMBAR].x, y: d0.cabecera.y, ancho: d0.filas[AMBAR].ancho, alto: d0.filas[AMBAR].y + d0.filas[AMBAR].alto - d0.cabecera.y }, 4, 10),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const EN_MATERIAS = { ubicacion: 'Menú ▸ Referencias ▸ Materias', url: '/materias' };
const EN_AREAS = { ubicacion: 'Menú ▸ Referencias ▸ Áreas', url: '/areas' };
const EN_DIRECTORES = { ubicacion: 'Menú ▸ Referencias ▸ Áreas ▸ Directores de área', url: '/areas/directores' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Referencias, Materias.', ...EN_EL_MENU, foco: FOCOS.referencias, focoHasta: T.pulsaReferencias + 20 },
	{ desde: 120, texto: 'En «Ordenar», cada área con sus materias.', ...EN_MATERIAS, foco: FOCOS.ordenar },
	{ desde: 258, texto: 'Arrastra una materia a otra área para cambiarla.', ...EN_MATERIAS, foco: FOCOS.arrastre, focoHasta: T.bajaDesde - 2 },
	{ desde: T.bajaHasta + 4, texto: 'No sale aviso: la tabla ya dice su área nueva.', ...EN_MATERIAS, foco: FOCOS.fila, focoHasta: 510 },
	{ desde: 524, texto: 'Los directores de área están en Áreas.', ...EN_AREAS, foco: FOCOS.menuAreas, focoHasta: T.pulsaAreas + 10 },
	{ desde: 626, texto: 'El director es de cada año.', ...EN_DIRECTORES, foco: FOCOS.subtitulo },
	{ desde: 716, texto: 'Al abrir un año, se heredan sin mirar contratos.', ...EN_DIRECTORES, foco: FOCOS.aviso },
	{ desde: 854, texto: 'En ámbar: su director ya no está contratado.', ...EN_DIRECTORES, foco: FOCOS.ambar },
	{ desde: 974, texto: 'Pulsa el nombre y elige otro del año.', ...EN_DIRECTORES, foco: FOCOS.dialogo, focoHasta: T.pulsaDocente + 4 },
	{ desde: 1072, texto: 'Guardado: la fila deja el ámbar.', ...EN_DIRECTORES, foco: FOCOS.arreglada },
];

export const AVISO = { desde: T.guardado, dura: 60, texto: TEXTOS.guardado };

export const TARJETA = 1190;
export const DURACION = TARJETA + 110;

export const CLAVE = 'areas-materias';
export const TITULO = 'Áreas, materias y directores';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Materias' },
	{ desde: 258, titulo: 'Cambiar una materia de área' },
	{ desde: 524, titulo: 'Directores de área: son del año' },
	{ desde: 854, titulo: 'Los heredados sin contrato' },
];

export const CIERRE: Cierre = {
	hiciste: `Pasaste «${MOVIDA}» a Ética y nombraste un director del año.`,
	seVe: 'La columna Área de Materias, y la fila del área sin ámbar en Directores.',
	despues: 'Siguiente: crear las asignaturas del año.',
	voz: 'Siguiente: crear las asignaturas.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.agarra < PASOS[2].desde || T.suelta >= PASOS[3].desde) { throw new Error('Guion: el arrastre no cae en su paso.'); }
if (T.bajaHasta > PASOS[3].desde + 90) { throw new Error('Guion: la rejilla llega tarde al paso que la señala.'); }
if (T.guardado >= PASOS[9].desde || T.pulsaDocente < PASOS[8].desde) { throw new Error('Guion: el guardado no cae antes de su paso.'); }
