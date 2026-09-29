import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { En, Gris, H1, Pagina } from '../comun-directivo/Escenario';
import { MAIN } from '../comun-directivo/lugar';
import { Boton, Campo, Etiqueta, Icono, Interruptor, LETRA, Panel, Selector } from '../montar-el-ano/ant';
import {
	CANDIDATOS, CARGOS, CARGOS_Y, CONFIG, ELECCIONES, ESTAMENTOS, EVENTO, GRADOS, INSCRIBIR, INTERRUPTORES, PERSONEROS, rectFoto, rectInscribir,
	rectInterruptor, rectTarjetaCandidato, type Clave,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CONFIGURAR LA VOTACIÓN» Y «CANDIDATOS», con los textos de `config.html` y `candidatos.html`.
 * No saben de tiempo: reciben el estado.
 */

const Etiquetilla: React.FC<{ color?: 'success' | 'default'; children: React.ReactNode }> = ({ color = 'default', children }) => (
	<span
		style={{
			fontSize: 13, lineHeight: '20px', padding: '0 7px', borderRadius: 4, whiteSpace: 'nowrap',
			border: `1px solid ${color === 'success' ? '#b7eb8f' : BORDE}`,
			background: color === 'success' ? '#f6ffed' : '#fafafa',
			color: color === 'success' ? '#389e0d' : TEXTO,
		}}
	>
		{children}
	</span>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 20, fontWeight: 600, lineHeight: '32px' }}>{children}</div>;

export interface EstadoConfig {
	elegida: number;
	actual: boolean;
	in_action: boolean;
	desplegable: number;
	resaltada: number | null;
	encima: Clave | null;
}

export const PantallaConfig: React.FC<{ e: EstadoConfig; opacidad?: number }> = ({ e, opacidad = 1 }) => {
	const buena = e.elegida === 0;
	const valor = (c: Clave) => (c === 'actual' ? e.actual : c === 'in_action' ? e.in_action : false);
	return (
		<Pagina opacidad={opacidad}>
			<En x={MAIN.x} y={MAIN.y} ancho={600}><H1>Configurar la votación</H1></En>
			<En x={CONFIG.recargar.x} y={CONFIG.recargar.y}><Boton texto="Recargar" icono="reload" ancho={CONFIG.recargar.ancho} /></En>
			<En x={CONFIG.nueva.x} y={CONFIG.nueva.y}><Boton texto="Nueva elección" icono="plus" tipo="primary" ancho={CONFIG.nueva.ancho} /></En>

			<En x={CONFIG.selector.x} y={CONFIG.selector.y}><Selector valor={ELECCIONES[e.elegida]} marcador="Elige la elección" abierto={e.desplegable > 0.5} ancho={CONFIG.selector.ancho} /></En>
			<En x={CONFIG.etiquetas.x} y={CONFIG.etiquetas.y} alto={32} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				{e.actual && <Etiquetilla>La del año</Etiquetilla>}
				{e.in_action && <Etiquetilla color="success">En curso</Etiquetilla>}
			</En>

			{/* ── Izquierda: el evento ── */}
			<En x={CONFIG.izquierda.x} y={EVENTO.titulo}><H2>El evento</H2></En>
			<En x={CONFIG.izquierda.x} y={EVENTO.nombre} ancho={CONFIG.izquierda.ancho}>
				<Etiqueta texto="Nombre" />
				<Campo valor={ELECCIONES[e.elegida]} />
			</En>
			<En x={CONFIG.izquierda.x} y={EVENTO.fechas} style={{ display: 'flex', gap: 16 }}>
				<div style={{ width: 200 }}><Etiqueta texto="Se abre el" /><Campo valor={buena ? '14/10/2026' : '02/03/2026'} /></div>
				<div style={{ width: 200 }}><Etiqueta texto="Se cierra el" /><Campo valor={buena ? '14/10/2026' : '02/03/2026'} /></div>
			</En>
			<En x={CONFIG.izquierda.x} y={EVENTO.pista} ancho={CONFIG.izquierda.ancho}>
				<Gris tam={14}>Los dos días entran: con el cierre hoy, hoy se vota. En blanco, la elección no tiene ventana de fechas.</Gris>
			</En>
			{INTERRUPTORES.map((i) => {
				const r = rectInterruptor(i.clave);
				return (
					<En key={i.clave} x={r.x} y={r.y} ancho={CONFIG.izquierda.ancho}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 24, fontSize: LETRA }}>
							<div style={{ borderRadius: 9, boxShadow: e.encima === i.clave ? `0 0 0 3px ${ACENTO}33` : 'none' }}><Interruptor encendido={valor(i.clave)} /></div>
							{i.etiqueta}
							{i.clave === 'in_action' && e.in_action && <Etiquetilla color="success">En curso</Etiquetilla>}
						</div>
						<Gris tam={13.5} style={{ marginTop: 4, paddingLeft: 42 }}>{i.pista}</Gris>
					</En>
				);
			})}

			<En x={CONFIG.izquierda.x} y={CARGOS_Y}><H2>Cargos que se eligen</H2></En>
			{CARGOS.map((c, i) => (
				<En key={c.abrev} x={CONFIG.izquierda.x} y={CARGOS_Y + 40 + i * 42} ancho={CONFIG.izquierda.ancho} alto={36} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: LETRA }}>
					<span style={{ width: 46, height: 28, borderRadius: 6, background: '#f0f5ff', color: ACENTO, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{c.abrev}</span>
					<Campo valor={c.nombre} ancho={250} />
					<Campo valor={c.abrev} ancho={80} />
					<span style={{ color: TEXTO_TENUE, width: 110 }}>{!buena ? 'sin candidatos' : e.actual ? `${c.candidatos} candidatos` : '—'}</span>
					<Icono cual="delete" tam={16} color="rgba(0,0,0,0.45)" />
				</En>
			))}

			{/* ── Derecha: quién vota ── */}
			<En x={CONFIG.derecha.x} y={CONFIG.arriba} ancho={CONFIG.derecha.ancho}>
				<H2>Quién vota</H2>
				<Gris tam={14}>Nadie se inscribe: el censo sale de los grupos del año.</Gris>
				<div style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Estamentos</div>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
					{ESTAMENTOS.map((s) => (
						<span key={s.nombre} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 15, fontSize: 14, border: `1px solid ${s.vota ? ACENTO : BORDE}`, background: s.vota ? '#e6f4ff' : '#fff', color: s.vota ? '#0958d9' : TEXTO_TENUE }}>
							{s.vota ? <Icono cual="check" tam={13} /> : <span style={{ width: 10, height: 2, background: 'currentColor' }} />}
							{s.nombre} <b style={{ fontWeight: 600 }}>{s.n}</b>
						</span>
					))}
				</div>
				<div style={{ fontSize: 16, fontWeight: 600, marginTop: 20 }}>Cómo vota cada grado</div>
				<Gris tam={13.5} style={{ marginTop: 4 }}>
					«Solo» es el muchacho votando con su cuenta. «En mesa» es alguien abriéndole la papeleta —el niño de preescolar que no teclea su contraseña—.
				</Gris>
				{GRADOS.map((g) => (
					<div key={g.nombre} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
						<span style={{ flex: 1 }}>{g.nombre} <span style={{ color: TEXTO_TENUE }}>{g.n} est.</span></span>
						<span style={{ display: 'flex', border: `1px solid ${BORDE}`, borderRadius: 6, overflow: 'hidden', fontSize: 13 }}>
							<span style={{ padding: '3px 10px', background: g.mesa ? '#fff' : '#e6f4ff', color: g.mesa ? TEXTO : '#0958d9' }}>Solo</span>
							<span style={{ padding: '3px 10px', background: g.mesa ? '#e6f4ff' : '#fff', color: g.mesa ? '#0958d9' : TEXTO, borderLeft: `1px solid ${BORDE}` }}>En mesa</span>
						</span>
					</div>
				))}
			</En>

			{e.desplegable > 0.01 && (
				<En x={CONFIG.selector.x} y={CONFIG.selector.y + CONFIG.selector.alto + 4} style={{ zIndex: 5 }}>
					<Panel opciones={ELECCIONES.map((t) => ({ texto: t }))} resaltada={e.resaltada} elegida={e.elegida} ancho={CONFIG.selector.ancho} aparece={e.desplegable} />
				</En>
			)}
		</Pagina>
	);
};

/* ════════════════════════════ CANDIDATOS ════════════════════════════ */

export const PantallaCandidatos: React.FC<{ opacidad?: number }> = ({ opacidad = 1 }) => (
	<Pagina opacidad={opacidad}>
		<En x={MAIN.x} y={MAIN.y} ancho={600}><H1>Candidatos</H1></En>
		<En x={CANDIDATOS.subtitulo.x} y={CANDIDATOS.subtitulo.y}><Gris>{ELECCIONES[0]} — la elección marcada como la del año.</Gris></En>
		<En x={MAIN.x + MAIN.ancho - 116} y={MAIN.y + 4}><Boton texto="Recargar" icono="reload" ancho={116} /></En>

		<En x={CANDIDATOS.segmentado.x} y={CANDIDATOS.segmentado.y} style={{ display: 'flex', padding: 2, borderRadius: 8, background: 'rgba(0,0,0,0.05)', fontSize: LETRA }}>
			{CARGOS.map((c, i) => (
				<span key={c.abrev} style={{ width: 86, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: i === 0 ? '#fff' : 'transparent', fontWeight: i === 0 ? 600 : 400, boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.12)' : 'none' }}>{c.abrev}</span>
			))}
		</En>

		<En x={CANDIDATOS.izquierda.x} y={CANDIDATOS.arriba} ancho={CANDIDATOS.izquierda.ancho}>
			<H2>Personero</H2>
			<Gris tam={14}>3 candidatos inscritos</Gris>
		</En>
		{PERSONEROS.map((c, i) => {
			const r = rectTarjetaCandidato(i);
			return (
				<En key={c.nombre} x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} style={{ border: `1px solid ${BORDE}`, borderRadius: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', textAlign: 'center' }}>
					<div style={{ position: 'relative' }}>
						<div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden' }}><Avatar tipo={c.tipo} variante={c.variante} tam={96} /></div>
						<span style={{ position: 'absolute', right: -4, bottom: -2, width: 30, height: 30, borderRadius: 15, background: ACENTO, color: '#fff', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{c.numero}</span>
					</div>
					<div style={{ fontSize: 16, fontWeight: 600, marginTop: 12, lineHeight: '21px', height: 42 }}>{c.nombre}</div>
					<div style={{ fontSize: 14, color: TEXTO_TENUE, marginTop: 4 }}>{c.grupo}</div>
					<div style={{ marginTop: 'auto' }}><Boton texto="Quitar" icono="aspa" tipo="text" pequeno /></div>
				</En>
			);
		})}

		{(() => {
			const r = rectInscribir();
			const f = rectFoto();
			const I = INSCRIBIR;
			return (
				<>
					<En x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} style={{ border: `1px solid ${BORDE}`, borderRadius: 10, boxSizing: 'border-box', padding: I.relleno, background: '#fcfcfd' }}>
						<div style={{ height: I.titulo, fontSize: 19, fontWeight: 600 }}>Inscribir a alguien</div>
						<div style={{ height: I.etiqueta + I.campo + I.hueco }}>
							<Etiqueta texto="¿Quién se presenta?" />
							<Campo marcador="Busca por nombre o por grupo…" />
						</div>
						<div style={{ height: I.etiqueta + I.campo + I.extra + I.hueco }}>
							<Etiqueta texto="Número" />
							<Campo ancho={120} />
							<Gris tam={13} style={{ marginTop: 3 }}>El que se pinta sobre la foto</Gris>
						</div>
						<div style={{ height: I.etiqueta + I.campo + I.extra + I.hueco }}>
							<Etiqueta texto="Plancha" />
							<Campo ancho={200} />
							<Gris tam={13} style={{ marginTop: 3 }}>Opcional</Gris>
						</div>
					</En>
					<En x={f.x} y={f.y} ancho={f.ancho} alto={f.alto}>
						<div style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><IconoCamara />La foto del tarjetón</div>
						<Gris tam={13.5} style={{ marginTop: 6 }}>
							Sale de la ficha de la persona, no de esta pantalla: es la misma que el colegio usa en boletines y certificados.
						</Gris>
						<div style={{ fontSize: 14, color: ACENTO, marginTop: 8 }}>Subir y asignar fotos</div>
					</En>
					<En x={r.x + I.relleno} y={f.y + f.alto + 4}>
						<Boton texto="Inscribir en PER" tipo="primary" deshabilitado />
					</En>
				</>
			);
		})()}
	</Pagina>
);

const IconoCamara: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXTO} strokeWidth="1.9" strokeLinejoin="round">
		<path d="M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4z" />
		<circle cx="12" cy="13" r="3.4" />
	</svg>
);
