import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { En, Gris, H1, Pagina } from '../comun-directivo/Escenario';
import { MAIN } from '../comun-directivo/lugar';
import { AVISO_AMARILLO, Boton, Icono, LETRA, PELIGRO, Panel, Selector } from '../montar-el-ano/ant';
import {
	ALUMNO, ALUMNOS_DE_9B, BARRA_Y, COLUMNAS, CONTROLES_Y, COPIAR, DIALOGO, FILAS, FLECHA, LADO, MARCADAS, NOTA_MINIMA, PERIODO, PERIODOS, PIEZA, SE_CREAN, SE_PISAN,
	TABLA, UBICACIONES, rectAlumno, rectLado, rectPeriodo, type Estado, type Fila,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PROMOCIONAR NOTAS», con los textos de `promocionar-notas.html`, `lado-de-copia.html`,
 * `tabla-de-copia.html` y `confirmar-copia.ts`. No sabe de tiempo: recibe el estado.
 */

export interface EstadoPromocionar {
	desplegable: number;
	resaltada: number | null;
	/** 0 sin alumno; 1 elegido (las ubicaciones de los dos lados entran con este 0..1). */
	alumno: number;
	periodoOrigen: boolean;
	periodoDestino: boolean;
	/** La tabla, entrando. */
	tabla: number;
	encimaCopiar: boolean;
	/** El diálogo: 0..1 al abrir, y de vuelta a 0 al cerrar. */
	dialogo: number;
	encimaConfirmar: boolean;
	/** Las definitivas ya copiadas. */
	copiado: boolean;
	/** Una ubicación con el ratón encima. */
	encimaPeriodo: 'origen' | 'destino' | null;
}

const COLOR_ETIQUETA = {
	matriculado: { fondo: '#e6f4ff', borde: '#91caff', letra: '#0958d9' },
	'con notas': { fondo: '#fff7e6', borde: '#ffd591', letra: '#d46b08' },
};

const PILDORA: Record<Estado, { fondo: string; letra: string }> = {
	nueva: { fondo: '#f6ffed', letra: '#389e0d' },
	reemplaza: { fondo: '#fff7e6', letra: '#d46b08' },
	igual: { fondo: '#f5f5f5', letra: 'rgba(0,0,0,0.55)' },
	'sin-pareja': { fondo: '#fff1f0', letra: '#cf1322' },
};

const textoDe = (f: Fila, copiado: boolean) => {
	if (copiado && (f.estado === 'nueva' || f.estado === 'reemplaza')) { return 'Ya vale lo mismo'; }
	return f.estado === 'nueva' ? 'Se creará' : f.estado === 'reemplaza' ? `Reemplaza el ${f.destino}` : f.estado === 'igual' ? 'Ya vale lo mismo' : 'No existe en el destino';
};

const Marca: React.FC<{ marcada: boolean }> = ({ marcada }) => (
	<div style={{ width: 16, height: 16, borderRadius: 4, boxSizing: 'border-box', border: `1px solid ${marcada ? ACENTO : BORDE}`, background: marcada ? ACENTO : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		{marcada && <Icono cual="check" tam={12} color="#fff" />}
	</div>
);

const Lado: React.FC<{ lado: 'origen' | 'destino'; e: EstadoPromocionar }> = ({ lado, e }) => {
	const r = rectLado(lado);
	const origen = lado === 'origen';
	const elegido = origen ? e.periodoOrigen : e.periodoDestino;
	const cual = origen ? 1 : 0;
	return (
		<>
			<En x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} style={{ border: `1px solid ${BORDE}`, borderRadius: 10, boxSizing: 'border-box', background: '#fff' }}>
				<div style={{ height: PIEZA.cabecera, display: 'flex', alignItems: 'baseline', gap: 10, padding: '12px 16px 0', boxSizing: 'border-box' }}>
					<span style={{ fontSize: 17, fontWeight: 700 }}>{origen ? 'De aquí' : 'A aquí'}</span>
					<span style={{ fontSize: 14, color: elegido ? TEXTO : TEXTO_TENUE }}>{elegido ? `${UBICACIONES[cual].grupo} · 2026 · periodo ${PERIODO}` : 'sin elegir'}</span>
				</div>
			</En>
			<En x={r.x + PIEZA.grupo.dx} y={r.y + PIEZA.grupo.dy}><Selector valor="9B — 9°B" marcador="Grupo" ancho={PIEZA.grupo.ancho} /></En>
			<En x={r.x + PIEZA.alumno.dx} y={r.y + PIEZA.alumno.dy}>
				<Selector valor={e.alumno > 0 ? `${ALUMNO} (RETIRADO)` : null} marcador="Elige un alumno" abierto={origen && e.desplegable > 0.5} ancho={PIEZA.alumno.ancho} />
			</En>
			{e.alumno <= 0 && (
				<En x={r.x + 16} y={r.y + PIEZA.ubicaciones + 8} style={{ fontSize: 14, color: TEXTO_TENUE }}>Elige un grupo y un alumno para ver dónde tiene notas.</En>
			)}
			{e.alumno > 0 && UBICACIONES.map((u, i) => (
				<En key={u.grupo} x={r.x + 16} y={r.y + PIEZA.ubicaciones + i * PIEZA.ubicacion} ancho={r.ancho - 32} alto={PIEZA.ubicacion} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: LETRA, opacity: Math.min(1, e.alumno * 1.5 - i * 0.3), borderTop: i ? '1px solid #f0f0f0' : 'none' }}>
					<span style={{ color: TEXTO_TENUE }}>{u.anio}</span>
					<span style={{ fontWeight: 600 }}>{u.grupo}</span>
					<span style={{ fontSize: 12.5, padding: '0 7px', lineHeight: '20px', borderRadius: 4, border: `1px solid ${COLOR_ETIQUETA[u.etiqueta].borde}`, background: COLOR_ETIQUETA[u.etiqueta].fondo, color: COLOR_ETIQUETA[u.etiqueta].letra }}>{u.etiqueta}</span>
				</En>
			))}
			{e.alumno > 0 && UBICACIONES.map((u, i) => PERIODOS.map((p) => {
				const b = rectPeriodo(lado, i, p);
				const puesto = elegido && i === cual && p === PERIODO;
				const encima = e.encimaPeriodo === lado && i === cual && p === PERIODO;
				return (
					<En key={`${u.grupo}${p}`} x={b.x} y={b.y} ancho={b.ancho} alto={b.alto} style={{ borderRadius: 6, boxSizing: 'border-box', border: `1px solid ${puesto || encima ? ACENTO : BORDE}`, background: puesto ? ACENTO : '#fff', color: puesto ? '#fff' : encima ? ACENTO : TEXTO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, opacity: Math.min(1, e.alumno * 1.5 - i * 0.3) }}>
						{p}
					</En>
				);
			}))}
		</>
	);
};

export const PantallaPromocionar: React.FC<{ e: EstadoPromocionar; opacidad?: number }> = ({ e, opacidad = 1 }) => {
	const listos = e.periodoOrigen && e.periodoDestino;
	const columnas = COLUMNAS.map((c) => c.ancho);
	return (
		<Pagina opacidad={opacidad}>
			<En x={MAIN.x} y={MAIN.y} ancho={700}><H1>Promocionar notas</H1></En>
			<En x={MAIN.x} y={MAIN.y + 42}><Gris>Copia las definitivas de un periodo a otro: del mismo alumno o de otro, y de una matrícula a otra.</Gris></En>

			<Lado lado="origen" e={e} />
			<Lado lado="destino" e={e} />
			<En x={FLECHA.x} y={LADO.arriba + 70} ancho={FLECHA.ancho} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: TEXTO_TENUE }}>
				<Icono cual="flecha" tam={30} giro={-90} />
				<span style={{ fontSize: 13, color: ACENTO }}>Intercambiar</span>
			</En>

			{!listos && e.alumno > 0 && (
				<En x={MAIN.x} y={CONTROLES_Y + 8} style={{ fontSize: 14.5, color: TEXTO_TENUE }}>
					{e.periodoOrigen ? 'Falta el periodo de la derecha: ahí es donde se van a escribir.' : 'Elige en cada lado un alumno y el periodo cuyas notas quieres mover.'}
				</En>
			)}

			{listos && (
				<div style={{ opacity: e.tabla }}>
					<En x={MAIN.x} y={CONTROLES_Y} alto={32} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, color: '#ad6800' }}>
						<Icono cual="alerta" tam={16} color={AVISO_AMARILLO.icono} />1 materia sin pareja en el destino
					</En>
					<En x={MAIN.x + MAIN.ancho - 230} y={CONTROLES_Y}><Boton texto="Editar también el origen" icono="edit" tipo="text" /></En>

					<En x={TABLA.x} y={TABLA.y} ancho={TABLA.ancho} style={{ border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
						<div style={{ display: 'flex', height: TABLA.cabecera, background: '#fafafa', borderBottom: `1px solid ${BORDE}`, fontSize: 14, fontWeight: 600, alignItems: 'center' }}>
							{COLUMNAS.map((c, i) => (
								<div key={c.clave} style={{ width: columnas[i], padding: '0 12px', boxSizing: 'border-box', textAlign: c.clave === 'origen' || c.clave === 'destino' ? 'right' : 'left' }}>
									{c.clave === 'marca' ? <Marca marcada={!e.copiado} /> : c.titulo}
								</div>
							))}
						</div>
						{FILAS.map((f) => {
							const copiable = f.estado === 'nueva' || f.estado === 'reemplaza';
							const marcada = copiable && !e.copiado;
							const destino = e.copiado && copiable ? f.origen : f.destino;
							const gris = f.estado === 'sin-pareja';
							const pild = PILDORA[e.copiado && copiable ? 'igual' : f.estado];
							return (
								<div key={f.materia} style={{ display: 'flex', height: TABLA.fila, alignItems: 'center', borderBottom: '1px solid #f0f0f0', fontSize: 14.5, background: marcada ? `${ACENTO}0b` : 'transparent', color: gris ? 'rgba(0,0,0,0.4)' : TEXTO }}>
									<div style={{ width: columnas[0], padding: '0 14px', boxSizing: 'border-box' }}>{marcada && <Marca marcada />}</div>
									<div style={{ width: columnas[1], padding: '0 12px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
										<span style={{ fontWeight: 600 }}>{f.materia}</span>
										<span style={{ fontSize: 12, color: TEXTO_TENUE, display: 'flex', alignItems: 'center', gap: 5 }}>
											<span style={{ width: 14, height: 14, borderRadius: 7, overflow: 'hidden', display: 'inline-block' }}><Avatar tipo={f.tipo} variante={f.variante} tam={14} /></span>
											{f.docente}
										</span>
									</div>
									<div style={{ width: columnas[2], padding: '0 12px', boxSizing: 'border-box', textAlign: 'right', fontWeight: 600, color: f.origen < NOTA_MINIMA && !gris ? PELIGRO : undefined }}>{f.origen}</div>
									<div style={{ width: columnas[3], display: 'flex', justifyContent: 'center' }}>
										{marcada && <span style={{ width: 26, height: 26, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACENTO }}><Icono cual="flecha" tam={16} giro={-90} /></span>}
									</div>
									<div style={{ width: columnas[4], padding: '0 12px', boxSizing: 'border-box', textAlign: 'right', fontWeight: 600, color: destino !== null && destino < NOTA_MINIMA ? PELIGRO : undefined }}>{destino ?? '—'}</div>
									<div style={{ width: columnas[5], padding: '0 12px', boxSizing: 'border-box' }}>{destino !== null && <Marca marcada={e.copiado && copiable} />}</div>
									<div style={{ width: columnas[6], padding: '0 12px', boxSizing: 'border-box' }}>{destino !== null && <Marca marcada={false} />}</div>
									<div style={{ width: columnas[7], padding: '0 12px', boxSizing: 'border-box' }}>
										<span style={{ fontSize: 13, padding: '2px 10px', borderRadius: 11, background: pild.fondo, color: pild.letra, fontWeight: 600 }}>{textoDe(f, e.copiado)}</span>
									</div>
								</div>
							);
						})}
					</En>

					<En x={MAIN.x} y={BARRA_Y} ancho={MAIN.ancho} alto={48} style={{ display: 'flex', alignItems: 'center', fontSize: 15, borderTop: `1px solid ${BORDE}` }}>
						{e.copiado ? <span style={{ color: TEXTO_TENUE }}>Nada marcado</span> : (
							<span><b>{MARCADAS.length}</b> marcadas · {SE_CREAN} se crean · <span style={{ color: '#d46b08' }}>{SE_PISAN} pisa una nota puesta</span></span>
						)}
					</En>
					<En x={COPIAR.x} y={COPIAR.y}>
						<div style={{ width: COPIAR.ancho, height: COPIAR.alto, borderRadius: 8, background: e.copiado ? 'rgba(0,0,0,0.04)' : e.encimaCopiar ? '#4096ff' : ACENTO, color: e.copiado ? 'rgba(0,0,0,0.25)' : '#fff', border: e.copiado ? `1px solid ${BORDE}` : 'none', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16 }}>
							<Icono cual="flecha" tam={16} giro={-90} />Copiar al destino
						</div>
					</En>
				</div>
			)}

			{e.desplegable > 0.01 && (() => {
				const a = rectAlumno('origen');
				return (
					<En x={a.x} y={a.y + a.alto + 4} style={{ zIndex: 5 }}>
						<Panel opciones={ALUMNOS_DE_9B.map((t) => ({ texto: t }))} resaltada={e.resaltada} ancho={a.ancho} aparece={e.desplegable} />
					</En>
				);
			})()}
		</Pagina>
	);
};

/** El diálogo de `confirmar-copia.ts`, con su máscara. Va encima de la cáscara, en sus coordenadas. */
export const DialogoCopia: React.FC<{ t: number; encima: boolean }> = ({ t, encima }) => {
	if (t <= 0.001) { return null; }
	const lado = (rotulo: string, grupo: string) => (
		<div style={{ flex: 1 }}>
			<div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.8, color: TEXTO_TENUE }}>{rotulo}</div>
			<div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{ALUMNO}</div>
			<div style={{ fontSize: 14, color: TEXTO_TENUE }}>{grupo} · 2026</div>
			<div style={{ fontSize: 14 }}>Periodo {PERIODO}</div>
		</div>
	);
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 8 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: t, borderRadius: 12 }} />
			<div style={{ position: 'absolute', left: DIALOGO.x, top: DIALOGO.y, width: DIALOGO.ancho, height: DIALOGO.alto, boxSizing: 'border-box', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)', opacity: t, transform: `scale(${0.92 + 0.08 * t})`, color: TEXTO }}>
				<div style={{ fontSize: 17, fontWeight: 600 }}>Copiar las definitivas marcadas</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, padding: 14, border: `1px solid ${BORDE}`, borderRadius: 8, background: '#fafafa' }}>
					{lado('DE AQUÍ', '9°B')}
					<Icono cual="flecha" tam={22} giro={-90} color={TEXTO_TENUE} />
					{lado('A AQUÍ', '9°A')}
				</div>
				<ul style={{ margin: '18px 0 0', paddingLeft: 22, fontSize: 15, lineHeight: '26px' }}>
					<li><b>{SE_CREAN}</b> definitivas que no existían: se crean.</li>
					<li style={{ color: '#ad6800' }}><b>{SE_PISAN}</b> definitiva que ya tenía nota: <b>se pisa</b>, y no hay vuelta atrás.</li>
				</ul>
				<div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', gap: 8 }}>
					<Boton texto="Cancelar" />
					<div style={{ width: 150, height: 32, borderRadius: 6, background: encima ? '#4096ff' : ACENTO, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: LETRA }}>
						<Icono cual="flecha" tam={15} giro={-90} />Copiar {MARCADAS.length} notas
					</div>
				</div>
			</div>
		</div>
	);
};
