import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ANCHO, INFORMES_ALTO, INFORMES_TEXTOS } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CATÁLOGO DE INFORMES, **sólo el trozo que este vídeo usa**: el buscador, la ficha que aparece
 * al teclear «competencias» y el configurador de la derecha.
 *
 * NO SE DIBUJA LA PANTALLA ENTERA a propósito. Tiene nueve familias con sus cuentas, la tira de «lo
 * que sacaste esta semana» y treinta y una fichas más, y todo eso aquí sería ruido: el vídeo pasa
 * por aquí ocho segundos para enseñar **cómo se encuentra este papel**, no para enseñar el
 * catálogo. Cuando se haga el vídeo del catálogo --está en el plan, ola 1--, esa pantalla se dibuja
 * entera y ésta se tira.
 *
 * LO QUE SÍ TIENE QUE SER EXACTO es lo que el vídeo afirma: que se busca por la palabra
 * «competencias», que el configurador pregunta **dos** cosas --para quién y qué grupo-- y que
 * **el periodo no se pregunta**: sale el que el colegio tiene abierto. Quien vaya a repetirlo
 * buscará el desplegable del periodo, y hay que decirle que no existe.
 */

const I = INFORMES_ALTO;

const TITULO = 6;

export const Informes: React.FC<{
	salidaEn: number;
	/** Cuándo empieza a teclearse «competencias» en el buscador. */
	tecleaDesde: number;
	/** Cuándo aparece la ficha, ya filtrada. */
	fichaDesde: number;
}> = ({ salidaEn, tecleaDesde, fichaDesde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titulo = INFORMES_TEXTOS.titulo;
	const cursorTitulo = escribiendo(frame, titulo, TITULO, 2) && frame % 20 < 12;

	const buscado = escrito(frame, INFORMES_TEXTOS.busqueda, tecleaDesde, 3);
	const tecleando = escribiendo(frame, INFORMES_TEXTOS.busqueda, tecleaDesde, 3) && frame % 18 < 11;

	const fuera = seVa(frame, 0, salidaEn, 4);
	const ficha = entra(frame, fps, fichaDesde, 16);

	return (
		<div style={{ width: ANCHO, height: '100%', padding: `${I.arriba}px ${I.lados}px`, boxSizing: 'border-box', display: 'flex', gap: I.huecoConfig }}>
			<div style={{ flex: 1, opacity: 1 - fuera }}>
				<div style={{ height: I.titulo }}>
					<div style={{ fontSize: 28, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
						{escrito(frame, titulo, TITULO, 2)}
						<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
					</div>
				</div>

				<div
					style={{
						height: I.buscador,
						marginBottom: I.huecoTrasBuscador,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: '0 18px',
						boxSizing: 'border-box',
						borderRadius: 10,
						border: `1px solid ${buscado ? ACENTO : BORDE}`,
						boxShadow: buscado ? `0 0 0 3px ${ACENTO}22` : undefined,
						background: SUPERFICIE,
						fontSize: 18,
						color: buscado ? TEXTO : TEXTO_TENUE,
						opacity: llega(frame, fps, 0, 16, 6).opacidad,
						whiteSpace: 'pre',
					}}
				>
					<Lupa />
					{buscado || 'Busca por nombre, por para qué sirve, o por como lo llames tú'}
					<span style={{ opacity: tecleando ? 1 : 0 }}>|</span>
				</div>

				{/*
				  * LA FICHA. Sale con su diana --el icono propio del boletín por competencias-- y con
				  * su «para qué» debajo del nombre, que es lo que hace que se encuentre sin saber que
				  * se llama «tipo 6».
				  */}
				<div
					style={{
						height: I.ficha,
						display: 'flex',
						alignItems: 'center',
						gap: 18,
						padding: '0 22px',
						boxSizing: 'border-box',
						borderRadius: 12,
						border: `1px solid ${ACENTO}`,
						background: SUPERFICIE,
						boxShadow: `0 0 0 3px ${ACENTO}18`,
						opacity: ficha,
						transform: `translateY(${(1 - ficha) * 12}px)`,
					}}
				>
					<Diana />
					<div style={{ flex: 1 }}>
						<div style={{ fontSize: 21, fontWeight: 700, color: TEXTO }}>{INFORMES_TEXTOS.fichaNombre}</div>
						<div style={{ fontSize: 15, lineHeight: 1.35, color: TEXTO_TENUE, marginTop: 6 }}>
							{INFORMES_TEXTOS.fichaPara}
						</div>
					</div>
				</div>
			</div>

			{/* ── El configurador: dos preguntas, y el periodo no es ninguna de las dos. ──────── */}
			<div
				style={{
					width: I.config,
					padding: 20,
					boxSizing: 'border-box',
					borderRadius: 12,
					border: `1px solid ${BORDE}`,
					background: SUPERFICIE,
					opacity: ficha * (1 - fuera),
				}}
			>
				<Rotulo>{INFORMES_TEXTOS.paraQuien}</Rotulo>
				<div style={{ display: 'flex', marginTop: 8, borderRadius: 8, border: `1px solid ${BORDE}`, overflow: 'hidden' }}>
					{INFORMES_TEXTOS.opcionesDestinatario.map((o, i) => (
						<div
							key={o}
							style={{
								/*
								 * LAS DOS MITADES MIDEN LO MISMO Y EL TEXTO PARTE EN DOS RENGLONES SI HACE
								 * FALTA. «Los alumnos que marque» no cabe en una línea a este ancho, y
								 * dejándolo suelto se salía del recuadro y pisaba al vecino.
								 */
								flex: 1,
								minHeight: 46,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								textAlign: 'center',
								padding: '0 8px',
								boxSizing: 'border-box',
								fontSize: 13,
								lineHeight: 1.2,
								fontWeight: 600,
								color: i === 0 ? '#fff' : TEXTO_TENUE,
								background: i === 0 ? ACENTO : SUPERFICIE,
							}}
						>
							{o}
						</div>
					))}
				</div>

				<div style={{ marginTop: 18 }}>
					<Rotulo>{INFORMES_TEXTOS.grupo}</Rotulo>
					<div
						style={{
							height: 40,
							marginTop: 8,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '0 12px',
							borderRadius: 8,
							border: `1px solid ${BORDE}`,
							fontSize: 16,
							color: TEXTO,
						}}
					>
						9°B
						<span style={{ color: TEXTO_TENUE, fontSize: 13 }}>▾</span>
					</div>
				</div>

				<div style={{ fontSize: 13, color: TEXTO_TENUE, marginTop: 14, lineHeight: 1.35 }}>
					{INFORMES_TEXTOS.periodoFijo}
				</div>

				<div
					style={{
						height: 44,
						marginTop: 18,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 8,
						background: ACENTO,
						color: '#fff',
						fontSize: 16,
						fontWeight: 600,
					}}
				>
					{INFORMES_TEXTOS.cargar}
				</div>
			</div>
		</div>
	);
};

const Rotulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ fontSize: 13, fontWeight: 700, color: TEXTO_TENUE, letterSpacing: 0.8, textTransform: 'uppercase' }}>
		{children}
	</div>
);

const Lupa: React.FC = () => (
	<svg width="20" height="20" viewBox="0 0 20 20">
		<circle cx="8.6" cy="8.6" r="5.4" fill="none" stroke="#8c8c8c" strokeWidth="1.7" />
		<path d="M12.6 12.6 L17 17" stroke="#8c8c8c" strokeWidth="1.7" strokeLinecap="round" />
	</svg>
);

/* El icono de la ficha: tres círculos concéntricos, como en el catálogo de la aplicación. */
const Diana: React.FC = () => (
	<svg width="46" height="46" viewBox="0 0 46 46">
		<circle cx="23" cy="23" r="21" fill={`${ACENTO}14`} />
		<circle cx="23" cy="23" r="14" fill="none" stroke={ACENTO} strokeWidth="2" opacity="0.55" />
		<circle cx="23" cy="23" r="7.5" fill="none" stroke={ACENTO} strokeWidth="2" opacity="0.8" />
		<circle cx="23" cy="23" r="2.6" fill={ACENTO} />
	</svg>
);
