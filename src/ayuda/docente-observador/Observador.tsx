import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { ALMENDROS, Escudo } from '../colegio';
import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Boton, IconoRecargar } from '../disciplina/Rejilla';
import { ALUMNOS, GRUPO } from '../disciplina/datos';
import {
	ACADEMICO, CONTROLES, CONVIVENCIA, DATOS_DE_SARA, EN_LA_HOJA, FALLAS, FLECHA_ARRIBA, HOJA, IMPRIMIR, MARGEN_IZQUIERDO,
	MARGEN_SUPERIOR, PAGINA, X_HOJA, Y_HOJA,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «OBSERVADOR COMPLETO», la pestaña nueva. Lo de arriba no se imprime (`hidden-print`); la hoja sí.
 * Mientras carga dice «Trayendo el observador del grupo…», que es cuando el PUT escribe en la base.
 *
 * EL MEMBRETE va detrás y los márgenes corren **el contenido** sobre él: no son los márgenes del
 * papel. Por eso al subir el superior se ve bajar el texto, y el membrete se queda quieto.
 */

export const PaginaDelObservador: React.FC<{
	monta: number;
	carga: number;
	/** Cuánto vale el margen superior en este fotograma. */
	margen: (frame: number) => number;
	/** Si el ratón está sobre el campo del margen (Ant enseña las flechas) o sobre Imprimir. */
	sobreMargen: (frame: number) => boolean;
	sobreImprimir: (frame: number) => boolean;
}> = ({ monta, carga, margen, sobreMargen, sobreImprimir }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame < monta) { return null; }

	const a = entra(frame, fps, monta, 14);
	const hoja = entra(frame, fps, carga, 16);
	const sup = margen(frame);
	const alumno = ALUMNOS[0];

	return (
		<>
			<div
				style={{
					position: 'absolute', left: PAGINA.x, top: PAGINA.y, width: PAGINA.ancho, height: 1080 - PAGINA.y,
					background: '#f0f2f5', borderRadius: '14px 14px 0 0', overflow: 'hidden', opacity: a,
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16)', color: TEXTO,
				}}
			>
				<div style={{ height: PAGINA.barra, background: SUPERFICIE, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12 }}>
					<span style={{ fontSize: 28, fontWeight: 700 }}>Observador completo</span>
					<span style={{ fontSize: 22, color: TEXTO_TENUE }}>— {GRUPO.nombre}</span>
					<span style={{ flex: 1 }} />
					<Boton icono={<IconoRecargar />}>Recargar</Boton>
					<Boton primario ancho={IMPRIMIR.ancho} senalado={sobreImprimir(frame)} icono={<IconoImpresora />}>Imprimir</Boton>
				</div>

				<div style={{ height: PAGINA.tira, background: SUPERFICIE, borderTop: `1px solid ${BORDE}`, borderBottom: `1px solid ${BORDE}`, position: 'relative', fontSize: 16 }}>
					<Rotulo x={CONTROLES.imagen.x}>Imagen (por defecto &apos;fondo-observador.png&apos;)</Rotulo>
					<Control r={CONTROLES.imagen}>
						<span style={{ width: 40, height: 24, borderRadius: 3, background: 'linear-gradient(90deg, #1f6f4a 0 22%, #f4f8f5 22%)', border: `1px solid ${BORDE}` }} />
						fondo-observador.png
					</Control>
					<Rotulo x={CONTROLES.firma.x}>Firma estudiante</Rotulo>
					<Interruptor x={CONTROLES.firma.x} y={CONTROLES.firma.y} />
					<Rotulo x={CONTROLES.compromisos.x}>Incluir compromisos</Rotulo>
					<Interruptor x={CONTROLES.compromisos.x} y={CONTROLES.compromisos.y} />
					<Rotulo x={CONTROLES.superior.x}>Margen superior</Rotulo>
					<Numero r={CONTROLES.superior} valor={sup} flechas={sobreMargen(frame)} />
					<Rotulo x={CONTROLES.izquierdo.x}>Margen izquierdo</Rotulo>
					<Numero r={CONTROLES.izquierdo} valor={MARGEN_IZQUIERDO} />
				</div>

				{frame < carga + 6 && (
					<div style={{ position: 'absolute', top: PAGINA.barra + PAGINA.tira + 30, left: 28, fontSize: 20, color: TEXTO_TENUE, opacity: 1 - hoja }}>
						Trayendo el observador del grupo…
					</div>
				)}
			</div>

			{/* LA HOJA. */}
			<div
				style={{
					position: 'absolute', left: X_HOJA, top: Y_HOJA, width: HOJA.ancho, height: HOJA.alto, background: '#fff',
					boxShadow: '0 6px 24px rgba(0,0,0,.14)', opacity: hoja, transform: `translateY(${interpolate(hoja, [0, 1], [18, 0])}px)`,
					overflow: 'hidden', color: '#1f1f1f',
				}}
			>
				<Membrete />

				<div style={{ position: 'absolute', top: sup, left: MARGEN_IZQUIERDO, width: HOJA.ancho - MARGEN_IZQUIERDO - 40 }}>
					<div style={{ position: 'absolute', top: EN_LA_HOJA.titulo, left: 0, right: 0, textAlign: 'center', fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>OBSERVADOR DEL ESTUDIANTE</div>
					<div style={{ position: 'absolute', top: EN_LA_HOJA.nombre, left: 0, fontSize: 19, fontWeight: 600 }}>{alumno.nombre}</div>
					{DATOS_DE_SARA.map((d, i) => (
						<div key={d} style={{ position: 'absolute', top: EN_LA_HOJA.datos + i * EN_LA_HOJA.renglon, left: 0, fontSize: 15 }}>{d}</div>
					))}
					<div style={{ position: 'absolute', top: EN_LA_HOJA.nombre, right: 0 }}><Avatar tipo={alumno.sexo} variante={0} tam={96} /></div>

					<div style={{ position: 'absolute', top: EN_LA_HOJA.paneles, left: 0, right: 0, display: 'flex', gap: 14 }}>
						<Panel titulo="Seguimiento convivencia" lineas={CONVIVENCIA} alto={EN_LA_HOJA.panelAlto} />
						<Panel titulo="Seguimiento académico" lineas={ACADEMICO} alto={EN_LA_HOJA.panelAlto} />
					</div>
					<div style={{ position: 'absolute', top: EN_LA_HOJA.fallas, left: 0, right: 0 }}>
						<Panel titulo="Fallas y situaciones" lineas={FALLAS} alto={EN_LA_HOJA.fallasAlto} />
					</div>

					<div style={{ position: 'absolute', top: EN_LA_HOJA.firmas, left: 0, right: 0, display: 'flex', gap: 40, fontSize: 14 }}>
						{['TITULAR', 'RECTORÍA'].map((f) => (
							<div key={f} style={{ flex: 1 }}>
								<div style={{ borderBottom: '1px solid #1f1f1f', height: 40 }} />
								<div style={{ marginTop: 6 }}>{f}:</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

/* ── Las piezas ───────────────────────────────────────────────────────────────────────────── */

const Rotulo: React.FC<{ x: number; children: React.ReactNode }> = ({ x, children }) => (
	<div style={{ position: 'absolute', left: x - PAGINA.x, top: 8, fontSize: 15, color: TEXTO_TENUE, whiteSpace: 'nowrap' }}>{children}</div>
);

const Control: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; children: React.ReactNode }> = ({ r, children }) => (
	<div
		style={{
			position: 'absolute', left: r.x - PAGINA.x, top: r.y - PAGINA.y - PAGINA.barra, width: r.ancho, height: r.alto, border: `1px solid ${BORDE}`,
			borderRadius: 7, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', boxSizing: 'border-box', fontSize: 17, background: SUPERFICIE,
		}}
	>
		{children}
	</div>
);

const Numero: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; valor: number; flechas?: boolean }> = ({ r, valor, flechas = false }) => (
	<Control r={r}>
		<span style={{ flex: 1, fontVariantNumeric: 'tabular-nums' }}>{valor}</span>
		{flechas && (
			<span style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: FLECHA_ARRIBA.ancho, borderLeft: `1px solid ${BORDE}`, display: 'flex', flexDirection: 'column' }}>
				<span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BORDE}`, color: ACENTO }}>
					<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 6.5L5 3.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
				</span>
				<span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXTO_TENUE }}>
					<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 3.5L5 6.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
				</span>
			</span>
		)}
	</Control>
);

const Interruptor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
	<span style={{ position: 'absolute', left: x - PAGINA.x, top: y - PAGINA.y - PAGINA.barra + 8, width: 44, height: 22, borderRadius: 11, background: 'rgba(0,0,0,.25)' }}>
		<span style={{ position: 'absolute', left: 2, top: 2, width: 18, height: 18, borderRadius: 9, background: '#fff' }} />
	</span>
);

const Panel: React.FC<{ titulo: string; lineas: string[]; alto: number }> = ({ titulo, lineas, alto }) => (
	<div style={{ flex: 1, height: alto, border: '1px solid #bfbfbf', borderRadius: 4, padding: '8px 10px', boxSizing: 'border-box' }}>
		<div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{titulo}</div>
		{lineas.map((l) => <div key={l} style={{ fontSize: 14, lineHeight: '19px', marginBottom: 3 }}>{l}</div>)}
	</div>
);

/*
 * EL MEMBRETE INVENTADO: una franja verde a la izquierda y el escudo con el nombre arriba. Es la
 * «imagen de fondo» del observador: por eso el contenido empieza a 150 y a 200, para no pisarlo.
 */
const Membrete: React.FC = () => (
	<>
		<div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 150, background: 'linear-gradient(180deg, #1f6f4a, #2e8b5f)' }} />
		<div style={{ position: 'absolute', left: 22, top: 22 }}><Escudo tam={106} /></div>
		<div style={{ position: 'absolute', left: 190, top: 34, right: 40 }}>
			<div style={{ fontSize: 24, fontWeight: 800, color: '#1f6f4a', letterSpacing: 1 }}>{ALMENDROS.nombrePapel}</div>
			<div style={{ fontSize: 14, color: '#4a5a50', marginTop: 4 }}>{ALMENDROS.encabezado}</div>
			<div style={{ height: 3, background: '#c9a227', marginTop: 12, width: 520 }} />
		</div>
	</>
);

const IconoImpresora: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M7 9V4h10v5M5 9h14v7H5zM8 14h8v6H8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
);
