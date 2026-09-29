import { VOCABULARIO } from '../../comunes/vocabulario';
import { MEDIDAS } from '../medidas';
import { MIGAS_ALTO, Miga, Rect } from '../moverse/comun';
import { FILAS, LA_DE_9A } from '../mis-asignaturas/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «LOGROS» (la ruta `unidades/:asignatura_id`) DE MATEMÁTICAS DE 9°A, Y DÓNDE CAE CADA COSA.
 *
 * Sale de `app2/src/app/paginas/unidades/unidades.html` y `.ts`:
 *
 *   - el título es el bloque del grupo y «materia — grupo — docente»; debajo, «Ir a la planilla de
 *     notas», «Rúbricas» y «Copiar a otra asignatura»;
 *   - «Crear nuevo Logro»: definición, «Porcentaje» y «Crear Logro»;
 *   - **LAS DOS PUERTAS DEL 100 %**, con la misma frase: arriba de la lista, la suma de los Logros
 *     del periodo (`unidades.ts:547-549`); debajo de cada Logro, la de sus Indicadores
 *     (`:551-553`). Si sobra, rojo: «Porcentaje incorrecto: sobra 50%»; si falta, ámbar:
 *     «Porcentaje incorrecto: falta 20%» (`unidades.html:188-190` y `:314-316`). Sin espacio antes
 *     del «%». Cuando suma 100 no se pinta nada;
 *   - guardar, crear y borrar **no sacan ningún aviso**: la lista se actualiza callada
 *     (`unidades.ts:618-744`). Lo único que dice que salió bien es que el cartel se va.
 *
 * LOS NÚMEROS ESTÁN HECHOS PARA LAS DOS PUERTAS: 40 + 30 + 80 = 150 (sobra 50: el 80 debía ser 30),
 * y dentro del primer Logro 40 + 40 = 80 (falta 20: el quiz no se había creado). Es la fila de 9°A
 * de `mis-asignaturas`, con sus dos etiquetas: «Logros sin sumar 100» y «Logros con Indicadores
 * incorrectos».
 */

const U = VOCABULARIO.unidad;
const S = VOCABULARIO.subunidad;

export const ASIGNATURA = { ...FILAS[LA_DE_9A], docente: 'Ana María Herrera Lugo' };

export const TEXTOS = {
	titulo: `${ASIGNATURA.materia} — ${ASIGNATURA.nombreGrupo} — ${ASIGNATURA.docente}`,
	acciones: ['Ir a la planilla de notas', 'Rúbricas', 'Copiar a otra asignatura'],
	crear: `Crear nuevo ${U}`,
	placeholderCrear: `Escriba aquí su nuevo ${U}`,
	porcentaje: 'Porcentaje',
	botonCrear: `Crear ${U}`,
	placeholderNueva: `Escribe nuevo ${S}`,
	porcentajeNueva: '%Porcentaje',
	botonNueva: `Añadir ${S}`,
	sobra: (n: number) => `Porcentaje incorrecto: sobra ${n}%`,
	falta: (n: number) => `Porcentaje incorrecto: falta ${n}%`,
};

export interface Indicador { definicion: string; porcentaje: number }
export interface Logro { definicion: string; porcentaje: number; indicadores: Indicador[] }

export const LOGROS: Logro[] = [
	{
		definicion: 'Resuelve ecuaciones lineales en problemas cotidianos',
		porcentaje: 40,
		indicadores: [{ definicion: 'Taller de ecuaciones', porcentaje: 40 }, { definicion: 'Examen escrito', porcentaje: 40 }],
	},
	{
		definicion: 'Interpreta sistemas de dos ecuaciones',
		porcentaje: 30,
		indicadores: [{ definicion: 'Quiz de sistemas', porcentaje: 50 }, { definicion: 'Exposición en grupo', porcentaje: 50 }],
	},
	{
		definicion: 'Argumenta por escrito sus procedimientos',
		porcentaje: 80,
		indicadores: [{ definicion: 'Bitácora de clase', porcentaje: 100 }],
	},
];

/** El que estaba mal y lo que se le pone. */
export const EL_QUE_SOBRA = { logro: 2, antes: 80, despues: 30 };
/** El Indicador que faltaba en el primer Logro. */
export const EL_QUE_FALTA = { logro: 0, definicion: 'Quiz', porcentaje: 20 };

export const MIGAS_LOGROS: Miga[] = [
	{ etiqueta: 'Panel', enlace: true },
	{ etiqueta: 'Académico', enlace: false },
	{ etiqueta: 'Mis asignaturas', enlace: true },
	{ etiqueta: VOCABULARIO.unidades, enlace: false },
];

/* ── Geometría, en coordenadas de la pantalla de dentro ───────────────────────────────────── */

export const G = {
	lados: 32,
	arriba: 6,
	cabecera: 60,
	acciones: 46,
	crear: 104,
	aviso: 40,
	logro: 46,
	avisoLogro: 38,
	indicador: 38,
	anadir: 48,
	entreLogros: 10,
	sangria: 46,
};

export const ANCHO = MEDIDAS.ancho - MEDIDAS.menu;
const X = G.lados;
const ANCHO_LISTA = ANCHO - G.lados * 2;

export interface Estado {
	/** El porcentaje del tercer Logro ya guardado. */
	porcentaje3: number;
	/** Si el tercer Logro está en edición. */
	editando3: boolean;
	/** Si ya se añadió el Indicador que faltaba. */
	anadido: boolean;
}

/** El porcentaje de un Logro con el estado aplicado (sólo el tercero de 9°A cambia). */
export const porcentajeDe = (i: number, e: Estado, logros = LOGROS) => (logros === LOGROS && i === EL_QUE_SOBRA.logro ? e.porcentaje3 : logros[i].porcentaje);
export const sumaDeLogros = (e: Estado, logros = LOGROS) => logros.reduce((n, _l, i) => n + porcentajeDe(i, e, logros), 0);
export const indicadoresDe = (i: number, e: Estado, logros = LOGROS): Indicador[] =>
	logros === LOGROS && i === EL_QUE_FALTA.logro && e.anadido ? [...LOGROS[i].indicadores, { definicion: EL_QUE_FALTA.definicion, porcentaje: EL_QUE_FALTA.porcentaje }] : logros[i].indicadores;
export const sumaDeIndicadores = (i: number, e: Estado, logros = LOGROS) => indicadoresDe(i, e, logros).reduce((n, s) => n + s.porcentaje, 0);

export const arribaDeLaCabecera = () => G.arriba + MIGAS_ALTO;
export const arribaDeCrear = () => arribaDeLaCabecera() + G.cabecera + G.acciones;
export const arribaDelAviso = () => arribaDeCrear() + G.crear + 8;

/** Dónde empieza la lista: debajo del aviso de arriba si se pinta, o donde estaría. */
export const arribaDeLaLista = (e: Estado, logros = LOGROS) => arribaDelAviso() + (sumaDeLogros(e, logros) !== 100 ? G.aviso : 0);

export function geometria(e: Estado, logros = LOGROS) {
	let y = arribaDeLaLista(e, logros);
	return logros.map((_l, i) => {
		const fila: Rect = { x: X, y, ancho: ANCHO_LISTA, alto: G.logro, radio: 6 };
		y += G.logro;
		const suma = sumaDeIndicadores(i, e, logros);
		const aviso: Rect | null = suma !== 100 && indicadoresDe(i, e, logros).length > 0 ? { x: X + G.sangria, y, ancho: 330, alto: G.avisoLogro - 8, radio: 6 } : null;
		if (aviso) { y += G.avisoLogro; }
		const indicadores: Rect[] = indicadoresDe(i, e, logros).map(() => {
			const r = { x: X + G.sangria, y, ancho: ANCHO_LISTA - G.sangria, alto: G.indicador, radio: 6 };
			y += G.indicador;
			return r;
		});
		const anadir: Rect = { x: X + G.sangria, y, ancho: ANCHO_LISTA - G.sangria, alto: G.anadir, radio: 6 };
		y += G.anadir + G.entreLogros;
		const bloque: Rect = { x: X, y: fila.y, ancho: ANCHO_LISTA, alto: y - G.entreLogros - fila.y, radio: 8 };
		return { fila, aviso, indicadores, anadir, bloque };
	});
}

/* Las piezas de cada fila, medidas desde la derecha para que el foco sepa dónde están. */
export const PORCENTAJE = { derecha: 150, ancho: 64 };
export const ICONOS = { editar: 96, eliminar: 56, chevron: 136, tam: 34 };
/** Los campos del formulario de añadir, desde su izquierda. */
export const ANADIR = { texto: 420, porc: 130, boton: 170, hueco: 10 };

/** Un rectángulo de la pantalla de dentro, en la cáscara. */
export const enLaCascara = (r: Rect): Rect => ({ ...r, x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra });

/** El Logro en edición: la definición, el porcentaje, «Cancelar» y «Guardar», desde el asa. */
export const EDICION = { inicio: 26, texto: 560, porc: 90, cancelar: 104, guardar: 100, hueco: 10 };

/** Las piezas que el guion señala, en coordenadas de la CÁSCARA. */
export function piezas(e: Estado) {
	const g = geometria(e);
	const f3 = g[EL_QUE_SOBRA.logro].fila;
	const a1 = g[EL_QUE_FALTA.logro].anadir;
	const x0 = f3.x + EDICION.inicio;
	const enC = (r: Rect) => enLaCascara(r);
	return {
		g,
		editar3: enC({ x: f3.x + f3.ancho - ICONOS.editar, y: f3.y + (G.logro - ICONOS.tam) / 2, ancho: ICONOS.tam, alto: ICONOS.tam, radio: 17 }),
		porc3: enC({ x: x0 + EDICION.texto + EDICION.hueco, y: f3.y + 5, ancho: EDICION.porc, alto: 36, radio: 6 }),
		guardar3: enC({ x: x0 + EDICION.texto + EDICION.porc + EDICION.cancelar + EDICION.hueco * 3, y: f3.y + 5, ancho: EDICION.guardar, alto: 36, radio: 6 }),
		texto1: enC({ x: a1.x, y: a1.y + 6, ancho: ANADIR.texto, alto: 36, radio: 6 }),
		porc1: enC({ x: a1.x + ANADIR.texto + ANADIR.hueco, y: a1.y + 6, ancho: ANADIR.porc, alto: 36, radio: 6 }),
		anadir1: enC({ x: a1.x + ANADIR.texto + ANADIR.porc + ANADIR.hueco * 2, y: a1.y + 6, ancho: ANADIR.boton, alto: 36, radio: 6 }),
		/** Los porcentajes de los tres Logros, de arriba abajo. */
		porcentajes: enC({ x: g[0].fila.x + g[0].fila.ancho - PORCENTAJE.derecha - PORCENTAJE.ancho - 10, y: g[0].fila.y, ancho: PORCENTAJE.ancho + 20, alto: g[2].fila.y + G.logro - g[0].fila.y, radio: 8 }),
		aviso: enC({ x: G.lados, y: arribaDelAviso(), ancho: 330, alto: 30, radio: 6 }),
		bloque1: enC(g[EL_QUE_FALTA.logro].bloque),
		cabecera: enC({ x: G.lados, y: arribaDeLaCabecera(), ancho: 720, alto: G.cabecera, radio: 8 }),
	};
}
