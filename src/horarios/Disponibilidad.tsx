import React from 'react';
import { interpolate } from 'remotion';

import { Cursor } from '../comunes/Cursor';
import { ENCUADRE } from '../comunes/encuadre';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { DIAS_SEMANA, FRANJAS_SEMANA, SALONES, SALON_ELEGIDO, estaLibreEnIglesia } from './datos';
import {
	D_CUENTA, D_CURSOR, D_LISTA, D_MARCAS, D_PASO_LISTA, D_PASO_SALIDA, D_POR_MARCA, D_SALIDA,
	D_TABLA, D_TITULO,
} from './guion';
import { APAGADO, AZUL, AZUL_TINTE, INADECUADO, LINEA, PAPEL, TENUE, TINTA } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA DISPONIBILIDAD DE UN SALÓN, Y POR QUÉ ES LA PRIMERA PANTALLA DEL CLIP.
 *
 * Un clip que empezara generando enseñaría magia. Empezar aquí enseña lo contrario, que es lo que
 * hace que un coordinador se fíe: **primero se le dice al programa lo que NO puede hacer**. La
 * iglesia está ocupada toda la semana menos dos horas, y eso no lo adivina nadie -- se declara.
 *
 * UN CLIC RECORRE LOS TRES ESTADOS: en blanco «cuando sea», «?» es un PRECIO --el generador sólo
 * gasta una casilla así si sin ella no cuadra-- y «✕» es «aquí no». Aquí se usa el tercero, que es
 * el que el ejemplo pide.
 *
 * MARCAR NO DESCOLOCA NADA: dice que ahí no debería haber nada, que es distinto. Lo que ya esté
 * puesto encima puede ser una excepción que alguien negoció.
 */

const D = {
	relleno: 32,
	titulo: 106,
	tipos: 64,
	lista: 300,
	hueco: 24,
	hora: 80,
	dia: 130,
	cabecera: 46,
	fila: 52,
};

const ANCHO_TABLA = D.hora + D.dia * DIAS_SEMANA.length;
export const ANCHO_DISPONIBILIDAD = D.relleno * 2 + D.lista + D.hueco + ANCHO_TABLA;

const TABLA_X = D.relleno + D.lista + D.hueco;
const TABLA_Y = D.relleno + D.titulo + D.tipos;
const CELDAS_Y = TABLA_Y + D.cabecera;

/** El centro de una casilla, en coordenadas del panel. */
function centro(dia: number, franja: number) {
	return {
		x: TABLA_X + D.hora + D.dia * dia + D.dia / 2,
		y: CELDAS_Y + D.fila * (franja - 1) + D.fila / 2,
	};
}

/*
 * EL ORDEN EN QUE CAEN LAS ✕: el de lectura, saltándose las dos que quedan libres. **No son 33
 * clics**: es un barrido, que es como se marca de verdad una semana entera -- y treinta y tres clics
 * en un vídeo son diez segundos de nada.
 */
const ORDEN = FRANJAS_SEMANA.flatMap((franja) =>
	DIAS_SEMANA.map((_, dia) => ({ dia, franja })).filter((c) => !estaLibreEnIglesia(c.dia, c.franja)),
);

function marcadaEn(dia: number, franja: number): number | null {
	const i = ORDEN.findIndex((c) => c.dia === dia && c.franja === franja);
	return i === -1 ? null : D_MARCAS + i * D_POR_MARCA;
}

/** El puntero va de punta a punta de cada renglón, al compás de las marcas. */
const CAMINO = FRANJAS_SEMANA.flatMap((franja) => {
	const deLaFila = ORDEN.map((c, i) => ({ ...c, i })).filter((c) => c.franja === franja);
	const primera = deLaFila[0];
	const ultima = deLaFila[deLaFila.length - 1];
	return [
		{ frame: D_MARCAS + primera.i * D_POR_MARCA, ...centro(primera.dia, franja) },
		{ frame: D_MARCAS + ultima.i * D_POR_MARCA, ...centro(ultima.dia, franja) },
	];
});

export const Disponibilidad: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame > D_SALIDA + 56) { return null; }

	const panel = entra(frame, fps, 0, 14);
	const panelFuera = interpolate(frame, [D_SALIDA + 28, D_SALIDA + 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salidaTitulo = seVa(frame, 0, D_SALIDA, D_PASO_SALIDA);

	const puestas = ORDEN.filter((_, i) => frame >= D_MARCAS + i * D_POR_MARCA).length;

	return (
		<div style={{ transform: `scale(${ENCUADRE.horarioDatos * (1 - panelFuera * 0.03)})`, opacity: panel * (1 - panelFuera) }}>
			<div
				style={{
					position: 'relative',
					width: ANCHO_DISPONIBILIDAD,
					padding: D.relleno,
					borderRadius: 14,
					background: PAPEL,
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
					boxSizing: 'border-box',
					color: TINTA,
				}}
			>
				<div style={{ height: D.titulo, opacity: 1 - salidaTitulo, transform: `translateY(${-salidaTitulo * 26}px)` }}>
					<div style={{ fontSize: 30, fontWeight: 600, whiteSpace: 'pre' }}>
						{escrito(frame, 'La disponibilidad', D_TITULO, 2)}
						<span style={{ opacity: escribiendo(frame, 'La disponibilidad', D_TITULO, 2) && frame % 20 < 12 ? 1 : 0 }}>|</span>
					</div>
					<div style={{ fontSize: 18, color: TENUE, marginTop: 10, lineHeight: 1.4, opacity: entra(frame, fps, D_TITULO + 36, 12) }}>
						Un clic recorre los tres estados. <b style={{ color: INADECUADO.letra }}>✕</b> es «aquí no»,
						<b style={{ color: '#8a6d1f' }}> ?</b> es un precio y en blanco es «cuando sea».
					</div>
				</div>

				{/* Los tres tipos. El salón es el que menos se piensa y el que más manda. */}
				<div style={{ height: D.tipos, display: 'flex', gap: 10, alignItems: 'center', opacity: 1 - salidaTitulo }}>
					{['Docentes', 'Grupos', 'Salones'].map((t, i) => (
						<span
							key={t}
							style={{
								padding: '10px 20px',
								borderRadius: 8,
								fontSize: 18,
								border: `1px solid ${i === 2 ? AZUL : LINEA}`,
								background: i === 2 ? AZUL_TINTE : PAPEL,
								color: i === 2 ? AZUL : TENUE,
								fontWeight: i === 2 ? 600 : 400,
								opacity: entra(frame, fps, D_TITULO + 44 + i * 4, 10),
							}}
						>
							{t}
						</span>
					))}
				</div>

				<div style={{ display: 'flex', gap: D.hueco }}>
					{/* LA LISTA LLEVA SUS CUENTAS: es lo que dice de un vistazo a quién ya se le preguntó. */}
					<div style={{ width: D.lista, display: 'flex', flexDirection: 'column', gap: 6 }}>
						{SALONES.map((s, i) => {
							const llegada = llega(frame, fps, i, D_LISTA, D_PASO_LISTA);
							const fuera = estiloDeSalida(seVa(frame, i + 1, D_SALIDA, D_PASO_SALIDA));
							const elegido = i === SALON_ELEGIDO;
							const marcas = elegido ? (frame >= D_CUENTA ? puestas : 0) : s.marcas;

							return (
								<div
									key={s.nombre}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										padding: '13px 16px',
										borderRadius: 8,
										border: `1px solid ${elegido ? AZUL : LINEA}`,
										background: elegido ? AZUL_TINTE : PAPEL,
										fontSize: 19,
										fontWeight: elegido ? 600 : 400,
										color: elegido ? AZUL : TINTA,
										opacity: llegada.opacidad * fuera.opacidad,
										transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px)`,
									}}
								>
									{s.nombre}
									{marcas > 0 ? (
										<span style={{ fontSize: 16, color: INADECUADO.letra, fontWeight: 600 }}>{marcas} ✕</span>
									) : (
										<span style={{ fontSize: 15, color: APAGADO, fontStyle: 'italic' }}>sin marcar</span>
									)}
								</div>
							);
						})}
					</div>

					<div style={{ opacity: entra(frame, fps, D_TABLA, 14) * (1 - seVa(frame, SALONES.length + 1, D_SALIDA, D_PASO_SALIDA)) }}>
						<div style={{ display: 'flex', height: D.cabecera }}>
							<div style={{ width: D.hora }} />
							{DIAS_SEMANA.map((d, i) => (
								<div key={d} style={{ width: D.dia, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, opacity: entra(frame, fps, D_TABLA + 4 + i * 4, 10) }}>
									{d}
								</div>
							))}
						</div>

						{FRANJAS_SEMANA.map((franja) => (
							<div key={franja} style={{ display: 'flex', height: D.fila }}>
								<div style={{ width: D.hora, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: TENUE }}>
									{franja}ª
								</div>
								{DIAS_SEMANA.map((_, dia) => {
									const desde = marcadaEn(dia, franja);
									const puesta = desde !== null && frame >= desde;
									const pop = puesta ? entra(frame, fps, desde, 8) : 0;

									return (
										<div key={dia} style={{ width: D.dia, padding: 4, boxSizing: 'border-box' }}>
											<div
												style={{
													width: '100%',
													height: '100%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													borderRadius: 6,
													fontSize: 20,
													fontWeight: 600,
													border: `1px solid ${puesta ? INADECUADO.linea : LINEA}`,
													background: puesta ? INADECUADO.fondo : PAPEL,
													color: INADECUADO.letra,
													transform: `scale(${0.94 + pop * 0.06})`,
												}}
											>
												{puesta ? '✕' : ''}
											</div>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>

				<Cursor
					puntos={[{ frame: D_CURSOR, x: TABLA_X + ANCHO_TABLA - 40, y: CELDAS_Y - 60 }, ...CAMINO]}
					aparece={D_CURSOR}
					sale={D_CUENTA - 6}
					color={AZUL}
				/>
			</div>
		</div>
	);
};
