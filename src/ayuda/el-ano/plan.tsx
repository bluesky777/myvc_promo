import React from 'react';

import { MEDIDAS } from '../medidas';
import { ACENTO, BORDE, Icono, LETRA, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';
import { CONTENIDO, MAIN } from '../montar-el-ano/planoAsignaturas';
import type { Rect } from './Aplicacion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «REFERENCIAS ▸ PLAN DE EVALUACIÓN» (`/plan-evaluacion`): LA CABECERA Y LA TIRA DE PESTAÑAS.
 *
 * Textos de `plan-evaluacion.html` y `.ts`: «Plan de evaluación · 2026», «Historial de cambios» y
 * las pestañas numeradas ① Modelo, ② Plantilla de notas, ③ Competencias (sólo si el año va por
 * competencias), ④ Reparto de notas, ⑤ Escalas de valoración. Cada una con su marca de estado
 * (`✓ Ponderado`, `! 75 %`…) cuando se sabe; mientras no se sabe, sin marca: las de ④ y ⑤ van sin
 * ella porque el vídeo no las mira.
 *
 * TODO EN COORDENADAS DE LA CÁSCARA (1440 × 900).
 */

export const PL = {
	cabecera: MAIN.y,
	altoCabecera: 40,
	pestanas: MAIN.y + 52,
	altoPestanas: 46,
	cuerpo: MAIN.y + 52 + 46 + 18,
	gutter: 32,
};

export interface Marca { tono: 'resuelto' | 'aviso' | 'progreso'; glifo?: string; texto?: string }
export interface PestanaPlan { clave: string; numero: string; etiqueta: string; marca?: Marca | null }

const anchoMarca = (m?: Marca | null) => (m ? 10 + ((m.glifo ? 1 : 0) + (m.texto?.length ?? 0)) * 7.4 + (m.glifo && m.texto ? 4 : 0) : 0);
export const anchoPestana = (p: PestanaPlan) => Math.round(16 + 6 + p.etiqueta.length * 7.5 + (p.marca ? 7 + anchoMarca(p.marca) : 0));

export function rectPestanaPlan(pestanas: PestanaPlan[], clave: string): Rect {
	let x = MAIN.x;
	for (const p of pestanas) {
		if (p.clave === clave) { return { x, y: PL.pestanas, ancho: anchoPestana(p), alto: PL.altoPestanas }; }
		x += anchoPestana(p) + PL.gutter;
	}
	throw new Error(`Plan: no hay pestaña «${clave}».`);
}

/** El panel blanco de la página, con su lienzo gris alrededor. */
export const PanelDePagina: React.FC<{ alto?: number; children?: React.ReactNode; opacidad?: number }> = ({ alto, children, opacidad = 1 }) => (
	<div style={{ position: 'absolute', inset: 0, background: '#f5f7fa' }}>
		<div
			style={{
				position: 'absolute',
				left: CONTENIDO.x - MEDIDAS.menu,
				top: CONTENIDO.y - MEDIDAS.barra,
				width: CONTENIDO.ancho,
				height: alto ?? MEDIDAS.alto - CONTENIDO.y + 40,
				background: SUPERFICIE,
				border: `1px solid ${BORDE}`,
				borderRadius: 10,
				boxSizing: 'border-box',
			}}
		/>
		<div style={{ position: 'absolute', inset: 0, opacity: opacidad }}>{children}</div>
	</div>
);

/** Un rectángulo de la cáscara, puesto dentro del hueco de la pantalla (que empieza tras menú y barra). */
export const Caja: React.FC<{ r: Rect; children?: React.ReactNode; estilo?: React.CSSProperties }> = ({ r, children, estilo }) => (
	<div style={{ position: 'absolute', left: r.x - MEDIDAS.menu, top: r.y - MEDIDAS.barra, width: r.ancho, height: r.alto, ...estilo }}>{children}</div>
);

export const CabeceraDelPlan: React.FC<{ year: number; pestanas: PestanaPlan[]; puesta: string; senalada?: string | null; aparece?: number }> = ({
	year, pestanas, puesta, senalada = null, aparece = 1,
}) => (
	<>
		<Caja r={{ x: MAIN.x, y: PL.cabecera, ancho: MAIN.ancho, alto: PL.altoCabecera }} estilo={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<div style={{ fontSize: 24, fontWeight: 600, color: TEXTO }}>
				Plan de evaluación<span style={{ marginLeft: 8, color: TEXTO_TENUE, fontWeight: 500 }}>· {year}</span>
			</div>
			<div style={{ height: 32, padding: '0 14px', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 7, fontSize: LETRA - 0.5, color: TEXTO }}>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4M12 7.5V12l3 2" />
				</svg>
				Historial de cambios
			</div>
		</Caja>
		<Caja
			r={{ x: MAIN.x, y: PL.pestanas, ancho: MAIN.ancho, alto: PL.altoPestanas }}
			estilo={{ display: 'flex', gap: PL.gutter, boxShadow: `inset 0 -1px 0 ${BORDE}`, opacity: aparece }}
		>
			{pestanas.map((p) => {
				const esta = p.clave === puesta;
				const encima = senalada === p.clave;
				return (
					<div
						key={p.clave}
						style={{
							width: anchoPestana(p),
							flex: 'none',
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							fontSize: LETRA,
							color: esta || encima ? ACENTO : TEXTO,
							boxShadow: esta ? `inset 0 -2px 0 ${ACENTO}` : undefined,
							whiteSpace: 'nowrap',
						}}
					>
						<span style={{ color: esta ? ACENTO : TEXTO_TENUE }}>{p.numero}</span>
						<span>{p.etiqueta}</span>
						{p.marca && <MarcaDePaso marca={p.marca} />}
					</div>
				);
			})}
		</Caja>
	</>
);

export const MarcaDePaso: React.FC<{ marca: Marca }> = ({ marca }) => {
	const c = marca.tono === 'resuelto'
		? { f: '#f6ffed', b: '#b7eb8f', l: '#389e0d' }
		: marca.tono === 'aviso'
			? { f: '#fffbe6', b: '#ffe58f', l: '#ad6800' }
			: { f: '#fafafa', b: '#d9d9d9', l: TEXTO_TENUE };
	return (
		<span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '0 6px', border: `1px solid ${c.b}`, borderRadius: 6, background: c.f, color: c.l, fontSize: 12.5, lineHeight: '22px' }}>
			{marca.glifo && <b>{marca.glifo}</b>}
			{marca.texto}
		</span>
	);
};

export { Icono };
