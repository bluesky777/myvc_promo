import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Icono } from '../montar-el-ano/ant';
import { Alerta, Btn } from '../rubricas-montar/Rubricas';
import { FUENTE } from '../tema';
import { ALTO_PANEL, ALUMNA, EVIDENCIAS, LOGRO, PG, TEXTOS, UTIL, X, plano, rectCopiar, rectInterruptor, rectNota } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS DOS PIEZAS: el aviso de la planilla (el `nz-alert` de `avisoDeIndependientes`, con su botón
 * «Ver quiénes son y cómo van» y el enlace) y la pantalla del boletín independiente
 * (`paginas/boletin-independiente`): una tarjeta por estudiante, con el interruptor, la suma, el
 * resumen, «Copiar de…» y sus unidades con una casilla de nota por subunidad.
 */

export const AvisoIndependientes: React.FC<{ alto: number; enlaceEncima: boolean }> = ({ alto, enlaceEncima }) => (
	<div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: alto, boxSizing: 'border-box', display: 'flex', gap: 14, padding: '14px 20px', borderRadius: 8, border: '1px solid #91caff', background: '#e6f4ff', fontFamily: FUENTE, color: TEXTO }}>
		<svg width="24" height="24" viewBox="0 0 22 22" style={{ flexShrink: 0, marginTop: 2 }}>
			<circle cx="11" cy="11" r="10" fill={ACENTO} />
			<rect x="9.9" y="9.2" width="2.2" height="7" rx="1.1" fill="#fff" />
			<circle cx="11" cy="6.4" r="1.3" fill="#fff" />
		</svg>
		<div>
			<div style={{ fontSize: 22 }}>{TEXTOS.avisoPlanilla}</div>
			<div style={{ marginTop: 10, display: 'flex', gap: 34, fontSize: 21, color: ACENTO }}>
				<span>{TEXTOS.verQuienes}</span>
				<span style={{ textDecoration: enlaceEncima ? 'underline' : 'none' }}>{TEXTOS.enlace}</span>
			</div>
		</div>
	</div>
);

export interface EstadoBoletin {
	nota: string;
	notaFoco: boolean;
	/** La nota ya volvió del servidor: el resumen la cuenta. */
	guardada: boolean;
	/** El interruptor esperando la respuesta, y el 403 ya contestado. */
	cargando: boolean;
	noPuedo: boolean;
	copiarEncima: boolean;
}

const F = PG.letra;

export const PantallaBoletin: React.FC<{ e: EstadoBoletin }> = ({ e }) => {
	const p = plano(e.noPuedo);
	const ri = rectInterruptor(e.noPuedo);
	const rc = rectCopiar(e.noPuedo);
	return (
		<div style={{ position: 'relative', width: PG.ancho, height: ALTO_PANEL, borderRadius: 14, background: SUPERFICIE, boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)', fontFamily: FUENTE, color: TEXTO }}>
			<div style={{ position: 'absolute', left: PG.relleno, top: p.titulo, fontSize: 32, fontWeight: 700 }}>{TEXTOS.titulo}</div>
			<div style={{ position: 'absolute', left: PG.relleno, top: p.deQuien, fontSize: F - 1, color: TEXTO_TENUE }}>{TEXTOS.deQuien}</div>
			<div style={{ position: 'absolute', left: PG.relleno, top: p.queEs, fontSize: F }}>
				Estos estudiantes <strong>no salen en tu planilla</strong> del periodo 2:
			</div>

			{e.noPuedo && (
				<Alerta top={p.alerta} tipo="info" mensaje={TEXTOS.noPuedo} alto={PG.alerta} ancho={UTIL}>
					{TEXTOS.noPuedoDetalle}
				</Alerta>
			)}

			<div style={{ position: 'absolute', left: PG.relleno, top: p.tarjeta, width: UTIL, height: p.finTarjeta - p.tarjeta, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 10 }} />

			{/* La cabecera de la tarjeta: la cara, el nombre, el interruptor, la suma y el resumen. */}
			<div style={{ position: 'absolute', left: X.foto, top: p.cabecera + (PG.cabecera - 44) / 2 }}>
				<Avatar tipo={ALUMNA.sexo} variante={11} tam={44} />
			</div>
			<div style={{ position: 'absolute', left: X.nombre, top: p.cabecera, height: PG.cabecera, display: 'flex', alignItems: 'center', fontSize: F, fontWeight: 600 }}>{ALUMNA.nombre}</div>
			<Interruptor x={ri.x} y={ri.y} cargando={e.cargando} apagado={e.noPuedo} />
			<div style={{ position: 'absolute', left: X.suma, top: p.cabecera, height: PG.cabecera, display: 'flex', alignItems: 'center', gap: 18, fontSize: F - 2 }}>
				<span style={{ fontWeight: 600 }}>Suma 100 %</span>
				<span style={{ color: TEXTO_TENUE }}>{TEXTOS.resumen(e.guardada ? 2 : 1)}</span>
			</div>
			<div style={{ position: 'absolute', left: rc.x, top: rc.y }}>
				<Btn texto={TEXTOS.copiarDe} ancho={rc.ancho} encima={e.copiarEncima} />
			</div>

			{/* La unidad y sus subunidades, cada una con su casilla de nota. */}
			<div style={{ position: 'absolute', left: PG.relleno + 20, right: PG.relleno + 20, top: p.unidad, height: PG.unidad, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid #f0f0f0`, fontSize: F }}>
				<strong>{LOGRO}</strong>
				<span style={{ color: TEXTO_TENUE }}>100 %</span>
			</div>
			{EVIDENCIAS.map((ev, i) => {
				const r = rectNota(i, e.noPuedo);
				const valor = i === 1 ? e.nota : ev.nota;
				const foco = i === 1 && e.notaFoco;
				return (
					<React.Fragment key={ev.definicion}>
						<div style={{ position: 'absolute', left: PG.relleno + 50, top: p.evidencias + i * PG.evidencia, height: PG.evidencia, display: 'flex', alignItems: 'center', fontSize: F - 1 }}>{ev.definicion}</div>
						<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, boxSizing: 'border-box', border: `1px solid ${foco ? ACENTO : BORDE}`, boxShadow: foco ? `0 0 0 3px ${ACENTO}22` : 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: F, fontVariantNumeric: 'tabular-nums' }}>
							{valor}
							{foco && <span>|</span>}
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

/* El `nz-switch` pequeño con sus dos rótulos: «Aparte» encendido, «Con el grupo» apagado. */
const Interruptor: React.FC<{ x: number; y: number; cargando: boolean; apagado: boolean }> = ({ x, y, cargando, apagado }) => (
	<div style={{ position: 'absolute', left: x, top: y, width: 96, height: 30, borderRadius: 15, background: ACENTO, opacity: apagado ? 0.45 : 1, display: 'flex', alignItems: 'center', padding: '0 10px', boxSizing: 'border-box', color: '#fff', fontSize: 16 }}>
		{TEXTOS.aparte}
		<span style={{ position: 'absolute', right: 3, top: 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			{cargando && <Icono cual="cargando" tam={16} color={ACENTO} />}
		</span>
	</div>
);
