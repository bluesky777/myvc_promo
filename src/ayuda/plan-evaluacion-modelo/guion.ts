import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, focoDelMenu, puntoDelMenu } from '../el-ano/Aplicacion';
import { rectPestanaPlan } from '../el-ano/plan';
import { MAIN } from '../montar-el-ano/planoAsignaturas';
import { COMPETENCIAS, PONDERADO, aviso, pestanas, rectCabeceraTarjeta, rectConsecuencia, rectTarjeta } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «PLAN DE EVALUACIÓN: EL MODELO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     Cambiarlo no borra ni recalcula nada; y es del año.
 *
 * Las dos frases están escritas en la propia pantalla, debajo de las tarjetas (`modelo.html`), y
 * el vídeo las enseña ahí. Lo que la pantalla NO dice y el vídeo sí: que **no pregunta** --el radio
 * llama a `elegir()` y guarda sin confirmación (`modelo.ts:282-301`)--, y que la pestaña ③
 * Competencias aparece y desaparece con el modelo (`plan-evaluacion.ts:351-378`).
 *
 * Precondición, en su cartel: la pestaña ① sólo sale si el colegio tiene la migración
 * (`modelo_evaluacion` en la fila del año, `plan-evaluacion.ts:199`). Si no sale, no es un permiso.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   Referencias -> Plan de evaluación (abre en ①)
 *     2. LOS DOS      Ponderado y Por competencias, con su ejemplo
 *     3. CAMBIARLO    un clic, aviso, sale la ③; lo que no pasa, y que es del año
 *     4. VOLVER       Ponderado otra vez: la ③ se va
 */

export const FPS = 30;

export const T = {
	cursorEntra: 20,
	llegaReferencias: 50,
	pulsaReferencias: 56,
	abreReferencias: 58,
	llegaEntrada: 100,
	pulsaEntrada: 110,
	monta: 114,

	llegaCompetencias: 464,
	pulsaCompetencias: 482,
	/** El PUT vuelve: aviso, marca «✓ Competencias» y la ③. */
	aCompetencias: 498,

	llegaPonderado: 950,
	pulsaPonderado: 968,
	aPonderado: 984,
	cursorSale: 1035,
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu('Referencias'),
	plan: puntoDelMenu('Referencias', 'Plan de evaluación'),
	competencias: centro(rectCabeceraTarjeta(COMPETENCIAS)),
	ponderado: centro(rectCabeceraTarjeta(PONDERADO)),
};

const P0 = pestanas(PONDERADO);
const P1 = pestanas(COMPETENCIAS);

export const FOCOS = {
	referencias: focoDelMenu('Referencias'),
	pestanaModelo: alFotograma(rectPestanaPlan(P0, 'modelo'), 6, 8),
	tarjetas: alFotograma({ x: MAIN.x, y: rectTarjeta(0).y, ancho: MAIN.ancho, alto: rectTarjeta(0).alto }, 8, 12),
	competencias: alFotograma(rectTarjeta(COMPETENCIAS), 8, 12),
	/** Las pestañas ① a ③ con competencias: la marca y la pestaña nueva. */
	pestanas: alFotograma(
		(() => {
			const a = rectPestanaPlan(P1, 'modelo');
			const c = rectPestanaPlan(P1, 'competencias');
			return { x: a.x, y: a.y, ancho: c.x + c.ancho - a.x, alto: a.alto };
		})(),
		6,
		8,
	),
	uno: alFotograma(rectConsecuencia(1), 8, 8),
	dos: alFotograma(rectConsecuencia(2), 8, 8),
	ponderado: alFotograma(rectTarjeta(PONDERADO), 8, 12),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Plan de evaluación ▸ Modelo', url: '/plan-evaluacion' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Referencias, Plan de evaluación, pestaña Modelo.', ...EN_EL_MENU, foco: FOCOS.referencias, focoHasta: T.pulsaReferencias + 20 },
	{ desde: 160, texto: 'Si no sale, su colegio aún no tiene esta versión.', ...AQUI, foco: FOCOS.pestanaModelo },
	{ desde: 285, texto: 'Dos modelos; cada tarjeta enseña su planilla y su boletín.', ...AQUI, foco: FOCOS.tarjetas },
	{ desde: 436, texto: 'Un clic basta: no pregunta y se guarda al momento.', ...AQUI, foco: FOCOS.competencias },
	{ desde: 566, texto: 'Sale la pestaña Competencias; la marca dice el modelo.', ...AQUI, foco: FOCOS.pestanas },
	{ desde: 708, texto: 'Cambiarlo no borra ni recalcula nada.', ...AQUI, foco: FOCOS.uno },
	{ desde: 810, texto: 'Y es del año: los demás conservan el suyo.', ...AQUI, foco: FOCOS.dos },
	{ desde: 930, texto: 'Para volver, se elige Ponderado otra vez.', ...AQUI, foco: FOCOS.ponderado },
];

export const AVISO_1 = { desde: T.aCompetencias, dura: 150, texto: aviso(COMPETENCIAS) };
/* Cinco segundos en la aplicación; aquí lo corta la tarjeta del final. */
export const AVISO_2 = { desde: T.aPonderado, dura: 100, texto: aviso(PONDERADO) };

export const TARJETA = 1046;
export const DURACION = TARJETA + 120;

export const CLAVE = 'plan-evaluacion-modelo';
export const TITULO = 'Plan de evaluación: el modelo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Plan de evaluación' },
	{ desde: 285, titulo: 'Los dos modelos' },
	{ desde: 436, titulo: 'Cambiarlo: qué pasa y qué no' },
	{ desde: 930, titulo: 'Volver atrás' },
];

export const CIERRE: Cierre = {
	hiciste: 'Pasaste el modelo de 2026 a Por competencias y lo devolviste a Ponderado.',
	seVe: 'En la marca de la pestaña Modelo: «✓ Ponderado» o «✓ Competencias».',
	despues: 'Siguiente: la plantilla de notas.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.pulsaCompetencias < PASOS[3].desde || T.aCompetencias >= PASOS[4].desde) {
	throw new Error('Guion: el clic en «Por competencias» no cae en el paso que dice que no pregunta.');
}
if (T.pulsaPonderado < PASOS[7].desde) {
	throw new Error('Guion: se vuelve a Ponderado antes del paso que lo cuenta.');
}
