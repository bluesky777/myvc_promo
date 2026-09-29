import { ALTO_CONTROL } from '../montar-el-ano/ant';
import { MAIN, type Rect } from '../comun-directivo/lugar';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «VOTACIONES»: LO QUE SE VE Y DÓNDE CAE CADA MANDO.
 *
 * Dos pantallas de `paginas/votaciones`: `config` (una elección a la vez, en dos columnas, desde el
 * rediseño del 22 sep) y `candidatos`. Los textos son los de sus plantillas. Las elecciones, los
 * cargos, los candidatos y el censo son inventados; las caras, el avatar dibujado.
 */

const DERECHA = MAIN.x + MAIN.ancho;
const ARRIBA = MAIN.y;

/* ════════════════════════════ CONFIGURAR ════════════════════════════ */

export const ELECCIONES = ['Personero y contralor 2026', 'Simulacro de votación'];
/** Al entrar está elegida la del simulacro, que es la que tenía la marca del año. */
export const AL_ENTRAR = 1;
export const LA_BUENA = 0;

export const CONFIG = {
	recargar: { x: DERECHA - 156 - 8 - 116, y: ARRIBA + 4, ancho: 116, alto: ALTO_CONTROL },
	nueva: { x: DERECHA - 156, y: ARRIBA + 4, ancho: 156, alto: ALTO_CONTROL },
	selector: { x: MAIN.x, y: ARRIBA + 52, ancho: 340, alto: ALTO_CONTROL },
	etiquetas: { x: MAIN.x + 352, y: ARRIBA + 52, ancho: 190, alto: ALTO_CONTROL },
	izquierda: { x: MAIN.x, ancho: 600 },
	derecha: { x: MAIN.x + 640, ancho: MAIN.ancho - 640 },
	arriba: ARRIBA + 108,
};

export const rectOpcionEleccion = (i: number): Rect => ({ x: CONFIG.selector.x + 4, y: CONFIG.selector.y + ALTO_CONTROL + 8 + i * 34, ancho: CONFIG.selector.ancho - 8, alto: 34 });

/** Las alturas del bloque «El evento», de arriba abajo. */
export const EVENTO = {
	titulo: CONFIG.arriba,
	nombre: CONFIG.arriba + 40,
	fechas: CONFIG.arriba + 106,
	pista: CONFIG.arriba + 172,
	interruptores: CONFIG.arriba + 222,
};

export type Clave = 'actual' | 'in_action' | 'can_see_results' | 'locked';

export const INTERRUPTORES: { clave: Clave; etiqueta: string; pista: string; alto: number }[] = [
	{ clave: 'actual', etiqueta: 'Es la votación del año', pista: 'Encenderla apaga la marca en tus demás elecciones de este año.', alto: 58 },
	{ clave: 'in_action', etiqueta: 'Abierta ahora mismo', pista: 'Apagarla durante la jornada corta la votación: nadie puede votar.', alto: 58 },
	{
		clave: 'can_see_results', etiqueta: 'Los resultados están publicados', alto: 78,
		pista: 'Apagado, los números los ve sólo quien puede publicarlos: rectoría, coordinación y quien creó la elección. Encendido, los ve todo el colegio.',
	},
	{ clave: 'locked', etiqueta: 'Bloqueada', pista: 'Pausa la elección entera.', alto: 58 },
];

export function rectInterruptor(clave: Clave, conPista = true): Rect {
	let y = EVENTO.interruptores;
	for (const i of INTERRUPTORES) {
		if (i.clave === clave) { return { x: CONFIG.izquierda.x, y, ancho: conPista ? CONFIG.izquierda.ancho : 300, alto: conPista ? i.alto - 10 : 24 }; }
		y += i.alto;
	}
	throw new Error(`Votaciones: no hay interruptor «${clave}».`);
}

/** El interruptor mismo, para el puntero. */
export const rectPalanca = (clave: Clave): Rect => { const r = rectInterruptor(clave, false); return { x: r.x, y: r.y + 3, ancho: 32, alto: 18 }; };

export const rectInterruptores = (): Rect => ({ x: CONFIG.izquierda.x, y: EVENTO.interruptores, ancho: CONFIG.izquierda.ancho, alto: INTERRUPTORES.reduce((n, i) => n + i.alto, 0) - 10 });

export const CARGOS_Y = EVENTO.interruptores + INTERRUPTORES.reduce((n, i) => n + i.alto, 0) + 14;

export const CARGOS = [
	{ abrev: 'PER', nombre: 'Personero', candidatos: 3 },
	{ abrev: 'CON', nombre: 'Contralor', candidatos: 2 },
];

export interface Eleccion { nombre: string; abre: string; cierra: string; actual: boolean; in_action: boolean }

export const ESTAMENTOS = [
	{ nombre: 'Estudiantes', n: 486, vota: true },
	{ nombre: 'Docentes', n: 31, vota: true },
	{ nombre: 'Administrativos', n: 12, vota: false },
	{ nombre: 'Acudientes', n: 402, vota: false },
];

export const GRADOS = [
	{ nombre: 'Transición', n: 24, mesa: true },
	{ nombre: 'Primero', n: 31, mesa: true },
	{ nombre: 'Segundo', n: 29, mesa: false },
	{ nombre: 'Tercero', n: 33, mesa: false },
	{ nombre: 'Cuarto', n: 30, mesa: false },
	{ nombre: 'Quinto', n: 28, mesa: false },
];

/* ════════════════════════════ CANDIDATOS ════════════════════════════ */

export interface Candidato { nombre: string; grupo: string; numero: number; tipo: 'mujer' | 'hombre'; variante: number }

export const PERSONEROS: Candidato[] = [
	{ nombre: 'Valentina Rojas Mantilla', grupo: '11°A', numero: 1, tipo: 'mujer', variante: 3 },
	{ nombre: 'Samuel David Quintero Jaimes', grupo: '11°B', numero: 2, tipo: 'hombre', variante: 5 },
	{ nombre: 'Mariana Isabel Peñaranda Soto', grupo: '10°A', numero: 3, tipo: 'mujer', variante: 1 },
];

export const CANDIDATOS = {
	subtitulo: { x: MAIN.x, y: ARRIBA + 42, ancho: 620, alto: 24 },
	segmentado: { x: MAIN.x, y: ARRIBA + 84, ancho: 180, alto: ALTO_CONTROL },
	izquierda: { x: MAIN.x, ancho: 660 },
	derecha: { x: MAIN.x + 684, ancho: MAIN.ancho - 684 },
	arriba: ARRIBA + 136,
	tarjeta: { ancho: 206, alto: 244, hueco: 14 },
};

export const rectTarjetaCandidato = (i: number): Rect => ({
	x: CANDIDATOS.izquierda.x + i * (CANDIDATOS.tarjeta.ancho + CANDIDATOS.tarjeta.hueco),
	y: CANDIDATOS.arriba + 76,
	ancho: CANDIDATOS.tarjeta.ancho,
	alto: CANDIDATOS.tarjeta.alto,
});

export const rectTarjetas = (): Rect => {
	const a = rectTarjetaCandidato(0);
	const b = rectTarjetaCandidato(PERSONEROS.length - 1);
	return { x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: a.alto };
};

/** El formulario «Inscribir a alguien», y dentro, el apartado de la foto. */
export const INSCRIBIR = { relleno: 16, titulo: 34, etiqueta: 30, campo: ALTO_CONTROL, extra: 22, hueco: 12, foto: 104 };

export const rectInscribir = (): Rect => ({ x: CANDIDATOS.derecha.x, y: CANDIDATOS.arriba, ancho: CANDIDATOS.derecha.ancho, alto: 482 });

export const rectFoto = (): Rect => {
	const i = INSCRIBIR;
	const y = CANDIDATOS.arriba + i.relleno + i.titulo + (i.etiqueta + i.campo + i.hueco) + (i.etiqueta + i.campo + i.extra + i.hueco) * 2;
	return { x: CANDIDATOS.derecha.x + i.relleno, y, ancho: CANDIDATOS.derecha.ancho - i.relleno * 2, alto: i.foto };
};
