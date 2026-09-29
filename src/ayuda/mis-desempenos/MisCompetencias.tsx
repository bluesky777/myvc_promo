import React from 'react';

import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Icono } from '../montar-el-ano/ant';
import { Btn } from '../rubricas-montar/Rubricas';
import { FUENTE } from '../tema';
import {
	ALTO_PANEL, ANCHO_CLASE, ANCHO_PERIODO, CLASES, DEL_COLEGIO, LA_CLASE, PG, POR_PERIODO, TEXTOS, UTIL, X_PERIODOS, plano,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS COMPETENCIAS» (`paginas/docente-competencias/docente-competencias.html`), por bloques y en
 * su orden: el título, la entradilla con el filtro de grupo, la tira de clases, los periodos, la
 * lista (con el formulario de edición en su sitio), el formulario de añadir y el bloque de la
 * coordinación con candado.
 */

export interface EstadoMisCompetencias {
	clase: boolean;
	claseEncima: boolean;
	filas: string[];
	/** La fila que se edita (siempre la primera) y lo que lleva escrito su caja. */
	edicion: { texto: string; foco: boolean; guardarEncima: boolean } | null;
	lapizEncima: boolean;
	nuevo: { texto: string; foco: boolean; anadirEncima: boolean };
}

const F = PG.letra;

export const PantallaMisCompetencias: React.FC<{ e: EstadoMisCompetencias }> = ({ e }) => {
	const p = plano({ conClase: e.clase, filas: e.filas.length, editando: e.edicion !== null });
	const cuenta = e.filas.length;
	return (
		<div style={{ position: 'relative', width: PG.ancho, height: ALTO_PANEL, borderRadius: 14, background: SUPERFICIE, boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)', fontFamily: FUENTE, color: TEXTO }}>
			<div style={{ position: 'absolute', left: PG.relleno, top: p.titulo, fontSize: 32, fontWeight: 700 }}>{TEXTOS.titulo}</div>

			<div style={{ position: 'absolute', left: PG.relleno, top: p.entradilla, width: 1000, fontSize: F - 1, lineHeight: 1.45, color: TEXTO }}>
				Lo que va a salir en el boletín de tus clases. Son las <strong>mismas filas</strong> que escribe la coordinación: lo que cambies aquí lo ve ella, y lo que ella escriba lo ves tú.
			</div>
			<div style={{ position: 'absolute', right: PG.relleno, top: p.entradilla + 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: F - 2 }}>
				<span style={{ color: TEXTO_TENUE }}>{TEXTOS.grupo}</span>
				<div style={{ width: 240, height: 40, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', color: 'rgba(0,0,0,0.4)' }}>
					{TEXTOS.todos}
					<Icono cual="flecha" tam={14} color={TEXTO_TENUE} />
				</div>
			</div>

			{/* La tira de clases: botones unidos, la elegida en el color del colegio. */}
			<div style={{ position: 'absolute', left: PG.relleno, top: p.tira, display: 'flex', border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden' }}>
				{CLASES.map((c, i) => {
					const puesta = e.clase && i === LA_CLASE;
					const encima = e.claseEncima && i === LA_CLASE;
					const n = i === LA_CLASE ? cuenta : [0, 4, 3, 2][i];
					return (
						<div key={c} style={{ width: ANCHO_CLASE, height: PG.tira, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: F - 1, background: puesta ? ACENTO : encima ? `${ACENTO}14` : SUPERFICIE, color: puesta ? '#fff' : encima ? ACENTO : TEXTO, borderRight: i < CLASES.length - 1 ? `1px solid ${BORDE}` : 'none' }}>
							{c}
							{n > 0 && <span style={{ fontSize: F - 6, fontWeight: 600, borderRadius: 9, padding: '0 7px', background: puesta ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.06)' }}>{n}</span>}
						</div>
					);
				})}
			</div>

			{!e.clase && (
				<div style={{ position: 'absolute', left: PG.relleno, top: p.periodos + 20, width: UTIL, textAlign: 'center', fontSize: F, color: TEXTO_TENUE }}>{TEXTOS.vacio}</div>
			)}

			{e.clase && (
				<>
					<div style={{ position: 'absolute', left: PG.relleno, top: p.periodos, height: PG.periodos, display: 'flex', alignItems: 'center', fontSize: F - 1, fontWeight: 600 }}>{TEXTOS.periodos}</div>
					<div style={{ position: 'absolute', left: X_PERIODOS, top: p.periodos, display: 'flex', gap: 8 }}>
						{POR_PERIODO.map((n0, i) => {
							const n = i === 1 ? cuenta : n0;
							const puesto = i === 1;
							return (
								<div key={i} style={{ width: ANCHO_PERIODO, height: PG.periodos, boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${puesto ? ACENTO : BORDE}`, background: puesto ? `${ACENTO}14` : SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: F, fontWeight: 600, color: puesto ? ACENTO : TEXTO }}>
									{i + 1}
									{n > 0 && <span style={{ fontSize: F - 7, color: TEXTO_TENUE }}>{n}</span>}
								</div>
							);
						})}
					</div>

					<div style={{ position: 'absolute', left: PG.relleno, top: p.donde, fontSize: F - 1, color: TEXTO_TENUE }}>{TEXTOS.donde}</div>

					{e.filas.map((t, i) => (
						i === 0 && e.edicion
							? <Edicion key={i} top={p.filas[i]} e={e.edicion} />
							: <Fila key={i} top={p.filas[i]} texto={t} lapizEncima={i === 0 && e.lapizEncima} />
					))}

					<Nuevo top={p.nuevo} e={e.nuevo} />
				</>
			)}

			<div style={{ position: 'absolute', left: PG.relleno, top: p.comunes, width: UTIL }}>
				<div style={{ height: PG.comunesTitulo, display: 'flex', alignItems: 'center', gap: 10, fontSize: F, fontWeight: 600 }}>
					<Icono cual="lock" tam={19} color={TEXTO_TENUE} />
					{TEXTOS.comunes}
				</div>
				<div style={{ height: PG.comunesNota, fontSize: F - 3, color: TEXTO_TENUE, lineHeight: 1.4 }}>
					Estas competencias las escribe la coordinación para <strong>toda la materia</strong>, y se <strong>suman</strong> a las tuyas en el boletín del alumno. Aquí se ven y no se editan.
				</div>
				{DEL_COLEGIO.map((t) => (
					<div key={t} style={{ height: PG.comun - 6, marginBottom: 6, boxSizing: 'border-box', border: `1px solid #f0f0f0`, borderRadius: 8, background: 'rgb(128 128 128 / 5%)', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: F - 1, color: TEXTO_TENUE }}>{t}</div>
				))}
			</div>
		</div>
	);
};

const Fila: React.FC<{ top: number; texto: string; lapizEncima: boolean }> = ({ top, texto, lapizEncima }) => (
	<div style={{ position: 'absolute', left: PG.relleno, top, width: UTIL, height: PG.fila, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px 0 12px', fontSize: F }}>
		<span style={{ color: TEXTO_TENUE, display: 'flex' }}><Asa /></span>
		<span style={{ flex: 1 }}>{texto}</span>
		<span style={{ width: 40, height: 40, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: lapizEncima ? 'rgba(0,0,0,0.06)' : 'transparent', color: TEXTO }}><Icono cual="edit" tam={19} /></span>
		<span style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d4f' }}><Icono cual="delete" tam={19} /></span>
	</div>
);

const Edicion: React.FC<{ top: number; e: NonNullable<EstadoMisCompetencias['edicion']> }> = ({ top, e }) => (
	<div style={{ position: 'absolute', left: PG.relleno, top, width: UTIL, height: PG.edicion, boxSizing: 'border-box', border: `1px solid ${ACENTO}55`, borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
		<Caja texto={e.texto} foco={e.foco} alto={70} />
		<div style={{ display: 'flex', gap: 10 }}>
			<Caja texto="" marcador={TEXTOS.marca} alto={44} ancho={240} />
			<Btn texto={TEXTOS.guardar} encima={e.guardarEncima} />
			<Btn texto={TEXTOS.cancelar} />
		</div>
	</div>
);

const Nuevo: React.FC<{ top: number; e: EstadoMisCompetencias['nuevo'] }> = ({ top, e }) => (
	<div style={{ position: 'absolute', left: PG.relleno, top, width: UTIL, display: 'flex', flexDirection: 'column', gap: 10 }}>
		<Caja texto={e.texto} marcador={TEXTOS.placeholder} foco={e.foco} alto={64} />
		<div style={{ display: 'flex', gap: 10 }}>
			<Caja texto="" marcador={TEXTOS.marca} alto={44} ancho={240} />
			<Btn texto={TEXTOS.anadir} icono="plus" encima={e.anadirEncima} deshabilitado={!e.texto.trim()} />
		</div>
	</div>
);

const Caja: React.FC<{ texto: string; marcador?: string; foco?: boolean; alto: number; ancho?: number | string }> = ({ texto, marcador = '', foco = false, alto, ancho = '100%' }) => (
	<div style={{ width: ancho, height: alto, boxSizing: 'border-box', border: `1px solid ${foco ? ACENTO : BORDE}`, boxShadow: foco ? `0 0 0 3px ${ACENTO}22` : 'none', borderRadius: 6, padding: '9px 12px', fontSize: F, color: texto ? TEXTO : 'rgba(0,0,0,0.3)', whiteSpace: 'pre-wrap', flex: 'none' }}>
		{texto || (foco ? '' : marcador)}
		{foco && <span style={{ color: TEXTO }}>|</span>}
	</div>
);

const Asa: React.FC = () => (
	<svg width="16" height="20" viewBox="0 0 16 20"><g fill="currentColor">{[4, 10, 16].flatMap((y) => [<circle key={`a${y}`} cx="5" cy={y} r="1.6" />, <circle key={`b${y}`} cx="11" cy={y} r="1.6" />])}</g></svg>
);
