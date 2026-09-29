import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, escribiendo, escrito, llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Boton, IconoRecargar } from '../disciplina/Rejilla';
import {
	ALTO_FICHA, ANCHO_DER, ANCHO_FICHA, ANCHO_IZQ, COLUMNAS_DEL_LIBRO, FICHAS, GRUPO, LO_QUE_SE_ESCRIBE, NOTA_NUEVA, P,
	PERIODOS, PERIODO_DEL_LIBRO, X_FICHA, Y_FICHA0, casillaNota, escritas,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PLANILLA DE COMPORTAMIENTO DE app2 (`comportamiento-notas.html`), a pantalla completa.
 * Lo que cambia lo dice `Tiempos`; la geometría, `datos.ts`, que es de donde salen el foco y el
 * puntero.
 */

export interface Tiempos {
	monta: number;
	/** La nota: cuándo se pincha (queda seleccionada) y cuándo se teclea. */
	enfocaNota: number;
	empiezaNota: number;
	porTeclaNota: number;
	sueltaNota: number;
	/** La pestaña del periodo 2 y el libro. */
	pulsaPestana: number;
	enfocaCampo: number;
	empiezaTexto: number;
	porTecla: number;
	senaladaPestana: (frame: number) => boolean;
}

export const PantallaComportamiento: React.FC<{ t: Tiempos }> = ({ t }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame < t.monta - 1) { return null; }

	const panel = entra(frame, fps, t.monta, 14);

	return (
		<div
			style={{
				position: 'absolute', left: P.x, top: P.y, width: P.ancho, height: 1080 - P.y, borderRadius: '14px 14px 0 0',
				background: SUPERFICIE, boxShadow: '0 24px 64px rgba(15, 28, 52, .16)', opacity: panel, color: TEXTO, overflow: 'hidden',
			}}
		>
			<div style={{ position: 'absolute', top: P.relleno, left: P.relleno, right: P.relleno, display: 'flex', alignItems: 'flex-start' }}>
				<div>
					<div style={{ height: P.titulo, fontSize: 32, fontWeight: 700 }}>Comportamiento</div>
					<div style={{ height: P.grupo, fontSize: 19, color: TEXTO_TENUE }}>{GRUPO.nombre} · {GRUPO.abrev}</div>
				</div>
				<span style={{ flex: 1 }} />
				<Boton icono={<IconoRecargar />}>Recargar</Boton>
			</div>

			{/* La barra: el filtro, el tipo de frase y la cuenta. */}
			<div style={{ position: 'absolute', top: P.relleno + P.titulo + P.grupo + P.hueco, left: P.relleno, right: P.relleno, height: P.barra, display: 'flex', alignItems: 'flex-end', gap: 18, opacity: entra(frame, fps, t.monta + 8, 12) }}>
				<Campo rotulo="Filtrar alumnos" ancho={320}><span style={{ color: '#bfbfbf' }}>Apellido o nombre</span></Campo>
				<Campo rotulo="Frases del catálogo" ancho={240}>Todas</Campo>
				<span style={{ flex: 1 }} />
				<span style={{ fontSize: 17, color: TEXTO_TENUE, paddingBottom: 8 }}>6 de 6 alumnos</span>
			</div>

			{FICHAS.map((f, i) => {
				const ll = llega(frame, fps, i, t.monta + 14, 8);
				return (
					<div key={f.nombre} style={{ position: 'absolute', left: X_FICHA - P.x, top: Y_FICHA0 - P.y + i * (ALTO_FICHA + 18), opacity: ll.opacidad, transform: `translate(${ll.x}px, ${ll.y}px)` }}>
						<LaFicha i={i} t={t} frame={frame} fps={fps} />
					</div>
				);
			})}
		</div>
	);
};

const LaFicha: React.FC<{ i: number; t: Tiempos; frame: number; fps: number }> = ({ i, t, frame, fps }) => {
	const f = FICHAS[i];
	const suya = i === 0;

	/* La nota: seleccionada al pincharla, y lo tecleado la sustituye. */
	const notaEnfocada = suya && frame >= t.enfocaNota && frame < t.sueltaNota;
	const seleccionada = suya && frame >= t.enfocaNota && frame < t.empiezaNota;
	const tecleadas = suya && frame >= t.empiezaNota ? Math.min(NOTA_NUEVA.length, Math.floor((frame - t.empiezaNota) / t.porTeclaNota) + 1) : 0;
	const nota = suya && frame >= t.empiezaNota ? NOTA_NUEVA.slice(0, tecleadas) : f.nota;

	/* El libro: abre en Periodo 1; la de Sara pasa al 2 al pulsarlo. */
	const abierta = suya && frame >= t.pulsaPestana ? PERIODO_DEL_LIBRO : 1;
	const escribe = suya && abierta === PERIODO_DEL_LIBRO;
	const loEscrito = escribe ? escrito(frame, LO_QUE_SE_ESCRIBE, t.empiezaTexto, t.porTecla) : '';
	const extra = escribe && loEscrito.length > 0 ? 1 : 0;
	const enCampo = escribe && frame >= t.enfocaCampo;
	const cambio = suya && frame >= t.pulsaPestana ? entra(frame, fps, t.pulsaPestana, 10) : 1;

	const derechaNotas = ANCHO_FICHA - P.fichaRelleno;
	const c = casillaNota();

	return (
		<div style={{ width: ANCHO_FICHA, height: ALTO_FICHA, border: `1px solid ${BORDE}`, borderRadius: 10, boxSizing: 'border-box', position: 'relative', background: SUPERFICIE }}>
			{/* La cabecera: cara, nombre numerado, y a la derecha las notas. */}
			<div style={{ position: 'absolute', top: P.fichaRelleno, left: P.fichaRelleno, height: P.cabecera, display: 'flex', alignItems: 'center', gap: 16 }}>
				<Avatar tipo={f.sexo} variante={i} tam={52} />
				<span style={{ fontSize: 24, fontWeight: 600 }}>{i + 1}. {f.nombre}</span>
			</div>

			<Numero x={c.x - X_FICHA} y={P.fichaRelleno + 18} rotulo="Comportamiento" valor={nota} enfocado={notaEnfocada} seleccionado={seleccionada} cursor={notaEnfocada && !seleccionada && frame % 20 < 12} />
			<div style={{ position: 'absolute', left: derechaNotas - 290, top: P.fichaRelleno - 4, fontSize: 15, fontWeight: 600, color: TEXTO }}>Compromiso familiar</div>
			<Numero x={derechaNotas - 290} y={P.fichaRelleno + 18} rotulo="Nota" valor={f.familiar.nota} />
			<Numero x={derechaNotas - 160} y={P.fichaRelleno + 18} rotulo="Ausencias" valor={f.familiar.ausencias} />

			{/* EL LIBRO ROJO, a la izquierda. */}
			<div style={{ position: 'absolute', top: P.fichaRelleno + P.cabecera + P.entreCabeceraYCuerpo, left: P.fichaRelleno, width: ANCHO_IZQ }}>
				<div style={{ height: P.h3, fontSize: 20, fontWeight: 600 }}>Libro rojo</div>
				<div style={{ display: 'flex', height: P.pestanas, borderBottom: `1px solid ${BORDE}` }}>
					{PERIODOS.map((p) => {
						const puesta = p === abierta;
						const cuenta = escritas(f, p, p === PERIODO_DEL_LIBRO && suya ? extra : 0);
						const senalada = suya && p === PERIODO_DEL_LIBRO && t.senaladaPestana(frame);
						return (
							<div
								key={p}
								style={{
									width: P.anchoPestana, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, fontSize: 18,
									color: puesta || senalada ? ACENTO : TEXTO, fontWeight: puesta ? 600 : 400,
									boxShadow: puesta ? `inset 0 -2px 0 0 ${ACENTO}` : undefined, boxSizing: 'border-box',
								}}
							>
								Periodo {p}
								{cuenta > 0 && (
									<span
										style={{
											minWidth: 24, height: 24, borderRadius: 12, padding: '0 7px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
											background: puesta ? ACENTO : 'rgb(128 128 128 / 22%)', color: puesta ? '#fff' : TEXTO, fontSize: 14, fontWeight: 600,
											transform: `scale(${suya && p === PERIODO_DEL_LIBRO && extra ? 1 + 0.2 * (1 - interpolate(frame, [t.empiezaTexto, t.empiezaTexto + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) : 1})`,
										}}
									>
										{cuenta}
									</span>
								)}
							</div>
						);
					})}
				</div>

				<div style={{ marginTop: P.huecoPestanas, opacity: cambio }}>
					{COLUMNAS_DEL_LIBRO.map((col, k) => {
						const texto = escribe && k === 0 ? loEscrito : (f.libro[abierta] ?? ['', '', ''])[k];
						const aqui = enCampo && k === 0;
						return (
							<div key={col} style={{ display: 'flex', height: P.campo, marginBottom: k < 2 ? P.huecoCampo : 0 }}>
								<div style={{ width: P.etiquetaCampo, fontSize: 17, paddingTop: 8 }}>{col}</div>
								<div
									style={{
										flex: 1, border: `1px solid ${aqui ? ACENTO : BORDE}`, boxShadow: aqui ? `0 0 0 3px ${ACENTO}22` : 'none', borderRadius: 7,
										padding: '6px 12px', fontSize: 17, lineHeight: 1.35, boxSizing: 'border-box', color: texto ? TEXTO : '#bfbfbf',
									}}
								>
									{texto || 'Describa aquí'}
									{aqui && escribiendo(frame, LO_QUE_SE_ESCRIBE, t.empiezaTexto, t.porTecla) && frame % 20 < 12 && <span style={{ borderLeft: `2px solid ${TEXTO}`, marginLeft: 1 }} />}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* LAS FRASES DEL BOLETÍN, a la derecha. */}
			<div style={{ position: 'absolute', top: P.fichaRelleno + P.cabecera + P.entreCabeceraYCuerpo, left: P.fichaRelleno + ANCHO_IZQ + P.huecoColumnas, width: ANCHO_DER }}>
				<div style={{ height: P.h3, fontSize: 20, fontWeight: 600 }}>Frases del boletín</div>
				<div style={{ minHeight: 64, fontSize: 17 }}>
					{f.frases.length === 0
						? <div style={{ color: TEXTO_TENUE, paddingTop: 8 }}>Sin frases todavía.</div>
						: f.frases.map((fr) => (
							<div key={fr.frase} style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 8 }}>
								<span style={{ fontSize: 14, padding: '1px 8px', borderRadius: 4, background: '#f6ffed', border: '1px solid #b7eb8f', color: '#389e0d' }}>{fr.tipo}</span>
								{fr.frase}
								<span style={{ color: TEXTO_TENUE }}>×</span>
							</div>
						))}
				</div>
				<div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
					<Caja flex><span style={{ color: '#bfbfbf' }}>Elija una frase del catálogo</span></Caja>
					<Boton alto={38}>Agregar</Boton>
				</div>
				<div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
					<Caja flex><span style={{ color: '#bfbfbf' }}>…o escríbala aquí</span></Caja>
					<Boton alto={38}>Agregar</Boton>
				</div>
			</div>
		</div>
	);
};

const Campo: React.FC<{ rotulo: string; ancho: number; children: React.ReactNode }> = ({ rotulo, ancho, children }) => (
	<div>
		<div style={{ fontSize: 15, color: TEXTO_TENUE, marginBottom: 4 }}>{rotulo}</div>
		<div style={{ width: ancho, height: 38, border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 17, boxSizing: 'border-box' }}>{children}</div>
	</div>
);

const Caja: React.FC<{ flex?: boolean; children: React.ReactNode }> = ({ children }) => (
	<div style={{ flex: 1, height: 38, border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 17, boxSizing: 'border-box' }}>{children}</div>
);

const Numero: React.FC<{ x: number; y: number; rotulo: string; valor: string; enfocado?: boolean; seleccionado?: boolean; cursor?: boolean }> = ({
	x, y, rotulo, valor, enfocado = false, seleccionado = false, cursor = false,
}) => (
	<div style={{ position: 'absolute', left: x, top: y }}>
		<div style={{ fontSize: 15, color: TEXTO_TENUE, height: 22 }}>{rotulo}</div>
		<div
			style={{
				width: P.numero.ancho, height: P.numero.alto, marginTop: 4, border: `1px solid ${enfocado ? ACENTO : BORDE}`, boxShadow: enfocado ? `0 0 0 3px ${ACENTO}22` : 'none',
				borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxSizing: 'border-box', fontVariantNumeric: 'tabular-nums',
			}}
		>
			<span style={{ background: seleccionado ? '#bae0ff' : 'transparent', padding: '0 2px' }}>{valor}</span>
			{cursor && <span style={{ borderLeft: `2px solid ${TEXTO}`, height: 20, marginLeft: 1 }} />}
		</div>
	</div>
);
