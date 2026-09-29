import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { SelectorDeGrupo } from '../montar-el-ano/Asignaturas';
import { Rejilla, type FilaDeRejilla } from '../montar-el-ano/Rejilla';
import { DOCENTES, grupo as grupoPorNombre } from '../montar-el-ano/reparto';
import { BotonP, En, IconoP, LETRA, MAIN, Marca, Pagina, Pista, SiNo, TEXTO, TEXTO_TENUE, Titulo } from '../personas/comun';
import {
	ALTO_OPCION,
	ALTO_PAGINA,
	type AlumnoCartera,
	BARRA,
	BOTONES_CABECERA,
	COLUMNAS,
	ENLACE_DEUDORES,
	GRUPOS_DEL_DESPLEGABLE,
	MARCADOS,
	PISTA_REJILLA,
	REJILLA,
	RESUMEN,
	SELECTOR,
	Y,
	pesos,
	rectBotonCabecera,
	resumen,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DE CARTERA. No sabe de tiempo: recibe el estado ya calculado y lo pinta con los
 * números de `datos.ts`, que son los mismos con los que el guion pone el foco y el puntero.
 */

export interface EstadoCartera {
	/** El grupo elegido, o null (entonces sale la pista de «Elige un grupo…»). */
	grupo: string | null;
	/** El desplegable de grupos: cuánto está abierto (0..1) y qué opción tiene el ratón encima. */
	desplegable?: { t: number; resaltada: number | null } | null;
	/** Cuánto han entrado las filas (0..1): la rejilla llega vacía y se llena. */
	filas: AlumnoCartera[];
	llegadaFilas?: number;
	marcadas: number[];
	/** La casilla que el ratón tiene encima. */
	casillaEncima?: number | null;
	encima?: 'paz' | 'cambiarDeuda' | 'subir' | null;
	deudaTecleada?: string;
	deudaConFoco?: boolean;
	cursorDeTexto?: boolean;
}

export const PantallaCartera: React.FC<{ e: EstadoCartera }> = ({ e }) => {
	const r = resumen(e.filas);
	const conGrupo = e.grupo !== null;

	return (
		<Pagina alto={ALTO_PAGINA}>
			{/* ── La cabecera ─────────────────────────────────────────────────────────────── */}
			<En r={{ x: MAIN.x, y: MAIN.y, ancho: 300, alto: 40 }} style={{ display: 'flex', alignItems: 'center' }}>
				<Titulo texto="Cartera" />
			</En>
			{(conGrupo ? BOTONES_CABECERA : BOTONES_CABECERA.slice(0, 3)).map((b, i) => (
				<En key={b.texto} r={rectBotonCabecera(i, conGrupo)}>
					<BotonP texto={b.texto} icono={b.icono} ancho={b.ancho} encima={i === 0 && e.encima === 'subir'} />
				</En>
			))}

			{/* ── Elige grupo ─────────────────────────────────────────────────────────────── */}
			<En r={{ x: MAIN.x, y: Y.etiqueta }}>
				<div style={{ fontSize: LETRA, color: TEXTO }}>Elige grupo</div>
			</En>
			<En r={SELECTOR}>
				<SelectorDeGrupo ancho={SELECTOR.ancho} marcador="Grupo" nombre={e.grupo} abierto={Boolean(e.desplegable && e.desplegable.t > 0.5)} />
			</En>
			<En r={ENLACE_DEUDORES} style={{ display: 'flex', alignItems: 'center' }}>
				<BotonP texto="Cargar todos los deudores" tipo="link" />
			</En>

			{!conGrupo && (
				<En r={{ x: MAIN.x, y: Y.marcados + 4 }}>
					<Pista>Elige un grupo para ver su cartera, o carga todos los deudores.</Pista>
				</En>
			)}

			{conGrupo && (
				<>
					<BarraDeMarcados e={e} />
					<En r={PISTA_REJILLA}>
						<Pista>Haz clic en una celda para editarla. Se guarda al salir, campo a campo.</Pista>
					</En>
					<En r={REJILLA}>
						<Rejilla columnas={COLUMNAS} filas={e.filas.map((a, i) => filaDeRejilla(a, i, e))} ancho={REJILLA.ancho} alto={REJILLA.alto} />
					</En>
					<En r={RESUMEN} style={{ display: 'flex', gap: 24, fontSize: LETRA, color: TEXTO, whiteSpace: 'nowrap', alignItems: 'center' }}>
						<span>Alumnos: <strong>{r.total}</strong></span>
						<span>Deudores: <strong>{r.deudores}</strong></span>
						<span>Hombres: {r.hombres} · Mujeres: {r.mujeres}</span>
						<span>Deuda total: <strong>{pesos(r.deuda)}</strong></span>
					</En>
				</>
			)}

			{e.desplegable && e.desplegable.t > 0 && <PanelDeGrupos t={e.desplegable.t} resaltada={e.desplegable.resaltada} />}
		</Pagina>
	);
};

const BarraDeMarcados: React.FC<{ e: EstadoCartera }> = ({ e }) => {
	const n = e.marcadas.length;
	return (
		<En
			r={MARCADOS}
			style={{ boxSizing: 'border-box', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, fontSize: LETRA, color: TEXTO }}
		>
			{n === 0 ? (
				<div style={{ position: 'absolute', left: 9, top: 0, height: 46, display: 'flex', alignItems: 'center' }}>
					<Pista>Marca alumnos con la casilla y aquí aparecerán las acciones.</Pista>
				</div>
			) : (
				<>
					<div style={{ position: 'absolute', left: 9, top: 0, height: 46, display: 'flex', alignItems: 'center', fontWeight: 700 }}>{n} marcados:</div>
					<Suelto r={BARRA.paz}><BotonP texto="Poner a paz y salvo" pequeno ancho={BARRA.paz.ancho} encima={e.encima === 'paz'} /></Suelto>
					<Suelto r={BARRA.deudores}><BotonP texto="Poner como deudores" pequeno ancho={BARRA.deudores.ancho} /></Suelto>
					<Suelto r={BARRA.deuda}>
						<Entrada valor={e.deudaTecleada ?? ''} foco={Boolean(e.deudaConFoco)} cursor={Boolean(e.cursorDeTexto)} ancho={BARRA.deuda.ancho} marcador="" />
					</Suelto>
					<Suelto r={BARRA.cambiarDeuda}><BotonP texto="Cambiar la deuda" pequeno ancho={BARRA.cambiarDeuda.ancho} encima={e.encima === 'cambiarDeuda'} /></Suelto>
					<Suelto r={BARRA.fecha}>
						<Entrada valor="" marcador="dd/mm/aaaa" ancho={BARRA.fecha.ancho} calendario />
					</Suelto>
					<Suelto r={BARRA.cambiarFecha}><BotonP texto="Cambiar la fecha" pequeno ancho={BARRA.cambiarFecha.ancho} /></Suelto>
				</>
			)}
		</En>
	);
};

/** Un mando de la barra: su rectángulo es de la cáscara, y la barra empieza en `MARCADOS`. */
const Suelto: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; children: React.ReactNode }> = ({ r, children }) => (
	<div style={{ position: 'absolute', left: r.x - MARCADOS.x, top: r.y - MARCADOS.y, width: r.ancho, height: r.alto }}>{children}</div>
);

const Entrada: React.FC<{ valor: string; marcador: string; ancho: number; foco?: boolean; cursor?: boolean; calendario?: boolean }> = ({
	valor, marcador, ancho, foco = false, cursor = false, calendario = false,
}) => (
	<div
		style={{
			width: ancho,
			height: 30,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? '#1677ff' : '#d9d9d9'}`,
			boxShadow: foco ? '0 0 0 2px rgba(5,145,255,0.1)' : 'none',
			borderRadius: 6,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 10px',
			fontSize: LETRA,
			color: valor ? TEXTO : 'rgba(0,0,0,0.3)',
			background: '#fff',
		}}
	>
		<span style={{ whiteSpace: 'pre' }}>
			{valor || marcador}
			<span style={{ opacity: cursor ? 1 : 0, color: TEXTO }}>|</span>
		</span>
		{calendario && <IconoP cual="ficha" tam={14} color="rgba(0,0,0,0.35)" />}
	</div>
);

function filaDeRejilla(a: AlumnoCartera, i: number, e: EstadoCartera): FilaDeRejilla {
	const t = e.llegadaFilas ?? 1;
	const op = Math.max(0, Math.min(1, t * (ALUMNOS_ORDEN + 2) - i));
	const marcada = e.marcadas.includes(i);
	return {
		clave: `${a.apellidos}`,
		opacidad: op,
		fondo: marcada ? '#e6f4ff' : undefined,
		celdas: {
			sel: <Marca marcada={marcada} encima={e.casillaEncima === i} />,
			acciones: (
				<div style={{ width: 28, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1677ff' }}>
					<IconoP cual="ficha" tam={17} />
				</div>
			),
			paz: <SiNo encendido={a.paz} />,
			nombres: (
				<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<Avatar tipo={a.cara.tipo} variante={a.cara.variante} tam={26} />
					{a.nombres}
				</span>
			),
			apellidos: a.apellidos,
			sexo: a.sexo,
			usuario: (
				<span style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
					<span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.usuario}</span>
					<IconoP cual="llave" tam={15} color={TEXTO_TENUE} />
				</span>
			),
			deuda: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{a.deuda}</span>,
			pagada: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{a.pagadaHasta}</span>,
		},
	};
}
const ALUMNOS_ORDEN = 8;

const PanelDeGrupos: React.FC<{ t: number; resaltada: number | null }> = ({ t, resaltada }) => (
	<div
		style={{
			position: 'absolute',
			left: SELECTOR.x,
			top: SELECTOR.y + 32 + 4,
			width: SELECTOR.ancho,
			padding: 4,
			boxSizing: 'border-box',
			background: '#fff',
			borderRadius: 8,
			boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
			opacity: t,
			transform: `scaleY(${0.85 + t * 0.15})`,
			transformOrigin: '50% 0',
			zIndex: 5,
		}}
	>
		{GRUPOS_DEL_DESPLEGABLE.map((nombre, i) => {
			const g = grupoPorNombre(nombre);
			const d = DOCENTES[g.titular];
			return (
				<div
					key={nombre}
					style={{
						height: ALTO_OPCION,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						padding: '0 12px',
						borderRadius: 4,
						background: resaltada === i ? 'rgba(0,0,0,0.04)' : 'transparent',
						fontSize: LETRA,
						color: TEXTO,
					}}
				>
					<div style={{ width: 26, height: 26, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
						<Avatar tipo={d.tipo} variante={d.variante} tam={26} />
					</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span style={{ fontWeight: 600 }}>{nombre}</span>
						<span style={{ fontSize: LETRA - 3, color: TEXTO_TENUE }}>{d.nombre}</span>
					</div>
				</div>
			);
		})}
	</div>
);
