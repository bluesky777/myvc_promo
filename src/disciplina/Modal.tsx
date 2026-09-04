import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

import { Avatar } from '../comunes/Avatar';
import { Cursor } from '../comunes/Cursor';
import { ENCUADRE } from '../comunes/encuadre';
import { entra, escribiendo, escrito } from '../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';
import { DESCRIPCION_NUEVA, MODAL, TIPOS, TIPO_ABIERTO } from './datos';
import {
	M_ABRE, M_CAMPOS, M_CIERRA, M_CLIC_DESCRIPCION, M_CLIC_GUARDAR, M_CURSOR, M_ESCRIBE,
	M_PASO_CAMPO, M_POR_TECLA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL DIÁLOGO DE CREAR UNA SITUACIÓN, Y **LO QUE ENSEÑA ES LO QUE YA VIENE PUESTO**.
 *
 * Se abre con el tipo elegido, la fecha, los testigos, el descargo, el profesor y los ordinales del
 * manual **ya rellenos**: todo eso lo sabe el sistema porque sabe desde dónde se pulsó. Lo único que
 * el coordinador tiene que escribir es **qué pasó**, que es lo único que el sistema no puede saber.
 *
 * Por eso el clip deja la descripción vacía y la teclea: si se abriera con todo lleno incluida la
 * descripción, no se vería la diferencia entre esto y un formulario en blanco.
 *
 * LOS ORDINALES SON DEL MANUAL DE CONVIVENCIA DEL COLEGIO, no de una lista escrita en el código: es
 * lo que convierte «se portó mal» en «incurrió en el ordinal II 7», que es lo que un colegio necesita
 * para sostener un proceso disciplinario.
 */

const M = {
	ancho: 1100,
	relleno: 32,
	cabecera: 64,
	huecoCabecera: 18,
	titulo: 34,
	huecoTitulo: 14,
	etiqueta: 24,
	campo: 48,
	descripcion: 92,
	hueco: 18,
	pie: 52,
};

const CONTENIDO = M.ancho - M.relleno * 2;
const MITAD = (CONTENIDO - 20) / 2;

/** Dónde empieza cada bloque, contando desde arriba de la tarjeta. El puntero necesita saberlo. */
const Y_TIPO = M.relleno + M.cabecera + M.huecoCabecera + M.titulo + M.huecoTitulo;
const Y_DESCRIPCION = Y_TIPO + M.etiqueta + M.campo + M.hueco;
const Y_FECHA = Y_DESCRIPCION + M.etiqueta + M.descripcion + M.hueco;
const Y_DESCARGO = Y_FECHA + M.etiqueta + M.campo + M.hueco;
const Y_ORDINALES = Y_DESCARGO + M.etiqueta + M.campo + M.hueco;
const Y_PIE = Y_ORDINALES + M.etiqueta + M.campo + M.hueco;

export const ALTO_MODAL = Y_PIE + M.pie + M.relleno;

const PUNTO_DESCRIPCION = { x: M.relleno + 60, y: Y_DESCRIPCION + M.etiqueta + 30 };
const PUNTO_GUARDAR = { x: M.ancho - M.relleno - 76, y: Y_PIE + M.pie / 2 };

const Etiqueta: React.FC<{ children: React.ReactNode; visible: number }> = ({ children, visible }) => (
	<div style={{ height: M.etiqueta, fontSize: 17, color: TEXTO_TENUE, opacity: visible }}>{children}</div>
);

const Caja: React.FC<{ alto?: number; enfocada?: boolean; visible: number; children: React.ReactNode }> = ({
	alto = M.campo, enfocada = false, visible, children,
}) => (
	<div
		style={{
			height: alto,
			display: 'flex',
			alignItems: alto > M.campo ? 'flex-start' : 'center',
			padding: alto > M.campo ? 12 : '0 14px',
			border: `1px solid ${enfocada ? ACENTO : BORDE}`,
			boxShadow: enfocada ? `0 0 0 3px ${ACENTO}22` : 'none',
			borderRadius: 7,
			fontSize: 20,
			color: TEXTO,
			background: SUPERFICIE,
			boxSizing: 'border-box',
			opacity: visible,
		}}
	>
		{children}
	</div>
);

export const Modal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame < M_ABRE - 2 || frame > M_CIERRA + 20) { return null; }

	const abre = entra(frame, fps, M_ABRE, 16);
	const cierra = interpolate(frame, [M_CIERRA, M_CIERRA + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const vivo = abre * (1 - cierra);

	const campo = (i: number) => entra(frame, fps, M_CAMPOS + i * M_PASO_CAMPO, 12);
	const dice = escrito(frame, DESCRIPCION_NUEVA, M_ESCRIBE, M_POR_TECLA);
	const enDescripcion = frame >= M_CLIC_DESCRIPCION;

	return (
		<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
			{/* El velo. Sin él, un diálogo sobre una tabla se lee como otra tarjeta más de la pantalla. */}
			<AbsoluteFill style={{ background: 'rgba(9, 17, 33, .48)', opacity: vivo }} />

			<div
				style={{
					position: 'relative',
					width: M.ancho,
					padding: M.relleno,
					borderRadius: 14,
					background: SUPERFICIE,
					boxShadow: '0 32px 90px rgba(9, 17, 33, .34)',
					boxSizing: 'border-box',
					opacity: vivo,
					transform: `scale(${ENCUADRE.dialogo * interpolate(abre, [0, 1], [0.92, 1]) * (1 - cierra * 0.04)}) translateY(${cierra * 24}px)`,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16, height: M.cabecera, marginBottom: M.huecoCabecera }}>
					<Avatar tipo={MODAL.sexo} variante={0} tam={52} />
					<span style={{ fontSize: 26, fontWeight: 600 }}>{MODAL.alumno}</span>
				</div>

				<div style={{ height: M.titulo, marginBottom: M.huecoTitulo, fontSize: 24, fontWeight: 600 }}>Crear nueva falta</div>

				{/* EL TIPO, con los tres a la vista: son tres y la pregunta que contestan no puede esconderse tras un clic. */}
				<Etiqueta visible={campo(0)}>Tipo de situación</Etiqueta>
				<div style={{ display: 'flex', height: M.campo, marginBottom: M.hueco, opacity: campo(0) }}>
					{TIPOS.map((t, i) => {
						const puesto = i === TIPO_ABIERTO;
						return (
							<div
								key={t.singular}
								style={{
									padding: '0 26px',
									display: 'flex',
									alignItems: 'center',
									fontSize: 19,
									fontWeight: puesto ? 600 : 400,
									border: `1px solid ${puesto ? ACENTO : BORDE}`,
									borderLeftWidth: i === 0 ? 1 : 0,
									borderRadius: i === 0 ? '7px 0 0 7px' : i === TIPOS.length - 1 ? '0 7px 7px 0' : 0,
									background: puesto ? ACENTO : SUPERFICIE,
									color: puesto ? '#fff' : TEXTO,
								}}
							>
								{t.singular}
							</div>
						);
					})}
				</div>

				{/*
				  * LA DESCRIPCIÓN ES LO ÚNICO VACÍO. Es lo único que el sistema no puede saber, y por eso es
				  * lo único que se teclea en el clip.
				  */}
				<Etiqueta visible={campo(1)}>Descripción</Etiqueta>
				<div style={{ marginBottom: M.hueco }}>
					<Caja alto={M.descripcion} enfocada={enDescripcion} visible={campo(1)}>
						{/*
						  * LA DESCRIPCIÓN VA EN NEGRITA Y MÁS GRANDE QUE EL RESTO DEL FORMULARIO, **a
						  * propósito desproporcionada**: es lo ÚNICO que se teclea en todo el diálogo y
						  * la única frase del clip que quien mira tiene que leer entera. Los demás campos
						  * están para verse llenos, no para leerse.
						  */}
						<span style={{ color: dice ? TEXTO : TEXTO_TENUE, fontSize: dice ? 27 : 20, fontWeight: dice ? 700 : 400 }}>
							{dice || 'Descripción de la falta'}
							{enDescripcion && escribiendo(frame, DESCRIPCION_NUEVA, M_ESCRIBE, M_POR_TECLA) && frame % 20 < 12 && (
								<span style={{ borderLeft: `2px solid ${TEXTO}`, marginLeft: 1 }} />
							)}
						</span>
					</Caja>
				</div>

				<div style={{ display: 'flex', gap: 20, marginBottom: M.hueco }}>
					<div style={{ width: MITAD }}>
						<Etiqueta visible={campo(2)}>Fecha</Etiqueta>
						<Caja visible={campo(2)}>{MODAL.fecha}</Caja>
					</div>
					<div style={{ width: MITAD }}>
						<Etiqueta visible={campo(3)}>Testigo(s)</Etiqueta>
						<Caja visible={campo(3)}>{MODAL.testigos}</Caja>
					</div>
				</div>

				<div style={{ display: 'flex', gap: 20, marginBottom: M.hueco }}>
					<div style={{ width: MITAD }}>
						<Etiqueta visible={campo(4)}>Descargo</Etiqueta>
						<Caja visible={campo(4)}>{MODAL.descargo}</Caja>
					</div>
					<div style={{ width: MITAD }}>
						<Etiqueta visible={campo(5)}>Profesor</Etiqueta>
						<Caja visible={campo(5)}>{MODAL.profesor}</Caja>
					</div>
				</div>

				<Etiqueta visible={campo(6)}>Ordinales en que incurrió</Etiqueta>
				<div style={{ height: M.campo, marginBottom: M.hueco, display: 'flex', alignItems: 'center', gap: 10, opacity: campo(6) }}>
					{MODAL.ordinales.map((o) => (
						<span
							key={o}
							style={{
								padding: '9px 16px',
								borderRadius: 20,
								fontSize: 18,
								background: TIPOS[TIPO_ABIERTO].tinte,
								border: `1px solid ${TIPOS[TIPO_ABIERTO].borde}`,
								color: TIPOS[TIPO_ABIERTO].legible,
							}}
						>
							{o}
						</span>
					))}
				</div>

				<div style={{ height: M.pie, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14, opacity: campo(7) }}>
					<span style={{ padding: '12px 24px', border: `1px solid ${BORDE}`, borderRadius: 7, fontSize: 19 }}>Cancelar</span>
					<span style={{ padding: '12px 30px', background: ACENTO, color: '#fff', borderRadius: 7, fontSize: 19, fontWeight: 600 }}>Guardar</span>
				</div>

				<Cursor
					puntos={[
						{ frame: M_CURSOR, x: M.ancho - 200, y: Y_DESCRIPCION + 200 },
						{ frame: M_CLIC_DESCRIPCION - 4, x: PUNTO_DESCRIPCION.x, y: PUNTO_DESCRIPCION.y },
						{ frame: M_CLIC_GUARDAR - 12, x: PUNTO_GUARDAR.x, y: PUNTO_GUARDAR.y },
					]}
					clics={[M_CLIC_DESCRIPCION, M_CLIC_GUARDAR]}
					aparece={M_CURSOR}
					sale={M_CLIC_GUARDAR + 4}
				/>
			</div>
		</AbsoluteFill>
	);
};
