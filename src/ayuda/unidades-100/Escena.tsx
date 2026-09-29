import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { entradaDe } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { EL_QUE_FALTA } from './datos';
import { Lienzo } from '../moverse/comun';
import { MisAsignaturas } from '../mis-asignaturas/MisAsignaturas';
import { LA_DE_9A } from '../mis-asignaturas/datos';
import { Unidades } from './Unidades';
import { CIERRE, MENU, PASOS, PUNTOS, T, TARJETA, estado, tecleo } from './guion';

/*
 * EL 100 %: menú, Mis asignaturas, «Logros» en la fila de 9°A y la pantalla de Logros, donde se
 * corrige el porcentaje que sobraba y se añade el Indicador que faltaba.
 */

export const EscenaUnidades100: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const academico = entra(frame, fps, T.abreAcademico, 16);
	const senalada = frame >= T.llegaAcademico && frame < T.pulsaAcademico + 10
		? entradaDe(MENU, 'Académico')
		: frame >= T.llegaMisAsignaturas && frame < T.pulsaMisAsignaturas + 10
			? entradaDe(MENU, 'Académico', 'Mis asignaturas')
			: null;
	const seVaLaLista = interpolate(frame, [T.pulsaLogros + 2, T.montaUnidades], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const t = tecleo(frame);
	const senalado = frame >= T.llegaEditar - 4 && frame < T.pulsaEditar + 8 ? 'editar' as const
		: frame >= T.llegaGuardar - 4 && frame < T.pulsaGuardar + 8 ? 'guardar' as const
			: frame >= T.llegaAnadir - 4 && frame < T.pulsaAnadir + 8 ? 'anadir' as const : null;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Lienzo opacidad={entra(frame, fps, 0, 14)}>
				<Cascara menu={MENU} hoy={{ anio: '2026', periodo: 2 }} abierta={{ seccion: entradaDe(MENU, 'Académico').seccion, t: academico }} senalada={senalada}>
					{frame >= T.montaLista && frame < T.montaUnidades && (
						<div style={{ position: 'absolute', inset: 0, opacity: seVaLaLista }}>
							<Sequence from={T.montaLista} layout="none">
								<MisAsignaturas
									subtitulo="4 asignaturas en el año en curso · periodo 2: 0 de 4 cerradas"
									senalada={frame >= T.llegaLogros - 6 ? { fila: LA_DE_9A, boton: 0 } : null}
								/>
							</Sequence>
						</div>
					)}
					{frame >= T.montaUnidades && (
						<Sequence from={T.montaUnidades} layout="none">
							<Unidades estado={estado(frame)} edicion={t.edicion} nuevo={t.nuevo} senalado={senalado} />
						</Sequence>
					)}
				</Cascara>

				<Cursor
					puntos={[
						{ frame: T.cursorEntra, ...PUNTOS.entrada },
						{ frame: T.llegaAcademico, ...PUNTOS.academico },
						{ frame: T.llegaMisAsignaturas, ...PUNTOS.misAsignaturas },
						{ frame: T.montaLista + 40, ...PUNTOS.reposo },
						{ frame: T.llegaLogros - 50, ...PUNTOS.reposo },
						{ frame: T.llegaLogros, ...PUNTOS.logros9A },
						{ frame: T.pulsaLogros + 40, ...PUNTOS.reposo },
						{ frame: T.llegaEditar - 50, ...PUNTOS.reposo },
						{ frame: T.llegaEditar, ...PUNTOS.editar3 },
						{ frame: T.llegaPorc3, ...PUNTOS.porc3 },
						{ frame: T.teclea3 + 4, ...PUNTOS.porc3 },
						{ frame: T.llegaGuardar, ...PUNTOS.guardar3 },
						{ frame: T.pulsaGuardar + 40, ...PUNTOS.reposo },
						{ frame: T.llegaTexto1 - 40, ...PUNTOS.reposo },
						{ frame: T.llegaTexto1, ...PUNTOS.texto1 },
						{ frame: T.tecleaQuiz + 16, ...PUNTOS.texto1 },
						{ frame: T.llegaPorc1, ...PUNTOS.porc1 },
						{ frame: T.teclea20 + 8, ...PUNTOS.porc1 },
						{ frame: T.llegaAnadir, ...PUNTOS.anadir1 },
					]}
					clics={[T.pulsaAcademico, T.pulsaMisAsignaturas, T.pulsaLogros, T.pulsaEditar, T.pulsaPorc3, T.pulsaPorc3b, T.pulsaGuardar, T.pulsaTexto1, T.pulsaPorc1, T.pulsaAnadir]}
					aparece={T.cursorEntra}
					sale={T.cursorSale}
					tam={34}
				/>
			</Lienzo>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			{/* El tecleo: el 30 del Logro, «Quiz» y el 20 del Indicador nuevo. */}
			{[[T.teclea3, 2], [T.tecleaQuiz, EL_QUE_FALTA.definicion.length], [T.teclea20, 2]].flatMap(([desde, n], j) =>
				Array.from({ length: n }, (_, i) => <Efecto key={`t${j}-${i}`} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[(i + j) % 3]} en={desde + i * T.porTecla} />),
			)}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
