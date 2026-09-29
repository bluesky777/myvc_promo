import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ALUMNOS, EL_PERIODO, LA_FILA, type Uniforme } from './datos';
import { U } from './dialogo';
import { Boton, Etiqueta, IconoLapiz, IconoMas, IconoPapelera, IconoVisto } from './Rejilla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL DIÁLOGO DE UNIFORME (`UniformesModal` de app2). Se abre pulsando el DETALLE de uniforme de la
 * celda, no con el «+» (que es sólo de situaciones). «+ Agregar falla de uniforme» abre el
 * formulario encima de la lista; «Guardar» la añade **sin aviso**, y «Aceptar» cierra y devuelve el
 * alumno a la rejilla.
 */

export const MOTIVOS = ['Sin cámara', 'Contrario', 'Sin uniforme', 'Incompleto', 'Cabello', 'Accesorios'];
export const ANCHO_MOTIVO = 134;

export interface GuionDeUniformes {
	abre: number;
	cierra: number;
	agregaEn: number;
	marcaEn: number;
	/** El motivo que se marca (índice en `MOTIVOS`). */
	motivo: number;
	guardaEn: number;
	antes: Uniforme[];
	nuevo: Uniforme;
	senalado?: (frame: number) => string | null;
}

/** En coordenadas del fotograma. */
export const PIEZAS_UNIFORME = {
	agregar: { x: U.x + 24, y: U.y + U.agregar, ancho: 300, alto: 38 },
	motivo: (i: number) => ({ x: U.x + 24 + i * ANCHO_MOTIVO, y: U.y + U.checks, ancho: ANCHO_MOTIVO - 8, alto: 30 }),
	guardar: { x: U.x + U.ancho - 24 - 110, y: U.y + U.botones, ancho: 110, alto: 38 },
	aceptar: { x: U.x + U.ancho - 24 - 124, y: U.y + U.alto - 52, ancho: 124, alto: 38 },
	lista: (creando: boolean) => ({ x: U.x + 24, y: U.y + (creando ? U.lista : U.agregar + 54), ancho: U.ancho - 48, alto: U.fila * 3 }),
};

export const UniformesModal: React.FC<{ g: GuionDeUniformes }> = ({ g }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame < g.abre - 1 || frame > g.cierra + 16) { return null; }

	const abre = entra(frame, fps, g.abre, 14);
	const cierra = interpolate(frame, [g.cierra, g.cierra + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const vivo = abre * (1 - cierra);
	const creando = frame >= g.agregaEn && frame < g.guardaEn;
	const marcado = frame >= g.marcaEn;
	const lista = frame >= g.guardaEn ? [...g.antes, g.nuevo] : g.antes;
	const sen = g.senalado?.(frame) ?? null;
	const alumno = ALUMNOS[LA_FILA];
	const yLista = creando ? U.lista : U.agregar + 54;

	return (
		<AbsoluteFill style={{ zIndex: 10 }}>
			<AbsoluteFill style={{ background: 'rgba(9, 17, 33, .45)', opacity: vivo }} />
			<div
				style={{
					position: 'absolute', left: U.x, top: U.y, width: U.ancho, height: U.alto, borderRadius: 12, background: SUPERFICIE,
					boxShadow: '0 32px 90px rgba(9, 17, 33, .34)', opacity: vivo, color: TEXTO,
					transform: `scale(${interpolate(abre, [0, 1], [0.94, 1]) * (1 - cierra * 0.03)})`,
				}}
			>
				<div style={{ position: 'absolute', top: 24, left: 24, fontSize: 26, fontWeight: 600 }}>Fallas de uniforme — periodo {EL_PERIODO + 1}</div>
				<div style={{ position: 'absolute', top: 64, left: 24, fontSize: 18, color: TEXTO_TENUE }}>{alumno.nombre}</div>

				{!creando && (
					<div style={{ position: 'absolute', top: U.agregar, left: 24 }}>
						<Boton alto={38} ancho={300} senalado={sen === 'agregar'} icono={<IconoMas />}>Agregar falla de uniforme</Boton>
					</div>
				)}

				{creando && (
					<div style={{ position: 'absolute', top: U.form, left: 24, right: 24, opacity: entra(frame, fps, g.agregaEn, 10) }}>
						<div style={{ fontSize: 20, fontWeight: 600, height: 30 }}>Nueva falla de uniforme</div>
						<div style={{ position: 'absolute', top: U.checks - U.form, left: 0, display: 'flex', alignItems: 'center' }}>
							{MOTIVOS.map((m, i) => (
								<Casilla key={m} marcada={marcado && i === g.motivo} senalada={sen === `motivo-${i}`} ancho={ANCHO_MOTIVO}>{m}</Casilla>
							))}
							<Casilla marcada={false} ancho={130}>Excusado</Casilla>
						</div>
						<div style={{ position: 'absolute', top: U.fechaRotulo - U.form, left: 0, fontSize: 17 }}>Fecha y hora</div>
						<Caja top={U.fecha - U.form} ancho={300}>28-09-2026 07:10</Caja>
						<div style={{ position: 'absolute', top: U.descRotulo - U.form, left: 0, fontSize: 17 }}>Descripción</div>
						<Caja top={U.desc - U.form} ancho={952 - 0}><span style={{ color: '#bfbfbf' }}>Escriba una descripción, descargo, etc.</span></Caja>
						<div style={{ position: 'absolute', top: U.botones - U.form, right: 0, display: 'flex', gap: 10 }}>
							<Boton alto={38}>Cancelar</Boton>
							<Boton primario alto={38} ancho={110} senalado={sen === 'guardar'}>Guardar</Boton>
						</div>
					</div>
				)}

				<div style={{ position: 'absolute', top: yLista, left: 24, right: 24 }}>
					{lista.map((u, i) => {
						const nueva = i === g.antes.length;
						return (
							<div
								key={u.fecha}
								style={{
									height: U.fila, display: 'flex', alignItems: 'center', gap: 14, borderBottom: `1px solid ${BORDE}`, fontSize: 18,
									opacity: nueva ? entra(frame, fps, g.guardaEn, 12) : 1,
								}}
							>
								<span style={{ width: 60, color: TEXTO_TENUE }}>{3101 + i}</span>
								<span style={{ width: 210 }}>{u.fechaLarga}</span>
								<span style={{ flex: 1, display: 'flex', gap: 6 }}>{u.largas.map((l) => <Etiqueta key={l} grande>{l}</Etiqueta>)}</span>
								<span style={{ width: 32, height: 30, border: `1px solid ${BORDE}`, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconoLapiz /></span>
								<span style={{ width: 32, height: 30, border: '1px solid #ff4d4f', color: '#ff4d4f', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconoPapelera /></span>
							</div>
						);
					})}
				</div>

				<div style={{ position: 'absolute', bottom: 14, right: 24 }}>
					<Boton primario alto={38} ancho={124} senalado={sen === 'aceptar'} icono={<IconoVisto />}>Aceptar</Boton>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Casilla: React.FC<{ marcada: boolean; senalada?: boolean; ancho: number; children: React.ReactNode }> = ({ marcada, senalada = false, ancho, children }) => (
	<span style={{ width: ancho, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 17, color: senalada ? ACENTO : TEXTO }}>
		<span style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${marcada || senalada ? ACENTO : '#bfbfbf'}`, background: marcada ? ACENTO : SUPERFICIE, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
			{marcada && <svg width="12" height="12" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>}
		</span>
		{children}
	</span>
);

const Caja: React.FC<{ top: number; ancho: number; children: React.ReactNode }> = ({ top, ancho, children }) => (
	<div style={{ position: 'absolute', top, left: 0, width: ancho, height: 38, border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 18, boxSizing: 'border-box' }}>{children}</div>
);
