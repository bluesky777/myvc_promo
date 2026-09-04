import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega } from '../comunes/movimiento';
import { Over } from './piezas';
import { ANCHO_RAIL, AZUL, NARANJA, PANTALLA, PAPEL, RAIL, RAYA, RAYA2, SANS, SERIF, TARJETA, TINTA, TINTA2, TINTA3, TINTA_AZUL } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CROMO DEL PORTAL: el rail de la izquierda y la cabecera. **Es idéntico en las veinte pantallas
 * del diseño**, así que está una sola vez -- igual que en `myvc_ucn/diseno/_base.py`, de donde sale.
 *
 * POR QUÉ SALE EN TODOS LOS CLIPS. Sin el rail, un gráfico bonito es un gráfico bonito. Con él, se
 * ve que ese gráfico vive **dentro de un portal que tiene otras diecinueve pantallas**, y eso es lo
 * que se está vendiendo: no el indicador, el sitio donde están todos.
 *
 * Y SE MONTA, no aparece: el rail entra, los apartados del menú caen en cascada y el titular **se
 * escribe**. Es el principio de la casa (`comunes/movimiento.ts`), que aquí vale igual.
 */

const ICONO: Record<string, string> = {
	panorama: '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect>',
	matricula: '<path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="3.2"></circle><path d="M17 11.5a3 3 0 0 0 0-6"></path><path d="M21 20v-2a3.6 3.6 0 0 0-2.5-3.4"></path>',
	academico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>',
	docentes: '<path d="M2.5 8 12 4l9.5 4L12 12 2.5 8Z"></path><path d="M6.5 10v5c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5"></path>',
	metas: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3.4"></circle><path d="M12 4V2M12 22v-2M4 12H2M22 12h-2"></path>',
	comparador: '<path d="M12 3.5v17"></path><path d="M5 5.5h14"></path><path d="M6 8 3 14h6L6 8Z"></path><path d="M18 8l-3 6h6l-3-6Z"></path>',
	certificados: '<circle cx="12" cy="9" r="5"></circle><path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8"></path>',
	salud_escolar: '<path d="M12 20.5S3.5 15.4 3.5 9.6a4.6 4.6 0 0 1 8.5-2.5 4.6 4.6 0 0 1 8.5 2.5c0 5.8-8.5 10.9-8.5 10.9Z"></path><path d="M12 9.5v4M10 11.5h4"></path>',
	retencion: '<path d="M3 7l6 6 4-4 8 8"></path><path d="M21 12v5h-5"></path>',
	misional: '<path d="M12 3v18M7.5 8h9"></path><path d="M5 21h14"></path>',
	cartera: '<rect x="2.5" y="6" width="19" height="13" rx="2"></rect><path d="M2.5 10.5h19"></path><path d="M16.5 15h2.5"></path>',
	directorio: '<path d="M4 21V6l7-3v18"></path><path d="M11 10h6a2 2 0 0 1 2 2v9"></path><path d="M2.5 21h19"></path><path d="M7 9h1M7 13h1M14.5 14h1M14.5 17.5h1"></path>',
	traslados: '<path d="M4 8h13l-3-3"></path><path d="M20 16H7l3 3"></path>',
	comunicados: '<path d="M3 10.5v3a1 1 0 0 0 1 1h2.5l8 4.5v-14l-8 4.5H4a1 1 0 0 0-1 1Z"></path><path d="M18 9.5a4 4 0 0 1 0 5"></path><path d="M9 15.5V20"></path>',
	encuestas: '<path d="M9 3.5H6a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6 21.5h12a1.5 1.5 0 0 0 1.5-1.5V5A1.5 1.5 0 0 0 18 3.5h-3"></path><rect x="9" y="2" width="6" height="3.4" rx="1"></rect><path d="M8.5 11.5l1.6 1.6 3.4-3.4"></path><path d="M8.5 17h7"></path>',
	informes: '<path d="M6 3h8l4 4v14H6V3Z"></path><path d="M14 3v4h4"></path><path d="M9 12h6M9 16h6"></path>',
	salud: '<path d="M2.5 12h4l2.5-6 4 12 2.5-6h6"></path>',
	admin: '<circle cx="12" cy="12" r="3.2"></circle><path d="M4.2 8.4a8.6 8.6 0 0 0-1 2.4l-1.7.6v1.2l1.7.6a8.6 8.6 0 0 0 1 2.4l-.8 1.6.9.9 1.6-.8a8.6 8.6 0 0 0 2.4 1l.6 1.7h1.2l.6-1.7a8.6 8.6 0 0 0 2.4-1l1.6.8.9-.9-.8-1.6a8.6 8.6 0 0 0 1-2.4l1.7-.6v-1.2l-1.7-.6a8.6 8.6 0 0 0-1-2.4l.8-1.6-.9-.9-1.6.8a8.6 8.6 0 0 0-2.4-1L12.6 2h-1.2l-.6 1.7a8.6 8.6 0 0 0-2.4 1l-1.6-.8-.9.9.8 1.6Z"></path>',
};

type Entrada = { clave: string; texto: string } | { seccion: string };

const MENU: Entrada[] = [
	{ seccion: 'Indicadores' },
	{ clave: 'panorama', texto: 'Panorama nacional' },
	{ clave: 'metas', texto: 'Metas y semáforo' },
	{ clave: 'matricula', texto: 'Matrícula y demografía' },
	{ clave: 'academico', texto: 'Rendimiento académico' },
	{ clave: 'docentes', texto: 'Docentes' },
	{ clave: 'salud_escolar', texto: 'Salud escolar' },
	{ clave: 'retencion', texto: 'Retención y deserción' },
	{ clave: 'misional', texto: 'Impacto misional' },
	{ clave: 'cartera', texto: 'Cartera · SunPlus' },
	{ clave: 'comparador', texto: 'Comparador' },
	{ seccion: 'Red' },
	{ clave: 'directorio', texto: 'Directorio de colegios' },
	{ clave: 'traslados', texto: 'Traslados entre colegios' },
	{ clave: 'comunicados', texto: 'Comunicados y eventos' },
	{ clave: 'encuestas', texto: 'Encuestas' },
	{ clave: 'certificados', texto: 'Certificados' },
	{ clave: 'informes', texto: 'Informes de junta' },
	{ clave: 'salud', texto: 'Salud de la red' },
	{ clave: 'admin', texto: 'Administración' },
];

const Icono: React.FC<{ clave: string; color: string; tam?: number }> = ({ clave, color, tam = 17 }) => (
	<svg
		width={tam}
		height={tam}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="1.6"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{ flexShrink: 0 }}
		dangerouslySetInnerHTML={{ __html: ICONO[clave] ?? '' }}
	/>
);

/** El escudo del portal. Sale en el rail y también en el aviso que llega al móvil. */
export const Escudo: React.FC<{ color?: string; tam?: number }> = ({ color = AZUL, tam = 22 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 3 3 8v11h18V8l-9-5Z" />
		<path d="M12 7.5v7M8.5 11h7" />
	</svg>
);

const Rail: React.FC<{ activo: string; desde: number }> = ({ activo, desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<div
			style={{
				width: ANCHO_RAIL,
				flexShrink: 0,
				background: RAIL,
				borderRight: `1px solid ${RAYA}`,
				display: 'flex',
				flexDirection: 'column',
				gap: 20,
				padding: '24px 0 26px',
				boxSizing: 'border-box',
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 22px', opacity: entra(frame, fps, desde, 14) }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
					<Escudo />
					<div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>Red Educativa</div>
				</div>
				<div style={{ paddingLeft: 31 }}><Over>Adventista · UCN</Over></div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
				{MENU.map((e, i) => {
					/* Los apartados caen en cascada, pegados: son veinte y no pueden tardar dos segundos. */
					const m = llega(frame, fps, i, desde + 4, 1.6, 12);
					if ('seccion' in e) {
						return (
							<div key={e.seccion} style={{ padding: e.seccion === 'Indicadores' ? '0 10px 6px' : '14px 10px 6px', opacity: m.opacidad }}>
								<Over>{e.seccion}</Over>
							</div>
						);
					}
					const on = e.clave === activo;
					return (
						<div
							key={e.clave}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '7px 10px',
								borderRadius: 5,
								fontSize: 13,
								background: on ? TARJETA : 'transparent',
								boxShadow: on ? `inset 2px 0 0 ${AZUL}` : 'none',
								fontWeight: on ? 600 : 400,
								color: on ? TINTA : TINTA2,
								opacity: m.opacidad,
								transform: `translateX(${m.x}px)`,
							}}
						>
							<Icono clave={e.clave} color={on ? AZUL : TINTA3} />
							{e.texto}
							{e.clave === 'salud' ? (
								<span style={{ marginLeft: 'auto', background: NARANJA, color: TARJETA, fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 8 }}>1</span>
							) : null}
						</div>
					);
				})}
			</div>

			<div style={{ marginTop: 'auto', padding: '0 22px', display: 'flex', alignItems: 'center', gap: 10, opacity: entra(frame, fps, desde + 16, 14) }}>
				<div style={{ width: 30, height: 30, borderRadius: '50%', background: TINTA_AZUL, color: TARJETA, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>JG</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 1, lineHeight: 1.25 }}>
					<div style={{ fontSize: 12, fontWeight: 600 }}>Departamento de Educación</div>
					<div style={{ fontSize: 11, color: TINTA3 }}>Unión Colombiana del Norte</div>
				</div>
			</div>
		</div>
	);
};

/**
 * LA PANTALLA DEL PORTAL. El rail, la cabecera --con el titular escribiéndose-- y debajo lo que
 * cuente el clip. El pie es el que lleva cada pantalla del diseño.
 */
export const Marco: React.FC<{
	activo: string;
	overline: string;
	titulo: string;
	sub: string;
	acciones?: React.ReactNode;
	pie?: [string, string];
	desde?: number;
	alto?: number;
	children: React.ReactNode;
}> = ({ activo, overline, titulo, sub, acciones, pie, desde = 0, alto = PANTALLA.alto, children }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const tCab = entra(frame, fps, desde + 8, 14);
	const escritoTitulo = escrito(frame, titulo, desde + 10, 1.6);
	const cursor = escribiendo(frame, titulo, desde + 10, 1.6);

	return (
		<div style={{ width: PANTALLA.ancho, height: alto, display: 'flex', background: PAPEL, fontFamily: SANS, color: TINTA, overflow: 'hidden' }}>
			<Rail activo={activo} desde={desde} />

			<div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 22, padding: '30px 40px 20px', minWidth: 0, position: 'relative' }}>
				<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, opacity: tCab }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
						<Over>{overline}</Over>
						{/*
						 * EL TITULAR SE ESCRIBE, y el hueco lo reserva un gemelo invisible: si el bloque
						 * creciera letra a letra, el subtítulo y la fila de cifras bailarían debajo.
						 */}
						<div style={{ position: 'relative' }}>
							<div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, visibility: 'hidden' }}>{titulo}</div>
							<div style={{ position: 'absolute', left: 0, top: 0, fontFamily: SERIF, fontSize: 42, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
								{escritoTitulo}
								{cursor ? <span style={{ opacity: frame % 16 < 8 ? 1 : 0, fontWeight: 300, color: AZUL }}>|</span> : null}
							</div>
						</div>
						<div style={{ fontSize: 12.5, color: TINTA2, opacity: interpolate(tCab, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' }) }}>{sub}</div>
					</div>
					{acciones ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: interpolate(tCab, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' }) }}>{acciones}</div> : null}
				</div>

				{children}

				{pie ? (
					<div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: TINTA3, paddingTop: 4, opacity: entra(frame, fps, desde + 30, 16) }}>
						<div style={{ maxWidth: 900 }}>{pie[0]}</div>
						<div style={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0, paddingLeft: 20 }}>{pie[1]}</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

/** Los dos botones grises de la cabecera, que salen en casi todas las pantallas del portal. */
export const AccionesPorDefecto: React.FC = () => (
	<>
		<div style={{ display: 'flex', alignItems: 'center', gap: 7, border: `1px solid ${RAYA2}`, background: TARJETA, borderRadius: 4, padding: '8px 13px', fontSize: 12.5, fontWeight: 500 }}>
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TINTA2} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 3v11" /><path d="M8 10.5 12 14.5 16 10.5" /><path d="M4 18.5v2h16v-2" />
			</svg>
			Exportar PDF
		</div>
		<div style={{ display: 'flex', alignItems: 'center', gap: 7, border: `1px solid ${RAYA2}`, background: TARJETA, borderRadius: 4, padding: '8px 13px', fontSize: 12.5, fontWeight: 500 }}>Excel</div>
	</>
);
