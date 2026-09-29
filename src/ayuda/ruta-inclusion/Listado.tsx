import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { BORDE, SUPERFICIE, TEXTO } from '../../notas/tema';
import { BotonDeGrupo, IconoLapiz } from '../disciplina/Rejilla';
import { Girando, IconoDerecha, IconoReloj, IconoVistoRedondo, PALETA } from '../ant';
import { AL_DIA, CONTEXTO, ESTUDIANTES, GRUPO, GRUPOS_RUTA, L, TITULAR, estadoDe } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «RUTA DE INCLUSIÓN», EL LISTADO DEL GRUPO (`app2/.../ruta-inclusion/ruta-inclusion.html`).
 *
 * Lo que se dibuja tal cual: el título y su entradilla, la fila de grupos (`myvc-selector-grupo`:
 * botones con la abreviatura y la estrella en el del titular), «Elija un grupo para ver su
 * contexto y sus estudiantes con ERE.» mientras no hay grupo, la franja del titular con «N de M /
 * con el PIAR al día», el desplegable «Contexto del grupo» con su etiqueta, «Estudiantes con ERE
 * (N)» con una fila por estudiante que es toda ella un enlace, y la nota de abajo.
 */

export interface EstadoListado {
	/** El grupo elegido, o `null`. */
	grupo: number | null;
	/** Desde cuándo (fotograma de la secuencia) está el grupo cargado; antes, «Cargando el grupo…». */
	cargadoEn: number | null;
	contextoAbierto: boolean;
	encima: string | null;
	salidaEn?: number;
}

const GRIS = 'rgba(0,0,0,.6)';
const TITULO = 4;

export const Listado: React.FC<{ e: EstadoListado }> = ({ e }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const salida = e.salidaEn ?? 1e9;

	const texto = 'Ruta de inclusión';
	const cursorTitulo = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const intro = entra(frame, fps, TITULO + 14, 14);
	const selector = llega(frame, fps, 0, TITULO + 22, 0);
	const fuera = (i: number) => estiloDeSalida(seVa(frame, i, salida));
	const cargado = e.cargadoEn !== null && frame >= e.cargadoEn;
	const dy = e.contextoAbierto ? L.abierto : 0;
	const at = (i: number) => (e.cargadoEn === null ? { opacidad: 0, x: 0, y: 0 } : llega(frame, fps, i, e.cargadoEn, 5));

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%', color: TEXTO }}>
			<div style={{ position: 'absolute', left: L.lados, top: L.arriba, width: L.ancho, opacity: fuera(0).opacidad, transform: `translateX(${fuera(0).x}px)` }}>
				<div style={{ height: 40, display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 600, whiteSpace: 'pre' }}>
					{escrito(frame, texto, TITULO, 2)}
					<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
				</div>
			</div>
			<div style={{ position: 'absolute', left: L.lados, top: L.yIntro, width: 700, fontSize: 17, lineHeight: 1.45, color: 'rgba(0,0,0,.7)', opacity: intro * fuera(0).opacidad }}>
				El expediente de inclusión —el <b>PIAR</b>— de cada estudiante con ERE: quién es, qué se le ajusta en cada materia, qué se acordó con la familia y el informe que se le entrega. Lo escriben, cada uno lo suyo, el titular, los docentes de cada materia y la administración.
			</div>

			<div style={{ position: 'absolute', left: L.lados, top: L.ySelector, display: 'flex', gap: L.boton.hueco, opacity: selector.opacidad * fuera(1).opacidad, transform: `translate(${selector.x + fuera(1).x}px, ${selector.y}px)` }}>
				{GRUPOS_RUTA.map((g, i) => (
					<BotonDeGrupo key={g.abrev} abrev={g.abrev} titular={g.titular} puesto={e.grupo === i} senalado={e.encima === `grupo-${i}`} alto={L.boton.alto} ancho={L.boton.ancho} />
				))}
			</div>

			{e.grupo === null && (
				<div style={{ position: 'absolute', left: L.lados, top: L.yTitular + 6, fontSize: 17, color: GRIS, opacity: entra(frame, fps, TITULO + 30, 12) }}>
					Elija un grupo para ver su contexto y sus estudiantes con ERE.
				</div>
			)}

			{e.grupo !== null && !cargado && (
				<div style={{ position: 'absolute', left: 0, right: 0, top: L.yTitular + 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#1677ff' }}>
					<Girando frame={frame} tam={30} color="#1677ff" />
					<span style={{ fontSize: 16 }}>Cargando el grupo…</span>
				</div>
			)}

			{cargado && (
				<>
					{/* La franja del titular. */}
					<Caja y={L.yTitular} alto={L.altoTitular} a={at(0)} f={fuera(2)}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 14, height: '100%', padding: '0 16px' }}>
							<Avatar tipo="hombre" variante={2} tam={50} />
							<div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.35 }}>
								<span style={{ fontSize: 13, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(0,0,0,.55)' }}>Titular</span>
								<span style={{ fontSize: 18, fontWeight: 600 }}>{TITULAR}</span>
								<span style={{ fontSize: 15, color: 'rgba(0,0,0,.65)' }}>{GRUPO.nombre} · {GRUPO.grado}</span>
							</div>
							<span style={{ flex: 1 }} />
							<div style={{ textAlign: 'right', lineHeight: 1.25 }}>
								<div style={{ fontSize: 24, fontWeight: 700 }}>{AL_DIA} de {ESTUDIANTES.length}</div>
								<div style={{ fontSize: 14, color: GRIS }}>con el PIAR al día</div>
							</div>
						</div>
					</Caja>

					{/* Contexto del grupo: un <details>, cerrado de entrada. */}
					<Caja y={L.yContexto} alto={L.altoContexto + dy} a={at(1)} f={fuera(3)} encima={e.encima === 'contexto'}>
						<div style={{ padding: '0 16px' }}>
							<div style={{ height: L.altoContexto, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600 }}>
								<span style={{ fontSize: 13, transform: e.contextoAbierto ? 'rotate(90deg)' : undefined, display: 'inline-block' }}>▶</span>
								Contexto del grupo
								<span style={{ fontSize: 13, fontWeight: 400, padding: '1px 7px', border: `1px solid ${BORDE}`, borderRadius: 4, background: '#fafafa', color: 'rgba(0,0,0,.6)' }}>escrito</span>
							</div>
							{e.contextoAbierto && (
								<div style={{ paddingBottom: 12 }}>
									<div style={{ width: 720, fontSize: 15, lineHeight: 1.45, color: 'rgba(0,0,0,.65)' }}>
										Lo escribe el titular del grupo, y es de todo el curso: el entorno, las familias y cómo funciona el grupo. No es de ningún estudiante en concreto.
									</div>
									<div style={{ marginTop: 10, width: 900, fontSize: 16, lineHeight: 1.5 }}>{CONTEXTO}</div>
									<div style={{ marginTop: 10 }}><BotonPequeno icono={<IconoLapiz />}>Editar</BotonPequeno></div>
								</div>
							)}
						</div>
					</Caja>

					<div style={{ position: 'absolute', left: L.lados, top: L.yLista + dy, fontSize: 20, fontWeight: 600, opacity: at(2).opacidad * fuera(4).opacidad, transform: `translateX(${fuera(4).x}px)` }}>
						Estudiantes con ERE <span style={{ fontWeight: 400, color: GRIS }}>({ESTUDIANTES.length})</span>
					</div>

					{ESTUDIANTES.map((es, i) => {
						const est = estadoDe(es);
						return (
							<Caja key={es.apellidos} y={L.yLista + dy + 40 + i * (L.fila + L.hueco)} alto={L.fila} a={at(3 + i)} f={fuera(5 + i)} encima={e.encima === `fila-${i}`}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 14, height: '100%', padding: '0 16px' }}>
									<Avatar tipo={es.sexo} variante={es.avatar} tam={42} />
									<div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
										<span style={{ fontSize: 17 }}><b>{es.apellidos}</b> {es.nombres}</span>
										<span style={{ fontSize: 14, color: 'rgba(0,0,0,.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{es.observacion}</span>
									</div>
									<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15, color: est.alDia ? '#237804' : 'rgba(0,0,0,.6)', fontWeight: est.alDia ? 600 : 400, whiteSpace: 'nowrap' }}>
										{est.alDia ? <IconoVistoRedondo /> : <IconoReloj />}{est.texto}
									</span>
									<span style={{ color: 'rgba(0,0,0,.45)' }}><IconoDerecha /></span>
								</div>
							</Caja>
						);
					})}

					<div style={{ position: 'absolute', left: L.lados, top: L.yLista + dy + 40 + ESTUDIANTES.length * (L.fila + L.hueco) + 8, width: 900, fontSize: 14, lineHeight: 1.45, color: GRIS, opacity: at(3 + ESTUDIANTES.length).opacidad * fuera(8).opacidad }}>
						La cuenta mira cuatro partes: la caracterización, la valoración, el acta de este año y el informe. Los ajustes por materia no se cuentan porque los escribe cada docente en su asignatura, y sólo se ven dentro de la ficha.
					</div>
				</>
			)}
		</div>
	);
};

const Caja: React.FC<{ y: number; alto: number; a: { opacidad: number; x: number; y: number }; f: { opacidad: number; x: number }; encima?: boolean; children: React.ReactNode }> = ({ y, alto, a, f, encima = false, children }) => (
	<div
		style={{
			position: 'absolute', left: L.lados, top: y, width: L.ancho, height: alto, boxSizing: 'border-box', overflow: 'hidden',
			border: `1px solid ${PALETA.linea}`, borderRadius: 2, background: encima ? '#fafafa' : SUPERFICIE,
			opacity: a.opacidad * f.opacidad, transform: `translate(${a.x + f.x}px, ${a.y}px)`,
		}}
	>
		{children}
	</div>
);

export const BotonPequeno: React.FC<{ icono?: React.ReactNode; children: React.ReactNode; encima?: boolean }> = ({ icono, children, encima = false }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', boxSizing: 'border-box', border: `1px solid ${encima ? '#1677ff' : BORDE}`, color: encima ? '#1677ff' : TEXTO, borderRadius: 6, fontSize: 15, background: SUPERFICIE }}>
		{icono}{children}
	</span>
);
