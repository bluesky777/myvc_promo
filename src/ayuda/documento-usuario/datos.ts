import { avance, entre } from '../montar-el-ano/tiempo';
import type { EstadoDirectorio } from '../secretaria/Directorio';
import { NOVENO_B, buscar, nombreCompleto } from '../secretaria/personas';
import type { Choque, EstadoDialogo } from './Dialogo';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL DOCUMENTO COMO NOMBRE DE USUARIO»: lo que se ve, fotograma a fotograma. Todo inventado.
 *
 * Los 14 alumnos de 9°B: 10 cambiarán, 2 ya lo tenían puesto, 1 no tiene documento y 1 choca: su
 * documento ya es el usuario de otra cuenta. 10 + 2 + 1 + 1 = 14, los del grupo.
 */

export const QUIEN = 'Los alumnos de 9°B';
export const CAMBIAN = 10;
export const YA_LO_TENIAN = 2;
export const SIN_DOCUMENTO = 1;
const CHOCA = buscar(NOVENO_B, 'Camila');
/** El motivo lo escribe el servidor; es el que usa la prueba del diálogo (`documento-como-usuario.spec.ts:140`). */
export const CHOQUES: Choque[] = [{ nombre: nombreCompleto(CHOCA), documento: CHOCA.documento, motivo: 'Ese usuario ya lo tiene otra persona.' }];

if (CAMBIAN + YA_LO_TENIAN + SIN_DOCUMENTO + CHOQUES.length !== NOVENO_B.length) {
	throw new Error('Datos: las cuentas del diálogo tienen que sumar los alumnos del grupo.');
}

export const M = {
	cursorEntra: 8,
	llegaPersonas: 26,
	pulsaPersonas: 32,
	abrePersonas: 34,
	llegaAlumnos: 56,
	pulsaAlumnos: 66,
	monta: 70,

	llegaClaves: 134,
	pulsaClaves: 144,

	llegaRevisar: 458,
	pulsaRevisar: 468,
	abre: 470,
	/** `revisar-…` va y vuelve: no escribe. */
	revisado: 494,

	llegaCambiar: 752,
	pulsaCambiar: 762,
	hecho: 784,
};

export function estadoDirectorioEn(f: number): EstadoDirectorio {
	return {
		grupo: '9B',
		filas: NOVENO_B.map((a) => ({ alumno: a, estado: 'Matr' as const })),
		clavesAbierto: f >= M.pulsaClaves,
		encimaClaves: entre(f, M.llegaClaves, M.pulsaClaves + 10),
		encimaRevisar: entre(f, M.llegaRevisar, M.pulsaRevisar + 8) ? 0 : null,
		opacidad: avance(f, M.monta, M.monta + 12),
	};
}

export function estadoDialogoEn(f: number): EstadoDialogo {
	return {
		t: avance(f, M.abre, M.abre + 12),
		fase: f < M.revisado ? 'mirando' : f < M.pulsaCambiar ? 'revisado' : f < M.hecho ? 'aplicando' : 'hecho',
		giro: (f - M.abre) * 24,
		contenido: avance(f, M.revisado, M.revisado + 8),
		encimaCambiar: entre(f, M.llegaCambiar, M.pulsaCambiar + 4),
	};
}
