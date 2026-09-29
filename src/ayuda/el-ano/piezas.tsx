import React from 'react';

import { MEDIDAS } from '../medidas';
import { ACENTO, AVISO_AMARILLO, BORDE, Boton, Icono, LETRA, PELIGRO, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../montar-el-ano/ant';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS PIEZAS DE ng-zorro QUE NO ESTABAN EN `montar-el-ano/ant.tsx`: el popconfirm, el modal con su
 * máscara, el interruptor con su carga, el radio y la etiqueta. Mismo criterio que allí: se pintan
 * a la medida de la aplicación (1440 de ancho) y no saben de tiempo.
 */

/** `nz-switch`, con su estado de carga (`nzLoading`): el círculo lleva un arco que gira. */
export const Interruptor: React.FC<{ encendido: number; carga?: number; frame?: number; pequeno?: boolean }> = ({ encendido, carga = 0, frame = 0, pequeno = false }) => {
	const ancho = pequeno ? 28 : 44;
	const alto = pequeno ? 16 : 22;
	const bola = alto - 4;
	const fondo = encendido > 0.5 ? ACENTO : 'rgba(0,0,0,0.25)';
	return (
		<div style={{ width: ancho, height: alto, borderRadius: alto / 2, background: fondo, position: 'relative', flex: 'none', opacity: carga > 0 ? 0.65 : 1 }}>
			<div
				style={{
					position: 'absolute',
					top: 2,
					left: 2 + (ancho - bola - 4) * encendido,
					width: bola,
					height: bola,
					borderRadius: '50%',
					background: '#fff',
					boxShadow: '0 2px 4px rgba(0,35,11,0.2)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{carga > 0 && <Icono cual="cargando" tam={bola - 6} color={ACENTO} giro={(frame * 24) % 360} />}
			</div>
		</div>
	);
};

/** Un radio nativo (el círculo), marcado o no. */
export const Radio: React.FC<{ marcado: boolean; tam?: number }> = ({ marcado, tam = 16 }) => (
	<div
		style={{
			width: tam,
			height: tam,
			boxSizing: 'border-box',
			borderRadius: '50%',
			border: `1px solid ${marcado ? ACENTO : BORDE}`,
			background: SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flex: 'none',
		}}
	>
		{marcado && <div style={{ width: tam / 2, height: tam / 2, borderRadius: '50%', background: ACENTO }} />}
	</div>
);

/** Una etiqueta (`nz-tag`). */
export const Etiqueta: React.FC<{ texto: string; color?: 'azul' | 'verde' | 'oro' | 'rojo' | 'gris' }> = ({ texto, color = 'gris' }) => {
	const c = {
		azul: { f: '#e6f4ff', b: '#91caff', l: '#0958d9' },
		verde: { f: '#f6ffed', b: '#b7eb8f', l: '#389e0d' },
		oro: { f: '#fffbe6', b: '#ffe58f', l: '#d48806' },
		rojo: { f: '#fff1f0', b: '#ffa39e', l: '#cf1322' },
		gris: { f: '#fafafa', b: '#d9d9d9', l: 'rgba(0,0,0,0.88)' },
	}[color];
	return (
		<span style={{ fontSize: 12.5, padding: '1px 7px', borderRadius: 4, border: `1px solid ${c.b}`, background: c.f, color: c.l, whiteSpace: 'nowrap', lineHeight: '18px' }}>
			{texto}
		</span>
	);
};

/*
 * EL POPCONFIRM. Una burbuja con su flecha hacia abajo, que sale ENCIMA del botón (`nzPlacement`
 * por defecto, «top»). `x` e `y` son la punta de la flecha: el centro de arriba del botón.
 */
export const Popconfirm: React.FC<{
	x: number;
	y: number;
	ancho: number;
	titulo: React.ReactNode;
	ok: string;
	cancelar: string;
	aparece: number;
	encimaOk?: boolean;
	peligro?: boolean;
	/** Hacia dónde se corre la burbuja respecto a la flecha: 0.5 centrada, 0.15 casi toda a la derecha. */
	ancla?: number;
}> = ({ x, y, ancho, titulo, ok, cancelar, aparece, encimaOk = false, peligro = false, ancla = 0.5 }) => {
	if (aparece <= 0.001) { return null; }
	return (
		<div
			style={{
				position: 'absolute',
				left: x - ancho * ancla,
				bottom: MEDIDAS.alto - y + 10,
				width: ancho,
				boxSizing: 'border-box',
				padding: '12px 16px',
				background: SUPERFICIE,
				borderRadius: 8,
				boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
				opacity: aparece,
				transform: `scale(${0.9 + aparece * 0.1})`,
				transformOrigin: `${ancla * 100}% 100%`,
				zIndex: 8,
				fontSize: LETRA - 0.5,
				color: TEXTO,
			}}
		>
			<div style={{ display: 'flex', gap: 8 }}>
				<div style={{ marginTop: 2 }}><Icono cual="alerta" tam={15} color={AVISO_AMARILLO.icono} /></div>
				<div style={{ lineHeight: 1.5 }}>{titulo}</div>
			</div>
			<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
				<Boton texto={cancelar} pequeno />
				<Boton texto={ok} pequeno tipo="primary" peligro={peligro} encima={encimaOk} />
			</div>
			<div
				style={{
					position: 'absolute',
					left: ancho * ancla - 7,
					bottom: -6,
					width: 14,
					height: 14,
					background: SUPERFICIE,
					transform: 'rotate(45deg)',
					boxShadow: '3px 3px 7px rgba(0,0,0,0.07)',
				}}
			/>
		</div>
	);
};

/**
 * EL MODAL, con la máscara sobre la cáscara entera (la barra y el menú también se apagan, como en
 * la aplicación). `y` es donde empieza la caja; el ancho, el de `nzWidth`.
 */
export const Modal: React.FC<{
	ancho: number;
	y: number;
	titulo: string;
	aparece: number;
	children?: React.ReactNode;
	botones?: React.ReactNode;
	cerrar?: boolean;
}> = ({ ancho, y, titulo, aparece, children, botones, cerrar = true }) => {
	if (aparece <= 0.001) { return null; }
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 9 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: aparece, borderRadius: 12 }} />
			<div
				style={{
					position: 'absolute',
					left: (MEDIDAS.ancho - ancho) / 2,
					top: y,
					width: ancho,
					boxSizing: 'border-box',
					padding: '20px 24px',
					background: SUPERFICIE,
					borderRadius: 8,
					boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
					opacity: aparece,
					transform: `scale(${0.94 + aparece * 0.06})`,
					transformOrigin: '50% 30%',
					fontSize: LETRA,
					color: TEXTO,
				}}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
					<div style={{ fontSize: 16.5, fontWeight: 600 }}>{titulo}</div>
					{cerrar && <Icono cual="aspa" tam={16} color={TEXTO_TENUE} />}
				</div>
				{children}
				{botones && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>{botones}</div>}
			</div>
		</div>
	);
};

export { PELIGRO };

/*
 * EL `confirm` DE ng-zorro (`ModalService.confirmar`): icono de aviso, título en negrita, el texto
 * debajo, y abajo a la derecha «no» (normal) y «sí» (primario, rojo si es peligroso). 416 de ancho.
 */
export const Confirmar: React.FC<{
	titulo: string;
	contenido: string;
	si: string;
	no: string;
	peligroso?: boolean;
	aparece: number;
	encimaSi?: boolean;
	encimaNo?: boolean;
	y?: number;
}> = ({ titulo, contenido, si, no, peligroso = false, aparece, encimaSi = false, encimaNo = false, y = CONFIRMAR.y }) => {
	if (aparece <= 0.001) { return null; }
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 9 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: aparece, borderRadius: 12 }} />
			<div
				style={{
					position: 'absolute',
					left: (MEDIDAS.ancho - CONFIRMAR.ancho) / 2,
					top: y,
					width: CONFIRMAR.ancho,
					height: CONFIRMAR.alto,
					boxSizing: 'border-box',
					padding: '20px 24px',
					background: SUPERFICIE,
					borderRadius: 8,
					boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
					opacity: aparece,
					transform: `scale(${0.94 + aparece * 0.06})`,
					transformOrigin: '50% 30%',
					fontSize: LETRA,
					color: TEXTO,
				}}
			>
				<div style={{ position: 'absolute', right: 18, top: 18 }}><Icono cual="aspa" tam={16} color={TEXTO_TENUE} /></div>
				<div style={{ display: 'flex', gap: 12 }}>
					<div style={{ marginTop: 2 }}><Icono cual="alerta" tam={20} color={AVISO_AMARILLO.icono} /></div>
					<div>
						<div style={{ fontSize: 16.5, fontWeight: 600, lineHeight: '24px' }}>{titulo}</div>
						<div style={{ marginTop: 8, lineHeight: '22px' }}>{contenido}</div>
					</div>
				</div>
				<div style={{ position: 'absolute', right: 24, bottom: 20, display: 'flex', gap: 8 }}>
					<Boton texto={no} encima={encimaNo} ancho={CONFIRMAR.no} />
					<Boton texto={si} tipo="primary" peligro={peligroso} encima={encimaSi} ancho={CONFIRMAR.si} />
				</div>
			</div>
		</div>
	);
};

export const CONFIRMAR = { ancho: 416, alto: 164, y: 220, no: 118, si: 150 };

/** Dónde caen los botones del `confirm`, en coordenadas de la cáscara. */
export function rectConfirmar(cual: 'si' | 'no', y = CONFIRMAR.y) {
	const x0 = (MEDIDAS.ancho - CONFIRMAR.ancho) / 2;
	const derecha = x0 + CONFIRMAR.ancho - 24;
	const arriba = y + CONFIRMAR.alto - 20 - 32;
	return cual === 'si'
		? { x: derecha - CONFIRMAR.si, y: arriba, ancho: CONFIRMAR.si, alto: 32 }
		: { x: derecha - CONFIRMAR.si - 8 - CONFIRMAR.no, y: arriba, ancho: CONFIRMAR.no, alto: 32 };
}

export function rectCajaConfirmar(y = CONFIRMAR.y) {
	return { x: (MEDIDAS.ancho - CONFIRMAR.ancho) / 2, y, ancho: CONFIRMAR.ancho, alto: CONFIRMAR.alto };
}
