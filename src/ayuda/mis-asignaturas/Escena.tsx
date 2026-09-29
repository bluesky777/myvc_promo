import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { entradaDe } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Lienzo } from '../moverse/comun';
import { MisAsignaturas } from './MisAsignaturas';
import { LA_DE_9A } from './datos';
import { CIERRE, FINAL, LLEGADA, MENU, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * MIS ASIGNATURAS: encadena, no dibuja. La cáscara de hoy con el menú del docente, «Académico» se
 * abre, se pulsa «Mis asignaturas» y la lista se monta; los focos van fila por fila.
 */

export const SUBTITULO = '4 asignaturas en el año en curso · periodo 2: 0 de 4 cerradas';

export const EscenaMisAsignaturas: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const academico = entra(frame, fps, LLEGADA.abreAcademico, 16);
	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? entradaDe(MENU, 'Académico')
		: frame >= LLEGADA.llegaMisAsignaturas && frame < LLEGADA.pulsaMisAsignaturas + 10
			? entradaDe(MENU, 'Académico', 'Mis asignaturas')
			: null;
	const boton = frame >= FINAL.llegaBoton && frame < FINAL.pulsaBoton + 12 ? { fila: LA_DE_9A, boton: 0 } : null;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Lienzo opacidad={entra(frame, fps, 0, 14)}>
				<Cascara menu={MENU} hoy={{ anio: '2026', periodo: 2 }} abierta={{ seccion: entradaDe(MENU, 'Académico').seccion, t: academico }} senalada={senalada}>
					<Sequence from={LLEGADA.monta} layout="none">
						<MisAsignaturas subtitulo={SUBTITULO} senalada={boton} />
					</Sequence>
				</Cascara>
				<Cursor
					puntos={[
						{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
						{ frame: LLEGADA.llegaAcademico, ...PUNTOS.academico },
						{ frame: LLEGADA.llegaMisAsignaturas, ...PUNTOS.misAsignaturas },
						{ frame: LLEGADA.monta + 40, ...PUNTOS.reposo },
						{ frame: FINAL.llegaBoton - 50, ...PUNTOS.reposo },
						{ frame: FINAL.llegaBoton, ...PUNTOS.logros9A },
					]}
					clics={[LLEGADA.pulsaAcademico, LLEGADA.pulsaMisAsignaturas, FINAL.pulsaBoton]}
					aparece={LLEGADA.cursorEntra}
					sale={FINAL.cursorSale}
					tam={34}
				/>
			</Lienzo>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
