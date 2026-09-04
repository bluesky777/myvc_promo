import { continueRender, delayRender } from 'remotion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS FUENTES DEL PORTAL, Y POR QUÉ LA ESPERA TIENE TOPE.
 *
 * El portal se dibuja con Newsreader para los titulares e IBM Plex para todo lo demás; ninguna de
 * las dos está instalada en el Mac, así que hay que traerlas de Google Fonts. Y aquí hay una trampa
 * conocida de Remotion: **cada fotograma se dibuja por separado**, así que si la fuente llega a
 * medias, unos fotogramas salen con Newsreader y otros con Georgia, y el texto da un salto de ancho
 * en mitad del clip. Por eso se retiene el render hasta que las fuentes estén listas.
 *
 * PERO LA ESPERA TIENE TOPE de dos segundos. Sin él, un render sin internet no se ve feo: **se
 * queda colgado** y falla por tiempo agotado. Con él, si no hay red el clip sale con Georgia y Arial
 * --que son justo las de respaldo que declara el propio portal-- y se entera quien lo mire, no quien
 * espere media hora a que reviente.
 */

const ENLACE =
	'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600' +
	'&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';

let pedido = false;

/** Se llama una vez desde la escena. Repetirla no vuelve a pedir nada. */
export function cargarFuentes(): void {
	if (pedido || typeof document === 'undefined') { return; }
	pedido = true;

	const espera = delayRender('Fuentes del portal de la UCN');

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = ENLACE;
	document.head.appendChild(link);

	const tope = new Promise<void>((listo) => { setTimeout(listo, 2000); });

	Promise.race([document.fonts.ready.then(() => undefined), tope])
		.then(() => { continueRender(espera); })
		/* Si algo falla, se sigue igual: un clip con la fuente de respaldo vale más que ninguno. */
		.catch(() => { continueRender(espera); });
}
