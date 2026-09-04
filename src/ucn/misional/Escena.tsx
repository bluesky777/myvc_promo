import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, seVa } from '../../comunes/movimiento';
import { Lienzo, Pantalla, Rotulo } from '../Lienzo';
import { AccionesPorDefecto, Marco } from '../Marco';
import { BarrasHorizontales, BarrasVerticales } from '../graficos';
import { Delta, FilaKpi, Muestra, Tarjeta } from '../piezas';
import { AZUL, NARANJA, TINTA3, TINTA_AZUL, VERDE } from '../tema';
import { ACTIVIDADES, BAUTISMOS, CAMPOS, KPI } from './datos';
import {
	BARRAS, BARRAS_ACTIVIDAD, BARRAS_CAMPO, CARD_ACTIVIDADES, CARD_BAUTISMOS, CARD_CAMPOS, KPIS,
	MARCO, NOTA_HUECO, PASO_KPI, SALIDA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * IMPACTO MISIONAL: OCHO AÑOS, TRECE COLEGIOS, UNA SOLA PANTALLA.
 *
 * LAS DOS CIFRAS VAN EN SENTIDOS CONTRARIOS Y LAS DOS SE ENSEÑAN: los bautismos han vuelto al nivel
 * de antes de 2020, y la proporción de alumnos de familia adventista lleva siete años bajando. Una
 * pantalla que sólo enseñara la primera duraría hasta que alguien preguntara por la segunda.
 */

export const EscenaMisional: React.FC<{ conRotulo: boolean }> = ({ conRotulo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const fuera = seVa(frame, 0, SALIDA, 0, 26);
	const nota = entra(frame, fps, NOTA_HUECO, 18);

	return (
		<Lienzo conRotulo={conRotulo}>
			<Pantalla conRotulo={conRotulo}>
			<div style={{ opacity: 1 - fuera, transform: `scale(${1 - fuera * 0.02})` }}>
				<Marco
					activo="misional"
					overline="Unión Colombiana del Norte · Departamento de Educación"
					titulo="Impacto misional"
					sub="Año lectivo 2026 · consolidado del 3 de septiembre a las 03:12"
					desde={MARCO}
					acciones={<AccionesPorDefecto />}
					pie={['Cada colegio envía su resumen por su propio cron, firmado.', 'Última consolidación 03:12 · próxima esta noche 03:00']}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
						<FilaKpi
							datos={KPI.map((k) => ({
								etiqueta: k.etiqueta,
								valor: k.valor,
								pie: k.pie,
								delta: <Delta sentido={k.delta[0]} texto={k.delta[1]} extra={k.delta[2]} />,
							}))}
							t={(i) => entra(frame, fps, KPIS + i * PASO_KPI, 20)}
						/>

						<div style={{ display: 'grid', gridTemplateColumns: '700px minmax(0, 1fr)', gap: 22, alignItems: 'start' }}>
							<Tarjeta
								titulo="Los bautismos volvieron al nivel de antes de 2020"
								sub="Alumnos bautizados en el año, toda la red"
								t={entra(frame, fps, CARD_BAUTISMOS, 16)}
							>
								<div style={{ position: 'relative' }}>
									<BarrasVerticales
										datos={BAUTISMOS}
										frame={frame}
										desde={BARRAS}
										ancho={652}
										alto={210}
										color={AZUL}
										max={236}
										rejilla={[100, 200]}
									/>
									{/*
									 * LA NOTA DEL HUECO. Va sobre las dos barras cortas y llega cuando ya están
									 * dibujadas: primero se ve la caída, y sólo después se dice de qué fue.
									 */}
									<div style={{ position: 'absolute', left: 132, top: 18, display: 'flex', alignItems: 'center', gap: 8, opacity: nota }}>
										<span style={{ width: 1, height: 42, background: '#B5AF9F' }} />
										<span style={{ fontSize: 11, color: TINTA3, fontStyle: 'italic' }}>los dos años sin internado</span>
									</div>
								</div>
							</Tarjeta>

							<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
								<Tarjeta titulo="Proporción por campo" sub="Alumnos de familia adventista" t={entra(frame, fps, CARD_CAMPOS, 16)}>
									<BarrasHorizontales
										datos={CAMPOS}
										frame={frame}
										desde={BARRAS_CAMPO}
										ancho={420}
										anchoEtiqueta={148}
										altoFila={24}
										color={AZUL}
										max={80}
										sufijo=" %"
										decimales={1}
										referencia={{ valor: 62.4, texto: 'nación 62,4 %', color: NARANJA }}
									/>
								</Tarjeta>

								<Tarjeta titulo="Participación en actividades" sub="Alumnos inscritos, 2026" t={entra(frame, fps, CARD_ACTIVIDADES, 16)}>
									<BarrasHorizontales
										datos={ACTIVIDADES}
										frame={frame}
										desde={BARRAS_ACTIVIDAD}
										ancho={420}
										anchoEtiqueta={130}
										altoFila={24}
										color={VERDE}
										pie="Un alumno puede estar en varias."
									/>
								</Tarjeta>
							</div>
						</div>
					</div>
				</Marco>
			</div>
			</Pantalla>

			{conRotulo ? (
				<Rotulo
					frases={[
						{ desde: BARRAS + 34, hasta: CARD_CAMPOS - 6, titulo: '192 bautismos en 2026.', pie: 'Por encima de 2019, y con dos colegios todavía sin campaña.' },
						{ desde: BARRAS_CAMPO + 20, hasta: SALIDA, titulo: 'Y la otra cifra baja.', pie: 'Cuatro campos por encima de la media nacional y dos por debajo. Las dos se enseñan.' },
					]}
				/>
			) : null}
		</Lienzo>
	);
};
