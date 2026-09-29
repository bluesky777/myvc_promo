import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { Boton, Campo, Icono, Panel, Selector, type Opcion } from '../montar-el-ano/ant';
import { avatarDe, nombreCompleto, type Alumno } from '../secretaria/personas';
import { ACENTO, BORDE, En, LETRA, MAIN, PELIGRO, Pagina, SUPERFICIE, TEXTO, TEXTO_TENUE, anchoDeBoton, botonesDeCabecera, enCascara, type Rect } from '../secretaria/piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA FICHA DEL ALUMNO (`/persona/:id/alumno`, `paginas/persona`), con la pestaña «Matrículas»
 * (`persona-matriculas.html`): un panel por año, y dentro los requisitos de ese año con su
 * «Falta | Ya | N/A» y su descripción, y los compromisos. La foto oficial y la imagen de usuario
 * van dibujadas (`Avatar`), nunca una foto. No sabe de tiempo.
 */

export interface Requisito { nombre: string; estado: 'falta' | 'ya' | 'n/a'; encima?: 'falta' | 'ya' | 'n/a' | null }

export const OPCIONES_COMPROMISO = [
	'MATRIC CONDICIONAL', 'COMPROM ACADÉMICO', 'COMPROM DISCIPLINARIO', 'COMPROM ACADÉMICO Y DISCIPLINARIO', 'PÉRDIDA DE CUPO', 'CAMBIO INSTITUCIÓN', 'OTRO',
];

export interface EstadoFicha {
	alumno: Alumno;
	requisitos: Requisito[];
	compromiso: string | null;
	compromisoAbierto?: { resaltada: number | null; aparece: number } | null;
	desplazada?: number;
	opacidad?: number;
}

/* ── La disposición ──────────────────────────────────────────────────────────────────────── */

const BOTONES = [{ texto: 'Crear alumno', icono: 'plus' as const, tipo: 'primary' as const }, { texto: 'Ver todos los certificados', icono: 'file-done' as const }];
export const ALTO_REQUISITO = 70;
export const PESTANAS = ['Matrículas', 'Otros colegios y años antiguos', 'ERE', 'Datos', 'Enfermería', 'Acudientes'];

export const D = (() => {
	const buscar = 56;
	const tarjeta = buscar + 32 + 16;
	const campos = tarjeta + 140 + 16;
	const pestanas = campos + 56 * 2 + 16 + 16;
	const panel1 = pestanas + 46 + 16;
	const h3Requisitos = panel1 + 46 + 16;
	const requisitos = h3Requisitos + 22 + 10;
	return { buscar, tarjeta, campos, pestanas, panel1, h3Requisitos, requisitos };
})();

export function disposicionCompromisos(n: number, conDescripcion: boolean) {
	const h3 = D.requisitos + n * (ALTO_REQUISITO + 6) + 10;
	const c1 = h3 + 22 + 12;
	const c2 = c1 + 58 + 12;
	const banderas = c2 + 58 + 22 + 12;
	const fin1 = banderas + 50 + 16;
	return { h3, c1, c2, banderas, panel2: fin1, panel3: fin1 + 46, fin: fin1 + 46 * 2 + 8, conDescripcion };
}

/* Las columnas de una fila de requisito: nombre (1fr), radios (auto) y descripción (2fr). */
const ANCHO_RADIOS = anchoDeBoton('Falta') + anchoDeBoton('Ya') + anchoDeBoton('N/A') - 2;
const INTERIOR = MAIN.ancho - 32 - 16;
const ANCHO_NOMBRE = Math.round((INTERIOR - ANCHO_RADIOS - 24) / 3);
const X_RADIOS = 16 + 8 + ANCHO_NOMBRE + 12;

export function rectRadio(i: number, cual: 'falta' | 'ya' | 'n/a', desplazada: number): Rect {
	const x = X_RADIOS + (cual === 'falta' ? 0 : cual === 'ya' ? anchoDeBoton('Falta') - 1 : anchoDeBoton('Falta') + anchoDeBoton('Ya') - 2);
	const ancho = anchoDeBoton(cual === 'falta' ? 'Falta' : cual === 'ya' ? 'Ya' : 'N/A');
	return enCascara({ x, y: D.requisitos + i * (ALTO_REQUISITO + 6) + (ALTO_REQUISITO - 32) / 2, ancho, alto: 32 }, desplazada);
}

export const rectRequisitos = (n: number, desplazada: number): Rect =>
	enCascara({ x: 16, y: D.h3Requisitos, ancho: MAIN.ancho - 32, alto: D.requisitos - D.h3Requisitos + n * (ALTO_REQUISITO + 6) }, desplazada);

export const rectPanelesDeAnio = (desplazada: number): Rect => enCascara({ x: 0, y: D.pestanas, ancho: MAIN.ancho, alto: D.panel1 + 46 - D.pestanas }, desplazada);

const ANCHO_SELECT = Math.round((MAIN.ancho - 32 - 16) / 3);

export function rectSelectCompromiso(n: number, desplazada: number): Rect {
	const c = disposicionCompromisos(n, false);
	return enCascara({ x: 16, y: c.c1 + 22, ancho: ANCHO_SELECT, alto: 32 }, desplazada);
}

export function rectCompromisos(n: number, desplazada: number): Rect {
	const c = disposicionCompromisos(n, false);
	return enCascara({ x: 16, y: c.h3, ancho: MAIN.ancho - 32, alto: c.banderas - c.h3 - 6 }, desplazada);
}

/* ── El dibujo ─────────────────────────────────────────────────────────────────────────────── */

const Etiqueta: React.FC<{ texto: string; color?: 'orange' | 'blue' | 'green' | 'red' | null }> = ({ texto, color = null }) => {
	const c = color === 'green' ? ['#f6ffed', '#b7eb8f', '#389e0d'] : color === 'red' ? ['#fff1f0', '#ffa39e', '#cf1322'] : ['#fafafa', '#d9d9d9', 'rgba(0,0,0,0.88)'];
	return <span style={{ fontSize: LETRA - 2, padding: '1px 8px', borderRadius: 4, background: c[0], border: `1px solid ${c[1]}`, color: c[2], whiteSpace: 'nowrap' }}>{texto}</span>;
};

const CampoFicha: React.FC<{ etiqueta: string; children: React.ReactNode }> = ({ etiqueta, children }) => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
		<span style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>{etiqueta}</span>
		{children}
	</div>
);

const CabezaPanel: React.FC<{ texto: string; abierto: boolean }> = ({ texto, abierto }) => (
	<div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', background: '#fafafa', borderBottom: '1px solid #d9d9d9', fontSize: LETRA }}>
		<Icono cual="flecha" tam={12} giro={abierto ? 0 : -90} color={TEXTO} />
		{texto}
	</div>
);

export const PantallaFicha: React.FC<{ estado: EstadoFicha }> = ({ estado: e }) => {
	const a = e.alumno;
	const rects = botonesDeCabecera(BOTONES);
	const c = disposicionCompromisos(e.requisitos.length, Boolean(e.compromiso));
	const columnas4 = (MAIN.ancho - 3 * 16) / 4;
	return (
		<Pagina alto={c.fin} desplazada={e.desplazada ?? 0} opacidad={e.opacidad ?? 1}>
			<En r={{ x: 0, y: 0 }}>
				<div style={{ fontSize: 26, fontWeight: 600, height: 40, display: 'flex', alignItems: 'center' }}>Ficha de {nombreCompleto(a)}</div>
			</En>
			{BOTONES.map((b, i) => (
				<En key={b.texto} r={{ x: rects[i].x, y: rects[i].y }}><Boton texto={b.texto} icono={b.icono} tipo={b.tipo} ancho={rects[i].ancho} /></En>
			))}
			<En r={{ x: 0, y: D.buscar }}><Selector marcador="Buscar otra persona por nombre" ancho={400} /></En>

			{/* La tarjeta: las dos imágenes, el grupo y sus marcas. */}
			<En r={{ x: 0, y: D.tarjeta, ancho: MAIN.ancho }}>
				<div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
					<div style={{ display: 'flex', gap: 10 }}>
						{[0, 3].map((k) => (
							<div key={k} style={{ width: 140, height: 140, borderRadius: 8, overflow: 'hidden', background: '#e9eef5' }}>
								<Avatar {...avatarDe(a)} tam={140} />
							</div>
						))}
					</div>
					<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
						<span style={{ fontWeight: 600, fontSize: LETRA + 1, marginRight: 4 }}>9°B</span>
						<Etiqueta texto="Repitente: No" />
						<Etiqueta texto="Egresado: No" />
						<Etiqueta texto="Nuevo: No" />
						<Etiqueta texto="Activo" color="green" />
					</div>
				</div>
			</En>

			<En r={{ x: 0, y: D.campos, ancho: MAIN.ancho }}>
				<div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${columnas4}px)`, gap: 16 }}>
					<CampoFicha etiqueta="Nombres"><Campo valor={a.nombres} /></CampoFicha>
					<CampoFicha etiqueta="Apellidos"><Campo valor={a.apellidos} /></CampoFicha>
					<CampoFicha etiqueta="Sexo">
						<div style={{ height: 32, display: 'flex', alignItems: 'center', gap: 18, fontSize: LETRA }}>
							{['Masculino', 'Femenino'].map((s, i) => (
								<span key={s} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
									<span style={{ width: 16, height: 16, borderRadius: '50%', boxSizing: 'border-box', border: `${(a.sexo === 'F') === (i === 1) ? 5 : 1}px solid ${(a.sexo === 'F') === (i === 1) ? ACENTO : BORDE}` }} />
									{s}
								</span>
							))}
						</div>
					</CampoFicha>
					<CampoFicha etiqueta="Celular"><Campo valor={a.celular} /></CampoFicha>
					<CampoFicha etiqueta="Número de matrícula"><Campo valor={a.matricula} /></CampoFicha>
					<CampoFicha etiqueta="Deuda $"><Campo valor="0" /></CampoFicha>
					<CampoFicha etiqueta="Paz y salvo"><Boton texto="Sí" icono="check" tipo="primary" ancho={64} /></CampoFicha>
				</div>
			</En>

			{/* Las pestañas: «Matrículas». */}
			<En r={{ x: 0, y: D.pestanas, ancho: MAIN.ancho, alto: 46 }}>
				<div style={{ display: 'flex', gap: 30, height: 46, alignItems: 'center', boxShadow: 'inset 0 -1px 0 #f0f0f0', fontSize: LETRA }}>
					{PESTANAS.map((t, i) => (
						<div key={t} style={{ height: 46, display: 'flex', alignItems: 'center', color: i === 0 ? ACENTO : TEXTO, boxShadow: i === 0 ? `inset 0 -2px 0 ${ACENTO}` : 'none', whiteSpace: 'nowrap' }}>{t}</div>
					))}
				</div>
			</En>

			{/* El acordeón de años: 2026 abierto. */}
			<En r={{ x: 0, y: D.panel1, ancho: MAIN.ancho, alto: c.fin - D.panel1 - 8 }}>
				<div style={{ border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden', height: '100%', boxSizing: 'border-box', background: SUPERFICIE }}>
					<CabezaPanel texto="Año 2026 — 9°B" abierto />
					<div style={{ height: c.panel2 - D.panel1 - 46, borderBottom: `1px solid ${BORDE}` }} />
					<CabezaPanel texto="Año 2025 — 8°A" abierto={false} />
					<CabezaPanel texto="Año 2024 — 7°A" abierto={false} />
				</div>
			</En>

			<En r={{ x: 16, y: D.h3Requisitos }}>
				<div style={{ fontSize: LETRA + 1, fontWeight: 600 }}>Requisitos para matricular en 2026</div>
			</En>
			{e.requisitos.map((r, i) => (
				<En key={r.nombre} r={{ x: 16, y: D.requisitos + i * (ALTO_REQUISITO + 6), ancho: MAIN.ancho - 32, alto: ALTO_REQUISITO }}>
					<div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', border: `1px solid ${r.estado === 'falta' ? PELIGRO : 'rgba(0,0,0,0.15)'}`, borderRadius: 6 }}>
						<div style={{ width: ANCHO_NOMBRE, fontSize: LETRA }}>{r.nombre}</div>
						<div style={{ display: 'flex' }}>
							{(['falta', 'ya', 'n/a'] as const).map((v, k) => {
								const t = v === 'falta' ? 'Falta' : v === 'ya' ? 'Ya' : 'N/A';
								const on = r.estado === v;
								const sobre = r.encima === v && !on;
								return (
									<div
										key={v}
										style={{
											width: anchoDeBoton(t), height: 32, boxSizing: 'border-box', marginLeft: k ? -1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: LETRA,
											border: `1px solid ${on || sobre ? ACENTO : BORDE}`, background: on ? ACENTO : SUPERFICIE, color: on ? '#fff' : sobre ? ACENTO : TEXTO,
											borderRadius: k === 0 ? '6px 0 0 6px' : k === 2 ? '0 6px 6px 0' : 0, position: 'relative', zIndex: on || sobre ? 1 : 0,
										}}
									>
										{t}
									</div>
								);
							})}
						</div>
						<div style={{ flex: 1, height: 54, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, padding: '6px 11px', fontSize: LETRA, color: 'rgba(0,0,0,0.3)' }}>Descripción (opcional)</div>
					</div>
				</En>
			))}

			<En r={{ x: 16, y: c.h3 }}>
				<div style={{ fontSize: LETRA + 1, fontWeight: 600 }}>Compromisos 2026</div>
			</En>
			<En r={{ x: 16, y: c.c1, ancho: MAIN.ancho - 32 }}>
				<div style={{ display: 'flex', gap: 16 }}>
					<CampoFicha etiqueta="Aplicar para este año 2026">
						<Selector marcador="Recomendación" valor={e.compromiso} abierto={Boolean(e.compromisoAbierto)} ancho={ANCHO_SELECT} />
					</CampoFicha>
					{e.compromiso && (
						<CampoFicha etiqueta="Descripción de la recomendación">
							<div style={{ width: MAIN.ancho - 32 - 16 - ANCHO_SELECT, height: 54, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, padding: '6px 11px', fontSize: LETRA, color: 'rgba(0,0,0,0.3)' }}>Observaciones</div>
						</CampoFicha>
					)}
				</div>
			</En>
			<En r={{ x: 16, y: c.c2, ancho: MAIN.ancho - 32 }}>
				<CampoFicha etiqueta="Programar para el 2027">
					<Selector marcador="Recomendación" ancho={ANCHO_SELECT} />
					<em style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>Durante el 2026 se decide que el estudiante entrará con compromiso en el año 2027.</em>
				</CampoFicha>
			</En>
			<En r={{ x: 16, y: c.banderas }}>
				<div style={{ display: 'flex', gap: 32 }}>
					{['Es nuevo', 'Es repitente'].map((t) => (
						<CampoFicha key={t} etiqueta={t}>
							<div style={{ width: 44, height: 22, borderRadius: 11, background: 'rgba(0,0,0,0.25)', position: 'relative' }}>
								<div style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
							</div>
						</CampoFicha>
					))}
				</div>
			</En>

			{e.compromisoAbierto && (
				<En r={{ x: 16, y: c.c1 + 22 + 32 + 4 }} z={5}>
					<Panel
						opciones={OPCIONES_COMPROMISO.map((o): Opcion => ({ texto: o }))}
						resaltada={e.compromisoAbierto.resaltada}
						ancho={ANCHO_SELECT}
						aparece={e.compromisoAbierto.aparece}
					/>
				</En>
			)}
		</Pagina>
	);
};

export { TEXTO_TENUE };
