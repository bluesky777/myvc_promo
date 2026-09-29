import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { MEDIDAS } from '../medidas';
import { Icono, NombreIcono } from '../montar-el-ano/ant';
import { Btn, Marca } from '../rubricas-montar/Rubricas';
import { FUENTE } from '../tema';
import {
	ALTO_OPCION, ANCHO_TARJETA, BOTONES_UNIDADES, DOCENTE, INDICADORES, LOGRO, OPCIONES, ORIGEN, PG, TEXTOS, UN, UTIL, Y,
	rectBotonCopiar, rectControl, rectEtiquetaNotas, rectLista, rectOpcion, xTarjeta,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS DOS PANTALLAS DEL VÍDEO. La de Unidades se pinta sólo hasta donde el vídeo la usa --la
 * cabecera con sus tres botones y el logro con sus indicadores--; la de copiar, entera: las dos
 * tarjetas (origen y destino) y la de los mandos (`copiar-unidades.html`).
 */

/* ── Unidades, dentro de la cáscara ───────────────────────────────────────────────────────── */

export const UnidadesEnCascara: React.FC<{ copiarEncima: boolean }> = ({ copiarEncima }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, 6, 12);
	return (
		<div style={{ position: 'relative', width: MEDIDAS.ancho - MEDIDAS.menu, height: '100%', padding: `${UN.arriba}px ${UN.lados}px`, boxSizing: 'border-box', color: TEXTO, fontFamily: FUENTE, opacity: a }}>
			<div style={{ height: UN.cabecera, display: 'flex', alignItems: 'center', gap: 12 }}>
				<span style={{ width: 40, height: 40, borderRadius: 8, background: '#1677ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>9B</span>
				<span style={{ fontSize: 22, fontWeight: 700 }}>Matemáticas</span>
				<span style={{ fontSize: 18, color: TEXTO_TENUE }}>— Noveno B — {DOCENTE}</span>
			</div>
			<div style={{ position: 'absolute', left: UN.lados, top: UN.arriba + UN.acciones.y, display: 'flex', gap: 10 }}>
				{BOTONES_UNIDADES.map((b, i) => {
					const encima = i === 2 && copiarEncima;
					const icono: NombreIcono = i === 2 ? 'copy' : 'edit';
					return (
						<div key={b.texto} style={{ width: b.ancho, height: UN.acciones.alto, boxSizing: 'border-box', borderRadius: 6, border: `1px solid ${encima ? ACENTO : BORDE}`, color: encima ? ACENTO : TEXTO, background: SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 15 }}>
							{i === 2 && <Icono cual={icono} tam={15} />}
							{b.texto}
						</div>
					);
				})}
			</div>
			<div style={{ position: 'absolute', left: UN.lados, right: UN.lados, top: UN.arriba + UN.tarjeta.y, border: `1px solid #f0f0f0`, borderRadius: 8, background: SUPERFICIE, padding: '14px 18px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600 }}>
					<span>1. {LOGRO}</span>
					<span style={{ color: TEXTO_TENUE, fontWeight: 400 }}>100%</span>
				</div>
				{INDICADORES.map((s, i) => (
					<div key={s} style={{ marginTop: 10, paddingLeft: 22, fontSize: 16, color: TEXTO }}>{i + 1}. {s}</div>
				))}
			</div>
		</div>
	);
};

/* ── Copiar, a pantalla completa ──────────────────────────────────────────────────────────── */

export type Campo = 'docente' | 'anio' | 'periodo' | 'asignatura';
export const CAMPOS: Campo[] = ['docente', 'anio', 'periodo', 'asignatura'];

export interface EstadoCopiar {
	destino: Partial<Record<Campo, string>>;
	abierto: { campo: Campo; resaltada: number | null } | null;
	copiado: boolean;
	botonEncima: boolean;
}

const F = PG.letra;

export const PantallaCopiar: React.FC<{ e: EstadoCopiar }> = ({ e }) => {
	const completo = CAMPOS.every((c) => e.destino[c]);
	const origen: Record<Campo, string> = { docente: DOCENTE, anio: ORIGEN.anio, periodo: ORIGEN.periodo, asignatura: ORIGEN.asignatura };
	return (
		<div style={{ position: 'relative', width: PG.ancho, height: Y.alto, borderRadius: 14, background: SUPERFICIE, boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)', fontFamily: FUENTE, color: TEXTO }}>
			<div style={{ position: 'absolute', left: PG.relleno, top: Y.titulo, right: PG.relleno, height: PG.titulo, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<span style={{ fontSize: 32, fontWeight: 700 }}>{TEXTOS.titulo}</span>
				<Btn texto={TEXTOS.recargar} icono="reload" />
			</div>

			<Tarjeta lado={0} titulo={TEXTOS.origen} valores={origen}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: F - 1, fontWeight: 600 }}>
					{TEXTOS.aCopiar}
					<span style={{ display: 'flex', gap: 16, fontWeight: 400, color: ACENTO, fontSize: F - 2 }}>{TEXTOS.todas}<span>{TEXTOS.ninguna}</span></span>
				</div>
				<div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, fontSize: F - 1 }}>
					<Marca puesta />
					{LOGRO}
					<span style={{ color: TEXTO_TENUE }}>{TEXTOS.datosLogro}</span>
				</div>
			</Tarjeta>

			<Tarjeta lado={1} titulo={TEXTOS.destino} valores={e.destino} abierto={e.abierto}>
				{e.copiado ? (
					<>
						<div style={{ fontSize: F - 1, fontWeight: 600 }}>{TEXTOS.yaTiene}</div>
						<div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: F - 1 }}>
							{LOGRO}
							<span style={{ color: TEXTO_TENUE }}>100%</span>
						</div>
					</>
				) : completo ? (
					<div style={{ textAlign: 'center', color: TEXTO_TENUE, fontSize: F - 2, paddingTop: 34 }}>{TEXTOS.vacioDestino}</div>
				) : (
					<div style={{ color: TEXTO_TENUE, fontSize: F - 2 }}>{TEXTOS.pista}</div>
				)}
			</Tarjeta>

			{/* Los mandos: con destino de otro grupo, la etiqueta en vez del interruptor de las notas. */}
			<div style={{ position: 'absolute', left: PG.relleno, top: Y.mandos, width: UTIL, height: PG.mandos, boxSizing: 'border-box', border: `1px solid #f0f0f0`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 22, padding: '0 20px' }}>
				<span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: F - 1 }}>
					<Interruptor />
					{TEXTOS.conSub}
				</span>
			</div>
			{/* La etiqueta, en el rectángulo de `rectEtiquetaNotas`: el foco sale del mismo número. */}
			{completo && (
				<span style={{ position: 'absolute', left: rectEtiquetaNotas().x, top: rectEtiquetaNotas().y, width: rectEtiquetaNotas().ancho, height: rectEtiquetaNotas().alto, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', borderRadius: 6, border: '1px solid #ffd591', background: '#fff7e6', color: '#d46b08', fontSize: F - 2 }}>
					{TEXTOS.notasNo}
				</span>
			)}
			<div style={{ position: 'absolute', left: rectBotonCopiar().x, top: rectBotonCopiar().y }}>
				<Btn texto={TEXTOS.copiar} icono="copy" tipo="primary" deshabilitado={!completo} encima={e.botonEncima} ancho={rectBotonCopiar().ancho} />
			</div>
			{e.copiado && (
				<div style={{ position: 'absolute', left: PG.relleno, top: Y.mandos + PG.mandos + 8, width: UTIL, height: PG.resultado, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderRadius: 8, border: '1px solid #b7eb8f', background: '#f6ffed', fontSize: F - 1 }}>
					<Icono cual="bien" tam={22} color="#52c41a" />
					{TEXTOS.resultado}
				</div>
			)}
		</div>
	);
};

const Tarjeta: React.FC<{
	lado: 0 | 1;
	titulo: string;
	valores: Partial<Record<Campo, string>>;
	abierto?: EstadoCopiar['abierto'];
	children: React.ReactNode;
}> = ({ lado, titulo, valores, abierto = null, children }) => {
	const lista = rectLista(lado);
	return (
		<>
			<div style={{ position: 'absolute', left: xTarjeta(lado), top: Y.tarjetas, width: ANCHO_TARJETA, height: PG.cabeceraTarjeta + PG.rellenoTarjeta + 4 * (PG.etiqueta + PG.control + PG.huecoCampo) + PG.lista + PG.rellenoTarjeta, boxSizing: 'border-box', border: `1px solid #f0f0f0`, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02)' }}>
				<div style={{ height: PG.cabeceraTarjeta, boxSizing: 'border-box', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', padding: `0 ${PG.rellenoTarjeta}px`, fontSize: F, fontWeight: 600 }}>{titulo}</div>
			</div>
			{CAMPOS.map((c, i) => {
				const r = rectControl(lado, i);
				const v = valores[c];
				const abiertoAqui = abierto?.campo === c;
				return (
					<React.Fragment key={c}>
						<div style={{ position: 'absolute', left: r.x, top: r.y - PG.etiqueta, fontSize: F - 2, color: TEXTO }}>{TEXTOS.campos[i]}</div>
						<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, boxSizing: 'border-box', border: `1px solid ${abiertoAqui ? ACENTO : BORDE}`, boxShadow: abiertoAqui ? `0 0 0 2px ${ACENTO}22` : 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: F - 1, color: v ? TEXTO : 'rgba(0,0,0,0.3)' }}>
							{v ?? TEXTOS.marcadores[i]}
							<Icono cual="flecha" tam={14} color={TEXTO_TENUE} giro={abiertoAqui ? 180 : 0} />
						</div>
					</React.Fragment>
				);
			})}
			<div style={{ position: 'absolute', left: lista.x, top: lista.y, width: lista.ancho, height: lista.alto }}>{children}</div>
			{abierto && <Desplegable lado={lado} campo={abierto.campo} resaltada={abierto.resaltada} />}
		</>
	);
};

const Desplegable: React.FC<{ lado: 0 | 1; campo: Campo; resaltada: number | null }> = ({ lado, campo, resaltada }) => {
	const i = CAMPOS.indexOf(campo);
	const r0 = rectOpcion(lado, i, 0);
	const ops = OPCIONES[campo];
	return (
		<div style={{ position: 'absolute', left: r0.x, top: r0.y - 4, width: r0.ancho, boxSizing: 'border-box', padding: '4px 0', background: SUPERFICIE, borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)', zIndex: 5 }}>
			{ops.map((o, k) => (
				<div key={o} style={{ height: ALTO_OPCION, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: F - 1, background: resaltada === k ? `${ACENTO}14` : 'transparent', color: TEXTO, fontWeight: resaltada === k ? 600 : 400 }}>{o}</div>
			))}
		</div>
	);
};

const Interruptor: React.FC = () => (
	<span style={{ width: 40, height: 22, borderRadius: 11, background: ACENTO, position: 'relative', display: 'inline-block' }}>
		<span style={{ position: 'absolute', top: 2, left: 20, width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
	</span>
);
