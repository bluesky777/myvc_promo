import React from 'react';

import { BORDE, LETRA, SUPERFICIE, TEXTO } from '../montar-el-ano/ant';
import { CABECERA, FILA, type Columna, type FilaDeRejilla } from '../montar-el-ano/Rejilla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA REJILLA CON DESPLAZAMIENTO VERTICAL. Es `montar-el-ano/Rejilla` (AG Grid, tema Quartz, las
 * mismas medidas) pero las filas se pueden bajar dentro de su alto, como la rueda del ratón sobre
 * una rejilla de `40vh`: la cabecera se queda y las filas pasan por debajo, con su barra a la
 * derecha. La hace falta a «Matricular», donde la fila recién matriculada entra al final de una
 * lista que no cabe.
 */

export const Tabla: React.FC<{
	columnas: Columna[];
	filas: FilaDeRejilla[];
	ancho: number;
	alto: number;
	/** Cuánto se han bajado las filas, en píxeles. */
	bajada?: number;
}> = ({ columnas, filas, ancho, alto, bajada = 0 }) => {
	const cuerpo = alto - CABECERA * 2;
	const total = filas.length * FILA;
	const conBarra = total > cuerpo;

	return (
		<div
			style={{
				width: ancho,
				height: alto,
				boxSizing: 'border-box',
				border: `1px solid ${BORDE}`,
				borderRadius: 8,
				background: SUPERFICIE,
				overflow: 'hidden',
				position: 'relative',
				fontSize: LETRA - 0.5,
				color: TEXTO,
			}}
		>
			{[0, 1].map((k) => (
				<div key={k} style={{ display: 'flex', height: CABECERA, background: '#f8f8f8', boxShadow: `inset 0 -1px 0 ${BORDE}` }}>
					{columnas.map((c) => (
						<div
							key={c.clave}
							style={{
								width: c.ancho,
								flex: 'none',
								display: 'flex',
								alignItems: 'center',
								justifyContent: c.alinear === 'centro' ? 'center' : 'flex-start',
								padding: k === 0 ? '0 14px' : '0 10px',
								boxSizing: 'border-box',
								fontWeight: 600,
								whiteSpace: 'nowrap',
								overflow: 'hidden',
							}}
						>
							{k === 0 ? c.titulo : c.filtro ? <div style={{ width: '100%', height: 28, border: `1px solid ${BORDE}`, borderRadius: 4, background: SUPERFICIE }} /> : null}
						</div>
					))}
				</div>
			))}

			<div style={{ position: 'absolute', left: 0, right: 0, top: CABECERA * 2, height: cuerpo, overflow: 'hidden' }}>
				<div style={{ transform: `translateY(${-bajada}px)` }}>
					{filas.map((f) => (
						<div
							key={f.clave}
							style={{
								display: 'flex',
								height: FILA,
								boxShadow: `inset 0 -1px 0 #eceef1`,
								background: f.fondo ?? 'transparent',
								opacity: f.opacidad ?? 1,
							}}
						>
							{columnas.map((c) => (
								<div
									key={c.clave}
									style={{
										width: c.ancho,
										flex: 'none',
										display: 'flex',
										alignItems: 'center',
										justifyContent: c.alinear === 'centro' ? 'center' : c.alinear === 'derecha' ? 'flex-end' : 'flex-start',
										padding: c.alinear === 'centro' ? 0 : '0 14px',
										boxSizing: 'border-box',
										whiteSpace: 'nowrap',
										overflow: 'hidden',
									}}
								>
									{f.celdas[c.clave]}
								</div>
							))}
						</div>
					))}
				</div>
			</div>

			{filas.length === 0 && (
				<div style={{ position: 'absolute', left: 0, right: 0, top: CABECERA * 2, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.45)' }}>
					No hay datos que mostrar.
				</div>
			)}

			{conBarra && (
				<div style={{ position: 'absolute', right: 2, top: CABECERA * 2 + 2, width: 8, height: cuerpo - 4 }}>
					<div
						style={{
							position: 'absolute',
							left: 0,
							width: 8,
							borderRadius: 4,
							background: 'rgba(0,0,0,0.28)',
							height: ((cuerpo - 4) * cuerpo) / total,
							top: ((cuerpo - 4) * bajada) / total,
						}}
					/>
				</div>
			)}
		</div>
	);
};

export { CABECERA, FILA };
