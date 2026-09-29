import type { Rect } from '../el-ano/Aplicacion';
import { disposicionPagina, rectBotonDePagina, rectCeldas, type BotonDePagina } from '../el-ano/pagina';
import { MAIN } from '../montar-el-ano/planoAsignaturas';
import type { Columna } from '../montar-el-ano/Rejilla';
import type { ClaveDocente } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ÁREAS, MATERIAS Y DIRECTORES»: LO QUE SE VE Y DÓNDE CAE.
 *
 * LO QUE ES DE LA APLICACIÓN: Materias con su panel «Ordenar» (`materias.html`: «Arrastra para
 * reordenar. Una materia soltada en otra área cambia de área.», cada área con sus materias al
 * lado), la rejilla con su columna «Área», que se actualiza al soltar SIN aviso
 * (`materias.ts:312-317`); Áreas con su botón «Directores de área»; y Directores de área entero
 * (`areas/directores/directores.html`): el subtítulo del año en curso, el aviso ámbar de los
 * heredados sin contrato, el resumen, las filas, «Sin contrato este año», «+ Asignar director», el
 * diálogo «Elige un docente» y el aviso «Director de área guardado».
 *
 * LO INVENTADO: las áreas, qué materia está en cuál, los ids y quién dirige qué. Las materias y los
 * docentes son los de `montar-el-ano/reparto.ts`; el director heredado sin contrato es un nombre
 * inventado aquí, que no sale en ningún otro vídeo porque ya no trabaja en el colegio.
 */

export interface Area { nombre: string; alias: string; materias: string[] }

export const AREAS: Area[] = [
	{ nombre: 'Matemáticas', alias: 'MAT', materias: ['Matemáticas', 'Estadística'] },
	{ nombre: 'Humanidades', alias: 'HUM', materias: ['Lengua Castellana', 'Inglés'] },
	{ nombre: 'Ciencias Naturales', alias: 'CNA', materias: ['Ciencias Naturales', 'Biología', 'Química'] },
	{ nombre: 'Ciencias Sociales', alias: 'SOC', materias: ['Ciencias Sociales', 'Cátedra de la Paz'] },
	{ nombre: 'Ética y Valores Humanos', alias: 'ETI', materias: ['Ética y Valores'] },
	{ nombre: 'Educación Artística', alias: 'ART', materias: ['Artística'] },
	{ nombre: 'Educación Física', alias: 'EDF', materias: ['Educación Física'] },
	{ nombre: 'Tecnología e Informática', alias: 'TEC', materias: ['Tecnología e Informática'] },
];

/** La que se mueve: «Cátedra de la Paz», de Ciencias Sociales a Ética y Valores Humanos. */
export const MOVIDA = 'Cátedra de la Paz';
export const DE = 3;
export const A = 4;

/** Después de soltar: la materia al final de la lista de Ética. */
export const AREAS_DESPUES: Area[] = AREAS.map((a, i) =>
	i === DE ? { ...a, materias: a.materias.filter((m) => m !== MOVIDA) } : i === A ? { ...a, materias: [...a.materias, MOVIDA] } : a,
);

/** Los alias: los de `reparto.ts`. */
const ALIAS: Record<string, string> = {
	Artística: 'ART', Biología: 'BIO', 'Cátedra de la Paz': 'CPZ', 'Ciencias Naturales': 'CNA', 'Ciencias Sociales': 'SOC',
	'Educación Física': 'EDF', Estadística: 'EST', 'Ética y Valores': 'ETI', Inglés: 'ING', 'Lengua Castellana': 'LEN',
	Matemáticas: 'MAT', Química: 'QUI', 'Tecnología e Informática': 'TEC',
};

/** La rejilla de Materias, por orden alfabético como el desplegable de Asignaturas. */
export const MATERIAS = AREAS.flatMap((a) => a.materias.map((m) => ({ materia: m, area: a.nombre })))
	.sort((x, y) => x.materia.localeCompare(y.materia, 'es'))
	.map((m, i) => ({ ...m, id: 3 + i * 2, alias: ALIAS[m.materia] }));

export const FILA_MOVIDA = MATERIAS.findIndex((m) => m.materia === MOVIDA);

export const TEXTOS = {
	materias: 'Materias',
	ordenar: 'Ordenar',
	pistaOrdenar: 'Arrastra para reordenar. Una materia soltada en otra área cambia de área.',
	areas: 'Áreas',
	directores: 'Directores de área',
	subtitulo: ['Cada área tiene un director distinto cada año. Esto es el del ', { b: 'año lectivo en curso' }, ', el que aparece arriba en la barra.'],
	avisoTitulo: 'Un área la dirige alguien que no está contratado este año',
	avisoTexto: 'Al abrir un año nuevo los directores se heredan del anterior, y eso no mira los contratos. Revisa las filas en ámbar y nombra a alguien del año en curso.',
	sinContrato: 'Sin contrato este año',
	asignar: 'Asignar director',
	elige: 'Elige un docente',
	entradilla: 'Verás sus asignaturas, y desde ahí lo mismo que ve él.',
	guardado: 'Director de área guardado',
};

export type Trozo = string | { b: string };

/* ── Directores ────────────────────────────────────────────────────────────────────────────── */

/** El heredado sin contrato: inventado, y dibujado como todos. */
export const HEREDADO = { nombre: 'Rubén Darío Arango Vélez', tipo: 'hombre' as const, variante: 3 };

export const DIRECTORES: (ClaveDocente | 'heredado' | null)[] = ['salcedo', 'herrera', 'heredado', 'ocampo', null, 'duarte', 'alzate', 'lozano'];
export const AMBAR = 2;
/** A quién se nombra en su lugar. */
export const NUEVO_DIRECTOR: ClaveDocente = 'bernal';
/** Los que salen en el diálogo: los contratados del año (unos cuantos de `reparto.ts`). */
export const CONTRATADOS: ClaveDocente[] = ['bernal', 'castro', 'duarte', 'herrera', 'lozano', 'ocampo', 'salcedo', 'zapata'];

/* ── La geometría (cascara) ──────────────────────────────────────────────────────────────── */

export const OR = { relleno: 16, titulo: 28, pista: 24, filaMateria: 23, filaMinima: 32, pad: 11 };

const altoArea = (a: Area) => OR.pad + Math.max(OR.filaMinima, a.materias.length * OR.filaMateria);
export const ALTO_ORDENAR = OR.relleno * 2 + OR.titulo + OR.pista + 8 + AREAS.reduce((n, a) => n + altoArea(a), 0);

/** El panel «Ordenar» va entre la cabecera y la pista de la rejilla. */
export const COL_MATERIAS: Columna[] = [
	{ clave: 'id', titulo: 'Id', ancho: 60 },
	{ clave: 'editar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'quitar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'materia', titulo: 'Materia', ancho: 380, filtro: true },
	{ clave: 'alias', titulo: 'Alias', ancho: 200, filtro: true },
	{ clave: 'area', titulo: 'Área', ancho: 358, filtro: true },
];

export const pagMaterias = () => disposicionPagina(0, 0, MATERIAS.length, ALTO_ORDENAR);

export function rectArea(lista: Area[], i: number): Rect {
	const e = pagMaterias().encima;
	let y = e.y + OR.relleno + OR.titulo + OR.pista + 8;
	for (let k = 0; k < i; k++) { y += altoArea(lista[k]); }
	return { x: e.x + OR.relleno, y, ancho: e.ancho - OR.relleno * 2, alto: altoArea(lista[i]) };
}

/** El renglón de una materia dentro de su área (con el asa a la izquierda). */
export function rectMateria(lista: Area[], i: number, j: number): Rect {
	const a = rectArea(lista, i);
	const x = a.x + a.ancho * 0.45 + 16;
	return { x, y: a.y + OR.pad / 2 + j * OR.filaMateria, ancho: a.x + a.ancho - x, alto: OR.filaMateria };
}

export const celdaArea = (i: number) => rectCeldas(pagMaterias().rejilla, COL_MATERIAS, i, 'materia', 'area');

export const BOTONES_MATERIAS: BotonDePagina[] = [
	{ texto: 'Recargar', icono: 'reload', ancho: 116 },
	{ texto: 'Crear nueva', icono: 'plus', tipo: 'primary', ancho: 130 },
];
export const BOTONES_AREAS: BotonDePagina[] = [
	{ texto: 'Directores de área', icono: 'team', ancho: 186 },
	{ texto: 'Recargar', icono: 'reload', ancho: 116 },
	{ texto: 'Crear nueva', icono: 'plus', tipo: 'primary', ancho: 130 },
];
export const rectBotonDirectores = () => rectBotonDePagina(BOTONES_AREAS, 0);

export const COL_AREAS: Columna[] = [
	{ clave: 'id', titulo: 'Id', ancho: 60 },
	{ clave: 'editar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'quitar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'orden', titulo: 'Orden', ancho: 120, filtro: true },
	{ clave: 'nombre', titulo: 'Nombre', ancho: 518, filtro: true },
	{ clave: 'alias', titulo: 'Alias', ancho: 300, filtro: true },
];

/* Directores: cabecera, subtítulo, aviso, resumen y la lista. */
export const DR = { cabecera: 40, subtitulo: 26, aviso: 84, resumen: 30, fila: 62, hueco: 12 };

export function disposicionDirectores(aviso: number) {
	let y = MAIN.y;
	const cabecera: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: DR.cabecera + DR.subtitulo };
	y += DR.cabecera + DR.subtitulo + DR.hueco;
	const alerta: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: DR.aviso * aviso };
	y += (DR.aviso + DR.hueco) * aviso;
	const resumen: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: DR.resumen };
	y += DR.resumen + 6;
	const filas = AREAS.map((_, i) => ({ x: MAIN.x, y: y + i * DR.fila, ancho: MAIN.ancho, alto: DR.fila }));
	return { cabecera, alerta, resumen, filas };
}

/** El botón de la persona (avatar + nombre) en una fila: es lo que se pulsa para cambiarla. */
export function rectPersona(aviso: number, i: number): Rect {
	const f = disposicionDirectores(aviso).filas[i];
	return { x: f.x + f.ancho * 0.45, y: f.y + 11, ancho: 330, alto: 40 };
}

/* El diálogo «Elige un docente»: rejilla de tarjetas de 9rem. */
export const DIALOGO = { ancho: 680, y: 150, tarjeta: 144, alto: 104, hueco: 12, relleno: 24 };
export function rectTarjetaDocente(i: number): Rect {
	const por = 4;
	const x0 = (1440 - DIALOGO.ancho) / 2 + DIALOGO.relleno;
	const y0 = DIALOGO.y + DIALOGO.relleno + 30 + 38;
	const ancho = (DIALOGO.ancho - DIALOGO.relleno * 2 - DIALOGO.hueco * (por - 1)) / por;
	return { x: x0 + (i % por) * (ancho + DIALOGO.hueco), y: y0 + Math.floor(i / por) * (DIALOGO.alto + DIALOGO.hueco), ancho, alto: DIALOGO.alto };
}
export const ALTO_DIALOGO = DIALOGO.relleno * 2 + 30 + 38 + 2 * DIALOGO.alto + DIALOGO.hueco + 20 + 32;
