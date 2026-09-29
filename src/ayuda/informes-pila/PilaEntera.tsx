import React from 'react';
import { useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO } from '../../notas/tema';
import { FilaDePila, MESA, Rect } from '../informes/datos';
import { Alerta, Boton, Icono } from '../informes/Piezas';
import { Boletin } from '../informes-ajustes/Boletin';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PILA ENTERA (`/informes/pila`, `pila-entera.html`), dentro de la mesa del visor: los mandos
 * pegados arriba --«Volver al catálogo», «La pila» con su cuenta, «Vaciar la pila» e «Imprimir
 * todo»--, el aviso amarillo si se mezclan papeles, y las hojas, cada informe con su separador
 * «1 de 14» (que no se imprime). Coordenadas de la mesa.
 */

/** La primera hoja de la pila: la primera alumna de 5°A (inventada). */
const DE_6A = { grupo: '5°A', nombre: 'Acevedo Lara Camila', sexo: 'mujer' as const, variante: 6, titular: 'Mauricio Esteban Pardo Gil' };

export const PE = { pad: 16, mando: 60, huecoAviso: 14, aviso: 76 };

export const rectMando = (): Rect => ({ x: PE.pad, y: PE.pad, ancho: MESA.ancho - PE.pad * 2, alto: PE.mando });
export const rectVolver = (): Rect => ({ x: PE.pad + 12, y: PE.pad + 12, ancho: 196, alto: 36 });
export const rectImprimirTodo = (): Rect => ({ x: MESA.ancho - PE.pad - 12 - 168, y: PE.pad + 12, ancho: 168, alto: 36 });
export const rectVaciar = (): Rect => ({ x: rectImprimirTodo().x - 8 - 150, y: PE.pad + 12, ancho: 150, alto: 36 });
export const rectAviso = (): Rect => ({ x: PE.pad, y: PE.pad + PE.mando + PE.huecoAviso, ancho: MESA.ancho - PE.pad * 2, alto: PE.aviso });

/** De la mesa al contenido de la cáscara. */
export const enElContenido = (r: Rect): Rect => ({ ...r, x: r.x + MESA.x, y: r.y + MESA.y });

export const PilaEntera: React.FC<{
	frame: number;
	desde: number;
	filas: FilaDePila[];
	mezcla: boolean;
	senal: string | null;
	pulsado: string | null;
}> = ({ frame, desde, filas, mezcla, senal, pulsado }) => {
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, desde, 10);
	const m = rectMando();
	const yHojas = mezcla ? rectAviso().y + PE.aviso + PE.huecoAviso : m.y + m.alto + PE.huecoAviso;
	const primera = filas[0];
	return (
		<div style={{ position: 'absolute', inset: 0, opacity: a }}>
			{/* El separador y la primera hoja: los boletines de 5°A empiezan aquí. */}
			<div style={{ position: 'absolute', left: PE.pad, top: yHojas, width: MESA.ancho - PE.pad * 2 }}>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 10, paddingTop: 10, borderTop: `1px dashed ${BORDE}`, fontSize: 14.5, color: 'rgba(0,0,0,.62)' }}>
					<span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.4, padding: '1px 8px', borderRadius: 99, background: '#e6f4ff', color: ACENTO, fontVariantNumeric: 'tabular-nums' }}>
						1 DE {filas.length}
					</span>
					<strong style={{ color: TEXTO, fontSize: 15.5 }}>{primera.nombre}</strong>
					<span>{primera.etiquetas.join(' · ')}</span>
				</div>
				<div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
					<Boletin c={{ foto: true, rector: true, titular: false, rojos: true, grafico: true, escalas: true, pendientes: false }} de={DE_6A} />
				</div>
			</div>

			{mezcla && (
				<div style={{ position: 'absolute', left: rectAviso().x, top: rectAviso().y }}>
					<Alerta
						tipo="warning"
						ancho={rectAviso().ancho}
						titulo="La pila mezcla papeles distintos"
						texto="Una impresión sólo puede usar un papel, así que todas saldrán en el de la primera. Si necesitas los dos, saca dos pilas."
						tam={15}
					/>
				</div>
			)}

			{/* Los mandos, pegados arriba. */}
			<div
				style={{
					position: 'absolute',
					left: m.x,
					top: m.y,
					width: m.ancho,
					height: m.alto,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					border: `1px solid ${BORDE}`,
					borderRadius: 12,
					boxShadow: '0 4px 14px rgba(15,28,52,.06)',
				}}
			/>
			<Boton r={rectVolver()} tipo="tenue" encima={senal === 'volver'} tam={15}>
				<Icono que="izquierda" tam={16} color={senal === 'volver' ? '#4096ff' : TEXTO} />
				Volver al catálogo
			</Boton>
			<div style={{ position: 'absolute', left: rectVolver().x + rectVolver().ancho + 16, top: m.y + 11, lineHeight: 1.3 }}>
				<div style={{ fontSize: 15.5, fontWeight: 700, color: TEXTO }}>La pila</div>
				<div style={{ fontSize: 13.5, color: 'rgba(0,0,0,.6)' }}>
					{filas.length} {filas.length === 1 ? 'informe' : 'informes'}, seguidos y en una sola impresión
				</div>
			</div>
			<Boton r={rectVaciar()} tipo="tenue" encima={senal === 'vaciar-pila'} tam={15}>
				Vaciar la pila
			</Boton>
			<Boton r={rectImprimirTodo()} tipo="primario" encima={senal === 'imprimir-todo'} pulsado={pulsado === 'imprimir-todo'} tam={15}>
				<Icono que="impresora" tam={16} color="#fff" />
				Imprimir todo
			</Boton>
		</div>
	);
};
