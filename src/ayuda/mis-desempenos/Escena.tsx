import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra, escrito } from '../../comunes/movimiento';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { MEDIDAS } from '../medidas';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { EstadoMisCompetencias, PantallaMisCompetencias } from './MisCompetencias';
import { Efecto } from '../voz';
import { ACADEMICO, AGREGADO, ANCHO_CLASE, ENCUADRE, FILAS, LA_CLASE, MENU, MIS_COMPETENCIAS, NUEVA, PG, UTIL, plano } from './datos';
import { ANADIDA, CARGA_LA_CLASE, CIERRE, ENTRA, GUARDADA, LLEGADA, PASOS, POR_LETRA, POR_LETRA_NUEVA, PUNTOS_LLEGADA, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MIS DESEMPEÑOS (MIS COMPETENCIAS): el menú del docente con la entrada renombrada, y al pulsarla
 * la cáscara se acerca y se apaga para dejar la pantalla a tamaño de leer.
 */

export const EscenaMisDesempenos: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <EnLaCascara frame={frame} fps={fps} />}
			<Sequence from={ENTRA}>
				<Panel />
			</Sequence>
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			{/* El tecleo: lo que se añade a la primera fila y la fila nueva (una tecla cada tres fotogramas). */}
			{[[T.teclaEdicion, AGREGADO.length * POR_LETRA], [T.teclaNuevo, NUEVA.length * POR_LETRA_NUEVA]].flatMap(([desde, dura], j) =>
				Array.from({ length: Math.ceil(dura / 3) }, (_, i) => <Efecto key={`t${j}-${i}`} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={ENTRA + desde + i * 3} />),
			)}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const t = LLEGADA;
	const abierta = entra(frame, fps, t.abreAcademico, 16);
	const senalada = frame >= t.llegaAcademico && frame < t.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= t.llegaHija && frame < t.pulsaHija + 10 ? { seccion: ACADEMICO, hija: MIS_COMPETENCIAS } : null;
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [t.seVaLaCascara, t.entraPanel], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ORIGEN.x, top: ORIGEN.y, width: MEDIDAS.ancho * ESCALA_CASCARA, height: MEDIDAS.alto * ESCALA_CASCARA, transformOrigin: '50% 45%', transform: `scale(${1 + seVa * 0.07})`, opacity: aparece * (1 - seVa) }}>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU} abierta={{ seccion: ACADEMICO, t: abierta }} senalada={senalada} />
					<Cursor
						puntos={[
							{ frame: t.cursorEntra, ...PUNTOS_LLEGADA.entrada },
							{ frame: t.llegaAcademico, ...PUNTOS_LLEGADA.academico },
							{ frame: t.llegaHija, ...PUNTOS_LLEGADA.hija },
						]}
						clics={[t.pulsaAcademico, t.pulsaHija]}
						aparece={t.cursorEntra}
						sale={t.pulsaHija + 4}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

function estadoEn(f: number): EstadoMisCompetencias {
	const primera = f >= GUARDADA ? FILAS[0] + AGREGADO : FILAS[0];
	const filas = f >= ANADIDA ? [primera, FILAS[1], NUEVA] : [primera, FILAS[1]];
	return {
		clase: f >= CARGA_LA_CLASE,
		claseEncima: f >= T.llegaClase - 4 && f < CARGA_LA_CLASE,
		filas,
		edicion: f >= T.pulsaLapiz && f < GUARDADA
			? { texto: FILAS[0] + escrito(f, AGREGADO, T.teclaEdicion, POR_LETRA), foco: f < T.llegaGuardar - 10, guardarEncima: f >= T.llegaGuardar - 4 }
			: null,
		lapizEncima: f >= T.llegaLapiz - 4 && f < T.pulsaLapiz,
		nuevo: {
			texto: f >= ANADIDA ? '' : escrito(f, NUEVA, T.teclaNuevo, POR_LETRA_NUEVA),
			foco: f >= T.pulsaNuevo && f < T.llegaAnadir - 10,
			anadirEncima: f >= T.llegaAnadir - 4 && f < T.pulsaAnadir + 10,
		},
	};
}

const Panel: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(f, fps, 0, 14);
	const p1 = plano({ conClase: true, filas: 2, editando: false });
	const pE = plano({ conClase: true, filas: 2, editando: true });
	const clase = { x: PG.relleno + ANCHO_CLASE * LA_CLASE + ANCHO_CLASE / 2, y: p1.tira + PG.tira / 2 };
	const lapiz = { x: PG.relleno + UTIL - 70, y: p1.filas[0] + PG.fila / 2 };
	const guardar = { x: PG.relleno + 240 + 10 + 60, y: pE.filas[0] + 12 + 70 + 10 + 22 };
	const nuevo = { x: PG.relleno + 300, y: p1.nuevo + 32 };
	const anadir = { x: PG.relleno + 240 + 10 + 64, y: p1.nuevo + 64 + 10 + 22 };
	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ENCUADRE.x, top: ENCUADRE.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE.escala * interpolate(a, [0, 1], [0.985, 1])})`, opacity: a }}>
				<PantallaMisCompetencias e={estadoEn(f)} />
				<Cursor
					puntos={[
						{ frame: T.cursorEntra, x: PG.ancho - 300, y: 560 },
						{ frame: T.llegaClase - 80, x: PG.ancho - 300, y: 560 },
						{ frame: T.llegaClase, ...clase },
						{ frame: T.pulsaClase + 20, ...clase },
						{ frame: T.llegaLapiz - 60, x: clase.x + 200, y: clase.y + 160 },
						{ frame: T.llegaLapiz, ...lapiz },
						{ frame: T.pulsaLapiz + 14, ...lapiz },
						{ frame: T.teclaEdicion - 6, x: lapiz.x - 40, y: lapiz.y + 150 },
						{ frame: T.llegaGuardar - 30, x: lapiz.x - 40, y: lapiz.y + 150 },
						{ frame: T.llegaGuardar, ...guardar },
						{ frame: T.pulsaGuardar + 12, ...guardar },
						{ frame: T.pulsaNuevo - 6, ...nuevo },
						{ frame: T.teclaNuevo + 10, x: nuevo.x + 700, y: nuevo.y + 90 },
						{ frame: T.llegaAnadir - 30, x: nuevo.x + 700, y: nuevo.y + 90 },
						{ frame: T.llegaAnadir, ...anadir },
						{ frame: T.pulsaAnadir + 14, ...anadir },
						{ frame: T.cursorSale, x: anadir.x + 500, y: anadir.y + 60 },
					]}
					clics={[T.pulsaClase, T.pulsaLapiz, T.pulsaGuardar, T.pulsaNuevo, T.pulsaAnadir]}
					aparece={T.cursorEntra}
					sale={T.cursorSale}
					tam={36}
				/>
			</div>
		</AbsoluteFill>
	);
};
