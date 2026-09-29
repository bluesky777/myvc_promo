import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MENU_DIRECTIVO } from '../medidas';
import { FONDO, FUENTE, TINTA, TINTA_SUAVE } from '../tema';
import { pasoEn } from '../tiempos';
import { BotonP, EnPersonas, aparece, avance, entre, senaladaDelMenu } from '../personas/comun';
import { PantallaDirectorio, type FilaDirectorio } from '../secretaria/Directorio';
import { ALMENDROS } from '../colegio';
import { Certificado } from '../certificado-imprimir/Certificado';
import { CERTIFICADOS, EL_ALUMNO, GRUPO, NOMBRE, PantallaFicha, SEPTIMO_A } from './Pantalla';
import { CIERRE, FOCOS, HOJAS, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS DE UN ALUMNO: la cáscara (directorio y ficha) y, al pulsar «Ver todos los
 * certificados», un plano quieto con las dos hojas recortadas por abajo. No se reescala nada: cada
 * hoja se pinta a su escala fija, como en «Lo que imprime este año».
 */

export const EscenaCertificadosAlumno: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < T.entranLasHojas && <EnLaCascara />}
			{frame >= T.entranLasHojas - 10 && <LasHojas />}
			{/* El botón de la ficha no existe hasta que llega la lista: su foco espera a que se llene. */}
			<Foco recorte={paso?.foco ?? null} desde={paso?.foco === FOCOS.ficha ? T.llenaLaLista : paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const LasHojas: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const tira = entra(f, fps, T.entranLasHojas - 4, 16);
	return (
		<>
			{/* Los mandos del informe, en la cabecera de su panel: el título, «N años de …», Recargar e Imprimir. */}
			<div
				style={{
					position: 'absolute',
					left: HOJAS.tira.x,
					top: HOJAS.tira.y,
					width: HOJAS.tira.ancho,
					height: HOJAS.tira.alto,
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: '0 20px',
					background: '#fff',
					borderRadius: 10,
					boxShadow: '0 12px 32px rgba(15, 28, 52, .10)',
					opacity: tira,
					fontFamily: FUENTE,
				}}
			>
				<span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(0,0,0,0.88)' }}>Certificados de estudio</span>
				<span style={{ fontSize: 19, color: 'rgba(0,0,0,0.55)' }}>{CERTIFICADOS.length} años de {NOMBRE}</span>
				<span style={{ flex: 1 }} />
				<BotonP texto="Recargar" icono="reload" ancho={116} />
				<BotonP texto="Imprimir" icono="imprimir" ancho={116} />
			</div>

			{CERTIFICADOS.map((c, i) => {
				const a = entra(f, fps, T.entranLasHojas + 6 + i * 8, 16);
				return (
					<div key={c.year} style={{ position: 'absolute', left: HOJAS.x[i], top: HOJAS.y - 40, width: HOJAS.ancho, opacity: a }}>
						<div style={{ height: 32, display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: FUENTE }}>
							<span style={{ fontSize: 24, fontWeight: 700, color: TINTA }}>{c.year}</span>
							<span style={{ fontSize: 20, color: TINTA_SUAVE }}>{c.grado} · {c.estado === 'MATR' ? 'matriculado' : 'asistente'}</span>
						</div>
						<div style={{ marginTop: 8, width: HOJAS.ancho, height: HOJAS.alto, overflow: 'hidden', borderRadius: 4, boxShadow: '0 18px 48px rgba(15, 28, 52, .16)' }}>
							<div style={{ transformOrigin: '0 0', transform: `scale(${HOJAS.escala})` }}>
								<Certificado conMembrete hastaPeriodo={null} numero={c.numero} encabezado={ALMENDROS.encabezado} desde={-100} year={c.year} grado={c.grado} />
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
};

const EnLaCascara: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const menu = MENU_DIRECTIVO;
	const senalada = entre(f, T.llegaPersonas, T.pulsaPersonas + 10)
		? senaladaDelMenu(menu, null)
		: entre(f, T.llegaEntrada, T.pulsaEntrada + 10)
			? senaladaDelMenu(menu, 'Alumnos')
			: null;
	const seVa = interpolate(f, [T.seVaLaCascara, T.entranLasHojas], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const llegada = avance(f, T.llegaLaLista, T.llenaLaLista);
	const filas: FilaDirectorio[] = f >= T.pulsaGrupo
		? SEPTIMO_A.map((alumno, i) => ({
				alumno,
				estado: 'Matr',
				opacidad: Math.max(0, Math.min(1, llegada * (SEPTIMO_A.length + 2) - i)),
				encimaAccion: i === EL_ALUMNO && entre(f, T.llegaFicha - 6, T.pulsaFicha + 6) ? 0 : null,
			}))
		: [];
	const directorio = f >= T.monta && f < T.montaFicha + 14;
	return (
		<EnPersonas
			menu={menu}
			personas={aparece(f, fps, T.abrePersonas, 16)}
			senalada={senalada}
			opacidad={aparece(f, fps, 0, 14) * (1 - seVa)}
			acercamiento={seVa}
			cursor={{
				puntos: [
					{ frame: T.cursorEntra, ...PUNTOS.entrada },
					{ frame: T.llegaPersonas, ...PUNTOS.personas },
					{ frame: T.llegaEntrada, ...PUNTOS.alumnos },
					{ frame: T.llegaGrupo - 40, ...PUNTOS.alumnos },
					{ frame: T.llegaGrupo, ...PUNTOS.grupo },
					{ frame: T.pulsaGrupo + 10, ...PUNTOS.grupo },
					{ frame: T.llegaFicha, ...PUNTOS.ficha },
					{ frame: T.pulsaFicha + 10, ...PUNTOS.ficha },
					{ frame: T.llegaCertificados - 40, x: PUNTOS.certificados.x - 80, y: PUNTOS.certificados.y + 160 },
					{ frame: T.llegaCertificados, ...PUNTOS.certificados },
				],
				clics: [T.pulsaPersonas, T.pulsaEntrada, T.pulsaGrupo, T.pulsaFicha, T.pulsaCertificados],
				aparece: T.cursorEntra,
				sale: T.cursorSale,
			}}
		>
			{directorio && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.monta, 12) * (1 - avance(f, T.pulsaFicha, T.montaFicha + 10)) }}>
					<PantallaDirectorio estado={{ grupo: f >= T.pulsaGrupo ? GRUPO : null, filas, encimaGrupo: entre(f, T.llegaGrupo - 6, T.pulsaGrupo) ? GRUPO : null }} />
				</div>
			)}
			{f >= T.montaFicha && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.montaFicha, 12) }}>
					<PantallaFicha encimaCertificados={entre(f, T.llegaCertificados - 6, T.pulsaCertificados + 6)} />
				</div>
			)}
		</EnPersonas>
	);
};
