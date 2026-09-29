import { BANDA } from '../encuadre';
import { SECCIONES, Seccion, entradaDe } from '../medidas';
import { DESEMPENOS, DESEMPENOS_DEL_COLEGIO, MIS_CLASES } from '../competencias/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «MIS DESEMPEÑOS», Y DÓNDE CAE.
 *
 * DESDE EL 26 SEP 2026 LA PANTALLA SE LLAMA «MIS COMPETENCIAS» (`/mis-competencias`; la dirección
 * vieja `/mis-desempenos` redirige, por los favoritos) y así se llama también la entrada del menú
 * (`cascara/menu/menu.ts`). El vídeo conserva la clave `mis-desempenos`, que es la del catálogo, y
 * lo dice en su primer rótulo. El menú es el del docente de `medidas.ts`, que ya la trae así.
 *
 * LAS FILAS SON LAS DEL VÍDEO DE COMPETENCIAS (`competencias/datos.ts`), en sintagma nominal, y el
 * bloque de la coordinación con candado. Aquí se edita la primera y se añade una tercera.
 */

export const MENU: Seccion[] = SECCIONES;
export const ACADEMICO = entradaDe(MENU, 'Académico').seccion;
export const MIS_COMPETENCIAS = entradaDe(MENU, 'Académico', 'Mis competencias').hija!;

export const CLASES = MIS_CLASES;
export const LA_CLASE = 0;

export const FILAS = DESEMPENOS.map((d) => d.texto);
export const DEL_COLEGIO = DESEMPENOS_DEL_COLEGIO.map((d) => d.texto);

/** Lo que se le añade a la primera al editarla, y la fila nueva. */
export const AGREGADO = ' y su pendiente';
export const NUEVA = 'el planteamiento de ecuaciones a partir de un problema';

export const TEXTOS = {
	titulo: 'Mis competencias',
	entradilla: 'Lo que va a salir en el boletín de tus clases. Son las mismas filas que escribe la coordinación: lo que cambies aquí lo ve ella, y lo que ella escriba lo ves tú.',
	grupo: 'Grupo',
	todos: 'Todos los grupos',
	vacio: 'Elige una de tus clases, arriba, para ver las competencias de este periodo.',
	periodos: 'Competencias del periodo',
	donde: 'Matemáticas · Noveno · periodo 2',
	placeholder: 'Escribe una competencia para Matemáticas en Noveno…',
	marca: 'marca (opcional)',
	anadir: 'Añadir',
	guardar: 'Guardar',
	cancelar: 'Cancelar',
	comunes: 'Del plan de área · todos los grados',
	comunesNota: 'Estas competencias las escribe la coordinación para toda la materia, y se suman a las tuyas en el boletín del alumno. Aquí se ven y no se editan.',
};

/** Cuántas hay en cada periodo de 9. MAT: el 2 lleva las dos de la lista. */
export const POR_PERIODO = [3, 2, 0, 0];

/* ═══ LA GEOMETRÍA, en coordenadas del PANEL ═════════════════════════════════════════════════ */

export const PG = {
	ancho: 1500,
	relleno: 36,
	letra: 21,
	titulo: 44,
	entradilla: 62,
	hueco: 16,
	tira: 44,
	periodos: 48,
	donde: 32,
	fila: 56,
	huecoFila: 6,
	edicion: 150,
	nuevo: 120,
	comunesTitulo: 34,
	comunesNota: 60,
	comun: 48,
};
export const UTIL = PG.ancho - PG.relleno * 2;

export function plano(o: { conClase: boolean; filas: number; editando: boolean }) {
	let y = PG.relleno;
	const titulo = y; y += PG.titulo + 8;
	const entradilla = y; y += PG.entradilla + PG.hueco;
	const tira = y; y += PG.tira + PG.hueco;
	const periodos = y; if (o.conClase) { y += PG.periodos + PG.hueco; }
	const donde = y; if (o.conClase) { y += PG.donde + 8; }
	const lista = y;
	const filas: number[] = [];
	for (let i = 0; i < o.filas; i++) {
		filas.push(y);
		y += (o.editando && i === 0 ? PG.edicion : PG.fila) + PG.huecoFila;
	}
	y += 8;
	const nuevo = y; y += PG.nuevo + PG.hueco + 6;
	const comunes = y; y += PG.comunesTitulo + PG.comunesNota + DEL_COLEGIO.length * PG.comun + PG.relleno;
	return { titulo, entradilla, tira, periodos, donde, lista, filas, nuevo, comunes, alto: y };
}

export const ALTO_PANEL = plano({ conClase: true, filas: 3, editando: true }).alto;

export const ENCUADRE = (() => {
	const escala = Math.min((BANDA.alto - 24) / ALTO_PANEL, (1920 - 160) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - ALTO_PANEL * escala) / 2 };
})();

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };
export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

export const ANCHO_CLASE = 118;
export const ANCHO_PERIODO = 64;
export const X_PERIODOS = PG.relleno + 270;
