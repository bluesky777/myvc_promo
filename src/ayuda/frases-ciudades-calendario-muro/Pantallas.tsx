import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { En, Gris, H1, Pagina } from '../comun-directivo/Escenario';
import { MAIN } from '../comun-directivo/lugar';
import { Boton, Campo, Ficha, Etiqueta, Icono, LETRA, PELIGRO, Panel, Selector } from '../montar-el-ano/ant';
import { Rejilla } from '../montar-el-ano/Rejilla';
import {
	ANCHO_DEPARTAMENTO, ANCHO_NOMBRE_CIUDAD, CALENDARIO, CIUDADES, COLUMNAS_FRASES, CUMPLEANOS, DEPARTAMENTOS, EDITOR, EL_DEPARTAMENTO, EVENTOS, FICHA_FRASE,
	FILA_CIUDAD, FRASES, HOY, LAS_CIUDADES, MURO, PUBLICACIONES, misPublicacionesY, pistaFrases, rectTarjeta, rejillaFrases,
	type Frase,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS CUATRO PANTALLAS PEQUEÑAS. No saben de tiempo: reciben el estado y lo pintan donde dice
 * `datos.ts`. Los textos son los de las plantillas de `app2`.
 */

/* ════════════════════════════ FRASES ════════════════════════════ */

export interface EstadoFrases {
	/** La ficha «Nueva frase»: 0 cerrada, 1 abierta. */
	ficha: number;
	frase: string;
	/** Qué campo tiene el foco. */
	activo: 'frase' | null;
	cursor: boolean;
	encimaCrearNueva: boolean;
	encimaCrear: boolean;
	/** La fila nueva: 0 no está, 1 entró. */
	nueva: number;
	/** La celda Frase de la fila nueva, en edición (el borde azul de AG Grid). */
	celdaEditando: boolean;
}

const filaFrase = (f: Frase, opacidad = 1, fondo?: string) => ({
	clave: String(f.id),
	opacidad,
	fondo,
	celdas: {
		id: f.id,
		borrar: <Icono cual="delete" tam={17} color={PELIGRO} />,
		tipo: f.tipo,
		frase: f.frase,
	},
});

export const PantallaFrases: React.FC<{ e: EstadoFrases; filas: Frase[]; nueva: Frase; opacidad?: number }> = ({ e, filas, nueva, opacidad = 1 }) => {
	const r = rejillaFrases(e.ficha, filas.length + 1);
	const todas = [...filas.map((f) => filaFrase(f)), ...(e.nueva > 0 ? [filaFrase(nueva, e.nueva, `${ACENTO}10`)] : [])];
	return (
		<Pagina opacidad={opacidad}>
			<En x={MAIN.x} y={MAIN.y} ancho={600}><H1>Frases del año</H1></En>
			<En x={FRASES.recargar.x} y={FRASES.recargar.y}><Boton texto="Recargar" icono="reload" ancho={FRASES.recargar.ancho} /></En>
			<En x={FRASES.crearNueva.x} y={FRASES.crearNueva.y}><Boton texto="Crear nueva" icono="plus" tipo="primary" ancho={FRASES.crearNueva.ancho} encima={e.encimaCrearNueva} /></En>

			{e.ficha > 0.01 && (
				<En x={FRASES.ficha.x} y={FRASES.ficha.y} style={{ opacity: Math.min(1, e.ficha * 1.4), transform: `translateY(${(1 - e.ficha) * -10}px)` }}>
					<Ficha titulo="Nueva frase" ancho={FRASES.ficha.ancho}>
						<div style={{ height: FRASES.ficha.alto - 40 - 24, position: 'relative' }}>
							<Etiqueta texto="Frase" obligatorio />
							<Campo valor={e.frase} foco={e.activo === 'frase'} cursor={e.activo === 'frase' && e.cursor} ancho={FICHA_FRASE.frase.ancho} />
							<div style={{ height: 12 }} />
							<Etiqueta texto="Tipo" />
							<Selector valor="Fortaleza" marcador="" ancho={FICHA_FRASE.tipo.ancho} />
							<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
								<Boton texto="Crear" tipo="primary" ancho={FICHA_FRASE.crear.ancho} encima={e.encimaCrear} />
								<Boton texto="Ocultar" ancho={90} />
							</div>
						</div>
					</Ficha>
				</En>
			)}

			<En x={MAIN.x} y={pistaFrases(e.ficha)} style={{ fontSize: LETRA - 1.5, color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
				Haz clic en el texto de una frase para editarlo. Se guarda al salir de la celda.
			</En>
			<En x={r.x} y={r.y}>
				<Rejilla columnas={COLUMNAS_FRASES} filas={todas} ancho={r.ancho} alto={r.alto} />
			</En>
			{e.celdaEditando && (() => {
				const x = r.x + COLUMNAS_FRASES.slice(0, 3).reduce((n, c) => n + c.ancho, 0);
				const y = r.y + 98 + filas.length * 42;
				return <En x={x} y={y} ancho={COLUMNAS_FRASES[3].ancho} alto={42} style={{ boxShadow: `inset 0 0 0 1.5px ${ACENTO}`, borderRadius: 2 }} />;
			})()}
		</Pagina>
	);
};

/* ════════════════════════════ CIUDADES ════════════════════════════ */

export interface EstadoCiudades {
	desplegable: number;
	resaltada: number | null;
	elegido: boolean;
	lista: number;
}

export const PantallaCiudades: React.FC<{ e: EstadoCiudades; opacidad?: number }> = ({ e, opacidad = 1 }) => (
	<Pagina opacidad={opacidad}>
		<En x={MAIN.x} y={MAIN.y} ancho={600}><H1>Ciudades y países</H1></En>
		<En x={CIUDADES.crearPais.x} y={CIUDADES.crearPais.y}><Boton texto="Crear país" icono="plus" ancho={CIUDADES.crearPais.ancho} /></En>
		<En x={CIUDADES.crearCiudad.x} y={CIUDADES.crearCiudad.y}><Boton texto="Crear ciudad o departamento" icono="plus" ancho={CIUDADES.crearCiudad.ancho} /></En>

		<En x={CIUDADES.pais.x} y={CIUDADES.pais.y - 30} ancho={CIUDADES.pais.ancho}>
			<Etiqueta texto="País" />
			<Campo valor="COLOMBIA" />
		</En>
		<En x={CIUDADES.departamento.x} y={CIUDADES.departamento.y - 30} ancho={CIUDADES.departamento.ancho}>
			<Etiqueta texto="Departamento" />
			<Selector valor={e.elegido ? DEPARTAMENTOS[EL_DEPARTAMENTO] : null} marcador="" abierto={e.desplegable > 0.5} />
		</En>

		<En x={CIUDADES.titulo.x} y={CIUDADES.titulo.y} style={{ fontSize: 20, fontWeight: 600, lineHeight: '32px' }}>Ciudad — Departamento</En>

		{!e.elegido && (
			<En x={CIUDADES.lista.x} y={CIUDADES.lista.y} style={{ fontSize: LETRA, color: TEXTO_TENUE }}>Elige un país y un departamento para ver sus ciudades.</En>
		)}
		{e.elegido && LAS_CIUDADES.map((c, i) => (
			<En key={c} x={CIUDADES.lista.x} y={CIUDADES.lista.y + i * FILA_CIUDAD} ancho={900} alto={FILA_CIUDAD} style={{ display: 'flex', alignItems: 'center', fontSize: LETRA, opacity: Math.min(1, Math.max(0, e.lista * 8 - i * 0.6)), borderBottom: '1px solid #f0f0f0' }}>
				<span style={{ width: ANCHO_NOMBRE_CIUDAD, flex: 'none' }}>{c}</span>
				<Redondo icono="edit" />
				<Redondo icono="delete" />
				<span style={{ width: ANCHO_DEPARTAMENTO, marginLeft: 8, flex: 'none', color: TEXTO_TENUE }}>({DEPARTAMENTOS[EL_DEPARTAMENTO]})</span>
				<Redondo icono="edit" />
			</En>
		))}

		{e.desplegable > 0.01 && (
			<En x={CIUDADES.departamento.x} y={CIUDADES.departamento.y + CIUDADES.departamento.alto + 4} style={{ zIndex: 5 }}>
				<Panel opciones={DEPARTAMENTOS.map((d) => ({ texto: d }))} resaltada={e.resaltada} ancho={CIUDADES.departamento.ancho} aparece={e.desplegable} />
			</En>
		)}
	</Pagina>
);

const Redondo: React.FC<{ icono: 'edit' | 'delete' }> = ({ icono }) => (
	<div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: 'rgba(0,0,0,0.65)' }}>
		<Icono cual={icono} tam={16} />
	</div>
);

/* ════════════════════════════ CALENDARIO ════════════════════════════ */

const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const VERDE = { fondo: '#f6ffed', borde: '#b7eb8f', letra: '#389e0d' };
const ORO = { fondo: '#fffbe6', borde: '#ffe58f', letra: '#ad6800' };
const AZUL = { fondo: '#e6f4ff', borde: '#91caff', letra: '#0958d9' };

const Pieza: React.FC<{ c: typeof VERDE; children: React.ReactNode }> = ({ c, children }) => (
	<div style={{ height: 22, marginTop: 3, padding: '0 7px', borderRadius: 4, background: c.fondo, border: `1px solid ${c.borde}`, color: c.letra, fontSize: 13, lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxSizing: 'border-box' }}>
		{children}
	</div>
);

export const PantallaCalendario: React.FC<{ opacidad?: number; encimaNuevo?: boolean }> = ({ opacidad = 1, encimaNuevo = false }) => (
	<Pagina opacidad={opacidad}>
		<En x={MAIN.x} y={MAIN.y} ancho={600}><H1><IconoCalendario />Calendario</H1></En>
		<En x={MAIN.x} y={MAIN.y + 42}><Gris>Los eventos del colegio y los cumpleaños.</Gris></En>

		<En x={MAIN.x} y={CALENDARIO.mesY} alto={32} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
			<FlechaMes giro={90} />
			<span style={{ fontSize: 20, fontWeight: 700, minWidth: 190, textAlign: 'center' }}>septiembre <span style={{ fontWeight: 400, color: TEXTO_TENUE }}>2026</span></span>
			<FlechaMes giro={-90} />
			<Boton texto="Hoy" pequeno tipo="text" />
		</En>
		<En x={CALENDARIO.nuevoEvento.x} y={CALENDARIO.nuevoEvento.y}><Boton texto="Nuevo evento" icono="plus" tipo="primary" ancho={CALENDARIO.nuevoEvento.ancho} encima={encimaNuevo} /></En>
		<En x={CALENDARIO.actualizar.x} y={CALENDARIO.actualizar.y}><Boton texto="Actualizar" icono="reload" tipo="text" ancho={CALENDARIO.actualizar.ancho} /></En>

		<En x={MAIN.x} y={CALENDARIO.diasY} ancho={MAIN.ancho} alto={30} style={{ display: 'flex' }}>
			{DIAS_SEMANA.map((d, i) => (
				<div key={d} style={{ width: CALENDARIO.celdaAncho, fontSize: 14, fontWeight: 600, color: i >= 5 ? TEXTO_TENUE : TEXTO, paddingLeft: 8, boxSizing: 'border-box' }}>{d}</div>
			))}
		</En>

		<En x={MAIN.x} y={CALENDARIO.rejillaY} ancho={MAIN.ancho} alto={CALENDARIO.celdaAlto * 6} style={{ border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
			{Array.from({ length: 42 }, (_, i) => {
				const septiembre = i >= 1 && i <= 30;
				const dia = i === 0 ? 31 : septiembre ? i : i - 30;
				const esHoy = septiembre && dia === HOY;
				const eventos = septiembre ? EVENTOS[dia] ?? [] : [];
				const cumples = septiembre ? CUMPLEANOS[dia] ?? 0 : 0;
				return (
					<div
						key={i}
						style={{
							height: CALENDARIO.celdaAlto - (i >= 35 ? 2 : 0),
							boxSizing: 'border-box',
							borderRight: i % 7 === 6 ? 'none' : '1px solid #f0f0f0',
							borderBottom: i >= 35 ? 'none' : '1px solid #f0f0f0',
							padding: '4px 6px',
							background: esHoy ? `${ACENTO}0d` : 'transparent',
							opacity: septiembre ? 1 : 0.45,
						}}
					>
						<div style={{ fontSize: 14, fontWeight: esHoy ? 700 : 500, width: 24, height: 22, lineHeight: '22px', textAlign: 'center', borderRadius: 11, background: esHoy ? ACENTO : 'transparent', color: esHoy ? '#fff' : TEXTO }}>{dia}</div>
						{cumples > 0 && <Pieza c={VERDE}>{cumples} cumpleaños</Pieza>}
						{eventos.map((ev) => <Pieza key={ev.titulo} c={ev.soloPersonal ? ORO : AZUL}>{ev.titulo}</Pieza>)}
					</div>
				);
			})}
		</En>

		<En x={MAIN.x} y={CALENDARIO.rejillaY + CALENDARIO.celdaAlto * 6 + 12} style={{ display: 'flex', gap: 22, fontSize: 14, color: TEXTO_TENUE }}>
			<Leyenda c={VERDE} texto="Cumpleaños" />
			<Leyenda c={AZUL} texto="Evento del colegio" />
			<Leyenda c={ORO} texto="Sólo personal" />
		</En>
	</Pagina>
);

const FlechaMes: React.FC<{ giro: number }> = ({ giro }) => (
	<div style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${BORDE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
		<Icono cual="flecha" tam={14} giro={giro} />
	</div>
);

const Leyenda: React.FC<{ c: typeof VERDE; texto: string }> = ({ c, texto }) => (
	<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
		<span style={{ width: 12, height: 12, borderRadius: 3, background: c.fondo, border: `1px solid ${c.borde}` }} />
		{texto}
	</span>
);

const IconoCalendario: React.FC = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={TEXTO} strokeWidth="1.8" strokeLinecap="round">
		<rect x="3.5" y="5" width="17" height="15" rx="2" />
		<path d="M3.5 10h17M8 3v4M16 3v4" />
	</svg>
);

/* ════════════════════════════ PUBLICACIONES ════════════════════════════ */

export interface EstadoMuro {
	editor: number;
	encimaEscribir: boolean;
}

export const PantallaMuro: React.FC<{ e: EstadoMuro; opacidad?: number }> = ({ e, opacidad = 1 }) => (
	<Pagina opacidad={opacidad}>
		<En x={MAIN.x} y={MAIN.y} ancho={600}><H1><IconoCampana />Publicaciones</H1></En>
		<En x={MAIN.x} y={MAIN.y + 42}><Gris>El muro del colegio. Lo que se publica aquí lo ven quienes se elija, y sale también en la pantalla de entrada.</Gris></En>
		<En x={MURO.escribir.x} y={MURO.escribir.y}><Boton texto="Escribir una publicación" icono="edit" tipo="primary" ancho={MURO.escribir.ancho} encima={e.encimaEscribir} /></En>
		<En x={MURO.recargar.x} y={MURO.recargar.y}><Boton texto="Recargar" icono="reload" ancho={MURO.recargar.ancho} /></En>

		{e.editor > 0.01 && (
			<En x={MURO.editor.x} y={MURO.editor.y} ancho={MURO.editor.ancho} alto={MURO.editor.alto} style={{ opacity: Math.min(1, e.editor * 1.4), transform: `translateY(${(1 - e.editor) * -10}px)` }}>
				<Editor />
			</En>
		)}

		<En x={MAIN.x} y={misPublicacionesY(e.editor)} alto={28} style={{ display: 'flex', alignItems: 'center', color: ACENTO, fontSize: LETRA }}>
			Ver mis publicaciones (2)
		</En>

		{PUBLICACIONES.map((p, i) => {
			const r = rectTarjeta(e.editor, i);
			return (
				<En key={p.autor} x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} style={{ border: `1px solid ${BORDE}`, borderRadius: 10, boxSizing: 'border-box', background: '#fff' }}>
					<div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
						<div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden' }}><Avatar tipo={p.tipo} variante={p.variante} tam={38} /></div>
						<div style={{ flex: 1 }}>
							<div style={{ fontSize: LETRA, fontWeight: 600 }}>{p.autor}</div>
							<div style={{ fontSize: 13, color: TEXTO_TENUE }}>{p.fecha}</div>
						</div>
						{p.dirigida && <span style={{ fontSize: 13, padding: '1px 8px', display: 'flex', alignItems: 'center', gap: 4, border: `1px solid ${BORDE}`, borderRadius: 4, background: '#fafafa' }}><Candado /> Dirigida</span>}
						<div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icono cual="delete" tam={17} color={PELIGRO} /></div>
					</div>
					<div style={{ padding: '4px 16px 0', fontSize: LETRA + 1, lineHeight: '24px', height: 64 }}>
						<b>{p.titulo}</b>: {p.texto}
					</div>
					<div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 12px', borderTop: '1px solid #f0f0f0', color: 'rgba(0,0,0,0.65)', fontSize: LETRA - 1, gap: 6 }}>
						<IconoMensaje /> {p.comentarios} comentarios
					</div>
				</En>
			);
		})}
	</Pagina>
);

const Editor: React.FC = () => (
	<div style={{ width: '100%', height: '100%', boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 10, padding: EDITOR.relleno, background: '#fcfcfd' }}>
		<div style={{ height: EDITOR.titulo, fontSize: 19, fontWeight: 600, lineHeight: '32px' }}>Nueva publicación</div>
		<div style={{ height: 8 }} />
		<div style={{ height: EDITOR.etiqueta, fontSize: LETRA }}>Contenido (admite etiquetas HTML: {'<b>'}, {'<a>'}…)</div>
		<div style={{ height: EDITOR.texto, border: `1px solid ${BORDE}`, borderRadius: 6, background: '#fff', padding: '6px 11px', boxSizing: 'border-box', color: 'rgba(0,0,0,0.3)', fontSize: LETRA }}>Escribe aquí la publicación…</div>
		<div style={{ height: 12 }} />
		<Boton texto="Añadir una imagen" icono="plus" />
		<div style={{ height: 16 }} />
		<div style={{ height: EDITOR.leyenda, fontSize: LETRA, fontWeight: 600 }}>¿Quién la ve?</div>
		<div style={{ height: EDITOR.radios, display: 'flex', gap: 22, alignItems: 'center', fontSize: LETRA }}>
			<Radio marcado texto="Todo el mundo" />
			<Radio marcado={false} texto="Sólo algunos" />
		</div>
		<div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
			<Boton texto="Cancelar" />
			<Boton texto="Publicar" tipo="primary" />
		</div>
	</div>
);

export const Radio: React.FC<{ marcado: boolean; texto: string }> = ({ marcado, texto }) => (
	<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
		<span style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${marcado ? ACENTO : BORDE}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
			{marcado && <span style={{ width: 8, height: 8, borderRadius: '50%', background: ACENTO }} />}
		</span>
		{texto}
	</span>
);

const IconoCampana: React.FC = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={TEXTO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
		<path d="M4 10v4h3l6 4V6L7 10H4zM16.5 9a4 4 0 0 1 0 6" />
	</svg>
);

const IconoMensaje: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
		<path d="M4 5h16v11H9l-5 4z" />
	</svg>
);

const Candado: React.FC = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
		<rect x="5" y="11" width="14" height="10" rx="2" />
		<path d="M8 11V8a4 4 0 0 1 8 0v3" />
	</svg>
);
