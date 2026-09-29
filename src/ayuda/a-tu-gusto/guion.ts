import { rectanguloDeMando } from '../BarraDeHoy';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { alFotograma, centro, holgura } from '../moverse/comun';
import { ASPECTO, CAJON, SCROLL_MAXIMO } from '../moverse/Aspecto';
import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PONERLO A TU GUSTO» (Moverse por MyVC, ola 3).
 *
 * LA DUDA QUE MATA: tema, modo oscuro, densidad de las tablas — **y que se guarda en ESTE
 * navegador, no en tu cuenta** («Lo que elijas se guarda en este navegador y se aplica al momento»,
 * `mandos-aspecto.html:234`; las claves `myvc_tema_*` de `tema-usuario.ts:495-513`). Quien lo pone
 * oscuro en el portátil y abre MyVC en el computador del colegio lo encuentra claro, y cree que se
 * borró.
 *
 * TRES ACTOS
 *
 *     1. DÓNDE ESTÁ    el engranaje de la barra abre el cajón «Aspecto»
 *     2. CAMBIARLO     Modo: Oscuro (al momento, toda la aplicación); Densidad: Compacta (la rejilla
 *                      pasa de filas de 48 a 32)
 *     3. DÓNDE QUEDA   la nota del final: en este navegador; y lo contrario del año y el periodo
 *
 * EL CAMBIO ES EN SECO porque en la aplicación también: cambia una hoja de estilos
 * (`tema-usuario.ts`, `hoja()`), no hay transición.
 */

export const FPS = 30;

export const T = {
	cursorEntra: 16,
	llegaAspecto: 40,
	pulsaAspecto: 54,
	abre: 56,
	llegaOscuro: 339,
	pulsaOscuro: 353,
	llegaCompacta: 494,
	pulsaCompacta: 508,
	baja: 562,
	bajado: 590,
	llegaCerrar: 712,
	pulsaCerrar: 726,
	cierra: 728,
	cursorSale: 790,
};

export const scrollEn = (frame: number) => {
	if (frame <= T.baja) { return 0; }
	if (frame >= T.bajado) { return SCROLL_MAXIMO; }
	const t = (frame - T.baja) / (T.bajado - T.baja);
	return SCROLL_MAXIMO * (1 - Math.cos(Math.PI * t)) / 2;
};

export const FOCOS = {
	aspecto: alFotograma(holgura(rectanguloDeMando('aspecto'), 4), 10),
	tema: alFotograma(ASPECTO.tema(), 10),
	modo: alFotograma(ASPECTO.modo(), 10),
	densidad: alFotograma(ASPECTO.densidad(), 10),
	nota: alFotograma(ASPECTO.nota(SCROLL_MAXIMO), 10),
	selector: alFotograma(holgura(rectanguloDeMando('selector'), 4), 20),
};

export const PUNTOS = {
	entrada: { x: 900, y: 640 },
	aspecto: centro(rectanguloDeMando('aspecto')),
	oscuro: centro(ASPECTO.oscuro()),
	compacta: centro(ASPECTO.compacta()),
	cerrar: { x: MEDIDAS.ancho - CAJON.ancho + CAJON.relleno + 7, y: CAJON.cabecera / 2 },
	reposo: { x: 760, y: 720 },
};

const ARRIBA = { ubicacion: 'Barra de arriba ▸ Aspecto (el engranaje)', url: 'En todas las pantallas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'El aspecto se cambia arriba, en el engranaje.', ...ARRIBA, foco: FOCOS.aspecto, focoHasta: T.pulsaAspecto + 10 },
	{ desde: 127, texto: 'Tema: cuatro estilos a elegir.', ...ARRIBA, foco: FOCOS.tema },
	{ desde: 225, texto: 'Modo: claro, oscuro o el de tu equipo.', ...ARRIBA, foco: FOCOS.modo },
	{ desde: T.pulsaOscuro, texto: 'Cambia al momento, en toda la aplicación.', ...ARRIBA },
	{ desde: 466, texto: 'Densidad: Compacta mete más filas en pantalla.', ...ARRIBA, foco: FOCOS.densidad, focoHasta: T.baja - 6 },
	{ desde: T.bajado + 4, texto: 'Se guarda en este navegador; en otro, se elige otra vez.', ...ARRIBA, foco: FOCOS.nota, focoHasta: T.llegaCerrar - 8 },
	{ desde: 740, texto: 'El año y el periodo, en cambio, van con tu cuenta.', ...ARRIBA, foco: FOCOS.selector },
];

export const TARJETA = 879;
export const DURACION = 999;

export const CLAVE = 'a-tu-gusto';
export const TITULO = 'Ponerlo a tu gusto';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: el engranaje' },
	{ desde: PASOS[2].desde, titulo: 'Modo oscuro' },
	{ desde: PASOS[4].desde, titulo: 'Densidad de las tablas' },
	{ desde: PASOS[5].desde, titulo: 'Se guarda en este navegador' },
];

export const CIERRE: Cierre = {
	hiciste: 'Pusiste MyVC en modo oscuro y con las tablas compactas.',
	seVe: 'Cambia al momento, y en este navegador sigue así al volver a entrar.',
	despues: 'En otro equipo, vuelve a abrir el engranaje y elígelo otra vez.',
	voz: 'En otro equipo, elígelo otra vez.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[3].desde !== T.pulsaOscuro || T.pulsaCompacta < PASOS[4].desde || T.pulsaCerrar > PASOS[6].desde) {
	throw new Error('Guion: un clic no cae en el paso que lo explica.');
}
