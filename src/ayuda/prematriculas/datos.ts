import { avance, entre } from '../montar-el-ano/tiempo';
import { GRUPOS } from '../montar-el-ano/reparto';
import { NOVENO_A, NOVENO_B, buscar } from '../secretaria/personas';
import type { EstadoPrematriculas, FilaGrupo, FilaTablero } from './Prematriculas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PREMATRÍCULAS»: lo que se ve, fotograma a fotograma. Todo inventado.
 *
 * La campaña de 2027, y el grupo 10°A: sus candidatos son los de 9°A y 9°B de 2026. Dos se llevaron
 * el formulario, cuatro están prematriculados --uno de ellos, Mariana, lo apuntó su familia desde su
 * panel--, una viene de asistente y dos ya están matriculados. Los números del tablero son
 * inventados; los de 10°A cuadran con su lista.
 */

const b = (n: string) => buscar(NOVENO_B, n);
const a = (n: string) => buscar(NOVENO_A, n);

export const DE_LA_FAMILIA = b('Mariana');

const FORMULARIOS: FilaGrupo[] = [
	{ alumno: b('Juliana'), estado: 'FORM' },
	{ alumno: b('Juan José'), estado: 'FORM' },
];

const LISTA: FilaGrupo[] = [
	{ alumno: b('Sara Isabel'), estado: 'PREM' },
	{ alumno: a('Manuela'), estado: 'MATR' },
	{ alumno: DE_LA_FAMILIA, estado: 'PREA' },
	{ alumno: b('Samuel'), estado: 'MATR' },
	{ alumno: b('Valentina'), estado: 'ASIS' },
	{ alumno: b('Tomás Andrés'), estado: 'PREM' },
	{ alumno: b('Martín'), estado: 'PREM' },
];

export const FILA_FAMILIA = LISTA.findIndex((f) => f.alumno === DE_LA_FAMILIA);

/** El tablero de 2027: los quince grupos, con cifras inventadas y las de 10°A cuadradas con su lista. */
const CIFRAS: Record<string, [number, number, number, number, number]> = {
	PJ: [3, 6, 0, 2, 0], J: [2, 7, 0, 3, 5], T: [1, 8, 1, 4, 6], '1A': [2, 12, 0, 6, 9], '2A': [1, 11, 1, 5, 12],
	'3A': [3, 10, 0, 6, 11], '4A': [0, 13, 1, 7, 9], '5A': [2, 12, 0, 5, 14], '6A': [4, 9, 1, 3, 20], '7A': [1, 10, 0, 4, 21],
	'8A': [0, 8, 0, 3, 23], '9A': [2, 7, 1, 3, 22], '9B': [1, 8, 0, 2, 20], '10A': [2, 4, 1, 2, 13], '11A': [0, 6, 0, 3, 24],
};

export const TABLERO: FilaTablero[] = GRUPOS.map((g) => {
	const [formul, prem, asis, matric, sinPasar] = CIFRAS[g.abrev];
	return { nombre: g.nombre, abrev: g.abrev, formul, prem, asis, matric, sinPasar, cupo: g.cupo };
});

export const FILA_10A = TABLERO.findIndex((g) => g.abrev === '10A');

const TOTALES = (() => {
	const s = TABLERO.reduce((t, g) => ({ f: t.f + g.formul, p: t.p + g.prem, a: t.a + g.asis, m: t.m + g.matric, s: t.s + g.sinPasar, c: t.c + g.cupo }), { f: 0, p: 0, a: 0, m: 0, s: 0, c: 0 });
	return { formularios: s.f, prematriculados: s.p, asistentes: s.a, matriculados: s.m, sinPasar: s.s, ocupados: s.p + s.m, cupo: s.c };
})();

export const M = {
	cursorEntra: 8,
	llegaPersonas: 26,
	pulsaPersonas: 32,
	abrePersonas: 34,
	llegaPrematriculas: 56,
	pulsaPrematriculas: 66,
	monta: 70,

	bajaTablero: 238,
	bajaTableroHasta: 264,
	llegaGrupo: 288,
	pulsaGrupo: 296,
	cargaGrupo: 306,

	bajaPaso2: 380,
	bajaPaso2Hasta: 410,

	llegaRevisada: 800,
	pulsaRevisada: 810,
	/** `matriculas.prematricular` con PREM, y la lista se vuelve a pedir. */
	revisada: 820,
};

export const S1 = 200;
export const S2 = 940;

export function estadoEn(f: number): EstadoPrematriculas {
	const elegido = f >= M.pulsaGrupo ? '10A' : null;
	const cargado = f >= M.cargaGrupo;
	const revisada = f >= M.revisada;

	const lista = LISTA.map((x) => ({ ...x, estado: x.alumno === DE_LA_FAMILIA && revisada ? ('PREM' as const) : x.estado }));

	const desplazada =
		avance(f, M.bajaTablero, M.bajaTableroHasta) * S1 +
		avance(f, M.bajaPaso2, M.bajaPaso2Hasta) * (S2 - S1);

	return {
		tablero: TABLERO,
		elegido: cargado ? elegido : null,
		encimaGrupo: entre(f, M.llegaGrupo, M.pulsaGrupo + 10) ? '10A' : null,
		via: { formularios: 2, prematriculados: revisada ? 4 : 3, familia: revisada ? 0 : 1, asistentes: 1, matriculados: 2, ocupados: 6, cupo: 38 },
		formularios: FORMULARIOS,
		familia: revisada ? [] : [{ alumno: DE_LA_FAMILIA, estado: 'PREA' }],
		lista,
		encimaRevisada: entre(f, M.llegaRevisada, M.pulsaRevisada + 10),
		totales: TOTALES,
		desplazada,
		opacidad: avance(f, M.monta, M.monta + 12),
	};
}
