import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { conPausas } from '../disciplina/pausas';
import { EnLaCascaraDe } from '../EnLaCascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { ACADEMICO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Bajar } from '../sin-internet/Bajar';
import { LA_COMPLETA, SIN_INTERNET } from '../sin-internet/datos';
import { RESERVA } from '../sin-internet/datos-de-la-subida';
import { EstadoSubir, Subir, estadoInicial } from '../sin-internet/Subir';
import { CIERRE, COLUMNA, LECTURA, LLEGADA, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * «SUBIR: EL ARCHIVO Y LAS COLUMNAS»: encadena, no dibuja. La cáscara con «Trabajar sin internet»,
 * el botón «Subir una planilla», y la pantalla de subir con su lectura y dos de sus pasos.
 */

function estadoDeSubir(frame: number): EstadoSubir {
	const e = estadoInicial();
	const rel = (f: number) => f - LLEGADA.montaSubir;
	if (frame >= LECTURA.empieza) {
		e.fase = 'leyendo';
		e.progreso = interpolate(frame, [LECTURA.empieza, LECTURA.acaba], [0, 1], { extrapolateRight: 'clamp' });
	}
	if (frame >= LECTURA.acaba) { e.fase = 'leido'; e.pasoDesde = rel(LECTURA.acaba); }
	if (frame >= COLUMNA.entraReserva) { e.paso = 'reserva'; e.hasta = 1; e.pasoDesde = rel(COLUMNA.entraReserva); }
	if (frame >= COLUMNA.entraChoques) { e.paso = 'choques'; e.hasta = 2; e.pasoDesde = rel(COLUMNA.entraChoques); }

	const r = e.reserva;
	r.lista = frame >= COLUMNA.pulsaSelect && frame < COLUMNA.pulsaOpcion;
	r.encimaOpcion = frame >= COLUMNA.llegaOpcion - 4 && frame < COLUMNA.pulsaOpcion ? 1 : null;
	if (frame >= COLUMNA.pulsaOpcion) { r.decision = 'crear'; }
	r.tecleando = frame >= COLUMNA.pulsaNombre && frame < COLUMNA.llegaSiguiente2 - 20;
	r.nombre = frame >= COLUMNA.empiezaNombre
		? RESERVA.nombre.slice(0, Math.min(RESERVA.nombre.length, Math.floor((frame - COLUMNA.empiezaNombre) / COLUMNA.porLetra) + 1))
		: '';

	e.encima = frame >= LECTURA.llegaElegir - 4 && frame < LECTURA.pulsaElegir + 6 ? 'elegir'
		: frame >= COLUMNA.llegaSiguiente - 4 && frame < COLUMNA.pulsaSiguiente + 6 ? 'siguiente'
			: frame >= COLUMNA.llegaSelect - 4 && frame < COLUMNA.pulsaSelect ? 'select-reserva'
				: frame >= COLUMNA.llegaSiguiente2 - 4 && frame < COLUMNA.pulsaSiguiente2 + 6 ? 'siguiente'
					: null;
	return e;
}

export const EscenaSinInternetSubirColumnas: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = entra(frame, fps, LLEGADA.abreAcademico, 16);
	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaSinInternet && frame < LLEGADA.pulsaSinInternet + 10
			? { seccion: ACADEMICO, hija: SIN_INTERNET }
			: null;

	const clics = [
		LLEGADA.pulsaAcademico, LLEGADA.pulsaSinInternet, LLEGADA.pulsaSubir, LECTURA.pulsaElegir,
		COLUMNA.pulsaSiguiente, COLUMNA.pulsaSelect, COLUMNA.pulsaOpcion, COLUMNA.pulsaNombre, COLUMNA.pulsaSiguiente2,
	];

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascaraDe
				abierta={{ seccion: ACADEMICO, t: abierta }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: conPausas([
						{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
						{ frame: LLEGADA.llegaAcademico, ...PUNTOS.academico },
						{ frame: LLEGADA.llegaSinInternet, ...PUNTOS.sinInternet },
						{ frame: LLEGADA.llegaSubir, ...PUNTOS.subir },
						{ frame: LLEGADA.pulsaSubir + 20, x: PUNTOS.subir.x - 60, y: PUNTOS.subir.y + 180 },
						{ frame: LECTURA.llegaElegir - 18, x: PUNTOS.subir.x - 60, y: PUNTOS.subir.y + 180 },
						{ frame: LECTURA.llegaElegir, ...PUNTOS.elegir },
						{ frame: LECTURA.pulsaElegir + 20, ...PUNTOS.reposo },
						{ frame: COLUMNA.llegaSiguiente - 18, ...PUNTOS.reposo },
						{ frame: COLUMNA.llegaSiguiente, ...PUNTOS.siguiente },
						{ frame: COLUMNA.pulsaSiguiente + 20, ...PUNTOS.reposo },
						{ frame: COLUMNA.llegaSelect - 18, ...PUNTOS.reposo },
						{ frame: COLUMNA.llegaSelect, ...PUNTOS.select },
						{ frame: COLUMNA.llegaOpcion, ...PUNTOS.opcion },
						{ frame: COLUMNA.llegaNombre, ...PUNTOS.nombre },
						{ frame: COLUMNA.pulsaNombre + 14, x: PUNTOS.nombre.x + 30, y: PUNTOS.nombre.y + 60 },
						{ frame: COLUMNA.llegaSiguiente2 - 18, x: PUNTOS.nombre.x + 30, y: PUNTOS.nombre.y + 60 },
						{ frame: COLUMNA.llegaSiguiente2, ...PUNTOS.siguiente2 },
						{ frame: COLUMNA.pulsaSiguiente2 + 20, ...PUNTOS.reposo },
					], clics),
					clics,
					aparece: LLEGADA.cursorEntra,
					sale: TARJETA - 20,
				}}
			>
				{frame >= LLEGADA.montaBajar && frame < LLEGADA.montaSubir && (
					<Sequence from={LLEGADA.montaBajar}>
						<Bajar
							estado={{
								fuera: [LA_COMPLETA],
								descargando: false,
								encima: frame >= LLEGADA.llegaSubir - 4 && frame < LLEGADA.pulsaSubir + 6 ? 'subir' : null,
								salidaEn: LLEGADA.pulsaSubir - LLEGADA.montaBajar,
							}}
						/>
					</Sequence>
				)}
				{frame >= LLEGADA.montaSubir && (
					<Sequence from={LLEGADA.montaSubir}>
						<Subir e={estadoDeSubir(frame)} />
					</Sequence>
				)}
			</EnLaCascaraDe>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{[...RESERVA.nombre].map((_, k) => (
				<Efecto key={k} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[k % 3]} en={COLUMNA.empiezaNombre + k * COLUMNA.porLetra} />
			))}
			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
