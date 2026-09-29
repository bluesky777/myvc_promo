import { MEDIDAS, MENU_DOCENTE_HOY } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { alFotograma, centro, holgura, rectDeEntrada, union } from '../moverse/comun';
import { LA_DE_9A, geometriaDeLaFila } from '../mis-asignaturas/datos';
import { EL_QUE_FALTA, EL_QUE_SOBRA, Estado, enLaCascara, piezas } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «UNIDADES E INDICADORES: EL 100 %» (serie docente, ola 1). En pantalla, «Logros» e «Indicadores»:
 * son las palabras que pone el colegio (`comunes/vocabulario.ts`), y el vídeo lo dice una vez.
 *
 * LA DUDA QUE MATA: **suman en dos niveles**, y **«sobra 50%» al abrir es un dato, no una avería**:
 * es la cuenta de lo que hay escrito, y se arregla corrigiendo un porcentaje.
 *
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA       menú -> Académico -> Mis asignaturas -> «Logros» en la fila de 9°A
 *     2. PRIMER NIVEL     los tres Logros suman 150: «sobra 50%». Se corrige el 80 -> 30
 *     3. SEGUNDO NIVEL    dentro del primer Logro, 40 + 40: «falta 20%». Se añade el quiz
 *     4. CUADRADO         ningún cartel
 *
 * EL RITMO: guardar y añadir son una petición cada uno; medio segundo (15 fotogramas) entre el clic
 * y que la lista cambie. **No hay mensaje de éxito**: la lista se actualiza callada
 * (`unidades.ts:618-744`), y el vídeo lo dice porque es justo lo que hace dudar.
 */

export const FPS = 30;
export const IDA_Y_VUELTA = 15;
export const MENU = MENU_DOCENTE_HOY;

export const T = {
	cursorEntra: 4,
	llegaAcademico: 28,
	pulsaAcademico: 34,
	abreAcademico: 36,
	llegaMisAsignaturas: 90,
	pulsaMisAsignaturas: 98,
	montaLista: 102,
	llegaLogros: 244,
	pulsaLogros: 262,
	montaUnidades: 270,
	llegaEditar: 470,
	pulsaEditar: 480,
	llegaPorc3: 500,
	pulsaPorc3: 508,
	pulsaPorc3b: 514,
	teclea3: 526,
	porTecla: 5,
	llegaGuardar: 575,
	pulsaGuardar: 590,
	llegaTexto1: 1010,
	pulsaTexto1: 1018,
	tecleaQuiz: 1030,
	llegaPorc1: 1062,
	pulsaPorc1: 1070,
	teclea20: 1082,
	llegaAnadir: 1100,
	pulsaAnadir: 1112,
	cursorSale: 1160,
};

export const VUELVE = { guardar: T.pulsaGuardar + IDA_Y_VUELTA, anadir: T.pulsaAnadir + IDA_Y_VUELTA };

/** El estado de la pantalla en cada fotograma: cambia cuando vuelve el servidor, no al pulsar. */
export function estado(frame: number): Estado {
	return {
		porcentaje3: frame >= VUELVE.guardar ? EL_QUE_SOBRA.despues : EL_QUE_SOBRA.antes,
		editando3: frame >= T.pulsaEditar && frame < VUELVE.guardar,
		anadido: frame >= VUELVE.anadir,
	};
}

const tecleado = (palabra: string, desde: number, frame: number) =>
	frame < desde ? '' : palabra.slice(0, Math.min(palabra.length, Math.floor((frame - desde) / T.porTecla) + 1));

/** Lo que se ve en el porcentaje del Logro en edición, y en el formulario de añadir. */
export function tecleo(frame: number) {
	const valor3 = frame < T.teclea3 ? String(EL_QUE_SOBRA.antes) : tecleado(String(EL_QUE_SOBRA.despues), T.teclea3, frame);
	const nuevoTexto = frame >= VUELVE.anadir ? '' : tecleado(EL_QUE_FALTA.definicion, T.tecleaQuiz, frame);
	const nuevoPorc = frame >= VUELVE.anadir ? '' : tecleado(String(EL_QUE_FALTA.porcentaje), T.teclea20, frame);
	const foco = frame >= T.pulsaTexto1 && frame < T.pulsaPorc1 ? 'texto' as const : frame >= T.pulsaPorc1 && frame < T.pulsaAnadir ? 'porc' as const : null;
	return {
		edicion: { valor: valor3, foco: frame >= T.pulsaPorc3 },
		nuevo: { texto: nuevoTexto, porc: nuevoPorc, foco },
	};
}

/* ── Dónde cae cada cosa ──────────────────────────────────────────────────────────────────── */

const ANTES = estado(0);
const EDITANDO = estado(T.pulsaEditar);
const CUADRADO_ARRIBA = estado(VUELVE.guardar);
const p0 = piezas(ANTES);
const pE = piezas(EDITANDO);
const pC = piezas(CUADRADO_ARRIBA);
const fila9A = geometriaDeLaFila(LA_DE_9A);

export const FOCOS = {
	academico: alFotograma(rectDeEntrada(MENU, 'Académico'), 6),
	etiquetas9A: alFotograma(holgura(union(fila9A.avisos[0], fila9A.avisos[1]), 6), 8),
	cabecera: alFotograma(p0.cabecera, 8),
	porcentajes: alFotograma(p0.porcentajes, 8),
	aviso: alFotograma(holgura(p0.aviso, 4), 8),
	logro3: alFotograma(holgura(enLaCascara(p0.g[EL_QUE_SOBRA.logro].fila), 3), 8),
	bloque1: alFotograma(holgura(pC.bloque1, 4), 8),
	lista: alFotograma(holgura(union(enLaCascara(pC.g[0].fila), enLaCascara(pC.g[2].anadir)), 6), 10),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	academico: { x: 130, y: centro(rectDeEntrada(MENU, 'Académico')).y },
	misAsignaturas: { x: 130, y: centro(rectDeEntrada(MENU, 'Académico', 'Mis asignaturas')).y },
	logros9A: centro(fila9A.botones[0]),
	reposo: { x: 1000, y: 820 },
	editar3: centro(p0.editar3),
	porc3: centro(pE.porc3),
	guardar3: centro(pE.guardar3),
	texto1: { x: pC.texto1.x + 60, y: centro(pC.texto1).y },
	porc1: { x: pC.porc1.x + 40, y: centro(pC.porc1).y },
	anadir1: centro(pC.anadir1),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const AQUI = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Logros', url: '/unidades/1231' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Abre Académico y entra en Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: T.pulsaAcademico + 16 },
	{ desde: 130, texto: 'En 9°A, las etiquetas avisan que algo no suma 100.', voz: 'En noveno A, las etiquetas avisan que algo no suma cien.', ...EN_LA_LISTA, foco: FOCOS.etiquetas9A, focoHasta: T.llegaLogros - 8 },
	{ desde: 286, texto: 'Los Logros del periodo suman 100; el cartel dice cuánto sobra.', voz: 'Los Logros del periodo suman cien; el cartel dice cuánto sobra.', ...AQUI, foco: FOCOS.porcentajes },
	{ desde: 435, texto: 'Sobraba: 80 en vez de 30. Se corrige y Guardar.', voz: 'Sobraba: ochenta en vez de treinta. Se corrige y Guardar.', ...AQUI, foco: FOCOS.logro3 },
	{ desde: VUELVE.guardar, texto: 'Sin mensaje: el cartel rojo se va.', ...AQUI },
	/* Las dos advertencias de ADVERTENCIAS-AYUDA.md para esta pantalla. */
	{ desde: 715, texto: 'Fija los pesos antes de calificar: cambiarlos recalcula las definitivas.', ...AQUI },
	{ desde: 882, texto: 'Los Indicadores de cada Logro también suman 100.', voz: 'Los Indicadores de cada Logro también suman cien.', ...AQUI, foco: FOCOS.bloque1 },
	{ desde: 997, texto: 'Aquí falta 20: se añade el que faltaba.', voz: 'Aquí falta veinte: se añade el que faltaba.', ...AQUI, foco: FOCOS.bloque1 },
	{ desde: VUELVE.anadir, texto: 'Todo suma 100: no queda ningún cartel.', voz: 'Todo suma cien: no queda ningún cartel.', ...AQUI, foco: FOCOS.lista },
	{ desde: 1240, texto: 'No borres un Indicador con notas; si pasa, restáuralo de la papelera.', ...AQUI },
];

export const TARJETA = 1411;
export const DURACION = TARJETA + 100;

export const CLAVE = 'unidades-100';
export const TITULO = 'Unidades e indicadores: el 100 %';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Mis asignaturas, botón Logros' },
	{ desde: PASOS[2].desde, titulo: 'Los Logros suman 100' },
	{ desde: PASOS[3].desde, titulo: 'Corregir un porcentaje' },
	{ desde: PASOS[6].desde, titulo: 'Los Indicadores de cada Logro suman 100' },
];

export const CIERRE: Cierre = {
	hiciste: 'Cuadraste al 100 % los Logros de 9°A y los Indicadores de cada uno.',
	seVe: 'En Logros no queda ningún cartel; en Mis asignaturas, la fila sin marco rojo.',
	despues: 'Siguiente: la planilla, teclear y que quede guardado.',
	voz: 'Siguiente: la planilla.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Lo que cambia en la pantalla cae donde empieza el paso que lo explica. */
if (PASOS[4].desde !== VUELVE.guardar || PASOS[8].desde !== VUELVE.anadir) {
	throw new Error('Guion: la lista cambia y el paso que lo explica no empieza ahí.');
}
if (T.pulsaEditar < PASOS[3].desde || T.pulsaTexto1 < PASOS[7].desde) {
	throw new Error('Guion: un clic cae antes del paso que lo anuncia.');
}
