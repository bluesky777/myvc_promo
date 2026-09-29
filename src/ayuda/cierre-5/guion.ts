import { ACADEMICO, MEDIDAS, SECCIONES, alturaDeEntrada, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import {
	ANO_MATEMATICAS_9B, EL_GRUPO, GRUPO_9B_ID, LA_QUE_SE_RECUPERA, RECUPERACION_VALENTINA, VALENTINA,
	rectanguloDeGuardar, rectanguloDeLaFila, rectanguloDelAno, rectanguloDelCampo, rectanguloDelGrupo, rectanguloDeLaTabla,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 5 DE 8: «RECUPERACIÓN DEL AÑO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **La recuperación no pisa la nota del año.** La columna «Del año» es la definitiva de los
 *        cuatro periodos y aquí no es un campo: la recuperación se guarda aparte
 *        (`recuperacion_final`), y la del año se queda en su 57 después de guardar.
 *     2. **Se guarda con botón, no al dejar de teclear**, porque esta nota decide si el estudiante
 *        promociona (`recuperacion-anual.html`, «CON BOTÓN Y NO AL DEJAR DE TECLEAR»). El botón sólo
 *        aparece cuando hay algo distinto que guardar.
 *
 * La precondición va en su propio paso, el segundo: el docente sólo escribe si el colegio le deja
 * nivelar (`profes_pueden_nivelar`); si no, la pantalla sale con «Este periodo está bloqueado para
 * nivelar» y sólo se puede mirar.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA    menú → Académico → Recuperación del año
 *     2. EL GRUPO      sin grupo la pantalla es la botonera; se pulsa 9°B y la dirección cambia
 *     3. LA TABLA      una cabecera por alumno, una fila por asignatura perdida del año
 *     4. GUARDAR       se escribe 70, aparece «Guardar», se pulsa, vuelve el aviso
 *
 * EL RITMO. La carga del grupo es una sola llamada de ~1,4 MB (`recuperacion-anual.ts`); aquí se
 * enseña «Trayendo lo perdido del año…» un segundo y pico, sin afirmar cuánto tarda. El guardado
 * es un PUT: medio segundo de ida y vuelta, como en `cierre-1`, con el giro de `nzLoading` en el
 * botón mientras tanto. El aviso sale donde empieza el paso que lo explica (la puerta de abajo).
 */

export const FPS = 30;

/*
 * LOS TIEMPOS SE ENCADENAN SOLOS (2026-09-29, con voz): cada paso empieza cuando el anterior terminó
 * de decirse (`dura()`, la misma cuenta que la puerta) y los clics cuelgan de los pasos.
 */
type Texto = { texto: string; voz?: string; rojo?: boolean };

const T: Texto[] = [
	{ texto: 'Ve a Académico, Recuperación del año.' },
	{ texto: 'Sólo se escribe si el colegio deja nivelar.' },
	{ texto: 'Elige el grupo. Aquí, 9°B.', voz: 'Elige el grupo. Aquí, noveno B.' },
	{ texto: 'Sale una fila por cada asignatura perdida del año.' },
	{ texto: '«Del año» es la definitiva, y aquí no cambia.' },
	{ texto: 'Escribe la recuperación al lado.' },
	{ texto: 'Guarda con el botón: esta nota decide si promociona.' },
	{ texto: 'Sale el aviso, y la fila dice Guardada.' },
];

const dura = (t: Texto): number => {
	/* Como la puerta: con `tools/voz.mjs` cargando el guion, la voz todavía no manda. */
	const voz = (globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ ? null : segundosDeVoz(t.voz ?? t.texto);
	return (voz === null ? fotogramasDeLectura(t.texto, FPS) : RETRASO_VOZ + Math.ceil(voz * FPS) + RESPIRO_VOZ) + (t.rojo ? FPS : 0);
};

export const LLEGADA = {
	cursorEntra: 12,
	llegaAcademico: 30,
	pulsaAcademico: 36,
	abreAcademico: 38,
	llegaEntrada: 62,
	pulsaEntrada: 72,
	montaPantalla: 76,
};

const D: number[] = [];
D[0] = 8;
D[1] = Math.max(D[0] + dura(T[0]), LLEGADA.montaPantalla + 20);
D[2] = D[1] + dura(T[1]);

export const GRUPO = {
	llega: D[2] + 16,
	pulsa: D[2] + 24,
	/** Lo que se ve «Trayendo…» antes de que llegue la tabla. */
	tabla: D[2] + 54,
};

D[3] = Math.max(D[2] + dura(T[2]), GRUPO.tabla + 14);
D[4] = D[3] + dura(T[3]);
D[5] = D[4] + dura(T[4]);

const llegaCasilla = D[5] + 14;
const pulsaCasilla = llegaCasilla + 6;
const empieza = pulsaCasilla + 14;
const porTecla = 5;

D[6] = Math.max(D[5] + dura(T[5]), empieza + RECUPERACION_VALENTINA.length * porTecla + 6);

const IDA_Y_VUELTA = 15;
/** El clic en Guardar cae al final de su paso: el aviso sale donde empieza el siguiente. */
const pulsaGuardar = D[6] + dura(T[6]) - IDA_Y_VUELTA;
export const VUELVE = pulsaGuardar + IDA_Y_VUELTA;

export const ESCRIBE = {
	llegaCasilla,
	pulsaCasilla,
	empieza,
	porTecla,
	llegaGuardar: pulsaGuardar - 12,
	pulsaGuardar,
	cursorSale: VUELVE + 40,
};

D[7] = VUELVE;
export const TARJETA = D[7] + dura(T[7]);

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const SIN_GRUPO = { ubicacion: 'Menú ▸ Académico ▸ Recuperación del año', url: '/recuperacion-anual' };
const CON_GRUPO = { ubicacion: 'Menú ▸ Académico ▸ Recuperación del año', url: `/recuperacion-anual/${GRUPO_9B_ID}` };

export const LA_ENTRADA = entradaDe(SECCIONES, 'Académico', 'Recuperación del año').hija!;

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const { alumno: A, fila: F } = LA_QUE_SE_RECUPERA;

export const FOCOS = {
	academico: enElFotograma({ x: 0, y: alturaDeEntrada(ACADEMICO, null, false), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	grupo: enElFotograma(rectanguloDelGrupo(EL_GRUPO)),
	tabla: enElFotograma(rectanguloDeLaTabla()),
	ano: enElFotograma(rectanguloDelAno()),
	fila: enElFotograma(rectanguloDeLaFila(A, F)),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	laEntrada: { x: 150, y: alturaDeEntrada(ACADEMICO, LA_ENTRADA, true) + MEDIDAS.hija / 2 },
	grupo: centro(rectanguloDelGrupo(EL_GRUPO)),
	campo: centro(rectanguloDelCampo(A, F)),
	guardar: centro(rectanguloDeGuardar(A, F)),
};

export const NOTA_DEL_ANO = ANO_MATEMATICAS_9B[VALENTINA].ano;

const DONDE: Pick<Paso, 'ubicacion' | 'url' | 'foco' | 'focoHasta'>[] = [
	{ ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ ...SIN_GRUPO },
	{ ...SIN_GRUPO, foco: FOCOS.grupo, focoHasta: GRUPO.pulsa + 14 },
	{ ...CON_GRUPO, foco: FOCOS.tabla },
	{ ...CON_GRUPO, foco: FOCOS.ano },
	{ ...CON_GRUPO, foco: FOCOS.fila },
	{ ...CON_GRUPO, foco: FOCOS.fila },
	{ ...CON_GRUPO, foco: FOCOS.fila },
];

export const PASOS: Paso[] = T.map((t, i) => ({ desde: D[i], ...t, ...DONDE[i] }));

/** El aviso se queda mientras su paso lo cuenta, y se va con el rojo. */
export const AVISO_DURA = TARJETA - VUELVE;

export const CLAVE = 'cierre-5-recuperacion';
export const TITULO = 'Recuperación del año';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Académico, Recuperación del año' },
	{ desde: LLEGADA.montaPantalla, titulo: 'Elegir el grupo' },
	{ desde: GRUPO.tabla, titulo: 'Lo perdido del año, por alumno' },
	{ desde: ESCRIBE.pulsaCasilla, titulo: 'Escribir la nota y guardar con el botón' },
];

export const CIERRE: Cierre = {
	hiciste: 'Registraste una recuperación del año, con su botón Guardar.',
	seVe: `Sale «Recuperación de Matemáticas guardada: ${RECUPERACION_VALENTINA}.», y la del año sigue en ${NOTA_DEL_ANO}.`,
	despues: 'Siguiente, 6 de 8: definitivas y promovidos.',
};

const VOZ_TARJETA = segundosDeVoz(CIERRE.despues!);
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El aviso sale donde empieza el paso que lo explica, y el clic cae dentro del paso del botón. */
if (PASOS[7].desde !== VUELVE) {
	throw new Error(`Guion: el aviso sale en ${VUELVE} y su paso empieza en ${PASOS[7].desde}.`);
}
if (ESCRIBE.pulsaGuardar < PASOS[6].desde) {
	throw new Error('Guion: se pulsa Guardar antes de que el rótulo diga por qué es con botón.');
}
/* La del año tiene que salir perdida, o no estaría en esta pantalla. */
if (NOTA_DEL_ANO >= 60) {
	throw new Error(`Guion: Matemáticas de Valentina sale ${NOTA_DEL_ANO} en el año, y en esta lista sólo sale lo perdido.`);
}
