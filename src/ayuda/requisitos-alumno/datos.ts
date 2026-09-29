import { avance, entre } from '../montar-el-ano/tiempo';
import type { EstadoDirectorio } from '../secretaria/Directorio';
import { NOVENO_B } from '../secretaria/personas';
import { OPCIONES_COMPROMISO, disposicionCompromisos, type EstadoFicha, type Requisito } from './Ficha';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «REQUISITOS Y COMPROMISOS DEL ALUMNO»: lo que se ve, fotograma a fotograma. Todo inventado.
 *
 * La ficha de Sara Isabel Acosta Rivera (9°B). Sus requisitos de 2026 son cinco papeles inventados;
 * le falta el certificado médico, que llega y se marca «Ya». Luego se le pone un compromiso
 * académico para este año.
 */

export const ALUMNA = NOVENO_B[0];

const REQUISITOS: Requisito[] = [
	{ nombre: 'Registro civil de nacimiento', estado: 'ya' },
	{ nombre: 'Certificado médico', estado: 'falta' },
	{ nombre: 'Fotos 3×4', estado: 'ya' },
	{ nombre: 'Paz y salvo de 2025', estado: 'ya' },
	{ nombre: 'Copia del documento del acudiente', estado: 'n/a' },
];
export const FILA_MEDICO = 1;
export const N = REQUISITOS.length;
export const COMPROMISO = 'COMPROM ACADÉMICO';
export const OPCION = OPCIONES_COMPROMISO.indexOf(COMPROMISO);

export const M = {
	cursorEntra: 20,
	llegaPersonas: 58,
	pulsaPersonas: 64,
	abrePersonas: 66,
	llegaAlumnos: 100,
	pulsaAlumnos: 110,
	monta: 114,

	llegaFicha: 150,
	pulsaFicha: 164,
	montaFicha: 182,

	bajaDesde: 315,
	bajaHasta: 343,

	llegaYa: 500,
	pulsaYa: 512,
	/** `requisitos/alumno` va y vuelve. */
	guardadoYa: 524,

	bajaMasDesde: 705,
	bajaMasHasta: 740,

	llegaSelect: 765,
	pulsaSelect: 776,
	llegaOpcion: 800,
	pulsaOpcion: 812,
	guardadoCompromiso: 824,
};

export const S1 = 380;
/** Hasta los compromisos, sin pasar de lo que la página da de sí (lo que mide menos lo que se ve). */
export const S2 = Math.min(disposicionCompromisos(N, false).h3 - 90, disposicionCompromisos(N, false).fin - (900 - 96 - 40));

export function estadoDirectorioEn(f: number): EstadoDirectorio {
	return {
		grupo: '9B',
		filas: NOVENO_B.map((a, i) => ({ alumno: a, estado: 'Matr' as const, encimaAccion: i === 0 && entre(f, M.llegaFicha, M.pulsaFicha + 10) ? (0 as const) : null })),
		opacidad: avance(f, M.monta, M.monta + 12) * (1 - avance(f, M.pulsaFicha, M.pulsaFicha + 14)),
	};
}

export function estadoFichaEn(f: number): EstadoFicha {
	const abierto = f >= M.pulsaSelect && f < M.pulsaOpcion;
	return {
		alumno: ALUMNA,
		requisitos: REQUISITOS.map((r, i) => (i === FILA_MEDICO
			? { ...r, estado: f >= M.pulsaYa ? 'ya' : r.estado, encima: entre(f, M.llegaYa, M.pulsaYa + 8) ? 'ya' : null }
			: r)),
		compromiso: f >= M.pulsaOpcion ? COMPROMISO : null,
		compromisoAbierto: abierto ? { resaltada: f >= M.llegaOpcion - 6 ? OPCION : null, aparece: avance(f, M.pulsaSelect, M.pulsaSelect + 8) } : null,
		desplazada: avance(f, M.bajaDesde, M.bajaHasta) * S1 + avance(f, M.bajaMasDesde, M.bajaMasHasta) * (S2 - S1),
		opacidad: avance(f, M.montaFicha, M.montaFicha + 12),
	};
}
