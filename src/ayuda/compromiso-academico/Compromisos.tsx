import React from 'react';

import { ACENTO, BORDE, INFO, Icono, LETRA, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';
import { Bloque, CG, Pista, SinGuardar } from '../el-ano/colegio';
import { Interruptor } from '../el-ano/piezas';
import { CORTE_DE_FABRICA, K, PLAZO, TEXTOS, disposicion, type Trozo } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CUERPO DE LA PESTAÑA «COMPROMISOS». No sabe de tiempo.
 */

const Trozos: React.FC<{ t: Trozo[] }> = ({ t }) => (
	<>{t.map((x, i) => (typeof x === 'string' ? <span key={i}>{x}</span> : <b key={i}>{x.b}</b>))}</>
);

const Numero: React.FC<{ valor: string; foco?: boolean; seleccionado?: boolean; cursor?: boolean; sucio?: boolean }> = ({ valor, foco = false, seleccionado = false, cursor = false, sucio = false }) => (
	<div
		style={{
			width: 90,
			height: K.control,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? ACENTO : sucio ? '#91caff' : BORDE}`,
			boxShadow: foco ? `0 0 0 2px ${ACENTO}22` : undefined,
			background: sucio ? '#f0f7ff' : SUPERFICIE,
			borderRadius: 6,
			display: 'flex',
			alignItems: 'center',
			padding: '0 11px',
			fontSize: LETRA,
			fontVariantNumeric: 'tabular-nums',
		}}
	>
		<span style={{ background: seleccionado ? '#bae0ff' : 'transparent' }}>{valor}</span>
		{cursor && <span>|</span>}
	</div>
);

export const CuerpoCompromisos: React.FC<{
	aviso: number;
	corte: string;
	corteFoco: boolean;
	corteSeleccionado: boolean;
	corteSucio: boolean;
	cursor: boolean;
	aparece?: number;
}> = ({ aviso, corte, corteFoco, corteSeleccionado, corteSucio, cursor, aparece = 1 }) => {
	const d = disposicion(aviso);
	return (
		<div style={{ opacity: aparece, color: TEXTO, fontSize: LETRA }}>
			{aviso > 0.01 && (
				<div
					style={{
						position: 'absolute',
						left: d.alerta.x,
						top: d.alerta.y,
						width: d.alerta.ancho,
						height: d.alerta.alto,
						overflow: 'hidden',
						opacity: Math.min(1, aviso * 1.3),
					}}
				>
					<div style={{ height: K.aviso, boxSizing: 'border-box', padding: '12px 18px', background: INFO.fondo, border: `1px solid ${INFO.borde}`, borderRadius: 8, display: 'flex', gap: 12 }}>
						<div style={{ marginTop: 2 }}><Icono cual="info" tam={20} color={INFO.icono} /></div>
						<div style={{ lineHeight: '21px' }}>
							<div style={{ fontSize: LETRA + 1, fontWeight: 500 }}>{TEXTOS.avisoTitulo}</div>
							<div style={{ marginTop: 3 }}>{TEXTOS.avisoTexto}</div>
						</div>
					</div>
				</div>
			)}

			<Bloque r={d.quien} titulo={TEXTOS.quien}>
				<Pista estilo={{ height: K.pista2, marginTop: -6 }}><Trozos t={TEXTOS.quienPista} /></Pista>
				<div style={{ height: K.regla }}>
					<div style={{ height: 22 }}>{TEXTOS.regla}</div>
					<div style={{ display: 'inline-flex', padding: 2, background: 'rgba(0,0,0,0.05)', borderRadius: 6, height: 32, boxSizing: 'border-box' }}>
						<div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', background: SUPERFICIE, borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>Por áreas</div>
						<div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', color: TEXTO_TENUE }}>Por asignaturas</div>
					</div>
					<Pista estilo={{ marginTop: 4 }}>{TEXTOS.reglaAyuda}</Pista>
				</div>
				<div style={{ height: K.corte }}>
					<div style={{ height: K.etiqueta, display: 'flex', alignItems: 'flex-start' }}>{TEXTOS.corte}{corteSucio && <SinGuardar />}</div>
					<Numero valor={corte} foco={corteFoco} seleccionado={corteSeleccionado} cursor={corteFoco && cursor && !corteSeleccionado} sucio={corteSucio} />
					<Pista tam={LETRA - 1.5} estilo={{ marginTop: 3 }}>{TEXTOS.corteExtra}</Pista>
				</div>
				<div style={{ height: K.primaria }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 26 }}>
						<Interruptor encendido={0} />
						<span style={{ fontWeight: 500 }}>{TEXTOS.primaria}</span>
					</div>
					<Pista tam={LETRA - 1.5} estilo={{ marginLeft: 54 }}>{TEXTOS.primariaAyuda}</Pista>
				</div>
			</Bloque>

			<Bloque r={d.plazo} titulo={TEXTOS.plazo}>
				<Pista estilo={{ height: 44, marginTop: -6 }}>{TEXTOS.plazoPista}</Pista>
				{PLAZO.map((c) => (
					<div key={c.etiqueta} style={{ height: K.etiqueta + K.control + K.extra, marginBottom: K.entre }}>
						<div style={{ height: K.etiqueta }}>{c.etiqueta}</div>
						<div style={{ width: c.ancho || '100%', height: K.control, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px' }}>{c.valor}</div>
						<Pista tam={LETRA - 1.5} estilo={{ marginTop: 3 }}>{c.extra}</Pista>
					</div>
				))}
			</Bloque>

			<Bloque r={d.papel} titulo={TEXTOS.papel}>
				<div style={{ display: 'flex', gap: CG.hueco }}>
					{[['Título', 'COMPROMISO ACADÉMICO'], ['Subtítulo', 'Plan de apoyo y seguimiento']].map(([e, m]) => (
						<div key={e} style={{ flex: 1 }}>
							<div style={{ height: K.etiqueta }}>{e}</div>
							<div style={{ height: K.control, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px', color: 'rgba(0,0,0,0.3)' }}>{m}</div>
						</div>
					))}
				</div>
			</Bloque>
		</div>
	);
};
