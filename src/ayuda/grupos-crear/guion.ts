import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ASIGNATURAS, ENTRADA_DEL_PUNTERO, GRUPOS as GRUPOS_EN_EL_MENU, puntoDelMenu, rectDelMenu } from '../montar-el-ano/EnLaCascara';
import { centro, rectCuadre, type Rect } from '../montar-el-ano/planoAsignaturas';
import {
	rectBotonCrear, rectCampoGrupo, rectCampoGrupoConEtiqueta, rectCeldasGrupos, rectCrearGrupo, rectOpcionGrupos, rectPulgarGrupos, rectRejillaGrupos,
} from '../montar-el-ano/planoGrupos';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { ASIGNATURAS_AL_LLEGAR, G11, M, estadoGruposEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «CREAR LOS GRUPOS DEL AÑO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Los grupos van antes que las asignaturas, y la IH del grupo es contra lo que cuadran.**
 *     Una asignatura no se puede crear sin grupo (la ficha lo exige), y la «IH semanal» que se le
 *     pone aquí es el número contra el que Asignaturas suma las suyas. El vídeo acaba allí, con el
 *     grupo recién creado ya nombrado en el cuadre: 0 de 30 horas.
 *
 * Precondición, en cartel propio: el grado tiene que existir. Sin él, «Elige el grado: el grupo no
 * se puede crear sin él» (`grupos.ts`, `crear`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA    Referencias -> Grupos
 *     2. LA FICHA      Crear grupo: nombre, abreviatura, grado, titular, orden, IH semanal
 *     3. LA FILA       entra al final; se baja y se desplaza la rejilla hasta «IH semanal»
 *     4. EL PORQUÉ     Referencias -> Asignaturas: el cuadre ya pide sus 30 horas
 */

export const FPS = 30;

/** Un rectángulo de la cáscara al fotograma, con margen, y recortado a lo que se ve de la cáscara. */
const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

export const FOCOS = {
	menu: enElFotograma(rectDelMenu(null, false)),
	rejilla: f(rectRejillaGrupos(estadoGruposEn(M.monta + 20)), 2),
	crear: f(rectCrearGrupo(estadoGruposEn(M.llegaCrear))),
	ih: f(rectCampoGrupoConEtiqueta(estadoGruposEn(M.pulsaIh), 'ih', true), 2),
	fila: f(rectCeldasGrupos(estadoGruposEn(M.sueltaBarra + 2), 14, 'nombre', 'ih'), 2),
	celdaIh: f(rectCeldasGrupos(estadoGruposEn(M.sueltaBarra + 2), 14, 'ih'), 2),
	menuAsignaturas: enElFotograma(rectDelMenu(ASIGNATURAS, true)),
	cuadre: f(rectCuadre(ASIGNATURAS_AL_LLEGAR), 4),
};

const opcion = (frame: number, i = 0) => {
	const e = estadoGruposEn(frame);
	return centro(rectOpcionGrupos(e, i));
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu(null, false),
	grupos: puntoDelMenu(GRUPOS_EN_EL_MENU, true),
	crear: centro(rectCrearGrupo(estadoGruposEn(M.llegaCrear))),
	nombre: centro(rectCampoGrupo(estadoGruposEn(M.llegaNombre), 'nombre')),
	abrev: centro(rectCampoGrupo(estadoGruposEn(M.llegaAbrev), 'abrev')),
	grado: centro(rectCampoGrupo(estadoGruposEn(M.llegaGrado), 'grado')),
	opcionGrado: opcion(M.llegaOpcionGrado, 13),
	titular: centro(rectCampoGrupo(estadoGruposEn(M.llegaTitular), 'titular')),
	opcionTitular: opcion(M.llegaOpcionTitular),
	orden: centro(rectCampoGrupo(estadoGruposEn(M.llegaOrden), 'orden')),
	ih: centro(rectCampoGrupo(estadoGruposEn(M.llegaIh), 'ih')),
	crearFicha: centro(rectBotonCrear(estadoGruposEn(M.llegaCrearFicha))),
	pulgar: centro(rectPulgarGrupos(estadoGruposEn(M.llegaBarra))),
	pulgarSuelto: centro(rectPulgarGrupos(estadoGruposEn(M.sueltaBarra))),
	asignaturas: puntoDelMenu(ASIGNATURAS, true),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Grupos', url: '/grupos' };
const EN_ASIGNATURAS = { ubicacion: 'Menú ▸ Referencias ▸ Asignaturas', url: '/asignaturas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Antes: el grado del grupo ya tiene que existir.', ...EN_EL_MENU, foco: FOCOS.menu, focoHasta: M.pulsaReferencias + 10 },
	{ desde: 131, texto: 'Falta 11°A: Crear grupo abre la ficha.', voz: 'Falta once A: Crear grupo abre la ficha.', ...AQUI, foco: FOCOS.crear, focoHasta: M.pulsaCrear + 10 },
	{ desde: 250, texto: 'Nombre y grado son obligatorios; el titular, no.', ...AQUI },
	{ desde: 420, texto: 'IH: horas de clase del grupo a la semana.', voz: 'Intensidad horaria: horas de clase del grupo a la semana.', ...AQUI, foco: FOCOS.ih },
	{ desde: 556, texto: 'Crear: la fila nueva entra al final, sin alumnos.', ...AQUI },
	{ desde: 700, texto: 'No borres un grupo con alumnos: no se puede restaurar.', ...AQUI, rojo: true },
	{ desde: 862, texto: 'Por eso van primero: una asignatura pide su grupo.', ...AQUI, foco: FOCOS.menuAsignaturas, focoHasta: M.pulsaAsignaturas + 10 },
	{ desde: 988, texto: 'Ya sale en Asignaturas: 0 de 30 horas.', voz: 'Ya sale en Asignaturas: cero de treinta horas.', ...EN_ASIGNATURAS, foco: FOCOS.cuadre },
];

export const AVISO = { desde: M.creado, dura: fotogramasDe(2000), texto: `Grupo ${G11.nombre} creado` };

export const TARJETA = 1117;
export const DURACION = 1235;

export const CLAVE = 'grupos-crear';
export const TITULO = 'Crear los grupos del año';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Grupos' },
	{ desde: M.pulsaCrear, titulo: 'La ficha: nombre, grado e IH semanal' },
	{ desde: 556, titulo: 'La fila nueva' },
	{ desde: 862, titulo: 'Por qué van antes que las asignaturas' },
];

export const CIERRE: Cierre = {
	hiciste: 'Creaste 11°A, de Undécimo, con su titular e IH semanal 30.',
	seVe: 'La fila al final de Grupos, y en Asignaturas «(11A) 11°A · 0 de 30 h».',
	despues: 'Siguiente: crear sus asignaturas.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[7].desde < M.montaAsignaturas + 14) {
	throw new Error(`Guion: el paso 8 señala el cuadre en ${PASOS[7].desde} y Asignaturas se monta en ${M.montaAsignaturas}.`);
}
