import React from 'react';

import { ACENTO, Boton, Icono, LETRA, TEXTO } from '../montar-el-ano/ant';
import { Bloque, Pista } from '../el-ano/colegio';
import { Interruptor } from '../el-ano/piezas';
import { ABAJO, AJ, GRUPOS, TEXTOS, rectAbajo, rectAnio, rectGrupo, rectInterruptor, rectPapelera } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CUERPO DE «AJUSTES DEL AÑO». No sabe de tiempo: pinta el estado que le pasan, donde dice
 * `datos.ts`. La cabecera del colegio (nombre, selector, pestañas) va aparte, en `el-ano/colegio`.
 */

export const CuerpoAjustes: React.FC<{
	year: number;
	enCurso: boolean;
	/** 0..1: cuánto ocupa el aviso de año viejo arriba (empuja todo hacia abajo). */
	aviso: number;
	/** 0..1 del interruptor «Mostrar el puesto». */
	puesto: number;
	cargaPuesto: number;
	frame: number;
	botonEncima?: boolean;
	botonCarga?: boolean;
	opacidad?: number;
}> = ({ year, enCurso, aviso, puesto, cargaPuesto, frame, botonEncima = false, botonCarga = false, opacidad = 1 }) => (
	<div style={{ opacity: opacidad }}>
		<Bloque r={rectAnio(aviso)} titulo={TEXTOS.tituloAnio} destacado>
			{enCurso ? (
				<>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 26 }}>
						<Icono cual="bien" tam={17} color="#3f9142" />
						<span><b>{year}</b> es el año en el que trabaja el colegio.</span>
					</div>
					<Pista estilo={{ marginTop: 8 }}>{TEXTOS.pistaActual}</Pista>
				</>
			) : (
				<>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 26 }}>
						<Reloj />
						<span><b>{year}</b> no es el año en curso.</span>
					</div>
					<div style={{ marginTop: 4 }}>
						<Boton texto={TEXTOS.boton(year)} tipo="primary" ancho={AJ.boton} encima={botonEncima} cargando={botonCarga} giroCarga={(frame * 24) % 360} />
					</div>
				</>
			)}
		</Bloque>

		{GRUPOS.map((g, gi) => (
			<Bloque key={g.titulo} r={rectGrupo(gi, aviso)} titulo={g.titulo}>
				{g.interruptores.map((it, ii) => {
					const r = rectInterruptor(gi, ii, aviso);
					const grupo = rectGrupo(gi, aviso);
					const esElPuesto = gi === 1 && ii === 0;
					return (
						<div key={it.etiqueta} style={{ position: 'absolute', left: r.x - grupo.x, top: r.y - grupo.y, width: r.ancho }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 10, height: AJ.fila }}>
								{it.numero ? (
									<div style={{ width: 64, height: 26, boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 9px', fontSize: LETRA - 0.5, color: TEXTO }}>
										{it.numero}
									</div>
								) : (
									<Interruptor encendido={esElPuesto ? puesto : it.encendido ? 1 : 0} carga={esElPuesto ? cargaPuesto : 0} frame={frame} />
								)}
								<span style={{ fontWeight: 500 }}>{it.etiqueta}</span>
							</div>
							<Pista tam={LETRA - 1.5} estilo={{ marginLeft: it.numero ? 74 : AJ.sangria + 8, marginTop: 1, lineHeight: `${AJ.linea}px` }}>
								{it.ayuda}
							</Pista>
						</div>
					);
				})}
			</Bloque>
		))}
		{ABAJO.map((b, k) => (
			<Bloque key={b.titulo} r={rectAbajo(k, aviso)} titulo={b.titulo}>
				<Pista>{b.pista}</Pista>
			</Bloque>
		))}
		<Papelera year={year} enCurso={enCurso} aviso={aviso} />
	</div>
);

/** La zona de riesgo: marco y título en rojo (`colegio.scss`, `.bloque--riesgo`). */
const Papelera: React.FC<{ year: number; enCurso: boolean; aviso: number }> = ({ year, enCurso, aviso }) => {
	const r = rectPapelera(aviso);
	return (
		<>
			<Bloque r={r} titulo={TEXTOS.papelera(year)} peligro>
				<Pista>
					{TEXTOS.papeleraPista}
					{enCurso && <> <b style={{ color: TEXTO }}>{TEXTOS.papeleraActual}</b>{TEXTOS.papeleraActualResto}</>}
				</Pista>
				<div style={{ marginTop: 12 }}>
					<Boton texto={TEXTOS.papeleraBoton} icono="delete" peligro />
				</div>
			</Bloque>
			<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, boxSizing: 'border-box', border: '1px solid #e61900', borderRadius: 10 }} />
		</>
	);
};

const Reloj: React.FC = () => (
	<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b0902a" strokeWidth="2.2" strokeLinecap="round">
		<circle cx="12" cy="12" r="9.5" />
		<path d="M12 7v5l3.2 2" />
	</svg>
);

export { ACENTO };
