import React from 'react';
import { interpolate } from 'remotion';

import { BORDE, TEXTO_TENUE } from '../notas/tema';
import { Icono, MEDIDAS, SECCIONES, Seccion } from './medidas';
import { FUENTE } from './tema';
import { BarraDeHoy, BarraDeHoyProps, EstiloCascara, MEDIDAS_HOY, PALETA_CLARA, PaletaCascara, estiloDelMenu } from './BarraDeHoy';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA CÁSCARA DE LA APLICACIÓN: la barra de arriba y el menú de la izquierda.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTO EXISTE, SI LOS CLIPS PROMOCIONALES NO LO NECESITABAN
 *
 * Un clip promocional enseña **la pantalla**: la planilla flotando, grande y sin cromo, porque lo
 * que vende es lo que la pantalla hace. Un vídeo de ayuda tiene que enseñar además **cómo se llega
 * hasta ella**, y eso es exactamente el cromo: el menú, sus secciones y la entrada que hay
 * que pulsar. Sin la cáscara, un vídeo de ayuda contesta «qué hace» y deja sin contestar «dónde
 * está», que es la pregunta que más llega.
 *
 * Por eso la cáscara **no se salta nunca**: los primeros segundos de los ochenta vídeos son el
 * menú abriéndose. Es el trozo más aburrido de hacer y el que más llamadas ahorra.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL SELECTOR DE AÑO Y PERIODO SE VE SIEMPRE, AUNQUE EL VÍDEO NO LO TOQUE
 *
 * «📅 2026 | Periodo 2», arriba a la derecha. Casi todos los «no me deja» empiezan ahí, y que salga en
 * todos los vídeos --aunque ninguno lo use-- es lo que hace que el día que alguien tenga que
 * cambiarlo sepa dónde estaba mirando todo este tiempo.
 */

export const Cascara: React.FC<{
	/** Si «Académico» está desplegado. Entre 0 y 1: se abre con animación. Atajo de `abierta`. */
	academico?: number;
	/**
	 * QUÉ SECCIÓN ESTÁ DESPLEGADA, y cuánto (0..1). Una sola a la vez, como en la aplicación. Si se
	 * pasa, manda sobre `academico`. El índice es dentro de `menu`.
	 */
	abierta?: { seccion: number; t: number } | null;
	/** El menú que se pinta: el del docente por defecto; `MENU_DIRECTIVO` para rector y coordinación. */
	menu?: Seccion[];
	/** La entrada resaltada como la que el ratón tiene encima, o `null`. */
	senalada?: { seccion: number; hija: number | null } | null;
	/** La pantalla de dentro. */
	children?: React.ReactNode;
	/**
	 * Lo que dice el selector de año y periodo, «2026 · Periodo 2». Los vídeos del cierre del año lo
	 * ponen en el 4. Es el atajo de `hoy` para los que no tocan la barra.
	 */
	periodo?: string;
	/** La hija de tercer nivel desplegada dentro de la sección abierta («Votaciones»), y cuánto. */
	subAbierta?: { hija: string; t: number } | null;
	/** La nieta resaltada como la que el ratón tiene encima: índice dentro de `subAbierta`. */
	nietaSenalada?: number | null;
	/**
	 * LA BARRA, que es la de hoy en app2 (desde el 2026-09-26) en todos los vídeos: botón de plegar,
	 * «Buscador mágico…» con su tecla «/», el selector con su calendario y su tajo, y los mandos de
	 * aspecto, ayuda y campana. Sólo hace falta pasarla para señalar un mando o abrir el selector;
	 * si no, sale del `periodo`. Ver `BarraDeHoy`.
	 */
	hoy?: BarraDeHoyProps;
	/** El menú plegado a iconos (0..1): de `MEDIDAS.menu` a `MEDIDAS_HOY.menuPlegado`. */
	plegado?: number;
	/** Los colores de la cáscara. Por defecto, los de siempre; `PALETA_OSCURA` es el modo oscuro. */
	paleta?: PaletaCascara;
}> = ({ academico = 0, abierta, menu = SECCIONES, senalada = null, children, periodo = '2026 · Periodo 2', subAbierta = null, nietaSenalada = null, hoy, plegado = 0, paleta = PALETA_CLARA }) => (
	<EstiloCascara.Provider value={{ p: paleta, plegado }}>
	<div
		style={{
			position: 'relative',
			width: MEDIDAS.ancho,
			height: MEDIDAS.alto,
			background: paleta.fondo,
			borderRadius: 12,
			overflow: 'hidden',
			fontFamily: FUENTE,
			boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
		}}
	>
		<BarraDeHoy {...(hoy ?? barraDe(periodo))} />

		<div style={{ display: 'flex', height: MEDIDAS.alto - MEDIDAS.barra }}>
			<Menu
				menu={menu}
				abierta={abierta === undefined ? { seccion: menu.findIndex((m) => m.etiqueta === 'Académico'), t: academico } : abierta}
				senalada={senalada}
				subAbierta={subAbierta}
				nietaSenalada={nietaSenalada}
			/>
			<div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
		</div>
	</div>
	</EstiloCascara.Provider>
);

/** «2026 · Periodo 4» -> el año y el número, que es lo que pinta la barra de hoy. */
function barraDe(periodo: string): BarraDeHoyProps {
	const m = /^(\d{4})\s*·\s*Periodo\s*(\d+)$/.exec(periodo.trim());
	if (!m) { throw new Error(`Cáscara: «${periodo}» no es «AAAA · Periodo N».`); }
	return { anio: m[1], periodo: Number(m[2]) };
}

const Menu: React.FC<{
	menu: Seccion[];
	abierta: { seccion: number; t: number } | null;
	senalada: { seccion: number; hija: number | null } | null;
	subAbierta?: { hija: string; t: number } | null;
	nietaSenalada?: number | null;
}> = ({ menu, abierta, senalada, subAbierta = null, nietaSenalada = null }) => (
	<div style={estiloDelMenu(React.useContext(EstiloCascara))}>
		{menu.map((seccion, i) => {
			const t = abierta !== null && abierta.seccion === i ? abierta.t : 0;
			return (
			<div key={seccion.etiqueta}>
				<Entrada
					etiqueta={seccion.etiqueta}
					icono={seccion.icono}
					abierta={seccion.hijas ? t : 0}
					conHijas={Boolean(seccion.hijas)}
					senalada={senalada?.seccion === i && senalada.hija === null}
				/>

				{seccion.hijas && (
					/*
					 * LAS HIJAS SE DESPLIEGAN EMPUJANDO, no apareciendo encima. En la aplicación el menú
					 * es una columna que crece: si aquí salieran flotando, el vídeo enseñaría un menú que
					 * no existe, y quien fuera a repetirlo buscaría un panel que no se abre.
					 */
					<div style={{ height: (seccion.hijas.length * MEDIDAS.hija + extraDeNietas(seccion, t > 0 ? subAbierta : null)) * t, overflow: 'hidden' }}>
						{seccion.hijas.map((hija, h) => {
							const nietas = seccion.nietas?.[hija];
							const sub = t > 0 && subAbierta?.hija === hija ? subAbierta.t : 0;
							return (
								<React.Fragment key={hija}>
									<Hija
										etiqueta={hija}
										opacidad={interpolate(t, [0.45, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
										senalada={senalada?.seccion === i && senalada.hija === h}
										giro={nietas ? sub * 180 : undefined}
									/>
									{nietas && (
										/* El tercer nivel, empujando como el segundo, con la raya guía del `ul` anidado. */
										<div style={{ height: nietas.length * MEDIDAS.hija * sub, overflow: 'hidden', position: 'relative' }}>
											<div style={{ position: 'absolute', left: 52, top: 4, bottom: 4, width: 1, background: BORDE }} />
											{nietas.map((nieta, n) => (
												<Hija
													key={nieta}
													etiqueta={nieta}
													opacidad={interpolate(sub, [0.45, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
													senalada={sub > 0 && nietaSenalada === n}
													sangria={64}
												/>
											))}
										</div>
									)}
								</React.Fragment>
							);
						})}
					</div>
				)}
			</div>
			);
		})}
	</div>
);

const Entrada: React.FC<{ etiqueta: string; icono: Icono; abierta: number; conHijas: boolean; senalada: boolean }> = ({
	etiqueta, icono, abierta, conHijas, senalada,
}) => {
	/* Los colores y el plegado vienen de la cáscara (`paleta`, `plegado`); por defecto, los de siempre. */
	const { p, plegado } = React.useContext(EstiloCascara);
	return (
	<div
		style={{
			height: MEDIDAS.seccion,
			display: 'flex',
			alignItems: 'center',
			gap: plegado ? 12 * (1 - plegado) : 12,
			/* Plegado, el icono se centra en la columna de iconos, como `nzInlineCollapsed`. */
			padding: plegado ? `0 ${16 * (1 - plegado)}px 0 ${16 + (MEDIDAS_HOY.menuPlegado / 2 - 9 - 16) * plegado}px` : '0 16px',
			fontSize: 15,
			fontWeight: 600,
			color: abierta > 0.5 ? p.acento : p.texto,
			background: senalada ? `${p.acento}14` : 'transparent',
			whiteSpace: plegado ? 'nowrap' : undefined,
		}}
	>
		<IconoDeSeccion cual={icono} color={abierta > 0.5 ? p.acento : p.tenue} />
		<span style={{ flex: 1, opacity: plegado ? Math.max(0, 1 - plegado * 2.5) : undefined, ...(plegado ? { minWidth: 0, overflow: 'hidden' } : {}) }}>{etiqueta}</span>
		{conHijas && !plegado && <Chevron giro={abierta * 180} color={abierta > 0.5 ? p.acento : p.tenue} />}
		{conHijas && plegado > 0 && plegado < 0.4 && (
			<span style={{ display: 'inline-flex', opacity: 1 - plegado * 2.5 }}>
				<Chevron giro={abierta * 180} color={abierta > 0.5 ? p.acento : p.tenue} />
			</span>
		)}
	</div>
	);
};

/** Lo que crece la sección por la hija de tercer nivel que está desplegada. */
const extraDeNietas = (seccion: Seccion, sub: { hija: string; t: number } | null) =>
	sub && seccion.nietas?.[sub.hija] ? seccion.nietas[sub.hija].length * MEDIDAS.hija * sub.t : 0;

const Hija: React.FC<{ etiqueta: string; opacidad: number; senalada: boolean; giro?: number; sangria?: number }> = ({
	etiqueta, opacidad, senalada, giro, sangria = 44,
}) => (
	<div
		style={{
			height: MEDIDAS.hija,
			display: 'flex',
			alignItems: 'center',
			paddingLeft: sangria,
			paddingRight: giro === undefined ? 0 : 16,
			fontSize: 14,
			color: React.useContext(EstiloCascara).p.texto,
			opacity: opacidad,
			background: ((acento) => (senalada ? `${acento}14` : 'transparent'))(React.useContext(EstiloCascara).p.acento),
		}}
	>
		{giro === undefined ? etiqueta : <span style={{ flex: 1 }}>{etiqueta}</span>}
		{giro !== undefined && <Chevron giro={giro} color={TEXTO_TENUE} />}
	</div>
);

const Chevron: React.FC<{ giro?: number; color?: string }> = ({ giro = 0, color = '#8c8c8c' }) => (
	<svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: `rotate(${giro}deg)` }}>
		<path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/*
 * LOS ICONOS. Dibujados a mano y a trazo, no una tipografía de iconos: una fuente de iconos en un
 * render por fotogramas es una dependencia más que puede no cargar, y si no carga salen cuadritos
 * en los ochenta vídeos. Son nueve formas simples; lo que tienen que hacer es distinguirse entre
 * ellas de un vistazo, no ser bonitas.
 */
const IconoDeSeccion: React.FC<{ cual: Icono; color: string }> = ({ cual, color }) => {
	const trazo = { fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

	return (
		<svg width="18" height="18" viewBox="0 0 18 18">
			{cual === 'inicio' && <path d="M3 8 L9 3 L15 8 V15 H3 Z" {...trazo} />}
			{cual === 'docentes' && (
				<>
					<circle cx="9" cy="6" r="2.6" {...trazo} />
					<path d="M3.5 15 C3.5 11.7 5.9 10.2 9 10.2 C12.1 10.2 14.5 11.7 14.5 15" {...trazo} />
				</>
			)}
			{cual === 'academico' && (
				<>
					<path d="M3 5.5 H15 V14 H3 Z" {...trazo} />
					<path d="M6 8.5 H12 M6 11.2 H10" {...trazo} />
				</>
			)}
			{cual === 'personas' && (
				<>
					<circle cx="6.8" cy="6.5" r="2.2" {...trazo} />
					<circle cx="12.4" cy="7.4" r="1.7" {...trazo} />
					<path d="M2.6 14.4 C2.6 11.6 4.5 10.4 6.8 10.4 C9.1 10.4 11 11.6 11 14.4" {...trazo} />
				</>
			)}
			{cual === 'compromisos' && (
				<>
					<path d="M4 3.4 H14 V14.6 H4 Z" {...trazo} />
					<path d="M6.4 9.2 L8.3 11 L11.8 7.4" {...trazo} />
				</>
			)}
			{cual === 'actividades' && (
				<>
					<path d="M3.6 3.6 H14.4 V14.4 H3.6 Z" {...trazo} />
					<path d="M6 7 H12 M6 9.6 H12 M6 12.2 H9.4" {...trazo} />
				</>
			)}
			{cual === 'matriculas' && (
				<>
					<path d="M4 4 H14 V15 H4 Z" {...trazo} />
					<path d="M6.8 2.8 H11.2 V5 H6.8 Z" {...trazo} />
					<path d="M6.4 10 L8.3 11.8 L11.8 8.2" {...trazo} />
				</>
			)}
			{cual === 'disciplina' && <path d="M9 2.8 L14.6 5 V9.3 C14.6 12.4 12.2 14.4 9 15.2 C5.8 14.4 3.4 12.4 3.4 9.3 V5 Z" {...trazo} />}
			{cual === 'referencias' && (
				<>
					<path d="M4 3.4 H11.4 L14 6 V14.6 H4 Z" {...trazo} />
					<path d="M11 3.6 V6.2 H13.8" {...trazo} />
				</>
			)}
			{cual === 'horario' && (
				<>
					<circle cx="9" cy="9" r="6.1" {...trazo} />
					<path d="M9 5.4 V9.2 L11.6 10.8" {...trazo} />
				</>
			)}
			{cual === 'informes' && (
				<>
					<path d="M5.2 7.2 V3.4 H12.8 V7.2" {...trazo} />
					<path d="M3.4 7.2 H14.6 V11.6 H3.4 Z" {...trazo} />
					<path d="M5.6 11.8 H12.4 V15 H5.6 Z" {...trazo} />
				</>
			)}
			{cual === 'configuracion' && (
				<>
					<circle cx="9" cy="9" r="2.4" {...trazo} />
					<path d="M9 2.6 V4.4 M9 13.6 V15.4 M2.6 9 H4.4 M13.6 9 H15.4 M4.6 4.6 L5.9 5.9 M12.1 12.1 L13.4 13.4 M13.4 4.6 L12.1 5.9 M5.9 12.1 L4.6 13.4" {...trazo} />
				</>
			)}
		</svg>
	);
};
