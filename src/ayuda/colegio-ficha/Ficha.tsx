import React from 'react';

import { ACENTO, BORDE, Icono, LETRA, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';
import { Avatar } from '../../comunes/Avatar';
import { nombreDe } from '../colegio';
import { Bloque, CG, Pista, SinGuardar } from '../el-ano/colegio';
import type { Rect } from '../el-ano/Aplicacion';
import {
	CARGOS, CONTACTO, F, IDENTIFICACION, INTRO, MENSAJE, P_CARGOS, P_CONTACTO, P_IDENT, P_MENSAJE, P_VOCABULARIO, TEXTOS, VOCABULARIO,
	rectCampo, rectCampoVocabulario, type Campo, type Trozo,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CUERPO DE «FICHA DEL COLEGIO». No sabe de tiempo: el teléfono que haya, si está tocado, si
 * tiene el foco, y qué campo del vocabulario se señala.
 */

const Trozos: React.FC<{ t: Trozo[] }> = ({ t }) => (
	<>{t.map((x, i) => (typeof x === 'string' ? <span key={i}>{x}</span> : <b key={i}>{x.b}</b>))}</>
);

/** Un campo puesto con coordenadas del contenido, relativo a su panel. */
const CampoEn: React.FC<{ panel: Rect; r: Rect; campo: Campo; sucio?: boolean; foco?: boolean; cursor?: boolean; valor?: string; seleccionado?: boolean; resaltado?: boolean }> = ({
	panel, r, campo, sucio = false, foco = false, cursor = false, valor, seleccionado = false, resaltado = false,
}) => (
	<div style={{ position: 'absolute', left: r.x - panel.x, top: r.y - panel.y, width: r.ancho }}>
		<div style={{ height: F.etiqueta, display: 'flex', alignItems: 'flex-start', fontSize: LETRA, color: TEXTO }}>
			{campo.etiqueta}
			{sucio && <SinGuardar />}
		</div>
		<div
			style={{
				height: F.control,
				boxSizing: 'border-box',
				border: `1px solid ${foco || resaltado ? ACENTO : sucio ? '#91caff' : BORDE}`,
				boxShadow: foco ? `0 0 0 2px ${ACENTO}22` : undefined,
				background: sucio ? '#f0f7ff' : SUPERFICIE,
				borderRadius: 6,
				display: 'flex',
				alignItems: 'center',
				padding: '0 11px',
				fontSize: LETRA,
				color: TEXTO,
				whiteSpace: 'pre',
				overflow: 'hidden',
			}}
		>
			<span style={{ background: seleccionado ? '#bae0ff' : 'transparent' }}>{valor ?? campo.valor}</span>
			{cursor && <span>|</span>}
		</div>
		{campo.extra && <div style={{ height: F.extra, fontSize: LETRA - 1.5, color: TEXTO_TENUE, paddingTop: 3 }}>{campo.extra}</div>}
	</div>
);

export const CuerpoFicha: React.FC<{
	telefono: string;
	telefonoSucio: boolean;
	telefonoFoco: boolean;
	telefonoSeleccionado: boolean;
	cursor: boolean;
	aparece?: number;
}> = ({ telefono, telefonoSucio, telefonoFoco, telefonoSeleccionado, cursor, aparece = 1 }) => (
	<div style={{ opacity: aparece }}>
		<Bloque r={INTRO}>
			<Pista tam={LETRA} estilo={{ color: TEXTO }}><Trozos t={TEXTOS.intro} /></Pista>
		</Bloque>

		<Bloque r={P_IDENT} titulo={TEXTOS.identificacion}>
			<Pista estilo={{ marginTop: -6 }}>{TEXTOS.identificacionSub}</Pista>
			{IDENTIFICACION.map((c, i) => <CampoEn key={c.etiqueta} panel={P_IDENT} r={rectCampo(P_IDENT, i, true)} campo={c} />)}
		</Bloque>

		<Bloque r={P_CONTACTO} titulo={TEXTOS.contacto}>
			{CONTACTO.map((c, i) => (
				<CampoEn
					key={c.etiqueta}
					panel={P_CONTACTO}
					r={rectCampo(P_CONTACTO, i, false)}
					campo={c}
					valor={i === 0 ? telefono : undefined}
					sucio={i === 0 && telefonoSucio}
					foco={i === 0 && telefonoFoco}
					cursor={i === 0 && telefonoFoco && cursor && !telefonoSeleccionado}
					seleccionado={i === 0 && telefonoSeleccionado}
				/>
			))}
		</Bloque>

		<Bloque r={P_CARGOS} titulo={TEXTOS.cargos}>
			<Pista estilo={{ marginTop: -6 }}>{TEXTOS.cargosSub}</Pista>
			{CARGOS.map((c, i) => {
				const r = rectCampo(P_CARGOS, i, true, true);
				const d = c.persona ? { nombre: nombreDe(c.persona), cara: c.persona.cara } : null;
				return (
					<div key={c.etiqueta} style={{ position: 'absolute', left: r.x - P_CARGOS.x, top: r.y - P_CARGOS.y, width: r.ancho }}>
						<div style={{ height: F.etiqueta, fontSize: LETRA }}>{c.etiqueta}</div>
						<div style={{ height: F.control, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, padding: '0 11px', fontSize: LETRA }}>
							{d ? <Avatar tipo={d.cara.tipo} variante={d.cara.variante} tam={20} /> : null}
							<span style={{ flex: 1, color: d ? TEXTO : 'rgba(0,0,0,0.3)' }}>{d ? d.nombre : '(sin asignar)'}</span>
							<Icono cual="flecha" tam={13} color="rgba(0,0,0,0.3)" />
						</div>
						<div style={{ height: F.extra, fontSize: LETRA - 1.5, color: TEXTO_TENUE, paddingTop: 3 }}>{d ? d.nombre : '(sin asignar)'}</div>
					</div>
				);
			})}
		</Bloque>

		<Bloque r={P_MENSAJE} titulo={TEXTOS.mensaje}>
			<Pista estilo={{ marginTop: -6 }}>{TEXTOS.mensajeSub}</Pista>
			<CampoEn panel={P_MENSAJE} r={{ ...rectCampo(P_MENSAJE, 0, true), y: rectCampo(P_MENSAJE, 0, true).y + 20 }} campo={{ etiqueta: 'Mensaje', valor: MENSAJE }} />
		</Bloque>

		<Bloque r={P_VOCABULARIO} titulo={TEXTOS.vocabulario}>
			<Pista estilo={{ marginTop: -6, maxWidth: 1060 }}>{TEXTOS.vocabularioSub}</Pista>
			{VOCABULARIO.map((c, i) => <CampoEn key={c.etiqueta} panel={P_VOCABULARIO} r={rectCampoVocabulario(i)} campo={c} />)}
			<div
				style={{
					position: 'absolute',
					left: CG.relleno,
					right: CG.relleno,
					top: rectCampoVocabulario(2).y - P_VOCABULARIO.y + rectCampoVocabulario(2).alto + 20,
					height: 150,
					boxSizing: 'border-box',
					border: '1px dashed #d9d9d9',
					borderRadius: 8,
					padding: '12px 16px',
					background: '#fafafa',
				}}
			>
				<div style={{ fontWeight: 600, fontSize: LETRA }}>{TEXTOS.muestra}</div>
				<div style={{ fontSize: LETRA - 1.5, color: TEXTO_TENUE, marginTop: 4 }}>{TEXTOS.muestraSub}</div>
				<div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
					{['Logros', 'Indicadores'].map((w) => (
						<div key={w} style={{ padding: '10px 14px', background: SUPERFICIE, border: `1px solid ${BORDE}`, borderRadius: 6, fontSize: LETRA - 1, color: TEXTO_TENUE }}>
							<b style={{ color: TEXTO }}>{w}</b>
						</div>
					))}
				</div>
			</div>
		</Bloque>
	</div>
);
