import React from 'react';
import { interpolate } from 'remotion';

import { Avatar } from '../comunes/Avatar';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';
import { Icono, MEDIDAS, SECCIONES } from './medidas';
import { FUENTE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA CÁSCARA DE LA APLICACIÓN: la barra de arriba y el menú de la izquierda.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTO EXISTE, SI LOS CLIPS PROMOCIONALES NO LO NECESITABAN
 *
 * Un clip promocional enseña **la pantalla**: la planilla flotando, grande y sin cromo, porque lo
 * que vende es lo que la pantalla hace. Un vídeo de ayuda tiene que enseñar además **cómo se llega
 * hasta ella**, y eso es exactamente el cromo: el menú, sus nueve secciones y la entrada que hay
 * que pulsar. Sin la cáscara, un vídeo de ayuda contesta «qué hace» y deja sin contestar «dónde
 * está», que es la pregunta que más llega.
 *
 * Por eso la cáscara **no se salta nunca**: los primeros segundos de los ochenta vídeos son el
 * menú abriéndose. Es el trozo más aburrido de hacer y el que más llamadas ahorra.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL SELECTOR DE AÑO Y PERIODO SE VE SIEMPRE, AUNQUE EL VÍDEO NO LO TOQUE
 *
 * «2026 · Periodo 2», arriba a la derecha. Casi todos los «no me deja» empiezan ahí, y que salga en
 * todos los vídeos --aunque ninguno lo use-- es lo que hace que el día que alguien tenga que
 * cambiarlo sepa dónde estaba mirando todo este tiempo.
 */

export const Cascara: React.FC<{
	/** Si «Académico» está desplegado. Entre 0 y 1: se abre con animación. */
	academico: number;
	/** La entrada resaltada como la que el ratón tiene encima, o `null`. */
	senalada?: { seccion: number; hija: number | null } | null;
	/** La pantalla de dentro. */
	children?: React.ReactNode;
}> = ({ academico, senalada = null, children }) => (
	<div
		style={{
			position: 'relative',
			width: MEDIDAS.ancho,
			height: MEDIDAS.alto,
			background: '#f5f7fa',
			borderRadius: 12,
			overflow: 'hidden',
			fontFamily: FUENTE,
			boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
		}}
	>
		<Barra />

		<div style={{ display: 'flex', height: MEDIDAS.alto - MEDIDAS.barra }}>
			<Menu academico={academico} senalada={senalada} />
			<div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
		</div>
	</div>
);

/*
 * LA BARRA. Cuatro cosas y en el orden de la aplicación: la marca, el disparador del buscador
 * --con su atajo escrito, que es como se aprende que existe--, el año y el periodo, y el retrato.
 *
 * EL RETRATO ES UNA CARA Y NO UNAS INICIALES: en la aplicación se prefiere la foto porque «la
 * secretaria entra con su cuenta y con la del rector el mismo día». Aquí va dibujada (`Avatar`),
 * como en todos los clips: en un vídeo que se publica no sale la cara de nadie.
 */
const Barra: React.FC = () => (
	<div
		style={{
			height: MEDIDAS.barra,
			display: 'flex',
			alignItems: 'center',
			gap: 18,
			padding: '0 18px',
			background: SUPERFICIE,
			borderBottom: `1px solid ${BORDE}`,
		}}
	>
		<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
			<div style={{ width: 26, height: 26, borderRadius: 7, background: ACENTO }} />
			<span style={{ fontSize: 17, fontWeight: 700, color: TEXTO }}>MyVC</span>
		</div>

		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				width: 300,
				height: 32,
				padding: '0 12px',
				borderRadius: 8,
				border: `1px solid ${BORDE}`,
				color: TEXTO_TENUE,
				fontSize: 14,
			}}
		>
			<span>Navegar…</span>
			<span style={{ fontSize: 12, border: `1px solid ${BORDE}`, borderRadius: 5, padding: '1px 6px' }}>Ctrl K</span>
		</div>

		<div style={{ flex: 1 }} />

		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				height: 32,
				padding: '0 12px',
				borderRadius: 8,
				border: `1px solid ${BORDE}`,
				fontSize: 14,
				fontWeight: 600,
				color: TEXTO,
			}}
		>
			2026 · Periodo 2
			<Chevron />
		</div>

		<Avatar tipo="hombre" variante={2} tam={32} />
	</div>
);

const Menu: React.FC<{ academico: number; senalada: { seccion: number; hija: number | null } | null }> = ({
	academico, senalada,
}) => (
	<div
		style={{
			width: MEDIDAS.menu,
			background: SUPERFICIE,
			borderRight: `1px solid ${BORDE}`,
			paddingTop: MEDIDAS.menuArriba,
		}}
	>
		{SECCIONES.map((seccion, i) => (
			<div key={seccion.etiqueta}>
				<Entrada
					etiqueta={seccion.etiqueta}
					icono={seccion.icono}
					abierta={seccion.hijas ? academico : 0}
					conHijas={Boolean(seccion.hijas)}
					senalada={senalada?.seccion === i && senalada.hija === null}
				/>

				{seccion.hijas && (
					/*
					 * LAS HIJAS SE DESPLIEGAN EMPUJANDO, no apareciendo encima. En la aplicación el menú
					 * es una columna que crece: si aquí salieran flotando, el vídeo enseñaría un menú que
					 * no existe, y quien fuera a repetirlo buscaría un panel que no se abre.
					 */
					<div style={{ height: seccion.hijas.length * MEDIDAS.hija * academico, overflow: 'hidden' }}>
						{seccion.hijas.map((hija, h) => (
							<Hija
								key={hija}
								etiqueta={hija}
								opacidad={interpolate(academico, [0.45, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
								senalada={senalada?.seccion === i && senalada.hija === h}
							/>
						))}
					</div>
				)}
			</div>
		))}
	</div>
);

const Entrada: React.FC<{ etiqueta: string; icono: Icono; abierta: number; conHijas: boolean; senalada: boolean }> = ({
	etiqueta, icono, abierta, conHijas, senalada,
}) => (
	<div
		style={{
			height: MEDIDAS.seccion,
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			padding: '0 16px',
			fontSize: 15,
			fontWeight: 600,
			color: abierta > 0.5 ? ACENTO : TEXTO,
			background: senalada ? `${ACENTO}14` : 'transparent',
		}}
	>
		<IconoDeSeccion cual={icono} color={abierta > 0.5 ? ACENTO : TEXTO_TENUE} />
		<span style={{ flex: 1 }}>{etiqueta}</span>
		{conHijas && <Chevron giro={abierta * 180} color={abierta > 0.5 ? ACENTO : TEXTO_TENUE} />}
	</div>
);

const Hija: React.FC<{ etiqueta: string; opacidad: number; senalada: boolean }> = ({ etiqueta, opacidad, senalada }) => (
	<div
		style={{
			height: MEDIDAS.hija,
			display: 'flex',
			alignItems: 'center',
			paddingLeft: 44,
			fontSize: 14,
			color: TEXTO,
			opacity: opacidad,
			background: senalada ? `${ACENTO}14` : 'transparent',
		}}
	>
		{etiqueta}
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
