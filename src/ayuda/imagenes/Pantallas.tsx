import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { Escudo } from '../colegio';
import { MEDIDAS } from '../medidas';
import { ACENTO, AVISO_AMARILLO, BORDE, Boton, Cara, Icono, LETRA, PELIGRO, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';
import { DOCENTES } from '../montar-el-ano/reparto';
import {
	ALBUM, ALUMNOS, FIRMANTES, FIRMAS_AVISO, FIRMAS_LISTA, FIRMAS_SUBIR, GRUPO, GRUPO_PANEL, L, LA_DE_LA_ALUMNA, MIS_IMAGENES, MODAL, NAV, SUBIR,
	TEXTOS, TIRA, TARJETA, VISOR, rectAlumno, rectBotonVisor, rectCerrarVisor, rectFirmante, rectMini, rectPestana, rectTarjeta,
	type Alumno, type Foto, type Trozo,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS PANTALLAS DE IMÁGENES. No saben de tiempo. Las «fotos» son SIEMPRE el avatar dibujado sobre
 * un fondo de color (`FotoDibujada`), y las firmas, trazos de `Firma`: nada de imágenes de verdad.
 */

const Trozos: React.FC<{ t: Trozo[] }> = ({ t }) => (
	<>{t.map((x, i) => (typeof x === 'string' ? <span key={i}>{x}</span> : <b key={i}>{x.b}</b>))}</>
);

/** Una foto: el avatar dibujado, recortado en cuadrado, sobre su fondo. */
export const FotoDibujada: React.FC<{ foto: Foto; lado: number; radio?: number }> = ({ foto, lado, radio = 6 }) => (
	<div style={{ width: lado, height: lado, borderRadius: radio, overflow: 'hidden', background: foto.fondo, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flex: 'none' }}>
		<div style={{ marginBottom: -lado * 0.06 }}><Avatar tipo={foto.tipo} variante={foto.variante} tam={lado * 0.92} /></div>
	</div>
);

/** La silueta gris que pone el servidor cuando no hay foto (`default_male.png`), dibujada. */
const Silueta: React.FC<{ lado: number }> = ({ lado }) => (
	<div style={{ width: lado, height: lado, borderRadius: 6, background: '#eef0f3', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
		<svg width={lado * 0.8} height={lado * 0.8} viewBox="0 0 100 100">
			<circle cx="50" cy="38" r="20" fill="#c9ced6" />
			<path d="M12 100 C14 72 32 62 50 62 C68 62 86 72 88 100 Z" fill="#c9ced6" />
		</svg>
	</div>
);

/** Las firmas: cinco garabatos inventados. */
export const Firma: React.FC<{ cual: number; ancho?: number }> = ({ cual, ancho = 150 }) => {
	const trazos = [
		'M6 32 C16 10 24 8 26 28 C28 42 36 14 44 20 C52 26 48 38 58 30 C68 22 72 12 80 22 C88 32 98 30 144 18',
		'M10 30 C18 18 28 12 32 24 C36 36 42 28 48 20 C54 12 60 32 68 26 C78 18 82 24 90 28 C98 32 106 16 116 20 C124 24 130 28 142 24',
		'M8 36 C12 16 22 10 30 18 C36 24 30 36 40 34 C50 32 52 14 62 16 C72 18 66 34 78 32 C92 30 104 20 142 26',
		'M12 28 C22 8 30 38 38 20 C44 8 50 34 58 26 C66 18 70 30 80 24 C92 18 102 26 112 22 C122 18 132 24 144 20',
		'M10 34 C20 30 24 12 34 14 C44 16 36 34 48 32 C60 30 60 16 72 18 C84 20 80 34 94 30 C108 26 120 20 140 22',
	];
	return (
		<svg width={ancho} height={ancho * 0.32} viewBox="0 0 150 48" aria-hidden>
			<path d={trazos[cual % trazos.length]} fill="none" stroke="#1d2f6b" strokeWidth="2.1" strokeLinecap="round" />
		</svg>
	);
};

const Panel: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; children?: React.ReactNode; estilo?: React.CSSProperties }> = ({ r, children, estilo }) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			padding: L.relleno,
			background: SUPERFICIE,
			border: '1px solid #e8e8e8',
			borderRadius: 10,
			overflow: 'hidden',
			color: TEXTO,
			fontSize: LETRA,
			...estilo,
		}}
	>
		{children}
	</div>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 17, fontWeight: 700, height: 26 }}>{children}</div>;
const Pista: React.FC<{ children: React.ReactNode; estilo?: React.CSSProperties }> = ({ children, estilo }) => (
	<div style={{ fontSize: LETRA - 1, lineHeight: 1.45, color: TEXTO_TENUE, ...estilo }}>{children}</div>
);

const ZonaSubida: React.FC<{ texto: string; boton: string }> = ({ texto, boton }) => (
	<div style={{ marginTop: 12, height: 70, border: `1px dashed ${BORDE}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fafafa', fontSize: LETRA - 1, color: TEXTO_TENUE }}>
		{texto} <Boton texto={boton} pequeno />
	</div>
);

/* ── La cabecera de Imágenes con sus pestañas ─────────────────────────────────────────────── */

export const Navegacion: React.FC<{ pestana: number; senalada?: number | null }> = ({ pestana, senalada = null }) => (
	<Panel r={NAV}>
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			<div style={{ fontSize: 24, fontWeight: 700 }}>{TEXTOS.titulo}</div>
			<Boton texto="Recargar" icono="reload" ancho={116} />
		</div>
		{TEXTOS.pestanas.map((p, i) => {
			const r = rectPestana(i);
			const puesta = i === pestana;
			const encima = senalada === i;
			return (
				<div
					key={p}
					style={{
						position: 'absolute',
						left: r.x - NAV.x,
						top: r.y - NAV.y,
						width: r.ancho,
						height: r.alto,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 7,
						borderBottom: `2px solid ${puesta ? ACENTO : 'transparent'}`,
						color: puesta || encima ? ACENTO : TEXTO,
						fontWeight: puesta ? 600 : 400,
					}}
				>
					<IconoPestana i={i} color={puesta || encima ? ACENTO : TEXTO_TENUE} />
					{p}
				</div>
			);
		})}
		<div style={{ position: 'absolute', left: L.relleno, right: L.relleno, top: rectPestana(0).y - NAV.y + 42, height: 1, background: 'rgb(128 128 128 / 25%)' }} />
	</Panel>
);

const IconoPestana: React.FC<{ i: number; color: string }> = ({ i, color }) => {
	const t = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<svg width="15" height="15" viewBox="0 0 16 16" style={{ flex: 'none' }}>
			{i === 0 && (<><rect x="2" y="2.5" width="12" height="11" rx="1.5" {...t} /><circle cx="6" cy="6.5" r="1.3" {...t} /><path d="M2.5 12 L6.5 8.5 L9 10.5 L11 9 L13.5 11.5" {...t} /></>)}
			{i === 1 && (<><circle cx="6" cy="6" r="2.2" {...t} /><circle cx="11.3" cy="6.8" r="1.7" {...t} /><path d="M2 13.5 C2 10.8 3.8 9.6 6 9.6 C8.2 9.6 10 10.8 10 13.5 M10.5 10 C12.6 9.8 14 11 14 13" {...t} /></>)}
			{i === 2 && (<><rect x="1.5" y="3" width="13" height="10" rx="1.5" {...t} /><circle cx="5.5" cy="7.3" r="1.6" {...t} /><path d="M9 6.5 H12.5 M9 9.2 H12.5 M3.3 11 C3.8 9.6 7.2 9.6 7.7 11" {...t} /></>)}
			{i === 3 && <path d="M3 13 L3.6 10.2 L10.8 3 L13 5.2 L5.8 12.4 Z" {...t} />}
		</svg>
	);
};

/* ── Mi galería ───────────────────────────────────────────────────────────────────────────── */

export const Galeria: React.FC<{ tarjetaEncima?: number | null }> = ({ tarjetaEncima = null }) => (
	<>
		<Panel r={SUBIR[0]}>
			<H2>{TEXTOS.fotos}</H2>
			<Pista>{TEXTOS.fotosPista}</Pista>
			<ZonaSubida texto="Arrastra aquí las fotos, o" boton="Elegir fotos" />
		</Panel>
		<Panel r={SUBIR[1]}>
			<H2>{TEXTOS.logos}</H2>
			<Pista><Trozos t={TEXTOS.logosPista} /></Pista>
			<ZonaSubida texto="Arrastra aquí el logo, o" boton="Elegir archivo" />
		</Panel>
		<Panel r={SUBIR[2]}>
			<H2>{TEXTOS.logo}</H2>
			<Pista>{TEXTOS.logoPista}</Pista>
			<div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><Escudo tam={70} /></div>
		</Panel>
		<Panel r={ALBUM}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<H2>{TEXTOS.album}</H2>
					<Pista>{TEXTOS.albumPista}</Pista>
				</div>
				<div style={{ display: 'flex', height: 32 }}>
					<div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', background: ACENTO, color: '#fff', borderRadius: '6px 0 0 6px' }}>{TEXTOS.mias}</div>
					<div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', border: `1px solid ${BORDE}`, borderLeft: 'none', borderRadius: '0 6px 6px 0' }}>{TEXTOS.publicas}</div>
				</div>
			</div>
			{MIS_IMAGENES.map((f, i) => {
				const r = rectTarjeta(i);
				return (
					<div key={i} style={{ position: 'absolute', left: r.x - ALBUM.x, top: r.y - ALBUM.y, width: r.ancho }}>
						<div style={{ borderRadius: 8, outline: tarjetaEncima === i ? `2px solid ${ACENTO}` : 'none', outlineOffset: 2 }}>
							<FotoDibujada foto={f} lado={TARJETA.lado} radio={8} />
						</div>
						<div style={{ height: TARJETA.acciones, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, color: TEXTO_TENUE }}>
							<Icono cual="undo" tam={14} />
							<Icono cual="undo" tam={14} giro={180} />
							<Globo />
							<Icono cual="delete" tam={14} color={PELIGRO} />
						</div>
					</div>
				);
			})}
		</Panel>
	</>
);

const Globo: React.FC = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<circle cx="12" cy="12" r="9" />
		<path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
	</svg>
);

/** El logo del colegio: un escudo genérico dibujado (no el de ningún colegio). */
/* ── El visor ─────────────────────────────────────────────────────────────────────────────── */

export const Visor: React.FC<{ aparece: number; encimaBoton: number | null; globo: number }> = ({ aparece, encimaBoton, globo }) => {
	if (aparece <= 0.001) { return null; }
	const f = MIS_IMAGENES[0];
	const oficial = rectBotonVisor(2);
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 9, background: 'rgba(0,0,0,0.88)', opacity: aparece, borderRadius: 12, color: '#fff', fontSize: LETRA }}>
			<div style={{ position: 'absolute', left: 20, top: 0, height: VISOR.barra, display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}>1 de {MIS_IMAGENES.length}</div>
			{VISOR.botones.map((b, i) => {
				const r = rectBotonVisor(i);
				const peligro = b.t === 'Eliminar';
				return (
					<div
						key={b.t}
						style={{
							position: 'absolute',
							left: r.x,
							top: r.y,
							width: r.ancho,
							height: r.alto,
							boxSizing: 'border-box',
							borderRadius: 6,
							background: encimaBoton === i ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
							border: `1px solid ${peligro ? 'rgba(255,120,117,0.7)' : 'rgba(255,255,255,0.25)'}`,
							color: peligro ? '#ff7875' : '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
							fontSize: LETRA - 1,
						}}
					>
						{i === 0 && <Icono cual="undo" tam={13} color="#fff" />}
						{b.t}
					</div>
				);
			})}
			<div style={{ position: 'absolute', left: rectCerrarVisor().x, top: rectCerrarVisor().y, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Icono cual="aspa" tam={18} color="#fff" />
			</div>
			<div style={{ position: 'absolute', left: (MEDIDAS.ancho - 440) / 2, top: 110, width: 440 }}>
				<FotoDibujada foto={f} lado={440} radio={4} />
				<div style={{ textAlign: 'center', marginTop: 10, color: 'rgba(255,255,255,0.75)', fontSize: LETRA - 1 }}>IMG_2041.jpg</div>
			</div>
			{[-1, 1].map((d) => (
				<div key={d} style={{ position: 'absolute', top: 310, left: d < 0 ? 330 : MEDIDAS.ancho - 330 - 40, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Icono cual="flecha" tam={16} color="#fff" giro={d < 0 ? 90 : -90} />
				</div>
			))}
			<div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
				{MIS_IMAGENES.map((m, i) => (
					<div key={i} style={{ outline: i === 0 ? '2px solid #fff' : 'none', borderRadius: 4, opacity: i === 0 ? 1 : 0.6 }}>
						<FotoDibujada foto={m} lado={52} radio={4} />
					</div>
				))}
			</div>
			{globo > 0.01 && (
				<div
					style={{
						position: 'absolute',
						left: oficial.x + oficial.ancho / 2 - 200,
						top: oficial.y + oficial.alto + 10,
						width: 400,
						boxSizing: 'border-box',
						padding: '8px 12px',
						borderRadius: 7,
						background: 'rgba(0,0,0,0.85)',
						border: '1px solid rgba(255,255,255,0.2)',
						color: '#fff',
						fontSize: LETRA - 1,
						textAlign: 'center',
						opacity: globo,
					}}
				>
					{TEXTOS.globoOficial}
				</div>
			)}
		</div>
	);
};

/* ── Asignar a alumnos ────────────────────────────────────────────────────────────────────── */

export const Asignar: React.FC<{ elegida: boolean; asignada: boolean; encimaAlumno: number | null }> = ({ elegida, asignada, encimaAlumno }) => {
	const privadas = MIS_IMAGENES.map((f, i) => ({ f, i })).filter((x) => !(asignada && x.i === LA_DE_LA_ALUMNA));
	const alumnos: Alumno[] = ALUMNOS.map((a, i) => (asignada && i === 2 ? { ...a, foto: MIS_IMAGENES[LA_DE_LA_ALUMNA] } : a));
	const sin = alumnos.filter((a) => !a.foto).length;
	return (
		<>
			<Panel r={TIRA}>
				<H2>{TEXTOS.tuyas}</H2>
				<Pista>{TEXTOS.tuyasPista}</Pista>
				{privadas.map(({ f, i }, k) => {
					const r = rectMini(k);
					const es = elegida && i === LA_DE_LA_ALUMNA;
					return (
						<div key={i} style={{ position: 'absolute', left: r.x - TIRA.x, top: r.y - TIRA.y, borderRadius: 7, outline: es ? `3px solid ${ACENTO}` : 'none', outlineOffset: 2 }}>
							<FotoDibujada foto={f} lado={r.ancho} />
						</div>
					);
				})}
			</Panel>
			<Panel r={GRUPO_PANEL}>
				<div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
					<div>
						<div style={{ height: 24 }}>Grupo</div>
						<div style={{ width: 300, height: 32, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px', gap: 6 }}>
							{GRUPO.nombre} <span style={{ color: TEXTO_TENUE }}>· {GRUPO.titular}</span>
						</div>
					</div>
					<div>
						<div style={{ height: 24 }}>Buscar alumno</div>
						<div style={{ width: 260, height: 32, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px', color: 'rgba(0,0,0,0.3)' }}>Apellido o nombre</div>
					</div>
				</div>
				<div style={{ marginTop: 10, color: TEXTO_TENUE, height: 22 }}>{sin} de {alumnos.length} sin foto oficial</div>
				{alumnos.map((a, i) => {
					const r = rectAlumno(i);
					return (
						<div
							key={a.nombre}
							style={{
								position: 'absolute',
								left: r.x - GRUPO_PANEL.x,
								top: r.y - GRUPO_PANEL.y,
								width: r.ancho,
								height: r.alto,
								boxSizing: 'border-box',
								border: `1px solid ${encimaAlumno === i ? ACENTO : !a.foto ? '#ffd591' : BORDE}`,
								borderRadius: 8,
								padding: 10,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 6,
								background: encimaAlumno === i ? '#f0f7ff' : SUPERFICIE,
							}}
						>
							{a.foto ? <FotoDibujada foto={a.foto} lado={132} /> : <Silueta lado={132} />}
							<div style={{ fontSize: LETRA - 1.5, textAlign: 'center', lineHeight: 1.25 }}>{a.nombre}</div>
							{!a.foto && <span style={{ fontSize: 12, padding: '0 6px', borderRadius: 4, background: AVISO_AMARILLO.fondo, border: `1px solid ${AVISO_AMARILLO.borde}`, color: '#ad6800' }}>{TEXTOS.sinFoto}</span>}
						</div>
					);
				})}
			</Panel>
		</>
	);
};

export const ModalAsignar: React.FC<{ aparece: number; encimaSi: boolean; nombre: string }> = ({ aparece, encimaSi, nombre }) => {
	if (aparece <= 0.001) { return null; }
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 9 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: aparece, borderRadius: 12 }} />
			<div
				style={{
					position: 'absolute',
					left: (MEDIDAS.ancho - MODAL.ancho) / 2,
					top: MODAL.y,
					width: MODAL.ancho,
					height: MODAL.alto,
					boxSizing: 'border-box',
					padding: '20px 24px',
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
				<div style={{ display: 'flex', gap: 12 }}>
					<div style={{ marginTop: 2 }}><Icono cual="alerta" tam={20} color={AVISO_AMARILLO.icono} /></div>
					<div>
						<div style={{ fontSize: 16.5, fontWeight: 600, lineHeight: '24px' }}>{TEXTOS.modalTitulo(nombre)}</div>
						<div style={{ marginTop: 8, lineHeight: '22px' }}>{TEXTOS.modalTexto}</div>
					</div>
				</div>
				<div style={{ position: 'absolute', right: 24, bottom: 20, display: 'flex', gap: 8 }}>
					<Boton texto="Cancelar" ancho={100} />
					<Boton texto={TEXTOS.asignar} tipo="primary" ancho={210} encima={encimaSi} />
				</div>
			</div>
		</div>
	);
};

/* ── Firmas de docentes ───────────────────────────────────────────────────────────────────── */

export const Firmas: React.FC = () => (
	<>
		<div
			style={{
				position: 'absolute',
				left: FIRMAS_AVISO.x,
				top: FIRMAS_AVISO.y,
				width: FIRMAS_AVISO.ancho,
				height: FIRMAS_AVISO.alto,
				boxSizing: 'border-box',
				padding: '12px 18px',
				background: AVISO_AMARILLO.fondo,
				border: `1px solid ${AVISO_AMARILLO.borde}`,
				borderRadius: 8,
				display: 'flex',
				gap: 12,
				fontSize: LETRA,
				color: TEXTO,
			}}
		>
			<div style={{ marginTop: 2 }}><Icono cual="alerta" tam={20} color={AVISO_AMARILLO.icono} /></div>
			<div style={{ lineHeight: '22px' }}>
				<div style={{ fontWeight: 500, fontSize: LETRA + 1 }}>{TEXTOS.firmasAviso}</div>
				<div>{TEXTOS.firmasAvisoTexto}</div>
			</div>
		</div>
		<Panel r={FIRMAS_SUBIR}>
			<ZonaSubida texto={TEXTOS.subirFirma} boton="Elegir firma" />
			<Pista estilo={{ marginTop: 6 }}>{TEXTOS.subirFirmaPista}</Pista>
		</Panel>
		<Panel r={FIRMAS_LISTA}>
			<div style={{ width: 300, height: 32, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px', color: 'rgba(0,0,0,0.3)' }}>Buscar docente</div>
			{FIRMANTES.map((f, i) => {
				const r = rectFirmante(i);
				return (
					<div
						key={f.docente}
						style={{ position: 'absolute', left: r.x - FIRMAS_LISTA.x, top: r.y - FIRMAS_LISTA.y, width: r.ancho, height: r.alto, display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${BORDE}` }}
					>
						<Cara docente={f.docente} tam={36} />
						<span style={{ width: 300 }}>{DOCENTES[f.docente].nombre}</span>
						<div style={{ width: 220, height: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
							{f.firma !== null && <Firma cual={f.firma} ancho={140} />}
							<div style={{ width: 200, height: 1, background: '#8c8c8c' }} />
						</div>
						<div style={{ flex: 1 }} />
						{f.firma !== null ? <Icono cual="delete" tam={16} color={PELIGRO} /> : <span style={{ color: TEXTO_TENUE }}>Sin firma</span>}
					</div>
				);
			})}
		</Panel>
	</>
);
