import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS, NOTAS_PERDIDAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { LA_QUE_SE_ABRE } from '../planilla/datos';
import { Definitivas, FILAS_DENTRO } from './Definitivas';
import { NotasPerdidas } from './NotasPerdidas';
import { LA_QUE_SE_CAMBIA } from './datos';
import { AVISO_DURA, CIERRE, FOCOS, IDA, LISTA, LLEGADA, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 1: encadena, no dibuja. La cáscara con «Notas perdidas» y luego «Mis asignaturas»; al
 * pulsar «Definitivas» la cáscara se acerca y se apaga, igual que al abrir la planilla en su
 * vídeo, y la tabla de definitivas se monta a pantalla completa.
 */

export const EscenaCierre1: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < IDA.entranLasDefinitivas && <EnLaCascara frame={frame} fps={fps} />}

			<Sequence from={IDA.entranLasDefinitivas}>
				<Definitivas />
			</Sequence>

			{/* El primer foco de Definitivas espera a que estén todas las filas: si no, recorta filas vacías. */}
			<Foco
				recorte={paso?.foco ?? null}
				desde={paso?.foco === FOCOS.autoYFinal ? IDA.entranLasDefinitivas + FILAS_DENTRO : paso?.desde ?? 0}
				hasta={paso?.focoHasta ?? acabaElPaso - 10}
			/>

			{/* El aviso va sobre el fotograma y no dentro de la cáscara: así sale al tamaño del de la planilla. */}
			<Sequence from={LISTA.aviso} durationInFrames={AVISO_DURA + 20}>
				<Aviso texto={`Cambiada: ${LA_QUE_SE_CAMBIA.valor}`} desde={0} dura={AVISO_DURA} />
			</Sequence>

			{/* Las dos teclas de «65» y el aviso de la aplicación. */}
			{Array.from(LA_QUE_SE_CAMBIA.valor, (_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={LISTA.empieza + i * LISTA.porTecla} />
			))}
			<Efecto cual="aviso" en={LISTA.aviso} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const academico = entra(frame, fps, LLEGADA.abreAcademico, 16);

	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaNotasPerdidas && frame < LLEGADA.pulsaNotasPerdidas + 10
			? { seccion: ACADEMICO, hija: NOTAS_PERDIDAS }
			: frame >= IDA.llegaMisAsignaturas && frame < IDA.pulsaMisAsignaturas + 10
				? { seccion: ACADEMICO, hija: MIS_ASIGNATURAS }
				: null;

	const filaSenalada = frame >= IDA.llegaBoton && frame < IDA.pulsaBoton + 10 ? LA_QUE_SE_ABRE : null;

	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [IDA.seVaLaCascara, IDA.entranLasDefinitivas], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	/* Se quita al montar la siguiente, que espera a que la salida de esta haya acabado entera. */
	const conLaLista = frame >= LLEGADA.montaLista && frame < IDA.montaMisAsignaturas;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					transformOrigin: '50% 45%',
					transform: `scale(${1 + seVa * 0.07})`,
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
					<Cascara academico={academico} senalada={senalada}>
						{conLaLista && (
							<Sequence from={LLEGADA.montaLista}>
								<NotasPerdidas
									salidaEn={IDA.pulsaMisAsignaturas - LLEGADA.montaLista}
									enfocada={{ desde: LISTA.pulsaCasilla - LLEGADA.montaLista, hasta: IDA.sueltaCasilla - LLEGADA.montaLista }}
									tecleo={{ empieza: LISTA.empieza - LLEGADA.montaLista, porTecla: LISTA.porTecla }}
								/>
							</Sequence>
						)}
						{frame >= IDA.montaMisAsignaturas && (
							<Sequence from={IDA.montaMisAsignaturas}>
								<MisAsignaturas salidaEn={IDA.pulsaBoton - IDA.montaMisAsignaturas} senalada={filaSenalada} />
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
							{ frame: LLEGADA.llegaAcademico, ...PUNTOS.academico },
							{ frame: LLEGADA.llegaNotasPerdidas, ...PUNTOS.notasPerdidas },
							{ frame: LLEGADA.pulsaNotasPerdidas + 20, ...PUNTOS.notasPerdidas },
							{ frame: LISTA.llegaCasilla, ...PUNTOS.casilla },
							{ frame: LISTA.pulsaCasilla + 8, ...PUNTOS.casilla },
							/* Se aparta un poco para no tapar lo que se escribe, y espera ahí. */
							{ frame: LISTA.empieza - 10, x: PUNTOS.casilla.x + 70, y: PUNTOS.casilla.y + 40 },
							{ frame: IDA.sueltaCasilla, x: PUNTOS.casilla.x + 70, y: PUNTOS.casilla.y + 40 },
							{ frame: IDA.llegaMisAsignaturas, ...PUNTOS.misAsignaturas },
							{ frame: IDA.llegaBoton - 20, ...PUNTOS.misAsignaturas },
							{ frame: IDA.llegaBoton, ...PUNTOS.botonDefinitivas },
						]}
						clics={[LLEGADA.pulsaAcademico, LLEGADA.pulsaNotasPerdidas, LISTA.pulsaCasilla, IDA.pulsaMisAsignaturas, IDA.pulsaBoton]}
						aparece={LLEGADA.cursorEntra}
						sale={IDA.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
