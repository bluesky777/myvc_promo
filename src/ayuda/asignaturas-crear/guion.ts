import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ASIGNATURAS, ENTRADA_DEL_PUNTERO, puntoDelMenu, rectDelMenu } from '../montar-el-ano/EnLaCascara';
import {
	centro, rectCampo, rectCampoConEtiqueta, rectBotonFicha, rectCeldas, rectCrearNueva, rectCuadre, rectOpcion, rectVerSus,
	type Rect,
} from '../montar-el-ano/planoAsignaturas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { M, estadoEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «CREAR UNA ASIGNATURA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **No es un catálogo: decide quién califica a quién.** Una fila de Asignaturas no es «9°B ve
 *     Tecnología»: es «Óscar califica Tecnología en 9°B». Desde que se crea, a Óscar le sale en
 *     Mis asignaturas (`Profesor::asignaturas` filtra por `a.profesor_id`) y es él quien la
 *     califica. El último rótulo lo dice con esas palabras, sobre la fila recién creada.
 *
 * Y de paso, lo que más confunde de la ficha: **«Créditos» es la IH**. La ficha lo llama Créditos
 * y la rejilla IH, y es la misma columna (`asignaturas.creditos`). Por eso el cuadre de arriba
 * pasa de «28 de 30» a «30 de 30» al crear.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA    menú -> Referencias -> Asignaturas; y antes, la precondición
 *     2. EL CUADRE     a 9°B le faltan 2 horas; «Ver sus asignaturas» filtra
 *     3. LA FICHA      Crear nueva: materia, grupo, profesor, créditos; Crear
 *     4. EL EFECTO     el cuadre en verde y la fila de Óscar
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO ES EL DE LA APLICACIÓN: el alta es un POST y se recarga la lista; el aviso «Asignatura
 * creada con éxito» dura 2 s (`duration: 2000`) y es lo único que confirma que se guardó.
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => enElFotograma({ x: r.x - margen, y: r.y - margen, ancho: r.ancho + margen * 2, alto: r.alto + margen * 2 });

export const FOCOS = {
	cuadre: f(rectCuadre(estadoEn(M.monta + 40)), 4),
	verSus: f(rectVerSus(estadoEn(M.llegaVerSus), 0)),
	crearNueva: f(rectCrearNueva(estadoEn(M.llegaCrearNueva))),
	creditos: f(rectCampoConEtiqueta(estadoEn(M.pulsaCreditos), 'creditos'), 2),
	cuadreDespues: f(rectCuadre(estadoEn(M.creada + 20)), 4),
	laNueva: f(rectCeldas(estadoEn(M.creada + 20), 9, 'materia', 'ih'), 2),
};

const opcion = (frame: number) => {
	const e = estadoEn(frame);
	return centro(rectOpcion(e, e.desplegable!, 0));
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu(null, false),
	asignaturas: puntoDelMenu(ASIGNATURAS, true),
	verSus: centro(rectVerSus(estadoEn(M.llegaVerSus), 0)),
	crearNueva: centro(rectCrearNueva(estadoEn(M.llegaCrearNueva))),
	materia: centro(rectCampo(estadoEn(M.llegaMateria), 'materia')),
	opcionMateria: opcion(M.llegaOpcionMateria),
	grupo: centro(rectCampo(estadoEn(M.llegaGrupo), 'grupo')),
	opcionGrupo: opcion(M.llegaOpcionGrupo),
	profesor: centro(rectCampo(estadoEn(M.llegaProfesor), 'profesor')),
	opcionProfesor: opcion(M.llegaOpcionProfesor),
	creditos: centro(rectCampo(estadoEn(M.llegaCreditos), 'creditos')),
	crear: centro(rectBotonFicha(estadoEn(M.llegaCrear), 'primero')),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Asignaturas', url: '/asignaturas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Antes, deben existir el grupo y la materia.', ...EN_EL_MENU, foco: enElFotograma(rectDelMenu(null, false)), focoHasta: M.pulsaReferencias + 10 },
	{ desde: 132, texto: 'Arriba: a 9°B le faltan 2 horas.', voz: 'Arriba: a nueve B le faltan dos horas.', ...AQUI, foco: FOCOS.cuadre },
	{ desde: 247, texto: '«Ver sus asignaturas» deja sólo las de 9°B.', voz: 'Ver sus asignaturas deja sólo las de nueve B.', ...AQUI, foco: FOCOS.verSus, focoHasta: M.pulsaVerSus - 6 },
	{ desde: 360, texto: 'Crear nueva abre la ficha, arriba.', ...AQUI, foco: FOCOS.crearNueva, focoHasta: M.pulsaCrearNueva + 10 },
	{ desde: 467, texto: 'Materia, grupo y el profesor que la califica.', ...AQUI },
	{ desde: 590, texto: 'Créditos es la IH; luego, Crear.', voz: 'Créditos es la intensidad horaria; luego, Crear.', ...AQUI, foco: FOCOS.creditos, focoHasta: M.llegaCrear },
	{ desde: M.creada + 18, texto: 'Y 9°B ya cuadra: 30 de 30.', voz: 'Y nueve B ya cuadra: 30 de 30.', ...AQUI, foco: FOCOS.cuadreDespues },
	{ desde: M.creada + 132, texto: 'Óscar ya la ve en Mis asignaturas: él la califica.', ...AQUI, foco: FOCOS.laNueva },
];

export const AVISO = { desde: M.creada, dura: fotogramasDe(2000), texto: 'Asignatura creada con éxito' };

export const TARJETA = M.creada + 268;
export const DURACION = TARJETA + 120;

export const CLAVE = 'asignaturas-crear';
export const TITULO = 'Crear una asignatura';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Asignaturas' },
	{ desde: 128, titulo: 'El cuadre: lo que le falta a un grupo' },
	{ desde: M.pulsaCrearNueva, titulo: 'La ficha: materia, grupo y docente' },
	{ desde: M.creada + 132, titulo: 'Quién la califica' },
];

export const CIERRE: Cierre = {
	hiciste: 'Creaste Tecnología e Informática de 9°B, con su docente y sus 2 horas.',
	seVe: 'La fila nueva en la rejilla, y arriba «30 de 30 h asignadas · cuadra».',
	despues: 'Siguiente: cambiar el docente o quitar una.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El paso que explica el efecto empieza cuando el efecto ya está en pantalla, no antes. */
if (PASOS[6].desde < M.creada) {
	throw new Error(`Guion: el paso 7 habla del cuadre en verde desde ${PASOS[6].desde} y la asignatura se crea en ${M.creada}.`);
}
/* El puntero no pulsa Crear hasta que el paso que lo dice está en pantalla. */
if (M.pulsaCrear < PASOS[5].desde) {
	throw new Error(`Guion: se pulsa Crear en ${M.pulsaCrear}, antes del rótulo que lo dice (${PASOS[5].desde}).`);
}
