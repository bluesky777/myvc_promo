import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { centro, type Rect } from '../secretaria/piezas';
import { ENTRADA_DEL_PUNTERO, PERSONAS, dePersonas, puntoDelMenu, rectDelMenu } from '../secretaria/menu';
import { rectBotonCabecera } from '../secretaria/planoDirectorio';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { M, NUEVO, OPCION_1A, estadoNuevoEn } from './datos';
import { disposicionNuevo, rectBotonFicha, rectCampo, rectCrear, rectEscape, rectGrupo, rectPie, rectProceso, rectTarjeta } from './plano';
import { ALTO_OPCION_DOBLE, altoDelPanel } from '../montar-el-ano/ant';
import { opcionesDeGrupos } from '../montar-el-ano/opciones';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «CREAR UN ALUMNO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Si ya hay alguien que se llama igual, el botón «Crear» se apaga, y hay que pulsar «No es
 *     ninguno de éstos».** Quien no lo sabe cree que la pantalla está rota. El vídeo enseña la
 *     tarjeta roja con la historia del otro, el botón apagado (`[disabled]="frenado()"`,
 *     `alumnos-nuevo.html:401-405`), las dos salidas («Es éste» lleva a su ficha; el escape rojo
 *     quita el freno y avisa «De acuerdo: se creará una ficha nueva.») y el alta.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   Personas ▸ Alumnos ▸ «Crear alumno»
 *     2. EL FRENO     nombres y apellidos; sale la tarjeta y «Crear» se apaga
 *     3. LA SALIDA    «Es éste» si es él; «No es ninguno de éstos» si es otro
 *     4. EL ALTA      Matricular 2026, grupo 1°A, «Crear»: «Alumno Juan Pablo creado.»
 *
 * EL RITMO ES EL DE LA APLICACIÓN: la búsqueda de parecidos espera 300 ms sin teclear
 * (`alumnos-nuevo.ts:668-672`) y la tarjeta sale donde empieza el paso que la explica (puerta abajo).
 * Tras «Crear» la pantalla NO navega: se queda y vacía el formulario (`alumnos-nuevo.ts:491`).
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

const CRUDA = disposicionNuevo(null);
const CON_FRENO = disposicionNuevo(true);
const SIN_FRENO = disposicionNuevo(false);
const bajada = (fr: number) => estadoNuevoEn(fr).desplazada ?? 0;

export const FOCOS = {
	personas: enElFotograma(rectDelMenu(PERSONAS, null, null)),
	crearAlumno: f(rectBotonCabecera(0)),
	nombres: f({ ...rectCampo(CRUDA, 'nombres'), y: rectCampo(CRUDA, 'nombres').y }, 8),
	tarjeta: f(rectTarjeta(CON_FRENO), 4),
	esEste: f(rectBotonFicha(CON_FRENO, 1), 8),
	crear: f(rectPie(CON_FRENO, bajada(M.bajaHasta)), 8),
	escape: f(rectEscape(CON_FRENO, bajada(M.bajaHasta)), 8),
	proceso: f(rectProceso(SIN_FRENO, bajada(M.pulsaEscape + 2)), 8),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(PERSONAS, null, null),
	alumnos: puntoDelMenu(PERSONAS, dePersonas('Alumnos'), PERSONAS),
	crearAlumno: centro(rectBotonCabecera(0)),
	nombres: { x: rectCampo(CRUDA, 'nombres').x + 160, y: centro(rectCampo(CRUDA, 'nombres')).y },
	apellidos: { x: rectCampo(CRUDA, 'apellidos').x + 160, y: centro(rectCampo(CRUDA, 'apellidos')).y },
	esEste: centro(rectBotonFicha(CON_FRENO, 1)),
	escape: centro(rectEscape(CON_FRENO, bajada(M.bajaHasta))),
	grupo: centro(rectGrupo(SIN_FRENO, bajada(M.pulsaEscape + 2))),
	opcion: (() => {
		const g = rectGrupo(SIN_FRENO, bajada(M.pulsaEscape + 2));
		const arriba = g.y - 4 - altoDelPanel(opcionesDeGrupos(null, 5));
		return { x: g.x + 120, y: arriba + 4 + OPCION_1A * ALTO_OPCION_DOBLE + ALTO_OPCION_DOBLE / 2 };
	})(),
	crear: centro(rectCrear(SIN_FRENO, bajada(M.llegaCrear))),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_ALUMNOS = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };
const AQUI = { ubicacion: 'Menú ▸ Personas ▸ Alumnos ▸ Nuevo alumno', url: '/alumnos/nuevo' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Se crea desde Personas, en Alumnos.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: M.pulsaPersonas + 10 },
	{ desde: 124, texto: 'Crear alumno abre la ficha en blanco.', ...EN_ALUMNOS, foco: FOCOS.crearAlumno, focoHasta: M.pulsaCrearAlumno + 8 },
	{ desde: 224, texto: 'Al escribir el nombre, mira si ya existe.', ...AQUI },
	{ desde: M.tarjeta, texto: 'Ya hubo otro Juan Pablo Ríos Arango: sale su historia.', ...AQUI, foco: FOCOS.tarjeta },
	{ desde: 485, texto: 'Si es él, «Es éste» abre su ficha.', ...AQUI, foco: FOCOS.esEste },
	{ desde: 598, texto: 'Mientras no decidas, Crear sigue apagado.', ...AQUI, foco: FOCOS.crear },
	{ desde: 715, texto: 'Si es otra persona: «No es ninguno de éstos».', ...AQUI, foco: FOCOS.escape, focoHasta: M.pulsaEscape - 8 },
	{ desde: 836, texto: 'Abajo se elige su grupo de 2026.', ...AQUI, foco: FOCOS.proceso, focoHasta: M.pulsaGrupo - 4 },
	{ desde: 950, texto: 'Crear lo guarda y deja la ficha en blanco.', ...AQUI },
];

/** Los avisos: el del escape es azul (`aviso.info`), el del alta verde. `nzDuration` de la casa: 3 s. */
export const AVISOS = [
	{ desde: M.pulsaEscape + 4, dura: fotogramasDe(3000), texto: 'De acuerdo: se creará una ficha nueva.', tono: 'info' as const },
	{ desde: M.creado, dura: fotogramasDe(3000), texto: `Alumno ${NUEVO.nombres} creado.`, tono: 'exito' as const },
];

export const TARJETA = 1075;
export const DURACION = 1195;

export const CLAVE = 'alumno-crear';
export const TITULO = 'Crear un alumno';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Personas, Alumnos' },
	{ desde: M.montaNuevo, titulo: 'La ficha en blanco' },
	{ desde: M.tarjeta, titulo: 'Si ya existe: la tarjeta y el freno' },
	{ desde: 715, titulo: 'Es otra persona: crear igual' },
	{ desde: 836, titulo: 'El grupo y Crear' },
];

export const CIERRE: Cierre = {
	hiciste: 'Creaste a Juan Pablo Ríos Arango en 1°A, aunque ya hubo otro igual.',
	seVe: 'Sale «Alumno Juan Pablo creado.» y la ficha vuelve en blanco.',
	despues: 'Siguiente: matricular a los del año pasado.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* La tarjeta sale donde empieza el paso que la explica. */
if (PASOS[3].desde !== M.tarjeta) {
	throw new Error(`Guion: la tarjeta sale en ${M.tarjeta} y su paso empieza en ${PASOS[3].desde}.`);
}
/* Y «Crear» tiene que haberse visto apagado antes de que el escape lo encienda. */
if (M.bajaHasta >= M.pulsaEscape) {
	throw new Error('Guion: la página tiene que haber bajado hasta «Crear» antes del escape.');
}
