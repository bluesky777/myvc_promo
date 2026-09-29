import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { llega } from '../../comunes/movimiento';
import { PALETA_CLARA } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { Migas } from '../moverse/comun';
import {
	ANADIR, ANCHO, ASIGNATURA, EDICION, EL_QUE_SOBRA, Estado, G, ICONOS, LOGROS, MIGAS_LOGROS, PORCENTAJE, TEXTOS, arribaDeCrear, arribaDeLaCabecera,
	Logro, arribaDelAviso, geometria, indicadoresDe, porcentajeDe, sumaDeIndicadores, sumaDeLogros,
} from './datos';

/*
 * «LOGROS» DE UNA ASIGNATURA, la de hoy (`paginas/unidades/`). Va dentro de la cáscara. Todo lo
 * que se mueve --el Logro en edición, el Indicador que se añade, los avisos que se van-- sale del
 * `Estado`, y la geometría de `datos.ts` sale del mismo `Estado`: el foco no puede señalar un
 * renglón que el dibujo ya no tiene.
 */

const P = PALETA_CLARA;
const LINEA = '#f0f0f0';

export const Unidades: React.FC<{
	estado: Estado;
	desde?: number;
	/** El tercer Logro en edición: lo tecleado en el porcentaje, y si el campo tiene el foco. */
	edicion?: { valor: string; foco: boolean } | null;
	/** El formulario de añadir del primer Logro. */
	nuevo?: { texto: string; porc: string; foco: 'texto' | 'porc' | null };
	senalado?: 'editar' | 'guardar' | 'anadir' | null;
	/** Otra asignatura: sus Logros y su cabecera (por defecto, Matemáticas de 9°A). */
	otra?: { asignatura: typeof ASIGNATURA; logros: Logro[] };
	/** La miga que el ratón tiene encima. */
	senaladaMiga?: number | null;
}> = ({ estado, desde = 0, edicion = null, nuevo = { texto: '', porc: '', foco: null }, senalado = null, otra, senaladaMiga = null }) => {
	const LOGROS_ = otra?.logros ?? LOGROS;
	const A = otra?.asignatura ?? ASIGNATURA;
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const g = geometria(estado, LOGROS_);
	const suma = sumaDeLogros(estado, LOGROS_);
	const aparece = (i: number) => llega(frame, fps, i, desde + 4, 5);
	const caret = frame % 30 < 16;

	const bloque = (i: number, contenido: React.ReactNode, top: number) => {
		const l = aparece(i);
		return (
			<div style={{ position: 'absolute', left: 0, top, width: ANCHO, opacity: l.opacidad, transform: `translate(${l.x}px, ${l.y}px)` }}>{contenido}</div>
		);
	};

	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO, height: MEDIDAS.alto - MEDIDAS.barra, color: P.texto }}>
			<div style={{ position: 'absolute', left: 0, top: G.arriba, width: ANCHO }}>
				<Migas migas={MIGAS_LOGROS} izquierda={G.lados} derecha={G.lados} colores={P} senalada={senaladaMiga} />
			</div>

			{bloque(0, (
				<div style={{ marginLeft: G.lados, height: G.cabecera, display: 'flex', alignItems: 'center', gap: 16 }}>
					<div style={{ width: 52, height: 52, borderRadius: 8, background: A.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600 }}>
						{A.sigla}
					</div>
					<div style={{ fontSize: 22, fontWeight: 700 }}>
						{A.materia}
						<span style={{ fontWeight: 500, color: '#595959' }}> — {A.nombreGrupo} — {A.docente}</span>
					</div>
				</div>
			), arribaDeLaCabecera())}

			{bloque(1, (
				<div style={{ marginLeft: G.lados, height: G.acciones, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
					{TEXTOS.acciones.map((a, i) => (
						<Boton key={a} texto={a} icono={['tabla', 'rubricas', 'copiar'][i] as IconoBoton} />
					))}
				</div>
			), arribaDeLaCabecera() + G.cabecera)}

			{/* CREAR UN LOGRO: el recuadro de arriba. */}
			{bloque(2, (
				<div style={{ marginLeft: G.lados, width: ANCHO - G.lados * 2, height: G.crear, boxSizing: 'border-box', padding: '12px 16px', border: `1px solid ${LINEA}`, borderRadius: 8, background: P.superficie }}>
					<div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{TEXTOS.crear}</div>
					<div style={{ display: 'flex', gap: 10 }}>
						<Campo ancho={640} texto="" placeholder={TEXTOS.placeholderCrear} />
						<Campo ancho={140} texto="" placeholder={TEXTOS.porcentaje} />
						<Boton texto={TEXTOS.botonCrear} primario alto={40} />
					</div>
				</div>
			), arribaDeCrear())}

			{/* LA PRIMERA PUERTA: la suma de los Logros del periodo. */}
			{suma !== 100 && bloque(3, (
				<div style={{ marginLeft: G.lados }}>
					<Alerta texto={suma > 100 ? TEXTOS.sobra(suma - 100) : TEXTOS.falta(100 - suma)} rojo={suma > 100} />
				</div>
			), arribaDelAviso())}

			{LOGROS_.map((l, i) => {
				const r = g[i];
				const editando = !otra && i === EL_QUE_SOBRA.logro && estado.editando3;
				const porcentaje = porcentajeDe(i, estado, LOGROS_);
				const sumaI = sumaDeIndicadores(i, estado, LOGROS_);
				return (
					<React.Fragment key={l.definicion}>
						{bloque(4 + i, (
							<div style={{ position: 'relative', marginLeft: r.fila.x, width: r.fila.ancho, height: r.fila.alto, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${LINEA}` }}>
								<Asa />
								{editando ? (
									<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
										<Campo ancho={EDICION.texto} texto={l.definicion} alto={36} />
										<Campo ancho={EDICION.porc} texto={edicion?.valor ?? String(porcentaje)} alto={36} foco={edicion?.foco} caret={Boolean(edicion?.foco) && caret} />
										<Boton texto="Cancelar" alto={36} ancho={EDICION.cancelar} />
										<Boton texto="Guardar" primario alto={36} ancho={EDICION.guardar} encima={senalado === 'guardar'} />
									</div>
								) : (
									<>
										<span style={{ marginLeft: 8, fontSize: 18, fontWeight: 600 }}>{i + 1}. {l.definicion}</span>
										<span style={{ position: 'absolute', right: PORCENTAJE.derecha, width: PORCENTAJE.ancho, textAlign: 'right', fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
											{porcentaje}%
										</span>
										<IconoRedondo derecha={ICONOS.chevron} cual="arriba" />
										<IconoRedondo derecha={ICONOS.editar} cual="lapiz" encima={i === EL_QUE_SOBRA.logro && senalado === 'editar'} />
										<IconoRedondo derecha={ICONOS.eliminar} cual="x" />
									</>
								)}
							</div>
						), r.fila.y)}

						{/* LA SEGUNDA PUERTA: la suma de sus Indicadores. */}
						{r.aviso && bloque(4 + i, (
							<div style={{ marginLeft: r.aviso.x }}>
								<Alerta texto={sumaI > 100 ? TEXTOS.sobra(sumaI - 100) : TEXTOS.falta(100 - sumaI)} rojo={sumaI > 100} />
							</div>
						), r.aviso.y)}

						{indicadoresDe(i, estado, LOGROS_).map((s, j) => bloque(4 + i, (
							<div key={s.definicion} style={{ position: 'relative', marginLeft: r.indicadores[j].x, width: r.indicadores[j].ancho, height: G.indicador, display: 'flex', alignItems: 'center' }}>
								<Asa />
								<span style={{ marginLeft: 8, fontSize: 17 }}>{j + 1}. {s.definicion}</span>
								<span style={{ position: 'absolute', right: PORCENTAJE.derecha, width: PORCENTAJE.ancho, textAlign: 'right', fontSize: 17, fontVariantNumeric: 'tabular-nums' }}>{s.porcentaje}%</span>
								<IconoRedondo derecha={ICONOS.editar} cual="lapiz" />
								<IconoRedondo derecha={ICONOS.eliminar} cual="x" />
							</div>
						), r.indicadores[j].y))}

						{bloque(4 + i, (
							<div style={{ marginLeft: r.anadir.x, height: G.anadir, display: 'flex', alignItems: 'center', gap: ANADIR.hueco }}>
								<Campo
									ancho={ANADIR.texto}
									alto={36}
									texto={i === 0 ? nuevo.texto : ''}
									placeholder={TEXTOS.placeholderNueva}
									foco={i === 0 && nuevo.foco === 'texto'}
									caret={i === 0 && nuevo.foco === 'texto' && caret}
								/>
								<Campo
									ancho={ANADIR.porc}
									alto={36}
									texto={i === 0 ? nuevo.porc : ''}
									placeholder={TEXTOS.porcentajeNueva}
									foco={i === 0 && nuevo.foco === 'porc'}
									caret={i === 0 && nuevo.foco === 'porc' && caret}
								/>
								<Boton texto={TEXTOS.botonNueva} alto={36} ancho={ANADIR.boton} encima={i === 0 && senalado === 'anadir'} />
							</div>
						), r.anadir.y)}
					</React.Fragment>
				);
			})}
		</div>
	);
};

const Alerta: React.FC<{ texto: string; rojo: boolean }> = ({ texto, rojo }) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 8,
			height: 30,
			padding: '0 12px',
			borderRadius: 6,
			border: `1px solid ${rojo ? '#ffccc7' : '#ffe58f'}`,
			background: rojo ? '#fff2f0' : '#fffbe6',
			fontSize: 15,
			color: 'rgba(0,0,0,.88)',
		}}
	>
		<svg width="16" height="16" viewBox="0 0 16 16">
			<circle cx="8" cy="8" r="7" fill={rojo ? '#ff4d4f' : '#faad14'} />
			{rojo ? (
				<path d="M5.6 5.6 L10.4 10.4 M10.4 5.6 L5.6 10.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
			) : (
				<>
					<path d="M8 4.2 V9" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
					<circle cx="8" cy="11.6" r="1" fill="#fff" />
				</>
			)}
		</svg>
		{texto}
	</div>
);

const Campo: React.FC<{ ancho: number; alto?: number; texto: string; placeholder?: string; foco?: boolean; caret?: boolean }> = ({
	ancho, alto = 40, texto, placeholder, foco = false, caret = false,
}) => (
	<div
		style={{
			width: ancho,
			height: alto,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? P.acento : '#d9d9d9'}`,
			boxShadow: foco ? `0 0 0 2px ${P.acento}33` : 'none',
			borderRadius: 6,
			background: '#fff',
			display: 'flex',
			alignItems: 'center',
			padding: '0 11px',
			fontSize: 16,
			whiteSpace: 'pre',
			overflow: 'hidden',
		}}
	>
		{texto ? <span>{texto}</span> : null}
		{foco && <span style={{ width: 1.5, height: 20, background: 'rgba(0,0,0,.85)', opacity: caret ? 1 : 0 }} />}
		{!texto && placeholder && <span style={{ color: '#bfbfbf' }}>{placeholder}</span>}
	</div>
);

type IconoBoton = 'tabla' | 'rubricas' | 'copiar';

const Boton: React.FC<{ texto: string; primario?: boolean; alto?: number; ancho?: number; icono?: IconoBoton; encima?: boolean }> = ({
	texto, primario = false, alto = 36, ancho, icono, encima = false,
}) => (
	<div
		style={{
			height: alto,
			width: ancho,
			boxSizing: 'border-box',
			padding: '0 15px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			borderRadius: 6,
			border: `1px solid ${primario ? P.acento : encima ? P.acento : '#d9d9d9'}`,
			background: primario ? (encima ? '#4096ff' : P.acento) : encima ? '#f0f7ff' : '#fafafa',
			color: primario ? '#fff' : encima ? P.acento : '#595959',
			fontSize: 15,
			whiteSpace: 'nowrap',
		}}
	>
		{icono && (
			<svg width="15" height="15" viewBox="0 0 16 16">
				{icono === 'tabla' && <path d="M2 2.5 H14 V13.5 H2 Z M2 6 H14 M2 9.7 H14 M6 2.5 V13.5" fill="none" stroke="#595959" strokeWidth="1.5" />}
				{icono === 'rubricas' && <path d="M2.5 2.5 H7 V7 H2.5 Z M9 2.5 H13.5 V7 H9 Z M2.5 9 H7 V13.5 H2.5 Z M9 9 H13.5 V13.5 H9 Z" fill="none" stroke="#595959" strokeWidth="1.5" />}
				{icono === 'copiar' && <path d="M5 5 H13.5 V14 H5 Z M3 11 H2.5 V2.5 H10.5 V3" fill="none" stroke="#595959" strokeWidth="1.5" strokeLinejoin="round" />}
			</svg>
		)}
		{texto}
	</div>
);

/** El asa de arrastrar (`holder`): seis puntos. */
const Asa: React.FC = () => (
	<svg width="14" height="18" viewBox="0 0 14 18" style={{ marginLeft: 4, flexShrink: 0 }}>
		{[4, 9, 14].map((y) => [4, 10].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#bfbfbf" />))}
	</svg>
);

const IconoRedondo: React.FC<{ derecha: number; cual: 'lapiz' | 'x' | 'arriba'; encima?: boolean }> = ({ derecha, cual, encima = false }) => (
	<div
		style={{
			position: 'absolute',
			right: derecha - ICONOS.tam,
			width: ICONOS.tam,
			height: ICONOS.tam,
			borderRadius: '50%',
			background: encima ? 'rgba(0,0,0,.08)' : 'transparent',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<svg width="16" height="16" viewBox="0 0 16 16">
			{cual === 'lapiz' && <path d="M3 13 L3.6 10.2 L10.8 3 L13 5.2 L5.8 12.4 Z M9.6 4.2 L11.8 6.4" fill="none" stroke="#595959" strokeWidth="1.4" strokeLinejoin="round" />}
			{cual === 'x' && <path d="M4 4 L12 12 M12 4 L4 12" stroke="#595959" strokeWidth="1.4" strokeLinecap="round" />}
			{cual === 'arriba' && <path d="M4 10 L8 6 L12 10" fill="none" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
		</svg>
	</div>
);
