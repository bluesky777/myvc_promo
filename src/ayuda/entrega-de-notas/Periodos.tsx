/* Copia tal cual de `cierre-2/Periodos.tsx`, leyendo `./datos-periodos` (el periodo 3 en curso). Ver la cabecera de `datos-periodos.ts`. */
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import {
	ANCHO_CONTENIDO, ANCHO_TRAMO, ANIO, ARRIBA_LISTA, IZQ_CENTRO, NOMBRE_COLEGIO, NOMBRE_TRAMO, PANEL_ANCHO, PANEL_IZQ,
	PERIODOS, PESTANAS, PG, PISTA, QUE_PUEDEN, TRAMOS, Tramo, rectDelMenuMas,
} from './datos-periodos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL COLEGIO» CON LA PESTAÑA «PERIODOS». Un administrador que pulsa «El colegio» en el menú no ve
 * una pantalla intermedia: `/colegio` lo manda directo al año en curso y a esta pestaña
 * (`colegio.ts`, el efecto que redirige con `replaceUrl`). Por eso aquí se monta todo de una vez.
 *
 * TODO ESTÁ COLOCADO CON `position: absolute` a partir de `datos.ts`, no con flujo: el puntero y el
 * foco van a sitios calculados con esas mismas medidas, y un flujo que empuje dos píxeles los
 * dejaría señalando al lado.
 *
 * LOS COLORES DEL TRAMO son los de `colegio.scss`: verde para calificando, ámbar para nivelando y
 * gris para cerrado; los tramos ya pasados van con la letra apagada.
 */

const VERDE = { fondo: '#f0f4f0', letra: '#3f9142' };
const AMBAR = { fondo: '#fdf5e6', letra: '#a06000' };
const GRIS = { fondo: 'rgba(0,0,0,0.04)', letra: 'rgba(0,0,0,0.65)', raya: 'rgba(0,0,0,0.25)' };

const TITULO = 4;

export const Periodos: React.FC<{
	/** El tramo del periodo que se cierra, en este fotograma. */
	tramoDelQueSeCierra: Tramo;
	/** El segmento que el ratón tiene encima, o `null`. */
	senalado: { fila: number; tramo: Tramo } | null;
	/** La fila con el menú del «⋯» abierto y lo abierto que está (0-1). Sin esto, cerrado. */
	menuMas?: { fila: number; t: number } | null;
}> = ({ tramoDelQueSeCierra, senalado, menuMas = null }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cursorTitulo = escribiendo(frame, NOMBRE_COLEGIO, TITULO, 1) && frame % 20 < 12;
	const resto = entra(frame, fps, TITULO + 14, 12);

	return (
		<div style={{ position: 'relative', width: ANCHO_CONTENIDO, height: '100%', color: TEXTO }}>
			{/* ── La cabecera del año ── */}
			<div style={{ position: 'absolute', left: PG.lados, top: PG.arriba, height: PG.h1, fontSize: 28, fontWeight: 700, whiteSpace: 'pre' }}>
				{escrito(frame, NOMBRE_COLEGIO, TITULO, 1)}
				<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
			</div>
			<div style={{ position: 'absolute', left: PG.lados, top: PG.arriba + PG.h1 + 2, display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: TEXTO_TENUE, opacity: resto }}>
				Año {ANIO}
				<Etiqueta color={ACENTO}>el año en curso</Etiqueta>
			</div>

			<div style={{ position: 'absolute', right: PG.lados, top: PG.arriba + 6, display: 'flex', gap: 10, opacity: resto }}>
				<Caja ancho={180}>
					{ANIO} · en curso
					<Flecha />
				</Caja>
				<Boton>Todos los años</Boton>
				<Boton>Recargar</Boton>
			</div>

			{/* ── Las pestañas: una raya debajo de la marcada, sin fondo ── */}
			<div
				style={{
					position: 'absolute',
					left: PG.lados,
					right: PG.lados,
					top: PG.pestanas,
					height: PG.pestanasAlto,
					display: 'flex',
					gap: 30,
					boxShadow: `inset 0 -1px 0 ${BORDE}`,
					opacity: resto,
				}}
			>
				{PESTANAS.map((p, i) => (
					<div
						key={p}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							fontSize: 16,
							fontWeight: i === 0 ? 600 : 400,
							color: i === 0 ? ACENTO : TEXTO,
							boxShadow: i === 0 ? `inset 0 -2px 0 ${ACENTO}` : undefined,
							padding: '0 2px',
						}}
					>
						{i === 0 && <Calendario color={ACENTO} />}
						{p}
					</div>
				))}
			</div>

			{/* ── El panel ── */}
			<div
				style={{
					position: 'absolute',
					left: PANEL_IZQ,
					top: PG.panel,
					width: PANEL_ANCHO,
					height: ARRIBA_LISTA - PG.panel + PERIODOS.length * PG.fila + PG.panelRelleno,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					border: `1px solid ${BORDE}`,
					borderRadius: 10,
					opacity: entra(frame, fps, TITULO + 10, 14),
				}}
			>
				<div style={{ position: 'absolute', left: PG.panelRelleno, right: PG.panelRelleno, top: PG.panelRelleno, height: PG.cabecera, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<span style={{ fontSize: 20, fontWeight: 700 }}>Periodos de {ANIO}</span>
					<div style={{ height: 36, padding: '0 16px', borderRadius: 6, background: ACENTO, color: '#fff', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
						<span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Añadir periodo
					</div>
				</div>

				<div style={{ position: 'absolute', left: PG.panelRelleno, right: PG.panelRelleno, top: PG.panelRelleno + PG.cabecera + 10, height: PG.pista, fontSize: 15, lineHeight: '22px', color: TEXTO_TENUE }}>
					{conNegritas(PISTA)}
				</div>
			</div>

			{PERIODOS.map((p, i) => {
				const tramo = i === 1 ? tramoDelQueSeCierra : p.tramo;
				const nace = llega(frame, fps, i, TITULO + 20, 6);
				return (
					<div
						key={p.numero}
						style={{
							position: 'absolute',
							left: PANEL_IZQ + 1,
							width: PANEL_ANCHO - 2,
							top: ARRIBA_LISTA + i * PG.fila,
							height: PG.fila,
							boxShadow: `inset 0 1px 0 ${BORDE}${p.actual ? `, inset 3px 0 0 ${ACENTO}` : ''}`,
							opacity: nace.opacidad,
							transform: `translateY(${nace.y}px)`,
						}}
					>
						<div style={{ position: 'absolute', left: PG.panelRelleno + 4, top: 0, height: PG.fila, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
							<span style={{ fontSize: 18, fontWeight: 700 }}>Periodo {p.numero}</span>
							{p.actual && <Etiqueta color={ACENTO}>en curso</Etiqueta>}
						</div>

						<div style={{ position: 'absolute', left: IZQ_CENTRO - PANEL_IZQ - 1, top: PG.filaRelleno }}>
							<Mando tramo={tramo} senalado={senalado && senalado.fila === i ? senalado.tramo : null} />

							<div style={{ height: PG.fechasAlto, marginTop: 8, display: 'flex', alignItems: 'center', gap: 22, fontSize: 15 }}>
								<span>
									<Fecha>{p.inicio}</Fecha>
									<span style={{ color: TEXTO_TENUE, margin: '0 8px' }}>→</span>
									<Fecha>{p.fin}</Fecha>
								</span>
								<span style={{ color: TEXTO_TENUE, display: 'flex', alignItems: 'center', gap: 6 }}>
									<Calendario color={TEXTO_TENUE} />
									boletines
									{p.entrega ? <Fecha>{p.entrega}</Fecha> : <Fecha vacia>poner</Fecha>}
								</span>
							</div>

							<div style={{ height: PG.pieAlto, marginTop: 4, fontSize: 14.5, color: TEXTO_TENUE }}>
								<b style={{ fontWeight: 600, color: 'rgba(0,0,0,0.65)' }}>{frasePueden(tramo)}</b>
							</div>
						</div>

						<div style={{ position: 'absolute', right: PG.panelRelleno, top: 0, height: PG.fila, display: 'flex', alignItems: 'center', gap: 6 }}>
							<Boton pequeno>
								<Cuadricula /> Asignaturas
							</Boton>
							{p.actual ? (
								<div style={{ width: 140, textAlign: 'center', fontSize: 14.5, fontWeight: 600, color: ACENTO }}>en curso</div>
							) : (
								<Boton pequeno ancho={140}>Poner en curso</Boton>
							)}
							<div style={{ width: 34, textAlign: 'center', fontSize: 20, color: TEXTO_TENUE, letterSpacing: 1 }}>⋯</div>
						</div>
					</div>
				);
			})}

			{/* ── El menú del «⋯»: una sola entrada, en rojo (`nzDanger`) ── */}
			{menuMas && menuMas.t > 0 && (
				<div
					style={{
						position: 'absolute',
						...cajaDe(rectDelMenuMas(menuMas.fila)),
						boxSizing: 'border-box',
						background: SUPERFICIE,
						borderRadius: 8,
						boxShadow: '0 6px 16px rgba(0,0,0,.12), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
						padding: 4,
						opacity: menuMas.t,
						transform: `translateY(${(1 - menuMas.t) * -6}px)`,
					}}
				>
					<div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', fontSize: 15, color: '#ff4d4f' }}>
						<Papelera />
						Eliminar periodo {PERIODOS[menuMas.fila].numero}
					</div>
				</div>
			)}
		</div>
	);
};

const cajaDe = (r: { x: number; y: number; ancho: number; alto: number }) => ({ left: r.x, top: r.y, width: r.ancho, height: r.alto });

const Papelera: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 16 16">
		<path d="M2.5 4.2 H13.5 M6 4.2 V2.6 H10 V4.2 M4 4.2 L4.8 14 H11.2 L12 4.2 M6.8 6.8 V11.6 M9.2 6.8 V11.6" fill="none" stroke="#ff4d4f" strokeWidth="1.3" strokeLinejoin="round" />
	</svg>
);

/* EL MANDO: cuatro segmentos en una tira con borde. El de ahora es un rótulo con su color; los otros, botones. */
const Mando: React.FC<{ tramo: Tramo; senalado: Tramo | null }> = ({ tramo, senalado }) => {
	const ahora = TRAMOS.indexOf(tramo);
	const color = tramo === 'nivelando' ? AMBAR : tramo === 'cerrado' ? GRIS : VERDE;

	return (
		<div style={{ display: 'inline-flex', height: PG.tramoAlto, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, overflow: 'hidden', background: SUPERFICIE }}>
			{TRAMOS.map((t, i) => {
				const esAhora = t === tramo;
				return (
					<div
						key={t}
						style={{
							width: ANCHO_TRAMO[t],
							boxSizing: 'border-box',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 14,
							fontWeight: esAhora ? 600 : 400,
							borderLeft: i === 0 ? 'none' : `1px solid ${BORDE}`,
							background: esAhora ? color.fondo : senalado === t ? 'rgba(0,0,0,0.05)' : 'transparent',
							color: esAhora ? color.letra : i < ahora ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.65)',
							boxShadow: esAhora ? `inset 0 -2px 0 ${tramo === 'cerrado' ? GRIS.raya : color.letra}` : undefined,
							whiteSpace: 'nowrap',
						}}
					>
						{NOMBRE_TRAMO[t]}
					</div>
				);
			})}
		</div>
	);
};

/** `frasePueden`: «Profesores: » + la frase con minúscula, y su punto si no lo trae. */
export function frasePueden(t: Tramo): string {
	const f = QUE_PUEDEN[t];
	return `Profesores: ${f.charAt(0).toLowerCase()}${f.slice(1)}${f.endsWith('.') ? '' : '.'}`;
}

/** La pista lleva dos trozos en negrita, como en la plantilla. */
function conNegritas(texto: string): React.ReactNode {
	const negritas = ['en qué momento está el periodo', 'Pasar de calificar a nivelar es cerrar el periodo'];
	const partes: React.ReactNode[] = [];
	let resto = texto;
	negritas.forEach((n, i) => {
		const j = resto.indexOf(n);
		partes.push(resto.slice(0, j));
		partes.push(<b key={i} style={{ fontWeight: 600, color: 'rgba(0,0,0,0.65)' }}>{n}</b>);
		resto = resto.slice(j + n.length);
	});
	partes.push(resto);
	return partes;
}

const Etiqueta: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
	<span style={{ display: 'inline-block', fontSize: 13, lineHeight: '20px', padding: '0 8px', borderRadius: 4, color, background: `${color}12`, border: `1px solid ${color}55` }}>
		{children}
	</span>
);

const Fecha: React.FC<{ vacia?: boolean; children: React.ReactNode }> = ({ vacia = false, children }) => (
	<span style={{ color: vacia ? '#a06000' : TEXTO, borderBottom: `1px dashed ${BORDE}` }}>{children}</span>
);

const Caja: React.FC<{ ancho: number; children: React.ReactNode }> = ({ ancho, children }) => (
	<div style={{ width: ancho, height: 36, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, background: SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 15 }}>
		{children}
	</div>
);

const Boton: React.FC<{ pequeno?: boolean; ancho?: number; children: React.ReactNode }> = ({ pequeno = false, ancho, children }) => (
	<div
		style={{
			width: ancho,
			height: pequeno ? 32 : 36,
			boxSizing: 'border-box',
			padding: '0 14px',
			border: `1px solid ${BORDE}`,
			borderRadius: 6,
			background: SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 7,
			fontSize: pequeno ? 14.5 : 15,
			color: TEXTO,
			whiteSpace: 'nowrap',
		}}
	>
		{children}
	</div>
);

const Flecha: React.FC = () => (
	<svg width="12" height="12" viewBox="0 0 24 24">
		<path d="M5 9l7 7 7-7" fill="none" stroke={TEXTO_TENUE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const Calendario: React.FC<{ color: string }> = ({ color }) => (
	<svg width="16" height="16" viewBox="0 0 16 16">
		<rect x="2" y="3.2" width="12" height="10.6" rx="1.6" fill="none" stroke={color} strokeWidth="1.4" />
		<path d="M2 6.6 H14 M5.2 1.8 V4.4 M10.8 1.8 V4.4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
	</svg>
);

const Cuadricula: React.FC = () => (
	<svg width="14" height="14" viewBox="0 0 14 14">
		{[0, 7.6].map((x) => [0, 7.6].map((y) => <rect key={`${x}-${y}`} x={x + 0.7} y={y + 0.7} width="5" height="5" rx="1" fill="none" stroke={TEXTO} strokeWidth="1.3" />))}
	</svg>
);
