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
export interface Viaje {
	/** Entre estos dos fotogramas se mueve de donde estaba a donde va. */
	desde: number;
	hasta: number;
	x: number;
	y: number;
	escala: number;
}

export const MovilFlotante: React.FC<{
	desde: number;
	sale?: number;
	x: number;
	y: number;
	escala?: number;
	/** Desde qué altura sube al entrar. Por defecto, desde fuera del borde de abajo. */
	entraDesde?: number;
	/** Un viaje: el teléfono se adelanta y crece sin cortar el plano. */
	viaje?: Viaje;
	children: React.ReactNode;
}> = ({ desde, sale = Infinity, x, y, escala = ESCALA_MOVIL, entraDesde, viaje, children }) => {
	const frame = useCurrentFrame();

	if (frame < desde) { return null; }
	/* Y cuando ya se ha ido del todo, deja de dibujarse: si no, asoma por el borde de abajo. */
	if (Number.isFinite(sale) && frame > sale + 24) { return null; }

	/*
	 * ENTRA DESLIZANDO Y **OPACO**, y esto no es una preferencia: con opacidad se le veía la tarjeta
	 * del portal a través del cuerpo del teléfono durante casi un segundo. En el MP4 parecía un
	 * fallo de render. Un teléfono es un objeto sólido: aparece entrando en cuadro, no apareciendo.
	 */
	const dentro = interpolate(frame, [desde, desde + 26], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const fuera = Number.isFinite(sale)
		? interpolate(frame, [sale, sale + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) })
		: 0;

	const paso = viaje
		? interpolate(frame, [viaje.desde, viaje.hasta], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.inOut(Easing.cubic),
		})
		: 0;
	const px = viaje ? x + (viaje.x - x) * paso : x;
	const py = viaje ? y + (viaje.y - y) * paso : y;
	const pescala = viaje ? escala + (viaje.escala - escala) * paso : escala;

	/** Cuánto baja: al entrar viene de ahí abajo, y al irse vuelve por donde vino. */
	const salto = entraDesde ?? ALTO_TELEFONO * pescala;
	const desliz = interpolate(dentro, [0, 1], [salto, 0]) + fuera * salto;

	return (
		<div
			style={{
				position: 'absolute',
				left: px,
				top: py,
				width: ANCHO_TELEFONO * pescala,
				height: ALTO_TELEFONO * pescala,
				zIndex: 30,
				transform: `translateY(${desliz}px) scale(${pescala})`,
				transformOrigin: 'top left',
				filter: 'drop-shadow(0 26px 60px rgba(30,29,25,.30))',
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

export interface Sitio { x: number; y: number; escala: number }

/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL AVISO QUE SE SALE DEL TELÉFONO.
 *
 * Cae en la bandeja como cae de verdad --desde arriba, encima de lo que el docente esté mirando--,
 * y entonces **se despega y crece por delante del portal**. No es un efecto: dentro del teléfono, a
 * la escala a la que cabe un móvil en un 16:9, el texto del aviso mide seis píxeles y **no se lee**.
 * Y el aviso es justamente lo que hay que leer: es la frase que demuestra que el comunicado llegó.
 *
 * Al tocarlo vuelve a su sitio y entra en la app. Ese regreso es lo que hace que se entienda que lo
 * grande y lo pequeño **son la misma notificación**, y no dos cosas distintas.
 */
export const AvisoQueSale: React.FC<{
	titulo: string;
	cuerpo: string;
	cuando?: string;
	/** Dentro de la bandeja del teléfono. */
	origen: Sitio;
	/** Por delante del portal, grande. */
	destino: Sitio;
	/** Cae, se despega, se planta, vuelve y entra. */
	cae: number;
	sale: number;
	plantado: number;
	vuelve: number;
	dentro: number;
	/** El ancho al que se dibuja antes de escalar: el hueco de la bandeja del teléfono. */
	base?: number;
}> = ({ titulo, cuerpo, cuando = 'ahora', origen, destino, cae, sale, plantado, vuelve, dentro, base = 392 }) => {
	const frame = useCurrentFrame();
	if (frame < cae || frame > dentro + 10) { return null; }

	/* La caída en la bandeja: baja desde fuera de la pantalla del teléfono. */
	const baja = interpolate(frame, [cae, cae + 16], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.3)),
	});

	/* El viaje de ida y el de vuelta, en un solo número de 0 a 1 y otra vez a 0. */
	const ida = interpolate(frame, [sale, plantado], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
	const regreso = interpolate(frame, [vuelve, dentro], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
	const t = ida * (1 - regreso);

	const x = origen.x + (destino.x - origen.x) * t;
	const y = origen.y + (destino.y - origen.y) * t + interpolate(baja, [0, 1], [-70, 0]);
	const escala = origen.escala + (destino.escala - origen.escala) * t;

	/* Al entrar en la app se apaga: ya no es un aviso, es la pantalla que se abre debajo. */
	const apaga = interpolate(frame, [dentro - 4, dentro + 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: base,
				zIndex: 45,
				transform: `scale(${escala})`,
				transformOrigin: 'top left',
				opacity: Math.min(baja, apaga),
				background: 'rgba(255,253,249,.98)',
				border: `1px solid ${RAYA2}`,
				borderRadius: 20,
				padding: '14px 16px',
				display: 'flex',
				gap: 13,
				fontFamily: SANS,
				/* Cuanto más despegado, más sombra: es lo que lo separa del portal de detrás. */
				boxShadow: `0 ${14 + t * 26}px ${32 + t * 44}px rgba(15,28,52,${0.22 + t * 0.16})`,
				boxSizing: 'border-box',
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
