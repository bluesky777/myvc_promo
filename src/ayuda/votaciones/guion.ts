import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, centro, foco, puntoDe, rectDeNieta, rectDelMenu } from '../comun-directivo/lugar';
import { CANDIDATOS, CONFIG, LA_BUENA, rectFoto, rectInterruptor, rectInterruptores, rectOpcionEleccion, rectPalanca, rectTarjetas } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «VOTACIONES».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA, CORREGIDA CONTRA EL CÓDIGO
 *
 *     El plan decía «"actual" e "in_action" se apagan entre ellas». No es así: **cada una se apaga
 *     en las demás elecciones del mismo creador y del mismo año**, no la una a la otra
 *     (`VtVotacionesController::apagarLasDemas`, `WHERE user_id=? AND year_id=?`; y el espejo en
 *     `config.ts:323-331`). En pantalla ni siquiera se llaman así: son «Es la votación del año» y
 *     «Abierta ahora mismo», y la pista de la primera lo dice con sus palabras.
 *
 *     Y **cada quien ve sólo las elecciones que creó** (`getIndex`: `where user_id`), salvo el
 *     superusuario, que ve las de todo el colegio. Eso vale para configurar, no para votar: al
 *     estudiante le sale la que esté a la vez del año y abierta, y en su censo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA     Configuración ▸ Votaciones ▸ Configurar (el menú tiene aquí tres niveles)
 *     2. CONFIGURAR     se elige la elección buena; se encienden «del año» y «abierta»
 *     3. CANDIDATOS     trabaja sobre la del año; las fotos salen de la ficha
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaConfig: 40,
	pulsaConfig: 46,
	abreConfig: 48,
	llegaVot: 80,
	pulsaVot: 88,
	abreVot: 90,
	llegaConfigurar: 118,
	pulsaConfigurar: 128,
	montaConfig: 132,

	llegaSelector: 270,
	pulsaSelector: 280,
	abreSelector: 282,
	llegaOpcion: 302,
	pulsaOpcion: 312,
	/** La elección elegida se pinta en cuanto llega su detalle. */
	cambiaEleccion: 320,

	llegaActual: 440,
	pulsaActual: 452,
	/** `PUT votaciones/set-actual` vuelve: «Cambiado». */
	cambiaActual: 460,
	llegaAbierta: 565,
	pulsaAbierta: 577,
	cambiaAbierta: 585,

	llegaCandidatos: 1175,
	pulsaCandidatos: 1187,
	seVaConfig: 1187,
	montaCandidatos: 1208,
	cursorSale: 1300,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_CONFIG = { ubicacion: 'Menú ▸ Configuración ▸ Votaciones ▸ Configurar', url: '/votaciones/config' };
const EN_CANDIDATOS = { ubicacion: 'Menú ▸ Configuración ▸ Votaciones ▸ Candidatos', url: '/votaciones/candidatos' };

export const MENU_R = {
	configuracion: rectDelMenu('Configuración', null, null),
	votaciones: rectDelMenu('Configuración', 'Votaciones', 'Configuración'),
	configurar: rectDeNieta('Configuración', 'Votaciones', 'Configurar'),
	candidatos: rectDeNieta('Configuración', 'Votaciones', 'Candidatos'),
};

export const FOCOS = {
	configuracion: enElFotograma(MENU_R.configuracion),
	selector: foco(CONFIG.selector),
	interruptores: foco(rectInterruptores(), 8),
	actual: foco(rectInterruptor('actual'), 8),
	abierta: foco(rectInterruptor('in_action'), 8),
	etiquetas: foco({ x: CONFIG.selector.x, y: CONFIG.selector.y, ancho: CONFIG.etiquetas.x + CONFIG.etiquetas.ancho - CONFIG.selector.x, alto: CONFIG.selector.alto }),
	candidatos: enElFotograma(MENU_R.candidatos),
	subtitulo: foco(CANDIDATOS.subtitulo),
	tarjetas: foco(rectTarjetas(), 8),
	foto: foco(rectFoto(), 8),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	configuracion: puntoDe(MENU_R.configuracion),
	votaciones: puntoDe(MENU_R.votaciones),
	configurar: puntoDe(MENU_R.configurar),
	selector: centro(CONFIG.selector),
	opcion: centro(rectOpcionEleccion(LA_BUENA)),
	actual: centro(rectPalanca('actual')),
	abierta: centro(rectPalanca('in_action')),
	candidatos: puntoDe(MENU_R.candidatos),
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Votaciones está en Configuración, en su propio grupo.', ...EN_EL_MENU, foco: FOCOS.configuracion, focoHasta: T.pulsaConfig + 10 },
	{ desde: 150, texto: 'Aquí sólo salen tus elecciones; el superusuario ve todas.', ...EN_CONFIG, foco: FOCOS.selector, focoHasta: T.llegaSelector - 8 },
	{ desde: 295, texto: 'Se elige la elección, con sus interruptores.', ...EN_CONFIG, foco: FOCOS.interruptores, focoHasta: 405 },
	{ desde: 415, texto: 'Del año: sólo una de tus elecciones a la vez.', ...EN_CONFIG, foco: FOCOS.actual },
	{ desde: 540, texto: 'Abierta ahora mismo: igual, una sola a la vez.', ...EN_CONFIG, foco: FOCOS.abierta },
	{ desde: 675, texto: 'Para que se vote hacen falta las dos.', ...EN_CONFIG, foco: FOCOS.etiquetas },
	{ desde: 775, texto: 'Apagar Abierta durante la jornada corta la votación.', ...EN_CONFIG, foco: FOCOS.abierta },
	{ desde: 900, texto: 'No borres una elección ni una mesa: no vuelven. Apágalas.', ...EN_CONFIG, foco: FOCOS.interruptores, rojo: true },
	{ desde: 1100, texto: 'Los candidatos se inscriben en Candidatos.', ...EN_CONFIG, foco: FOCOS.candidatos, focoHasta: T.pulsaCandidatos + 8 },
	{ desde: T.montaCandidatos + 4, texto: 'Trabajan sobre la del año, con su número y la foto de su ficha.', ...EN_CANDIDATOS, foco: FOCOS.tarjetas },
];

/** `Avisos.open('Cambiado', undefined, { duration: 1500 })`: neutro, sin acción. */
export const AVISOS = [
	{ desde: T.cambiaActual, dura: 45, texto: 'Cambiado' },
	{ desde: T.cambiaAbierta, dura: 45, texto: 'Cambiado' },
];

export const TARJETA = 1355;
export const DURACION = TARJETA + 120;

export const CLAVE = 'votaciones';
export const TITULO = 'Votaciones';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Configuración, Votaciones' },
	{ desde: 150, titulo: 'Sólo tus elecciones' },
	{ desde: 415, titulo: 'Del año y abierta; no borrar' },
	{ desde: 1100, titulo: 'Candidatos y la foto del tarjetón' },
];

export const CIERRE: Cierre = {
	hiciste: 'Marcaste la elección del año y la abriste para votar.',
	seVe: 'Junto al selector: «La del año» y «En curso».',
	despues: 'Siguiente: promocionar notas.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.montaCandidatos < T.seVaConfig + 17) { throw new Error('Guion: Candidatos se monta antes de que Configurar se haya ido.'); }
if (PASOS[3].desde >= T.pulsaActual || PASOS[4].desde >= T.pulsaAbierta) { throw new Error('Guion: el rótulo tiene que llegar antes del clic que explica.'); }
