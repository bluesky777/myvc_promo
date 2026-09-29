import { ALUMNOS, total } from '../../notas/planilla';
import { geometriaDePlanilla, planillaEnElFotograma } from '../../notas/Escena';
import { NOTAS_DE_PARTIDA } from '../planilla-nota-rapida/datos';
import { SUBE_LA_PANTALLA } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «TOTAL, REAL, M Y R», Y DÓNDE CAE.
 *
 * LA PLANILLA DE 9°B EN LA SEMANA DE NIVELACIONES, como la dejó `cierre-2`: el periodo 2 en
 * «Nivelando». Es el tramo en el que se ve lo que el vídeo cuenta, porque Real, M y R llevan
 * `[disabled]="!puedeNivelar()"` (`planilla-notas.html`): con nivelar cerrado --«Calificando»-- las
 * tres están apagadas. Las notas, al revés: apagadas, y el aviso de arriba lo dice.
 *
 * LAS REALES DE PARTIDA SON LAS DEL ÚLTIMO CÁLCULO: el promedio redondeado, sin M ni R, que es lo
 * que `cierre-1` enseña en Definitivas para el periodo 2. Se cambia la de Samuel (73 -> 75), y al
 * final se le quita la M: la Real se queda en 75 hasta el próximo recálculo, que es justo lo que el
 * último rótulo dice. No se toca a Valentina, que es la de la serie del cierre.
 */

export const AVISO_NIVELANDO =
	'Semana de nivelaciones del periodo 2: no puedes poner notas ni asistencia, pero sí puedes nivelar lo perdido y cambiar las definitivas.';

export const SAMUEL = ALUMNOS.findIndex((a) => a.nombre.startsWith('Delgado Peña'));

/** La Real de cada fila al abrir: el Total redondeado del último cálculo. */
export const REAL_DE_PARTIDA: string[] = NOTAS_DE_PARTIDA.map((n) => String(total(n) ?? ''));

/** Lo que se teclea en la Real de Samuel: dos retrocesos y el 75, una tecla cada 5 fotogramas. */
export const TECLAS = ['7', '', '7', '75'];
export const NUEVA = TECLAS[TECLAS.length - 1];

/* ── La geometría ─────────────────────────────────────────────────────────────────────────── */

export const ENCIMA = 100;
export const ANCHOS = { alumno: 360, nota: 128, total: 100, real: 116, marca: 58, falta: 76 };

export const GEOMETRIA = geometriaDePlanilla({ anchos: ANCHOS, encima: ENCIMA, definitivas: true });

export const AJUSTE = { escala: 0.74, y: SUBE_LA_PANTALLA };

export const fotograma = (r: { x: number; y: number; ancho: number; alto: number }) => planillaEnElFotograma(GEOMETRIA, r, AJUSTE);

export const CAJA_AVISO = { ...GEOMETRIA.encima, alto: ENCIMA - 18 };
