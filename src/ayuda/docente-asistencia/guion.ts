import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { RITMO_AYUDA } from '../planilla/guion';
import { FOCOS_LLEGADA, TiemposDeLlegada } from '../planilla-nota-rapida/Llegada';
import { Anotacion } from './Faltas';
import {
	ENCIMA_CERRADA, GEOMETRIA, GEOMETRIA_CERRADA, HOY, MARIANA, TOMAS, VALENTINA,
	botonDe, columnasDeFaltas, cuentaDe, fotograma,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PASAR ASISTENCIA DESDE LA PLANILLA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 * **El candado que cierra las notas cierra también la asistencia.** Desde el 29 ago 2026 las
 * casillas de Aus y Tard y los botones de cada falta se apagan con el periodo cerrado
 * (`periodoAbierto()` en `planilla-notas.ts`), y el aviso de arriba lo dice con esas palabras:
 * «no puedes poner notas, ni asistencia, ni nivelar». Quien lo descubre en la semana de cierre
 * llama creyendo que la asistencia se rompió.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   la de los vídeos de la planilla (Académico -> Mis asignaturas -> Planilla)
 *     2. ANOTAR       Tomás no vino: su Aus de 0 a 1; Mariana llegó tarde: su Tard de 0 a 1
 *     3. CERRADO      otro día, con el periodo cerrado: el aviso y las casillas apagadas
 *
 * El 3 es otro plano y no un cambio dentro del mismo: el periodo no se cierra delante del docente,
 * lo cierra el colegio otro día. Dos planos quietos, encadenados.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO ES EL DE LA APLICACIÓN
 *
 * La casilla guarda al perder el foco (`(blur)`) y sin espera: un POST por falta. Del clic fuera al
 * botón nuevo y al aviso va la ida y vuelta, medio segundo (15 fotogramas). No hay lote aquí.
 */

export const FPS = 30;

/* La misma llegada que `LLEGADA_CORTA` de la planilla, con los viajes más cortos. */
export const LLEGADA: TiemposDeLlegada = {
	cursorEntra: 14,
	llegaAcademico: 40,
	pulsaAcademico: 46,
	abreAcademico: 48,
	llegaMisAsignaturas: 95,
	pulsaMisAsignaturas: 105,
	montaLista: 109,
	llegaBoton: 230,
	pulsaBoton: 245,
	cursorSale: 259,
	seVaLaCascara: 263,
	entraLaPlanilla: 303,
};
export const ENTRA = LLEGADA.entraLaPlanilla;

/** La ida y vuelta del POST de la falta. */
export const IDA_Y_VUELTA = 15;

/* ── Acto 2, en fotogramas locales de la planilla ─────────────────────────────────────────── */

const anotacion = (fila: number, cual: 'ausencias' | 'tardanzas', pulsa: number, suelta: number): Anotacion => ({
	fila, cual, pulsa, teclea: pulsa + 18, suelta, vuelve: suelta + IDA_Y_VUELTA,
});

export const ANOTACIONES: Anotacion[] = [
	anotacion(TOMAS, 'ausencias', 210, 303),
	anotacion(MARIANA, 'tardanzas', 466, 514),
];

export const PLANILLA = {
	cursorEntra: 120,
	/** Donde se hace el clic de fuera: la franja del título, que no es nada. */
	sale: 680,
	cursorSale: 670,
};

/* ── Acto 3: el segundo plano ─────────────────────────────────────────────────────────────── */

export const ENTRA_CERRADA = ENTRA + PLANILLA.sale + 60;

export const CERRADA = {
	cursorEntra: 130,
	pulsaAus: 230,
	pulsaBoton: 270,
	cursorSale: 370,
};

/** El ritmo de la planilla: sin tecleos ni lote (aquí no se califica). */
export const RITMO_ASISTENCIA: Ritmo = { ...RITMO_AYUDA, TECLEOS: [], CONFIRMA: 100000, SALIDA: PLANILLA.sale };
export const RITMO_CERRADA: Ritmo = { ...RITMO_AYUDA, TECLEOS: [], CONFIRMA: 100000, SALIDA: 100000 };

/** Los avisos de la aplicación: «Ausencia del 28 sep anotada». Dura 2,5 s, como allí. */
export const AVISOS = ANOTACIONES.map((a) => ({
	desde: ENTRA + a.vuelve,
	texto: `${a.cual === 'ausencias' ? 'Ausencia' : 'Tardanza'} del ${HOY.aviso} anotada`,
}));
export const AVISO_DURA = 75;

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

export const FOCOS = {
	...FOCOS_LLEGADA,
	columnas: fotograma(GEOMETRIA, columnasDeFaltas(GEOMETRIA)),
	ausDeTomas: fotograma(GEOMETRIA, GEOMETRIA.celda(TOMAS, 'ausencias')),
	tardDeMariana: fotograma(GEOMETRIA, GEOMETRIA.celda(MARIANA, 'tardanzas')),
	botonDeTomas: fotograma(GEOMETRIA, botonDe(GEOMETRIA, TOMAS, 'ausencias', 0)),
	aviso: fotograma(GEOMETRIA_CERRADA, { ...GEOMETRIA_CERRADA.encima, alto: ENCIMA_CERRADA - 18 }),
	columnasCerradas: fotograma(GEOMETRIA_CERRADA, columnasDeFaltas(GEOMETRIA_CERRADA)),
};

export const PUNTOS = {
	ausDeTomas: cuentaDe(GEOMETRIA, TOMAS, 'ausencias'),
	tardDeMariana: cuentaDe(GEOMETRIA, MARIANA, 'tardanzas'),
	botonDeTomas: botonDe(GEOMETRIA, TOMAS, 'ausencias', 0),
	ausCerrada: cuentaDe(GEOMETRIA_CERRADA, TOMAS, 'ausencias'),
	botonCerrado: botonDe(GEOMETRIA_CERRADA, VALENTINA, 'ausencias', 0),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_LA_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };

const L = (f: number) => ENTRA + f;
const M = (f: number) => ENTRA_CERRADA + f;
const [DE_TOMAS, DE_MARIANA] = ANOTACIONES;

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'La asistencia se pasa en la planilla, desde Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 156, texto: 'En la fila de 9°B, el segundo botón: Planilla.', voz: 'En la fila de noveno B, el segundo botón: Planilla.', ...EN_LA_LISTA, foco: FOCOS.botonPlanilla, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: L(20), texto: 'Aus y Tard: las faltas del periodo, un botón por fecha.', voz: 'Ausencias y tardanzas del periodo, con un botón por fecha.', ...EN_LA_PLANILLA, foco: FOCOS.columnas },
	{ desde: L(165), texto: 'Tomás no vino hoy: su Aus pasa de 0 a 1.', voz: 'Tomás no vino hoy: sus ausencias pasan de cero a uno.', ...EN_LA_PLANILLA, foco: FOCOS.ausDeTomas, focoHasta: DE_TOMAS.pulsa + ENTRA - 10 },
	{ desde: L(303), texto: 'Al salir de la casilla se guarda, con la fecha de hoy.', ...EN_LA_PLANILLA },
	{ desde: L(436), texto: 'Una tardanza, igual: Mariana llegó tarde, 1 en Tard.', voz: 'Una tardanza, igual: Mariana llegó tarde.', ...EN_LA_PLANILLA, foco: FOCOS.tardDeMariana, focoHasta: DE_MARIANA.pulsa + ENTRA - 10 },
	{ desde: L(570), texto: 'Cada botón es una falta: ahí se corrige su fecha o se borra.', ...EN_LA_PLANILLA, foco: FOCOS.botonDeTomas, focoHasta: L(PLANILLA.sale - 12) },
	{ desde: M(20), texto: 'Con el periodo cerrado, la planilla lo avisa y no deja anotar.', ...EN_LA_PLANILLA, foco: FOCOS.aviso },
	{ desde: M(161), texto: 'Aus y Tard se apagan con las notas: es el mismo candado.', voz: 'Ausencias y tardanzas se apagan con las notas: es el mismo candado.', ...EN_LA_PLANILLA, foco: FOCOS.columnasCerradas, focoHasta: M(CERRADA.pulsaAus - 16) },
];

export const TARJETA = M(323);
export const DURACION = TARJETA + 120;

export const CLAVE = 'docente-asistencia';

export const TITULO = 'Pasar asistencia desde la planilla';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la planilla' },
	{ desde: L(20), titulo: 'Aus y Tard: el número y las fechas' },
	{ desde: L(165), titulo: 'Anotar una ausencia y una tardanza' },
	{ desde: M(20), titulo: 'Periodo cerrado: el mismo candado' },
];

export const CIERRE: Cierre = {
	hiciste: 'Anotaste una ausencia y una tardanza desde la planilla.',
	seVe: `Sale «Ausencia del ${HOY.aviso} anotada» y un botón nuevo con la fecha.`,
	despues: 'Con el periodo cerrado no se anota: el periodo lo reabre el colegio.',
	voz: 'El periodo cerrado lo reabre el colegio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* ── Las puertas propias ──────────────────────────────────────────────────────────────────── */

/* El paso que dice «se guarda» empieza antes de que el foco salga de la casilla, y el aviso cae dentro. */
if (!(PASOS[4].desde <= ENTRA + DE_TOMAS.suelta && AVISOS[0].desde < PASOS[5].desde)) {
	throw new Error('Guion: el paso 5 no está puesto sobre el guardado de la ausencia de Tomás.');
}
/* La tardanza vuelve mientras la explica su paso. */
if (!(AVISOS[1].desde >= PASOS[5].desde && AVISOS[1].desde < PASOS[6].desde)) {
	throw new Error('Guion: el aviso de la tardanza cae fuera de su paso.');
}
/* La planilla del primer plano se ha ido entera antes de montar la segunda. */
if (ENTRA + PLANILLA.sale + 46 > ENTRA_CERRADA) {
	throw new Error('Guion: la segunda planilla se monta antes de que la primera acabe de irse.');
}
