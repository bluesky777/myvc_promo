import React from 'react';

import { BARRA, BLANCO, ESTADO, FONDO, MARCO, PANTALLA, PRIMARIO } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL TELÉFONO. Cuerpo, isla y barra de estado -- lo justo para que se lea «esto es un móvil» y ni un
 * detalle más: **el marco no es lo que se vende**. Nada de reflejos ni de botones laterales, que es
 * donde se va el tiempo y lo que luego distrae de la pantalla.
 *
 * LA BARRA DE ESTADO VA DIBUJADA y no es adorno: sin hora ni batería, la captura se lee como una
 * maqueta. Con ellas se lee como el teléfono de alguien, que es de lo que va el clip -- el aviso le
 * llega a un padre en el bus, no a un navegador.
 */

export const ALTO_TELEFONO = PANTALLA.alto + MARCO * 2;
export const ANCHO_TELEFONO = PANTALLA.ancho + MARCO * 2;

export const Telefono: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div
		style={{
			width: ANCHO_TELEFONO,
			height: ALTO_TELEFONO,
			padding: MARCO,
			borderRadius: 60,
			background: '#1b1b1f',
			boxShadow: '0 34px 90px rgba(15,28,52,.32), 0 2px 10px rgba(15,28,52,.2), inset 0 0 0 2px #3a3a40',
			boxSizing: 'border-box',
		}}
	>
		<div
			style={{
				position: 'relative',
				width: PANTALLA.ancho,
				height: PANTALLA.alto,
				borderRadius: 47,
				overflow: 'hidden',
				background: FONDO,
			}}
		>
			{children}

			{/* La isla va por encima de todo: es del teléfono, no de la aplicación. */}
			<div style={{ position: 'absolute', top: 12, left: PANTALLA.ancho / 2 - 58, width: 116, height: 32, borderRadius: 16, background: '#0c0c0e', zIndex: 60 }} />
		</div>
	</div>
);

/** La barra de estado, encima del color de la aplicación. */
export const BarraDeEstado: React.FC<{ sobre?: string }> = ({ sobre = PRIMARIO }) => (
	<div style={{ height: ESTADO, background: sobre, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', color: BLANCO, fontSize: 17, fontWeight: 600 }}>
		<span>7:12</span>
		<span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
			<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
				<rect x="0" y="9" width="3.4" height="5" rx="1" fill="currentColor" />
				<rect x="5.5" y="6" width="3.4" height="8" rx="1" fill="currentColor" />
				<rect x="11" y="3" width="3.4" height="11" rx="1" fill="currentColor" />
				<rect x="16.5" y="0" width="3.4" height="14" rx="1" fill="currentColor" opacity=".45" />
			</svg>
			<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden>
				<path d="M9 12.4 1.2 4.6a11 11 0 0 1 15.6 0z" fill="currentColor" />
			</svg>
			<svg width="27" height="14" viewBox="0 0 27 14" aria-hidden>
				<rect x="0.6" y="0.6" width="22" height="12.8" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".6" />
				<rect x="2.4" y="2.4" width="15" height="9.2" rx="2" fill="currentColor" />
				<path d="M24.4 5v4a2.4 2.4 0 0 0 0-4z" fill="currentColor" opacity=".6" />
			</svg>
		</span>
	</div>
);

/** La barra de la aplicación: el título de la pantalla y, si se puede volver, la flecha. */
export const BarraDeApp: React.FC<{ titulo: string; volver?: boolean }> = ({ titulo, volver = false }) => (
	<div style={{ height: BARRA, background: PRIMARIO, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', color: BLANCO }}>
		{volver ? (
			<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
				<path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		) : (
			<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
				<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
			</svg>
		)}
		<span style={{ fontSize: 22, fontWeight: 600 }}>{titulo}</span>
	</div>
);
