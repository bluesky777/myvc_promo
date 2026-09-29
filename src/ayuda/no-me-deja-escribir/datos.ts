import { MANDOS } from '../BarraDeHoy';
import { ALUMNOS, COLUMNAS } from '../../notas/planilla';
import { geometriaDePlanilla, planillaEnElFotograma } from '../../notas/Escena';
import { MEDIDAS } from '../medidas';
import { SUBE_LA_PANTALLA } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «NO ME DEJA ESCRIBIR», Y DÓNDE CAE.
 *
 * LA PLANILLA ES LA DE 9°B QUE DEJÓ `planilla-teclear` (Mateo 92, Samuel 78, Valentina 55 en el
 * quiz), sin tocar una nota: este vídeo no escribe nada, que es justo de lo que va.
 *
 * LOS CUATRO AVISOS SON LOS DE app2, letra por letra (`paginas/notas/planilla-notas.ts`,
 * `avisoDePeriodo`, con `numero_periodo` = 2). Salen de las dos banderas del periodo --notas y
 * asistencia, y nivelar-- y de si quien mira es administrador:
 *
 *     notas   nivelar   quien      aviso
 *     0       0         docente    «El periodo 2 está cerrado: …»                 (tramo Cerrado)
 *     0       1         docente    «Semana de nivelaciones del periodo 2: …»      (tramo Nivelando)
 *     1       0         docente    «El periodo 2 está cerrado para nivelar: …»    (tramo Calificando)
 *     0       0         admin      «El periodo 2 está cerrado. Pero como administrador, …»
 *
 * Las casillas se apagan con la bandera de notas (`puedeEditarNotas`, y `periodoAbierto` para Aus y
 * Tard), salvo al administrador, que sí escribe.
 */

/*
 * LOS TRES AVISOS DE HOY (app2, 2026-09-29). Los tramos del periodo son Calificando, + nivelando,
 * Nivelando y Cerrado: «cerrado para nivelar» ya no existe. El docente ve el aviso azul arriba.
 */
export type Caso = 'cerrado' | 'nivelando' | 'admin';

export const AVISOS: Record<Caso, string> = {
	cerrado: 'El periodo 2 está cerrado: no puedes poner notas, ni asistencia, ni nivelar.',
	nivelando:
		'Semana de nivelaciones del periodo 2: no puedes poner notas ni asistencia, pero sí puedes nivelar lo perdido y cambiar las definitivas.',
	admin: 'El periodo 2 está cerrado. Pero como administrador, tú sí puedes editarlo.',
};

/** Debajo del aviso, la casilla «Modo nivelación». Con el periodo cerrado sale apagada y con este texto. */
export const MODO_NIVELACION = {
	etiqueta: 'Modo nivelación',
	bloqueado: 'Este periodo está bloqueado para nivelar. Lo abre el colegio, periodo por periodo.',
};

export const ESCRIBE: Record<Caso, boolean> = { cerrado: false, nivelando: false, admin: true };

/* ── La geometría ─────────────────────────────────────────────────────────────────────────── */

/** El aviso encima de la tabla: cabe en dos renglones, que es lo que ocupa el más largo. */
export const ENCIMA = 146;

export const GEOMETRIA = geometriaDePlanilla({ encima: ENCIMA });

export const AJUSTE = { escala: 0.75, y: SUBE_LA_PANTALLA };

export const fotograma = (r: { x: number; y: number; ancho: number; alto: number }) => planillaEnElFotograma(GEOMETRIA, r, AJUSTE);

/** La caja del aviso, en coordenadas del panel. */
export const CAJA_AVISO = { ...GEOMETRIA.encima, alto: 82 };
/** La fila de «Modo nivelación», debajo del aviso. */
export const FILA_MODO = { ...GEOMETRIA.encima, y: GEOMETRIA.encima.y + 90, alto: 40 };

/** La casilla que se pincha sin resultado: el quiz de Mateo, el 92 de `planilla-teclear`. */
export const MATEO = ALUMNOS.findIndex((a) => a.nombre.startsWith('Rojas Valencia'));
export const QUIZ = COLUMNAS.indexOf('Quiz');

/* EL SELECTOR DE AÑO Y PERIODO DE LA BARRA, en coordenadas de la cáscara: el de la barra de hoy. */
export const SELECTOR = MANDOS.selector;
