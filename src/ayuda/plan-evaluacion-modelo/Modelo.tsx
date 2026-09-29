import React from 'react';

import { ACENTO, LETRA, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';
import { Caja } from '../el-ano/plan';
import { Radio } from '../el-ano/piezas';
import { CONSECUENCIAS, MD, TARJETAS, YEAR, rectConsecuencia, rectTarjeta, rectTitulo } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CUERPO DE LA PESTAÑA ① MODELO: el título, las dos tarjetas y los dos párrafos. No sabe de
 * tiempo. `elegida` es la tarjeta marcada; `encima`, la que tiene el ratón (borde azul claro);
 * `guardando` apaga el `fieldset` mientras va el PUT.
 */

export const CuerpoModelo: React.FC<{ elegida: number; encima?: number | null; guardando?: boolean; aparece?: number }> = ({
	elegida, encima = null, guardando = false, aparece = 1,
}) => (
	<div style={{ opacity: aparece }}>
		<Caja r={rectTitulo()} estilo={{ fontSize: 18, fontWeight: 600, color: TEXTO, display: 'flex', alignItems: 'center' }}>
			Modelo de evaluación de {YEAR}
		</Caja>

		{TARJETAS.map((t, i) => {
			const es = i === elegida;
			return (
				<Caja
					key={t.etiqueta}
					r={rectTarjeta(i)}
					estilo={{
						boxSizing: 'border-box',
						padding: `${MD.relleno}px ${MD.relleno}px`,
						border: `2px solid ${es ? ACENTO : encima === i ? '#91caff' : '#d9d9d9'}`,
						boxShadow: es ? `0 0 0 1px ${ACENTO}` : undefined,
						background: es ? '#f0f7ff' : '#fff',
						borderRadius: 8,
						opacity: guardando ? 0.6 : 1,
						color: TEXTO,
						fontSize: LETRA,
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 24 }}>
						<Radio marcado={es} />
						<span style={{ fontSize: 16.5, fontWeight: 700 }}>{t.etiqueta}</span>
					</div>
					<div style={{ marginTop: 10, height: 22, color: TEXTO_TENUE }}>{t.subtitulo}</div>
					<div style={{ marginTop: 10, background: 'rgba(0,0,0,0.025)', border: '1px solid #f0f0f0', borderRadius: 6, padding: '8px 12px' }}>
						<Rotulo>En la planilla</Rotulo>
						<Linea texto="Cognitivo" porcentaje="70 %" peso="" fuerte />
						{t.columnas.map((c) => <Linea key={c.texto} texto={c.texto} porcentaje={c.porcentaje} peso={c.peso} />)}
						<Rotulo arriba={10}>En el boletín</Rotulo>
						<div style={{ fontSize: LETRA - 1, lineHeight: 1.45, color: TEXTO }}>{t.boletin}</div>
					</div>
				</Caja>
			);
		})}

		<Caja r={rectConsecuencia(1)} estilo={{ fontSize: LETRA, lineHeight: '23px', color: TEXTO }}>
			<b>{CONSECUENCIAS.uno.b}</b>{CONSECUENCIAS.uno.resto}
		</Caja>
		<Caja r={rectConsecuencia(2)} estilo={{ fontSize: LETRA, lineHeight: '23px', color: TEXTO }}>
			<b>{CONSECUENCIAS.dos.b}</b>{CONSECUENCIAS.dos.resto}
		</Caja>
	</div>
);

const Rotulo: React.FC<{ children: React.ReactNode; arriba?: number }> = ({ children, arriba = 0 }) => (
	<div style={{ marginTop: arriba, fontSize: 12.5, fontWeight: 600, color: TEXTO_TENUE, letterSpacing: 0.3, height: 20 }}>{children}</div>
);

const Linea: React.FC<{ texto: string; porcentaje: string; peso: string; fuerte?: boolean }> = ({ texto, porcentaje, peso, fuerte = false }) => (
	<div style={{ display: 'flex', alignItems: 'center', height: 28, borderBottom: '1px solid #f0f0f0', fontSize: LETRA - 1, fontWeight: fuerte ? 600 : 400, paddingLeft: fuerte ? 0 : 16 }}>
		<span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{texto}</span>
		<span style={{ width: 60, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{porcentaje}</span>
		<span style={{ width: 50, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: TEXTO_TENUE }}>{peso}</span>
	</div>
);
