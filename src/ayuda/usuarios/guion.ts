import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { ENTRADA_DEL_PUNTERO, PERSONAS, dePersonas, puntoDelMenu, rectDelMenu } from '../secretaria/menu';
import { centro, type Rect } from '../secretaria/piezas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ACUDIENTES, CON_CUENTA, M, SIN_CUENTA } from './datos';
import { PIE_CLAVE, rectCampoClave, rectCelda, rectFila, rectTipo, rectTiposYAlerta } from './Usuarios';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «USUARIOS: ENTRAR AL SISTEMA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Abre vacía a propósito.** No baja el colegio entero: primero se elige a quién
 *        administrar, con cuatro botones (`usuarios.ts:392`, `usuarios.html:151-163`).
 *     2. **Quien no tiene cuenta no tiene botones, y no es un fallo.** Sin `username` no hay carné;
 *        sin `user_id` no hay llave, ni Id, y el usuario no se edita (`usuarios.ts:620-659`). La
 *        pista de la propia pantalla lo dice: «Quien no tiene cuenta no tiene esos dos botones.»
 *
 * Y de paso, lo que sí se hace: la llave, «Cambiar contraseña», mínimo 4 caracteres, «Contraseña
 * cambiada.» (`reset-pass.ts`). La contraseña la escribe quien la cambia: no hay una por defecto.
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

export const FOCOS = {
	personas: enElFotograma(rectDelMenu(PERSONAS, null, null)),
	vacia: f(rectTiposYAlerta(), 8),
	acudientes: f(rectTipo('Acudientes'), 6),
	sinCuenta: f(rectFila(SIN_CUENTA), 2),
	llave: f(rectCelda(CON_CUENTA, 'clave'), 2),
	fila: f(rectFila(CON_CUENTA), 2),
	carne: f(rectCelda(CON_CUENTA, 'ficha'), 2),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(PERSONAS, null, null),
	usuarios: puntoDelMenu(PERSONAS, dePersonas('Usuarios'), PERSONAS),
	acudientes: centro(rectTipo('Acudientes')),
	llave: centro(rectCelda(CON_CUENTA, 'clave')),
	campo: { x: rectCampoClave().x + 140, y: centro(rectCampoClave()).y },
	cambiar: centro(PIE_CLAVE[1]),
	carne: centro(rectCelda(CON_CUENTA, 'ficha')),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Personas ▸ Usuarios', url: '/usuarios' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Están en Personas, en Usuarios.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: M.pulsaPersonas + 10 },
	{ desde: 120, texto: 'Abre vacía: eliges a quién; aquí, acudientes de 9B.', voz: 'Abre vacía: eliges a quién; aquí, acudientes de noveno B.', ...AQUI, foco: FOCOS.vacia, focoHasta: M.pulsaAcudientes + 8 },
	{ desde: 288, texto: 'Sin cuenta, no hay Id ni botones: no es un fallo.', voz: 'Sin cuenta, no hay número ni botones: no es un fallo.', ...AQUI, foco: FOCOS.sinCuenta },
	{ desde: 432, texto: 'La llave cambia su contraseña: mínimo 4 caracteres.', voz: 'La llave cambia su contraseña: mínimo cuatro caracteres.', ...AQUI, foco: FOCOS.llave, focoHasta: M.pulsaLlave + 6 },
	{ desde: 576, texto: 'La anterior se pierde: avísale la nueva.', ...AQUI, foco: FOCOS.fila, rojo: true },
	{ desde: 724, texto: 'El carné abre su perfil, para editar sus datos.', ...AQUI, foco: FOCOS.carne },
];

export const AVISOS = [{ desde: M.cambiada, dura: fotogramasDe(3000), texto: 'Contraseña cambiada.' }];

export const TARJETA = 856;
export const DURACION = TARJETA + 120;

export const CLAVE = 'usuarios';
export const TITULO = 'Usuarios: entrar al sistema';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Personas, Usuarios' },
	{ desde: 120, titulo: 'Abre vacía: elige a quién' },
	{ desde: 288, titulo: 'Sin cuenta, sin botones' },
	{ desde: 432, titulo: 'Cambiar una contraseña' },
	{ desde: 724, titulo: 'Sus datos, en el perfil' },
];

export const CIERRE: Cierre = {
	hiciste: 'Abriste los acudientes de 9B y cambiaste la contraseña de Carlos Alberto.',
	seVe: 'Sale «Contraseña cambiada.» y el diálogo se cierra.',
	despues: 'Siguiente: el documento como nombre de usuario.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (!(PASOS[3].desde <= M.cambiada && M.cambiada < PASOS[4].desde)) {
	throw new Error('Guion: «Contraseña cambiada.» tiene que salir en el paso que la explica.');
}
