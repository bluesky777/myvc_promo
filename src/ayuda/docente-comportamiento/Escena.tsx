import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { conPausas } from '../disciplina/pausas';
import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { PantallaComportamiento } from './Comportamiento';
import { LO_QUE_SE_ESCRIBE, NOTA_NUEVA } from './datos';
import { Efecto } from '../voz';
import { AVISO_LIBRO_DURA, AVISO_NOTA_DURA, CIERRE, DISTINTIVO, LIBRO, LLEGADA, NOTA, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «COMPORTAMIENTO Y EL LIBRO ROJO»: encadena. La cáscara con «Mis asignaturas» (y su sección
 * «Grupos titularía»), el acercamiento, y la planilla de comportamiento a pantalla completa.
 */

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;

export const EscenaDocenteComportamiento: React.FC = () => {
	const frame = useCurrentFrame();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < LLEGADA.entraPantalla && <EnLaCascara />}

			<PantallaComportamiento
				t={{
					monta: LLEGADA.entraPantalla,
					enfocaNota: NOTA.enfoca,
					empiezaNota: NOTA.empieza,
					porTeclaNota: NOTA.porTecla,
					sueltaNota: NOTA.suelta,
					pulsaPestana: LIBRO.pulsaPestana,
					enfocaCampo: LIBRO.enfoca,
					empiezaTexto: LIBRO.empieza,
					porTecla: LIBRO.porTecla,
					senaladaPestana: (f) => f >= LIBRO.llegaPestana && f < LIBRO.pulsaPestana,
				}}
			/>

			<Cursor
				puntos={conPausas([
					{ frame: LLEGADA.entraPantalla + 30, x: 1500, y: 800 },
					{ frame: NOTA.llega - 40, x: 1300, y: 600 },
					{ frame: NOTA.llega, ...PUNTOS.nota },
					{ frame: NOTA.empieza - 6, x: PUNTOS.nota.x + 50, y: PUNTOS.nota.y + 60 },
					{ frame: LIBRO.llegaPestana - 60, x: PUNTOS.nota.x + 50, y: PUNTOS.nota.y + 60 },
					{ frame: LIBRO.llegaPestana, ...PUNTOS.pestana },
					{ frame: LIBRO.llegaCampo - 60, ...PUNTOS.pestana },
					{ frame: LIBRO.llegaCampo, ...PUNTOS.campo },
					{ frame: LIBRO.empieza - 4, x: PUNTOS.campo.x + 40, y: PUNTOS.campo.y + 70 },
					{ frame: DISTINTIVO.sale, x: PUNTOS.campo.x + 40, y: PUNTOS.campo.y + 70 },
					{ frame: DISTINTIVO.llega, x: PUNTOS.distintivo.x + 18, y: PUNTOS.distintivo.y + 22 },
				], [NOTA.enfoca, LIBRO.pulsaPestana, LIBRO.enfoca])}
				clics={[NOTA.enfoca, LIBRO.pulsaPestana, LIBRO.enfoca]}
				aparece={LLEGADA.entraPantalla + 30}
				sale={TARJETA - 30}
				tam={34}
			/>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<AvisoBajoLaCabecera texto={`Dato cambiado: ${NOTA_NUEVA}`} desde={NOTA.aviso} dura={AVISO_NOTA_DURA} />
			<AvisoBajoLaCabecera texto="Cambios guardados" desde={LIBRO.aviso} dura={AVISO_LIBRO_DURA} />
			{[NOTA.aviso, LIBRO.aviso].map((en) => <Efecto key={en} cual="aviso" en={en} />)}
			{[...NOTA_NUEVA].map((_, i) => <Efecto key={`n${i}`} cual={TECLAS[i % 3]} en={NOTA.empieza + i * NOTA.porTecla} />)}
			{[...LO_QUE_SE_ESCRIBE].map((_, i) => (i % 2 === 0 ? <Efecto key={`l${i}`} cual={TECLAS[(i / 2) % 3]} en={LIBRO.empieza + i * LIBRO.porTecla} /> : null))}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const academico = entra(frame, fps, LLEGADA.abreAcademico, 16);
	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaMisAsignaturas && frame < LLEGADA.pulsaMisAsignaturas + 10
			? { seccion: ACADEMICO, hija: MIS_ASIGNATURAS }
			: null;
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [LLEGADA.seVaLaCascara, LLEGADA.entraPantalla], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salida = LLEGADA.pulsaBoton - LLEGADA.montaLista;

	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ORIGEN.x, top: ORIGEN.y, width: MEDIDAS.ancho * ESCALA_CASCARA, height: MEDIDAS.alto * ESCALA_CASCARA, transformOrigin: '50% 45%', transform: `scale(${1 + seVa * 0.07})`, opacity: aparece * (1 - seVa) }}>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara academico={academico} senalada={senalada}>
						{frame >= LLEGADA.montaLista && (
							<Sequence from={LLEGADA.montaLista}>
								<MisAsignaturas salidaEn={salida} titulariaConNotas titulariaSenalada={frame >= LLEGADA.llegaBoton && frame < LLEGADA.pulsaBoton + 10} />
							</Sequence>
						)}
					</Cascara>
					<Cursor
						puntos={conPausas([
							{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
							{ frame: LLEGADA.llegaAcademico, ...PUNTOS.academico },
							{ frame: LLEGADA.llegaMisAsignaturas, ...PUNTOS.misAsignaturas },
							{ frame: LLEGADA.llegaBoton - 70, ...PUNTOS.misAsignaturas },
							{ frame: LLEGADA.llegaBoton, ...PUNTOS.boton },
						], [LLEGADA.pulsaAcademico, LLEGADA.pulsaMisAsignaturas, LLEGADA.pulsaBoton])}
						clics={[LLEGADA.pulsaAcademico, LLEGADA.pulsaMisAsignaturas, LLEGADA.pulsaBoton]}
						aparece={LLEGADA.cursorEntra}
						sale={LLEGADA.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
