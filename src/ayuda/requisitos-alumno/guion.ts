import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { ALTO_OPCION } from '../montar-el-ano/ant';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { ENTRADA_DEL_PUNTERO, PERSONAS, dePersonas, puntoDelMenu, rectDelMenu } from '../secretaria/menu';
import { centro, type Rect } from '../secretaria/piezas';
import { disposicionDirectorio, rectAccion } from '../secretaria/planoDirectorio';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { FILA_MEDICO, M, N, OPCION, S1, S2 } from './datos';
import { rectCompromisos, rectPanelesDeAnio, rectRadio, rectRequisitos, rectSelectCompromiso } from './Ficha';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «REQUISITOS Y COMPROMISOS DEL ALUMNO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Los requisitos se llevan por año, y marcar quién cumplió es en la ficha del alumno, no en
 *     Referencias.** Referencias ▸ Requisitos de matrícula arma la lista de papeles del año; no
 *     marca a nadie (`requisitos.ts:42-44`). Aquí, en la pestaña «Matrículas», cada año es un
 *     panel con sus requisitos y su «Falta | Ya | N/A», que se guarda al pulsar y avisa «Requisito
 *     actualizado» (`persona-matriculas.ts:63-67`, 137). Los compromisos del año van debajo, y el
 *     desplegable se guarda al elegir: «Guardado» (`ficha-alumno.ts:187`).
 *
 * TRES ACTOS: la llegada (Personas ▸ Alumnos ▸ el carné de la fila), los requisitos, los compromisos.
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

const D = disposicionDirectorio(false, false);

export const FOCOS = {
	personas: enElFotograma(rectDelMenu(PERSONAS, null, null)),
	carne: f(rectAccion(D, 0, 0), 6),
	anios: f(rectPanelesDeAnio(0), 6),
	requisitos: f(rectRequisitos(N, S1), 6),
	ya: f(rectRadio(FILA_MEDICO, 'ya', S1), 8),
	compromisos: f(rectCompromisos(N, S2), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(PERSONAS, null, null),
	alumnos: puntoDelMenu(PERSONAS, dePersonas('Alumnos'), PERSONAS),
	carne: centro(rectAccion(D, 0, 0)),
	ya: centro(rectRadio(FILA_MEDICO, 'ya', S1)),
	select: { x: rectSelectCompromiso(N, S2).x + 150, y: centro(rectSelectCompromiso(N, S2)).y },
	opcion: { x: rectSelectCompromiso(N, S2).x + 150, y: rectSelectCompromiso(N, S2).y + 32 + 4 + 4 + OPCION * ALTO_OPCION + ALTO_OPCION / 2 },
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_ALUMNOS = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };
const AQUI = { ubicacion: 'Menú ▸ Personas ▸ Alumnos ▸ Ficha de la persona', url: '/persona/4101/alumno' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Los requisitos están en la ficha del alumno.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: M.pulsaPersonas + 10 },
	{ desde: 118, texto: 'En Alumnos, el carné de su fila la abre.', ...EN_ALUMNOS, foco: FOCOS.carne, focoHasta: M.pulsaFicha + 8 },
	{ desde: 234, texto: 'Abre en Matrículas: un panel por año.', ...AQUI, foco: FOCOS.anios, focoHasta: M.bajaDesde - 4 },
	{ desde: 345, texto: 'Van por año: éstos son los de 2026.', ...AQUI, foco: FOCOS.requisitos },
	{ desde: 475, texto: 'Llegó el certificado médico: Ya, y se guarda solo.', ...AQUI, foco: FOCOS.ya, focoHasta: M.pulsaYa + 10 },
	{ desde: 616, texto: 'La lista se arma en Referencias; se marca aquí.', ...AQUI },
	{ desde: 742, texto: 'Debajo, los compromisos: se guardan al elegir.', ...AQUI, foco: FOCOS.compromisos, focoHasta: M.pulsaSelect - 4 },
];

export const AVISOS = [
	{ desde: M.guardadoYa, dura: fotogramasDe(3000), texto: 'Requisito actualizado' },
	{ desde: M.guardadoCompromiso, dura: fotogramasDe(3000), texto: 'Guardado' },
];

export const TARJETA = 905;
export const DURACION = 1035;

export const CLAVE = 'requisitos-alumno';
export const TITULO = 'Requisitos y compromisos del alumno';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la ficha del alumno' },
	{ desde: 345, titulo: 'Los requisitos del año' },
	{ desde: 616, titulo: 'Referencias arma la lista; aquí se marca' },
	{ desde: 742, titulo: 'Los compromisos' },
];

export const CIERRE: Cierre = {
	hiciste: 'Marcaste el certificado médico de 2026 y pusiste un compromiso académico.',
	seVe: 'Sale «Requisito actualizado» y «Guardado»; la fila ya no está en rojo.',
	despues: 'Siguiente: usuarios, cómo entra cada uno.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (M.bajaHasta > PASOS[3].desde || M.bajaMasHasta > PASOS[6].desde) {
	throw new Error('Guion: la página tiene que haber bajado antes de encender el foco.');
}
if (!(PASOS[4].desde <= M.guardadoYa && M.guardadoYa < PASOS[5].desde)) {
	throw new Error('Guion: «Requisito actualizado» tiene que salir en el paso que lo explica.');
}
