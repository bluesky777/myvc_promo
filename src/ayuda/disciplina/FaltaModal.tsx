import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, escribiendo, escrito } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ALUMNOS, HOY, LA_FILA, ORDINALES, TIPOS, type Situacion } from './datos';
import { COLUMNAS, D, FORM, IZQ, LISTA, OPCION, VISTA, enY } from './dialogo';
import { Boton, IconoLapiz, IconoMas, IconoVisto, ORDINAL_TEXTO } from './Rejilla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL DIÁLOGO DE SITUACIONES (`FaltaModal` de app2), en sus dos formas:
 *
 *   · ALTA, abierto con el «+»: el formulario ya está abierto en el periodo de la celda, y **hasta
 *     elegir el tipo no sale nada más** (`@if (forma.tipo)`). «Crear» guarda todo junto y, abierto
 *     con el «+», el diálogo se cierra solo.
 *   · EDICIÓN, abierto desde el detalle: primero las tres tablas; el lápiz abre «Editar falta» en
 *     el sitio de las tablas. Ahí **cada ordinal se guarda en el acto** («Ordinal asignado.») y lo
 *     demás sólo con «Guardar cambios».
 *
 * Sin título: la cabecera es la cara, el nombre al derecho («Nombres Apellidos») y el Id.
 */

export interface GuionDelDialogo {
	abre: number;
	cierra: number;
	modo: 'alta' | 'edicion';
	/** Alta: cuándo se pulsa el tipo, cuándo se pincha la descripción y el tecleo. */
	tipoEn?: number;
	desc?: { enfocaEn: number; empieza: number; porTecla: number; texto: string };
	/** Edición: cuándo se abre el formulario, el desplegable, qué se elige, y el descargo. */
	editaEn?: number;
	despliegaEn?: number;
	eligeEn?: number;
	descargo?: { enfocaEn: number; empieza: number; porTecla: number; texto: string };
	guardaEn?: number;
	/** Lo que la tabla tiene en cada momento (la situación nueva ya está al editar). */
	situaciones: Situacion[];
	/** El desplazamiento del cuerpo: se va a cada valor desde su fotograma, en 14. */
	scroll: { desde: number; y: number }[];
	/** Lo que el ratón tiene encima, por nombre. */
	senalado?: (frame: number) => string | null;
}

export function scrollEn(frame: number, s: { desde: number; y: number }[]): number {
	let y = 0;
	for (const p of s) {
		if (frame >= p.desde) {
			y = interpolate(frame, [p.desde, p.desde + 14], [y, p.y], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
		}
	}
	return y;
}

export const FaltaModal: React.FC<{ g: GuionDelDialogo }> = ({ g }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame < g.abre - 1 || frame > g.cierra + 16) { return null; }

	const abre = entra(frame, fps, g.abre, 14);
	const cierra = interpolate(frame, [g.cierra, g.cierra + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const vivo = abre * (1 - cierra);
	const scroll = scrollEn(frame, g.scroll);
	const sen = g.senalado?.(frame) ?? null;
	const alumno = ALUMNOS[LA_FILA];

	const enForm = g.modo === 'alta' || (g.editaEn !== undefined && frame >= g.editaEn && (g.guardaEn === undefined || frame < g.guardaEn));
	const conTipo = g.modo === 'edicion' || (g.tipoEn !== undefined && frame >= g.tipoEn);
	const campos = g.modo === 'edicion' ? 1 : g.tipoEn !== undefined ? entra(frame, fps, g.tipoEn + 2, 12) : 0;

	/* Lo escrito. En edición, la descripción ya está; el descargo se teclea. */
	const descripcion = g.modo === 'alta' && g.desc ? escrito(frame, g.desc.texto, g.desc.empieza, g.desc.porTecla) : g.situaciones[g.situaciones.length - 1].descripcion;
	const descargo = g.descargo ? escrito(frame, g.descargo.texto, g.descargo.empieza, g.descargo.porTecla) : '';
	const enDesc = g.desc !== undefined && frame >= g.desc.enfocaEn;
	const enDescargo = g.descargo !== undefined && frame >= g.descargo.enfocaEn && (g.guardaEn === undefined || frame < g.guardaEn - 4);
	const desplegado = g.despliegaEn !== undefined && frame >= g.despliegaEn && (g.eligeEn === undefined || frame < g.eligeEn + 4);
	const elegido = g.eligeEn !== undefined && frame >= g.eligeEn;

	/* Después de «Guardar cambios», la tabla enseña el descargo nuevo. */
	const guardado = g.guardaEn !== undefined && frame >= g.guardaEn;
	const filas = g.situaciones.map((s, i) => (i === g.situaciones.length - 1 && guardado && g.descargo ? { ...s, descargo: g.descargo.texto } : s));

	return (
		<AbsoluteFill style={{ zIndex: 10 }}>
			<AbsoluteFill style={{ background: 'rgba(9, 17, 33, .45)', opacity: vivo }} />

			<div
				style={{
					position: 'absolute',
					left: D.x,
					top: D.y,
					width: D.ancho,
					height: D.alto,
					borderRadius: 12,
					background: SUPERFICIE,
					boxShadow: '0 32px 90px rgba(9, 17, 33, .34)',
					opacity: vivo,
					transform: `scale(${interpolate(abre, [0, 1], [0.94, 1]) * (1 - cierra * 0.03)})`,
					color: TEXTO,
					overflow: 'hidden',
				}}
			>
				{/* La cabecera: la cara, «Nombres Apellidos» y el Id. */}
				<div style={{ height: D.cabecera, display: 'flex', alignItems: 'center', gap: 16, padding: `0 ${D.relleno}px`, borderBottom: `1px solid ${BORDE}`, boxSizing: 'border-box' }}>
					<Avatar tipo={alumno.sexo} variante={0} tam={56} />
					<div>
						<div style={{ fontSize: 26, fontWeight: 600 }}>{alumno.alReves}</div>
						<div style={{ fontSize: 16, color: TEXTO_TENUE, marginTop: 2 }}>Id: 20417</div>
					</div>
				</div>

				{/* El cuerpo, que se desplaza. */}
				<div style={{ position: 'absolute', top: D.cabecera, left: 0, width: D.ancho, height: VISTA, overflow: 'hidden' }}>
					<div style={{ position: 'absolute', top: -scroll, left: D.relleno, width: D.ancho - D.relleno * 2 }}>
						<Panel y={0} titulo="Periodo 1" />
						<Panel y={D.panel} titulo="Periodo 2" abierto />

						{enForm ? (
							<Formulario
								modo={g.modo}
								conTipo={conTipo}
								campos={campos}
								descripcion={descripcion}
								enDesc={enDesc && g.modo === 'alta'}
								cursorDesc={g.desc ? escribiendo(frame, g.desc.texto, g.desc.empieza, g.desc.porTecla) && frame % 20 < 12 : false}
								descargo={descargo}
								enDescargo={enDescargo}
								cursorDescargo={g.descargo ? escribiendo(frame, g.descargo.texto, g.descargo.empieza, g.descargo.porTecla) && frame % 20 < 12 : false}
								ordinales={elegido ? [ORDINAL_TEXTO(1)] : []}
								enOrdinales={desplegado}
								sen={sen}
							/>
						) : (
							<Lista filas={filas} sen={sen} />
						)}

						{(() => {
							const fin = enForm ? FORM.fin : LISTA.fin;
							return (
								<>
									<Panel y={fin} titulo="Periodo 3" />
									<Panel y={fin + D.panel} titulo="Periodo 4" />
								</>
							);
						})()}
					</div>
				</div>

				{/* El pie del diálogo. */}
				<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: D.pie, borderTop: `1px solid ${BORDE}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: `0 ${D.relleno}px`, background: SUPERFICIE }}>
					<Boton primario alto={38} icono={<IconoVisto />}>Aceptar</Boton>
				</div>
			</div>

			{/* EL DESPLEGABLE DE ORDINALES va por encima de todo, como el de Ant (se pinta en otra capa). */}
			{desplegado && (
				<div
					style={{
						position: 'absolute',
						left: IZQ,
						top: enY(FORM.ord + FORM.campo + 4, scroll),
						width: FORM.anchoCampo,
						background: SUPERFICIE,
						borderRadius: 8,
						boxShadow: '0 8px 28px rgba(0,0,0,.16), 0 2px 6px rgba(0,0,0,.08)',
						padding: '4px 0',
						opacity: entra(frame, fps, g.despliegaEn!, 8) * vivo,
						zIndex: 12,
					}}
				>
					{ORDINALES.map((_, i) => (
						<div key={i} style={{ height: OPCION, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 18, background: sen === `opcion-${i}` ? `${ACENTO}14` : 'transparent', color: TEXTO }}>
							{ORDINAL_TEXTO(i)}
						</div>
					))}
				</div>
			)}
		</AbsoluteFill>
	);
};

const Panel: React.FC<{ y: number; titulo: string; abierto?: boolean }> = ({ y, titulo, abierto = false }) => (
	<div style={{ position: 'absolute', top: y, left: 0, right: 0, height: D.panel, display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 600, borderBottom: `1px solid ${BORDE}`, background: abierto ? '#fafafa' : SUPERFICIE, paddingLeft: 12 }}>
		<svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: `rotate(${abierto ? 90 : 0}deg)` }}><path d="M4 2l4 4-4 4" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.6" strokeLinecap="round" /></svg>
		{titulo}
	</div>
);

const Rotulo: React.FC<{ y: number; children: React.ReactNode; tenue?: boolean }> = ({ y, children, tenue = false }) => (
	<div style={{ position: 'absolute', top: y, left: 0, height: 24, fontSize: 17, color: tenue ? TEXTO_TENUE : TEXTO }}>{children}</div>
);

const Campo: React.FC<{ y: number; alto?: number; ancho?: number; enfocado?: boolean; children?: React.ReactNode; vacio?: string }> = ({
	y, alto = FORM.campo, ancho = FORM.anchoCampo, enfocado = false, children, vacio,
}) => (
	<div
		style={{
			position: 'absolute',
			top: y,
			left: 0,
			width: ancho,
			height: alto,
			display: 'flex',
			alignItems: alto > FORM.campo ? 'flex-start' : 'center',
			flexWrap: 'wrap',
			gap: 6,
			padding: alto > FORM.campo ? '8px 12px' : '0 12px',
			border: `1px solid ${enfocado ? ACENTO : BORDE}`,
			boxShadow: enfocado ? `0 0 0 3px ${ACENTO}22` : 'none',
			borderRadius: 7,
			fontSize: 18,
			boxSizing: 'border-box',
			background: SUPERFICIE,
			color: TEXTO,
		}}
	>
		{children || <span style={{ color: '#bfbfbf' }}>{vacio}</span>}
	</div>
);

const Formulario: React.FC<{
	modo: 'alta' | 'edicion';
	conTipo: boolean;
	campos: number;
	descripcion: string;
	enDesc: boolean;
	cursorDesc: boolean;
	descargo: string;
	enDescargo: boolean;
	cursorDescargo: boolean;
	ordinales: string[];
	enOrdinales: boolean;
	sen: string | null;
}> = (p) => {
	const f = FORM;
	const caret = <span style={{ borderLeft: `2px solid ${TEXTO}`, height: 20, marginLeft: 1 }} />;

	return (
		<>
			<div style={{ position: 'absolute', top: f.titulo, left: 0, fontSize: 21, fontWeight: 600 }}>{p.modo === 'alta' ? 'Crear nueva falta' : 'Editar falta'}</div>

			<Rotulo y={f.tipoRotulo}>Elija el tipo de falta.</Rotulo>
			<div style={{ position: 'absolute', top: f.tipo, left: 0, display: 'flex' }}>
				{TIPOS.map((t, i) => {
					const puesto = p.conTipo && i === 0;
					return (
						<div
							key={t.singular}
							style={{
								width: f.anchoTipo,
								height: f.campo,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 18,
								border: `1px solid ${puesto || p.sen === `tipo-${i}` ? ACENTO : BORDE}`,
								marginLeft: i === 0 ? 0 : -1,
								borderRadius: i === 0 ? '7px 0 0 7px' : i === 2 ? '0 7px 7px 0' : 0,
								background: puesto ? ACENTO : SUPERFICIE,
								color: puesto ? '#fff' : p.sen === `tipo-${i}` ? ACENTO : TEXTO,
								boxSizing: 'border-box',
								position: 'relative',
								zIndex: puesto ? 1 : 0,
							}}
						>
							{t.singular}
						</div>
					);
				})}
			</div>

			{p.conTipo && (
				<div style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: p.campos }}>
					<Rotulo y={f.descRotulo}>Descripción</Rotulo>
					<Campo y={f.desc} alto={f.descAlto} enfocado={p.enDesc} vacio="Descripción de la falta">
						{p.descripcion && <span>{p.descripcion}{p.cursorDesc && caret}</span>}
					</Campo>

					<Rotulo y={f.fechaRotulo}>Fecha</Rotulo>
					<Campo y={f.fecha} ancho={260}>{HOY}</Campo>

					<Rotulo y={f.testRotulo}>Testigo(s)</Rotulo>
					<Campo y={f.test} vacio="Escriba nombre de testigo(s)" />

					<Rotulo y={f.descaRotulo}>Descargo</Rotulo>
					<Campo y={f.descargo} enfocado={p.enDescargo} vacio="Escriba la justificación del estudiante.">
						{p.descargo && <span>{p.descargo}{p.cursorDescargo && caret}</span>}
					</Campo>

					<div style={{ position: 'absolute', top: f.deriva, left: 0, height: 32, display: 'flex', alignItems: 'center', gap: 12, fontSize: 17 }}>
						Deriva de tardanzas
						<span style={{ width: 44, height: 22, borderRadius: 11, background: 'rgba(0,0,0,.25)', position: 'relative' }}>
							<span style={{ position: 'absolute', left: 2, top: 2, width: 18, height: 18, borderRadius: 9, background: '#fff' }} />
						</span>
					</div>

					<Rotulo y={f.profRotulo}>Profesor</Rotulo>
					<Campo y={f.prof} vacio="Elige un profesor" />

					<Rotulo y={f.ordRotulo}>Ordinales en que incurrió</Rotulo>
					<Campo y={f.ord} enfocado={p.enOrdinales} vacio="Elija los ordinales">
						{p.ordinales.length > 0 && p.ordinales.map((o) => (
							<span key={o} style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(0,0,0,.06)', border: `1px solid ${BORDE}`, fontSize: 16 }}>{o} ×</span>
						))}
					</Campo>
				</div>
			)}

			<div style={{ position: 'absolute', top: f.botones, right: 0, display: 'flex', gap: 10, opacity: p.modo === 'alta' ? 1 : 1 }}>
				<Boton alto={f.campo}>Cancelar</Boton>
				{p.modo === 'alta' ? (
					<span style={{ opacity: p.conTipo && p.descripcion ? 1 : 0.45 }}><Boton primario alto={f.campo} ancho={100} senalado={p.sen === 'crear'}>Crear</Boton></span>
				) : (
					<Boton primario alto={f.campo} ancho={180} senalado={p.sen === 'guardar'}>Guardar cambios</Boton>
				)}
			</div>
		</>
	);
};

const Lista: React.FC<{ filas: Situacion[]; sen: string | null }> = ({ filas, sen }) => {
	const t = TIPOS;
	return (
		<>
			<div style={{ position: 'absolute', top: LISTA.t1, left: 0, fontSize: 20, fontWeight: 600 }}>{t[0].plural}</div>
			<div style={{ position: 'absolute', top: LISTA.cabeceraTabla, left: 0, display: 'flex', height: 36, background: '#fafafa', borderBottom: `1px solid ${BORDE}`, fontSize: 16, fontWeight: 600 }}>
				{COLUMNAS.map((c) => (
					<div key={c.t} style={{ width: c.ancho, display: 'flex', alignItems: 'center', paddingLeft: 10, boxSizing: 'border-box' }}>{c.t}</div>
				))}
			</div>
			{filas.map((s, i) => {
				const valores = [String(i + 1), s.descripcion, s.fecha, s.docente ?? '', s.descargo ?? '', s.testigos ?? ''];
				return (
					<div key={i} style={{ position: 'absolute', top: LISTA.filas + i * LISTA.fila, left: 0, display: 'flex', height: LISTA.fila, borderBottom: `1px solid ${BORDE}`, fontSize: 16, alignItems: 'center' }}>
						{valores.map((v, c) => (
							<div key={c} style={{ width: COLUMNAS[c].ancho, paddingLeft: 10, boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</div>
						))}
						<div style={{ width: 36, display: 'flex', gap: 6 }}>
							<span style={{ width: 32, height: 30, border: `1px solid ${sen === `lapiz-${i}` ? ACENTO : BORDE}`, color: sen === `lapiz-${i}` ? ACENTO : TEXTO, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}><IconoLapiz /></span>
						</div>
					</div>
				);
			})}

			<div style={{ position: 'absolute', top: 276, left: 0, fontSize: 20, fontWeight: 600 }}>{t[1].plural}</div>
			<div style={{ position: 'absolute', top: 306, left: 0, fontSize: 17, color: TEXTO_TENUE }}>No tiene {t[1].plural}</div>
			<div style={{ position: 'absolute', top: 346, left: 0, fontSize: 20, fontWeight: 600 }}>{t[2].plural}</div>
			<div style={{ position: 'absolute', top: 376, left: 0, fontSize: 17, color: TEXTO_TENUE }}>No tiene {t[2].plural}</div>

			<div style={{ position: 'absolute', top: LISTA.crear, left: 0 }}>
				<Boton primario alto={38} icono={<IconoMas />}>Crear nueva</Boton>
			</div>
		</>
	);
};
