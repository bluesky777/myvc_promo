import React from 'react';

import { DESCUENTO, TARJETA_CONDICION, TARJETA_PIE, TARJETA_TITULAR } from './datos';
import { ACENTO, BORDE, TEXTO, TINTA_SUAVE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA TARJETA DEL TRATO, DIBUJADA UNA SOLA VEZ.
 *
 * SALE EN DOS SITIOS: suelta --la pieza `Tarjeta`, 6,5 s, por si el montador la quiere aparte-- y de
 * remate del clip del trato, detrás de las tres razones. **Estaba dibujada dentro de la pieza suelta
 * y por eso está aquí ahora**: dos tarjetas del 30 % dibujadas por separado son dos tarjetas que se
 * pueden separar, y en un vídeo donde una dice una cosa y otra dice otra, la que se lleva por
 * delante la reunión es la que nadie volvió a mirar.
 *
 * El texto vive en `datos.ts` y el ritmo en el guion de cada pieza; aquí sólo se dibuja.
 *
 * EL NÚMERO SE CUENTA, no aparece. Un 30 que sube desde 0 en un segundo se mira; un 30 que aparece
 * hecho se lee y se olvida. Es el mismo truco que el total de la planilla recalculándose al teclear
 * una nota, y aquí sirve para lo mismo: obliga al ojo a quedarse en la cifra.
 *
 * Y LA CONDICIÓN VA ENTERA Y AL MISMO TAMAÑO DE LECTURA. Una oferta cuya letra pequeña no se lee en
 * el vídeo se convierte en una discusión en la reunión siguiente. Aquí no hay letra pequeña.
 */
export const TarjetaOferta: React.FC<{
	/** La entrada de la tarjeta, de 0 a 1. */
	t: number;
	/** Lo que lleva contado el número. Se calcula fuera porque cada pieza lo cuenta a su ritmo. */
	cuenta: number;
	tTitular: number;
	tCondicion: number;
	tPie: number;
	/** Lo que devuelve `estiloDeSalida`. */
	salida?: { opacidad: number; x: number; escala: number };
}> = ({ t, cuenta, tTitular, tCondicion, tPie, salida = { opacidad: 1, x: 0, escala: 1 } }) => (
	<div
		style={{
			background: '#ffffff',
			border: `1px solid ${BORDE}`,
			borderRadius: 22,
			boxShadow: '0 18px 60px rgba(22, 32, 43, 0.12)',
			padding: '62px 86px',
			textAlign: 'center',
			maxWidth: 1280,
			opacity: t * salida.opacidad,
			transform: `translateY(${(1 - t) * 26}px) translateX(${salida.x}px) scale(${(0.94 + t * 0.06) * salida.escala})`,
		}}
	>
		<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 14 }}>
			<span style={{ fontSize: 210, fontWeight: 700, letterSpacing: -8, color: ACENTO, lineHeight: 1 }}>{cuenta}</span>
			<span style={{ fontSize: 96, fontWeight: 600, color: ACENTO, lineHeight: 1 }}>%</span>
		</div>
		<div
			style={{
				fontSize: 44,
				fontWeight: 600,
				color: TEXTO,
				marginTop: 10,
				opacity: tTitular,
				transform: `translateY(${(1 - tTitular) * 12}px)`,
			}}
		>
			{TARJETA_TITULAR}
		</div>
		<div style={{ width: 96, height: 3, borderRadius: 2, background: BORDE, margin: '32px auto', opacity: tCondicion }} />
		<div style={{ fontSize: 34, color: TEXTO, opacity: tCondicion, transform: `translateY(${(1 - tCondicion) * 14}px)` }}>
			{TARJETA_CONDICION}
		</div>
		<div style={{ fontSize: 26, color: TINTA_SUAVE, marginTop: 26, opacity: tPie, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.4 }}>
			{TARJETA_PIE}
		</div>
	</div>
);

/** El tope al que sube el número. Aquí para que ninguna pieza cuente hasta otro sitio. */
export const TOPE = DESCUENTO;
