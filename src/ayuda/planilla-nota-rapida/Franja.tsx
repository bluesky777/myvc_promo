import React from 'react';
import { useCurrentFrame } from 'remotion';

import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ALUMNOS } from '../../notas/planilla';
import { ENCIMA, PIEZAS, Tiempos, busquedaEn, estadoEn, valorEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE VA ENCIMA DE LA TABLA: la franja de la nota rápida y el buscador, con los textos de app2
 * (`paginas/notas/planilla-notas.html`, secciones `.rapida` y `.buscador`).
 *
 *     ☐ Nota rápida    Valor [ borrar ]   🗑 cada clic BORRA la nota
 *     [ Buscar por nombre, apellido o nota… ]   2 de 6
 *
 * EL VALOR SE PINTA SIEMPRE Y SE APAGA CON `visibility`, como allí: marcar la casilla no mueve nada.
 * Y la frase de al lado cambia con el campo: vacío, «cada clic BORRA la nota» en rojo y con la
 * papelera; con un número, «cada clic pone 0».
 *
 * (En app2, entre la franja y el buscador va además «Modo nivelación». Aquí no sale: es otro vídeo y
 * no cabe sin encoger la planilla por debajo de lo legible.)
 */

const PELIGRO = '#cf1322';
const SUAVE = '#595959';

export const Franja: React.FC<{ t: Tiempos }> = ({ t }) => {
	const frame = useCurrentFrame();

	const activa = frame >= t.activa;
	const valor = valorEn(t, frame);
	const borra = valor === null;
	const busqueda = busquedaEn(t, frame);
	const cuantas = estadoEn(t, frame).filas?.length ?? ALUMNOS.length;

	/* El cursor de texto: en el campo del valor mientras se escribe, en el buscador mientras se busca. */
	const enElValor = t.valores.some((v) => v.desde > 0 && frame >= v.desde - 14 && frame < v.desde + 26);
	const enElBuscador = frame >= t.busca.empieza - 10 && frame < t.busca.borra + 40;
	const parpadeo = frame % 30 < 18;

	return (
		<div style={{ position: 'absolute', inset: 0 }}>
			{/* ── la nota rápida ── */}
			<div style={{ position: 'absolute', left: 0, top: ENCIMA.franja.y, height: ENCIMA.franja.alto, width: '100%' }}>
				<div
					style={{
						position: 'absolute',
						left: PIEZAS.casillaX.x,
						top: PIEZAS.casillaX.y,
						width: PIEZAS.casillaX.ancho,
						height: PIEZAS.casillaX.alto,
						borderRadius: 5,
						border: `2px solid ${activa ? ACENTO : BORDE}`,
						background: activa ? ACENTO : SUPERFICIE,
						boxSizing: 'border-box',
					}}
				>
					{activa && (
						<svg width="20" height="20" viewBox="0 0 20 20" style={{ position: 'absolute', left: 0, top: 0 }}>
							<path d="M4.5 10.2 L8.4 14 L15.5 6.2" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					)}
				</div>
				<span style={{ position: 'absolute', left: PIEZAS.casillaX.ancho + 12, top: 8, fontSize: 21, color: TEXTO, whiteSpace: 'nowrap' }}>
					Nota rápida
				</span>

				<div style={{ visibility: activa ? 'visible' : 'hidden' }}>
					<span style={{ position: 'absolute', left: PIEZAS.etiquetaValor.x, top: 10, fontSize: 19, color: SUAVE }}>Valor</span>
					<div
						style={{
							position: 'absolute',
							left: PIEZAS.campoValor.x,
							top: PIEZAS.campoValor.y,
							width: PIEZAS.campoValor.ancho,
							height: PIEZAS.campoValor.alto,
							borderRadius: 7,
							border: `1px solid ${enElValor ? ACENTO : BORDE}`,
							boxShadow: enElValor ? `0 0 0 3px ${ACENTO}22` : 'none',
							background: SUPERFICIE,
							display: 'flex',
							alignItems: 'center',
							padding: '0 12px',
							boxSizing: 'border-box',
							fontSize: 21,
							color: borra ? '#bfbfbf' : TEXTO,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{borra ? 'borrar' : String(valor)}
						{enElValor && <span style={{ width: 2, height: 22, marginLeft: borra ? 0 : 2, background: TEXTO, opacity: parpadeo ? 1 : 0, order: borra ? -1 : 0 }} />}
					</div>
					<span
						style={{
							position: 'absolute',
							left: PIEZAS.hace.x,
							top: 11,
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							fontSize: 18,
							color: borra ? PELIGRO : SUAVE,
							fontWeight: borra ? 600 : 400,
							whiteSpace: 'nowrap',
						}}
					>
						{borra && <Papelera />}
						{borra ? 'cada clic BORRA la nota' : `cada clic pone ${valor}`}
					</span>
				</div>
			</div>

			{/* ── el buscador ── */}
			<div style={{ position: 'absolute', left: 0, top: ENCIMA.buscador.y, height: ENCIMA.buscador.alto, width: '100%' }}>
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: ENCIMA.buscador.ancho,
						height: ENCIMA.buscador.alto,
						borderRadius: 7,
						border: `1px solid ${enElBuscador ? ACENTO : BORDE}`,
						boxShadow: enElBuscador ? `0 0 0 3px ${ACENTO}22` : 'none',
						background: SUPERFICIE,
						display: 'flex',
						alignItems: 'center',
						padding: '0 14px',
						boxSizing: 'border-box',
						fontSize: 20,
						color: busqueda ? TEXTO : '#bfbfbf',
						whiteSpace: 'nowrap',
					}}
				>
					{busqueda || 'Buscar por nombre, apellido o nota…'}
					{enElBuscador && <span style={{ width: 2, height: 22, marginLeft: 1, background: TEXTO, opacity: parpadeo ? 1 : 0, order: busqueda ? 0 : -1 }} />}
				</div>
				{busqueda && (
					<span style={{ position: 'absolute', left: ENCIMA.buscador.ancho + 18, top: 11, fontSize: 18, color: TEXTO_TENUE }}>
						{cuantas} de {ALUMNOS.length}
					</span>
				)}
			</div>
		</div>
	);
};

/** El `delete` de Ant, dibujado. */
const Papelera: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 18 18">
		<path d="M3 4.6 H15 M7 4.4 V3 H11 V4.4 M4.6 4.8 L5.4 15 H12.6 L13.4 4.8" fill="none" stroke={PELIGRO} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M7.6 7.4 V12.4 M10.4 7.4 V12.4" fill="none" stroke={PELIGRO} strokeWidth="1.4" strokeLinecap="round" />
	</svg>
);
