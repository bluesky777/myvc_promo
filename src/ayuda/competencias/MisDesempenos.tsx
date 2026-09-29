import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { FOCO } from '../tema';
import {
	ANCHO, CLASE, DESEMPENOS, DESEMPENOS_ALTO, DESEMPENOS_DEL_COLEGIO, DESEMPENOS_TEXTOS, MIS_CLASES, PASTILLA_CLASE,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS DESEMPEÑOS» — LA ÚNICA PANTALLA NUEVA DEL DOCENTE EN EL MODELO POR COMPETENCIAS.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES COSAS QUE ESTA PANTALLA TIENE QUE DEJAR CLARAS, Y LAS TRES ESTÁN DIBUJADAS
 *
 * 1. **El alcance no es el grupo, es la materia y el grado.** Se elige arriba, en la tira de clases.
 *    Dos grupos del mismo grado comparten las mismas filas.
 * 2. **El periodo de esta pantalla puede no ser el de la barra.** Cuando no coinciden, el botón del
 *    periodo se pinta en ÁMBAR y sale una franja que se queda. No es un aviso de cortesía: existe
 *    porque hubo docentes que borraron lo de un periodo pasado creyendo que era el siguiente.
 * 3. **Lo de «todos los grados» no sustituye a lo tuyo: se suma.** Es la regla contraria a la de la
 *    plantilla de notas, donde gana la fila más específica -- por eso va escrito en el propio
 *    bloque y por eso el vídeo lo repite.
 *
 * EL PUNTO BAJO EL NÚMERO DEL PERIODO es la prueba visual de la pantalla: relleno = ahí hay algo
 * escrito. Ocupa su hueco siempre, también vacío, para que la tira no baile al cambiar de clase.
 */

const D = DESEMPENOS_ALTO;

const TITULO = 6;
const BLOQUES = 18;
const PASO = 7;

export const MisDesempenos: React.FC<{
	salidaEn: number;
	/** Cuándo empieza a teclearse el desempeño nuevo en el hueco de abajo. */
	tecleaDesde: number;
	/** Y cuándo se pulsa «Añadir» y la fila aparece arriba, en la lista. */
	anadeEn: number;
	/** Cuándo se pulsa el periodo 3 -- el que no es el de la barra -- y con él salta la franja. */
	cambiaPeriodoEn: number;
}> = ({ salidaEn, tecleaDesde, anadeEn, cambiaPeriodoEn }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titulo = DESEMPENOS_TEXTOS.titulo;
	const cursor = escribiendo(frame, titulo, TITULO, 2) && frame % 20 < 12;
	const fuera = seVa(frame, 0, salidaEn, 4);

	/* Lo que lleva escrito el hueco de abajo. Se teclea rápido: es una frase larga. */
	const loQueSeTeclea = escrito(frame, DESEMPENOS[1].texto, tecleaDesde, 1);
	const tecleando = escribiendo(frame, DESEMPENOS[1].texto, tecleaDesde, 1) && frame % 18 < 11;

	/* La fila nueva sólo existe después de pulsar «Añadir». */
	const puestas = frame >= anadeEn ? DESEMPENOS : [DESEMPENOS[0]];

	/*
	 * EL PERIODO QUE SE ESTÁ MIRANDO. Empieza siendo el de la barra y a mitad se pulsa otro: eso es
	 * lo que hace saltar la franja, y es el error que la pantalla vino a evitar. La franja no sale
	 * «porque toca», sale porque los dos números dejaron de coincidir.
	 */
	const mirando = frame >= cambiaPeriodoEn ? CLASE.periodoAjeno : CLASE.periodo;
	const ajeno = mirando !== CLASE.periodoDeLaSesion;

	return (
		<div style={{ width: ANCHO, height: '100%', padding: `${D.arriba}px ${D.lados}px`, boxSizing: 'border-box' }}>
			<div style={{ height: D.titulo, opacity: 1 - fuera, transform: `translateY(${-fuera * 22}px)` }}>
				<div style={{ fontSize: 28, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
					{escrito(frame, titulo, TITULO, 2)}
					<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
				</div>
				<div style={{ fontSize: 15, lineHeight: 1.35, color: TEXTO_TENUE, marginTop: 8, maxWidth: 880 }}>
					{DESEMPENOS_TEXTOS.entradilla}
				</div>
			</div>

			{/* ── La tira de clases. La elegida va en el color del colegio. ─────────────────── */}
			<div style={{ height: D.tira, display: 'flex', alignItems: 'center', gap: PASTILLA_CLASE.hueco, opacity: llega(frame, fps, 0, BLOQUES, PASO).opacidad * (1 - fuera) }}>
				{MIS_CLASES.map((clase, i) => (
					<div
						key={clase}
						style={{
							height: 36,
							width: PASTILLA_CLASE.ancho,
							boxSizing: 'border-box',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 8,
							border: `1px solid ${i === 0 ? ACENTO : BORDE}`,
							background: i === 0 ? `${ACENTO}14` : SUPERFICIE,
							color: i === 0 ? ACENTO : TEXTO_TENUE,
							fontSize: 15,
							fontWeight: 600,
						}}
					>
						{clase}
					</div>
				))}
			</div>

			{/* ── Los periodos, con su punto. El elegido va en ámbar porque no es el de la barra. ── */}
			<div style={{ height: D.periodos, opacity: llega(frame, fps, 1, BLOQUES, PASO).opacidad * (1 - fuera) }}>
				<div style={{ fontSize: 13, fontWeight: 700, color: TEXTO_TENUE, letterSpacing: 0.8, textTransform: 'uppercase' }}>
					{DESEMPENOS_TEXTOS.rotuloPeriodos}
				</div>
				<div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
					{[1, 2, 3, 4].map((n) => {
						const elegido = n === mirando;
						/* El punto lleno: ahí hay algo escrito. El periodo 3 todavía no tiene nada. */
						const conAlgo = n <= 2;
						return (
							<div
								key={n}
								style={{
									width: 58,
									height: 34,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 3,
									borderRadius: 8,
									border: `${elegido ? 2 : 1}px solid ${elegido ? (ajeno ? FOCO : ACENTO) : BORDE}`,
									background: elegido ? `${ajeno ? FOCO : ACENTO}1f` : SUPERFICIE,
									color: elegido ? (ajeno ? '#8a6d10' : ACENTO) : TEXTO,
									fontSize: 15,
									fontWeight: elegido ? 700 : 500,
								}}
							>
								{n}
								<span
									style={{
										width: 5,
										height: 5,
										borderRadius: 3,
										background: conAlgo ? (elegido ? (ajeno ? '#8a6d10' : ACENTO) : TEXTO_TENUE) : 'transparent',
									}}
								/>
							</div>
						);
					})}
				</div>
			</div>

			{/* ── La franja del periodo ajeno. Ocupa su sitio siempre: si apareciera empujando, la
			      lista daría un salto justo cuando hay que leerla. ─────────────────────────────── */}
			<div style={{ height: D.franja, marginBottom: D.huecoTrasFranja }}>
				<div
					style={{
						height: D.franja,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						padding: '0 18px',
						boxSizing: 'border-box',
						borderRadius: 8,
						borderLeft: `4px solid ${FOCO}`,
						background: `${FOCO}1a`,
						opacity: entra(frame, fps, cambiaPeriodoEn + 4, 14) * (1 - fuera),
					}}
				>
					<div style={{ fontSize: 16, fontWeight: 700, color: '#7a5f0c' }}>{DESEMPENOS_TEXTOS.franjaTitulo}</div>
					<div style={{ fontSize: 15, color: '#7a5f0c', marginTop: 3 }}>{DESEMPENOS_TEXTOS.franjaCuerpo}</div>
				</div>
			</div>

			{/* ── La lista. Cada fila es un desempeño, con su lápiz y su papelera. ─────────────── */}
			{DESEMPENOS.map((d, i) => {
				const visible = puestas.includes(d);
				const nace = d.seEscribe ? entra(frame, fps, anadeEn, 16) : llega(frame, fps, 2 + i, BLOQUES, PASO).opacidad;
				const salida = estiloDeSalida(seVa(frame, i + 1, salidaEn, 4));

				return (
					<div
						key={d.texto}
						style={{
							display: 'flex',
							alignItems: 'center',
							height: D.fila,
							padding: '0 14px',
							boxSizing: 'border-box',
							borderRadius: 8,
							border: `1px solid ${BORDE}`,
							background: SUPERFICIE,
							marginBottom: D.huecoFila,
							fontSize: 16,
							color: TEXTO,
							opacity: visible ? nace * salida.opacidad : 0,
							transform: `translate(${salida.x}px, ${d.seEscribe ? interpolate(nace, [0, 1], [10, 0]) : 0}px)`,
						}}
					>
						<Asa />
						<span style={{ flex: 1, marginLeft: 12 }}>{d.texto}</span>
						<Lapiz />
						<Papelera />
					</div>
				);
			})}

			{/* ── El hueco de escribir uno nuevo. ─────────────────────────────────────────────── */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					height: D.formulario,
					marginTop: D.huecoTrasLista,
					marginBottom: D.huecoTrasFormulario,
					opacity: llega(frame, fps, 4, BLOQUES, PASO).opacidad * (1 - seVa(frame, 3, salidaEn, 4)),
				}}
			>
				<div
					style={{
						flex: 1,
						height: 46,
						display: 'flex',
						alignItems: 'center',
						padding: '0 14px',
						boxSizing: 'border-box',
						borderRadius: 8,
						border: `1px solid ${frame >= tecleaDesde && frame < anadeEn ? ACENTO : BORDE}`,
						boxShadow: frame >= tecleaDesde && frame < anadeEn ? `0 0 0 3px ${ACENTO}22` : undefined,
						background: SUPERFICIE,
						fontSize: 16,
						color: loQueSeTeclea && frame < anadeEn ? TEXTO : TEXTO_TENUE,
						whiteSpace: 'pre',
						overflow: 'hidden',
					}}
				>
					{/*
					  * AL AÑADIR, EL HUECO VUELVE A SU MARCADOR DE POSICIÓN, no a un blanco. Un campo
					  * vacío después de pulsar se lee como «se borró»; el marcador se lee como «listo
					  * para el siguiente», que es lo que acaba de pasar.
					  */}
					{frame >= anadeEn ? DESEMPENOS_TEXTOS.placeholder : loQueSeTeclea || DESEMPENOS_TEXTOS.placeholder}
					<span style={{ opacity: tecleando ? 1 : 0 }}>|</span>
				</div>
				<div
					style={{
						width: 160,
						height: 46,
						display: 'flex',
						alignItems: 'center',
						padding: '0 14px',
						boxSizing: 'border-box',
						borderRadius: 8,
						border: `1px solid ${BORDE}`,
						background: SUPERFICIE,
						fontSize: 15,
						color: TEXTO_TENUE,
					}}
				>
					{DESEMPENOS_TEXTOS.marca}
				</div>
				<div
					style={{
						height: 46,
						display: 'flex',
						alignItems: 'center',
						padding: '0 24px',
						borderRadius: 8,
						background: ACENTO,
						color: '#fff',
						fontSize: 16,
						fontWeight: 600,
					}}
				>
					{DESEMPENOS_TEXTOS.anadir}
				</div>
			</div>

			{/* ── Y lo de la coordinación, que se SUMA a lo tuyo. ─────────────────────────────── */}
			<div
				style={{
					height: D.planDeArea,
					padding: '14px 18px',
					boxSizing: 'border-box',
					borderRadius: 10,
					border: `1px dashed ${BORDE}`,
					background: '#f7f9fc',
					opacity: llega(frame, fps, 5, BLOQUES, PASO).opacidad * (1 - seVa(frame, 4, salidaEn, 4)),
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: TEXTO }}>
					<CandadoChico />
					{DESEMPENOS_TEXTOS.tituloPlanDeArea}
				</div>
				<div style={{ fontSize: 14, lineHeight: 1.35, color: TEXTO_TENUE, marginTop: 6 }}>
					{DESEMPENOS_TEXTOS.avisoPlanDeArea}
				</div>
				<div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
					{DESEMPENOS_DEL_COLEGIO.map((d) => (
						<div key={d.texto} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: TEXTO }}>
							<CandadoChico />
							{d.texto}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* El asa de arrastre: sólo se pinta donde se puede escribir, igual que en la aplicación. */
const Asa: React.FC = () => (
	<svg width="12" height="18" viewBox="0 0 12 18">
		{[0, 1, 2].map((f) => (
			<g key={f}>
				<circle cx="3.5" cy={4 + f * 5} r="1.3" fill="#b8c2cf" />
				<circle cx="8.5" cy={4 + f * 5} r="1.3" fill="#b8c2cf" />
			</g>
		))}
	</svg>
);

const Lapiz: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 12 }}>
		<path d="M3 15 L3.6 11.9 L11.8 3.7 a1.6 1.6 0 0 1 2.3 2.3 L6 14.2 Z" fill="none" stroke="#8c8c8c" strokeWidth="1.4" strokeLinejoin="round" />
	</svg>
);

const Papelera: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 18 18">
		<path d="M3.8 5.2 H14.2 M6.4 5.2 V3.6 h5.2 v1.6 M5.2 5.2 l.8 9.2 h6 l.8-9.2" fill="none" stroke="#8c8c8c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const CandadoChico: React.FC = () => (
	<svg width="13" height="13" viewBox="0 0 14 14">
		<rect x="3" y="6.2" width="8" height="5.6" rx="1.2" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.3" />
		<path d="M4.9 6.2 V4.6 a2.1 2.1 0 0 1 4.2 0 V6.2" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.3" />
	</svg>
);
