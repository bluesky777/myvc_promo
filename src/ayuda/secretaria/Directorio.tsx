import React from 'react';

import { Boton, Campo, Icono } from '../montar-el-ano/ant';
import { CABECERA, Corte, FILA, Rejilla, type FilaDeRejilla } from '../montar-el-ano/Rejilla';
import { avatarDe, type Alumno } from './personas';
import {
	ACENTO, BORDE, BotonesDeEstado, Cabecera, ConCara, En, H2, LETRA, MAIN, PELIGRO, Pagina, Pista, SelectorDeGrupos, TEXTO, TEXTO_TENUE,
} from './piezas';
import {
	ALTO_PANEL_CLAVES, ALTO_REJILLA, ALTO_REJILLA_BUSCADOR, ANCHO_BOTON_CLAVES, ANCHO_CAJA_BUSCAR, BOTONES_DIRECTORIO, BOTON_POR_APELLIDO, BOTON_POR_NOMBRE,
	ALTO_REJILLA_LISTA, COLUMNAS_BUSCADOR, COLUMNAS_DIRECTORIO, ESTADOS_DIRECTORIO, ESTADOS_SIN_MATRICULA, HUECO_ESTADOS_DIRECTORIO, LETRA_ESTADOS_DIRECTORIO,
	TEXTO_BOTON_SIN_MATRICULA, disposicionDirectorio,
} from './planoDirectorio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PERSONAS ▸ ALUMNOS, dibujada una vez para los vídeos de secretaría. No sabe de tiempo: pinta el
 * estado que le dan, donde dice `planoDirectorio.ts`. Los textos son los de `panel-alumnos.html`.
 *
 * El estado de la matrícula NO es una etiqueta de color: es la tira «Prem PreA Matr Asis Reti Dese
 * …» con el botón del estado actual hundido (`panel-alumnos.ts:374-380`).
 */

export type Estado = 'Prem' | 'PreA' | 'Matr' | 'Asis' | 'Reti' | 'Dese';

export interface FilaDirectorio {
	alumno: Alumno;
	estado: Estado;
	/** Valores que cambian respecto a la ficha: un nombre corregido, un usuario nuevo… */
	valores?: Partial<Record<'nombres' | 'apellidos' | 'usuario', string>>;
	/** La celda que se está editando, con lo escrito y el palito. */
	edicion?: { clave: 'nombres' | 'apellidos'; valor: string; cursor: boolean } | null;
	opacidad?: number;
	fondo?: string;
	encimaAccion?: 0 | 1 | 2 | null;
	encimaEstado?: string | null;
}

export interface EstadoDirectorio {
	grupo: string | null;
	filas: FilaDirectorio[];
	encimaCabecera?: number | null;
	encimaGrupo?: string | null;
	clavesAbierto?: boolean;
	encimaClaves?: boolean;
	/** El «Revisar» con el ratón encima: 0 alumnos del grupo, 1 acudientes del grupo, 2 y 3 del colegio. */
	encimaRevisar?: number | null;
	desplazada?: number;
	buscar?: {
		texto: string;
		cursor: boolean;
		foco: boolean;
		encimaPorNombre?: boolean;
		resultados: { alumno: Alumno; opacidad?: number }[];
		encimaRestaurar?: number | null;
		/** 0..1: la rejilla de resultados entrando. */
		aparece?: number;
	};
	/**
	 * «Ver alumnos sin matrícula (N)»: los del grado anterior del año pasado, retirados incluidos.
	 * Sin esto el botón dice «(0)» y la lista no se abre, como hasta ahora.
	 */
	sinMatricula?: {
		abierta: boolean;
		filas: FilaSinMatricula[];
		encimaBoton?: boolean;
		/** 0..1: la lista entrando. */
		aparece?: number;
		/** Cuánto se ha corrido de lado su rejilla, para ver «Fecha retiro/deserción». */
		lateral?: number;
	};
	opacidad?: number;
}

export interface FilaSinMatricula {
	alumno: Alumno;
	/** La fecha de retiro o deserción del año pasado, si se fue. */
	retiro?: string;
	encima?: string | null;
	opacidad?: number;
}

const ICONOS_ACCIONES = ['idcard', 'team', 'delete'] as const;

const celdas = (f: FilaDirectorio, i: number): Record<string, React.ReactNode> => {
	const a = f.alumno;
	const v = f.valores ?? {};
	const editando = (clave: 'nombres' | 'apellidos') => f.edicion?.clave === clave;
	const editor = (clave: 'nombres' | 'apellidos') => (
		<div style={{ width: '100%', marginLeft: -8, marginRight: -8 }}>
			<Campo valor={f.edicion!.valor} foco cursor={f.edicion!.cursor} ancho="100%" />
		</div>
	);
	return {
		no: <span style={{ color: TEXTO_TENUE }}>{i + 1}</span>,
		nombres: editando('nombres') ? editor('nombres') : <ConCara {...avatarDe(a)} texto={v.nombres ?? a.nombres} />,
		acciones: (
			<div style={{ display: 'flex', gap: 2, marginLeft: -6 }}>
				{ICONOS_ACCIONES.map((ic, k) => (
					<div
						key={ic}
						style={{
							width: 32,
							height: 32,
							borderRadius: 6,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: f.encimaAccion === k ? 'rgba(0,0,0,0.06)' : 'transparent',
						}}
					>
						<Icono cual={ic} tam={17} color={ic === 'delete' ? PELIGRO : f.encimaAccion === k ? ACENTO : TEXTO} />
					</div>
				))}
			</div>
		),
		apellidos: editando('apellidos') ? editor('apellidos') : <Corte>{v.apellidos ?? a.apellidos}</Corte>,
		sexo: a.sexo,
		estado: (
			<BotonesDeEstado botones={ESTADOS_DIRECTORIO} hundido={f.estado} encima={f.encimaEstado ?? null} letra={LETRA_ESTADOS_DIRECTORIO} hueco={HUECO_ESTADOS_DIRECTORIO} />
		),
		promovido: <Escudo />,
		no_matricula: a.matricula,
		fecha: f.estado === 'Matr' ? '2026-01-20' : '',
		retiro: '',
		usuario: (
			<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				<Corte>{v.usuario ?? a.usuario}</Corte>
				<Icono cual="key" tam={14} color={TEXTO_TENUE} />
			</span>
		),
		deuda: '0',
	};
};

/** Una fila de «sin matrícula»: la misma rejilla, sin papelera y con «Asis Matric …» en «Matrícula» (`panel-alumnos.ts:1164-1180`). */
const celdasSinMatricula = (f: FilaSinMatricula, i: number): Record<string, React.ReactNode> => ({
	...celdas({ alumno: f.alumno, estado: 'Matr' }, i),
	acciones: (
		<div style={{ display: 'flex', gap: 2, marginLeft: -6 }}>
			{ICONOS_ACCIONES.slice(0, 2).map((ic) => (
				<div key={ic} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Icono cual={ic} tam={17} color={TEXTO} />
				</div>
			))}
		</div>
	),
	estado: <BotonesDeEstado botones={ESTADOS_SIN_MATRICULA} encima={f.encima ?? null} letra={LETRA_ESTADOS_DIRECTORIO} hueco={HUECO_ESTADOS_DIRECTORIO} />,
	fecha: '',
	retiro: f.retiro ?? '',
});

/** El escudo de «Promovido?» sin valor: el botón de texto con su icono y nada escrito. */
const Escudo: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 18 18">
		<path d="M9 2.4 L14.6 4.6 V8.8 C14.6 12 12.2 14 9 14.8 C5.8 14 3.4 12 3.4 8.8 V4.6 Z" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.5" strokeLinejoin="round" />
	</svg>
);

export const PantallaDirectorio: React.FC<{ estado: EstadoDirectorio }> = ({ estado: e }) => {
	const conResultados = Boolean(e.buscar && e.buscar.resultados.length > 0);
	const lista = e.sinMatricula ?? null;
	const d = disposicionDirectorio(Boolean(e.clavesAbierto), conResultados, Boolean(e.grupo), Boolean(lista?.abierta));
	const filas: FilaDeRejilla[] = e.filas.map((f, i) => ({
		clave: String(f.alumno.id),
		celdas: celdas(f, i),
		opacidad: f.opacidad,
		fondo: f.fondo,
	}));

	return (
		<Pagina alto={d.fin} desplazada={e.desplazada ?? 0} opacidad={e.opacidad ?? 1}>
			<Cabecera titulo="Alumnos" botones={e.grupo ? BOTONES_DIRECTORIO : BOTONES_DIRECTORIO.slice(0, 4)} encima={e.encimaCabecera ?? null} />

			<En r={{ x: 0, y: d.selector }}>
				<SelectorDeGrupos elegido={e.grupo} encima={e.encimaGrupo ?? null} />
			</En>

			<En r={{ x: 0, y: d.claves }}>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 8,
						height: 32,
						width: ANCHO_BOTON_CLAVES,
						boxSizing: 'border-box',
						padding: '0 14px',
						borderRadius: 6,
						border: `1px solid ${e.encimaClaves ? ACENTO : BORDE}`,
						background: '#fafafa',
						color: e.encimaClaves ? ACENTO : 'rgba(0,0,0,0.7)',
						fontSize: LETRA,
					}}
				>
					<Icono cual="key" tam={15} />
					Cambiar contraseñas y usuarios
					<Icono cual="flecha" tam={11} giro={e.clavesAbierto ? 180 : 0} />
				</div>
			</En>

			{d.panel !== null && (
				<En r={{ x: 0, y: d.panel, ancho: MAIN.ancho, alto: ALTO_PANEL_CLAVES }}>
					<PanelClaves grupo={e.grupo ?? '9B'} cuantos={e.filas.length} encimaRevisar={e.encimaRevisar ?? null} />
				</En>
			)}

			<En r={{ x: 0, y: d.pista }}>
				<Pista>{e.grupo ? 'Haz clic en una celda para editarla. Se guarda al salir, campo a campo.' : 'Elige un grupo para ver sus alumnos.'}</Pista>
			</En>

			{e.grupo && (
				<>
					<En r={{ x: 0, y: d.rejilla }}>
						<Rejilla columnas={COLUMNAS_DIRECTORIO} filas={filas} ancho={MAIN.ancho} alto={ALTO_REJILLA} />
					</En>
					<En r={{ x: 0, y: d.resumen }}>
						<div style={{ display: 'flex', gap: 24, fontSize: LETRA, color: TEXTO, whiteSpace: 'nowrap' }}>
							<span>Alumnos: <b>{e.filas.length}</b></span>
							<span>Deudores: <b>0</b></span>
							<span>Hombres: {e.filas.filter((f) => f.alumno.sexo === 'M').length} · Mujeres: {e.filas.filter((f) => f.alumno.sexo === 'F').length}</span>
							<span>Deuda total: <b>$0</b></span>
						</div>
					</En>
					<En r={{ x: 0, y: d.retirados }}>
						<Boton texto="Ver retirados y desertados (0)" />
					</En>
					<En r={{ x: 0, y: d.sinMatricula }}>
						<Boton texto={TEXTO_BOTON_SIN_MATRICULA(Boolean(lista?.abierta), lista?.filas.length ?? 0)} encima={lista?.encimaBoton ?? false} />
					</En>
					{lista?.abierta && d.listaPista !== null && d.listaRejilla !== null && (
						<>
							<En r={{ x: 0, y: d.listaPista }} opacidad={lista.aparece ?? 1}>
								<Pista ancho={MAIN.ancho}>
									Vienen del grado anterior y todavía no tienen matrícula este año. En la columna «Matrícula»: «Asis» los inscribe como
									asistentes —sin matrícula—, «Matric» los matricula en el grupo elegido y «…» en otro grupo.
								</Pista>
							</En>
							<En r={{ x: 0, y: d.listaRejilla }} opacidad={lista.aparece ?? 1}>
								<Rejilla
									columnas={COLUMNAS_DIRECTORIO}
									filas={lista.filas.map((f, i) => ({ clave: String(f.alumno.id), opacidad: f.opacidad, celdas: celdasSinMatricula(f, i) }))}
									ancho={MAIN.ancho}
									alto={ALTO_REJILLA_LISTA}
									desplazada={lista.lateral ?? 0}
								/>
							</En>
						</>
					)}
				</>
			)}

			<En r={{ x: 0, y: d.buscador }}>
				<H2>Buscar en todo el sistema</H2>
			</En>
			<En r={{ x: 0, y: d.buscador + 32 }}>
				<div style={{ display: 'flex', gap: 8 }}>
					<Campo valor={e.buscar?.texto ?? ''} marcador="Buscar…" foco={e.buscar?.foco ?? false} cursor={e.buscar?.cursor ?? false} ancho={ANCHO_CAJA_BUSCAR} />
					<Boton texto="Por nombre" icono="search" ancho={BOTON_POR_NOMBRE} encima={e.buscar?.encimaPorNombre ?? false} />
					<Boton texto="Por apellido" icono="search" ancho={BOTON_POR_APELLIDO} />
				</div>
			</En>

			{conResultados && e.buscar && (
				<En r={{ x: 0, y: d.resultados - 21 - 8 }} opacidad={e.buscar.aparece ?? 1}>
					<Pista>Aquí salen todos los del sistema, incluidos los que están en la papelera: ésos se pueden restaurar.</Pista>
					<div style={{ height: 8 }} />
					<Rejilla
						columnas={COLUMNAS_BUSCADOR}
						filas={e.buscar.resultados.map((r, i) => ({
							clave: String(r.alumno.id),
							opacidad: r.opacidad,
							celdas: {
								no: <span style={{ color: TEXTO_TENUE }}>{i + 1}</span>,
								nombres: <ConCara {...avatarDe(r.alumno)} texto={r.alumno.nombres} />,
								apellidos: <Corte>{r.alumno.apellidos}</Corte>,
								restaurar: (
									<div
										style={{
											width: 32,
											height: 32,
											borderRadius: 6,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											background: e.buscar!.encimaRestaurar === i ? 'rgba(82,196,26,0.12)' : 'transparent',
										}}
									>
										<Icono cual="undo" tam={18} color="#389e0d" />
									</div>
								),
								sexo: r.alumno.sexo,
								no_matricula: r.alumno.matricula,
								documento: r.alumno.documento,
								historial: '',
							},
						}))}
						ancho={MAIN.ancho}
						alto={Math.min(ALTO_REJILLA_BUSCADOR, CABECERA * 2 + Math.max(3, e.buscar.resultados.length) * FILA + 20)}
					/>
				</En>
			)}
		</Pagina>
	);
};

/* ── El panel de «Cambiar contraseñas y usuarios» ─────────────────────────────────────────── */

export const PANEL = {
	relleno: 16,
	hueco: 16,
	/** Los dos bloques: 1,15fr y 1fr del ancho que queda. */
	anchos: (() => {
		const libre = MAIN.ancho - 16 * 2 - 16;
		const a = Math.round((libre * 1.15) / 2.15);
		return [a, libre - a];
	})(),
};

/** Las filas del bloque «Nombre de usuario», en el orden de la pantalla, y a qué altura cae cada una dentro del bloque. */
export const DESTINOS_USUARIO = [
	{ titulo: (g: string) => `Los alumnos de ${g}`, debajo: (n: number) => `${n} matriculados en el grupo elegido`, rojo: false, y: 150 },
	{ titulo: (g: string) => `Los acudientes de ${g}`, debajo: () => 'Los padres y acudientes de esos alumnos, y sólo ésos', rojo: false, y: 204 },
	{ titulo: () => 'Todos los alumnos', debajo: () => 'Los de todos los grupos, no sólo los de éste', rojo: true, y: 294 },
	{ titulo: () => 'Todos los acudientes', debajo: () => 'Los padres y acudientes de todos los alumnos', rojo: true, y: 348 },
];

export const ANCHO_REVISAR = 86;

/** El botón «Revisar» de la fila `i` del bloque de usuario, en coordenadas de la página. */
export function revisarEnLaPagina(i: number, panelY: number) {
	const xBloque = PANEL.relleno + PANEL.anchos[0] + PANEL.hueco;
	return { x: xBloque + PANEL.anchos[1] - 16 - ANCHO_REVISAR, y: panelY + PANEL.relleno + DESTINOS_USUARIO[i].y + 8, ancho: ANCHO_REVISAR, alto: 32 };
}

/** El bloque «Nombre de usuario» entero, en coordenadas de la página. */
export function bloqueUsuarioEnLaPagina(panelY: number) {
	return { x: PANEL.relleno + PANEL.anchos[0] + PANEL.hueco, y: panelY + PANEL.relleno, ancho: PANEL.anchos[1], alto: ALTO_PANEL_CLAVES - PANEL.relleno * 2 };
}

const Destino: React.FC<{ titulo: string; debajo: string; boton: string; rojo: boolean; marca?: boolean; encima?: boolean; ancho: number; y: number }> = ({
	titulo, debajo, boton, rojo, marca = false, encima = false, ancho, y,
}) => (
	<div style={{ position: 'absolute', left: 16, top: y, width: ancho - 32, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
		<div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
			<span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA, fontWeight: 600, whiteSpace: 'nowrap' }}>
				{titulo}
				{marca && (
					<span style={{ fontSize: LETRA - 3, fontWeight: 600, padding: '1px 7px', borderRadius: 4, background: '#fff1f0', color: '#cf1322', border: '1px solid #ffa39e' }}>Todo el colegio</span>
				)}
			</span>
			<span style={{ fontSize: LETRA - 2, color: TEXTO_TENUE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{debajo}</span>
		</div>
		<Boton texto={boton} peligro={rojo} ancho={ANCHO_REVISAR} encima={encima} />
	</div>
);

const PanelClaves: React.FC<{ grupo: string; cuantos: number; encimaRevisar: number | null }> = ({ grupo, cuantos, encimaRevisar }) => {
	const [a0, a1] = PANEL.anchos;
	const bloque: React.CSSProperties = {
		position: 'absolute',
		top: PANEL.relleno,
		height: ALTO_PANEL_CLAVES - PANEL.relleno * 2,
		boxSizing: 'border-box',
		background: '#fff',
		border: '1px solid #f0f0f0',
		borderRadius: 8,
	};
	const titulo = (icono: 'lock' | 'idcard', texto: string) => (
		<div style={{ position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA + 1, fontWeight: 600 }}>
			<Icono cual={icono} tam={17} />
			{texto}
		</div>
	);
	const subtitulo = (texto: string, y: number) => (
		<div style={{ position: 'absolute', left: 16, top: y, fontSize: LETRA - 2, fontWeight: 700, color: TEXTO_TENUE, textTransform: 'uppercase', letterSpacing: '.03em' }}>{texto}</div>
	);
	const nombreGrupo = grupo.replace(/^(\d+)([A-Z])$/, '$1°$2');

	return (
		<div style={{ position: 'absolute', inset: 0, background: '#fafafa', border: `1px solid ${BORDE}`, borderRadius: 6 }}>
			<div style={{ ...bloque, left: PANEL.relleno, width: a0 }}>
				{titulo('lock', 'Contraseña')}
				<div style={{ position: 'absolute', left: 16, top: 50, fontSize: LETRA - 1, color: TEXTO_TENUE }}>La contraseña que quedará puesta</div>
				<div style={{ position: 'absolute', left: 16, top: 74, width: a0 - 32 }}>
					<Campo marcador="Al menos 4 caracteres" />
				</div>
				<div style={{ position: 'absolute', left: 16, top: 112, fontSize: LETRA - 2, color: '#cf1322' }}>Escribe al menos 4 caracteres para poder ponerla.</div>
				<Destino titulo={`Los alumnos de ${nombreGrupo}`} debajo={`${cuantos} matriculados en el grupo elegido`} boton="Cambiar" rojo={false} ancho={a0} y={150} />
				<Destino titulo="Todos los alumnos" debajo="Los de todos los grupos, no sólo los de éste" boton="Cambiar" rojo marca ancho={a0} y={204} />
				<Destino titulo="Todos los acudientes" debajo="Los padres y acudientes de todos los alumnos" boton="Cambiar" rojo marca ancho={a0} y={258} />
			</div>

			<div style={{ ...bloque, left: PANEL.relleno + a0 + PANEL.hueco, width: a1 }}>
				{titulo('idcard', 'Nombre de usuario')}
				<div style={{ position: 'absolute', left: 16, top: 46, width: a1 - 32, fontSize: LETRA - 1.5, lineHeight: '20px', color: 'rgba(0,0,0,0.65)' }}>
					Pone el <b>documento</b> de cada persona como el usuario con el que entra. No usa la contraseña de al lado. Al pulsar <b>Revisar</b> se ve cuántas cuentas cambiarían antes de cambiar ninguna.
				</div>
				{subtitulo('En este grupo', 128)}
				{subtitulo('En todo el colegio', 272)}
				{DESTINOS_USUARIO.map((dd, i) => (
					<Destino
						key={i}
						titulo={dd.titulo(nombreGrupo)}
						debajo={dd.debajo(cuantos)}
						boton="Revisar"
						rojo={dd.rojo}
						marca={dd.rojo}
						encima={encimaRevisar === i}
						ancho={a1}
						y={dd.y}
					/>
				))}
			</div>
		</div>
	);
};
