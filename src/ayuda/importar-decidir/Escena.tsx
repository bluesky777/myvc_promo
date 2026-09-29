import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MENU_DIRECTIVO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { AvisoApp, EnPersonas, aparece, avance, entre, senaladaDelMenu } from '../personas/comun';
import { PantallaDirectorio } from '../secretaria/Directorio';
import { FILAS_DEL_LIBRO, TRUNCADOS } from '../importar/datos';
import { PantallaImportar, type EstadoImportar } from '../importar/Pantalla';
import { Efecto } from '../voz';
import { AVISO, BAJA, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * IMPORTAR, 2: la misma pantalla que el vídeo anterior. Cambia el estado --lo decidido, la
 * relectura, la importación-- y la página baja cuando lo que hay que ver queda debajo.
 */

/* El scroll va a saltos de 25 px de la cáscara (21 del fotograma, enteros): así los filetes de 1 px
 * de las tablas no caen a medio píxel y no se encienden y apagan al pasar. */
const entero = (d: number) => Math.round(d / 25) * 25;

const suave = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };

export const EscenaImportarDecidir: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara />
			{/* El paso de «Lo que pasó» empieza con el aviso, pero la página baja hasta él después: el foco espera a que llegue. */}
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde === T.hecho ? T.bajaHechoHasta : paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<AvisoApp texto={AVISO.texto} desde={AVISO.desde} dura={AVISO.dura} />
			<Efecto cual="aviso" en={AVISO.desde} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const desplegable = (f: number, abre: number, llega: number, cierra: number, cual: number) => {
	if (f < abre || f >= cierra + 8) { return null; }
	const t = f < cierra ? avance(f, abre, abre + 8) : 1 - avance(f, cierra, cierra + 8);
	return { cual, t, resaltada: f >= llega - 6 ? TRUNCADOS[cual].elegida : null };
};

export function estadoEn(f: number): EstadoImportar {
	const base = { malaLaHoja: false };
	if (f < T.empiezaALeer) { return { ...base, fase: 'inicio', paso: 'archivo', encima: entre(f, T.llegaElegir - 6, T.pulsaElegir + 6) ? 'elegir' : null }; }
	if (f < T.ensayo) { return { ...base, fase: 'leyendo', paso: 'archivo', progreso: 100 * avance(f, T.empiezaALeer, T.terminaDeLeer) }; }
	if (f < T.celdas) { return { ...base, fase: 'ensayo', paso: 'archivo', encima: entre(f, T.llegaCeldas - 6, T.pulsaCeldas + 4) ? 'paso-3' : null }; }
	if (f < T.valores) {
		return {
			...base, fase: 'ensayo', paso: 'celdas', vacioConservar: f >= T.pulsaIgnorar,
			encima: entre(f, T.llegaIgnorar - 6, T.pulsaIgnorar + 4) ? 'ignorar' : entre(f, T.llegaSiguiente - 6, T.pulsaSiguiente + 4) ? 'siguiente' : null,
		};
	}
	if (f < T.resumen) {
		return {
			...base, fase: 'ensayo', paso: 'valores', vacioConservar: true,
			elegidos: [f >= T.pulsaOpcion1, f >= T.pulsaOpcion2],
			desplegable: desplegable(f, T.pulsaSelect1, T.llegaOpcion1, T.pulsaOpcion1, 0) ?? desplegable(f, T.pulsaSelect2, T.llegaOpcion2, T.pulsaOpcion2, 1),
			planDeAntes: f < T.releido,
			releyendo: entre(f, T.pulsaReleer, T.releido),
			encima: entre(f, T.llegaSelect1 - 6, T.pulsaSelect1) ? 'select-0'
				: entre(f, T.llegaSelect2 - 6, T.pulsaSelect2) ? 'select-1'
					: entre(f, T.llegaReleer - 6, T.pulsaReleer) ? 'releer'
						: entre(f, T.llegaSiguiente2 - 6, T.pulsaSiguiente2 + 4) ? 'siguiente' : null,
		};
	}
	const desplazada = entero(
		f < T.importando ? interpolate(f, [T.bajaDesde, T.bajaHasta], [0, BAJA.resumen], suave)
			: f < T.hecho ? interpolate(f, [T.importando, T.bajaImportandoHasta], [BAJA.resumen, BAJA.importando], suave)
				: interpolate(f, [T.bajaHechoDesde, T.bajaHechoHasta], [BAJA.importando, BAJA.hecho], suave));
	const p = avance(f, T.importando + 6, T.hecho - 14);
	return {
		...base, fase: 'ensayo', paso: 'resumen', desplazada,
		importando: entre(f, T.importando, T.hecho) ? { progreso: 100 * p, filas: Math.round(FILAS_DEL_LIBRO * p) } : null,
		hecho: f >= T.hecho,
		encima: entre(f, T.llegaImportarAlumnos - 6, T.pulsaImportarAlumnos + 2) ? 'importar' : null,
	};
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
					{ frame: T.llegaElegir, ...PUNTOS.elegir },
					{ frame: T.pulsaElegir + 10, ...PUNTOS.elegir },
					{ frame: T.llegaCeldas - 20, x: PUNTOS.celdas.x + 30, y: PUNTOS.celdas.y + 90 },
					{ frame: T.llegaCeldas, ...PUNTOS.celdas },
					{ frame: T.pulsaCeldas + 10, ...PUNTOS.celdas },
					{ frame: T.llegaIgnorar - 25, x: PUNTOS.ignorar.x + 40, y: PUNTOS.ignorar.y - 80 },
					{ frame: T.llegaIgnorar, ...PUNTOS.ignorar },
					{ frame: T.pulsaIgnorar + 10, ...PUNTOS.ignorar },
					{ frame: T.llegaSiguiente, ...PUNTOS.siguiente },
					{ frame: T.pulsaSiguiente + 10, ...PUNTOS.siguiente },
					{ frame: T.llegaSelect1, ...PUNTOS.select1 },
					{ frame: T.pulsaSelect1 + 6, ...PUNTOS.select1 },
					{ frame: T.llegaOpcion1, ...PUNTOS.opcion1 },
					{ frame: T.pulsaOpcion1 + 6, ...PUNTOS.opcion1 },
					{ frame: T.llegaSelect2, ...PUNTOS.select2 },
					{ frame: T.pulsaSelect2 + 6, ...PUNTOS.select2 },
					{ frame: T.llegaOpcion2, ...PUNTOS.opcion2 },
					{ frame: T.pulsaOpcion2 + 6, ...PUNTOS.opcion2 },
					{ frame: T.llegaReleer, ...PUNTOS.releer },
					{ frame: T.releido + 4, ...PUNTOS.releer },
					{ frame: T.llegaSiguiente2, ...PUNTOS.siguiente2 },
					{ frame: T.pulsaSiguiente2 + 10, ...PUNTOS.siguiente2 },
					{ frame: T.llegaImportarAlumnos - 25, x: PUNTOS.importarAlumnos.x - 120, y: PUNTOS.importarAlumnos.y - 60 },
					{ frame: T.llegaImportarAlumnos, ...PUNTOS.importarAlumnos },
					{ frame: T.cursorSale, x: PUNTOS.importarAlumnos.x - 40, y: PUNTOS.importarAlumnos.y - 160 },
				],
				clics: [T.pulsaPersonas, T.pulsaEntrada, T.pulsaImportar, T.pulsaElegir, T.pulsaCeldas, T.pulsaIgnorar, T.pulsaSiguiente, T.pulsaSelect1, T.pulsaOpcion1, T.pulsaSelect2, T.pulsaOpcion2, T.pulsaReleer, T.pulsaSiguiente2, T.pulsaImportarAlumnos],
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
