import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { AvisoError } from '../el-ano/AvisoError';
import { PantallaGrupos } from '../montar-el-ano/Grupos';
import { avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { DesplegableNivel, PantallaGrados, PantallaNiveles } from './Pantallas';
import { NIVELES, NUEVO } from './datos';
import { AVISO_CREADO, AVISO_SIN_NIVEL, CIERRE, ESTADO_GRUPOS, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * «NIVELES, GRADOS Y GRUPOS»: encadena, no dibuja. Tres pantallas por el menú; cada una se apaga
 * entera antes de montar la siguiente.
 */

const REFERENCIAS = entradaDelMenu('Referencias');
const NIVELES_M = entradaDelMenu('Referencias', 'Niveles');
const GRADOS_M = entradaDelMenu('Referencias', 'Grados');
const GRUPOS_M = entradaDelMenu('Referencias', 'Grupos');
const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
const ELEGIDO = NIVELES.findIndex((n) => n.nombre === NUEVO.nivel);

export const EscenaNivelesGrados: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, T.llegaReferencias, T.pulsaReferencias + 10)
		? { seccion: REFERENCIAS.seccion, hija: null }
		: entre(frame, T.llegaEntrada, T.pulsaEntrada + 10)
			? { seccion: NIVELES_M.seccion, hija: NIVELES_M.hija }
			: entre(frame, T.llegaGrados, T.pulsaGrados + 10)
				? { seccion: GRADOS_M.seccion, hija: GRADOS_M.hija }
				: entre(frame, T.llegaGrupos, T.pulsaGrupos + 10)
					? { seccion: GRUPOS_M.seccion, hija: GRUPOS_M.hija }
					: null;

	const creado = frame >= T.creado;
	const ficha = {
		abierta: avance(frame, T.abreFicha, T.abreFicha + 10) * (1 - avance(frame, T.creado, T.creado + 10)),
		nombre: frame >= T.tecleaNombre ? tecleado(frame, NUEVO.nombre, T.tecleaNombre) : '',
		nivel: frame >= T.pulsaOpcion ? NUEVO.nivel : null,
		activo: entre(frame, T.pulsaNombre, T.pulsaCrear) ? 'nombre' as const : entre(frame, T.pulsaNivel, T.pulsaOpcion) ? 'nivel' as const : null,
		cursor: parpadea(frame),
		encimaCrear: entre(frame, T.llegaCrear, T.pulsaCrear + 6) || entre(frame, T.llegaCrear2, T.pulsaCrear2 + 6),
	};
	const desplegable = entre(frame, T.pulsaNivel + 2, T.pulsaOpcion + 4) ? entra(frame, fps, T.pulsaNivel + 2, 8) : 0;
	const seVaNiveles = 1 - avance(frame, T.seVaNiveles, T.seVaNiveles + 14);
	const seVaGrados = 1 - avance(frame, T.seVaGrados, T.seVaGrados + 14);
	const P = PUNTOS;
	const reposo = { x: P.crearGrado.x - 300, y: P.crearGrado.y + 420 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Referencias', t: entra(frame, fps, T.abreReferencias, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaReferencias, ...P.referencias },
						{ frame: T.llegaEntrada, ...P.niveles },
						{ frame: T.llegaGrados - 40, ...P.niveles },
						{ frame: T.llegaGrados, ...P.grados },
						{ frame: T.llegaCrearGrado - 60, ...P.grados },
						{ frame: T.llegaCrearGrado, ...P.crearGrado },
						{ frame: T.llegaNombre - 14, ...P.crearGrado },
						{ frame: T.llegaNombre, ...P.nombre },
						{ frame: T.llegaCrear - 20, ...P.nombre },
						{ frame: T.llegaCrear, ...P.crear },
						{ frame: T.llegaNivel - 30, ...P.crear },
						{ frame: T.llegaNivel, ...P.nivel },
						{ frame: T.llegaOpcion - 10, ...P.nivel },
						{ frame: T.llegaOpcion, ...P.opcion },
						{ frame: T.llegaCrear2 - 10, ...P.opcion },
						{ frame: T.llegaCrear2, ...P.crear },
						{ frame: T.creado + 30, ...P.crear },
						{ frame: T.creado + 80, ...reposo },
						{ frame: T.llegaGrupos - 50, ...reposo },
						{ frame: T.llegaGrupos, ...P.grupos },
						{ frame: T.cursorSale - 10, ...P.grupos },
					],
					clics: [T.pulsaReferencias, T.pulsaEntrada, T.pulsaGrados, T.pulsaCrearGrado, T.pulsaNombre, T.pulsaCrear, T.pulsaNivel, T.pulsaOpcion, T.pulsaCrear2, T.pulsaGrupos],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.monta && frame < T.montaGrados && <PantallaNiveles opacidad={entra(frame, fps, T.monta, 14) * seVaNiveles} />}
				{frame >= T.montaGrados && frame < T.montaGrupos && (
					<>
						<PantallaGrados
							ficha={ficha}
							conNuevo={creado}
							encimaCrearGrado={entre(frame, T.llegaCrearGrado, T.pulsaCrearGrado + 8)}
							opacidad={entra(frame, fps, T.montaGrados, 14) * seVaGrados}
						/>
						{desplegable > 0 && (
							<DesplegableNivel aparece={desplegable} resaltada={frame >= T.llegaOpcion - 6 ? ELEGIDO : null} elegida={frame >= T.pulsaOpcion ? ELEGIDO : null} />
						)}
					</>
				)}
				{frame >= T.montaGrupos && <PantallaGrupos estado={ESTADO_GRUPOS} opacidad={entra(frame, fps, T.montaGrupos, 14)} />}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Sequence from={AVISO_SIN_NIVEL.desde} durationInFrames={AVISO_SIN_NIVEL.dura + 20}>
				<AvisoError texto={AVISO_SIN_NIVEL.texto} desde={0} dura={AVISO_SIN_NIVEL.dura} />
			</Sequence>
			<Sequence from={AVISO_CREADO.desde} durationInFrames={AVISO_CREADO.dura + 20}>
				<Aviso texto={AVISO_CREADO.texto} desde={0} dura={AVISO_CREADO.dura} />
			</Sequence>

			{[...NUEVO.nombre].map((_, i) => <Efecto key={i} cual={TECLAS[i % 3]} en={T.tecleaNombre + i * 4} />)}
			<Efecto cual="aviso" en={AVISO_SIN_NIVEL.desde} />
			<Efecto cual="aviso" en={AVISO_CREADO.desde} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
