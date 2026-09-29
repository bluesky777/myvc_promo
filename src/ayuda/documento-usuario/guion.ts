import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { PANEL, revisarEnLaPagina } from '../secretaria/Directorio';
import { ENTRADA_DEL_PUNTERO, PERSONAS, dePersonas, puntoDelMenu, rectDelMenu } from '../secretaria/menu';
import { centro, enCascara, type Rect } from '../secretaria/piezas';
import { disposicionDirectorio, rectBotonClaves } from '../secretaria/planoDirectorio';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { CAMBIAN, M } from './datos';
import { rectCambiar, rectChoques, rectCifraYMatices, rectPeligroYCambiar } from './Dialogo';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «EL DOCUMENTO COMO NOMBRE DE USUARIO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **«Revisar» no cambia nada.** Abre el diálogo y pregunta qué pasaría (`revisar-…`, que no
 *        escribe); el cambio sólo lo hace «Cambiar los N», y el botón dice la cifra
 *        (`documento-como-usuario.ts:36-40`, 346-370).
 *     2. **Los que chocan son la lista de trabajo, y no se arreglan repitiendo.** Su documento ya es
 *        el usuario de otra cuenta; el diálogo los nombra, no ofrece reintentar, y al acabar no se
 *        cierra solo: deja «Copiar lo que quedó fuera» (`documento-como-usuario.ts:44-52`).
 *
 * TRES ACTOS: la llegada (Personas ▸ Alumnos ▸ «Cambiar contraseñas y usuarios»), la revisión, y
 * el cambio con lo que quedó fuera.
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

const CON_PANEL = disposicionDirectorio(true, false);

export const FOCOS = {
	personas: enElFotograma(rectDelMenu(PERSONAS, null, null)),
	claves: f(rectBotonClaves(), 6),
	todos: f(enCascara({ x: PANEL.relleno, y: CON_PANEL.panel! + PANEL.relleno + 204, ancho: PANEL.anchos[0], alto: 102 }), 4),
	revisar: f(enCascara(revisarEnLaPagina(0, CON_PANEL.panel!)), 8),
	cifraYChoques: (() => {
		const a = rectCifraYMatices();
		const b = rectChoques();
		const x = Math.min(a.x, b.x);
		const y = Math.min(a.y, b.y);
		return f({ x, y, ancho: Math.max(a.x + a.ancho, b.x + b.ancho) - x, alto: Math.max(a.y + a.alto, b.y + b.alto) - y }, 6);
	})(),
	cambiar: f(rectPeligroYCambiar(CAMBIAN), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(PERSONAS, null, null),
	alumnos: puntoDelMenu(PERSONAS, dePersonas('Alumnos'), PERSONAS),
	claves: centro(rectBotonClaves()),
	revisar: centro(enCascara(revisarEnLaPagina(0, CON_PANEL.panel!))),
	cambiar: centro(rectCambiar(CAMBIAN)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Personas, en Alumnos.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: M.pulsaPersonas + 10 },
	{ desde: 118, texto: 'Luego, «Cambiar contraseñas y usuarios».', ...AQUI, foco: FOCOS.claves, focoHasta: M.pulsaClaves + 8 },
	{ desde: 242, texto: '«Todos» cambia la clave de todo el colegio: para uno, usa Usuarios.', ...AQUI, foco: FOCOS.todos, rojo: true },
	{ desde: 442, texto: '«Revisar» sólo cuenta qué pasaría: no cambia nada.', ...AQUI, foco: FOCOS.revisar, focoHasta: M.pulsaRevisar + 6 },
	{ desde: 580, texto: 'Cambiarán 10; si alguna choca, corrige su documento a mano.', voz: 'Cambiarán diez; si alguna choca, corrige su documento a mano.', ...AQUI, foco: FOCOS.cifraYChoques },
	{ desde: 737, texto: 'Avísales: con el usuario viejo ya no entran.', ...AQUI, foco: FOCOS.cambiar, focoHasta: M.pulsaCambiar + 6, rojo: true },
];

export const AVISOS = [{ desde: M.hecho, dura: fotogramasDe(3000), texto: `${CAMBIAN} usuarios cambiados.` }];

export const TARJETA = 891;
export const DURACION = TARJETA + 140;

export const CLAVE = 'documento-usuario';
export const TITULO = 'El documento como nombre de usuario';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Alumnos, contraseñas y usuarios' },
	{ desde: 242, titulo: '«Todos» es todo el colegio' },
	{ desde: 442, titulo: 'Revisar: la cifra antes de cambiar' },
	{ desde: 737, titulo: 'Cambiar' },
];

export const CIERRE: Cierre = {
	hiciste: 'Pusiste el documento como usuario a 10 alumnos de 9°B.',
	seVe: 'Sale «10 usuarios cambiados.»; el que chocó sigue en la lista, para arreglarlo.',
	despues: 'Siguiente: usuarios, cambiar una contraseña.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[4].desde < M.revisado) {
	throw new Error('Guion: la cifra se señala cuando el diálogo ya la tiene.');
}
