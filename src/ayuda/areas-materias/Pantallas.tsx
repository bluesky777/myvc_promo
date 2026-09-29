import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, AVISO_AMARILLO, BORDE, Boton, Cara, Icono, LETRA, PELIGRO, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';
import { Corte } from '../montar-el-ano/Rejilla';
import { DOCENTES } from '../montar-el-ano/reparto';
import { MEDIDAS } from '../medidas';
import { Caja, PanelDePagina } from '../el-ano/plan';
import { IconoEditar, IconoQuitar, PaginaRejilla, disposicionPagina } from '../el-ano/pagina';
import { Etiqueta } from '../el-ano/piezas';
import {
	ALTO_DIALOGO, ALTO_ORDENAR, AMBAR, AREAS, BOTONES_AREAS, BOTONES_MATERIAS, COL_AREAS, COL_MATERIAS, CONTRATADOS, DIALOGO, DIRECTORES,
	DR, HEREDADO, MATERIAS, MOVIDA, OR, TEXTOS, disposicionDirectores, rectArea, rectMateria, rectTarjetaDocente, type Area, type Trozo,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MATERIAS (con «Ordenar»), ÁREAS, DIRECTORES DE ÁREA y el diálogo de elegir docente. No saben de
 * tiempo.
 */

const Trozos: React.FC<{ t: Trozo[] }> = ({ t }) => (
	<>{t.map((x, i) => (typeof x === 'string' ? <span key={i}>{x}</span> : <b key={i}>{x.b}</b>))}</>
);

export const Asa: React.FC = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" style={{ flex: 'none' }}>
		{[4, 8, 12].map((y) => [6, 10].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="rgba(0,0,0,0.4)" />))}
	</svg>
);

/* ── Materias ─────────────────────────────────────────────────────────────────────────────── */

const Ordenar: React.FC<{ lista: Area[]; arrastrando: boolean }> = ({ lista, arrastrando }) => {
	const e = disposicionPagina(0, 0, MATERIAS.length, ALTO_ORDENAR).encima;
	return (
		<div style={{ position: 'absolute', inset: 0, background: 'rgba(128,128,128,0.08)', borderRadius: 8, fontSize: LETRA, color: TEXTO }}>
			<div style={{ position: 'absolute', left: OR.relleno, top: OR.relleno, fontSize: 17, fontWeight: 600, height: OR.titulo }}>{TEXTOS.ordenar}</div>
			<div style={{ position: 'absolute', left: OR.relleno, top: OR.relleno + OR.titulo, fontSize: LETRA - 1.5, color: TEXTO_TENUE }}>{TEXTOS.pistaOrdenar}</div>
			{lista.map((a, i) => {
				const r = rectArea(lista, i);
				return (
					<div key={a.nombre} style={{ position: 'absolute', left: r.x - e.x, top: r.y - e.y, width: r.ancho, height: r.alto, borderBottom: '1px solid rgba(128,128,128,0.25)', boxSizing: 'border-box' }}>
						<div style={{ position: 'absolute', left: 0, top: OR.pad / 2, height: OR.filaMinima, display: 'flex', alignItems: 'center', gap: 6, fontSize: LETRA }}>
							<Asa />
							{i + 1}. {a.nombre}
						</div>
						{a.materias.map((m, j) => {
							const rm = rectMateria(lista, i, j);
							const fantasma = arrastrando && m === MOVIDA;
							return (
								<div
									key={m}
									style={{
										position: 'absolute',
										left: rm.x - r.x,
										top: rm.y - r.y,
										width: rm.ancho,
										height: rm.alto,
										display: 'flex',
										alignItems: 'center',
										gap: 6,
										fontSize: LETRA - 1.5,
										padding: '0 6px',
										boxSizing: 'border-box',
										borderRadius: 4,
										opacity: fantasma ? 0.35 : 1,
										background: fantasma ? 'rgba(22,119,255,0.06)' : 'transparent',
										border: fantasma ? `1px dashed ${ACENTO}` : '1px solid transparent',
									}}
								>
									<Asa />
									{j + 1}. {m}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

/** La materia que va colgando del ratón mientras se arrastra (la vista previa de CDK). */
export const Arrastrada: React.FC<{ x: number; y: number; ancho: number }> = ({ x, y, ancho }) => (
	<Caja
		r={{ x, y, ancho, alto: OR.filaMateria }}
		estilo={{
			display: 'flex',
			alignItems: 'center',
			gap: 6,
			padding: '0 6px',
			boxSizing: 'border-box',
			background: SUPERFICIE,
			borderRadius: 4,
			boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
			fontSize: LETRA - 1.5,
			color: TEXTO,
		}}
	>
		<Asa />
		{MOVIDA}
	</Caja>
);

export const PantallaMaterias: React.FC<{ lista: Area[]; arrastrando: boolean; areaDeLaMovida: string; opacidad?: number; bajada?: number }> = ({
	lista, arrastrando, areaDeLaMovida, opacidad = 1, bajada = 0,
}) => (
	<PaginaRejilla
		titulo={TEXTOS.materias}
		botones={BOTONES_MATERIAS}
		antes={ALTO_ORDENAR}
		encima={<Ordenar lista={lista} arrastrando={arrastrando} />}
		columnas={COL_MATERIAS}
		opacidad={opacidad}
		bajada={bajada}
		filas={MATERIAS.map((m) => ({
			clave: m.materia,
			celdas: {
				id: m.id,
				editar: <IconoEditar />,
				quitar: <IconoQuitar />,
				materia: <Corte>{m.materia}</Corte>,
				alias: m.alias,
				area: <Corte>{m.materia === MOVIDA ? areaDeLaMovida : m.area}</Corte>,
			},
		}))}
	/>
);

/* ── Áreas ───────────────────────────────────────────────────────────────────────────────── */

export const PantallaAreas: React.FC<{ encimaDirectores?: boolean; opacidad?: number }> = ({ encimaDirectores = false, opacidad = 1 }) => (
	<PaginaRejilla
		titulo={TEXTOS.areas}
		botones={BOTONES_AREAS.map((b, i) => (i === 0 ? { ...b, encima: encimaDirectores } : b))}
		columnas={COL_AREAS}
		opacidad={opacidad}
		filas={AREAS.map((a, i) => ({
			clave: a.nombre,
			celdas: { id: 2 + i, editar: <IconoEditar />, quitar: <IconoQuitar />, orden: i + 1, nombre: <Corte>{a.nombre}</Corte>, alias: a.alias },
		}))}
	/>
);

/* ── Directores de área ───────────────────────────────────────────────────────────────────── */

const Retrato: React.FC<{ quien: string; tam: number }> = ({ quien, tam }) => {
	if (quien === 'heredado') {
		return <div style={{ width: tam, height: tam, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}><Avatar tipo={HEREDADO.tipo} variante={HEREDADO.variante} tam={tam} /></div>;
	}
	return <Cara docente={quien as keyof typeof DOCENTES} tam={tam} />;
};

const nombre = (quien: string) => (quien === 'heredado' ? HEREDADO.nombre : DOCENTES[quien as keyof typeof DOCENTES].nombre);

export const PantallaDirectores: React.FC<{ aviso: number; resuelto: boolean; encimaPersona?: boolean; opacidad?: number }> = ({
	aviso, resuelto, encimaPersona = false, opacidad = 1,
}) => {
	const d = disposicionDirectores(aviso);
	const directores = DIRECTORES.map((x, i) => (i === AMBAR && resuelto ? 'bernal' : x));
	const con = directores.filter((x) => x !== null).length;
	return (
		<PanelDePagina opacidad={opacidad}>
			<Caja r={d.cabecera}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div style={{ display: 'flex', gap: 12 }}>
						<div style={{ marginTop: 9, color: TEXTO_TENUE }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></div>
						<div>
							<div style={{ fontSize: 26, fontWeight: 600, color: TEXTO, height: DR.cabecera, display: 'flex', alignItems: 'center' }}>{TEXTOS.directores}</div>
							<div style={{ fontSize: LETRA, color: TEXTO_TENUE }}><Trozos t={TEXTOS.subtitulo} /></div>
						</div>
					</div>
					<div style={{ marginTop: 4 }}><Boton texto="Recargar" icono="reload" ancho={116} /></div>
				</div>
			</Caja>

			{aviso > 0.01 && (
				<Caja r={d.alerta} estilo={{ overflow: 'hidden', opacity: Math.min(1, aviso * 1.3) }}>
					<div style={{ height: DR.aviso, boxSizing: 'border-box', padding: '12px 18px', background: AVISO_AMARILLO.fondo, border: `1px solid ${AVISO_AMARILLO.borde}`, borderRadius: 8, display: 'flex', gap: 12, fontSize: LETRA, color: TEXTO }}>
						<div style={{ marginTop: 2 }}><Icono cual="alerta" tam={20} color={AVISO_AMARILLO.icono} /></div>
						<div style={{ lineHeight: '21px' }}>
							<div style={{ fontSize: LETRA + 1, fontWeight: 500 }}>{TEXTOS.avisoTitulo}</div>
							<div style={{ marginTop: 3 }}>{TEXTOS.avisoTexto}</div>
						</div>
					</div>
				</Caja>
			)}

			<Caja r={d.resumen} estilo={{ display: 'flex', alignItems: 'center', fontSize: LETRA, color: TEXTO_TENUE }}>
				<span><b style={{ color: TEXTO }}>{con}</b> de {AREAS.length} áreas con director · quedan <b style={{ color: TEXTO }}>{AREAS.length - con}</b> por asignar</span>
			</Caja>

			{AREAS.map((a, i) => {
				const r = d.filas[i];
				const quien = directores[i];
				const ambar = i === AMBAR && !resuelto;
				return (
					<Caja
						key={a.nombre}
						r={r}
						estilo={{
							display: 'flex',
							alignItems: 'center',
							boxSizing: 'border-box',
							padding: '0 14px',
							borderBottom: `1px solid ${BORDE}`,
							background: ambar ? '#fffbe6' : 'transparent',
							borderLeft: ambar ? `3px solid ${AVISO_AMARILLO.icono}` : '3px solid transparent',
							fontSize: LETRA,
							color: TEXTO,
						}}
					>
						<div style={{ width: r.ancho * 0.45 - 14, display: 'flex', gap: 10, alignItems: 'baseline' }}>
							<span style={{ fontWeight: 500 }}>{a.nombre}</span>
							<span style={{ color: TEXTO_TENUE, fontSize: LETRA - 1 }}>{a.alias}</span>
						</div>
						{quien === null ? (
							<div style={{ height: 32, padding: '0 15px', border: `1px dashed ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
								<Icono cual="plus" tam={14} /> {TEXTOS.asignar}
							</div>
						) : (
							<div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px', borderRadius: 8, background: i === AMBAR && encimaPersona ? 'rgba(0,0,0,0.05)' : 'transparent' }}>
									<Retrato quien={quien} tam={40} />
									<span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
										<span>{nombre(quien)}</span>
										{ambar && <span><Etiqueta texto={TEXTOS.sinContrato} color="oro" /></span>}
									</span>
								</div>
								<div style={{ flex: 1 }} />
								<Icono cual="aspa" tam={15} color={PELIGRO} />
							</div>
						)}
					</Caja>
				);
			})}
		</PanelDePagina>
	);
};

/* ── «Elige un docente» ──────────────────────────────────────────────────────────────────── */

export const DialogoElegir: React.FC<{ aparece: number; resaltada: number | null }> = ({ aparece, resaltada }) => {
	if (aparece <= 0.001) { return null; }
	const x0 = (MEDIDAS.ancho - DIALOGO.ancho) / 2;
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 9 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: aparece, borderRadius: 12 }} />
			<div
				style={{
					position: 'absolute',
					left: x0,
					top: DIALOGO.y,
					width: DIALOGO.ancho,
					height: ALTO_DIALOGO,
					boxSizing: 'border-box',
					padding: DIALOGO.relleno,
					background: SUPERFICIE,
					borderRadius: 8,
					boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
					opacity: aparece,
					transform: `scale(${0.94 + aparece * 0.06})`,
					transformOrigin: '50% 30%',
					fontSize: LETRA,
					color: TEXTO,
				}}
			>
				<div style={{ fontSize: 17, fontWeight: 600, height: 30 }}>{TEXTOS.elige}</div>
				<div style={{ color: TEXTO_TENUE, height: 38 }}>{TEXTOS.entradilla}</div>
				{CONTRATADOS.map((c, i) => {
					const r = rectTarjetaDocente(i);
					return (
						<div
							key={c}
							style={{
								position: 'absolute',
								left: r.x - x0,
								top: r.y - DIALOGO.y,
								width: r.ancho,
								height: r.alto,
								boxSizing: 'border-box',
								border: `1px solid ${resaltada === i ? ACENTO : BORDE}`,
								borderRadius: 8,
								background: resaltada === i ? '#f0f7ff' : SUPERFICIE,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 6,
								padding: '0 6px',
							}}
						>
							<Cara docente={c} tam={56} />
							<span style={{ fontSize: LETRA - 2, textAlign: 'center', lineHeight: 1.2 }}>{DOCENTES[c].nombre}</span>
						</div>
					);
				})}
				<div style={{ position: 'absolute', right: DIALOGO.relleno, bottom: DIALOGO.relleno }}>
					<Boton texto="Cancelar" ancho={100} />
				</div>
			</div>
		</div>
	);
};
