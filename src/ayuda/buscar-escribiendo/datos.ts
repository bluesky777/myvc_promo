import { ALUMNOS } from '../../notas/planilla';
import { Rect } from '../moverse/comun';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL BUSCADOR MÁGICO, y lo que contesta a cada cosa que se escribe en el vídeo.
 *
 * Todo sale de `app2/src/app/cascara/buscador/` (`buscador.html`, `buscador.ts`, `indice.ts`) y de
 * los sinónimos de `cascara/menu/menu.ts` y `informes/catalogo/impresos.ts`:
 *
 *   - se abre con «/» o con Ctrl K (o Cmd K), **salvo si estás escribiendo en una casilla**
 *     (`buscador.ts:821-833` y `escribiendo()`, `:1003-1009`);
 *   - busca pantallas del menú, informes y personas; las personas desde 3 letras y en todos los
 *     años (`todos_anios: true`);
 *   - **por sinónimos que no salen escritos en ninguna pantalla**: «fallas» es sinónimo de
 *     «Asistencias» (`menu.ts:918`) y de «Ver ausencias» (`impresos.ts:480`); «reprobadas», de
 *     «Notas perdidas» (`menu.ts:679`) y de tres informes de notas perdidas;
 *   - ↑ ↓ mueven, Intro abre, Esc cierra (`buscador.ts:882-901`).
 *
 * LAS PERSONAS SON INVENTADAS: dos son de la planilla de 9°B (`notas/planilla.ts`), que es el grupo
 * de todos los vídeos del docente, y la tercera no sale en ningún otro vídeo.
 */

export const PLACEHOLDER = 'Escribe el nombre de una pantalla, un informe o una persona';
export const PIE = 'Muévete con ↑ ↓ y abre con Intro.';

export type Icono = 'reloj' | 'baja' | 'informe' | 'grupo';

export interface Fila {
	nombre: string;
	pista?: string;
	icono?: Icono;
	/** Una cara: `[tipo, variante]` del avatar dibujado. */
	cara?: ['mujer' | 'hombre', number];
	/** Filas que fijan un contexto (un grupo) en vez de navegar: dicen «Elegir». */
	elegir?: boolean;
}

export interface Parte {
	/** El subtítulo de la parte (la sección del menú, la familia del informe), o nada. */
	titulo?: string;
	filas: Fila[];
}

export interface Bloque {
	titulo: string;
	cuenta: number;
	partes: Parte[];
}

/** Sin escribir nada: los grupos del docente («Los grupos sí, sin escribir nada», `buscador.ts:580`). */
export const SIN_ESCRIBIR: Bloque[] = [
	{
		titulo: 'Tus grupos',
		cuenta: 4,
		/* La pista de cada grupo es `pistaDeGrupo()` (`cascara/buscador/contexto.ts:122-125`). */
		partes: [{
			filas: [
				['Octavo A', 'le das 1 asignatura'],
				['Noveno A', 'le das 1 asignatura'],
				['Noveno B', 'Eres titular · le das 1 asignatura'],
				['Décimo A', 'le das 1 asignatura'],
			].map(([g, pista]) => ({ nombre: g, pista, icono: 'grupo' as const, elegir: true })),
		}],
	},
];

export const FALLAS: Bloque[] = [
	{ titulo: 'Pantallas', cuenta: 1, partes: [{ titulo: 'Disciplina', filas: [{ nombre: 'Asistencias', pista: '/asistencias', icono: 'reloj' }] }] },
	{
		titulo: 'Informes',
		cuenta: 1,
		partes: [{ titulo: 'Quién vino', filas: [{ nombre: 'Ver ausencias', pista: 'Las faltas registradas, tal como las manda la app móvil.', icono: 'informe' }] }],
	},
];

const VALENTINA = ALUMNOS.find((a) => a.nombre.includes('Valentina'))!;
const MATEO = ALUMNOS.find((a) => a.nombre.includes('Valencia'))!;

export const VALEN: Bloque[] = [
	{
		titulo: 'Personas',
		cuenta: 3,
		partes: [
			{
				filas: [
					{ nombre: VALENTINA.nombre, pista: 'alumno', cara: ['mujer', 4] },
					{ nombre: MATEO.nombre, pista: 'alumno', cara: ['hombre', 1] },
					{ nombre: 'Valencia Ortiz, Juliana', pista: 'alumno', cara: ['mujer', 6] },
				],
			},
		],
	},
];

export const REPROBADAS: Bloque[] = [
	{ titulo: 'Pantallas', cuenta: 1, partes: [{ titulo: 'Académico', filas: [{ nombre: 'Notas perdidas', pista: '/notas-perdidas', icono: 'baja' }] }] },
	{
		titulo: 'Informes',
		cuenta: 3,
		partes: [
			{ titulo: 'Para la familia', filas: [{ nombre: 'Notas perdidas del año', pista: 'Sólo lo que va perdido, para avisar en casa.', icono: 'informe' }] },
			{
				titulo: 'Cómo va el grupo',
				filas: [
					{ nombre: 'Notas perdidas del profesor', pista: 'Lo que va perdido en las asignaturas de un docente.', icono: 'informe' },
					{ nombre: 'Notas perdidas de todos', pista: 'El colegio entero. Es el papel de la comisión de evaluación.', icono: 'informe' },
				],
			},
		],
	},
];

/* ── Geometría del cuadro, en coordenadas de la cáscara ───────────────────────────────────── */

export const B = {
	x: 330,
	y: 92,
	ancho: 780,
	entrada: 66,
	titulo: 34,
	seccion: 28,
	fila: 58,
	pie: 46,
	relleno: 10,
};

/** Lo que mide el cuadro con esos bloques. */
export function altoDelCuadro(bloques: Bloque[] | null): number {
	if (!bloques || bloques.length === 0) { return B.entrada + 64; }
	let h = B.entrada + B.relleno;
	bloques.forEach((b) => {
		h += B.titulo;
		b.partes.forEach((p) => { h += (p.titulo ? B.seccion : 0) + p.filas.length * B.fila; });
	});
	return h + B.relleno + B.pie;
}

/** La fila n-ésima (contando todas, en orden), en coordenadas de la cáscara. */
export function rectDeFila(bloques: Bloque[], n: number): Rect {
	let y = B.y + B.entrada + B.relleno;
	let i = 0;
	for (const b of bloques) {
		y += B.titulo;
		for (const p of b.partes) {
			if (p.titulo) { y += B.seccion; }
			for (let k = 0; k < p.filas.length; k++) {
				if (i === n) { return { x: B.x + 8, y, ancho: B.ancho - 16, alto: B.fila, radio: 8 }; }
				y += B.fila;
				i++;
			}
		}
	}
	throw new Error(`Buscador: no hay fila ${n}.`);
}

export const rectDeLaEntrada = (): Rect => ({ x: B.x, y: B.y, ancho: B.ancho, alto: B.entrada, radio: 12 });
export const rectDelCuadro = (bloques: Bloque[] | null): Rect => ({ x: B.x, y: B.y, ancho: B.ancho, alto: altoDelCuadro(bloques), radio: 12 });
export const rectDelPie = (bloques: Bloque[]): Rect => ({ x: B.x, y: B.y + altoDelCuadro(bloques) - B.pie, ancho: B.ancho, alto: B.pie, radio: 10 });
