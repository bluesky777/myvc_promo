import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

import { ALTO_TELEFONO, ANCHO_TELEFONO, BarraDeApp, BarraDeEstado, Telefono } from '../movil/Telefono';
import { Escudo } from './Marco';
import { MONO, RAYA, RAYA2, SANS, TARJETA, TINTA, TINTA2, TINTA3, TINTA_AZUL } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL TELÉFONO DEL DOCENTE, ENCIMA DE LA PANTALLA DEL PORTAL.
 *
 * ES LA MITAD DEL ARGUMENTO Y POR ESO SE VE ENTERO. Lo que se le vende a la Unión no es que el
 * portal tenga una pantalla de comunicados: es que **lo que se escribe ahí sale del navegador y
 * termina en el bolsillo de 401 personas**. Eso no se cuenta con una frase al pie; se cuenta
 * subiendo el teléfono por delante en el momento exacto en que se pulsa «Publicar».
 *
 * ── DOS LICENCIAS, ANOTADAS ────────────────────────────────────────────────────────────────────
 *
 * 1. EL APARATO ES EL DE `src/movil/`, no el que dibujan las pantallas del portal. Las maquetas de
 *    `myvc_ucn/diseno/` pintan un móvil crema, del color del portal; el de verdad es el de la app
 *    de los docentes, que ya sale en el clip del móvil de este mismo vídeo. Si en un vídeo el mismo
 *    teléfono cambia de aspecto entre dos clips, lo que se lee es que son dos aplicaciones.
 *
 * 2. LA BARRA DE LA APP VA EN SU MORADO (`myvc_flutter`, `lib/constantes.dart`) y no en el azul del
 *    portal, **porque eso es exactamente lo que el clip afirma**: al docente le llega dentro de la
 *    app que ya usa para sus notas, sin instalar nada ni repartir otra contraseña. Pintarla de azul
 *    diría lo contrario -- que hay una aplicación nueva.
 *
 * El aviso sí lleva el escudo del portal en azul tinta: la notificación la manda la Red Educativa,
 * y en la bandeja del sistema el icono es de quien envía.
 */

/** Cuánto se encoge el teléfono para caber sobre la pantalla del portal sin taparla entera. */
export const ESCALA_MOVIL = 0.78;

/**
 * EL TELÉFONO QUE ENTRA Y SE VA. Sube desde abajo con muelle y se apaga por donde vino: nunca
 * aparece de golpe. `desde` es cuando entra y `sale` cuando se retira.
 */
export const MovilFlotante: React.FC<{
	desde: number;
	sale?: number;
	x: number;
	y: number;
	escala?: number;
	children: React.ReactNode;
}> = ({ desde, sale = Infinity, x, y, escala = ESCALA_MOVIL, children }) => {
	const frame = useCurrentFrame();

	const dentro = interpolate(frame, [desde, desde + 22], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	/* `sale` puede no llegar nunca --el teléfono se queda hasta el final-- y `interpolate` no admite
	 * infinitos en el rango: por eso la salida se calcula sólo cuando hay una. */
	const fuera = Number.isFinite(sale)
		? interpolate(frame, [sale, sale + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
		: 0;
	const visible = dentro * (1 - fuera);
	if (visible <= 0.001) { return null; }

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: ANCHO_TELEFONO * escala,
				height: ALTO_TELEFONO * escala,
				zIndex: 30,
				opacity: visible,
				/* Sube desde abajo al entrar y baja al irse: el mismo gesto, en los dos sentidos. */
				transform: `translateY(${interpolate(dentro, [0, 1], [70, 0]) + fuera * 40}px) scale(${escala * interpolate(visible, [0, 1], [0.94, 1])})`,
				transformOrigin: 'top left',
				filter: `drop-shadow(0 26px 60px rgba(30,29,25,${0.26 * visible}))`,
			}}
		>
			{/* El teléfono se dibuja a su tamaño natural; lo encoge el `scale` de arriba. */}
			<Telefono>{children}</Telefono>
		</div>
	);
};

/**
 * EL AVISO EN LA BANDEJA. Baja desde arriba **encima de lo que el docente esté mirando**, que es la
 * forma en que llega de verdad: nadie tiene la app abierta esperando.
 */
export const Push: React.FC<{
	desde: number;
	titulo: string;
	cuerpo: string;
	cuando?: string;
	sale?: number;
}> = ({ desde, titulo, cuerpo, cuando = 'ahora', sale = Infinity }) => {
	const frame = useCurrentFrame();

	const dentro = interpolate(frame, [desde, desde + 16], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.4)),
	});
	const fuera = Number.isFinite(sale)
		? interpolate(frame, [sale, sale + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
		: 0;
	const visible = Math.min(dentro, 1) * (1 - fuera);
	if (visible <= 0.001) { return null; }

	return (
		<div
			style={{
				position: 'absolute',
				top: 62,
				left: 14,
				right: 14,
				zIndex: 50,
				background: 'rgba(255,253,249,.97)',
				border: `1px solid ${RAYA2}`,
				borderRadius: 20,
				padding: '14px 16px',
				display: 'flex',
				gap: 13,
				boxShadow: '0 18px 40px rgba(15,28,52,.28)',
				fontFamily: SANS,
				opacity: visible,
				transform: `translateY(${interpolate(dentro, [0, 1], [-90, 0]) - fuera * 60}px)`,
				backdropFilter: 'blur(6px)',
			}}
		>
			<div style={{ width: 40, height: 40, borderRadius: 11, background: TINTA_AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
				<Escudo color={TARJETA} />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, minWidth: 0 }}>
				<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
					<span style={{ fontSize: 12.5, fontWeight: 600, color: TINTA2 }}>MyVC · Red Educativa</span>
					<span style={{ fontFamily: MONO, fontSize: 11, color: TINTA3 }}>{cuando}</span>
				</div>
				<div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: TINTA }}>{titulo}</div>
				<div style={{ fontSize: 13, color: TINTA2, lineHeight: 1.4 }}>{cuerpo}</div>
			</div>
		</div>
	);
};

/** La cabecera de la app dentro del teléfono: barra de estado y barra morada con el título. */
export const AppDocente: React.FC<{ titulo: string; volver?: boolean; children: React.ReactNode }> = ({ titulo, volver = true, children }) => (
	<div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: TARJETA, fontFamily: SANS, color: TINTA }}>
		<BarraDeEstado />
		<BarraDeApp titulo={titulo} volver={volver} />
		<div style={{ flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
	</div>
);

/** La raya fina que separa bloques dentro del teléfono. */
export const RayaMovil: React.FC = () => <div style={{ height: 1, background: RAYA }} />;
