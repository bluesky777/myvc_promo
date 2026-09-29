import type { Rect } from '../el-ano/Aplicacion';
import { ANCHO_PANEL, CG, arribaDelCuerpo } from '../el-ano/colegio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL COLEGIO ▸ COMPROMISOS» (`/colegio/:yearId/compromisos`): LO QUE SE VE Y DÓNDE CAE.
 *
 * LO QUE ES DE LA APLICACIÓN (`colegio-compromisos.html` y `.ts`): el aviso azul de «todavía usa la
 * configuración por defecto» con su texto, los paneles «A quién se le propone» y «El plazo» con sus
 * etiquetas y ayudas, el «sin guardar», la barra de abajo y el aviso «Guardado el compromiso
 * académico de 2026.». Los valores son LOS DE FÁBRICA de verdad, los que pinta el servidor cuando
 * nadie ha guardado (`CompromisosConfigController::pintarConfig`): por áreas, corte 3, «Semana de
 * nivelaciones», 5 días y 5 días.
 *
 * LO INVENTADO: el id del año y que se baje el corte a 2.
 */

export const YEAR = 2026;
export const YEAR_ID = 14;

export const TEXTOS = {
	avisoTitulo: `${YEAR} todavía usa la configuración por defecto`,
	avisoTexto:
		'Nadie ha guardado esta pantalla para este año. Lo de abajo es lo que el sistema trae de fábrica, y es lo que se está imprimiendo. En cuanto guardes, queda como configuración del colegio y se heredará en enero.',
	quien: 'A quién se le propone',
	quienPista: ['Lo único de esta pestaña que decide ', { b: 'a qué alumnos' }, ' les sale compromiso. Todo lo demás cambia cómo se ve el papel.'],
	regla: 'Con qué se cuentan las perdidas',
	reglaAyuda: 'Por áreas, un alumno que pierde dos asignaturas de la misma área cuenta una sola vez.',
	corte: 'Desde cuántas perdidas',
	corteExtra: 'Tres es lo que ya marca en rojo la hoja de alumnos en riesgo del semáforo. Baja el número para proponer antes.',
	primaria: 'Parágrafo de primaria',
	primariaAyuda: 'En 1.º, 2.º y 3.º la promoción se juega sólo en dos materias, así que el compromiso se cuenta ahí con esas dos y no con todas.',
	plazo: 'El plazo',
	plazoPista: 'Los tres van impresos en el compromiso: son lo que el colegio promete por escrito.',
	papel: 'El papel',
	barra: `Hay cambios sin guardar en ${YEAR}`,
	guardar: 'Guardar los cambios',
	guardado: `Guardado el compromiso académico de ${YEAR}.`,
};

export type Trozo = string | { b: string };

export const PLAZO = [
	{ etiqueta: 'Cómo se llama el plazo en el papel', valor: 'Semana de nivelaciones', extra: 'Sale delante de la fecha límite. Cada colegio lo llama a su manera.', ancho: 0 },
	{ etiqueta: 'Cuántos días dura', valor: '5', extra: 'Desde que se entrega el compromiso. Es la fecha límite que ve el docente para dar su veredicto.', ancho: 90 },
	{ etiqueta: 'Días para reclamar el resultado', valor: '5', extra: 'Cuentan desde que se NOTIFICA el resultado, no desde que el docente lo escribe. Es la promesa que la familia puede exigir.', ancho: 90 },
];

export const CORTE_DE_FABRICA = '3';
export const CORTE_NUEVO = '2';

/* ── La geometría, en coordenadas del contenido ───────────────────────────────────────────── */

export const K = { aviso: 84, cabecera: 34, pista2: 44, regla: 106, corte: 100, primaria: 70, etiqueta: 24, control: 32, extra: 40, entre: 12 };
export const ANCHO_MEDIO = (ANCHO_PANEL - CG.hueco) / 2;

/** `aviso` 0..1: el aviso azul, que se pliega al guardar. */
export function disposicion(aviso: number) {
	const y0 = arribaDelCuerpo(0);
	const alerta: Rect = { x: CG.lado, y: y0, ancho: ANCHO_PANEL, alto: K.aviso * aviso };
	const fila1 = y0 + (K.aviso + CG.hueco) * aviso;
	const altoQuien = CG.relleno * 2 + K.cabecera + K.pista2 + K.regla + K.corte + K.primaria;
	const altoPlazo = CG.relleno * 2 + K.cabecera + 44 + 3 * (K.etiqueta + K.control + K.extra) + 2 * K.entre;
	const alto1 = Math.max(altoQuien, altoPlazo);
	const quien: Rect = { x: CG.lado, y: fila1, ancho: ANCHO_MEDIO, alto: alto1 };
	const plazo: Rect = { x: CG.lado + ANCHO_MEDIO + CG.hueco, y: fila1, ancho: ANCHO_MEDIO, alto: alto1 };
	const papel: Rect = { x: CG.lado, y: fila1 + alto1 + CG.hueco, ancho: ANCHO_PANEL, alto: 320 };
	return { alerta, quien, plazo, papel };
}

/** La casilla numérica de «Desde cuántas perdidas». */
export function rectCorte(aviso: number): Rect {
	const q = disposicion(aviso).quien;
	return { x: q.x + CG.relleno, y: q.y + CG.relleno + K.cabecera + K.pista2 + K.regla + K.etiqueta, ancho: 90, alto: K.control };
}

/** El campo entero (etiqueta, casilla y ayuda), para el foco. */
export function rectCampoCorte(aviso: number): Rect {
	const c = rectCorte(aviso);
	return { x: c.x, y: c.y - K.etiqueta, ancho: disposicion(aviso).quien.ancho - CG.relleno * 2, alto: K.etiqueta + K.control + K.extra };
}
