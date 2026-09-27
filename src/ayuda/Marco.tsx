import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../comunes/movimiento';
import { CABECERA_ALTO, FUENTE, PAPEL, ROTULO_ALTO, TINTA, TINTA_SUAVE } from './tema';
import { Paso, pasoEn } from './tiempos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL MARCO DE UN VÍDEO DE AYUDA: **la cabecera que dice dónde estás y el rótulo que dice qué pasa.**
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ LA CABECERA NO SE VA NUNCA
 *
 * Un vídeo promocional se ve entero y desde el principio. Uno de ayuda no: alguien lo abre desde el
 * botón de la pantalla, mira veinte segundos, y vuelve a su trabajo. Si el camino sólo se dijera al
 * empezar, quien caiga en el segundo 40 **ve una tabla y no sabe de qué pantalla es** -- y esa es
 * justo la pregunta que más llega por teléfono, por delante de «cómo se hace».
 *
 * Por eso van las dos líneas, y las dos hacen falta: el camino del menú se recorre con el ratón, y
 * la dirección se comprueba de un vistazo con lo que pone el navegador. Quien esté perdido arregla
 * con una de las dos.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ EL CONTADOR DE PASOS
 *
 * Sin voz no hay forma de saber cuánto falta, y quien no sabe cuánto falta abandona. «3 de 7» es lo
 * que convierte un vídeo mudo en algo que se termina.
 *
 * El rótulo de abajo sale de `Paso` y su duración la vigila `compruebaElGuion()`: aquí no se decide
 * cuánto dura nada, sólo se pinta.
 */

export const Marco: React.FC<{ pasos: Paso[]; final: number }> = ({ pasos, final }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(pasos, frame);
	if (cual < 0) { return null; }

	const paso = pasos[cual];
	const acaba = cual + 1 < pasos.length ? pasos[cual + 1].desde : final;

	/*
	 * EL TEXTO CAMBIA CON UN RELEVO CORTO Y NO CON UN FUNDIDO LARGO: mientras dos textos se cruzan no
	 * se puede leer ninguno de los dos. 6 fotogramas es lo justo para que no dé un salto seco.
	 */
	const nace = interpolate(frame - paso.desde, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const muere = interpolate(frame - acaba, [-6, 0], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const vivo = nace * muere;

	return (
		<>
			<Cabecera ubicacion={paso.ubicacion} url={paso.url} />
			<Rotulo texto={paso.texto} cual={cual + 1} cuantos={pasos.length} vivo={vivo} entrada={entra(frame, fps, 0, 18)} />
		</>
	);
};

/*
 * LA CABECERA. Va pegada arriba y con fondo propio: sobre la pantalla de la aplicación, sin fondo,
 * el camino se mezclaría con la barra de la propia aplicación -- que también es una barra con texto
 * pequeño arriba del todo, y se leerían como lo mismo.
 */
const Cabecera: React.FC<{ ubicacion: string; url: string }> = ({ ubicacion, url }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, 0, 18);

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: CABECERA_ALTO,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				paddingLeft: 64,
				background: `linear-gradient(180deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.82) 62%, rgba(255,255,255,0) 100%)`,
				fontFamily: FUENTE,
				opacity: a,
				transform: `translateY(${interpolate(a, [0, 1], [-18, 0])}px)`,
				zIndex: 30,
			}}
		>
			<div style={{ fontSize: 30, fontWeight: 700, color: TINTA, letterSpacing: -0.3 }}>{ubicacion}</div>
			<div style={{ fontSize: 21, color: TINTA_SUAVE, marginTop: 5, fontVariantNumeric: 'tabular-nums' }}>{url}</div>
		</div>
	);
};

/*
 * EL RÓTULO. Abajo a la izquierda, sobre una tarjeta de papel: un texto suelto sobre una tabla
 * blanca se lee a trozos, según lo que tenga detrás cada renglón.
 *
 * UN TEXTO A LA VEZ. No hay sitio para dos, y no es por espacio: dos carteles compiten y se pierde
 * el que importaba.
 */
const Rotulo: React.FC<{ texto: string; cual: number; cuantos: number; vivo: number; entrada: number }> = ({
	texto, cual, cuantos, vivo, entrada,
}) => (
	<div
		style={{
			position: 'absolute',
			left: 64,
			right: 64,
			bottom: 56,
			height: ROTULO_ALTO - 56,
			display: 'flex',
			alignItems: 'flex-end',
			fontFamily: FUENTE,
			opacity: entrada,
			zIndex: 30,
		}}
	>
		<div
			style={{
				maxWidth: 1360,
				background: PAPEL,
				borderRadius: 16,
				padding: '26px 34px',
				boxShadow: '0 18px 48px rgba(15, 28, 52, .18), 0 2px 6px rgba(15, 28, 52, .06)',
			}}
		>
			<div style={{ fontSize: 19, fontWeight: 700, color: TINTA_SUAVE, letterSpacing: 1.4, textTransform: 'uppercase' }}>
				Paso {cual} de {cuantos}
			</div>
			<div
				style={{
					fontSize: 40,
					lineHeight: 1.22,
					fontWeight: 600,
					color: TINTA,
					marginTop: 10,
					opacity: vivo,
					transform: `translateY(${(1 - vivo) * 8}px)`,
				}}
			>
				{texto}
			</div>
		</div>
	</div>
);
