import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { entre } from '../montar-el-ano/tiempo';
import { EnLaCascara } from '../secretaria/EnLaCascara';
import { PERSONAS, dePersonas } from '../secretaria/menu';
import { Mensaje } from '../secretaria/piezas';
import { ACUDIENTES, CLAVE_NUEVA, CON_CUENTA, M, estadoClaveEn, estadoEn } from './datos';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';
import { DialogoClave, PantallaUsuarios } from './Usuarios';

/* «USUARIOS: ENTRAR AL SISTEMA»: una pantalla y su diálogo. */

export const EscenaUsuarios: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaPersonas, M.pulsaPersonas + 10)
		? { seccion: PERSONAS, hija: null }
		: entre(frame, M.llegaUsuarios, M.pulsaUsuarios + 10)
			? { seccion: PERSONAS, hija: dePersonas('Usuarios') }
			: null;

	const P = PUNTOS;
	const reposo = { x: 1250, y: 640 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={{ seccion: PERSONAS, t: entra(frame, fps, M.abrePersonas, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={frame >= M.abreClave && frame < M.cambiada + 8 ? <DialogoClave a={ACUDIENTES[CON_CUENTA]} estado={estadoClaveEn(frame)} /> : null}
				cursor={{
					puntos: [
						{ frame: M.cursorEntra, ...P.entrada },
						{ frame: M.llegaPersonas, ...P.personas },
						{ frame: M.llegaUsuarios, ...P.usuarios },
						{ frame: M.pulsaUsuarios + 4, ...P.usuarios },
						{ frame: M.pulsaUsuarios + 30, ...reposo },
						{ frame: M.llegaAcudientes - 20, ...reposo },
						{ frame: M.llegaAcudientes, ...P.acudientes },
						{ frame: M.pulsaAcudientes + 16, ...P.acudientes },
						{ frame: M.pulsaAcudientes + 40, ...reposo },
						{ frame: M.llegaLlave - 16, ...reposo },
						{ frame: M.llegaLlave, ...P.llave },
						{ frame: M.pulsaLlave + 6, ...P.llave },
						{ frame: M.llegaCampo, ...P.campo },
						{ frame: M.pulsaCampo + 4, ...P.campo },
						{ frame: M.teclea + 16, x: P.campo.x + 60, y: P.campo.y + 50 },
						{ frame: M.llegaCambiar - 14, x: P.campo.x + 60, y: P.campo.y + 50 },
						{ frame: M.llegaCambiar, ...P.cambiar },
						{ frame: M.cambiada + 16, ...P.cambiar },
						{ frame: M.llegaCarne - 20, x: P.carne.x + 40, y: P.carne.y + 60 },
						{ frame: M.llegaCarne, ...P.carne },
						{ frame: M.llegaCarne + 80, ...P.carne },
						{ frame: M.llegaCarne + 100, ...reposo },
					],
					clics: [M.pulsaPersonas, M.pulsaUsuarios, M.pulsaAcudientes, M.pulsaLlave, M.pulsaCampo, M.pulsaCambiar],
					aparece: M.cursorEntra,
					sale: TARJETA - 30,
				}}
			>
				{frame >= M.monta && <PantallaUsuarios estado={estadoEn(frame)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20}>
					<Mensaje texto={a.texto} desde={0} dura={a.dura} />
				</Sequence>
			))}

			{Array.from({ length: CLAVE_NUEVA }, (_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={M.teclea + i * 4} />
			))}
			<Efecto cual="aviso" en={M.cambiada} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
