import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { DOCENTES, type ClaveDocente } from './reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS PIEZAS DE ANT QUE USAN ASIGNATURAS Y GRUPOS, dibujadas una vez para los seis vídeos.
 *
 * Son las de `ng-zorro-antd` que salen en esas dos pantallas --botón, campo, desplegable, tarjeta
 * pequeña, alerta, interruptor, casilla-- con sus colores de verdad (`notas/tema.ts`). Ninguna sabe
 * de tiempo: reciben el estado ya calculado, y quien decide cuándo se abre un desplegable es el
 * guion. Así el foco y el puntero pueden salir del mismo número que la pieza.
 *
 * LA LETRA VA UN PUNTO POR ENCIMA DE LA DE ANT (15 y no 14), igual que en las otras pantallas de la
 * ayuda: la cáscara se pinta al 84 % y esto se ve en un móvil. Los ANCHOS son los de la aplicación,
 * porque de ellos depende qué columna cabe y cuál se va a la derecha.
 */

export const LETRA = 15;
export const ALTO_CONTROL = 32;

export const PELIGRO = '#ff4d4f';
export const EXITO = { fondo: '#f6ffed', borde: '#b7eb8f', icono: '#52c41a' };
export const AVISO_AMARILLO = { fondo: '#fffbe6', borde: '#ffe58f', icono: '#faad14' };
export const INFO = { fondo: '#e6f4ff', borde: '#91caff', icono: ACENTO };
export const TINTE = '#e6f4ff';

export type NombreIcono =
	| 'plus' | 'reload' | 'edit' | 'delete' | 'team' | 'link' | 'undo' | 'check' | 'disconnect'
	| 'flecha' | 'aspa' | 'bien' | 'alerta' | 'info' | 'cargando'
	/* Los de secretaría (`ayuda/secretaria`). */
	| 'user-add' | 'download' | 'upload' | 'key' | 'idcard' | 'search' | 'star' | 'lock' | 'copy' | 'arrow-left' | 'user' | 'printer' | 'file-done' | 'usergroup-add' | 'eye';

/** Los iconos de Ant que salen, a trazo: una fuente de iconos en un render por fotogramas es una dependencia que puede no cargar. */
export const Icono: React.FC<{ cual: NombreIcono; tam?: number; color?: string; giro?: number }> = ({
	cual, tam = 16, color = 'currentColor', giro = 0,
}) => {
	const t = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ flex: 'none', transform: giro ? `rotate(${giro}deg)` : undefined }}>
			{cual === 'plus' && <path d="M12 5v14M5 12h14" {...t} />}
			{cual === 'reload' && <path d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4.5h-4.5" {...t} />}
			{cual === 'edit' && <path d="M4 20h4l10.5-10.5-4-4L4 16v4zM13.5 6.5l4 4" {...t} />}
			{cual === 'delete' && <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" {...t} />}
			{cual === 'team' && (
				<>
					<circle cx="9" cy="8.5" r="3" {...t} />
					<circle cx="17" cy="9.5" r="2.3" {...t} />
					<path d="M3.5 19c0-3.2 2.4-5 5.5-5s5.5 1.8 5.5 5M15 14.2c2.9-.3 5.5 1.2 5.5 4.3" {...t} />
				</>
			)}
			{cual === 'link' && <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" {...t} />}
			{cual === 'undo' && <path d="M9 7L4.5 11.5 9 16M5 11.5h9.5a5 5 0 0 1 0 10H11" {...t} />}
			{cual === 'check' && <path d="M5 12.5l4.5 4.5L19 7.5" {...t} />}
			{cual === 'disconnect' && <path d="M10 14a4 4 0 0 0 5.66 0l1.5-1.5M14 10l-1.5-1.5a4 4 0 0 0-5.66 0L5.34 10M4 4l16 16" {...t} />}
			{cual === 'flecha' && <path d="M6 9l6 6 6-6" {...t} />}
			{cual === 'aspa' && <path d="M7 7l10 10M17 7L7 17" {...t} />}
			{cual === 'bien' && (
				<>
					<circle cx="12" cy="12" r="11" fill={color} />
					<path d="M6.8 12.3l3.4 3.4 6.9-7.1" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
				</>
			)}
			{cual === 'alerta' && (
				<>
					<circle cx="12" cy="12" r="11" fill={color} />
					<path d="M12 6.5v7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
					<circle cx="12" cy="17.3" r="1.4" fill="#fff" />
				</>
			)}
			{cual === 'info' && (
				<>
					<circle cx="12" cy="12" r="11" fill={color} />
					<path d="M12 10.5v7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
					<circle cx="12" cy="6.8" r="1.4" fill="#fff" />
				</>
			)}
			{cual === 'cargando' && <path d="M12 3a9 9 0 1 1-9 9" {...t} />}
			{cual === 'user-add' && (
				<>
					<circle cx="10" cy="8" r="3.6" {...t} />
					<path d="M3.5 20c0-3.8 2.9-6 6.5-6 1.6 0 3 .4 4.1 1.2M18 13v7M14.5 16.5h7" {...t} />
				</>
			)}
			{cual === 'download' && <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M4.5 19.5h15" {...t} />}
			{cual === 'upload' && <path d="M12 16V5M7.5 9.5L12 5l4.5 4.5M4.5 19.5h15" {...t} />}
			{cual === 'key' && (
				<>
					<circle cx="8" cy="15" r="4" {...t} />
					<path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2" {...t} />
				</>
			)}
			{cual === 'idcard' && (
				<>
					<rect x="3" y="5.5" width="18" height="13" rx="2" {...t} />
					<circle cx="9" cy="11" r="2.2" {...t} />
					<path d="M5.8 16c.5-1.6 1.7-2.4 3.2-2.4s2.7.8 3.2 2.4M14.5 10h4M14.5 13.5h3" {...t} />
				</>
			)}
			{cual === 'search' && <path d="M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM15.3 15.3L20 20" {...t} />}
			{cual === 'star' && <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" {...t} />}
			{cual === 'lock' && (
				<>
					<rect x="5" y="10.5" width="14" height="10" rx="2" {...t} />
					<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" {...t} />
				</>
			)}
			{cual === 'copy' && <path d="M8 8h11v12H8zM5 16V4h11" {...t} />}
			{cual === 'arrow-left' && <path d="M19 12H5M11 6l-6 6 6 6" {...t} />}
			{cual === 'printer' && (
				<>
					<path d="M7 9V4h10v5M5 9h14v7H5zM7.5 14h9v6h-9z" {...t} />
				</>
			)}
			{cual === 'file-done' && <path d="M14 3.5H6.5v17h11V7L14 3.5zM13.5 3.5V7.5h4M9 13.5l2 2 4-4" {...t} />}
			{cual === 'usergroup-add' && (
				<>
					<circle cx="9" cy="8.5" r="3" {...t} />
					<path d="M3.5 19c0-3.2 2.4-5 5.5-5s5.5 1.8 5.5 5M18 9v6M15 12h6" {...t} />
				</>
			)}
			{cual === 'eye' && (
				<>
					<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...t} />
					<circle cx="12" cy="12" r="3" {...t} />
				</>
			)}
			{cual === 'user' && (
				<>
					<circle cx="12" cy="8" r="4" {...t} />
					<path d="M4.5 20.5c0-4.2 3.3-6.5 7.5-6.5s7.5 2.3 7.5 6.5" {...t} />
				</>
			)}
		</svg>
	);
};

export const Cara: React.FC<{ docente: ClaveDocente; tam?: number }> = ({ docente, tam = 22 }) => {
	const d = DOCENTES[docente];
	return (
		<div style={{ width: tam, height: tam, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
			<Avatar tipo={d.tipo} variante={d.variante} tam={tam} />
		</div>
	);
};

/**
 * EL BOTÓN DE ANT. `apretado` es el ratón encima justo antes del clic: el borde se pone azul, que
 * es lo que en la aplicación dice «esto se puede pulsar» antes de pulsarlo.
 */
export const Boton: React.FC<{
	texto?: string;
	icono?: NombreIcono;
	tipo?: 'default' | 'primary' | 'link' | 'text';
	peligro?: boolean;
	pequeno?: boolean;
	deshabilitado?: boolean;
	cargando?: boolean;
	encima?: boolean;
	ancho?: number;
	giroCarga?: number;
}> = ({ texto, icono, tipo = 'default', peligro = false, pequeno = false, deshabilitado = false, cargando = false, encima = false, ancho, giroCarga = 0 }) => {
	const color = peligro ? PELIGRO : ACENTO;
	const alto = pequeno ? 26 : ALTO_CONTROL;
	const lleno = tipo === 'primary';
	const plano = tipo === 'link' || tipo === 'text';

	const fondo = deshabilitado ? 'rgba(0,0,0,0.04)' : lleno ? (encima ? (peligro ? '#ff7875' : '#4096ff') : color) : plano ? (encima && tipo === 'text' ? 'rgba(0,0,0,0.06)' : 'transparent') : SUPERFICIE;
	const borde = deshabilitado ? BORDE : plano ? 'transparent' : lleno ? fondo : encima ? color : peligro ? PELIGRO : BORDE;
	const letra = deshabilitado ? 'rgba(0,0,0,0.25)' : lleno ? '#fff' : tipo === 'link' ? color : peligro ? PELIGRO : encima ? color : TEXTO;

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 7,
				height: alto,
				width: ancho,
				padding: plano && pequeno ? '0 6px' : pequeno ? '0 8px' : '0 15px',
				boxSizing: 'border-box',
				borderRadius: pequeno ? 4 : 6,
				border: `1px solid ${borde}`,
				background: fondo,
				color: letra,
				fontSize: pequeno ? LETRA - 1 : LETRA,
				fontWeight: 400,
				whiteSpace: 'nowrap',
				boxShadow: lleno && !deshabilitado ? '0 2px 0 rgba(5,145,255,0.1)' : 'none',
				flex: 'none',
			}}
		>
			{cargando && <Icono cual="cargando" tam={pequeno ? 13 : 15} giro={giroCarga} />}
			{!cargando && icono && <Icono cual={icono} tam={pequeno ? 14 : 15} />}
			{texto}
		</div>
	);
};

/** El campo de texto o número. `cursor` es el palito que parpadea mientras se escribe. */
export const Campo: React.FC<{ valor?: string; marcador?: string; foco?: boolean; cursor?: boolean; ancho?: number | string; derecha?: boolean }> = ({
	valor = '', marcador = '', foco = false, cursor = false, ancho = '100%', derecha = false,
}) => (
	<div
		style={{
			width: ancho,
			height: ALTO_CONTROL,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? ACENTO : BORDE}`,
			boxShadow: foco ? `0 0 0 2px ${ACENTO}22` : 'none',
			borderRadius: 6,
			background: SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: derecha ? 'flex-end' : 'flex-start',
			padding: '0 11px',
			fontSize: LETRA,
			color: valor ? TEXTO : 'rgba(0,0,0,0.3)',
			whiteSpace: 'pre',
			overflow: 'hidden',
			fontVariantNumeric: 'tabular-nums',
		}}
	>
		{valor || (cursor ? '' : marcador)}
		<span style={{ opacity: cursor ? 1 : 0, color: TEXTO, marginLeft: 1 }}>|</span>
	</div>
);

/**
 * EL DESPLEGABLE CERRADO (nz-select). Con `busqueda` es el campo mientras se teclea para filtrar,
 * que es como se elige en un desplegable con `nzShowSearch`: se escribe, no se desplaza.
 */
export const Selector: React.FC<{
	valor?: string | null;
	marcador: string;
	cara?: ClaveDocente | null;
	/** Lo que va detrás, en gris y en la misma línea: el titular del grupo en `desplegable-grupo`. */
	detras?: string | null;
	abierto?: boolean;
	busqueda?: string | null;
	cursor?: boolean;
	ancho?: number | string;
	deshabilitado?: boolean;
}> = ({ valor = null, marcador, cara = null, detras = null, abierto = false, busqueda = null, cursor = false, ancho = '100%', deshabilitado = false }) => {
	const escribiendo = busqueda !== null;
	return (
		<div
			style={{
				width: ancho,
				height: ALTO_CONTROL,
				boxSizing: 'border-box',
				border: `1px solid ${abierto ? ACENTO : BORDE}`,
				boxShadow: abierto ? `0 0 0 2px ${ACENTO}22` : 'none',
				borderRadius: 6,
				background: deshabilitado ? 'rgba(0,0,0,0.04)' : SUPERFICIE,
				display: 'flex',
				alignItems: 'center',
				gap: 7,
				padding: '0 11px',
				fontSize: LETRA,
				color: TEXTO,
				whiteSpace: 'nowrap',
				overflow: 'hidden',
			}}
		>
			{escribiendo ? (
				<span style={{ flex: 1, whiteSpace: 'pre' }}>
					{busqueda}
					<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
				</span>
			) : valor ? (
				<>
					{cara && <Cara docente={cara} tam={20} />}
					<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: detras ? 'none' : 1 }}>{valor}</span>
					{detras && <span style={{ color: TEXTO_TENUE, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>· {detras}</span>}
				</>
			) : (
				<span style={{ flex: 1, color: 'rgba(0,0,0,0.3)' }}>{marcador}</span>
			)}
			<Icono cual="flecha" tam={13} color={abierto ? ACENTO : 'rgba(0,0,0,0.3)'} giro={abierto ? 180 : 0} />
		</div>
	);
};

export interface Opcion {
	texto: string;
	/** La segunda línea, en gris: el titular del grupo. */
	debajo?: string;
	cara?: ClaveDocente;
}

export const ALTO_OPCION = 34;
export const ALTO_OPCION_DOBLE = 48;

/** EL PANEL DEL DESPLEGABLE ABIERTO. Lo coloca quien lo usa, justo debajo del selector. */
/**
 * `visibles` recorta el panel a ese número de opciones sencillas (el de Ant mide 256 px y desplaza
 * el resto), y `desplazada` es cuánto se ha bajado dentro de él, en píxeles.
 */
export const Panel: React.FC<{ opciones: Opcion[]; resaltada?: number | null; elegida?: number | null; ancho: number; aparece?: number; visibles?: number; desplazada?: number }> = ({
	opciones, resaltada = null, elegida = null, ancho, aparece = 1, visibles, desplazada = 0,
}) => (
	<div
		style={{
			width: ancho,
			padding: 4,
			boxSizing: 'border-box',
			background: SUPERFICIE,
			borderRadius: 8,
			boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
			opacity: aparece,
			transform: `scaleY(${0.85 + aparece * 0.15})`,
			transformOrigin: '50% 0',
		}}
	>
		<div style={{ height: visibles ? visibles * ALTO_OPCION : undefined, overflow: 'hidden' }}>
		<div style={{ transform: `translateY(${-desplazada}px)` }}>
		{opciones.map((o, i) => (
			<div
				key={`${o.texto}-${i}`}
				style={{
					height: o.debajo ? ALTO_OPCION_DOBLE : ALTO_OPCION,
					display: 'flex',
					alignItems: 'center',
					gap: 9,
					padding: '0 12px',
					borderRadius: 4,
					background: elegida === i ? TINTE : resaltada === i ? 'rgba(0,0,0,0.04)' : 'transparent',
					fontWeight: elegida === i ? 600 : 400,
					fontSize: LETRA,
					color: TEXTO,
				}}
			>
				{o.cara && !o.debajo && <Cara docente={o.cara} tam={22} />}
				<div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
					<span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.texto}</span>
					{o.debajo && <span style={{ fontSize: LETRA - 3, color: TEXTO_TENUE, marginTop: 1 }}>{o.debajo}</span>}
				</div>
				{o.cara && o.debajo && <Cara docente={o.cara} tam={26} />}
			</div>
		))}
		</div>
		</div>
	</div>
);

export const altoDelPanel = (opciones: Opcion[]) =>
	8 + opciones.reduce((n, o) => n + (o.debajo ? ALTO_OPCION_DOBLE : ALTO_OPCION), 0);

/** La tarjeta pequeña de Ant (`nz-card nzSize="small"`): cabecera con título y raya, y el cuerpo. */
export const ALTO_CABECERA_FICHA = 40;
export const RELLENO_FICHA = 12;

export const Ficha: React.FC<{ titulo: string; edicion?: boolean; ancho: number | string; children?: React.ReactNode }> = ({
	titulo, edicion = false, ancho, children,
}) => (
	<div
		style={{
			width: ancho,
			boxSizing: 'border-box',
			background: SUPERFICIE,
			border: `1px solid #f0f0f0`,
			borderLeft: edicion ? `3px solid ${ACENTO}` : '1px solid #f0f0f0',
			borderRadius: 8,
			boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02)',
		}}
	>
		<div
			style={{
				height: ALTO_CABECERA_FICHA,
				display: 'flex',
				alignItems: 'center',
				padding: '0 12px',
				borderBottom: '1px solid #f0f0f0',
				fontSize: LETRA,
				fontWeight: 600,
				color: TEXTO,
			}}
		>
			{titulo}
		</div>
		<div style={{ padding: RELLENO_FICHA }}>{children}</div>
	</div>
);

/** Una etiqueta de campo de formulario vertical, con el asterisco rojo de los obligatorios. */
export const ALTO_ETIQUETA = 30;

export const Etiqueta: React.FC<{ texto: string; obligatorio?: boolean }> = ({ texto, obligatorio = false }) => (
	<div style={{ height: ALTO_ETIQUETA, display: 'flex', alignItems: 'flex-start', fontSize: LETRA, color: TEXTO, gap: 4 }}>
		{obligatorio && <span style={{ color: PELIGRO, fontFamily: 'SimSun, sans-serif' }}>*</span>}
		{texto}
	</div>
);

/** LA ALERTA DE ANT (nz-alert), con icono. Sin descripción es una línea; con ella, título y cuerpo. */
export const Alerta: React.FC<{ tipo: 'success' | 'warning' | 'info'; mensaje: string; descripcion?: React.ReactNode; ancho: number | string; alto: number }> = ({
	tipo, mensaje, descripcion, ancho, alto,
}) => {
	const c = tipo === 'success' ? EXITO : tipo === 'warning' ? AVISO_AMARILLO : INFO;
	const icono: NombreIcono = tipo === 'success' ? 'bien' : tipo === 'warning' ? 'alerta' : 'info';
	const grande = Boolean(descripcion);
	return (
		<div
			style={{
				width: ancho,
				height: alto,
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: grande ? 'flex-start' : 'center',
				gap: grande ? 14 : 9,
				padding: grande ? '16px 22px' : '0 14px',
				background: c.fondo,
				border: `1px solid ${c.borde}`,
				borderRadius: 8,
				color: TEXTO,
				overflow: 'hidden',
			}}
		>
			<Icono cual={icono} tam={grande ? 22 : 16} color={c.icono} />
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontSize: grande ? LETRA + 1 : LETRA, lineHeight: grande ? '22px' : undefined }}>{mensaje}</div>
				{descripcion && <div style={{ fontSize: LETRA, marginTop: 6 }}>{descripcion}</div>}
			</div>
		</div>
	);
};

/** El interruptor pequeño de Ant. */
export const Interruptor: React.FC<{ encendido: boolean }> = ({ encendido }) => (
	<div style={{ width: 32, height: 18, borderRadius: 9, background: encendido ? ACENTO : 'rgba(0,0,0,0.25)', position: 'relative', flex: 'none' }}>
		<div style={{ position: 'absolute', top: 2, left: encendido ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 4px rgba(0,35,11,0.2)' }} />
	</div>
);

export const Casilla: React.FC<{ marcada: boolean; texto: string }> = ({ marcada, texto }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA, color: TEXTO, height: ALTO_CONTROL }}>
		<div
			style={{
				width: 16,
				height: 16,
				boxSizing: 'border-box',
				borderRadius: 4,
				border: `1px solid ${marcada ? ACENTO : BORDE}`,
				background: marcada ? ACENTO : SUPERFICIE,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{marcada && <Icono cual="check" tam={12} color="#fff" />}
		</div>
		{texto}
	</div>
);

export { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE };
