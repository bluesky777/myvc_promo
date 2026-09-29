import React from 'react';

import { ACENTO, BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { MEDIDAS } from '../medidas';
import { ALTO_CONTROL, Boton, Campo, Cara, Casilla, Etiqueta, Ficha, Icono, LETRA, PELIGRO, Panel, Selector, TINTE } from './ant';
import { CONTENIDO } from './planoAsignaturas';
import {
	BOTON_CAMBIAR, BOTON_CREAR_GRUPO, BOTON_JUNTAR, BOTON_RECARGAR, BOTON_SEPARAR, CABECERA_PAGINA, COLUMNAS_GRUPOS, JUNTOS, MAIN,
	colocada, disposicionGrupos, fichasDelEditor, rectCampoGrupo,
	type EstadoGrupos, type FichaGrupo, type FilaGrupo, type Juntos,
} from './planoGrupos';
import { Corte, Rejilla, type FilaDeRejilla } from './Rejilla';
import { DOCENTES, GRUPOS, grupo as grupoPorNombre } from './reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * REFERENCIAS ▸ GRUPOS, con el recuadro «Grupos que van siempre juntos» encima de la rejilla.
 *
 * Como `Asignaturas.tsx`: no sabe de tiempo, pinta el estado donde dice `disposicionGrupos()`.
 * Los textos son los de `grupos.html` y `grupos-juntos.html` tal cual, también la frase que el
 * editor escribe mientras se eligen («… recibirán todas sus clases a la vez, como un solo grupo.»).
 */

export const PantallaGrupos: React.FC<{ estado: EstadoGrupos; opacidad?: number }> = ({ estado: e, opacidad = 1 }) => {
	const d = disposicionGrupos(e);
	const arriba = (MAIN.y - MEDIDAS.barra) - (e.desplazada ?? 0);

	return (
		<div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f5f7fa' }}>
			<div
				style={{
					position: 'absolute',
					left: CONTENIDO.x - MEDIDAS.menu,
					top: CONTENIDO.y - MEDIDAS.barra - (e.desplazada ?? 0),
					width: CONTENIDO.ancho,
					height: d.fin + 60,
					background: '#fff',
					border: `1px solid ${BORDE}`,
					borderRadius: 10,
					boxSizing: 'border-box',
				}}
			/>

			<div style={{ position: 'absolute', left: MAIN.x - MEDIDAS.menu, top: arriba, width: MAIN.ancho, opacity: opacidad }}>
				<div style={{ position: 'absolute', top: 0, left: 0, width: MAIN.ancho, height: CABECERA_PAGINA, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div style={{ fontSize: 26, fontWeight: 600, color: TEXTO }}>Grupos</div>
					<div style={{ display: 'flex', gap: 8 }}>
						<Boton texto="Recargar" icono="reload" ancho={BOTON_RECARGAR} />
						<Boton texto="Crear grupo" icono="plus" tipo="primary" ancho={BOTON_CREAR_GRUPO} encima={e.encimaCrear} />
					</div>
				</div>

				{e.ficha && d.ficha && (
					<div style={{ position: 'absolute', top: d.ficha.y, left: 0, opacity: e.ficha.aparece ?? 1, transform: `translateY(${(1 - (e.ficha.aparece ?? 1)) * -10}px)` }}>
						<VistaDeLaFicha ficha={e.ficha} busqueda={e.desplegable?.donde === 'titular' ? e.desplegable.busqueda ?? null : null} cursorBusqueda={Boolean(e.desplegable?.cursor)} />
					</div>
				)}

				<div style={{ position: 'absolute', top: d.juntos.y, left: 0 }}>
					<VistaDeJuntos juntos={e.juntos} alto={d.juntos.alto} />
				</div>

				<div style={{ position: 'absolute', top: d.pista, left: 0, fontSize: LETRA - 1.5, color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
					Haz clic en una celda para editarla. Se guarda al salir.
				</div>

				<div style={{ position: 'absolute', top: d.rejilla.y, left: 0 }}>
					<Rejilla columnas={COLUMNAS_GRUPOS} filas={e.filas.map(filaDeRejilla)} ancho={MAIN.ancho} alto={d.rejilla.alto} desplazada={e.desplazadaRejilla ?? 0} />
				</div>
			</div>

			{e.desplegable && (() => {
				const campo = rectCampoGrupo(e, e.desplegable.donde);
				return (
					<div style={{ position: 'absolute', left: campo.x - MEDIDAS.menu, top: campo.y + campo.alto + 4 - MEDIDAS.barra, zIndex: 5 }}>
						<Panel opciones={e.desplegable.opciones} resaltada={e.desplegable.resaltada} elegida={e.desplegable.elegida} ancho={campo.ancho} aparece={e.desplegable.aparece ?? 1} visibles={e.desplegable.visibles} desplazada={e.desplegable.desplazada} />
					</div>
				);
			})()}
		</div>
	);
};

/* ── La ficha «Nuevo grupo» ─────────────────────────────────────────────────────────────────── */

const VistaDeLaFicha: React.FC<{ ficha: FichaGrupo; busqueda?: string | null; cursorBusqueda?: boolean }> = ({ ficha: f, busqueda = null, cursorBusqueda = false }) => {
	const activo = (c: string) => f.activo === c;
	const cursor = (c: string) => activo(c) && Boolean(f.cursor);
	return (
		<Ficha titulo="Nuevo grupo" ancho={MAIN.ancho}>
			<div style={{ position: 'relative', height: Math.max(...['nombre', 'ih', 'botones'].map((k) => colocada(k).y + colocada(k).alto)) }}>
				<Lugar clave="nombre"><Etiqueta texto="Nombre" obligatorio /><Campo valor={f.nombre} foco={activo('nombre')} cursor={cursor('nombre')} /></Lugar>
				<Lugar clave="abrev"><Etiqueta texto="Abreviatura" /><Campo valor={f.abrev} foco={activo('abrev')} cursor={cursor('abrev')} /></Lugar>
				<Lugar clave="grado"><Etiqueta texto="Grado" obligatorio /><Selector marcador="" valor={f.grado} abierto={activo('grado')} /></Lugar>
				<Lugar clave="titular">
					<Etiqueta texto="Titular" />
					<Selector marcador="Buscar un docente…" valor={f.titular ? DOCENTES[f.titular].nombre : null} cara={f.titular} abierto={activo('titular')} busqueda={activo('titular') ? busqueda : null} cursor={cursorBusqueda} />
				</Lugar>
				<Lugar clave="valormatricula"><Etiqueta texto="Valor matrícula" /><Campo valor={f.valormatricula} foco={activo('valormatricula')} cursor={cursor('valormatricula')} /></Lugar>
				<Lugar clave="valorpension"><Etiqueta texto="Valor pensión" /><Campo valor={f.valorpension} foco={activo('valorpension')} cursor={cursor('valorpension')} /></Lugar>
				<Lugar clave="orden"><Etiqueta texto="Orden" /><Campo valor={f.orden} foco={activo('orden')} cursor={cursor('orden')} /></Lugar>
				<Lugar clave="ih">
					<Etiqueta texto="IH semanal" />
					<Campo valor={f.ih} marcador="Sin definir" foco={activo('ih')} cursor={cursor('ih')} />
					<div style={{ fontSize: LETRA - 1.5, lineHeight: '19px', color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>Horas de clase a la semana. En blanco = sin definir.</div>
				</Lugar>
				<Lugar clave="caritas"><Casilla marcada={false} texto="Caritas" /></Lugar>
				<Lugar clave="botones">
					<div style={{ display: 'flex', gap: 8 }}>
						<Boton texto="Crear" tipo="primary" ancho={72} encima={f.encima} />
						<Boton texto="Ocultar" ancho={90} />
					</div>
				</Lugar>
			</div>
		</Ficha>
	);
};

const Lugar: React.FC<{ clave: string; children: React.ReactNode }> = ({ clave, children }) => {
	const c = colocada(clave);
	return <div style={{ position: 'absolute', left: c.x, top: c.y, width: c.ancho }}>{children}</div>;
};

/* ── «Grupos que van siempre juntos» ────────────────────────────────────────────────────────── */

const VistaDeJuntos: React.FC<{ juntos: Juntos; alto: number }> = ({ juntos: j, alto }) => (
	<div
		style={{
			width: MAIN.ancho,
			height: alto,
			boxSizing: 'border-box',
			padding: `${JUNTOS.relleno}px ${JUNTOS.lados}px`,
			border: `1px solid #e5e7eb`,
			borderRadius: 8,
			background: '#fafbfc',
			color: TEXTO,
			fontSize: LETRA,
			position: 'relative',
		}}
	>
		<div style={{ height: JUNTOS.titulo, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600 }}>
			<Icono cual="link" tam={17} />
			Grupos que van siempre juntos
		</div>
		<div style={{ height: JUNTOS.explica, width: 704, fontSize: LETRA - 1.5, lineHeight: '20px', color: '#5b6573', paddingTop: 2 }}>
			Reciben todas las clases a la vez y en la misma aula, aunque el docente cambie de una materia a otra. El horario los coloca como si fueran un solo grupo.
		</div>

		{j.forma !== 'editor' && (
			<div style={{ position: 'absolute', top: JUNTOS.relleno, right: JUNTOS.lados }}>
				<Boton texto="Juntar grupos" icono="plus" ancho={BOTON_JUNTAR} encima={j.forma === 'vacio' && j.encimaJuntar} />
			</div>
		)}

		{j.forma === 'vacio' && (
			<div style={{ marginTop: JUNTOS.hueco, width: 740, fontSize: LETRA - 1.5, lineHeight: '21px', color: '#8a94a3' }}>
				Ningún grupo va junto con otro. Si hay cursos que reciben las clases juntos —por ejemplo Prejardín, Jardín y Transición con la misma maestra—, júntalos para que el horario no les cuente las horas dos veces.
			</div>
		)}

		{j.forma === 'conjuntos' && j.conjuntos.map((c) => (
			<div
				key={c.grupos.join()}
				style={{
					marginTop: JUNTOS.hueco,
					height: JUNTOS.conjunto,
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: '0 12px',
					borderRadius: 8,
					background: TINTE,
					opacity: j.aparece ?? 1,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
					{c.grupos.map((g, i) => (
						<React.Fragment key={g}>
							<span style={{ padding: '2px 11px', borderRadius: 999, border: `1px solid ${ACENTO}`, background: '#fff', fontWeight: 600 }}>{g}</span>
							{i < c.grupos.length - 1 && <Icono cual="link" tam={13} color="#0958d9" />}
						</React.Fragment>
					))}
				</div>
				<span style={{ fontSize: LETRA - 2, color: '#5b6573' }}>{c.alumnos} alumnos en la misma aula</span>
				<div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
					<Boton texto="Cambiar" icono="edit" tipo="text" pequeno ancho={BOTON_CAMBIAR} />
					<div style={{ color: PELIGRO }}>
						<Boton texto="Separar" icono="disconnect" tipo="text" pequeno peligro ancho={BOTON_SEPARAR} encima={j.encimaSeparar} />
					</div>
				</div>
			</div>
		))}

		{j.forma === 'editor' && <Editor juntos={j} />}
	</div>
);

/** «A, B y C». */
export const lista = (nombres: string[]) =>
	nombres.length < 2 ? (nombres[0] ?? '') : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;

/** La frase de debajo de las fichas, la misma que escribe `grupos-juntos.ts`. */
export function fraseDelEditor(elegidos: string[]): string {
	if (elegidos.length === 0) { return 'Pulsa los grupos que reciben las clases juntos.'; }
	if (elegidos.length === 1) { return `${elegidos[0]} y… ¿cuál más? Hacen falta al menos dos.`; }
	return `${lista(elegidos)} recibirán todas sus clases a la vez, como un solo grupo.`;
}

const Editor: React.FC<{ juntos: Extract<Juntos, { forma: 'editor' }> }> = ({ juntos: j }) => {
	const fichas = fichasDelEditor(j.elegidos);
	const altoFichas = Math.max(...fichas.map((f) => f.y)) + JUNTOS.ficha;
	return (
		<div style={{ marginTop: JUNTOS.hueco, opacity: j.aparece ?? 1 }}>
			<div style={{ height: JUNTOS.pide, fontWeight: 600 }}>¿Qué grupos van juntos?</div>
			<div style={{ position: 'relative', height: altoFichas }}>
				{fichas.map((f) => {
					const elegida = j.elegidos.includes(f.nombre);
					return (
						<div
							key={f.nombre}
							style={{
								position: 'absolute',
								left: f.x,
								top: f.y,
								width: f.ancho,
								height: JUNTOS.ficha,
								boxSizing: 'border-box',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 5,
								borderRadius: 999,
								border: `1px solid ${elegida ? ACENTO : '#bfc5cf'}`,
								background: elegida ? TINTE : '#fff',
								color: elegida ? '#0958d9' : TEXTO,
								fontWeight: elegida ? 600 : 400,
							}}
						>
							{elegida && <Icono cual="check" tam={14} />}
							<span>{f.nombre}</span>
						</div>
					);
				})}
			</div>
			<div style={{ height: JUNTOS.frase, display: 'flex', alignItems: 'center', color: '#5b6573' }}>{fraseDelEditor(j.elegidos)}</div>
			<div style={{ display: 'flex', gap: 8, height: ALTO_CONTROL }}>
				<Boton texto="Guardar" tipo="primary" ancho={90} deshabilitado={j.elegidos.length < 2} encima={j.encimaGuardar} cargando={j.cargando} />
				<Boton texto="Cancelar" ancho={100} />
			</div>
		</div>
	);
};

/* ── La rejilla ─────────────────────────────────────────────────────────────────────────────── */

const BotonDeCelda: React.FC<{ icono: 'edit' | 'delete' | 'team'; peligro?: boolean }> = ({ icono, peligro = false }) => (
	<div
		style={{
			width: 30,
			height: 26,
			borderRadius: 4,
			border: `1px solid ${peligro ? '#ffccc7' : BORDE}`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: peligro ? PELIGRO : TEXTO,
			background: '#fff',
		}}
	>
		<Icono cual={icono} tam={15} />
	</div>
);

function filaDeRejilla(f: FilaGrupo): FilaDeRejilla {
	const g = grupoPorNombre(f.nombre);
	const num = (n: number | string) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{n}</span>;
	return {
		clave: g.nombre,
		opacidad: f.opacidad,
		x: f.x,
		fondo: f.fondo,
		celdas: {
			orden: num(g.orden),
			editar: <BotonDeCelda icono="edit" />,
			alumnos: <BotonDeCelda icono="team" />,
			borrar: <BotonDeCelda icono="delete" peligro />,
			nombre: <Corte>{g.nombre}</Corte>,
			abrev: <Corte>{g.abrev}</Corte>,
			juntos: <Corte>{f.juntos}</Corte>,
			titular: (
				<div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
					<Cara docente={g.titular} tam={24} />
					<Corte>{DOCENTES[g.titular].nombre}</Corte>
				</div>
			),
			grado: <Corte>{g.grado}</Corte>,
			cant: num(f.nuevo ? 0 : g.alumnos),
			cupo: f.nuevo ? <span /> : num(g.cupo),
			ih: num(g.ih),
		},
	};
}

export { GRUPOS, TEXTO_TENUE };
