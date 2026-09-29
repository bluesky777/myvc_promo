import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO } from '../../notas/tema';
import { Alerta, Casilla, Desplegable, IconoEngranaje, ListaDesplegada, PALETA } from '../ant';
import { IconoLapiz, IconoMas, IconoPapelera, IconoRecargar } from '../disciplina/Rejilla';
import { Rejilla, altoDeLaRejilla } from '../montar-el-ano/Rejilla';
import { BotonAnt } from '../sin-internet/Bajar';
import { ACCIONES, ANIOS, CFG, COLUMNAS, CONFIG, EL_NUEVO, LA_CORREGIDA, MOTIVO, O, ORDINALES, OrdinalDibujado, bajada, yConfig, yRejilla } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ORDINALES DEL MANUAL DE CONVIVENCIA» (`app2/.../ordinales/ordinales.html`).
 *
 * Tal cual: el título; «Año» con su desplegable, «Recargar», «Crear ordinal» (apagado en un año
 * cerrado) y «Configurar comportamiento»; la alerta «Año cerrado: sólo consulta»; la ficha «Nuevo
 * ordinal» con Ordinal, Página / Párrafo, Tipo y Descripción, y «Crear» / «Ocultar»; la pista «Haz
 * clic en una celda para editarla. Se guarda al salir.»; la rejilla (AG Grid, como la dibuja
 * `montar-el-ano/Rejilla`) con los botones de editar y eliminar; y debajo, al abrirla, la
 * configuración de convivencia con sus tres bloques.
 */

export interface EstadoOrdinales {
	anio: string;
	listaAnios: boolean;
	encimaAnio: number | null;
	soloLectura: boolean;
	creando: boolean;
	/** Lo tecleado en la ficha de crear. */
	nuevo: { ordinal: string; tipo: string; descripcion: string; foco: 'ordinal' | 'tipo' | 'descripcion' | null };
	/** Si el nuevo ya está en la rejilla. */
	creado: boolean;
	/** La celda que se está editando, con lo que lleva escrito, o `null`. */
	editando: string | null;
	corregida: boolean;
	verConfig: boolean;
	tardanzas: string;
	focoTardanzas: boolean;
	scroll: number;
	encima: string | null;
}

const TITULO = 4;

export const PantallaOrdinales: React.FC<{ e: EstadoOrdinales }> = ({ e }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const texto = 'Ordinales del manual de convivencia';
	const cursorTitulo = escribiendo(frame, texto, TITULO, 1) && frame % 20 < 12;
	const acciones = llega(frame, fps, 0, TITULO + 20, 0);
	const rejilla = llega(frame, fps, 0, TITULO + 30, 0);
	const yR = yRejilla(e.soloLectura, e.creando);

	/* El año cerrado trae su propia lista: la de siempre, sin lo que se tocó hoy en el año en curso. */
	const hoy = e.anio === ANIOS[0];
	const filas: OrdinalDibujado[] = ORDINALES.map((o, i) => (hoy && i === LA_CORREGIDA.fila && e.corregida ? { ...o, pagina: LA_CORREGIDA.valor } : o));
	if (hoy && e.creado) { filas.push(EL_NUEVO); }

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', color: TEXTO }}>
			<div style={{ position: 'absolute', left: 0, top: -e.scroll, width: '100%', height: 1600 }}>
				<div style={{ position: 'absolute', left: O.lados, top: O.arriba, height: 40, display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 600, whiteSpace: 'pre' }}>
					{escrito(frame, texto, TITULO, 1)}
					<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
				</div>

				{/* Las acciones: al no caber junto al título, bajan a su propia línea (`flex-wrap`). */}
				<div style={{ position: 'absolute', left: O.lados, top: O.yAcciones, width: O.ancho, height: O.alto, opacity: acciones.opacidad, transform: `translateY(${acciones.y}px)` }}>
					<span style={{ position: 'absolute', left: 0, top: 0, height: O.alto, display: 'flex', alignItems: 'center', fontSize: 16 }}>Año</span>
					<div style={{ position: 'absolute', left: ACCIONES.anio.x, top: 0 }}>
						<Desplegable valor={e.anio} ancho={ACCIONES.anio.ancho} alto={O.alto} tam={16} abierto={e.listaAnios} senalado={e.encima === 'anio'} />
					</div>
					<div style={{ position: 'absolute', left: ACCIONES.recargar.x, top: 0 }}><BotonAnt ancho={ACCIONES.recargar.ancho} icono={<IconoRecargar />} tam={16}>Recargar</BotonAnt></div>
					<div style={{ position: 'absolute', left: ACCIONES.crear.x, top: 0 }}><BotonAnt primario={!e.soloLectura} apagado={e.soloLectura} encima={e.encima === 'crear'} ancho={ACCIONES.crear.ancho} icono={<IconoMas />} tam={16}>Crear ordinal</BotonAnt></div>
					<div style={{ position: 'absolute', left: ACCIONES.configurar.x, top: 0 }}><BotonAnt encima={e.encima === 'configurar'} ancho={ACCIONES.configurar.ancho} icono={<IconoEngranaje />} tam={16}>Configurar comportamiento</BotonAnt></div>
				</div>

				{e.soloLectura && (
					<div style={{ position: 'absolute', left: O.lados, top: O.yVariable, width: O.ancho }}>
						<Alerta tono="info" tam={16} titulo="Año cerrado: sólo consulta" texto={MOTIVO} />
					</div>
				)}

				{e.creando && <FichaNueva e={e} y={O.yVariable + (e.soloLectura ? O.alerta : 0)} />}

				<div style={{ position: 'absolute', left: O.lados, top: O.yVariable + bajada(e.soloLectura, e.creando), fontSize: 15, color: 'rgba(128,128,128,1)', opacity: rejilla.opacidad }}>
					Haz clic en una celda para editarla. Se guarda al salir.
				</div>
				<div style={{ position: 'absolute', left: O.lados, top: yR, opacity: rejilla.opacidad, transform: `translateY(${rejilla.y}px)` }}>
					<Rejilla
						columnas={COLUMNAS}
						ancho={O.ancho}
						alto={altoDeLaRejilla(filas.length)}
						filas={filas.map((o, i) => ({
							clave: `${o.tipo}-${o.ordinal}`,
							celdas: {
								editar: <BotonCelda><IconoLapiz /></BotonCelda>,
								borrar: <BotonCelda peligro><IconoPapelera /></BotonCelda>,
								tipo: o.tipo,
								ordinal: o.ordinal,
								descripcion: <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.descripcion}</span>,
								pagina: i === LA_CORREGIDA.fila && e.editando !== null
									? <EditorDeCelda texto={e.editando} />
									: o.pagina,
							},
						}))}
					/>
				</div>

				{e.verConfig && <Configuracion e={e} y={yConfig(e.soloLectura, e.creando)} />}
			</div>

			{e.listaAnios && (
				<div style={{ position: 'absolute', left: O.lados + ACCIONES.anio.x, top: O.yAcciones + O.alto + 4 - e.scroll, zIndex: 10 }}>
					<ListaDesplegada opciones={ANIOS} ancho={ACCIONES.anio.ancho} marcada={ANIOS.indexOf(e.anio)} encima={e.encimaAnio} tam={16} />
				</div>
			)}
		</div>
	);
};

const BotonCelda: React.FC<{ peligro?: boolean; children: React.ReactNode }> = ({ peligro = false, children }) => (
	<span style={{ width: 30, height: 26, borderRadius: 4, border: `1px solid ${peligro ? '#ffccc7' : BORDE}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: peligro ? PALETA.peligro : TEXTO, background: '#fff' }}>{children}</span>
);

const EditorDeCelda: React.FC<{ texto: string }> = ({ texto }) => {
	const frame = useCurrentFrame();
	return (
		<span style={{ display: 'flex', alignItems: 'center', width: '100%', height: 34, boxSizing: 'border-box', border: `1.5px solid ${ACENTO}`, borderRadius: 3, padding: '0 8px', background: '#fff', whiteSpace: 'pre' }}>
			{texto}<span style={{ opacity: frame % 30 < 16 ? 1 : 0 }}>|</span>
		</span>
	);
};

const Etiqueta: React.FC<{ children: React.ReactNode; obligatorio?: boolean }> = ({ children, obligatorio = false }) => (
	<div style={{ height: 24, fontSize: 15, color: TEXTO }}>{obligatorio && <span style={{ color: PALETA.peligro, marginRight: 4 }}>*</span>}{children}</div>
);

const Campo: React.FC<{ valor: string; foco?: boolean; ancho: number | string; alto?: number }> = ({ valor, foco = false, ancho, alto = 36 }) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ width: ancho, height: alto, boxSizing: 'border-box', border: `1px solid ${foco ? ACENTO : BORDE}`, boxShadow: foco ? `0 0 0 2px ${ACENTO}22` : 'none', borderRadius: 6, background: SUPERFICIE, display: 'flex', alignItems: alto > 40 ? 'flex-start' : 'center', padding: alto > 40 ? '7px 11px' : '0 11px', fontSize: 16, whiteSpace: 'pre', overflow: 'hidden' }}>
			{valor}{foco && <span style={{ opacity: frame % 30 < 16 ? 1 : 0 }}>|</span>}
		</div>
	);
};

const FichaNueva: React.FC<{ e: EstadoOrdinales; y: number }> = ({ e, y }) => {
	const n = e.nuevo;
	return (
		<div style={{ position: 'absolute', left: O.lados, top: y, width: O.ancho, height: O.ficha - 14, boxSizing: 'border-box', padding: 16, borderRadius: 8, background: 'rgba(128,128,128,.08)' }}>
			<div style={{ fontSize: 19, fontWeight: 600, height: 30 }}>Nuevo ordinal</div>
			<div style={{ display: 'flex', gap: 12, marginTop: 0 }}>
				<div style={{ flex: 1 }}><Etiqueta>Ordinal</Etiqueta><Campo valor={n.ordinal} foco={n.foco === 'ordinal'} ancho="100%" /></div>
				<div style={{ flex: 1 }}><Etiqueta>Página / Párrafo</Etiqueta><Campo valor="" ancho="100%" /></div>
				<div style={{ flex: 1 }}><Etiqueta>Tipo</Etiqueta><Campo valor={n.tipo} foco={n.foco === 'tipo'} ancho="100%" /></div>
			</div>
			<div style={{ marginTop: 6 }}>
				<Etiqueta obligatorio>Descripción</Etiqueta>
				<Campo valor={n.descripcion} foco={n.foco === 'descripcion'} ancho="100%" alto={54} />
			</div>
			<div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', gap: 10 }}>
				<BotonAnt primario apagado={e.soloLectura} ancho={90} alto={36} encima={e.encima === 'crear-ficha'} tam={16}>Crear</BotonAnt>
				<BotonAnt ancho={100} alto={36} encima={e.encima === 'ocultar'} tam={16}>Ocultar</BotonAnt>
			</div>
		</div>
	);
};

const Configuracion: React.FC<{ e: EstadoOrdinales; y: number }> = ({ e, y }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, 0, 14);
	const h3 = (t: string, top: number) => <div style={{ position: 'absolute', left: CFG.relleno, top, fontSize: 17, fontWeight: 600 }}>{t}</div>;
	const rejilla = (campos: string[][], top: number, valor?: (i: number) => string, foco?: (i: number) => boolean) => campos.map(([etiqueta, v], i) => (
		<div key={etiqueta} style={{ position: 'absolute', left: CFG.relleno + (i % CFG.columnas) * (CFG.anchoCampo + CFG.hueco), top: top + Math.floor(i / CFG.columnas) * (CFG.fila2 - CFG.fila1), width: CFG.anchoCampo }}>
			<Etiqueta>{etiqueta}</Etiqueta>
			<Campo valor={valor ? valor(i) : v} foco={foco ? foco(i) : false} ancho="100%" />
		</div>
	));
	return (
		<div style={{ position: 'absolute', left: O.lados, top: y, width: O.ancho, height: CFG.alto, borderRadius: 8, background: 'rgba(128,128,128,.08)', opacity: a }}>
			<div style={{ position: 'absolute', left: CFG.relleno, top: CFG.h2, fontSize: 19, fontWeight: 600 }}>Configuración de coordinación de convivencia</div>
			<div style={{ position: 'absolute', left: CFG.relleno, top: CFG.casilla, display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}><Casilla marcada={false} tam={18} />Reinicia cada periodo</div>
			{h3('Cómo se llama cada tipo de falta', CFG.h3Nombres)}
			{rejilla(CONFIG.nombres, CFG.fila1)}
			{h3('Cuántas hacen falta para pasar al siguiente tipo', CFG.h3Cuantas)}
			{rejilla(CONFIG.cuantas, CFG.filaCuantas, (i) => (i === 0 ? e.tardanzas : CONFIG.cuantas[i][1]), (i) => i === 0 && e.focoTardanzas)}
			{h3('Las columnas del libro rojo', CFG.h3Libro)}
			<div style={{ position: 'absolute', left: CFG.relleno, top: CFG.pistaLibro, fontSize: 15, color: 'rgba(128,128,128,1)' }}>Son las columnas en las que cada titular podrá escribir.</div>
			{rejilla(CONFIG.libroRojo, CFG.filaLibro)}
		</div>
	);
};
