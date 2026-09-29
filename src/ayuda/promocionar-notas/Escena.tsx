import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { AvisoApp } from '../comun-directivo/AvisoApp';
import { EnLaCascara } from '../comun-directivo/Escenario';
import { abiertaEn, avance, entre, senaladaEn } from '../comun-directivo/lugar';
import { EL_ALUMNO } from './datos';
import { AVISO, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';
import { DialogoCopia, PantallaPromocionar } from './Pantalla';

/* «PROMOCIONAR NOTAS»: encadena, no dibuja. Una sola pantalla, y el diálogo encima. */

export const EscenaPromocionar: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, f);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = abiertaEn(f, fps, [{ seccion: 'Académico', abre: T.abreAca }]);
	const senalada = senaladaEn(f, [
		{ desde: T.llegaAca, hasta: T.pulsaAca + 10, seccion: 'Académico', hija: null },
		{ desde: T.llegaEntrada, hasta: T.pulsaEntrada + 10, seccion: 'Académico', hija: 'Promocionar notas' },
	]);

	const cierraSel = interpolate(f, [T.pulsaOpcion + 2, T.pulsaOpcion + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const dialogo = f < T.abreDialogo ? 0 : entra(f, fps, T.abreDialogo, 12) * (1 - avance(f, T.cierraDialogo, T.cierraDialogo + 10));

	const e = {
		desplegable: f >= T.abreAlumno ? entra(f, fps, T.abreAlumno, 10) * cierraSel : 0,
		resaltada: f >= T.llegaOpcion - 8 ? EL_ALUMNO : null,
		alumno: f >= T.ubicaciones ? avance(f, T.ubicaciones, T.ubicaciones + 16) + 0.001 : 0,
		periodoOrigen: f >= T.pulsaOrigen + 2,
		periodoDestino: f >= T.pulsaDestino + 2,
		tabla: avance(f, T.tabla, T.tabla + 14),
		encimaCopiar: entre(f, T.llegaCopiar, T.pulsaCopiar + 8),
		dialogo,
		encimaConfirmar: entre(f, T.llegaConfirmar, T.pulsaConfirmar + 8),
		copiado: f >= T.copiado,
		encimaPeriodo: entre(f, T.llegaOrigen, T.pulsaOrigen + 2) ? ('origen' as const) : entre(f, T.llegaDestino, T.pulsaDestino + 2) ? ('destino' as const) : null,
	};

	const P = PUNTOS;
	const reposo = { x: 1000, y: 360 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={abierta}
				senalada={senalada}
				opacidad={entra(f, fps, 0, 14)}
				encima={<DialogoCopia t={e.dialogo} encima={e.encimaConfirmar} />}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaAca, ...P.academico },
						{ frame: T.llegaEntrada, ...P.promocionar },
						{ frame: T.pulsaEntrada + 30, ...P.promocionar },
						{ frame: T.pulsaEntrada + 100, ...reposo },
						{ frame: T.llegaAlumno - 30, ...reposo },
						{ frame: T.llegaAlumno, ...P.alumno },
						{ frame: T.pulsaAlumno + 6, ...P.alumno },
						{ frame: T.llegaOpcion, ...P.opcion },
						{ frame: T.pulsaOpcion + 30, ...P.opcion },
						{ frame: T.llegaOrigen - 40, ...reposo },
						{ frame: T.llegaOrigen, ...P.origen },
						{ frame: T.pulsaOrigen + 30, ...P.origen },
						{ frame: T.llegaDestino, ...P.destino },
						{ frame: T.pulsaDestino + 40, ...P.destino },
						{ frame: T.pulsaDestino + 100, x: P.destino.x + 60, y: P.destino.y - 140 },
						{ frame: T.llegaCopiar - 40, x: P.destino.x + 60, y: P.destino.y - 140 },
						{ frame: T.llegaCopiar, ...P.copiar },
						{ frame: T.pulsaCopiar + 40, ...P.copiar },
						{ frame: T.llegaConfirmar, ...P.confirmar },
						{ frame: T.pulsaConfirmar + 30, ...P.confirmar },
					],
					clics: [T.pulsaAca, T.pulsaEntrada, T.pulsaAlumno, T.pulsaOpcion, T.pulsaOrigen, T.pulsaDestino, T.pulsaCopiar, T.pulsaConfirmar],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{f >= T.monta && <PantallaPromocionar e={e} opacidad={entra(f, fps, T.monta, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="aviso" en={AVISO.desde} />
			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20} style={{ zIndex: 30 }}>
				<AvisoApp texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
