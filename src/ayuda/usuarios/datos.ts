import { avance, entre, parpadea } from '../montar-el-ano/tiempo';
import type { Acudiente, EstadoClave, EstadoUsuarios } from './Usuarios';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «USUARIOS: ENTRAR AL SISTEMA»: lo que se ve, fotograma a fotograma. Todo inventado.
 *
 * Los acudientes de 9°B. Seis tienen cuenta y dos no --Diana Patricia y Hernando--: sin cuenta no
 * hay Id, ni usuario, ni botones. A Carlos Alberto se le cambia la contraseña.
 */

const doc = (n: number) => `100000${n}`;
const cel = (n: number) => `30000002${String(n).slice(-2)}`;

export const ACUDIENTES: Acudiente[] = [
	{ userId: 5201, usuario: 'luz.rivera', nombres: 'Luz Marina', apellidos: 'Rivera Gómez', documento: doc(5201), celular: cel(5201), tipo: 'mujer', variante: 2 },
	{ userId: 5202, usuario: 'carlos.acosta', nombres: 'Carlos Alberto', apellidos: 'Acosta Mejía', documento: doc(5202), celular: cel(5202), tipo: 'hombre', variante: 4 },
	{ userId: null, usuario: null, nombres: 'Diana Patricia', apellidos: 'Ruiz Salazar', documento: doc(5203), celular: cel(5203), tipo: 'mujer', variante: 5 },
	{ userId: 5204, usuario: '1000005204', nombres: 'Jorge Iván', apellidos: 'Cardona Pérez', documento: doc(5204), celular: cel(5204), tipo: 'hombre', variante: 1 },
	{ userId: 5205, usuario: 'sandra.pena', nombres: 'Sandra Liliana', apellidos: 'Peña Castro', documento: doc(5205), celular: cel(5205), tipo: 'mujer', variante: 0 },
	{ userId: null, usuario: null, nombres: 'Hernando', apellidos: 'Delgado Ríos', documento: doc(5206), celular: cel(5206), tipo: 'hombre', variante: 3 },
	{ userId: 5207, usuario: 'adriana.lozano', nombres: 'Adriana María', apellidos: 'Lozano Vélez', documento: doc(5207), celular: cel(5207), tipo: 'mujer', variante: 3 },
	{ userId: 5208, usuario: 'fabio.escobar', nombres: 'Fabio', apellidos: 'Escobar Duque', documento: doc(5208), celular: cel(5208), tipo: 'hombre', variante: 5 },
];

export const SIN_CUENTA = 2;
export const CON_CUENTA = 1;
export const CLAVE_NUEVA = 8;

export const M = {
	cursorEntra: 8,
	llegaPersonas: 26,
	pulsaPersonas: 32,
	abrePersonas: 34,
	llegaUsuarios: 56,
	pulsaUsuarios: 66,
	monta: 70,

	llegaAcudientes: 220,
	pulsaAcudientes: 230,
	/** El grupo recordado se pone solo (`usuarios.ts:758-761`) y la lista llega. */
	carga: 246,

	llegaLlave: 446,
	pulsaLlave: 454,
	abreClave: 456,
	llegaCampo: 478,
	pulsaCampo: 484,
	teclea: 490,
	llegaCambiar: 540,
	pulsaCambiar: 550,
	/** El diálogo se cierra cuando el servidor dice que sí. */
	cambiada: 562,

	llegaCarne: 740,
};

export function estadoEn(f: number): EstadoUsuarios {
	return {
		tipo: f >= M.pulsaAcudientes ? 'Acudientes' : null,
		encimaTipo: entre(f, M.llegaAcudientes, M.pulsaAcudientes + 8) ? 'Acudientes' : null,
		filas: f >= M.carga ? ACUDIENTES : [],
		encima: entre(f, M.llegaLlave, M.pulsaLlave + 8)
			? { fila: CON_CUENTA, boton: 'clave' }
			: entre(f, M.llegaCarne, M.llegaCarne + 80)
				? { fila: CON_CUENTA, boton: 'ficha' }
				: null,
		opacidad: avance(f, M.monta, M.monta + 12),
	};
}

export function estadoClaveEn(f: number): EstadoClave {
	const escrita = f < M.teclea ? 0 : Math.min(CLAVE_NUEVA, Math.floor((f - M.teclea) / 4));
	return {
		t: avance(f, M.abreClave, M.abreClave + 12),
		sale: avance(f, M.cambiada, M.cambiada + 8),
		escrita,
		foco: f >= M.pulsaCampo,
		cursor: f >= M.pulsaCampo && parpadea(f),
		encimaCambiar: entre(f, M.llegaCambiar, M.cambiada),
	};
}
