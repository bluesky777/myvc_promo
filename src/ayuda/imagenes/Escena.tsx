import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { avance, entre } from '../montar-el-ano/tiempo';
import { Asignar, Firmas, Galeria, ModalAsignar, Navegacion, Visor } from './Pantallas';
import { ALUMNOS, LA_ALUMNA } from './datos';
import { AVISO, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * «IMÁGENES: FOTOS Y FIRMAS»: encadena, no dibuja. Tres pestañas de la misma pantalla; la
 * cabecera con las pestañas se queda y cambia el cuerpo, que se apaga antes de montar el
 * siguiente. El visor tapa la cáscara entera, como en la aplicación (`position: fixed`).
 */

const CONFIG = entradaDelMenu('Configuración');
const IMAGENES = entradaDelMenu('Configuración', 'Imágenes');

export const EscenaImagenes: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, T.llegaConfig, T.pulsaConfig + 10)
		? { seccion: CONFIG.seccion, hija: null }
		: entre(frame, T.llegaEntrada, T.pulsaEntrada + 10)
			? { seccion: IMAGENES.seccion, hija: IMAGENES.hija }
			: null;

	const pestana = frame >= T.pulsaPestanaFirmas ? 3 : frame >= T.pulsaPestanaAsignar ? 1 : 0;
	const visor = frame >= T.visor ? entra(frame, fps, T.visor, 10) * (1 - avance(frame, T.cierraVisor, T.cierraVisor + 8)) : 0;
	const globo = avance(frame, T.globo, T.globo + 8) * (1 - avance(frame, T.llegaCerrar - 40, T.llegaCerrar - 30));
	const encimaBoton = entre(frame, T.llegaPerfil, T.llegaOficial - 10) ? 1 : entre(frame, T.llegaOficial, T.llegaCerrar - 30) ? 2 : null;
	const modal = frame >= T.modal ? entra(frame, fps, T.modal, 10) * (1 - avance(frame, T.pulsaSi + 2, T.pulsaSi + 10)) : 0;
	const seVaGaleria = 1 - avance(frame, T.pulsaPestanaAsignar, T.pulsaPestanaAsignar + 4);
	const seVaAsignar = 1 - avance(frame, T.pulsaPestanaFirmas, T.pulsaPestanaFirmas + 4);
	const P = PUNTOS;
	const reposo = { x: P.alumno.x + 200, y: P.alumno.y + 260 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Configuración', t: entra(frame, fps, T.abreConfig, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={
					<>
						<Visor aparece={visor} encimaBoton={encimaBoton} globo={globo} />
						<ModalAsignar aparece={modal} encimaSi={entre(frame, T.llegaSi, T.pulsaSi + 4)} nombre={ALUMNOS[LA_ALUMNA].nombre} />
					</>
				}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaConfig, ...P.config },
						{ frame: T.llegaEntrada, ...P.imagenes },
						{ frame: T.llegaTarjeta - 60, ...P.imagenes },
						{ frame: T.llegaTarjeta, ...P.tarjeta },
						{ frame: T.pulsaTarjeta + 20, ...P.tarjeta },
						{ frame: T.llegaPerfil, ...P.perfil },
						{ frame: T.llegaOficial - 20, ...P.perfil },
						{ frame: T.llegaOficial, ...P.oficial },
						{ frame: T.llegaCerrar - 40, ...P.oficial },
						{ frame: T.llegaCerrar, ...P.cerrar },
						{ frame: T.pulsaCerrar + 6, ...P.cerrar },
						{ frame: T.llegaPestanaAsignar, ...P.asignar },
						{ frame: T.pulsaPestanaAsignar + 40, ...P.asignar },
						{ frame: T.llegaMini, ...P.mini },
						{ frame: T.pulsaMini + 10, ...P.mini },
						{ frame: T.llegaAlumno, ...P.alumno },
						{ frame: T.pulsaAlumno + 20, ...P.alumno },
						{ frame: T.llegaSi - 60, ...P.alumno },
						{ frame: T.llegaSi, ...P.si },
						{ frame: T.pulsaSi + 30, ...P.si },
						{ frame: T.asignada + 60, ...reposo },
						{ frame: T.llegaPestanaFirmas - 40, ...reposo },
						{ frame: T.llegaPestanaFirmas, ...P.firmas },
						{ frame: T.pulsaPestanaFirmas + 40, ...P.firmas },
						{ frame: T.cursorSale - 10, x: P.firmas.x + 100, y: P.firmas.y + 500 },
					],
					clics: [T.pulsaConfig, T.pulsaEntrada, T.pulsaTarjeta, T.pulsaCerrar, T.pulsaPestanaAsignar, T.pulsaMini, T.pulsaAlumno, T.pulsaSi, T.pulsaPestanaFirmas],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.monta && (
					<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.monta, 14) }}>
						<Navegacion
							pestana={pestana}
							senalada={entre(frame, T.llegaPestanaAsignar, T.pulsaPestanaAsignar + 6) ? 1 : entre(frame, T.llegaPestanaFirmas, T.pulsaPestanaFirmas + 6) ? 3 : null}
						/>
						{frame < T.montaAsignar && (
							<div style={{ opacity: seVaGaleria }}>
								<Galeria tarjetaEncima={entre(frame, T.llegaTarjeta, T.pulsaTarjeta + 4) ? 0 : null} />
							</div>
						)}
						{frame >= T.montaAsignar && frame < T.montaFirmas && (
							<div style={{ opacity: entra(frame, fps, T.montaAsignar, 12) * seVaAsignar }}>
								<Asignar
									elegida={frame >= T.pulsaMini && frame < T.asignada}
									asignada={frame >= T.asignada}
									encimaAlumno={entre(frame, T.llegaAlumno, T.pulsaAlumno + 6) ? LA_ALUMNA : null}
								/>
							</div>
						)}
						{frame >= T.montaFirmas && (
							<div style={{ opacity: entra(frame, fps, T.montaFirmas, 12) }}>
								<Firmas />
							</div>
						)}
					</div>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="aviso" en={T.modal} />
			<Efecto cual="aviso" en={AVISO.desde} />

			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
