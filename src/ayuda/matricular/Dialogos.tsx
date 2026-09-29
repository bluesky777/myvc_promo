import React from 'react';

import { Boton, Icono, Panel, Selector, type Opcion } from '../montar-el-ano/ant';
import { DOCENTES, type ClaveDocente } from '../montar-el-ano/reparto';
import {
	ACENTO, ALTO_TITULO_DIALOGO, BORDE, Dialogo, LETRA, RELLENO_DIALOGO, TEXTO, TEXTO_TENUE, anchoDeBoton, botonesDelPie, cajaCentrada, type Rect,
} from '../secretaria/piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS DOS DIÁLOGOS DE CAMBIAR DE GRUPO, tal como salen desde Personas ▸ Alumnos:
 *
 *   «2026 — Matricular en…»   `paginas/matriculas/matricular-en.html`
 *   «Deja notas en 9°A»        `paginas/matriculas/traer-notas.ts`, que abre `panel-alumnos.ts:993`
 *                              SÓLO si el grupo cambió y quedan definitivas en el viejo.
 *
 * En coordenadas de la cáscara, encima de todo. No saben de tiempo.
 */

/* ── «Matricular en…» ─────────────────────────────────────────────────────────────────────── */

export const CAJA_EN = cajaCentrada(540, 466);
const CUERPO_EN = CAJA_EN.y + ALTO_TITULO_DIALOGO + 18;
export const PIE_EN = botonesDelPie(CAJA_EN, [{ texto: 'Cerrar' }, { texto: 'Matricular' }]);

export const rectSelectorEn = (): Rect => ({ x: CAJA_EN.x + RELLENO_DIALOGO, y: CUERPO_EN + 58, ancho: CAJA_EN.ancho - RELLENO_DIALOGO * 2, alto: 32 });

const INTERRUPTORES: [string, boolean][] = [
	['¿Es Repitente en este año?', false],
	['¿Es Nuevo en este año?', false],
	['¿Es Egresado de la institución?', false],
	['¿Activo?', true],
	['Crear matrícula', false],
];

export interface EstadoMatricularEn {
	t: number;
	sale?: number;
	grupo: { nombre: string; titular: ClaveDocente };
	abierto?: { busqueda: string; cursor: boolean; opciones: Opcion[]; resaltada: number | null; aparece: number } | null;
	encimaMatricular?: boolean;
	cargando?: boolean;
	giro?: number;
}

export const DialogoMatricularEn: React.FC<{ id: number; nombre: string; estado: EstadoMatricularEn }> = ({ id, nombre, estado: e }) => {
	const sel = rectSelectorEn();
	return (
		<Dialogo
			caja={CAJA_EN}
			titulo="2026 — Matricular en…"
			t={e.t}
			sale={e.sale}
			pie={
				<>
					<div style={{ position: 'absolute', left: PIE_EN[0].x - CAJA_EN.x, top: 14 }}><Boton texto="Cerrar" ancho={PIE_EN[0].ancho} /></div>
					<div style={{ position: 'absolute', left: PIE_EN[1].x - CAJA_EN.x, top: 14 }}>
						<Boton texto="Matricular" tipo="primary" ancho={PIE_EN[1].ancho} encima={e.encimaMatricular} cargando={e.cargando} giroCarga={e.giro ?? 0} />
					</div>
				</>
			}
		>
			<div style={{ display: 'flex', alignItems: 'baseline', gap: 10, height: 22 }}>
				<span style={{ fontSize: LETRA - 2, color: TEXTO_TENUE }}>Id: {id}</span>
				<b style={{ fontSize: LETRA + 1 }}>{nombre}</b>
			</div>
			<div style={{ position: 'absolute', top: 18 + 34, left: RELLENO_DIALOGO, fontSize: LETRA }}>Grupo en el cual matricular</div>
			<div style={{ position: 'absolute', top: 18 + 102, left: RELLENO_DIALOGO, fontSize: LETRA - 1.5, color: 'rgba(0,0,0,0.55)' }}>
				Los cuatro interruptores se guardan al pulsarlos y cierran esta ventana.
			</div>
			{INTERRUPTORES.map(([texto, si], i) => (
				<div
					key={texto}
					style={{ position: 'absolute', top: 18 + 130 + i * 36, left: RELLENO_DIALOGO, right: RELLENO_DIALOGO, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: LETRA }}
				>
					<span>{texto}</span>
					<Boton texto={si ? 'Sí' : 'No'} pequeno tipo={si ? 'primary' : 'default'} ancho={44} />
				</div>
			))}
			{/* El desplegable va encima de los interruptores: se pinta el último. */}
			<div style={{ position: 'absolute', top: sel.y - CAJA_EN.y - ALTO_TITULO_DIALOGO, left: RELLENO_DIALOGO, width: sel.ancho }}>
				<Selector
					marcador="Grupo a matricular"
					valor={e.grupo.nombre}
					cara={e.grupo.titular}
					detras={DOCENTES[e.grupo.titular].nombre}
					abierto={Boolean(e.abierto)}
					busqueda={e.abierto ? e.abierto.busqueda : null}
					cursor={e.abierto?.cursor}
					ancho={sel.ancho}
				/>
				{e.abierto && (
					<div style={{ marginTop: 4 }}>
						<Panel opciones={e.abierto.opciones} resaltada={e.abierto.resaltada} ancho={sel.ancho} aparece={e.abierto.aparece} />
					</div>
				)}
			</div>
		</Dialogo>
	);
};

/* ── «Deja notas en…» ─────────────────────────────────────────────────────────────────────── */

export const CAJA_NOTAS = cajaCentrada(620, 470);
export const PIE_NOTAS = (n: number) => botonesDelPie(CAJA_NOTAS, [{ texto: 'Dejarlas donde están' }, { texto: `Traer las ${n}` }]);
const CUERPO_NOTAS = CAJA_NOTAS.y + ALTO_TITULO_DIALOGO + 18;
/** La parte que explica: el párrafo, la cifra y el periodo. */
export const rectExplicacion = (): Rect => ({ x: CAJA_NOTAS.x + RELLENO_DIALOGO - 6, y: CUERPO_NOTAS - 6, ancho: CAJA_NOTAS.ancho - RELLENO_DIALOGO * 2 + 12, alto: 66 + 14 + 62 + 12 });

export interface EstadoTraerNotas {
	t: number;
	sale?: number;
	cargando: boolean;
	giro: number;
	contenido: number;
	encimaTraer?: boolean;
	trayendo?: boolean;
}

export const DialogoTraerNotas: React.FC<{ nombre: string; origen: string; destino: string; notas: number; estado: EstadoTraerNotas }> = ({
	nombre, origen, destino, notas, estado: e,
}) => {
	const pie = PIE_NOTAS(notas);
	const zona = { padding: '8px 12px', borderRadius: 6, border: `1px solid #f0f0f0`, background: '#fafafa' };
	return (
		<Dialogo
			caja={CAJA_NOTAS}
			titulo={`Deja notas en ${origen}`}
			t={e.t}
			sale={e.sale}
			pie={
				<>
					<div style={{ position: 'absolute', left: pie[0].x - CAJA_NOTAS.x, top: 14 }}><Boton texto="Dejarlas donde están" ancho={pie[0].ancho} /></div>
					<div style={{ position: 'absolute', left: pie[1].x - CAJA_NOTAS.x, top: 14 }}>
						<Boton
							texto={e.trayendo ? 'Trayendo…' : `Traer las ${notas}`}
							tipo="primary"
							ancho={pie[1].ancho}
							encima={e.encimaTraer}
							cargando={e.trayendo}
							giroCarga={e.giro}
						/>
					</div>
				</>
			}
		>
			{e.cargando ? (
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, color: TEXTO_TENUE }}>
					<Icono cual="cargando" tam={18} color={ACENTO} giro={e.giro} />
					Mirando qué notas se quedan atrás…
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 14, opacity: e.contenido }}>
					<div style={{ lineHeight: '22px', height: 66 }}>
						<b>{nombre}</b> ya no aparece en el boletín de {origen}, y en {destino} esos periodos saldrían <b>en blanco</b>. Las notas no se han borrado:
						están donde se pusieron.
					</div>
					<div style={{ ...zona, height: 62, boxSizing: 'border-box', display: 'flex', alignItems: 'baseline', gap: 10, padding: '12px 16px' }}>
						<span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{notas}</span>
						<span>de {notas} definitivas se traerían</span>
					</div>
					<div style={{ ...zona, height: 38, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10 }}>
						<div style={{ width: 16, height: 16, borderRadius: 4, background: ACENTO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Icono cual="check" tam={12} color="#fff" />
						</div>
						<b>2026 · Periodo 1</b>
						<span style={{ color: TEXTO_TENUE, fontSize: LETRA - 1 }}>{notas} notas</span>
					</div>
					<div style={{ ...zona, background: '#f6ffed', border: '1px solid #b7eb8f', color: '#237804', display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA - 1 }}>
						<Icono cual="bien" tam={15} color="#52c41a" />
						La nota de comportamiento no se toca: va por periodo y sigue al alumno.
					</div>
					<div style={{ ...zona, color: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA - 1 }}>
						<Icono cual="info" tam={15} color={TEXTO_TENUE} />
						Se traen sólo las definitivas. El detalle de unidades y subunidades se queda en {origen}.
					</div>
				</div>
			)}
		</Dialogo>
	);
};

export { BORDE, TEXTO, anchoDeBoton };
