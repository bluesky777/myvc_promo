import { geometriaDePlanilla, planillaEnElFotograma } from '../../notas/Escena';
import { BANDA } from '../encuadre';
import { SUBE_LA_PANTALLA } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «BOLETÍN INDEPENDIENTE», Y DÓNDE CAE.
 *
 * LA PUERTA ES LA PLANILLA: cuando algún estudiante del grupo lleva boletín aparte en el periodo,
 * la planilla lo avisa arriba (`avisoDeIndependientes`) y ese aviso trae el único enlace a la
 * pantalla, «Ver y calificar sus boletines aparte». No hay entrada de menú.
 *
 * JULIANA NO ESTÁ ENTRE LOS SEIS DE LA PLANILLA, Y ESO ES LO QUE SE ENSEÑA: lleva boletín aparte,
 * así que no sale en esa lista. Es inventada (en 9°B no había nadie que desapareciera de la
 * planilla de los otros vídeos). Su boletín ya está montado --un logro, dos evidencias-- y le falta
 * una nota. Las palabras de la tarjeta son las de app2, que aquí dicen «unidad» y «subunidad» a
 * secas (`resumenDeEstructura`).
 *
 * EL INTERRUPTOR «APARTE» LO MUEVE LA SECRETARÍA: al docente el servidor le contesta 403 y la
 * pantalla apaga los interruptores y pone el aviso (`noPuedoMarcar`), sin mensaje flotante.
 */

export const ALUMNA = { nombre: 'Gaitán Rueda Juliana', sexo: 'mujer' as const };
export const LOGRO = 'Álgebra';
export const EVIDENCIAS = [
	{ definicion: 'Taller adaptado', nota: '70' },
	{ definicion: 'Sustentación oral', nota: '' },
];
export const NUEVA_NOTA = '75';

export const TEXTOS = {
	avisoPlanilla: 'Un estudiante de este grupo lleva boletín aparte en este periodo, así que no sale en esta lista.',
	verQuienes: 'Ver quiénes son y cómo van',
	enlace: 'Ver y calificar sus boletines aparte',
	titulo: 'Boletín independiente',
	deQuien: 'Matemáticas · Noveno B',
	aparte: 'Aparte',
	noPuedo: 'Marcar o quitar el boletín aparte no se hace desde aquí',
	noPuedoDetalle: 'Lo cambian la secretaría, la rectoría o un administrador, desde la ficha del estudiante. Las unidades y las notas de esta pantalla sí son tuyas.',
	copiarDe: 'Copiar de…',
	toast: 'Nota guardada',
	resumen: (puestas: number) => `1 unidad · 2 subunidades · ${puestas} de 2 notas puestas`,
};

/* ═══ LA PLANILLA CON EL AVISO (coordenadas del panel de la planilla) ═════════════════════════ */

export const ENCIMA = 118;
export const GEOMETRIA = geometriaDePlanilla({ encima: ENCIMA });
export const AJUSTE = { escala: 0.76, y: SUBE_LA_PANTALLA };
export const enPlanilla = (r: { x: number; y: number; ancho: number; alto: number }) => planillaEnElFotograma(GEOMETRIA, r, AJUSTE);
export const CAJA_AVISO = { ...GEOMETRIA.encima, alto: ENCIMA - 18 };
/** El enlace va en la segunda línea del aviso, detrás de «Ver quiénes son y cómo van». */
export const ENLACE = { x: CAJA_AVISO.x + 60 + 290, y: CAJA_AVISO.y + 58, ancho: 380, alto: 34 };

/* ═══ LA PÁGINA, a pantalla completa (coordenadas del PANEL) ══════════════════════════════════ */

export const PG = { ancho: 1400, relleno: 36, letra: 22, titulo: 44, linea: 34, hueco: 16, alerta: 96, cabecera: 70, unidad: 44, evidencia: 58 };
export const UTIL = PG.ancho - PG.relleno * 2;

export function plano(conAviso: boolean) {
	let y = PG.relleno;
	const titulo = y; y += PG.titulo + 6;
	const deQuien = y; y += PG.linea;
	const queEs = y; y += PG.linea + PG.hueco;
	const alerta = y; if (conAviso) { y += PG.alerta + PG.hueco; }
	const tarjeta = y;
	const cabecera = y + 16;
	const unidad = cabecera + PG.cabecera + 12;
	const evidencias = unidad + PG.unidad;
	y = evidencias + EVIDENCIAS.length * PG.evidencia + 24;
	return { titulo, deQuien, queEs, alerta, tarjeta, cabecera, unidad, evidencias, finTarjeta: y, alto: y + PG.relleno };
}
export const ALTO_PANEL = plano(true).alto;

export const ENCUADRE = (() => {
	const escala = Math.min(1.1, (BANDA.alto - 24) / ALTO_PANEL, (1920 - 160) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - ALTO_PANEL * escala) / 2 };
})();

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };
export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

/* Las piezas de la cabecera de la tarjeta, de izquierda a derecha. */
export const X = { foto: PG.relleno + 20, nombre: PG.relleno + 78, interruptor: PG.relleno + 400, suma: PG.relleno + 520 };
export const ANCHO_COPIAR = 150;
export const rectInterruptor = (conAviso: boolean): Rect => ({ x: X.interruptor, y: plano(conAviso).cabecera + (PG.cabecera - 30) / 2, ancho: 96, alto: 30 });
export const rectCopiar = (conAviso: boolean): Rect => ({ x: PG.relleno + UTIL - 20 - ANCHO_COPIAR, y: plano(conAviso).cabecera + (PG.cabecera - 44) / 2, ancho: ANCHO_COPIAR, alto: 44 });
export const rectNota = (i: number, conAviso: boolean): Rect => ({ x: PG.relleno + UTIL - 20 - 120, y: plano(conAviso).evidencias + i * PG.evidencia + (PG.evidencia - 44) / 2, ancho: 120, alto: 44 });
export const rectTarjeta = (conAviso: boolean): Rect => { const p = plano(conAviso); return { x: PG.relleno, y: p.tarjeta, ancho: UTIL, alto: p.finTarjeta - p.tarjeta }; };
export const rectAlerta = (): Rect => ({ x: PG.relleno, y: plano(true).alerta, ancho: UTIL, alto: PG.alerta });
