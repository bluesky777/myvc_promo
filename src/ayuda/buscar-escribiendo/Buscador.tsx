import React from 'react';
import { interpolate } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { IconoLupa, PALETA_CLARA } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { FUENTE } from '../tema';
import { B, Bloque, Fila, Icono, PIE, PLACEHOLDER, altoDelCuadro } from './datos';

/*
 * EL CUADRO DEL BUSCADOR, encima de toda la cáscara con su velo (`.velo`: negro al 45 %), en
 * coordenadas de la cáscara. Lo tecleado sale en negrita dentro de cada nombre, como en
 * `partes()`; la fila resaltada es la que abre Intro.
 */

const P = PALETA_CLARA;

export const Buscador: React.FC<{
	abierto: number;
	texto: string;
	/** El cursor de escritura, parpadeando. */
	caret: boolean;
	bloques: Bloque[] | null;
	resaltada: number | null;
	/** El renglón gris cuando no hay bloques («Buscando «valen»…»). */
	aviso?: string;
}> = ({ abierto, texto, caret, bloques, resaltada, aviso }) => {
	if (abierto <= 0.001) { return null; }
	const alto = altoDelCuadro(bloques);
	let n = -1;

	return (
		<>
			<div style={{ position: 'absolute', left: 0, top: 0, width: MEDIDAS.ancho, height: MEDIDAS.alto, background: `rgba(0,0,0,${0.45 * abierto})`, borderRadius: 12, zIndex: 11 }} />
			<div
				style={{
					position: 'absolute',
					left: B.x,
					top: B.y,
					width: B.ancho,
					height: alto,
					background: P.superficie,
					borderRadius: 12,
					boxShadow: '0 24px 60px rgba(0,0,0,.28)',
					overflow: 'hidden',
					fontFamily: FUENTE,
					color: P.texto,
					opacity: abierto,
					transform: `translateY(${interpolate(abierto, [0, 1], [-12, 0])}px) scale(${interpolate(abierto, [0, 1], [0.98, 1])})`,
					zIndex: 12,
				}}
			>
				{/* LA ENTRADA: la lupa, lo tecleado o la invitación, y la tecla Esc para cerrar. */}
				<div style={{ height: B.entrada, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', borderBottom: `1px solid #f0f0f0` }}>
					<IconoLupa color={P.tenue} tam={22} />
					<div style={{ flex: 1, fontSize: 21, whiteSpace: 'pre', display: 'flex', alignItems: 'center' }}>
						{texto ? <span>{texto}</span> : null}
						<span style={{ width: 2, height: 26, background: P.acento, opacity: caret ? 1 : 0, marginLeft: texto ? 1 : 0 }} />
						{!texto && <span style={{ color: '#bfbfbf', marginLeft: 2 }}>{PLACEHOLDER}</span>}
					</div>
					<span style={{ fontSize: 13, fontFamily: 'ui-monospace, Menlo, monospace', border: '1px solid #d9d9d9', borderBottomWidth: 2, borderRadius: 5, padding: '1px 7px', color: '#595959' }}>
						Esc
					</span>
				</div>

				{bloques !== null && bloques.length === 0 && (
					<div style={{ padding: '20px 22px', fontSize: 17, color: '#8c8c8c' }}>{aviso}</div>
				)}
				{bloques === null || bloques.length === 0 ? null : (
					<div style={{ padding: `${B.relleno}px 8px` }}>
						{bloques.map((b) => (
							<div key={b.titulo}>
								<div style={{ height: B.titulo, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', fontSize: 13, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: '#8c8c8c' }}>
									{b.titulo}
									<span style={{ padding: '0 7px', borderRadius: 999, background: 'rgba(0,0,0,.07)', fontSize: 12, letterSpacing: 0 }}>{b.cuenta}</span>
								</div>
								{b.partes.map((p, pi) => (
									<div key={`${b.titulo}-${pi}`}>
										{p.titulo && (
											<div style={{ height: B.seccion, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 14, fontWeight: 600, color: '#595959' }}>{p.titulo}</div>
										)}
										{p.filas.map((f) => {
											n++;
											return <FilaDelBuscador key={f.nombre} fila={f} texto={texto} resaltada={resaltada === n} />;
										})}
									</div>
								))}
							</div>
						))}
					</div>
				)}

				{bloques === null || bloques.length === 0 ? null : (
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							height: B.pie,
							borderTop: '1px solid #f0f0f0',
							display: 'flex',
							alignItems: 'center',
							padding: '0 18px',
							fontSize: 15,
							color: '#8c8c8c',
						}}
					>
						{PIE}
					</div>
				)}
			</div>
		</>
	);
};

/** Lo tecleado en negrita, sin tildes de por medio (la búsqueda de verdad las quita). */
function trozos(nombre: string, texto: string): { t: string; b: boolean }[] {
	const q = texto.trim().toLowerCase();
	if (!q) { return [{ t: nombre, b: false }]; }
	const i = nombre.toLowerCase().indexOf(q);
	if (i < 0) { return [{ t: nombre, b: false }]; }
	return [
		{ t: nombre.slice(0, i), b: false },
		{ t: nombre.slice(i, i + q.length), b: true },
		{ t: nombre.slice(i + q.length), b: false },
	];
}

const FilaDelBuscador: React.FC<{ fila: Fila; texto: string; resaltada: boolean }> = ({ fila, texto, resaltada }) => (
	<div
		style={{
			height: B.fila,
			display: 'flex',
			alignItems: 'center',
			gap: 14,
			padding: '0 12px',
			borderRadius: 8,
			background: resaltada ? `${P.acento}14` : 'transparent',
		}}
	>
		{fila.cara ? (
			<Avatar tipo={fila.cara[0]} variante={fila.cara[1]} tam={34} />
		) : (
			<IconoDeFila cual={fila.icono ?? 'grupo'} />
		)}
		<div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
			<span style={{ fontSize: 18, whiteSpace: 'pre' }}>
				{trozos(fila.nombre, texto).map((z, i) => (z.b ? <b key={i}>{z.t}</b> : <span key={i}>{z.t}</span>))}
			</span>
			{fila.pista && <span style={{ fontSize: 14, color: '#8c8c8c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fila.pista}</span>}
		</div>
		{fila.elegir ? (
			<span style={{ fontSize: 14, color: P.acento, fontWeight: 600 }}>Elegir</span>
		) : (
			<svg width="14" height="14" viewBox="0 0 10 10">
				<path d="M3.5 1.8 L6.8 5 L3.5 8.2" fill="none" stroke="#8c8c8c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)}
	</div>
);

const TONOS: Record<Icono, string> = { reloj: '#d46b08', baja: '#cf1322', informe: '#1677ff', grupo: '#389e0d' };

const IconoDeFila: React.FC<{ cual: Icono }> = ({ cual }) => {
	const c = TONOS[cual];
	const t = { fill: 'none', stroke: c, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<div style={{ width: 34, height: 34, borderRadius: 8, background: `${c}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
			<svg width="20" height="20" viewBox="0 0 18 18">
				{cual === 'reloj' && <><circle cx="9" cy="9" r="6.2" {...t} /><path d="M9 5.4 V9.2 L11.6 10.8" {...t} /></>}
				{cual === 'baja' && <path d="M2.6 5 L7 9.6 L9.8 7 L15 12 M15 8.4 V12 H11.4" {...t} />}
				{cual === 'informe' && <><path d="M4.4 2.6 H11 L13.6 5.2 V15.4 H4.4 Z" {...t} /><path d="M6.6 8.4 H11.4 M6.6 11 H11.4" {...t} /></>}
				{cual === 'grupo' && <><circle cx="6.6" cy="6.4" r="2.2" {...t} /><circle cx="12" cy="7.2" r="1.7" {...t} /><path d="M2.4 14.4 C2.4 11.6 4.3 10.4 6.6 10.4 C8.9 10.4 10.8 11.6 10.8 14.4" {...t} /></>}
			</svg>
		</div>
	);
};
