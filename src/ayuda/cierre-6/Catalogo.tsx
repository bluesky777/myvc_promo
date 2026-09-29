import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import {
	ALTO_TARJETA, ANCHO_CONTENIDO, CAT, CAT_TEXTOS, CIERRE_DE_ANO, CIERRE_DE_ANO_FAMILIA, CONF, FAMILIAS, Ficha,
	PARA_LA_FAMILIA, PASTILLAS, X_CONFIG, Y_CONFIG, rectanguloDeFichaEnContenido,
	rectanguloDelSelectorDeGrupo,
} from './datos-catalogo';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CATÁLOGO DE INFORMES, DIBUJADO. Ver `catalogo.ts` para lo que es literal y lo que se cuenta.
 *
 * Lo que se enseña es el camino corto de fin de año: **la familia «Cierre de año» es un filtro**,
 * y deja las seis fichas de diciembre juntas. Se elige una, y el configurador de la derecha pide
 * lo que esa ficha necesita --el grupo, o nada--.
 */

/** Los grupos que ofrece el desplegable del configurador. */
export const OPCIONES_DE_GRUPO = ['6°A', '7°A', '8°A', '9°A', '9°B', '10°A'];
export const OPCION_9B = OPCIONES_DE_GRUPO.indexOf('9°B');
export const ALTO_OPCION = 38;

export function rectanguloDeOpcion(i: number) {
	const s = rectanguloDelSelectorDeGrupo();
	return { x: s.x, y: s.y + s.alto + 6 + i * ALTO_OPCION, ancho: s.ancho, alto: ALTO_OPCION };
}

const TITULO = 4;

export const Catalogo: React.FC<{
	/** Cuándo se pulsa «Cierre de año». */
	familiaEn: number;
	/** La ficha que se elige y cuándo. */
	ficha: { indice: number; en: number };
	/** Cuándo se abre el desplegable del grupo y cuándo se elige 9°B. Sin esto, la ficha no pide grupo. */
	grupo?: { abre: number; elige: number };
	cargarEn: number;
	salidaEn: number;
	/** Lo que el ratón tiene encima. */
	senal?: 'familia' | 'ficha' | 'grupo' | 'opcion' | 'cargar' | null;
}> = ({ familiaEn, ficha, grupo, cargarEn, salidaEn, senal = null }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cursorTitulo = escribiendo(frame, CAT_TEXTOS.titulo, TITULO, 2) && frame % 20 < 12;
	const fuera = seVa(frame, 0, salidaEn, 4);
	const conCierre = frame >= familiaEn;
	const familia = conCierre ? CIERRE_DE_ANO_FAMILIA : PARA_LA_FAMILIA;
	const cambio = conCierre ? familiaEn : 10;
	const elegida = frame >= ficha.en ? CIERRE_DE_ANO_FAMILIA.fichas[ficha.indice] : null;

	return (
		<div style={{ width: ANCHO_CONTENIDO, height: '100%', position: 'relative', opacity: 1 - fuera }}>
			{/* La tarjeta del buscador. */}
			<div
				style={{
					position: 'absolute',
					left: CAT.lados,
					top: CAT.arriba,
					width: ANCHO_CONTENIDO - CAT.lados * 2,
					height: ALTO_TARJETA,
					padding: CAT.pad,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					border: `1px solid ${BORDE}`,
					borderRadius: 12,
				}}
			>
				<div style={{ height: CAT.fila1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div style={{ fontSize: 30, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
						{escrito(frame, CAT_TEXTOS.titulo, TITULO, 2)}
						<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
					</div>
					<div style={{ fontSize: 16, color: TEXTO_TENUE, opacity: entra(frame, fps, 14, 12) }}>
						Periodo <b style={{ color: TEXTO }}>{CAT_TEXTOS.contexto.periodo}</b> abierto · <b style={{ color: TEXTO }}>{CAT_TEXTOS.contexto.grupos}</b> grupos
					</div>
				</div>
				<div style={{ height: CAT.hueco }} />
				<div
					style={{
						height: CAT.busca,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: '0 16px',
						boxSizing: 'border-box',
						border: `1px solid ${BORDE}`,
						borderRadius: 10,
						fontSize: 18,
						color: TEXTO_TENUE,
						opacity: entra(frame, fps, 10, 12),
					}}
				>
					<Lupa />
					{CAT_TEXTOS.busqueda}
				</div>
			</div>

			{/* Las pastillas de familia, con su cuenta. Son un filtro: «Todo» va puesta al llegar. */}
			{FAMILIAS.map((f, i) => {
				const r = PASTILLAS[i];
				const puesta = conCierre ? i === CIERRE_DE_ANO : i === 0;
				const encima = i === CIERRE_DE_ANO && senal === 'familia';
				return (
					<div
						key={f.titulo}
						style={{
							position: 'absolute',
							left: r.x,
							top: r.y,
							width: r.ancho,
							height: r.alto,
							boxSizing: 'border-box',
							borderRadius: 999,
							border: `1px solid ${puesta || encima ? `${ACENTO}73` : BORDE}`,
							background: puesta ? `${ACENTO}14` : 'transparent',
							color: puesta ? ACENTO : encima ? TEXTO : 'rgba(0,0,0,.6)',
							fontWeight: puesta ? 600 : 400,
							fontSize: 15,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							whiteSpace: 'nowrap',
							opacity: llega(frame, fps, i, 14, 1).opacidad,
						}}
					>
						{f.titulo}
						<span style={{ opacity: 0.6, marginLeft: 5, fontVariantNumeric: 'tabular-nums' }}>{f.cuenta}</span>
					</div>
				);
			})}

			{/* La familia: su cabeza y sus fichas. Al cambiar de filtro, la lista se vuelve a montar. */}
			<div key={familia.titulo} style={{ position: 'absolute', left: CAT.lados, top: CAT.arriba + ALTO_TARJETA + CAT.trasTarjeta, opacity: entra(frame, fps, cambio, 10) }}>
				<div style={{ fontSize: 22, fontWeight: 700, color: TEXTO }}>{familia.titulo}</div>
				<div style={{ fontSize: 16, color: TEXTO_TENUE, marginTop: 4 }}>{familia.para}</div>
			</div>
			{familia.fichas.map((f, i) => {
				const r = rectanguloDeFichaEnContenido(i);
				const nace = llega(frame, fps, i, cambio + 4, 3);
				const esLa = conCierre && elegida !== null && i === ficha.indice;
				const encima = conCierre && i === ficha.indice && senal === 'ficha';
				return (
					<div
						key={`${familia.titulo}-${f.nombre}`}
						style={{
							position: 'absolute',
							left: r.x,
							top: r.y,
							width: r.ancho,
							height: r.alto,
							boxSizing: 'border-box',
							padding: '12px 14px',
							display: 'flex',
							gap: 12,
							borderRadius: 10,
							border: `1px solid ${esLa || encima ? ACENTO : BORDE}`,
							boxShadow: esLa ? `0 0 0 3px ${ACENTO}22` : 'none',
							background: SUPERFICIE,
							opacity: nace.opacidad,
							transform: `translateY(${nace.y * 0.5}px)`,
						}}
					>
						<IconoDeInforme ficha={f} />
						<div style={{ minWidth: 0 }}>
							<div style={{ fontSize: 17, fontWeight: 600, color: TEXTO, lineHeight: 1.25 }}>{f.nombre}</div>
							<div style={{ fontSize: 14, color: TEXTO_TENUE, lineHeight: 1.3, marginTop: 3 }}>{f.para}</div>
						</div>
					</div>
				);
			})}

			{elegida && <Configurador ficha={elegida} desde={ficha.en} grupo={grupo} cargarEn={cargarEn} senal={senal} />}
		</div>
	);
};

const Configurador: React.FC<{
	ficha: Ficha;
	desde: number;
	grupo?: { abre: number; elige: number };
	cargarEn: number;
	senal: string | null;
}> = ({ ficha, desde, grupo, cargarEn, senal }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, desde, 14);
	const hayGrupo = grupo !== undefined && frame >= grupo.elige;
	const abierto = grupo !== undefined && frame >= grupo.abre && frame < grupo.elige + 4;
	const listo = !ficha.pideGrupo || hayGrupo;
	const sel = rectanguloDelSelectorDeGrupo();
	const pulsado = frame >= cargarEn && frame < cargarEn + 8;

	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: X_CONFIG,
					top: Y_CONFIG,
					width: CAT.config,
					padding: CONF.pad,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					border: `1px solid ${BORDE}`,
					borderRadius: 12,
					opacity: a,
					transform: `translateX(${(1 - a) * 16}px)`,
				}}
			>
				<div style={{ height: CONF.cabeza }}>
					<div style={{ fontSize: 21, fontWeight: 700, color: TEXTO, lineHeight: 1.25 }}>{ficha.nombre}</div>
					<div style={{ fontSize: 15, color: TEXTO_TENUE, lineHeight: 1.35, marginTop: 6 }}>{ficha.para}</div>
				</div>

				{ficha.pideGrupo ? (
					<div style={{ height: CONF.campo }}>
						<div style={{ fontSize: 13, fontWeight: 700, color: TEXTO_TENUE, letterSpacing: 0.8, textTransform: 'uppercase', height: 24 }}>{CAT_TEXTOS.grupo}</div>
						<div
							style={{
								height: sel.alto,
								boxSizing: 'border-box',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '0 12px',
								borderRadius: 8,
								border: `1px solid ${abierto || senal === 'grupo' ? ACENTO : BORDE}`,
								fontSize: 17,
								color: hayGrupo ? TEXTO : TEXTO_TENUE,
							}}
						>
							{hayGrupo ? '9°B' : CAT_TEXTOS.eligeGrupo}
							<span style={{ fontSize: 13, color: TEXTO_TENUE }}>▾</span>
						</div>
					</div>
				) : (
					<div style={{ height: 54, fontSize: 15, color: TEXTO_TENUE }}>{CAT_TEXTOS.sinCampos}</div>
				)}

				<div
					style={{
						height: CONF.boton,
						borderRadius: 8,
						background: listo ? (senal === 'cargar' || pulsado ? '#4096ff' : ACENTO) : '#f0f0f0',
						color: listo ? '#fff' : 'rgba(0,0,0,.3)',
						fontSize: 17,
						fontWeight: 600,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: pulsado ? 'scale(.98)' : undefined,
					}}
				>
					{listo ? CAT_TEXTOS.cargar : CAT_TEXTOS.eligeGrupo}
				</div>
				<div
					style={{
						height: CONF.boton - 4,
						marginTop: CONF.huecoBoton,
						borderRadius: 8,
						border: `1px solid ${BORDE}`,
						color: listo ? TEXTO : 'rgba(0,0,0,.3)',
						fontSize: 15,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{CAT_TEXTOS.pila}
				</div>
			</div>

			{/* El desplegable del grupo, por encima de todo, como el de Ant. */}
			{abierto && grupo && (
				<div
					style={{
						position: 'absolute',
						left: sel.x,
						top: sel.y + sel.alto + 6,
						width: sel.ancho,
						background: SUPERFICIE,
						borderRadius: 8,
						boxShadow: '0 6px 16px rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
						padding: '4px 0',
						opacity: entra(frame, fps, grupo.abre, 8),
						zIndex: 5,
					}}
				>
					{OPCIONES_DE_GRUPO.map((g, i) => (
						<div
							key={g}
							style={{
								height: ALTO_OPCION,
								display: 'flex',
								alignItems: 'center',
								padding: '0 12px',
								fontSize: 17,
								color: TEXTO,
								background: i === OPCION_9B && (senal === 'opcion' || frame >= grupo.elige) ? `${ACENTO}14` : 'transparent',
								fontWeight: i === OPCION_9B && frame >= grupo.elige ? 600 : 400,
							}}
						>
							{g}
						</div>
					))}
				</div>
			)}
		</>
	);
};

const Lupa: React.FC = () => (
	<svg width="20" height="20" viewBox="0 0 20 20">
		<circle cx="8.6" cy="8.6" r="5.4" fill="none" stroke="#8c8c8c" strokeWidth="1.7" />
		<path d="M12.6 12.6 L17 17" stroke="#8c8c8c" strokeWidth="1.7" strokeLinecap="round" />
	</svg>
);

/**
 * EL ICONO DE LA FICHA: una hoja con renglones; con `firma`, un trazo de firma, y con `alerta`, el
 * triángulo. Es el reparto de `icono-informe.ts` para las fichas de cierre, dibujado simple.
 */
const IconoDeInforme: React.FC<{ ficha: Ficha }> = ({ ficha }) => (
	<svg width="44" height="44" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
		<rect x="0" y="0" width="44" height="44" rx="10" fill={`${ACENTO}14`} />
		<path d="M13 9 H27 L32 14 V35 H13 Z" fill="#fff" stroke={ACENTO} strokeWidth="1.6" strokeLinejoin="round" />
		<path d="M17 18 H28 M17 22 H28 M17 26 H24" stroke={ACENTO} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
		{ficha.firma && <path d="M17 31 C19 28 20 33 22 30 C23 29 24 31 27 30" fill="none" stroke={ACENTO} strokeWidth="1.5" strokeLinecap="round" />}
		{ficha.alerta && (
			<>
				<path d="M33 25 L39 36 H27 Z" fill="#faad14" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
				<path d="M33 29 V32.5 M33 34.4 V34.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
			</>
		)}
	</svg>
);
