import React from 'react';

import { ALMENDROS, COLEGIO, Escudo as EscudoDelColegio, apellidosDe } from '../colegio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO COMÚN A LOS PAPELES DEL CIERRE (promovidos, acta de evaluación, acta de nivelación): los
 * colores de `informes/papel.scss` --los mismos del boletín de `competencias/`-- y el membrete del
 * colegio inventado. **El colegio es el del boletín**: mismo nombre, misma sigla dibujada. Nada de
 * escudos de verdad.
 */

export const PAPEL = {
	azul: '#1f4e79',
	azulTexto: '#173859',
	azulSuave: '#9db8d2',
	banda: '#dae7f5',
	gris: '#5c6b7a',
	rojo: '#8a0000',
	rojoTenue: '#fbecec',
	verde: '#1f6b3a',
	ambar: '#9a6a00',
	linea: '#23292f',
};

export const RECTOR = { nombre: apellidosDe(ALMENDROS.rector), cargo: 'Rector' };
export const TITULAR_9B = 'Herrera Lugo, Ana María';
export const CIUDAD = ALMENDROS.ciudad;

/** El escudo del colegio (`colegio/`), a `tam` de alto: es el que llevan todos los papeles. */
export const Escudo: React.FC<{ tam?: number }> = ({ tam = 46 }) => (
	<div style={{ width: tam, height: tam, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
		<EscudoDelColegio tam={tam / 1.12} />
	</div>
);

export const ALTO_MEMBRETE = 56;

/** Un membrete de una línea: escudo, colegio y título; a la derecha, lo que se pase. */
export const Membrete: React.FC<{ titulo: string; derecha?: React.ReactNode }> = ({ titulo, derecha }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 12, height: ALTO_MEMBRETE, boxSizing: 'border-box', paddingBottom: 8, borderBottom: `2px solid ${PAPEL.azul}` }}>
		<Escudo />
		<div style={{ flex: 1 }}>
			<div style={{ fontSize: 14, fontWeight: 700, color: PAPEL.azulTexto }}>{COLEGIO.nombre}</div>
			<div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.7, marginTop: 2 }}>{titulo}</div>
		</div>
		{derecha && <div style={{ fontSize: 10, color: 'rgba(0,0,0,.72)', textAlign: 'right', lineHeight: 1.4 }}>{derecha}</div>}
	</div>
);

/** La banda de sección, la del boletín. */
export const Banda: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div
		style={{
			padding: '3px 8px',
			margin: '10px 0 6px',
			background: PAPEL.banda,
			color: PAPEL.azulTexto,
			borderBottom: `1.2px solid ${PAPEL.azul}`,
			borderLeft: `3px solid ${PAPEL.azul}`,
			fontSize: 11.5,
			fontWeight: 700,
			letterSpacing: 0.5,
		}}
	>
		{children}
	</div>
);

/** Tres firmas repartidas, con su raya encima. */
export const Firmas: React.FC<{ firmas: { nombre?: string; cargo: string }[] }> = ({ firmas }) => (
	<div style={{ display: 'flex', gap: 40, marginTop: 30 }}>
		{firmas.map((f) => (
			<div key={f.cargo} style={{ flex: 1, textAlign: 'center' }}>
				<div style={{ borderTop: `1px solid ${PAPEL.linea}`, paddingTop: 3, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', minHeight: 14 }}>
					{f.nombre ?? ''}
				</div>
				<div style={{ fontSize: 9.5, color: PAPEL.gris }}>{f.cargo}</div>
			</div>
		))}
	</div>
);

/** La hoja: blanca, con su sombra, a su tamaño real. Se encoge fuera, en el encuadre. */
export const Hoja: React.FC<{ ancho: number; alto: number; opacidad?: number; children: React.ReactNode }> = ({ ancho, alto, opacidad = 1, children }) => (
	<div
		style={{
			width: ancho,
			height: alto,
			padding: '20px 22px',
			boxSizing: 'border-box',
			background: '#fff',
			color: '#000',
			fontSize: 11,
			lineHeight: 1.3,
			borderRadius: 4,
			boxShadow: '0 24px 64px rgba(15, 28, 52, .18), 0 2px 8px rgba(15, 28, 52, .07)',
			opacity: opacidad,
			overflow: 'hidden',
			position: 'relative',
		}}
	>
		{children}
	</div>
);

/** Una celda de tabla de papel: filete fino, 10,5 px. */
export const cel = (extra: React.CSSProperties = {}): React.CSSProperties => ({
	border: `0.8px solid ${PAPEL.azulSuave}`,
	padding: '3px 5px',
	fontSize: 10.5,
	...extra,
});

export const cab = (extra: React.CSSProperties = {}): React.CSSProperties => ({
	...cel(extra),
	background: PAPEL.banda,
	color: PAPEL.azulTexto,
	fontWeight: 700,
	fontSize: 10,
});
