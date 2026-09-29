import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra, escrito } from '../../comunes/movimiento';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Catalogo } from '../certificado-imprimir/Catalogo';
import { ALUMNOS_DEL_GRUPO, EL_ALUMNO, EL_GRUPO, GRUPOS } from '../certificado-imprimir/datos';
import { Constancia } from './Constancia';
import { BARRA_CERCA, BUSCA, CERCA, CIERRE, ENTERA, FOCOS, INFORMES, LA_FICHA, PASOS, PUNTOS, RESULTADOS, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS 4: el catálogo dentro de la cáscara y, al cargar, la hoja con su barra de mandos.
 * La hoja son dos planos quietos --entera y de cerca--, encadenados de ida y de vuelta.
 */

export const EscenaConstanciaEstudio: React.FC = () => {
	const frame = useCurrentFrame();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < T.entraLaHoja && <EnLaCascara frame={frame} />}
			{frame >= T.entraLaHoja - 10 && <LaHoja frame={frame} />}

			{/* Las dos fichas llegan después de la última tecla (`Catalogo`: +4 y 5 por ficha); el foco las espera. */}
			<Foco
				recorte={paso?.foco ?? null}
				desde={paso?.foco === FOCOS.dosFichas ? T.resultados + 24 : paso?.desde ?? 0}
				hasta={paso?.focoHasta ?? acabaElPaso - 10}
			/>
			{[...BUSCA].map((_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={T.teclea + i * T.porTecla} />
			))}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/* TRES PLANOS QUIETOS: la hoja entera, de cerca el párrafo, y de cerca la barra de mandos. */
const LaHoja: React.FC<{ frame: number }> = ({ frame }) => {
	const e = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };
	const aCerca = interpolate(frame, [T.cercaDesde, T.cercaHasta], [0, 1], e);
	const aBarra = interpolate(frame, [T.lejosDesde, T.lejosHasta], [0, 1], e);
	const entera = 1 - aCerca;
	const cerca = aCerca * (1 - aBarra);
	return (
		<>
			{entera > 0 && <Plano encuadre={ENTERA} opacidad={entera} />}
			{cerca > 0 && <Plano encuadre={CERCA} opacidad={cerca} />}
			{aBarra > 0 && <Plano encuadre={BARRA_CERCA} opacidad={aBarra} />}
		</>
	);
};

const Plano: React.FC<{ encuadre: { escala: number; x: number; y: number }; opacidad: number }> = ({ encuadre, opacidad }) => (
	<div style={{ position: 'absolute', left: encuadre.x, top: encuadre.y, transformOrigin: '0 0', transform: `scale(${encuadre.escala})`, opacity: opacidad }}>
		<Constancia desde={T.entraLaHoja} />
	</div>
);

const EnLaCascara: React.FC<{ frame: number }> = ({ frame }) => {
	const { fps } = useVideoConfig();
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [T.seVaLaCascara, T.entraLaHoja], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const cierra = (a: number) => 1 - interpolate(frame, [a, a + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	const senaladaMenu = frame >= T.llegaInformes && frame < T.pulsaInformes + 10 ? { seccion: INFORMES.seccion, hija: null } : null;
	const senalado =
		frame >= T.llegaFicha && frame < T.pulsaFicha + 8
			? `ficha-${LA_FICHA}`
			: frame >= T.llegaGrupo && frame < T.pulsaGrupo
				? 'campo-grupo'
				: frame >= T.llegaAlumno && frame < T.pulsaAlumno
					? 'campo-alumno'
					: frame >= T.llegaCargar && frame < T.pulsaCargar + 6
						? 'cargar'
						: null;

	const desplegable =
		frame >= T.abreGrupo && frame < T.cierraGrupo + 8
			? { campo: 'grupo' as const, opciones: GRUPOS, senalada: frame >= T.llegaOpcion - 6 ? EL_GRUPO : null, t: entra(frame, fps, T.abreGrupo, 8) * cierra(T.cierraGrupo) }
			: frame >= T.abreAlumno && frame < T.cierraAlumno + 8
				? { campo: 'alumno' as const, opciones: ALUMNOS_DEL_GRUPO, senalada: frame >= T.llegaOpcion2 - 6 ? EL_ALUMNO : null, t: entra(frame, fps, T.abreAlumno, 8) * cierra(T.cierraAlumno) }
				: null;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					transformOrigin: '50% 45%',
					transform: `scale(${1 + seVa * 0.07})`,
					opacity: aparece * (1 - seVa),
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU_DIRECTIVO} abierta={null} senalada={senaladaMenu}>
						{frame >= T.montaCatalogo && (
							<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.montaCatalogo, 12) }}>
								<Catalogo
									frame={frame}
									busqueda={escrito(frame, BUSCA, T.teclea, T.porTecla)}
									buscadorConFoco={frame >= T.pulsaBuscador && frame < T.pulsaFicha}
									resultados={RESULTADOS}
									resultadosDesde={T.resultados}
									elegida={frame >= T.eligeFicha ? LA_FICHA : null}
									elegidaDesde={T.eligeFicha}
									valores={{
										grupo: frame >= T.pulsaOpcion ? GRUPOS[EL_GRUPO] : null,
										alumno: frame >= T.pulsaOpcion2 ? ALUMNOS_DEL_GRUPO[EL_ALUMNO] : null,
									}}
									desplegable={desplegable}
									senalado={senalado}
									interruptores={3}
								/>
							</div>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: T.cursorEntra, ...PUNTOS.entrada },
							{ frame: T.llegaInformes, ...PUNTOS.informes },
							{ frame: T.llegaBuscador, ...PUNTOS.buscador },
							{ frame: T.pulsaBuscador + 14, x: PUNTOS.buscador.x + 60, y: PUNTOS.buscador.y + 70 },
							{ frame: T.llegaFicha - 60, x: PUNTOS.buscador.x + 60, y: PUNTOS.buscador.y + 70 },
							{ frame: T.llegaFicha, ...PUNTOS.ficha },
							{ frame: T.llegaGrupo - 24, ...PUNTOS.ficha },
							{ frame: T.llegaGrupo, ...PUNTOS.grupo },
							{ frame: T.llegaOpcion - 16, ...PUNTOS.grupo },
							{ frame: T.llegaOpcion, ...PUNTOS.opcion },
							{ frame: T.llegaAlumno - 14, ...PUNTOS.opcion },
							{ frame: T.llegaAlumno, ...PUNTOS.alumno },
							{ frame: T.llegaOpcion2 - 16, ...PUNTOS.alumno },
							{ frame: T.llegaOpcion2, ...PUNTOS.opcion2 },
							{ frame: T.llegaCargar - 14, ...PUNTOS.opcion2 },
							{ frame: T.llegaCargar, ...PUNTOS.cargar },
						]}
						clics={[T.pulsaInformes, T.pulsaBuscador, T.pulsaFicha, T.pulsaGrupo, T.pulsaOpcion, T.pulsaAlumno, T.pulsaOpcion2, T.pulsaCargar]}
						aparece={T.cursorEntra}
						sale={T.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
