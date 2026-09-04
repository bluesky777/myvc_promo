import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, llega, seVa } from '../../comunes/movimiento';
import { Lienzo, Pantalla, Rotulo } from '../Lienzo';
import { AccionesPorDefecto, Marco } from '../Marco';
import { BarrasHorizontales, BarrasVerticales } from '../graficos';
import { Cifra, Delta, FilaKpi, Num, Over, Tarjeta } from '../piezas';
import { AZUL, NARANJA, RAYA, TINTA, TINTA2, TINTA3 } from '../tema';
import { AVISOS, KPI, MESES, MOTIVOS } from './datos';
import {
	AVISOS_ENTRAN, BARRAS_MES, BARRAS_MOTIVO, CARD_AVISOS, CARD_MESES, CARD_MOTIVOS, FIEBRE, KPIS,
	MARCO, PASO_AVISO, PASO_KPI, RESALTE, SALIDA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SALUD ESCOLAR: LO QUE UN COLEGIO SOLO NO PUEDE VER.
 *
 * Toda la pantalla existe para el aviso rojo del medio, y el resto está para que ese aviso
 * signifique algo: sin las once mil atenciones del año delante, «34 casos de fiebre» es un número
 * sin escala.
 *
 * LO QUE EL CLIP AFIRMA, Y ES VERDAD: del colegio sube el motivo agrupado, el desenlace y el
 * tiempo. **Ni nombres, ni diagnósticos, ni el registro que escribió la enfermera.** Está en el pie
 * de la pantalla y en §2.1 del diseño técnico del portal; un clip de salud que enseñara un nombre
 * vendería justo lo contrario de lo que el sistema hace bien.
 */

const ICONOS: Record<string, string> = {
	alerta: '<path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4"></path><circle cx="12" cy="17" r="0.6" fill="currentColor"></circle>',
	sube: '<path d="M3 17l6-6 4 4 8-8"></path><path d="M21 7v5h-5"></path>',
	cama: '<path d="M3 18V8"></path><path d="M3 12h12a5 5 0 0 1 5 5v1H3"></path><circle cx="7.5" cy="9.5" r="2"></circle>',
};

const Alerta: React.FC<{ a: (typeof AVISOS)[number]; t: number; resalte: number }> = ({ a, t, resalte }) => (
	<div
		style={{
			display: 'flex',
			gap: 11,
			paddingBottom: 13,
			borderBottom: `1px solid ${RAYA}`,
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(t, [0, 1], [14, 0])}px)`,
		}}
	>
		<svg
			width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="1.8"
			strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}
			dangerouslySetInnerHTML={{ __html: ICONOS[a.icono] }}
		/>
		<div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1, minWidth: 0 }}>
			<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
				<span
					style={{
						fontSize: 12.5,
						fontWeight: 600,
						lineHeight: 1.3,
						/* El subrayado crece de izquierda a derecha, como quien pasa el dedo por la línea. */
						backgroundImage: `linear-gradient(${a.color}, ${a.color})`,
						backgroundSize: `${resalte * 100}% 2px`,
						backgroundPosition: '0 100%',
						backgroundRepeat: 'no-repeat',
						paddingBottom: 2,
					}}
				>
					{a.titulo}
				</span>
				<Num style={{ fontSize: 10.5, color: TINTA3, flexShrink: 0 }}>{a.cuando}</Num>
			</div>
			<div style={{ fontSize: 11.5, color: TINTA2, lineHeight: 1.45 }}>{a.texto}</div>
		</div>
	</div>
);

export const EscenaSalud: React.FC<{ conRotulo: boolean }> = ({ conRotulo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const fuera = seVa(frame, 0, SALIDA, 0, 26);

	const resalte = interpolate(frame, [RESALTE, RESALTE + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	/* El latido de la fiebre: dos pulsos y para. Más sería una alarma de discoteca. */
	const latido = interpolate(frame - FIEBRE, [0, 10, 20, 30, 40], [0, 1, 0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<Lienzo conRotulo={conRotulo}>
			<Pantalla conRotulo={conRotulo}>
			<div style={{ opacity: 1 - fuera, transform: `scale(${1 - fuera * 0.02})` }}>
				<Marco
					activo="salud_escolar"
					overline="Unión Colombiana del Norte · Bienestar estudiantil"
					titulo="Salud escolar"
					sub="Lo que registra la enfermería de cada colegio, sumado · sin nombres ni diagnósticos"
					desde={MARCO}
					acciones={<AccionesPorDefecto />}
					pie={[
						'Del colegio sube el motivo agrupado, el desenlace y el tiempo. El registro clínico y el nombre del alumno se quedan dentro del colegio.',
						'Última consolidación 03:12 · próxima esta noche 03:00',
					]}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
						<FilaKpi
							datos={KPI.map((k) => ({
								etiqueta: k.etiqueta,
								valor: k.valor,
								sufijo: k.sufijo,
								pie: k.pie,
								delta: <Delta sentido={k.delta[0]} texto={k.delta[1]} extra={k.delta[2]} bueno={k.delta[0] === 'baja'} />,
							}))}
							t={(i) => entra(frame, fps, KPIS + i * PASO_KPI, 20)}
						/>

						<div style={{ display: 'grid', gridTemplateColumns: '700px minmax(0, 1fr)', gap: 22, alignItems: 'start' }}>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
								<Tarjeta titulo="Atenciones mes a mes" sub="Toda la red, 2026" t={entra(frame, fps, CARD_MESES, 16)}>
									<BarrasVerticales
										datos={MESES}
										frame={frame}
										desde={BARRAS_MES}
										ancho={652}
										alto={176}
										color={AZUL}
										max={1482}
										rejilla={[500, 1000]}
										pie="Marzo y agosto son los picos: primeras semanas de clase de cada semestre."
										nota={{ x: 510, y: 28, texto: 'septiembre, en curso' }}
									/>
								</Tarjeta>

								<Tarjeta
									titulo="Por qué llegan a enfermería"
									sub="Cinco motivos · la fiebre es la que dispara los avisos de brote"
									t={entra(frame, fps, CARD_MOTIVOS, 16)}
								>
									{/* Cuando late la fiebre, la tarjeta se levanta un pelo: liga el motivo con el aviso. */}
									<div style={{ transform: `translateY(${-latido * 2}px)` }}>
										<BarrasHorizontales
											datos={MOTIVOS.map((m) => (m.etiqueta === 'Fiebre'
												? { ...m, extra: latido > 0.1 ? 'la del aviso de Bethel' : undefined }
												: m))}
											frame={frame}
											desde={BARRAS_MOTIVO}
											ancho={652}
											anchoEtiqueta={132}
											altoFila={24}
											color={AZUL}
										/>
									</div>
								</Tarjeta>
							</div>

							<Tarjeta titulo="Lo que la red ve y un colegio no" sub="Tres avisos abiertos" t={entra(frame, fps, CARD_AVISOS, 16)}>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
									{AVISOS.map((a, i) => (
										<Alerta key={a.titulo} a={a} t={llega(frame, fps, i, AVISOS_ENTRAN, PASO_AVISO, 18).opacidad} resalte={i === 0 ? resalte : 0} />
									))}
								</div>
							</Tarjeta>
						</div>
					</div>
				</Marco>
			</div>
			</Pantalla>

			{conRotulo ? (
				<Rotulo
					frases={[
						{ desde: KPIS + 26, hasta: CARD_AVISOS - 6, titulo: 'Once mil atenciones al año.', pie: 'La enfermería de trece colegios, sumada por primera vez.' },
						{ desde: AVISOS_ENTRAN + 14, hasta: CARD_MOTIVOS - 6, titulo: 'Treinta y cuatro fiebres en cinco días.', pie: 'Un colegio solo sabe cuántas lleva. No sabe cuántas son normales.' },
						{ desde: FIEBRE + 6, hasta: SALIDA, titulo: 'Sin un solo nombre.', pie: 'Sube el motivo agrupado, el desenlace y el tiempo. El registro clínico se queda en el colegio.' },
					]}
				/>
			) : null}
		</Lienzo>
	);
};
