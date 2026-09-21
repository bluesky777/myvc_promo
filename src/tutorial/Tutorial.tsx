import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	Sequence,
	continueRender,
	delayRender,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import { ACENTO, FUENTE, PERDIDA_LINEA, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';

/*
 * ═════════════════════════════════════════════════════════════════════════════════════════════
 * EL TUTORIAL: fotos de la aplicación DE VERDAD, con acercamiento, rótulo y sin voz.
 *
 * Las fotos las saca `myvc_front/scripts/videos/capturar.mjs`, que conduce la aplicación contra el
 * docker y deja en `public/tutoriales/<slug>/` un PNG por plano y un `tomas.json` con, por cada
 * uno, el rectángulo al que hay que acercarse y lo que dice.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ FOTOS Y NO SE DIBUJA LA APLICACIÓN, QUE ES LO QUE HACE EL RESTO DE ESTE REPO
 *
 * Porque **son dos productos distintos**. Los clips de `src/notas`, `src/horarios` y los demás son
 * el vídeo promocional, y ahí la regla es la de `LEEME.md:306`: *«los estilos se copian; el sitio y
 * el tamaño, no»*. Eso vale para vender y no vale para enseñar: un tutorial dice «pulsa aquí», y
 * «aquí» tiene que ser el sitio de verdad, con el menú de verdad y el botón donde de verdad está.
 *
 * Lo que sí es de Remotion es todo lo demás --el encuadre, el acercamiento, el rótulo, el ritmo--,
 * que es justo lo que una grabación de pantalla no da.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * EL ACERCAMIENTO ES EL MOTIVO DE QUE ESTO EXISTA
 *
 * La primera versión era una grabación de 1280×720, y sobre eso no se puede acercar: ampliar es
 * ampliar píxeles. Las fotos se sacan a `deviceScaleFactor: 2` --3200×1800--, así que sobre un
 * lienzo de 1920×1080 se entra hasta el 200 % sin perder nitidez, y una casilla de nota se lee en
 * un móvil.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * SIN VOZ, EL RÓTULO MANDA. Cada plano dura lo que se tarda en leerlo (lo calcula el capturador),
 * y por eso los textos son más cortos que los de la versión locutada: leer cuesta más que escuchar.
 */

export const FPS = 30;

/** Lo que el `tomas.json` trae por cada plano. */
export interface Toma {
	imagen: string;
	titulo: string | null;
	dice: string | null;
	/** La miga: «Panel › Informes». Es lo que enseña POR DÓNDE se entra. */
	donde: string | null;
	foco: Caja | null;
	marcas: Caja[];
	dura: number;
}

export interface Caja { x: number; y: number; w: number; h: number }

export interface Guion {
	slug: string;
	/** El tamaño de la ventana con la que se capturó, en píxeles de CSS. */
	ancho: number;
	alto: number;
	tomas: Toma[];
}

/* El rótulo de abajo, la miga de arriba, y lo que queda en medio para la imagen. */
const BANDA = 188;
const MARGEN = 44;
/*
 * LA MIGA VA EN SU PROPIA FRANJA, FUERA DE LA FOTO. Estaba flotando sobre la esquina superior
 * izquierda y ahí tapa cosas: en el plano del catálogo se comía el nombre del colegio, y con el
 * acercamiento puesto se comía la primera asignatura de la hoja. Un rótulo que tapa justo lo que
 * el plano viene a enseñar es peor que no tenerlo.
 */
const CEJA = 78;
const SOLAPE = 9;   // fotogramas de fundido entre planos

/**
 * Lee el guion y fija la duración. Va aquí y no en `Root.tsx` porque el número de planos y lo que
 * dura cada uno los decide el capturador: escribirlos a mano en la composición sería tener el mismo
 * dato en dos sitios, y uno de los dos se quedaría viejo.
 */
export const leerGuion = async (slug: string): Promise<Guion> => {
	const respuesta = await fetch(staticFile(`tutoriales/${slug}/tomas.json`));
	if (!respuesta.ok) {
		throw new Error(
			`no hay tomas de «${slug}». Sácalas primero:\n`
			+ `  cd ~/DESARROLLOS/myvc_front && node scripts/videos/capturar.mjs ${slug}`,
		);
	}

	return respuesta.json() as Promise<Guion>;
};

export const duracionDe = (guion: Guion): number =>
	Math.round(guion.tomas.reduce((t, toma) => t + toma.dura, 0) * FPS);

/*
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * UN PLANO
 */
const Plano: React.FC<{ guion: Guion; toma: Toma; indice: number }> = ({ guion, toma, indice }) => {
	const fotograma = useCurrentFrame();
	const { width, height } = useVideoConfig();

	const escenario = { w: width - MARGEN * 2, h: height - BANDA - CEJA - MARGEN };

	/* El plano general: la ventana entera dentro del escenario. */
	const abierto = Math.min(escenario.w / guion.ancho, escenario.h / guion.alto);

	/*
	 * EL ACERCAMIENTO SE CALCULA, NO SE ELIGE. El rectángulo del `foco` tiene que ocupar el 80 % del
	 * escenario: si es una casilla de nota eso son ocho aumentos y si es el menú lateral son dos.
	 * Escribir «zoom: 2.5» en el guion sería acertar a ojo con cada plano.
	 *
	 * El tope de 2,6 no es estético: las fotos son del doble de tamaño, así que por encima de ×2 ya
	 * se estarían ampliando píxeles, que es exactamente lo que esta versión venía a evitar.
	 */
	const cerrado = toma.foco
		? Math.min(2.6, Math.max(abierto, Math.min(escenario.w * 0.8 / toma.foco.w, escenario.h * 0.8 / toma.foco.h)))
		: abierto;

	const duracion = Math.round(toma.dura * FPS);

	/*
	 * Entra abierto, se acerca, y se queda. El acercamiento empieza con un respiro --medio segundo--
	 * para que dé tiempo a ver el plano general: si se cierra desde el fotograma cero, el plano
	 * general no existe y se pierde justo lo que se pidió, que se entienda dónde se está.
	 */
	const avance = toma.foco
		? interpolate(fotograma, [FPS * 0.5, FPS * 1.7], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.33, 0, 0.2, 1),
		})
		: 0;

	/* Sin foco, una deriva lentísima: un plano completamente quieto parece un vídeo congelado. */
	const deriva = toma.foco ? 1 : interpolate(fotograma, [0, duracion], [1, 1.035], { extrapolateRight: 'clamp' });
	const escala = (abierto + (cerrado - abierto) * avance) * deriva;

	/* El centro al que se mira: el del `foco` cuando lo hay, el de la ventana cuando no. */
	const mira = toma.foco
		? { x: toma.foco.x + toma.foco.w / 2, y: toma.foco.y + toma.foco.h / 2 }
		: { x: guion.ancho / 2, y: guion.alto / 2 };

	/*
	 * EL CENTRO SE SUJETA A LA FOTO, y esto no es un adorno: sin ello el plano se va del encuadre.
	 *
	 * El `foco` sale de `getBoundingClientRect`, y un elemento puede ser MÁS ALTO QUE LA VENTANA:
	 * `myvc-menu` en el panel mide 1.193 px de alto sobre una ventana de 900, y su centro cae en
	 * y=701. Mirar ahí con la foto entera cabiendo en el escenario deja la foto colgando por arriba
	 * --el primer plano salió con media pantalla en blanco y el menú pegado al borde--.
	 *
	 * Así que el punto al que se mira se recorta para que la ventana visible no se salga de la foto.
	 * Cuando la foto es más pequeña que el escenario --que es lo que pasa al no acercarse-- se
	 * centra y ya está.
	 */
	const sujetar = (valor: number, medida: number, hueco: number) => {
		const mitad = hueco / escala / 2;

		return mitad * 2 >= medida ? medida / 2 : Math.min(Math.max(valor, mitad), medida - mitad);
	};

	const centro = {
		x: sujetar(guion.ancho / 2 + (mira.x - guion.ancho / 2) * avance, guion.ancho, escenario.w),
		y: sujetar(guion.alto / 2 + (mira.y - guion.alto / 2) * avance, guion.alto, escenario.h),
	};

	const entra = interpolate(fotograma, [0, SOLAPE], [0, 1], { extrapolateRight: 'clamp' });

	/* Los recuadros salen DESPUÉS del acercamiento: primero se llega, luego se señala. */
	const marca = interpolate(fotograma, [FPS * 1.5, FPS * 2.0], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{ opacity: entra }}>
			{/* El escenario recorta: al acercarse, la ventana se sale por los cuatro lados. */}
			<AbsoluteFill style={{ top: CEJA, left: MARGEN, width: escenario.w, height: escenario.h, overflow: 'hidden', borderRadius: 18 }}>
				<div
					style={{
						position: 'absolute',
						width: guion.ancho,
						height: guion.alto,
						left: escenario.w / 2,
						top: escenario.h / 2,
						transform: `scale(${escala}) translate(${-centro.x}px, ${-centro.y}px)`,
						transformOrigin: '0 0',
					}}
				>
					<Img src={staticFile(`tutoriales/${guion.slug}/${toma.imagen}`)} style={{ width: guion.ancho, height: guion.alto, display: 'block' }} />

					{toma.marcas.map((caja, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: caja.x - 3,
								top: caja.y - 3,
								width: caja.w + 6,
								height: caja.h + 6,
								/* El grosor se divide por la escala: un borde de 3 px acercado ×8 son 24 px
								 * y se come la casilla que está señalando. */
								border: `${3 / escala}px solid ${PERDIDA_LINEA}`,
								borderRadius: 6 / escala,
								opacity: marca,
								boxSizing: 'border-box',
							}}
						/>
					))}
				</div>
			</AbsoluteFill>

			{/* La miga, arriba: es lo que dice por dónde se entra. */}
			{toma.donde ? (
				<div
					style={{
						position: 'absolute',
						top: 20,
						left: MARGEN,
						padding: '8px 20px',
						borderRadius: 999,
						background: SUPERFICIE,
						boxShadow: '0 2px 10px rgba(0,0,0,.10)',
						font: `500 28px ${FUENTE}`,
						color: ACENTO,
						letterSpacing: '.01em',
					}}
				>
					{toma.donde}
				</div>
			) : null}

			<Rotulo guion={guion} toma={toma} indice={indice} />
		</AbsoluteFill>
	);
};

const Rotulo: React.FC<{ guion: Guion; toma: Toma; indice: number }> = ({ guion, toma, indice }) => {
	const { width, height } = useVideoConfig();

	return (
		<div style={{ position: 'absolute', left: 0, top: height - BANDA, width, height: BANDA, padding: `22px ${MARGEN + 18}px`, boxSizing: 'border-box' }}>
			<div style={{ font: `700 46px ${FUENTE}`, color: TEXTO, marginBottom: 10, letterSpacing: '-.01em' }}>
				{toma.titulo}
			</div>
			<div style={{ font: `400 30px ${FUENTE}`, color: TEXTO_TENUE, lineHeight: 1.3 }}>
				{toma.dice}
			</div>

			{/* Cuántos planos van: sin voz, es lo único que dice cuánto queda. */}
			<div style={{ position: 'absolute', right: MARGEN + 18, top: 30, display: 'flex', gap: 7 }}>
				{guion.tomas.map((_, i) => (
					<span
						key={i}
						style={{
							width: i === indice ? 26 : 9,
							height: 9,
							borderRadius: 999,
							background: i === indice ? ACENTO : '#d9dde5',
							transition: 'none',
						}}
					/>
				))}
			</div>
		</div>
	);
};

/*
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * EL VÍDEO
 */
export const Tutorial: React.FC<{ guion: Guion }> = ({ guion }) => {
	let desde = 0;

	return (
		<AbsoluteFill style={{ background: SUPERFICIE, fontFamily: FUENTE }}>
			{/* El fondo de la aplicación, para que la foto no flote sobre un blanco de la nada. */}
			<AbsoluteFill style={{ background: 'linear-gradient(160deg, #f6f8fd 0%, #eef2fb 60%, #e9f0f8 100%)' }} />

			{guion.tomas.map((toma, i) => {
				const duracion = Math.round(toma.dura * FPS);
				const arranca = desde;
				desde += duracion;

				/*
				 * EL SOLAPE SE LE QUITA AL PRINCIPIO Y NO AL FINAL. Con `durationInFrames + SOLAPE` el
				 * último plano se saldría del vídeo y Remotion lo recorta en seco; retrasando el
				 * arranque, el fundido ocurre DENTRO de lo que ya estaba contado.
				 */
				return (
					<Sequence key={toma.imagen} from={Math.max(0, arranca - SOLAPE)} durationInFrames={duracion + SOLAPE}>
						<Plano guion={guion} toma={toma} indice={i} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

/** El envoltorio que carga el guion en el estudio, donde no hay `calculateMetadata` que valga. */
export const TutorialDesdeDisco: React.FC<{ slug: string; guion?: Guion }> = ({ slug, guion }) => {
	const [cargado, setCargado] = React.useState<Guion | null>(guion ?? null);
	const [fallo, setFallo] = React.useState<string | null>(null);
	const [espera] = React.useState(() => delayRender(`tomas de ${slug}`));

	React.useEffect(() => {
		if (cargado) { continueRender(espera); return; }
		leerGuion(slug)
			.then((g) => { setCargado(g); continueRender(espera); })
			.catch((e: Error) => { setFallo(e.message); continueRender(espera); });
	}, [slug, cargado, espera]);

	if (fallo) {
		return (
			<AbsoluteFill style={{ background: '#fff', color: PERDIDA_LINEA, font: `500 32px ${FUENTE}`, padding: 80, whiteSpace: 'pre-wrap' }}>
				{fallo}
			</AbsoluteFill>
		);
	}

	return cargado ? <Tutorial guion={cargado} /> : <AbsoluteFill style={{ background: SUPERFICIE }} />;
};
