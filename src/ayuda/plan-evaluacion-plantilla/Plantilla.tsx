import React from 'react';

import { ACENTO, AVISO_AMARILLO, BORDE, Boton, Icono, LETRA, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';
import { Caja } from '../el-ano/plan';
import {
	ANCHO_BOTON_CRITERIO, ANCHO_PORCENTAJE, CONTEO, CRITERIOS, DG, DIALOGO, DX, G, TEXTOS,
	disposicion, rectBotonAplicarDialogo, rectCasilla, rectDialogoPregunta, rectLimites, rectParrafo,
	type Criterio, type EstadoPlantilla, type Trozo,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CUERPO DE LA PESTAÑA ② Y EL DIÁLOGO DE APLICAR. No saben de tiempo.
 */

const Trozos: React.FC<{ t: Trozo[] }> = ({ t }) => (
	<>{t.map((x, i) => (typeof x === 'string' ? <span key={i}>{x}</span> : <b key={i}>{x.b}</b>))}</>
);

const Asa: React.FC = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" style={{ flex: 'none' }}>
		{[4, 8, 12].map((y) => [6, 10].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="rgba(0,0,0,0.35)" />))}
	</svg>
);

const IconoCirculo: React.FC<{ cual: 'up' | 'edit' | 'close' }> = ({ cual }) => (
	<div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXTO_TENUE, flex: 'none' }}>
		{cual === 'up' && <Icono cual="flecha" tam={14} giro={180} />}
		{cual === 'edit' && <Icono cual="edit" tam={14} />}
		{cual === 'close' && <Icono cual="aspa" tam={14} />}
	</div>
);

export interface EntradaCriterio { texto: string; porcentaje: string; foco: 'texto' | 'porcentaje' | null; cursor: boolean; encimaBoton: boolean }

export const CuerpoPlantilla: React.FC<{ estado: EstadoPlantilla; suma: number; entrada: EntradaCriterio; encimaAplicar?: boolean; aparece?: number }> = ({
	estado, suma, entrada, encimaAplicar = false, aparece = 1,
}) => {
	const d = disposicion(estado);
	const cuadra = suma === 100;
	return (
		<div style={{ opacity: aparece, color: TEXTO, fontSize: LETRA }}>
			<Caja r={d.intro} estilo={{ lineHeight: '23px' }}>
				<div><Trozos t={TEXTOS.intro1} /></div>
				<div style={{ color: TEXTO_TENUE }}>{TEXTOS.intro2}</div>
			</Caja>

			<Caja r={d.reparto} estilo={{ display: 'flex', alignItems: 'center', gap: 14 }}>
				<span style={{ padding: '3px 12px', borderRadius: 6, border: `1px solid ${cuadra ? '#b7eb8f' : AVISO_AMARILLO.borde}`, background: cuadra ? '#f6ffed' : AVISO_AMARILLO.fondo, display: 'flex', gap: 14 }}>
					<span>{TEXTOS.alcance}</span>
					<span style={{ color: TEXTO_TENUE }}>{estado.tercera > 0.5 ? 3 : 2} filas</span>
					<b style={{ color: cuadra ? '#389e0d' : '#ad6800', fontVariantNumeric: 'tabular-nums' }}>{suma} %</b>
				</span>
			</Caja>

			{estado.aviso > 0.01 && (
				<Caja r={d.aviso} estilo={{ overflow: 'hidden', opacity: estado.aviso }}>
					<div style={{ height: G.aviso, boxSizing: 'border-box', padding: '12px 16px', background: AVISO_AMARILLO.fondo, border: `1px solid ${AVISO_AMARILLO.borde}`, borderRadius: 8, display: 'flex', gap: 12 }}>
						<div style={{ marginTop: 2 }}><Icono cual="alerta" tam={18} color={AVISO_AMARILLO.icono} /></div>
						<div style={{ lineHeight: '22px' }}>
							<div style={{ fontWeight: 500 }}>{TEXTOS.avisoTitulo}</div>
							<div>«{TEXTOS.alcance}» suma 75 %.</div>
							<div style={{ fontSize: LETRA - 1 }}><Trozos t={TEXTOS.avisoPorque} /></div>
						</div>
					</div>
				</Caja>
			)}

			{CRITERIOS.map((c, i) => {
				const r = d.criterios[i];
				if (r.alto < 0.5) { return null; }
				return (
					<Caja key={c.definicion} r={r} estilo={{ overflow: 'hidden', opacity: i === 2 ? estado.tercera : 1 }}>
						<FilaCriterio c={c} i={i} />
					</Caja>
				);
			})}

			<Caja r={d.anadir} estilo={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px dashed ${BORDE}`, paddingLeft: 30, boxSizing: 'border-box' }}>
				<Entrada ancho={d.anadir.ancho - 30 - ANCHO_PORCENTAJE - ANCHO_BOTON_CRITERIO - 20} valor={entrada.texto} marcador={TEXTOS.marcadorCriterio} foco={entrada.foco === 'texto'} cursor={entrada.cursor && entrada.foco === 'texto'} />
				<Entrada ancho={ANCHO_PORCENTAJE} valor={entrada.porcentaje} marcador="%" foco={entrada.foco === 'porcentaje'} cursor={entrada.cursor && entrada.foco === 'porcentaje'} derecha />
				<Boton texto={TEXTOS.anadirCriterio} icono="plus" ancho={ANCHO_BOTON_CRITERIO} encima={entrada.encimaBoton} />
			</Caja>

			<Caja r={d.herencia} estilo={{ display: 'flex', alignItems: 'center', gap: 8, color: TEXTO_TENUE }}>
				<Icono cual="flecha" tam={12} giro={-90} /> {TEXTOS.herencia}
			</Caja>

			<Caja r={d.aplicar} estilo={{ display: 'flex', alignItems: 'center', gap: 14 }}>
				<Boton texto={TEXTOS.aplicar} tipo="primary" deshabilitado={!cuadra} encima={encimaAplicar} ancho={300} />
				{!cuadra && <span style={{ color: TEXTO_TENUE, fontSize: LETRA - 1, lineHeight: '19px', maxWidth: 720 }}>{TEXTOS.porqueApagado}</span>}
			</Caja>
		</div>
	);
};

const FilaCriterio: React.FC<{ c: Criterio; i: number }> = ({ c, i }) => (
	<div>
		<div style={{ height: G.criterio, display: 'flex', alignItems: 'center', gap: 10, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6, padding: '0 8px' }}>
			<Asa />
			<span style={{ flex: 1, fontWeight: 600 }}>{i + 1}. {c.definicion}</span>
			<span style={{ width: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{c.porcentaje} %</span>
			<span style={{ fontSize: 13, padding: '1px 9px', borderRadius: 11, border: `1px solid ${BORDE}`, color: TEXTO_TENUE, background: SUPERFICIE }}>{TEXTOS.alcance}</span>
			<IconoCirculo cual="up" />
			<IconoCirculo cual="edit" />
			<IconoCirculo cual="close" />
		</div>
		{c.columnas.map((s, j) => (
			<div key={s.definicion} style={{ height: G.columna, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 36, paddingRight: 8, borderBottom: '1px solid #f5f5f5' }}>
				<Asa />
				<span style={{ flex: 1 }}>{j + 1}. {s.definicion}</span>
				<span style={{ width: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.porcentaje} %</span>
				<div style={{ width: 150 }} />
				<IconoCirculo cual="edit" />
				<IconoCirculo cual="close" />
			</div>
		))}
		<div style={{ height: G.anadirColumna, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 36 }}>
			<Entrada ancho={560} valor="" marcador={TEXTOS.marcadorColumna} pequeno />
			<Entrada ancho={64} valor="" marcador="%" pequeno derecha />
			<Boton texto={TEXTOS.anadirColumna} icono="plus" pequeno />
		</div>
	</div>
);

const Entrada: React.FC<{ ancho: number; valor: string; marcador: string; foco?: boolean; cursor?: boolean; pequeno?: boolean; derecha?: boolean }> = ({
	ancho, valor, marcador, foco = false, cursor = false, pequeno = false, derecha = false,
}) => (
	<div
		style={{
			width: ancho,
			height: pequeno ? 28 : 32,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? ACENTO : BORDE}`,
			boxShadow: foco ? `0 0 0 2px ${ACENTO}22` : undefined,
			borderRadius: 6,
			background: SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: derecha ? 'flex-end' : 'flex-start',
			padding: '0 10px',
			fontSize: pequeno ? LETRA - 1 : LETRA,
			color: valor ? TEXTO : 'rgba(0,0,0,0.3)',
			whiteSpace: 'pre',
			overflow: 'hidden',
			flex: 'none',
		}}
	>
		{valor || (cursor ? '' : marcador)}
		<span style={{ opacity: cursor ? 1 : 0, color: TEXTO }}>|</span>
	</div>
);

/* ── El diálogo ───────────────────────────────────────────────────────────────────────────── */

export const DialogoSembrar: React.FC<{
	aparece: number;
	/** 'preguntar' o 'hecho', y cuánto ha entrado el segundo (el cuerpo se cruza en el sitio). */
	hecho: number;
	encimaAplicar?: boolean;
	cargando?: boolean;
	encimaCerrar?: boolean;
	frame: number;
}> = ({ aparece, hecho, encimaAplicar = false, cargando = false, encimaCerrar = false, frame }) => {
	if (aparece <= 0.001) { return null; }
	const caja = rectDialogoPregunta();
	const altoHecho = DG.relleno * 2 + DG.titulo + 5 * 34 + 34 + 16 + 32;
	const alto = caja.alto + (altoHecho - caja.alto) * hecho;
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 9 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: aparece, borderRadius: 12 }} />
			<div
				style={{
					position: 'absolute',
					left: DX,
					top: DIALOGO.y,
					width: DIALOGO.ancho,
					height: alto,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					borderRadius: 8,
					boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
					opacity: aparece,
					transform: `scale(${0.94 + aparece * 0.06})`,
					transformOrigin: '50% 30%',
					overflow: 'hidden',
					color: TEXTO,
					fontSize: LETRA,
				}}
			>
				{hecho < 1 && (
					<div style={{ opacity: 1 - hecho }}>
						<Pos x={DX + DG.relleno} y={DIALOGO.y + DG.relleno} estilo={{ fontSize: 17, fontWeight: 600 }}>{TEXTOS.dialogoTitulo}</Pos>
						<PosR r={rectParrafo()} estilo={{ lineHeight: '23px' }}>
							Se va a escribir esta plantilla —<b>3</b> filas— en las asignaturas de este año que todavía no tienen nada.
						</PosR>
						<PosR r={rectCasilla()} estilo={{ display: 'flex', gap: 10, lineHeight: '22px' }}>
							<div style={{ width: 16, height: 16, marginTop: 3, border: `1px solid ${BORDE}`, borderRadius: 4, flex: 'none', background: SUPERFICIE }} />
							<div>
								<div><Trozos t={TEXTOS.casilla} /></div>
								<div style={{ color: TEXTO_TENUE, fontSize: LETRA - 1, marginTop: 4, lineHeight: '20px' }}><Trozos t={TEXTOS.casillaApunte} /></div>
							</div>
						</PosR>
						<PosR r={rectLimites()} estilo={{ color: TEXTO_TENUE, fontSize: LETRA - 1, lineHeight: '20px' }}>
							<Trozos t={TEXTOS.limites} />
						</PosR>
						<PosR r={{ ...rectBotonAplicarDialogo(), x: rectBotonAplicarDialogo().x - 110, ancho: 190 }} estilo={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
							<Boton texto="Cancelar" ancho={100} />
							<Boton texto="Aplicar" tipo="primary" ancho={80} encima={encimaAplicar} cargando={cargando} giroCarga={(frame * 24) % 360} />
						</PosR>
					</div>
				)}
				{hecho > 0 && (
					<div style={{ opacity: hecho }}>
						<Pos x={DX + DG.relleno} y={DIALOGO.y + DG.relleno} estilo={{ fontSize: 17, fontWeight: 600 }}>{TEXTOS.aplicada}</Pos>
						<Pos x={DX + DG.relleno} y={DIALOGO.y + DG.relleno + DG.titulo} estilo={{ width: DIALOGO.ancho - DG.relleno * 2, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24 }}>
							{CONTEO.map(([que, n, fuerte]) => (
								<div key={que} style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', fontWeight: fuerte ? 600 : 400 }}>
									<span style={{ color: fuerte ? TEXTO : TEXTO_TENUE }}>{que}</span>
									<span style={{ fontVariantNumeric: 'tabular-nums' }}>{n.toLocaleString('es-CO')}</span>
								</div>
							))}
						</Pos>
						<Pos x={DX + DG.relleno} y={DIALOGO.y + DG.relleno + DG.titulo + 5 * 34 + 8} estilo={{ color: TEXTO_TENUE, fontSize: LETRA - 1 }}>{TEXTOS.apunte}</Pos>
						<Pos x={DX + DIALOGO.ancho - DG.relleno - 80} y={DIALOGO.y + DG.relleno + DG.titulo + 5 * 34 + 34 + 16}>
							<Boton texto="Cerrar" tipo="primary" ancho={80} encima={encimaCerrar} />
						</Pos>
					</div>
				)}
			</div>
		</div>
	);
};

/* Posición absoluta en coordenadas de la cáscara, dentro de la caja del diálogo. */
const Pos: React.FC<{ x: number; y: number; estilo?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, estilo, children }) => (
	<div style={{ position: 'absolute', left: x - DX, top: y - DIALOGO.y, ...estilo }}>{children}</div>
);
const PosR: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; estilo?: React.CSSProperties; children?: React.ReactNode }> = ({ r, estilo, children }) => (
	<div style={{ position: 'absolute', left: r.x - DX, top: r.y - DIALOGO.y, width: r.ancho, height: r.alto, ...estilo }}>{children}</div>
);
