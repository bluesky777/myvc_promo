import React from 'react';
import { useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO } from '../../notas/tema';
import { Impreso } from '../cierre-6/datos-catalogo';
import { NombreConRealce, Plegables } from './Catalogo';
import {
	ANCHO, Ajustes, CABEZA, COMPLETA, ENGRANAJE, IMPRIMIR, MESA, MOSTRAR, RECARGAR, Rect, TEXTOS, TIRA, VIS, VISOR, X_PANEL, Y_PANEL,
	disponerAjustes,
} from './datos';
import { BotonIcono, Icono, MESA as COLOR_MESA } from './Piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL INFORME CARGADO, con el catálogo recogido: la tira («Buscar otro informe» y «Mostrar
 * opciones»), y el panel del papel --`.visor--abierto`--: la cabecera con el nombre, sus pastillas,
 * los mandos que sube cada informe (recargar, imprimir y lo suyo) y los dos del panel, «Ajustes»
 * (el engranaje) y «Pantalla completa»; debajo, la mesa teñida con las hojas. El panel flotante de
 * ajustes cuelga 12 px bajo la cabecera, contra la derecha, y nace abierto en los papeles que tienen
 * algo más que «La hoja» (`ajustesAbiertos`).
 *
 * `catalogo-informes.html`, sección 4, y `visor-del-informe.scss`.
 */

export interface PropsVisor {
	frame: number;
	entraEn: number;
	/** El papel abierto; `null` en la pila entera, que no es una ficha del catálogo. */
	impreso: Impreso | null;
	/** Si el informe sube «Recargar» e «Imprimir» (la pila entera no: trae los suyos dentro). */
	propios?: boolean;
	/** Las pastillas del renglón: el grupo, el profesor… */
	params: string[];
	/** Lo que el informe sube a la cabecera además de recargar e imprimir, pintado por quien llama. */
	mandos?: React.ReactNode;
	ajustes?: Ajustes;
	/** Si el panel de ajustes está abierto, y desde cuándo (para su entrada). */
	panel?: { abierto: boolean; desde: number };
	senal?: string | null;
	pulsado?: string | null;
	moviendo?: { indice: number; desde: number } | null;
	fechaConFoco?: boolean;
	opacidad?: number;
	/** El papel, en coordenadas de la mesa. */
	children?: React.ReactNode;
}

export const Visor: React.FC<PropsVisor> = (p) => {
	const { fps } = useVideoConfig();
	const f = p.frame;
	const a = entra(f, fps, p.entraEn, 12);
	const panel = p.panel ?? { abierto: false, desde: 0 };
	const aPanel = panel.abierto ? entra(f, fps, panel.desde, 10) : 0;
	const aj = p.ajustes;
	const disp = aj ? disponerAjustes(aj, X_PANEL, Y_PANEL + 8, VIS.panel, true) : null;

	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO, height: '100%', opacity: (p.opacidad ?? 1) * a }}>
			{/* La tira. */}
			<div style={{ position: 'absolute', left: TIRA.x, top: TIRA.y, width: TIRA.ancho, height: TIRA.alto, display: 'flex', alignItems: 'center', gap: 12 }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						height: 36,
						padding: '0 14px',
						borderRadius: 8,
						border: `1px solid ${p.senal === 'buscar-otro' ? '#4096ff' : BORDE}`,
						background: SUPERFICIE,
						fontSize: 15.5,
						color: p.senal === 'buscar-otro' ? ACENTO : TEXTO,
					}}
				>
					<Icono que="lupa" tam={16} color={p.senal === 'buscar-otro' ? ACENTO : 'rgba(0,0,0,.65)'} />
					{TEXTOS.buscarOtro}
				</div>
				<div style={{ flex: 1 }} />
				<div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 10px', borderRadius: 6, border: `1px solid ${BORDE}`, background: SUPERFICIE, fontSize: 14, color: TEXTO }}>
					<Icono que="menu" tam={14} color="rgba(0,0,0,.65)" />
					{TEXTOS.mostrar}
				</div>
			</div>

			{/* El panel del papel: la mesa primero, la cabecera encima. */}
			<div
				style={{
					position: 'absolute',
					left: VISOR.x,
					top: VISOR.y,
					width: VISOR.ancho,
					height: VISOR.alto,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					border: `1px solid ${BORDE}`,
					borderRadius: 12,
					overflow: 'hidden',
				}}
			>
				<div style={{ position: 'absolute', left: MESA.x - VISOR.x, top: MESA.y - VISOR.y, width: MESA.ancho, height: MESA.alto, background: COLOR_MESA, overflow: 'hidden' }}>
					{p.children}
				</div>
			</div>

			{/* La cabecera. */}
			<div
				style={{
					position: 'absolute',
					left: CABEZA.x,
					top: CABEZA.y,
					width: CABEZA.ancho,
					height: CABEZA.alto,
					boxSizing: 'border-box',
					borderBottom: `1px solid ${BORDE}`,
					background: SUPERFICIE,
					borderRadius: '12px 12px 0 0',
					border: `1px solid ${BORDE}`,
				}}
			/>
			<BotonIcono r={MOSTRAR} que="menu" encima={p.senal === 'mostrar'} />
			<div
				style={{
					position: 'absolute',
					left: MOSTRAR.x + MOSTRAR.ancho + 14,
					top: CABEZA.y,
					height: CABEZA.alto,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					whiteSpace: 'nowrap',
				}}
			>
				{p.impreso && (
					<span style={{ fontSize: 19, fontWeight: 600, color: TEXTO }}>
						<NombreConRealce impreso={p.impreso} />
					</span>
				)}
				{p.params.map((t) => (
					<span key={t} style={{ fontSize: 14, fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: '#f0f2f5', color: 'rgba(0,0,0,.7)' }}>
						{t}
					</span>
				))}
			</div>
			{p.mandos}
			{p.propios !== false && (
				<>
					<BotonIcono r={RECARGAR} que="recargar" encima={p.senal === 'recargar'} />
					<BotonIcono r={IMPRIMIR} que="impresora" primario encima={p.senal === 'imprimir'} pulsado={p.pulsado === 'imprimir'} />
					<div style={{ position: 'absolute', left: IMPRIMIR.x + IMPRIMIR.ancho + 10, top: IMPRIMIR.y + 4, width: 1, height: IMPRIMIR.alto - 8, background: BORDE }} />
				</>
			)}
			<BotonIcono r={ENGRANAJE} que="engranaje" puesto={panel.abierto} encima={p.senal === 'ajustes'} pulsado={p.pulsado === 'ajustes'} />
			<BotonIcono r={COMPLETA} que="completa" encima={p.senal === 'completa'} />

			{/* El panel flotante de ajustes. */}
			{aj && disp && aPanel > 0 && (
				<div style={{ position: 'absolute', inset: 0, opacity: aPanel, transform: `translateY(${(1 - aPanel) * -8}px)` }}>
					<div
						style={{
							position: 'absolute',
							left: X_PANEL,
							top: Y_PANEL,
							width: VIS.panel,
							height: disp.fin - Y_PANEL + 6,
							boxSizing: 'border-box',
							background: SUPERFICIE,
							border: `1px solid ${BORDE}`,
							borderRadius: 12,
							boxShadow: '0 12px 32px rgba(15,28,52,.16), 0 2px 6px rgba(15,28,52,.08)',
						}}
					/>
					<Plegables ajustes={aj} x={X_PANEL} y={Y_PANEL + 8} ancho={VIS.panel} enElPanel senal={p.senal ?? null} f={f} moviendo={p.moviendo} fechaConFoco={p.fechaConFoco} />
				</div>
			)}
		</div>
	);
};

/** El rectángulo del panel flotante, para el foco. */
export function rectDelPanel(aj: Ajustes): Rect {
	const d = disponerAjustes(aj, X_PANEL, Y_PANEL + 8, VIS.panel, true);
	return { x: X_PANEL, y: Y_PANEL, ancho: VIS.panel, alto: d.fin - Y_PANEL + 6 };
}

/** Un texto gris en la cabecera, pegado a la izquierda de `derecha` («31 alumnos · 16 hojas…»). */
export const Resumen: React.FC<{ derecha: number; texto: React.ReactNode }> = ({ derecha, texto }) => (
	<div
		style={{
			position: 'absolute',
			right: ANCHO - derecha,
			top: CABEZA.y,
			height: CABEZA.alto,
			display: 'flex',
			alignItems: 'center',
			fontSize: 14.5,
			color: 'rgba(0,0,0,.5)',
			whiteSpace: 'nowrap',
		}}
	>
		{texto}
	</div>
);
