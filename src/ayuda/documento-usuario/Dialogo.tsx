import React from 'react';

import { Boton, Icono } from '../montar-el-ano/ant';
import { ACENTO, ALTO_TITULO_DIALOGO, Dialogo, LETRA, RELLENO_DIALOGO, TEXTO_TENUE, anchoDeBoton, cajaCentrada, type Rect } from '../secretaria/piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PONER EL DOCUMENTO COMO USUARIO» (`paginas/panel-alumnos/documento-como-usuario.ts`).
 *
 * Tres fases: MIRANDO («Mirando las cuentas…», la consulta que no escribe), REVISADO (la cifra, los
 * matices, el aviso rojo y «Cambiar los N») y HECHO (la cifra pasa a «usuarios cambiados», el aviso
 * se va, y el pie ofrece «Copiar lo que quedó fuera»: el diálogo no se cierra solo). Los choques
 * salen desplegados solos (`documento-como-usuario.ts:356`). En la cáscara. No sabe de tiempo.
 */

export const CAJA = cajaCentrada(720, 520);
const CUERPO = CAJA.y + ALTO_TITULO_DIALOGO + 18;

export const Y = { quien: 0, cifra: 34, ya: 112, sinDoc: 160, choque: 208, lista: 256, peligro: 318 };

const X = CAJA.x + RELLENO_DIALOGO;
const ANCHO = CAJA.ancho - RELLENO_DIALOGO * 2;

export const rectCifraYMatices = (): Rect => ({ x: X, y: CUERPO + Y.cifra, ancho: ANCHO, alto: Y.choque - Y.cifra - 8 });
export const rectChoques = (): Rect => ({ x: X, y: CUERPO + Y.choque, ancho: ANCHO, alto: Y.peligro - Y.choque - 8 });

export const BOTON_CAMBIAR = (n: number) => anchoDeBoton(`Cambiar los ${n}`);
export const BOTON_CANCELAR = anchoDeBoton('Cancelar');
export const BOTON_COPIAR = anchoDeBoton('Copiar lo que quedó fuera', true);
export const BOTON_CERRAR = anchoDeBoton('Cerrar');

const pieY = CAJA.y + CAJA.alto - 60 + 14;
export const rectCambiar = (n: number): Rect => ({ x: CAJA.x + CAJA.ancho - RELLENO_DIALOGO - BOTON_CAMBIAR(n), y: pieY, ancho: BOTON_CAMBIAR(n), alto: 32 });
export const rectPeligroYCambiar = (n: number): Rect => ({ x: X, y: CUERPO + Y.peligro, ancho: ANCHO, alto: pieY + 32 - (CUERPO + Y.peligro) });
export const rectPieHecho = (): Rect => {
	const ancho = BOTON_COPIAR + 8 + BOTON_CERRAR;
	return { x: CAJA.x + CAJA.ancho - RELLENO_DIALOGO - ancho, y: pieY, ancho, alto: 32 };
};

export interface Choque { nombre: string; documento: string; motivo: string }

export interface EstadoDialogo {
	t: number;
	fase: 'mirando' | 'revisado' | 'aplicando' | 'hecho';
	giro: number;
	contenido: number;
	encimaCambiar?: boolean;
}

const Matiz: React.FC<{ tono: 'hecho' | 'aviso' | 'choque'; icono: 'bien' | 'alerta' | 'aspa'; texto: string; em: string; ver?: string; y: number }> = ({ tono, icono, texto, em, ver, y }) => {
	const c = tono === 'hecho' ? ['#f6ffed', '#b7eb8f', '#237804'] : tono === 'aviso' ? ['#fffbe6', '#ffe58f', '#ad6800'] : ['#fff1f0', '#ffa39e', '#a8071a'];
	return (
		<div style={{ position: 'absolute', top: 18 + y, left: RELLENO_DIALOGO, width: ANCHO, height: 40, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 9, padding: '0 11px', borderRadius: 6, background: c[0], border: `1px solid ${c[1]}`, color: c[2], fontSize: LETRA }}>
			<Icono cual={icono} tam={16} color={c[2]} />
			<span>{texto}<span style={{ color: TEXTO_TENUE, marginLeft: 6 }}>{em}</span></span>
			{ver && <div style={{ marginLeft: 'auto' }}><Boton texto={ver} pequeno ancho={anchoDeBoton(ver, false, true)} /></div>}
		</div>
	);
};

export const DialogoDocumento: React.FC<{ quien: string; cambian: number; yaLoTenian: number; sinDocumento: number; choques: Choque[]; estado: EstadoDialogo }> = ({
	quien, cambian, yaLoTenian, sinDocumento, choques, estado: e,
}) => {
	const hecho = e.fase === 'hecho';
	const pie = hecho ? (
		<div style={{ position: 'absolute', right: RELLENO_DIALOGO, top: 14, display: 'flex', gap: 8 }}>
			<Boton texto="Copiar lo que quedó fuera" icono="copy" ancho={BOTON_COPIAR} />
			<Boton texto="Cerrar" tipo="primary" ancho={BOTON_CERRAR} />
		</div>
	) : (
		<div style={{ position: 'absolute', right: RELLENO_DIALOGO, top: 14, display: 'flex', gap: 8 }}>
			<Boton texto="Cancelar" ancho={BOTON_CANCELAR} />
			{e.fase !== 'mirando' && (
				<Boton
					texto={e.fase === 'aplicando' ? 'Cambiando…' : `Cambiar los ${cambian}`}
					tipo="primary"
					peligro
					cargando={e.fase === 'aplicando'}
					giroCarga={e.giro}
					encima={e.encimaCambiar}
					ancho={BOTON_CAMBIAR(cambian)}
				/>
			)}
		</div>
	);

	return (
		<Dialogo caja={CAJA} titulo="Poner el documento como usuario" t={e.t} pie={pie}>
			<div style={{ fontSize: LETRA, color: TEXTO_TENUE, height: 22 }}>{quien}</div>
			{e.fase === 'mirando' ? (
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, color: TEXTO_TENUE }}>
					<Icono cual="cargando" tam={18} color={ACENTO} giro={e.giro} />
					Mirando las cuentas…
				</div>
			) : (
				<div style={{ opacity: e.contenido }}>
					<div style={{ position: 'absolute', top: 18 + Y.cifra, left: RELLENO_DIALOGO, width: ANCHO, height: 66, boxSizing: 'border-box', display: 'flex', alignItems: 'baseline', gap: 10, padding: '14px 18px', borderRadius: 6, background: '#fafafa', border: '1px solid #f0f0f0' }}>
						<span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>{cambian}</span>
						<span style={{ color: 'rgba(0,0,0,0.6)', fontSize: LETRA + 1 }}>{hecho ? 'usuarios cambiados' : 'cuentas cambiarán'}</span>
					</div>
					<Matiz tono="hecho" icono="bien" texto={`${yaLoTenian} ya lo tenían puesto`} em="" y={Y.ya} />
					<Matiz tono="aviso" icono="alerta" texto={`${sinDocumento} sin documento`} em="se queda como está" ver="Ver quiénes" y={Y.sinDoc} />
					<Matiz tono="choque" icono="aspa" texto={`${choques.length} choca con otra cuenta`} em="hay que arreglarlo a mano" ver="Ocultar" y={Y.choque} />
					<div style={{ position: 'absolute', top: 18 + Y.lista, left: RELLENO_DIALOGO, width: ANCHO, boxSizing: 'border-box', padding: '8px 13px', borderLeft: '3px solid #bfbfbf', fontSize: LETRA - 1 }}>
						{choques.map((c) => (
							<div key={c.documento} style={{ display: 'flex', gap: 8, alignItems: 'baseline', height: 30 }}>
								<b>{c.nombre}</b>
								<code style={{ color: 'rgba(0,0,0,0.6)', fontSize: LETRA - 1 }}>{c.documento}</code>
								<span style={{ color: TEXTO_TENUE }}>{c.motivo}</span>
							</div>
						))}
					</div>
					{!hecho && (
						<div style={{ position: 'absolute', top: 18 + Y.peligro, left: RELLENO_DIALOGO, width: ANCHO, height: 40, boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 13px', borderRadius: 6, background: '#fff1f0', border: '1px solid #ffa39e', color: '#a8071a', fontWeight: 700, fontSize: LETRA }}>
							Quien entre con el usuario anterior dejará de poder hacerlo.
						</div>
					)}
				</div>
			)}
		</Dialogo>
	);
};
