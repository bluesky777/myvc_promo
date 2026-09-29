import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Casilla, Desplegable, Girando, IconoBajar, IconoSubir, PALETA, Pildora } from '../ant';
import { ANCHO_CONTENIDO, ANCHO_TABLA, ASIGNATURAS_DEL_LIBRO, B, COL, ESCALA, PERIODO, SUBUNIDADES, Y_FILAS, Y_PIE, Y_TABLA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «TRABAJAR SIN INTERNET» (`app2/.../notas-sin-internet/notas-sin-internet.html`), para un docente
 * normal: sin el bloque «Docente» (sólo sale a quien puede bajar la de otro).
 *
 * LO QUE SE DIBUJA TAL CUAL: el título y su entradilla, «Subir una planilla» arriba a la derecha,
 * el bloque «Periodo» con «2 — en curso» y la frase de la escala, la tabla con su casilla por fila
 * (todas marcadas al llegar: `elegirPeriodo()` llama a `todas()`), la píldora de «Sin pasar» --verde
 * en 0, ámbar si queda algo, «sin indicadores» sin color--, «Todas · Ninguna» y el botón que cuenta
 * las hojas.
 */

const TITULO = 4;

export interface EstadoBajar {
	/** Las filas desmarcadas. */
	fuera: number[];
	/** Si el botón de descargar está girando. */
	descargando: boolean;
	/** Qué tiene el ratón encima. */
	encima: 'descargar' | 'subir' | number | null;
	/** Cuándo empieza a irse (en fotogramas de la secuencia). */
	salidaEn?: number;
}

export const Bajar: React.FC<{ estado: EstadoBajar }> = ({ estado }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const salida = estado.salidaEn ?? 1e9;

	const texto = 'Trabajar sin internet';
	const cursorTitulo = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const cabeza = estiloDeSalida(seVa(frame, 0, salida));
	const intro = entra(frame, fps, TITULO + 16, 14);
	const periodo = llega(frame, fps, 0, TITULO + 24, 0);
	const fueraPeriodo = estiloDeSalida(seVa(frame, 1, salida));
	const rotuloAsig = llega(frame, fps, 0, TITULO + 32, 0);
	const pie = entra(frame, fps, TITULO + 70, 14);
	const fueraPie = estiloDeSalida(seVa(frame, 3 + ASIGNATURAS_DEL_LIBRO.length, salida));

	const hojas = ASIGNATURAS_DEL_LIBRO.length - estado.fuera.length;

	return (
		<div style={{ position: 'relative', width: ANCHO_CONTENIDO, height: '100%', color: TEXTO }}>
			{/* La cabecera: título, entradilla y «Subir una planilla». */}
			<div style={{ position: 'absolute', left: B.lados, top: B.arriba, width: ANCHO_TABLA, opacity: cabeza.opacidad, transform: `translateX(${cabeza.x}px)` }}>
				<div style={{ height: B.titulo, display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 600, whiteSpace: 'pre' }}>
					{escrito(frame, texto, TITULO, 2)}
					<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
				</div>
				<div style={{ width: 720, marginTop: 6, fontSize: 17, lineHeight: 1.45, color: PALETA.textoSuave, opacity: intro }}>
					Baje sus planillas en Excel, páselas donde quiera y súbalas después. Mientras tanto puede seguir usando el sistema con normalidad.
				</div>
				<div style={{ position: 'absolute', right: 0, top: 0, opacity: intro }}>
					<BotonAnt icono={<IconoSubir />} encima={estado.encima === 'subir'} ancho={214}>Subir una planilla</BotonAnt>
				</div>
			</div>

			{/* Periodo. */}
			<div style={{ position: 'absolute', left: B.lados, top: B.yPeriodo, opacity: periodo.opacidad * fueraPeriodo.opacidad, transform: `translate(${periodo.x + fueraPeriodo.x}px, ${periodo.y}px)` }}>
				<Rotulo>Periodo</Rotulo>
				<div style={{ marginTop: 4 }}>
					<Desplegable valor={`${PERIODO} — en curso`} ancho={280} alto={B.selector} />
				</div>
				<div style={{ marginTop: 12, fontSize: 16, color: PALETA.textoSuave }}>
					Las casillas de nota del libro sólo aceptan números enteros de <b>{ESCALA.minima}</b> a <b>{ESCALA.maxima}</b>, que es la escala de este año.
				</div>
			</div>

			{/* Asignaturas: el rótulo y la tabla. */}
			<div style={{ position: 'absolute', left: B.lados, top: B.yAsignaturas, opacity: rotuloAsig.opacidad * fueraPeriodo.opacidad, transform: `translate(${rotuloAsig.x + fueraPeriodo.x}px, ${rotuloAsig.y}px)` }}>
				<Rotulo>Asignaturas</Rotulo>
			</div>

			<div
				style={{
					position: 'absolute',
					left: B.lados,
					top: Y_TABLA,
					width: ANCHO_TABLA,
					boxSizing: 'border-box',
					outline: `1px solid ${PALETA.linea}`,
					borderRadius: 8,
					background: SUPERFICIE,
					overflow: 'hidden',
					opacity: rotuloAsig.opacidad * estiloDeSalida(seVa(frame, 2, salida)).opacidad,
				}}
			>
				<div style={{ display: 'flex', height: B.cabecera, alignItems: 'center', background: PALETA.zona, boxShadow: `inset 0 -1px 0 ${PALETA.linea}`, fontSize: 17, fontWeight: 600, color: PALETA.textoSuave }}>
					<Celda ancho={COL.casilla} />
					<Celda ancho={COL.grupo}>Grupo</Celda>
					<Celda ancho={COL.asignatura}>Asignatura</Celda>
					<Celda ancho={COL.alumnos} derecha>Alumnos</Celda>
					<Celda ancho={COL.indicadores} derecha>{SUBUNIDADES}</Celda>
					<Celda ancho={COL.sinPasar} derecha>Sin pasar</Celda>
				</div>
				<div style={{ height: B.fila * ASIGNATURAS_DEL_LIBRO.length }} />
			</div>

			{ASIGNATURAS_DEL_LIBRO.map((a, i) => {
				const l = llega(frame, fps, i, TITULO + 40, 5);
				const f = estiloDeSalida(seVa(frame, 3 + i, salida));
				const marcada = !estado.fuera.includes(i);
				return (
					<div
						key={`${a.grupo}-${a.materia}`}
						style={{
							position: 'absolute',
							left: B.lados,
							top: Y_FILAS + B.fila * i,
							width: ANCHO_TABLA,
							height: B.fila,
							display: 'flex',
							alignItems: 'center',
							fontSize: 18,
							background: estado.encima === i ? '#f0f5ff' : marcada ? PALETA.zonaMarcada : SUPERFICIE,
							boxShadow: i === ASIGNATURAS_DEL_LIBRO.length - 1 ? 'none' : `inset 0 -1px 0 ${PALETA.linea}`,
							opacity: l.opacidad * f.opacidad,
							transform: `translate(${l.x + f.x}px, ${l.y}px)`,
						}}
					>
						<Celda ancho={COL.casilla}><Casilla marcada={marcada} senalada={estado.encima === i} /></Celda>
						<Celda ancho={COL.grupo}>{a.grupo}</Celda>
						<Celda ancho={COL.asignatura}>{a.materia}</Celda>
						<Celda ancho={COL.alumnos} derecha>{a.alumnos}</Celda>
						<Celda ancho={COL.indicadores} derecha>{a.indicadores}</Celda>
						<Celda ancho={COL.sinPasar} derecha>
							{a.indicadores === 0
								? <Pildora tono="nada">sin indicadores</Pildora>
								: <Pildora tono={a.sinPasar === 0 ? 'bien' : 'aviso'}>{a.sinPasar}</Pildora>}
						</Celda>
					</div>
				);
			})}

			{/* El pie: «Todas · Ninguna» y el botón que cuenta las hojas. */}
			<div
				style={{
					position: 'absolute',
					left: B.lados,
					top: Y_PIE,
					width: ANCHO_TABLA,
					height: B.pie,
					display: 'flex',
					alignItems: 'center',
					opacity: pie * fueraPie.opacidad,
					transform: `translateX(${fueraPie.x}px)`,
				}}
			>
				<span style={{ fontSize: 16, color: TEXTO_TENUE }}>
					<span style={{ color: ACENTO }}>Todas</span> · <span style={{ color: ACENTO }}>Ninguna</span>
				</span>
				<span style={{ flex: 1 }} />
				<BotonAnt
					primario
					ancho={330}
					alto={42}
					encima={estado.encima === 'descargar'}
					icono={estado.descargando ? <Girando frame={frame} tam={17} /> : <IconoBajar />}
				>
					{hojas === 0 ? 'Descargar el libro' : hojas === 1 ? 'Descargar el libro (1 hoja)' : `Descargar el libro (${hojas} hojas)`}
				</BotonAnt>
			</div>
		</div>
	);
};

const Rotulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ height: B.rotulo, fontSize: 15, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: TEXTO_TENUE }}>{children}</div>
);

const Celda: React.FC<{ ancho: number; derecha?: boolean; children?: React.ReactNode }> = ({ ancho, derecha = false, children }) => (
	<div style={{ width: ancho, height: '100%', display: 'flex', alignItems: 'center', justifyContent: derecha ? 'flex-end' : 'flex-start', padding: '0 14px', boxSizing: 'border-box', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
		{children}
	</div>
);

/** Un `nz-button`. El primario va azul; el de por defecto, blanco con borde. */
export const BotonAnt: React.FC<{
	children: React.ReactNode; icono?: React.ReactNode; primario?: boolean; encima?: boolean; ancho?: number; alto?: number; apagado?: boolean; peligro?: boolean; tam?: number;
}> = ({ children, icono, primario = false, encima = false, ancho, alto = 40, apagado = false, peligro = false, tam = 17 }) => (
	<span
		style={{
			width: ancho,
			height: alto,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			padding: ancho ? 0 : '0 16px',
			borderRadius: 7,
			boxSizing: 'border-box',
			fontSize: tam,
			fontWeight: primario ? 600 : 400,
			whiteSpace: 'nowrap',
			flexShrink: 0,
			border: `1px solid ${apagado ? BORDE : primario ? (encima ? '#4096ff' : ACENTO) : peligro ? PALETA.peligro : encima ? ACENTO : BORDE}`,
			background: apagado ? '#f5f5f5' : primario ? (encima ? '#4096ff' : ACENTO) : SUPERFICIE,
			color: apagado ? 'rgba(0,0,0,.25)' : primario ? '#fff' : peligro ? PALETA.peligro : encima ? ACENTO : TEXTO,
			boxShadow: primario && !apagado ? '0 2px 0 rgba(5,145,255,.1)' : 'none',
		}}
	>
		{icono}
		{children}
	</span>
);
