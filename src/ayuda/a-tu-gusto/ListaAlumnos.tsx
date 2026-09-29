import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { llega } from '../../comunes/movimiento';
import { PALETA_CLARA, PaletaCascara } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { Migas } from '../moverse/comun';
import { ALUMNOS_8A, CABECERA, COLUMNAS, ELEGIDO, FILA, GRUPOS, MIGAS_LISTA, PISTA } from './lista';

/*
 * LA LISTA DE ALUMNOS, con los colores de la paleta (claro u oscuro) y la densidad de la rejilla.
 * El ancho es el del hueco que deja el menú: plegado, caben más columnas, que es lo que se gana.
 */

const L = { lados: 32, arriba: 6, titulo: 52, grupos: 52, pista: 40 };

export const ListaAlumnos: React.FC<{
	ancho: number;
	p?: PaletaCascara;
	compacta?: boolean;
	desde?: number;
}> = ({ ancho, p = PALETA_CLARA, compacta = false, desde = 0 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const oscuro = p !== PALETA_CLARA;
	const fila = compacta ? FILA.compacta : FILA.comoda;
	const cabecera = compacta ? CABECERA.compacta : CABECERA.comoda;
	const letra = compacta ? 15 : 17;
	const rejilla = { fondo: oscuro ? '#1f1f1f' : '#ffffff', cabecera: oscuro ? '#262626' : '#fafafa', linea: oscuro ? '#303030' : '#e8e8e8', par: oscuro ? '#222222' : '#fcfcfc' };
	const ancho_ = ancho - L.lados * 2;
	const entra = (i: number) => llega(frame, fps, i, desde + 4, 5).opacidad;
	const arribaRejilla = L.arriba + 40 + L.titulo + L.grupos + L.pista;

	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: ancho, height: MEDIDAS.alto - MEDIDAS.barra, color: p.texto }}>
			<div style={{ position: 'absolute', left: 0, top: L.arriba, width: ancho }}>
				<Migas migas={MIGAS_LISTA} izquierda={L.lados} derecha={L.lados} colores={p} />
			</div>
			<div style={{ position: 'absolute', left: L.lados, top: L.arriba + 40, height: L.titulo, display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700, opacity: entra(0) }}>
				Lista de alumnos
			</div>

			{/* Los grupos, como botones; el elegido, azul; la estrella, el del titular. */}
			<div style={{ position: 'absolute', left: L.lados, top: L.arriba + 40 + L.titulo, height: L.grupos, display: 'flex', gap: 8, alignItems: 'center', opacity: entra(1) }}>
				{GRUPOS.map((g, i) => (
					<div
						key={g.abrev}
						style={{
							height: 36,
							padding: '0 16px',
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							borderRadius: 6,
							border: `1px solid ${i === ELEGIDO ? p.acento : p.borde}`,
							background: i === ELEGIDO ? p.acento : p.superficie,
							color: i === ELEGIDO ? '#fff' : p.texto,
							fontSize: 16,
						}}
					>
						{g.abrev}
						{g.titular && (
							<svg width="13" height="13" viewBox="0 0 16 16">
								<path d="M8 1.6 L9.9 5.8 L14.4 6.2 L11 9.2 L12 13.7 L8 11.3 L4 13.7 L5 9.2 L1.6 6.2 L6.1 5.8 Z" fill="#faad14" />
							</svg>
						)}
					</div>
				))}
			</div>
			<div style={{ position: 'absolute', left: L.lados, top: L.arriba + 40 + L.titulo + L.grupos, height: L.pista, display: 'flex', alignItems: 'center', fontSize: 15, color: p.tenue, opacity: entra(2) }}>
				{PISTA}
			</div>

			{/* LA REJILLA: se corta por la derecha y por abajo, como en la pantalla (tiene más columnas y más filas). */}
			<div
				style={{
					position: 'absolute',
					left: L.lados,
					top: arribaRejilla,
					width: ancho_,
					height: MEDIDAS.alto - MEDIDAS.barra - arribaRejilla - 20,
					border: `1px solid ${rejilla.linea}`,
					borderRadius: 8,
					background: rejilla.fondo,
					overflow: 'hidden',
					opacity: entra(3),
				}}
			>
				<div style={{ display: 'flex', height: cabecera, background: rejilla.cabecera, borderBottom: `1px solid ${rejilla.linea}`, fontSize: letra, fontWeight: 600 }}>
					{COLUMNAS.map((c) => (
						<div key={c.id} style={{ width: c.ancho, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 12px', boxSizing: 'border-box', borderRight: `1px solid ${rejilla.linea}` }}>
							{c.titulo}
						</div>
					))}
				</div>
				{ALUMNOS_8A.map((a, i) => (
					<div key={a.usuario} style={{ display: 'flex', height: fila, background: i % 2 ? rejilla.par : rejilla.fondo, borderBottom: `1px solid ${rejilla.linea}`, fontSize: letra }}>
						<Celda ancho={COLUMNAS[0].ancho}>{i + 1}</Celda>
						<Celda ancho={COLUMNAS[1].ancho}>
							<span style={{ display: 'inline-flex', marginRight: 8 }}>
								<Avatar tipo={a.sexo === 'F' ? 'mujer' : 'hombre'} variante={i + 3} tam={compacta ? 22 : 30} />
							</span>
							{a.nombres}
						</Celda>
						<Celda ancho={COLUMNAS[2].ancho}>{a.apellidos}</Celda>
						<Celda ancho={COLUMNAS[3].ancho}>
							<span style={{ display: 'inline-flex', gap: 8 }}>
								<Icono color="#1677ff" cual="ficha" />
								<Icono color="#722ed1" cual="grupo" />
							</span>
						</Celda>
						<Celda ancho={COLUMNAS[4].ancho}>{a.sexo}</Celda>
						<Celda ancho={COLUMNAS[5].ancho}>{a.matricula}</Celda>
						<Celda ancho={COLUMNAS[6].ancho}>{a.usuario}</Celda>
						<Celda ancho={COLUMNAS[7].ancho}>0</Celda>
					</div>
				))}
			</div>
		</div>
	);
};

const Celda: React.FC<{ ancho: number; children: React.ReactNode }> = ({ ancho, children }) => (
	<div style={{ width: ancho, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 12px', boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden' }}>{children}</div>
);

const Icono: React.FC<{ color: string; cual: 'ficha' | 'grupo' }> = ({ color, cual }) => (
	<span style={{ width: 26, height: 26, borderRadius: 6, background: `${color}1f`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
		<svg width="15" height="15" viewBox="0 0 16 16">
			{cual === 'ficha' && <path d="M2 3.5 H14 V12.5 H2 Z M4.6 6.2 H7.4 V9.4 H4.6 Z M9 6.6 H12 M9 9 H12" fill="none" stroke={color} strokeWidth="1.4" />}
			{cual === 'grupo' && <path d="M6 5.4 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M2 13 C2 10.6 3.8 9.4 6 9.4 C8.2 9.4 10 10.6 10 13 M11 5.6 a1.6 1.6 0 1 0 0.1 0 M11.4 9.6 C13 9.8 14.2 10.8 14.2 12.8" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />}
		</svg>
	</span>
);
