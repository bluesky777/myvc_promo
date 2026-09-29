import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { BarraSinGuardar, CabeceraDelColegio, P_CERTIFICADOS, P_FICHA, P_PERIODOS } from '../el-ano/colegio';
import { Confirmar } from '../el-ano/piezas';
import { avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { CuerpoFicha } from './Ficha';
import { CONTACTO, SCROLL, TELEFONO_NUEVO, TEXTOS } from './datos';
import { ANCHO_GUARDAR, AVISO, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * «LA FICHA DEL COLEGIO»: encadena, no dibuja. La página entera baja y sube con el scroll; la barra
 * de «sin guardar» no, porque en la aplicación va pegada abajo.
 */

const CONFIG = entradaDelMenu('Configuración');
const EL_COLEGIO = entradaDelMenu('Configuración', 'El colegio');

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por letra, en el fotograma en que la letra aparece (`escrito`, 4 por tecla). */
const teclas = [...TELEFONO_NUEVO].flatMap((c, i) => (c === ' ' ? [] : [T.teclea + (i + 1) * 4]));

const suave = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };
const tramo = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], suave);

export function scrollEn(f: number): number {
	return (
		SCROLL.cargos * tramo(f, T.bajaCargosDesde, T.bajaCargosHasta) +
		(SCROLL.vocabulario - SCROLL.cargos) * tramo(f, T.bajaVocDesde, T.bajaVocHasta) -
		SCROLL.vocabulario * tramo(f, T.subeDesde, T.subeHasta)
	);
}

export const EscenaColegioFicha: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, T.llegaConfig, T.pulsaConfig + 10)
		? { seccion: CONFIG.seccion, hija: null }
		: entre(frame, T.llegaColegio, T.pulsaColegio + 10)
			? { seccion: EL_COLEGIO.seccion, hija: EL_COLEGIO.hija }
			: null;

	const senalado = entre(frame, T.llegaPestana, T.pulsaPestana + 10)
		? `pestana-${P_FICHA}`
		: entre(frame, T.llegaCertificados, T.pulsaCertificados + 6)
			? `pestana-${P_CERTIFICADOS}`
			: null;

	const sucio = frame >= T.teclea && frame < T.guardado;
	const telefono = frame >= T.teclea ? tecleado(frame, TELEFONO_NUEVO, T.teclea) : CONTACTO[0].valor;
	const barra = avance(frame, T.teclea, T.teclea + 10) * (1 - avance(frame, T.guardado, T.guardado + 10));
	const confirm = frame >= T.confirm ? entra(frame, fps, T.confirm, 10) * (1 - avance(frame, T.pulsaSeguir + 2, T.pulsaSeguir + 8)) : 0;
	const scroll = scrollEn(frame);
	const P = PUNTOS;
	const reposo = { x: P.telefono.x - 180, y: P.telefono.y + 300 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Configuración', t: entra(frame, fps, T.abreConfig, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={
					<Confirmar
						titulo={TEXTOS.salirTitulo}
						contenido={TEXTOS.salirTexto}
						si={TEXTOS.salirSi}
						no={TEXTOS.salirNo}
						peligroso
						aparece={confirm}
						encimaNo={entre(frame, T.llegaSeguir, T.pulsaSeguir + 4)}
					/>
				}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaConfig, ...P.config },
						{ frame: T.llegaColegio, ...P.colegio },
						{ frame: T.llegaPestana - 20, ...P.colegio },
						{ frame: T.llegaPestana, ...P.pestana },
						{ frame: T.pulsaPestana + 40, x: P.pestana.x + 200, y: P.pestana.y + 380 },
						{ frame: T.llegaTelefono - 50, x: P.pestana.x + 200, y: P.pestana.y + 380 },
						{ frame: T.llegaTelefono, ...P.telefono },
						{ frame: T.teclea, ...P.telefono },
						{ frame: T.teclea + 20, x: P.telefono.x + 60, y: P.telefono.y + 70 },
						{ frame: T.llegaCertificados - 50, x: P.telefono.x + 60, y: P.telefono.y + 70 },
						{ frame: T.llegaCertificados, ...P.certificados },
						{ frame: T.llegaSeguir - 60, ...P.certificados },
						{ frame: T.llegaSeguir, ...P.seguir },
						{ frame: T.pulsaSeguir + 20, ...P.seguir },
						{ frame: T.llegaGuardar, ...P.guardar },
						{ frame: T.guardado + 30, ...P.guardar },
						{ frame: T.bajaCargosDesde, ...reposo },
						{ frame: T.cursorSale - 20, ...reposo },
					],
					clics: [T.pulsaConfig, T.pulsaColegio, T.pulsaPestana, T.pulsaTelefono, T.pulsaTelefono + 5, T.pulsaCertificados, T.pulsaSeguir, T.pulsaGuardar],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.montaColegio && (
					<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.montaColegio, 12) }}>
						<div style={{ position: 'absolute', left: 0, top: 0, right: 0, transform: `translateY(${-scroll}px)` }}>
							<CabeceraDelColegio year={2026} enCurso actual={2026} pestana={frame >= T.pulsaPestana ? P_FICHA : P_PERIODOS} senalado={senalado} />
							{frame >= T.montaFicha && (
								<CuerpoFicha
									telefono={telefono}
									telefonoSucio={sucio}
									telefonoFoco={entre(frame, T.pulsaTelefono, T.pulsaCertificados)}
									telefonoSeleccionado={entre(frame, T.pulsaTelefono + 5, T.teclea)}
									cursor={parpadea(frame)}
									aparece={entra(frame, fps, T.montaFicha, 14)}
								/>
							)}
						</div>
						{barra > 0.001 && (
							<BarraSinGuardar
								texto={TEXTOS.barra(1)}
								guardar={TEXTOS.guardar}
								aparece={barra}
								anchoGuardar={ANCHO_GUARDAR}
								encima={entre(frame, T.llegaGuardar, T.pulsaGuardar + 4)}
								cargando={entre(frame, T.pulsaGuardar, T.guardado)}
								frame={frame}
							/>
						)}
					</div>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{teclas.map((en, i) => <Efecto key={en} cual={TECLAS[i % 3]} en={en} />)}
			<Efecto cual="aviso" en={T.confirm} />
			<Efecto cual="aviso" en={AVISO.desde} />

			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
