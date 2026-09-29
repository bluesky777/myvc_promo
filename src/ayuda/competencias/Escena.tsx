import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Escena as EscenaPlanilla } from '../../notas/Escena';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { ACADEMICO, MEDIDAS } from '../medidas';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE, HUECO_DE_LA_AYUDA, SUBE_LA_PANTALLA } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Boletin } from './Boletin';
import { DESEMPENOS, INFORMES_TEXTOS } from './datos';
import { Informes } from './Informes';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { MisDesempenos } from './MisDesempenos';
import { Unidades } from './Unidades';
import {
	AVISO_DURA, CIERRE, DURACION, HOJA_DE_CERCA, HOJA_EN_EL_FOTOGRAMA, PASOS, PUNTOS, RITMO_PLANILLA,
	T, TARJETA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CALIFICAR POR COMPETENCIAS», ENTERO. Seis actos y cuatro pantallas dentro de la cáscara, más la
 * planilla de siempre y la hoja del boletín.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA CÁSCARA SE VA Y VUELVE, Y ESO ES NUEVO RESPECTO AL PRIMER VÍDEO
 *
 * Allí se entraba una vez en la pantalla y ya. Aquí hay que salir a la planilla --que es un plano
 * suelto, como en el promocional-- y luego volver al catálogo de informes. Se hace con el mismo
 * movimiento en los dos sentidos: **la cáscara se acerca y se apaga al salir, y vuelve alejándose
 * al entrar**. Un corte seco entre esos dos encuadres se leería como dos vídeos pegados.
 *
 * Y EL BOLETÍN NO LLEVA VELO. Es una hoja de papel: un recuadro claro sobre un papel apagado se lee
 * como una mancha en la hoja, no como «mira aquí». Lo que lo señala es el rótulo.
 */

export const EscenaCompetencias: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < T.entraLaPlanilla && <ActoEnLaCascara frame={frame} fps={fps} />}

			{/* La planilla de siempre, con su ritmo corto: viene sólo a decir que no cambia. */}
			{/*
			  * LA SECUENCIA DURA MÁS QUE EL PLANO: la planilla se recoge en su propio fotograma 311, y
			  * cortarla antes la borraría de un fotograma al siguiente con el panel todavía visible.
			  */}
			<Sequence from={T.entraLaPlanilla} durationInFrames={T.vuelveLaCascara - T.entraLaPlanilla + 70}>
				<EscenaPlanilla
					ritmo={RITMO_PLANILLA}
					avisoDura={AVISO_DURA}
					ajuste={{ escala: HUECO_DE_LA_AYUDA, y: SUBE_LA_PANTALLA }}
				/>
			</Sequence>

			{frame >= T.vuelveLaCascara && frame < T.entraElBoletin + 20 && <ActoDelCatalogo frame={frame} fps={fps} />}

			{frame >= T.entraElBoletin - 10 && <LaHoja frame={frame} />}

			<Foco
				recorte={paso?.foco ?? null}
				desde={paso?.desde ?? 0}
				hasta={paso?.focoHasta ?? acaba - 12}
			/>

			<Sonidos />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/*
 * LO QUE SUENA, además de los clics (que los pone el `Cursor`): el tecleo --una tecla cada pocos
 * fotogramas, alternando las tres-- y el aviso cuando la aplicación enseña algo: la franja ámbar del
 * periodo ajeno y el «Cambiadas» del lote en la planilla.
 */
const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
const tecleo = (desde: number, hasta: number, cada: number, clave: string) =>
	Array.from({ length: Math.floor((hasta - desde) / cada) + 1 }, (_, i) => (
		<Efecto key={`${clave}${i}`} cual={TECLAS[i % 3]} en={desde + i * cada} />
	));

const Sonidos: React.FC = () => (
	<>
		{/* El desempeño va a una letra por fotograma: suena una tecla cada cuatro. */}
		{tecleo(T.tecleaDesempeno, T.tecleaDesempeno + DESEMPENOS.find((d) => d.seEscribe)!.texto.length - 1, 4, 'd')}
		{/* La búsqueda va a tres fotogramas por letra: suena cada letra. */}
		{tecleo(T.tecleaBusqueda, T.tecleaBusqueda + (INFORMES_TEXTOS.busqueda.length - 1) * 3, 3, 'b')}
		<Efecto cual="aviso" en={T.pulsaPeriodo3 + 4} />
		{RITMO_PLANILLA.TECLEOS.flatMap((t, i) =>
			[...t.valor].map((_, k) => <Efecto key={`p${i}-${k}`} cual={TECLAS[k % 3]} en={T.entraLaPlanilla + t.empieza + k * RITMO_PLANILLA.POR_TECLA} />),
		)}
		<Efecto cual="aviso" en={T.entraLaPlanilla + RITMO_PLANILLA.CONFIRMA} />
	</>
);

/*
 * ACTO 6: EL BOLETÍN. DOS PLANOS QUIETOS, ENCADENADOS.
 *
 * Primero la hoja entera --tres segundos, lo que se tarda en reconocer que eso es un boletín-- y
 * después el plano corto de la primera área. El corto hace falta porque una Letter entera en 1080p
 * deja el renglón del desempeño en ocho píxeles: sin él, el vídeo enseñaría el papel y no dejaría
 * leer lo único que ha venido a contar.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ NO ES UN ACERCAMIENTO, QUE ES LO QUE HABÍA
 *
 * Porque **parpadea**. Un boletín se sostiene con filetes de 0,8 y 1,2 px, y a la escala del plano
 * general eso es medio píxel: al reescalar poco a poco, cada filete se dibuja en unos fotogramas y
 * en otros no, y lo que se ve son líneas que saltan. Con dos planos quietos no hay nada que
 * redondear: **dos fotogramas seguidos de una pantalla quieta salen idénticos byte a byte**, está
 * medido. Sólo se mueve la opacidad, y la opacidad no mueve un filete de sitio.
 *
 * Y un encadenado entre dos encuadres de la MISMA hoja no es un corte seco: se lee como un cambio
 * de plano sobre lo mismo, que es justo lo que es.
 */
const LaHoja: React.FC<{ frame: number }> = ({ frame }) => {
	const cerca = interpolate(frame, [T.empiezaElAcercamiento, T.acabaElAcercamiento], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});

	return (
		<>
			{cerca < 1 && <Plano encuadre={HOJA_EN_EL_FOTOGRAMA} opacidad={1 - cerca} />}
			{cerca > 0 && <Plano encuadre={HOJA_DE_CERCA} opacidad={cerca} />}
		</>
	);
};

const Plano: React.FC<{ encuadre: { escala: number; x: number; y: number }; opacidad: number }> = ({
	encuadre, opacidad,
}) => (
	<div
		style={{
			position: 'absolute',
			left: encuadre.x,
			top: encuadre.y,
			transformOrigin: '0 0',
			transform: `scale(${encuadre.escala})`,
			opacity: opacidad,
		}}
	>
		<Boletin desde={T.entraElBoletin} />
	</div>
);

/*
 * ACTOS 1 A 3: «Mis asignaturas», «Unidades» y «Mis desempeños», las tres dentro de la cáscara y
 * con el menú abierto por Académico -- que es donde viven las tres.
 */
const ActoEnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const academico = entra(frame, fps, T.abreAcademico, 16);

	const senalada =
		frame >= T.llegaAcademico && frame < T.pulsaAcademico + 10
			? { seccion: ACADEMICO, hija: null }
			: frame >= T.llegaMisAsignaturas && frame < T.pulsaMisAsignaturas + 10
				? { seccion: ACADEMICO, hija: 0 }
				: frame >= T.llegaMisDesempenos && frame < T.pulsaMisDesempenos + 10
					? { seccion: ACADEMICO, hija: 1 }
					: null;

	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [T.seVaDesempenos, T.entraLaPlanilla], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<Ventana aparece={aparece} seVa={seVa}>
			<Cascara academico={academico} senalada={senalada}>
				{/*
				  * CADA PANTALLA SE QUEDA MONTADA HASTA QUE TERMINA DE IRSE, y no hasta que entra la
				  * siguiente. **Esto era el parpadeo**: «Unidades» empezaba a salir al pulsar el menú
				  * y se desmontaba diez fotogramas después, con sus filas todavía a media opacidad;
				  * media pantalla --341.935 píxeles, medidos entre el fotograma 798 y el 801--
				  * desaparecía de golpe, y lo que se veía era un salto de líneas.
				  *
				  * Ahora las dos conviven unos fotogramas: la que se va, encima y apagándose; la que
				  * llega, montándose debajo. Que es lo que hace la aplicación al cambiar de pantalla.
				  */}
				{frame >= T.montaMisAsignaturas && frame < T.montaUnidades + 50 && (
					<Sequence from={T.montaMisAsignaturas}>
						<MisAsignaturas
							salidaEn={T.pulsaUnidades - T.montaMisAsignaturas}
							senalada={frame >= T.llegaUnidades && frame < T.pulsaUnidades + 10 ? 1 : null}
						/>
					</Sequence>
				)}

				{frame >= T.montaUnidades && frame < T.montaDesempenos + 60 && (
					<Sequence from={T.montaUnidades}>
						<Unidades salidaEn={T.pulsaMisDesempenos - T.montaUnidades} />
					</Sequence>
				)}

				{frame >= T.montaDesempenos && (
					<Sequence from={T.montaDesempenos}>
						<MisDesempenos
							salidaEn={T.seVaDesempenos - T.montaDesempenos}
							tecleaDesde={T.tecleaDesempeno - T.montaDesempenos}
							anadeEn={T.anadeDesempeno - T.montaDesempenos}
							cambiaPeriodoEn={T.pulsaPeriodo3 - T.montaDesempenos}
						/>
					</Sequence>
				)}
			</Cascara>

			<Cursor
				puntos={[
					{ frame: T.cursorEntra, ...PUNTOS.entrada },
					{ frame: T.llegaAcademico, ...PUNTOS.academico },
					{ frame: T.llegaMisAsignaturas, ...PUNTOS.misAsignaturas },
					{ frame: T.llegaUnidades - 18, ...PUNTOS.misAsignaturas },
					{ frame: T.llegaUnidades, ...PUNTOS.botonUnidades },
					/*
					 * SE QUEDA QUIETO DONDE PULSÓ. Sin este punto, el puntero cruzaría la pantalla
					 * despacio durante los catorce segundos de «Unidades» -- y un puntero que se mueve
					 * solo se lee como que algo está pasando, justo mientras hay que leer un párrafo.
					 */
					{ frame: T.llegaMisDesempenos - 20, ...PUNTOS.botonUnidades },
					{ frame: T.llegaMisDesempenos, ...PUNTOS.misDesempenos },
				]}
				clics={[T.pulsaAcademico, T.pulsaMisAsignaturas, T.pulsaUnidades, T.pulsaMisDesempenos]}
				aparece={T.cursorEntra}
				sale={T.cursorSale}
				tam={34}
			/>

			{/*
			  * EL PUNTERO VUELVE PARA UNA SOLA COSA: pulsar el periodo 3. Es otro `Cursor` y no un
			  * punto más del anterior porque entre los dos hay veinte segundos de pantalla quieta, y
			  * un puntero que cruza despacio mientras hay que leer se lee como que algo está pasando.
			  */}
			<Cursor
				puntos={[
					{ frame: T.vuelveElCursor, x: PUNTOS.periodo3.x + 160, y: PUNTOS.periodo3.y + 180 },
					{ frame: T.llegaPeriodo3, ...PUNTOS.periodo3 },
				]}
				clics={[T.pulsaPeriodo3]}
				aparece={T.vuelveElCursor}
				sale={T.cursorSale3}
				tam={34}
			/>
		</Ventana>
	);
};

/* ACTO 5: el catálogo, al que se vuelve después del plano de la planilla. */
const ActoDelCatalogo: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const aparece = interpolate(frame, [T.vuelveLaCascara, T.montaInformes], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const seVa = interpolate(frame, [T.seVaInformes, T.entraElBoletin - 5], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<Ventana aparece={aparece} seVa={seVa} vuelve>
			{/*
			  * AQUÍ EL MENÚ VA CON ACADÉMICO CERRADO. La sección abierta se pinta en el color del
			  * colegio, y dejarla abierta mientras se está en Informes diría que la pantalla que se
			  * ve cuelga de Académico. En la aplicación la sección se quedaría abierta; en un vídeo
			  * eso es una pista falsa, y la pista es lo único que el vídeo está enseñando.
			  */}
			<Cascara academico={0} senalada={null}>
				<Sequence from={T.montaInformes}>
					<Informes
						salidaEn={T.seVaInformes - T.montaInformes}
						tecleaDesde={T.tecleaBusqueda - T.montaInformes}
						fichaDesde={T.sale_la_ficha - T.montaInformes}
					/>
				</Sequence>
			</Cascara>

			<Cursor
				puntos={[
					{ frame: T.cursorEntra2, ...PUNTOS.entrada2 },
					{ frame: T.llegaCargar, ...PUNTOS.cargar },
				]}
				clics={[T.pulsaCargar]}
				aparece={T.cursorEntra2}
				sale={T.cursorSale2}
				tam={34}
			/>
		</Ventana>
	);
};

/*
 * LA VENTANA: dos capas, como en el primer vídeo. La de fuera coloca la aplicación en el fotograma
 * y hace el acercamiento; la de dentro la encoge desde su esquina, y por eso las coordenadas del
 * puntero y del foco siguen siendo las de la aplicación.
 *
 * `vuelve` invierte el movimiento: en vez de acercarse al irse, **llega alejándose**. Es lo que
 * hace que volver al catálogo después de la planilla se lea como salir de una pantalla y no como
 * entrar en otra distinta.
 */
const Ventana: React.FC<{ aparece: number; seVa: number; vuelve?: boolean; children: React.ReactNode }> = ({
	aparece, seVa, vuelve = false, children,
}) => (
	<AbsoluteFill>
		<div
			style={{
				position: 'absolute',
				left: ORIGEN.x,
				top: ORIGEN.y,
				width: MEDIDAS.ancho * ESCALA_CASCARA,
				height: MEDIDAS.alto * ESCALA_CASCARA,
				transformOrigin: '50% 45%',
				transform: `scale(${(vuelve ? interpolate(aparece, [0, 1], [1.07, 1]) : 1) * (1 + seVa * 0.07)})`,
				opacity: aparece * (1 - seVa),
			}}
		>
			<div
				style={{
					position: 'relative',
					width: MEDIDAS.ancho,
					height: MEDIDAS.alto,
					transformOrigin: '0 0',
					transform: `scale(${ESCALA_CASCARA})`,
				}}
			>
				{children}
			</div>
		</div>
	</AbsoluteFill>
);

export const DURACION_COMPETENCIAS = DURACION;
export const CUANTOS_DESEMPENOS_SE_ESCRIBEN = DESEMPENOS.length;
