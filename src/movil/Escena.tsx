import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../comunes/Avatar';
import { Toque } from '../comunes/Toque';
import { ENCUADRE } from '../comunes/encuadre';
import { entra, llega, seVa } from '../comunes/movimiento';
import { BarraDeApp, BarraDeEstado, Telefono } from './Telefono';
import {
	ALTA, ANIO, ASIGNATURAS, ASISTENCIA, AVISO, DEL_COLEGIO, DIAS_SIN_VENIR, EL_HIJO, HIJOS, MINIMA,
	PERIODO, TITULAR,
} from './datos';
import {
	A_DEDO, A_PASO, A_TARJETAS, A_TITULO, A_TOCA, B_ENTRA, B_FILAS, B_PASO, C_DEDO, C_ENTRA,
	C_FILAS, C_PASO, C_TOCA, D_ENTRA, D_FILAS, D_PASO, PANTALLAS, PUSH, PUSH_DEDO, PUSH_TOCA,
	SALIDA,
} from './guion';
import { APAGADO, AUSENCIA, BARRA, BLANCO, ESTADO, FONDO, LINEA, PANTALLA, PRIMARIO, TARDANZA, TENUE, TINTA, FUENTE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA APP DE LOS ACUDIENTES, Y EL AVISO QUE LLEGA SOLO.
 *
 * LO QUE CUENTA, en una frase: **el padre no tuvo que preguntar**. Estaba mirando las notas de su
 * hijo y el teléfono le dijo que hoy no llegó al colegio. Un toque y ya está viendo qué días faltó.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL AVISO NO LLEVA LA NOTA DENTRO, Y ESO SE ENSEÑA A PROPÓSITO
 *
 * `docs/notificaciones.md` lo dice con todas las letras: una notificación se ve en la pantalla
 * bloqueada, en el bus, con gente al lado, y la nota de un menor no es algo que deba aparecer ahí.
 * El aviso nombra al alumno y el hecho -- «Se registró una ausencia de Mateo David hoy» -- y para ver
 * algo más hay que abrir la app y estar identificado. **Un clip que enseñara la nota en el aviso
 * vendería lo contrario de lo que el sistema hace bien.**
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS PANTALLAS ENTRAN DESLIZANDO, que es como navega un teléfono, y la que se va **no desaparece:
 * se retira un cuarto y se oscurece**. Es lo que dice que sigue debajo y que se puede volver. Un
 * corte seco entre dos pantallas de móvil se lee como dos capturas pegadas.
 */

const CONTENIDO_Y = ESTADO + BARRA;

/** Dónde está cada pantalla de la pila en este fotograma, y cuánto la tapa la de encima. */
function sitioDePantalla(i: number, frame: number, fps: number) {
	const mia = PANTALLAS[i];
	const siguiente = PANTALLAS[i + 1];

	if (frame < mia) { return null; }

	if (siguiente === undefined || frame < siguiente) {
		/* La primera no desliza: aparece con el teléfono, que ya es una entrada. */
		const p = i === 0 ? 1 : entra(frame, fps, mia, 18);
		return { x: (1 - p) * PANTALLA.ancho, sombra: 0 };
	}

	const q = entra(frame, fps, siguiente, 18);
	return { x: -0.26 * PANTALLA.ancho * q, sombra: 0.34 * q };
}

export const EscenaMovil: React.FC<{ conRotulo?: boolean }> = ({ conRotulo = false }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const aparece = entra(frame, fps, 0, 18);
	const fuera = seVa(frame, 0, SALIDA, 0, 20);

	const pantallas = [
		<MisHijos key="hijos" frame={frame} fps={fps} />,
		<Notas key="notas" frame={frame} fps={fps} />,
		<Asistencia key="asis" frame={frame} fps={fps} />,
		<Detalle key="det" frame={frame} fps={fps} />,
	];

	return (
		<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 32%, #f4f2fb 0%, #e6e3f2 58%, #dcd9ec 100%)', fontFamily: FUENTE }}>
			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					transform: `translateX(${conRotulo ? -420 : 0}px) scale(${ENCUADRE.movil * (conRotulo ? 0.94 : 1) * (1 - fuera * 0.04)})`,
					opacity: aparece * (1 - fuera),
				}}
			>
				<Telefono>
					{pantallas.map((pantalla, i) => {
						const sitio = sitioDePantalla(i, frame, fps);
						if (sitio === null) { return null; }

						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									inset: 0,
									transform: `translateX(${sitio.x}px)`,
									zIndex: 10 + i,
									boxShadow: i > 0 ? '-8px 0 24px rgba(0,0,0,.18)' : undefined,
								}}
							>
								{pantalla}
								{sitio.sombra > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${sitio.sombra})` }} />}
							</div>
						);
					})}

					<AvisoPush frame={frame} fps={fps} />

					{/* El dedo va por encima de todo: es el de fuera, no el de la aplicación. */}
					<Toque puntos={[{ frame: A_DEDO, x: 300, y: 640 }, { frame: A_TOCA - 4, x: 210, y: 218 }]} toques={[A_TOCA]} aparece={A_DEDO} sale={A_TOCA + 8} />
					<Toque puntos={[{ frame: PUSH_DEDO, x: 300, y: 300 }, { frame: PUSH_TOCA - 4, x: 210, y: 84 }]} toques={[PUSH_TOCA]} aparece={PUSH_DEDO} sale={PUSH_TOCA + 8} />
					<Toque puntos={[{ frame: C_DEDO, x: 300, y: 640 }, { frame: C_TOCA - 4, x: 296, y: 420 }]} toques={[C_TOCA]} aparece={C_DEDO} sale={C_TOCA + 8} />
				</Telefono>
			</AbsoluteFill>

			{conRotulo && <Rotulo frame={frame} />}
		</AbsoluteFill>
	);
};

/* ── 1: los dos hijos ─────────────────────────────────────────────────────────────────────── */

const MisHijos: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
	<div style={{ height: '100%', background: FONDO }}>
		<BarraDeEstado />
		<BarraDeApp titulo="Mi Cole Virtual" />

		<div style={{ padding: '20px 18px 0', opacity: entra(frame, fps, A_TITULO, 12) }}>
			<div style={{ fontSize: 21, fontWeight: 600, color: TINTA }}>Mis acudidos</div>
			<div style={{ fontSize: 15, color: TENUE, marginTop: 3 }}>Toca a uno para ver lo suyo</div>
		</div>

		<div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
			{HIJOS.map((h, i) => {
				const l = llega(frame, fps, i, A_TARJETAS, A_PASO);
				const tocado = i === EL_HIJO && frame >= A_TOCA && frame < A_TOCA + 10;

				return (
					<div
						key={h.nombre}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							padding: 16,
							borderRadius: 14,
							background: tocado ? '#f1eefb' : BLANCO,
							border: `1px solid ${LINEA}`,
							opacity: l.opacidad,
							transform: `translate(${l.x}px, ${l.y}px)`,
						}}
					>
						{/* TODO LISTADO DE PERSONAS LLEVA AVATAR: es la regla de la casa. */}
						<Avatar tipo={h.sexo} variante={i + 2} tam={54} />
						<div style={{ flex: 1, minWidth: 0 }}>
							<div style={{ fontSize: 18, fontWeight: 600, color: TINTA }}>{h.corto}</div>
							<div style={{ fontSize: 15, color: TENUE, marginTop: 2 }}>{h.grupo} · {h.parentesco}</div>
						</div>
						<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
							<path d="M9 5l7 7-7 7" fill="none" stroke={APAGADO} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				);
			})}

			{/*
			  * LO ÚLTIMO DEL COLEGIO, debajo de los hijos. No es relleno: es lo que hace que un acudiente
			  * abra la app **sin que le haya llegado un aviso**, que es la otra mitad de que la app se use.
			  */}
			<div style={{ marginTop: 8, opacity: entra(frame, fps, A_TARJETAS + A_PASO * 2 + 6, 14) }}>
				<div style={{ fontSize: 15, fontWeight: 600, color: TENUE, marginBottom: 10 }}>Del colegio</div>
				<div style={{ padding: 16, borderRadius: 14, background: BLANCO, border: `1px solid ${LINEA}` }}>
					<div style={{ fontSize: 17, fontWeight: 600 }}>{DEL_COLEGIO.titulo}</div>
					<div style={{ fontSize: 14, color: TENUE, marginTop: 4 }}>{DEL_COLEGIO.pie}</div>
				</div>
			</div>
		</div>
	</div>
);

/* ── 2: las notas ─────────────────────────────────────────────────────────────────────────── */

function colorDeNota(n: number): string {
	if (n < MINIMA) { return '#f11a00'; }
	if (n >= ALTA) { return '#2f9e5e'; }
	return TINTA;
}

const Notas: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
	<div style={{ height: '100%', background: FONDO }}>
		<BarraDeEstado />
		<BarraDeApp titulo={HIJOS[EL_HIJO].corto} volver />

		<div style={{ background: BLANCO, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: `1px solid ${LINEA}` }}>
			<Avatar tipo={HIJOS[EL_HIJO].sexo} variante={EL_HIJO + 2} tam={48} />
			<div>
				<div style={{ fontSize: 18, fontWeight: 600 }}>{HIJOS[EL_HIJO].grupo}</div>
				<div style={{ fontSize: 14, color: TENUE, marginTop: 2 }}>Titular: {TITULAR}</div>
			</div>
		</div>

		<div style={{ background: BLANCO, marginTop: 8, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			<span style={{ fontSize: 18, fontWeight: 600 }}>{PERIODO}</span>
			<span style={{ fontSize: 15, color: TENUE }}>{ANIO}</span>
		</div>

		<div style={{ background: BLANCO, marginTop: 8 }}>
			{ASIGNATURAS.map((a, i) => {
				const l = llega(frame, fps, i, B_FILAS, B_PASO);
				return (
					<div
						key={a.nombre}
						style={{
							display: 'flex', alignItems: 'center', justifyContent: 'space-between',
							padding: '17px 18px',
							borderBottom: i === ASIGNATURAS.length - 1 ? 'none' : `1px solid ${LINEA}`,
							opacity: l.opacidad,
							transform: `translate(${l.x}px, ${l.y}px)`,
						}}
					>
						<span style={{ fontSize: 17 }}>{a.nombre}</span>
						<span style={{ fontSize: 20, fontWeight: 700, color: colorDeNota(a.nota), fontVariantNumeric: 'tabular-nums' }}>{a.nota}</span>
					</div>
				);
			})}
		</div>
	</div>
);

/* ── 3: la asistencia ─────────────────────────────────────────────────────────────────────── */

const Asistencia: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const institucion = ASISTENCIA.tardanzasInstitucion + ASISTENCIA.ausenciasInstitucion;
	const clases = ASISTENCIA.tardanzasClases + ASISTENCIA.ausenciasClases;
	const l0 = llega(frame, fps, 0, C_FILAS, C_PASO);
	const l1 = llega(frame, fps, 1, C_FILAS, C_PASO);
	const tocado = frame >= C_TOCA && frame < C_TOCA + 10;

	return (
		<div style={{ height: '100%', background: FONDO }}>
			<BarraDeEstado />
			<BarraDeApp titulo="Asistencia" volver />

			{/*
			  * LAS DOS CUENTAS SEPARADAS, y la separación importa: **llegar tarde al colegio no es
			  * faltar a una clase**. Un alumno puede tener el colegio impecable y faltar a media
			  * asignatura, y juntarlo en un número escondería justo eso.
			  */}
			<div style={{ margin: '14px 14px 0', padding: '18px 16px', background: BLANCO, borderRadius: 14, border: `1px solid ${LINEA}`, display: 'flex', opacity: l0.opacidad, transform: `translateY(${l0.y}px)` }}>
				<div style={{ flex: 1, textAlign: 'center' }}>
					<div style={{ fontSize: 36, fontWeight: 700, color: institucion === 0 ? APAGADO : PRIMARIO }}>{institucion}</div>
					<div style={{ fontSize: 14, color: TENUE }}>Frente al colegio</div>
				</div>
				<div style={{ width: 1, background: LINEA }} />
				<div style={{ flex: 1, textAlign: 'center' }}>
					<div style={{ fontSize: 36, fontWeight: 700, color: clases === 0 ? APAGADO : PRIMARIO }}>{clases}</div>
					<div style={{ fontSize: 14, color: TENUE }}>A clases</div>
				</div>
			</div>

			<div style={{ margin: '12px 14px 0', padding: '16px 18px', background: BLANCO, borderRadius: 14, border: `1px solid ${PRIMARIO}66`, opacity: l1.opacidad, transform: `translateY(${l1.y}px)` }}>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
					<span style={{ fontSize: 18, fontWeight: 600 }}>{PERIODO}</span>
					<span style={{ fontSize: 13, color: PRIMARIO }}>en curso</span>
				</div>

				<div style={{ marginTop: 14, fontSize: 15.5, fontWeight: 600 }}>Frente a la institución</div>
				<div style={{ fontSize: 13.5, color: TENUE }}>Llegó tarde al colegio o no vino</div>

				<div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
					<Pastilla titulo="Tardanzas" cuantas={ASISTENCIA.tardanzasInstitucion} color={TARDANZA} />
					<Pastilla titulo="Ausencias" cuantas={ASISTENCIA.ausenciasInstitucion} color={AUSENCIA} realzada={tocado} />
				</div>

				<div style={{ marginTop: 18, fontSize: 15.5, fontWeight: 600 }}>A clases</div>
				<div style={{ fontSize: 13.5, color: TENUE }}>Por asignatura, dentro de la jornada</div>
				<div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
					<Pastilla titulo="Tardanzas" cuantas={0} color={TARDANZA} />
					<Pastilla titulo="Ausencias" cuantas={0} color={AUSENCIA} />
				</div>
			</div>
		</div>
	);
};

const Pastilla: React.FC<{ titulo: string; cuantas: number; color: string; realzada?: boolean }> = ({ titulo, cuantas, color, realzada = false }) => {
	const vivo = cuantas > 0;
	return (
		<div
			style={{
				flex: 1,
				padding: '11px 14px',
				borderRadius: 11,
				background: vivo ? `${color}26` : 'rgba(0,0,0,.04)',
				border: `1px solid ${vivo ? color : 'transparent'}`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				transform: `scale(${realzada ? 0.97 : 1})`,
			}}
		>
			<span style={{ fontSize: 14.5, color: vivo ? TINTA : APAGADO }}>{titulo}</span>
			<span style={{ fontSize: 20, fontWeight: 700, color: vivo ? color : APAGADO }}>{cuantas}</span>
		</div>
	);
};

/* ── 4: el detalle ────────────────────────────────────────────────────────────────────────── */

const Detalle: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
	<div style={{ height: '100%', background: FONDO }}>
		<BarraDeEstado />
		<BarraDeApp titulo="Ausencias" volver />

		<div style={{ padding: '18px 18px 8px', fontSize: 15, color: TENUE, opacity: entra(frame, fps, D_ENTRA + 14, 12) }}>
			Los días que no vino al colegio en el {PERIODO.toLowerCase()}.
		</div>

		<div style={{ padding: '6px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
			{DIAS_SIN_VENIR.map((d, i) => {
				const l = llega(frame, fps, i, D_FILAS, D_PASO);
				return (
					<div
						key={d.dia}
						style={{
							padding: '16px 16px',
							background: BLANCO,
							border: `1px solid ${LINEA}`,
							/* La barra va pegada: con las cuatro esquinas redondeadas se veía despegada del blanco. */
							borderLeft: `5px solid ${AUSENCIA}`,
							borderRadius: '4px 14px 14px 4px',
							opacity: l.opacidad,
							transform: `translate(${l.x}px, ${l.y}px)`,
						}}
					>
						<div style={{ fontSize: 17, fontWeight: 600 }}>{d.dia}</div>
						<div style={{ fontSize: 15.5, color: TINTA, marginTop: 4 }}>{d.detalle}</div>
						<div style={{ fontSize: 13.5, color: TENUE, marginTop: 4 }}>{d.extra}</div>
					</div>
				);
			})}

			<div style={{ marginTop: 6, padding: '14px 16px', fontSize: 14.5, color: TENUE, lineHeight: 1.45, opacity: entra(frame, fps, D_FILAS + D_PASO * 2 + 8, 14) }}>
				Si faltó por enfermedad, la excusa se entrega al director de grupo. Aquí se ve en cuanto
				la registran.
			</div>
		</div>
	</div>
);

/* ── El aviso ─────────────────────────────────────────────────────────────────────────────── */

/*
 * EL AVISO, TAL COMO SE VE EN LA PANTALLA. Baja desde arriba **encima de lo que se esté mirando**, y
 * ahí está lo que hay que enseñar: el acudiente no estaba buscando esto.
 */
const AvisoPush: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame < PUSH || frame > PUSH_TOCA + 16) { return null; }

	const baja = entra(frame, fps, PUSH, 18);
	const va = interpolate(frame - PUSH_TOCA, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const tocado = frame >= PUSH_TOCA && frame < PUSH_TOCA + 8;

	return (
		<div
			style={{
				position: 'absolute',
				top: 52,
				left: 12,
				right: 12,
				padding: '14px 15px',
				borderRadius: 20,
				background: 'rgba(255,255,255,.94)',
				boxShadow: '0 12px 30px rgba(0,0,0,.22)',
				display: 'flex',
				gap: 12,
				zIndex: 55,
				opacity: baja * (1 - va),
				transform: `translateY(${interpolate(baja, [0, 1], [-130, 0]) - va * 40}px) scale(${(tocado ? 0.98 : 1) * (0.96 + baja * 0.04)})`,
			}}
		>
			{/* El icono de la app: la birreta sobre el morado. */}
			<div style={{ width: 42, height: 42, borderRadius: 11, background: PRIMARIO, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
				<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
					<path d="M12 4 2 9l10 5 10-5z" fill="#fff" />
					<path d="M6 11.4V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
				</svg>
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
					<span style={{ fontSize: 14, fontWeight: 700, color: TINTA, letterSpacing: 0.2 }}>{AVISO.app}</span>
					<span style={{ fontSize: 13, color: TENUE }}>{AVISO.cuando}</span>
				</div>
				<div style={{ fontSize: 16.5, color: TINTA, marginTop: 4, lineHeight: 1.3 }}>{AVISO.texto}</div>
			</div>
		</div>
	);
};

/* ── El rótulo ────────────────────────────────────────────────────────────────────────────── */

const FRASES = [
	{ desde: 40, hasta: PUSH - 10, titulo: 'Los hijos, en la misma app.', pie: 'El acudiente entra una vez y ve lo de todos los suyos.' },
	{ desde: PUSH + 12, hasta: C_ENTRA + 10, titulo: 'No hay que preguntar.', pie: 'El aviso llega solo. Y nunca lleva la nota dentro: se ve en la pantalla bloqueada.' },
	{ desde: C_ENTRA + 40, hasta: SALIDA, titulo: 'Dos días sin venir al colegio.', pie: 'Del aviso al detalle, en un toque. Sin llamar a la secretaría.' },
];

const Rotulo: React.FC<{ frame: number }> = ({ frame }) => (
	<>
		{FRASES.map((f) => {
			const a = interpolate(frame, [f.desde, f.desde + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const b = interpolate(frame, [f.hasta, f.hasta + 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const o = a * b;
			if (o <= 0.001) { return null; }

			return (
				<div key={f.titulo} style={{ position: 'absolute', left: 1010, right: 96, top: 400, opacity: o, transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)` }}>
					<div style={{ fontSize: 48, fontWeight: 700, color: '#241f3d', letterSpacing: -0.6, lineHeight: 1.1 }}>{f.titulo}</div>
					<div style={{ fontSize: 27, color: '#5a5478', marginTop: 14, lineHeight: 1.4 }}>{f.pie}</div>
				</div>
			);
		})}
	</>
);
