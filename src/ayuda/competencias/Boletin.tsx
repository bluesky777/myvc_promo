import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, llega } from '../../comunes/movimiento';
import { ALUMNO, AreaDelBoletin, BOLETIN, COLEGIO, HOJA, SIN_DESEMPENOS } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL BOLETÍN POR COMPETENCIAS (tipo 6). **El papel que hay hoy, no el que prometen los textos.**
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LO QUE CUELGA DE CADA ASIGNATURA ES UNA LISTA PLANA DE FRASES
 *
 * Hubo una versión con la competencia arriba, sus desempeños debajo, un medidor de cuatro tramos y
 * un icono por renglón. Ya no: competencia y desempeño resultaron ser la misma cosa, y el nivel se
 * deriva de la definitiva, así que **ya está impreso arriba** --«ALTO 88»--. Repetirlo en cada
 * renglón era imprimir el mismo dato cinco veces.
 *
 * Así que el renglón **es** el desempeño: una frase, a 8 pt, colgando de un hilo punteado. Y la
 * frase llega entera del servidor, con el prefijo de la banda ya puesto --«Fortaleza en…»,
 * «Dificultad en…»--: eso es lo que dice el nivel dentro del texto, y es la razón de que los
 * desempeños se escriban en sintagma nominal y no en verbo conjugado.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LO DEMÁS ES EL BOLETÍN DE SIEMPRE
 *
 * Mismo membrete, misma franja del estudiante, mismas firmas. Lo único que cambia es qué cuelga de
 * cada asignatura -- y eso es exactamente lo que el vídeo tiene que hacer ver: donde antes había
 * unidades numeradas con su porcentaje y su nota, ahora hay frases.
 *
 * LA HOJA SE DIBUJA A SU TAMAÑO REAL (740 × 980, la caja útil de una Letter con 10 mm de margen) y
 * se encoge en el encuadre. Dibujarla ya pequeña habría dejado las letras a tamaños que en el papel
 * no existen, y lo que el docente tiene que reconocer es **la hoja que va a imprimir**.
 */

/* Los colores del papel, los de `papel.scss` de la aplicación. */
const AZUL = '#1f4e79';
const AZUL_TEXTO = '#173859';
const AZUL_SUAVE = '#9db8d2';
const BANDA = '#dae7f5';
const GUIA = '#a8bccf';
const GRIS = '#5c6b7a';
const ROJO = '#8a0000';
const ROJO_TENUE = '#fbecec';

/** Los dos anchos fijos de la cabecera de asignatura, en píxeles como en la aplicación. */
const ANCHO_NIVEL = 66;
const ANCHO_NOTA = 34;

export const Boletin: React.FC<{
	/** Cuándo empieza a montarse la hoja. */
	desde: number;
}> = ({ desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const hoja = entra(frame, fps, desde, 16);


	return (
		<div
			style={{
				width: HOJA.ancho,
				height: HOJA.alto,
				padding: '22px 18px',
				boxSizing: 'border-box',
				background: '#fff',
				color: '#000',
				fontSize: 12,
				lineHeight: 1.28,
				borderRadius: 4,
				boxShadow: '0 24px 64px rgba(15, 28, 52, .18), 0 2px 8px rgba(15, 28, 52, .07)',
				opacity: hoja,
				transform: `translateY(${(1 - hoja) * 18}px)`,
			}}
		>
			<Membrete />
			<FranjaDelEstudiante />

			{/* Las áreas van llegando en cascada, como cualquier lista de la casa. */}
			{BOLETIN.map((area, i) => (
				<Area key={area.area} area={area} orden={i} desde={desde} />
			))}

			<Pie desde={desde} />
		</div>
	);
};

/*
 * EL MEMBRETE. Logo a la izquierda, los títulos al centro con la pastilla azul del tipo de papel, y
 * la foto del alumno a la derecha -- que sólo sale si el colegio la tiene encendida y el alumno
 * tiene foto. Aquí va dibujada, como en todos los clips.
 */
const Membrete: React.FC = () => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 10, borderBottom: `1px solid ${AZUL_SUAVE}` }}>
		<div style={{ width: 56, height: 56, borderRadius: 4, background: BANDA, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AZUL, fontWeight: 700, fontSize: 15 }}>
			{COLEGIO.abreviatura}
		</div>

		<div style={{ flex: 1, textAlign: 'center' }}>
			<div style={{ fontSize: 17, fontWeight: 700, color: '#000' }}>
				{COLEGIO.nombre} - {COLEGIO.abreviatura}
			</div>
			<div style={{ fontSize: 9, color: GRIS, marginTop: 2 }}>{COLEGIO.resolucion}</div>
			<div
				style={{
					display: 'inline-block',
					marginTop: 6,
					padding: '3px 14px',
					borderRadius: 999,
					background: BANDA,
					color: AZUL_TEXTO,
					fontSize: 13,
					fontWeight: 600,
					letterSpacing: 0.8,
				}}
			>
				{COLEGIO.pastilla}
			</div>
		</div>

		<div style={{ width: 56, height: 56, borderRadius: 4, border: `1px solid ${AZUL_SUAVE}`, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: '#eef3f9' }}>
			<Avatar tipo="mujer" variante={0} tam={54} />
		</div>
	</div>
);

/*
 * LA FRANJA DEL ESTUDIANTE. Sin recuadro y sin fondo, a propósito: en el papel es un renglón de
 * datos, no una caja. A la izquierda el grupo y el titular; a la derecha el nombre y el puntaje.
 */
const FranjaDelEstudiante: React.FC = () => (
	<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '8px 0 10px', fontSize: 11 }}>
		<div>
			<div>
				Grupo: <b>{ALUMNO.grupo}</b>
			</div>
			<div style={{ marginTop: 2 }}>Titular: {ALUMNO.titular}</div>
		</div>
		<div style={{ textAlign: 'right' }}>
			<div style={{ fontSize: 16, fontWeight: 700 }}>{ALUMNO.apellidosYNombres}</div>
			<div style={{ marginTop: 2 }}>{ALUMNO.puntaje}</div>
		</div>
	</div>
);

/*
 * UN ÁREA: su banda azul y, sangradas 12 px, sus asignaturas. La banda es el único fondo del cuerpo
 * de la hoja; dentro de ella las asignaturas pierden el suyo, porque dos fondos anidados en un
 * papel en blanco y negro se leen como una sola mancha.
 */
const Area: React.FC<{ area: AreaDelBoletin; orden: number; desde: number }> = ({ area, orden, desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const nace = llega(frame, fps, orden, desde + 10, 7);

	return (
		<div style={{ opacity: nace.opacidad, transform: `translateY(${nace.y}px)` }}>
			<div
				style={{
					padding: '2px 6px',
					margin: '10px 0 4px',
					background: BANDA,
					color: AZUL_TEXTO,
					borderBottom: `1.2px solid ${AZUL}`,
					borderLeft: `3px solid ${AZUL}`,
					fontSize: 11,
					fontWeight: 700,
					letterSpacing: 0.7,
				}}
			>
				{area.area}
			</div>

			<div style={{ marginLeft: 12 }}>
				{area.asignaturas.map((a) => (
					<div key={a.materia} style={{ marginBottom: 8 }}>
						{/* La cabecera de la asignatura: cuatro celdas, y las dos últimas de ancho fijo. */}
						<div
							style={{
								display: 'flex',
								alignItems: 'baseline',
								gap: 6,
								padding: '1px 4px',
								borderLeft: `2px solid ${AZUL}`,
								borderBottom: `0.8px solid ${AZUL_SUAVE}`,
								borderRadius: '3px 3px 0 0',
								fontWeight: 700,
							}}
						>
							<span style={{ flex: '1 1 auto', fontSize: 12 }}>
								{a.materia}
								<span style={{ fontSize: 11, fontStyle: 'italic', fontWeight: 400, marginLeft: 4 }}>
									- Prof. {a.profesor}
								</span>
							</span>
							<span style={{ fontSize: 11, color: GRIS, whiteSpace: 'nowrap', fontWeight: 400 }}>
								A:{a.ausencias} / T:{a.tardanzas}
							</span>
							<span
								style={{
									width: ANCHO_NIVEL,
									textAlign: 'center',
									fontSize: 11,
									color: a.perdida ? ROJO : '#000',
									background: a.perdida ? ROJO_TENUE : undefined,
									boxShadow: a.perdida ? `inset 0 0 0 1px ${ROJO}` : undefined,
									borderRadius: 2,
								}}
							>
								{a.nivel}
							</span>
							<span style={{ width: ANCHO_NOTA, textAlign: 'right', fontSize: 12, color: a.perdida ? ROJO : '#000' }}>
								{a.nota}
							</span>
						</div>

						{/*
						  * Y LO QUE CUELGA: el hilo punteado y las frases. Cuando no hay ninguna, el
						  * relleno lo dice con palabras -- y eso no es un fallo del boletín, es que el
						  * colegio todavía no escribió el plan de esa asignatura.
						  */}
						<div style={{ marginLeft: 10, paddingLeft: 8, borderLeft: `1px dotted ${GUIA}` }}>
							{a.desempenos.map((texto) => (
								<div key={texto} style={{ paddingLeft: 12, fontSize: 11, paddingTop: 1 }}>
									{texto}
								</div>
							))}
							{a.desempenos.length === 0 && (
								<div style={{ paddingLeft: 12, fontSize: 10, fontStyle: 'italic', color: GRIS, paddingTop: 1 }}>
									{SIN_DESEMPENOS}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

/*
 * EL PIE: las dos firmas con su hueco fijo --si una se apaga, la otra no sube-- y la leyenda de las
 * escalas, que es la que permite leer «ALTO» sin saberse la escala del colegio de memoria.
 */
const Pie: React.FC<{ desde: number }> = ({ desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const nace = entra(frame, fps, desde + 46, 16);

	return (
		<div style={{ marginTop: 22, opacity: nace }}>
			<div style={{ display: 'flex', justifyContent: 'space-around', gap: 40, marginBottom: 14 }}>
				{[
					{ nombre: 'Villalba Mora, Jorge Enrique', cargo: 'Rector' },
					{ nombre: ALUMNO.titular, cargo: 'Titular' },
				].map((f) => (
					<div key={f.cargo} style={{ flex: 1, textAlign: 'center' }}>
						<div style={{ height: 26 }} />
						<div style={{ borderTop: `1px solid ${GRIS}`, paddingTop: 3, fontSize: 11 }}>{f.nombre}</div>
						<div style={{ fontSize: 10, color: GRIS }}>{f.cargo}</div>
					</div>
				))}
			</div>

			<div style={{ fontSize: 10, color: '#444', lineHeight: 1.35, borderTop: `1px solid ${AZUL_SUAVE}`, paddingTop: 8 }}>
				<div>
					<b>A:</b> Ausencias. <b>T:</b> Tardanzas. <b>Valoración:</b> según la escala nacional, siendo 60 la nota
					mínima aprobatoria.
				</div>
				<div style={{ marginTop: 2 }}>
					<b>D. BAJO:</b> de 0 a 59 · <b>D. BÁSICO:</b> de 60 a 79 · <b>D. ALTO:</b> de 80 a 94 ·{' '}
					<b>D. SUPERIOR:</b> de 95 a 100
				</div>
			</div>
		</div>
	);
};
