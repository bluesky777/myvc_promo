import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MENU_DIRECTIVO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { EnPersonas, aparece, avance, entre, senaladaDelMenu } from '../personas/comun';
import { PantallaDirectorio } from '../secretaria/Directorio';
import { PantallaImportar, type EstadoImportar } from '../importar/Pantalla';
import { BAJA_COLUMNAS, BAJA_HOJAS, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * IMPORTAR, 1: la cáscara con Alumnos (la del directorio, sin grupo) y, al pulsar «Importar
 * alumnos», la pantalla de importar en su sitio. Todo pasa dentro de la cáscara; la página baja
 * con scroll cuando lo que hay que ver queda debajo, como bajaría quien la usa.
 */

/* El scroll va a saltos de 25 px de la cáscara (21 del fotograma, enteros): así los filetes de 1 px
 * de las tablas no caen a medio píxel y no se encienden y apagan al pasar. */
const entero = (d: number) => Math.round(d / 25) * 25;

const suave = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };

export const EscenaImportarHojas: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara />
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

export function estadoEn(f: number): EstadoImportar {
	if (f < T.empiezaALeer) { return { fase: 'inicio', malaLaHoja: true, paso: 'archivo', encima: entre(f, T.llegaElegir - 6, T.pulsaElegir + 6) ? 'elegir' : null }; }
	if (f < T.ensayo) { return { fase: 'leyendo', malaLaHoja: true, paso: 'archivo', progreso: 100 * avance(f, T.empiezaALeer, T.terminaDeLeer) }; }
	if (f < T.hojas) { return { fase: 'ensayo', malaLaHoja: true, paso: 'archivo', encima: entre(f, T.llegaSiguiente - 6, T.pulsaSiguiente + 4) ? 'siguiente' : null }; }
	if (f < T.columnas) {
		return {
			fase: 'ensayo', malaLaHoja: true, paso: 'hojas',
			desplazada: entero(interpolate(f, [T.bajaDesde, T.bajaHasta], [0, BAJA_HOJAS], suave)),
			encima: entre(f, T.encimaHoja + 4, T.bajaDesde) ? 'hoja' : entre(f, T.llegaSiguiente2 - 6, T.pulsaSiguiente2 + 4) ? 'siguiente' : null,
		};
	}
	return { fase: 'ensayo', malaLaHoja: true, paso: 'columnas', desplazada: entero(interpolate(f, [T.bajaColumnasDesde, T.bajaColumnasHasta], [0, BAJA_COLUMNAS], suave)) };
}

const EnLaCascara: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const menu = MENU_DIRECTIVO;
	const senalada = entre(f, T.llegaPersonas, T.pulsaPersonas + 10)
		? senaladaDelMenu(menu, null)
		: entre(f, T.llegaEntrada, T.pulsaEntrada + 10)
			? senaladaDelMenu(menu, 'Alumnos')
			: null;

	/* El directorio se va desde el clic y la pantalla de importar entra encima: se desmonta cuando ya no se ve. */
	const directorio = f >= T.monta && f < T.montaImportar + 14;
	const salidaDirectorio = 1 - avance(f, T.pulsaImportar, T.montaImportar + 10);

	return (
		<EnPersonas
			menu={menu}
			personas={aparece(f, fps, T.abrePersonas, 16)}
			senalada={senalada}
			opacidad={aparece(f, fps, 0, 14)}
			cursor={{
				puntos: [
					{ frame: T.cursorEntra, ...PUNTOS.entrada },
					{ frame: T.llegaPersonas, ...PUNTOS.personas },
					{ frame: T.llegaEntrada, ...PUNTOS.alumnos },
					{ frame: T.llegaImportar - 20, ...PUNTOS.alumnos },
					{ frame: T.llegaImportar, ...PUNTOS.importar },
					{ frame: T.pulsaImportar + 10, ...PUNTOS.importar },
					{ frame: T.llegaElegir - 20, x: PUNTOS.elegir.x + 200, y: PUNTOS.elegir.y - 150 },
					{ frame: T.llegaElegir, ...PUNTOS.elegir },
					{ frame: T.pulsaElegir + 10, ...PUNTOS.elegir },
					{ frame: T.llegaSiguiente - 30, x: PUNTOS.siguiente.x - 120, y: PUNTOS.siguiente.y + 40 },
					{ frame: T.llegaSiguiente, ...PUNTOS.siguiente },
					{ frame: T.pulsaSiguiente + 10, ...PUNTOS.siguiente },
					{ frame: T.encimaHoja, ...PUNTOS.select },
					{ frame: T.bajaDesde, ...PUNTOS.select },
					{ frame: T.llegaSiguiente2, ...PUNTOS.siguiente2 },
					{ frame: T.pulsaSiguiente2 + 10, ...PUNTOS.siguiente2 },
					{ frame: T.cursorSale - 20, x: PUNTOS.siguiente2.x - 40, y: PUNTOS.siguiente2.y - 60 },
				],
				clics: [T.pulsaPersonas, T.pulsaEntrada, T.pulsaImportar, T.pulsaElegir, T.pulsaSiguiente, T.pulsaSiguiente2],
				aparece: T.cursorEntra,
				sale: T.cursorSale,
			}}
		>
			{directorio && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.monta, 12) * salidaDirectorio }}>
					<PantallaDirectorio estado={{ grupo: null, filas: [], encimaCabecera: entre(f, T.llegaImportar - 6, T.pulsaImportar + 6) ? 2 : null }} />
				</div>
			)}
			{f >= T.montaImportar && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.montaImportar, 12) }}>
					<PantallaImportar e={estadoEn(f)} />
				</div>
			)}
		</EnPersonas>
	);
};
