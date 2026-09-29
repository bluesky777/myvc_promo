import React from 'react';

import { Alerta, Boton, Campo, Icono } from '../montar-el-ano/ant';
import { Corte, type Columna } from '../montar-el-ano/Rejilla';
import {
	ACENTO, BORDE, Cara, Dialogo, En, LETRA, MAIN, Pagina, Pista, SelectorDeGrupos, TEXTO, TEXTO_TENUE,
	anchoDeBoton, botonesDelPie, cajaCentrada, enCascara, rectBotonDeGrupo, type Rect,
} from '../secretaria/piezas';
import { CABECERA, FILA, Tabla } from '../secretaria/Tabla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PERSONAS ▸ USUARIOS (`/usuarios`, `paginas/usuarios`). Textos de `usuarios.html` y columnas de
 * `usuarios.ts:473-483` (acudientes). Y el diálogo «Cambiar contraseña» de `reset-pass.ts`.
 *
 * ABRE VACÍA A PROPÓSITO: `tipo` nace en `null` y la pantalla dice «Elige a quién quieres
 * administrar» (`usuarios.ts:392`, `usuarios.html:151-163`). Y QUIEN NO TIENE CUENTA NO TIENE
 * BOTONES: sin `username` no hay carné, sin `user_id` no hay llave ni Id, y la celda del usuario
 * queda vacía y no se edita (`usuarios.ts:620-659`). No sabe de tiempo.
 */

export type Tipo = 'Alumnos' | 'Acudientes' | 'Profesores' | 'Otros';
const TIPOS: { tipo: Tipo; icono: 'team' | 'user' | 'idcard' }[] = [
	{ tipo: 'Alumnos', icono: 'team' },
	{ tipo: 'Acudientes', icono: 'user' },
	{ tipo: 'Profesores', icono: 'user' },
	{ tipo: 'Otros', icono: 'idcard' },
];

export interface Acudiente {
	userId: number | null;
	usuario: string | null;
	nombres: string;
	apellidos: string;
	documento: string;
	celular: string;
	tipo: 'mujer' | 'hombre';
	variante: number;
}

export const COLUMNAS: Columna[] = [
	{ clave: 'id', titulo: 'Id', ancho: 80 },
	{ clave: 'ficha', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'clave', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'usuario', titulo: 'Usuario', ancho: 190, filtro: true },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 200, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 180, filtro: true },
	{ clave: 'documento', titulo: 'Documento', ancho: 175, filtro: true },
	{ clave: 'celular', titulo: 'Celular', ancho: MAIN.ancho - 80 - 56 - 56 - 190 - 200 - 180 - 175, filtro: true },
];

const xDe = (clave: string) => {
	let x = 0;
	for (const c of COLUMNAS) { if (c.clave === clave) { return { x, ancho: c.ancho }; } x += c.ancho; }
	throw new Error(`Usuarios: no hay columna «${clave}».`);
};

export const ALTO_REJILLA = 540;

export const D = { tipos: 56, grupos: 104, pista: 152, rejilla: 152 + 42 + 16, alerta: 104 };

export const anchoTipo = (t: string) => anchoDeBoton(t, true);

export function rectTipo(t: Tipo): Rect {
	let x = 0;
	for (const b of TIPOS) {
		if (b.tipo === t) { return enCascara({ x, y: D.tipos, ancho: anchoTipo(t), alto: 32 }); }
		x += anchoTipo(b.tipo) + 8;
	}
	throw new Error(`Usuarios: no hay tipo «${t}».`);
}

export const rectTiposYAlerta = (): Rect => enCascara({ x: 0, y: D.tipos, ancho: MAIN.ancho, alto: D.alerta + 76 - D.tipos });

export const rectCelda = (i: number, clave: string): Rect => {
	const c = xDe(clave);
	return enCascara({ x: c.x, y: D.rejilla + CABECERA * 2 + i * FILA, ancho: c.ancho, alto: FILA });
};

export const rectFila = (i: number): Rect => enCascara({ x: 0, y: D.rejilla + CABECERA * 2 + i * FILA, ancho: MAIN.ancho, alto: FILA });

export const rectColumnaUsuario = (filas: number): Rect => {
	const c = xDe('usuario');
	return enCascara({ x: c.x, y: D.rejilla, ancho: c.ancho, alto: CABECERA * 2 + filas * FILA });
};

export const rectGrupo = (abrev: string): Rect => enCascara(rectBotonDeGrupo(abrev, D.grupos));

export interface EstadoUsuarios {
	tipo: Tipo | null;
	encimaTipo?: Tipo | null;
	filas: Acudiente[];
	encima?: { fila: number; boton: 'ficha' | 'clave' } | null;
	opacidad?: number;
}

const BotonIcono: React.FC<{ cual: 'idcard' | 'key'; encima: boolean }> = ({ cual, encima }) => (
	<div style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: encima ? 'rgba(0,0,0,0.06)' : 'transparent' }}>
		<Icono cual={cual} tam={17} color={encima ? ACENTO : TEXTO} />
	</div>
);

export const PantallaUsuarios: React.FC<{ estado: EstadoUsuarios }> = ({ estado: e }) => (
	<Pagina alto={e.tipo ? D.rejilla + ALTO_REJILLA : D.alerta + 80} opacidad={e.opacidad ?? 1}>
		<En r={{ x: 0, y: 0, ancho: MAIN.ancho }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40 }}>
				<div style={{ fontSize: 24, fontWeight: 600 }}>Usuarios</div>
				<Boton texto="Recargar" icono="reload" deshabilitado={e.tipo === null} ancho={anchoDeBoton('Recargar', true)} />
			</div>
		</En>
		<En r={{ x: 0, y: D.tipos }}>
			<div style={{ display: 'flex', gap: 8 }}>
				{TIPOS.map((b) => (
					<Boton key={b.tipo} texto={b.tipo} icono={b.icono} tipo={e.tipo === b.tipo ? 'primary' : 'default'} encima={e.encimaTipo === b.tipo} ancho={anchoTipo(b.tipo)} />
				))}
			</div>
		</En>

		{e.tipo === null && (
			<En r={{ x: 0, y: D.alerta }}>
				<Alerta
					tipo="info"
					mensaje="Elige a quién quieres administrar"
					descripcion="Alumnos y acudientes se piden por grupo; los docentes son los del año; «Otros» son las cuentas del personal y las que no tienen ficha."
					ancho={MAIN.ancho}
					alto={76}
				/>
			</En>
		)}

		{e.tipo !== null && (
			<>
				<En r={{ x: 0, y: D.grupos }}><SelectorDeGrupos elegido="9B" /></En>
				<En r={{ x: 0, y: D.pista, ancho: MAIN.ancho }}>
					<Pista>
						Sólo el nombre de usuario se edita aquí: haz clic en la celda y se guarda al salir. Los datos de la ficha —nombre, sexo, fecha— se editan en el
						perfil de cada persona, al que lleva el botón de cada fila. Quien no tiene cuenta no tiene esos dos botones.
					</Pista>
				</En>
				<En r={{ x: 0, y: D.rejilla }}>
					<Tabla
						columnas={COLUMNAS}
						ancho={MAIN.ancho}
						alto={ALTO_REJILLA}
						filas={e.filas.map((a, i) => ({
							clave: `${a.documento}`,
							celdas: {
								id: a.userId === null ? '' : <span style={{ color: TEXTO_TENUE }}>{a.userId}</span>,
								ficha: a.usuario ? <BotonIcono cual="idcard" encima={e.encima?.fila === i && e.encima.boton === 'ficha'} /> : null,
								clave: a.userId !== null ? <BotonIcono cual="key" encima={e.encima?.fila === i && e.encima.boton === 'clave'} /> : null,
								usuario: a.usuario ?? '',
								nombres: (
									<span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
										{a.userId !== null ? (
											<Cara tipo={a.tipo} variante={a.variante} />
										) : (
											<span style={{ width: 26, height: 26, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
												<Icono cual="user" tam={14} color={TEXTO_TENUE} />
											</span>
										)}
										<Corte>{a.nombres}</Corte>
									</span>
								),
								apellidos: <Corte>{a.apellidos}</Corte>,
								documento: a.documento,
								celular: a.celular,
							},
						}))}
					/>
				</En>
			</>
		)}
	</Pagina>
);

/* ── «Cambiar contraseña» ─────────────────────────────────────────────────────────────────── */

export const CAJA_CLAVE = cajaCentrada(480, 360);
export const PIE_CLAVE = botonesDelPie(CAJA_CLAVE, [{ texto: 'Cancelar' }, { texto: 'Cambiar contraseña' }]);
const CUERPO = CAJA_CLAVE.y + 58 + 18;
export const rectCampoClave = (): Rect => ({ x: CAJA_CLAVE.x + 24, y: CUERPO + 104 + 26, ancho: CAJA_CLAVE.ancho - 48, alto: 32 });

export interface EstadoClave { t: number; sale?: number; escrita: number; foco: boolean; cursor: boolean; encimaCambiar?: boolean }

export const DialogoClave: React.FC<{ a: Acudiente; estado: EstadoClave }> = ({ a, estado: e }) => {
	const campo = rectCampoClave();
	const puede = e.escrita >= 4;
	return (
		<Dialogo
			caja={CAJA_CLAVE}
			titulo="Cambiar contraseña"
			t={e.t}
			sale={e.sale}
			pie={
				<>
					<div style={{ position: 'absolute', left: PIE_CLAVE[0].x - CAJA_CLAVE.x, top: 14 }}><Boton texto="Cancelar" ancho={PIE_CLAVE[0].ancho} /></div>
					<div style={{ position: 'absolute', left: PIE_CLAVE[1].x - CAJA_CLAVE.x, top: 14 }}>
						<Boton texto="Cambiar contraseña" tipo="primary" deshabilitado={!puede} encima={e.encimaCambiar} ancho={PIE_CLAVE[1].ancho} />
					</div>
				</>
			}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 6, fontSize: LETRA }}>
				<span style={{ color: TEXTO_TENUE }}>Usuario</span><span>{a.usuario}</span>
				<span style={{ color: TEXTO_TENUE }}>Nombre</span><span>{a.nombres} {a.apellidos}</span>
				<span style={{ color: TEXTO_TENUE }}>Id</span><span>{a.userId}</span>
			</div>
			<div style={{ position: 'absolute', top: 18 + 104, left: 24, fontSize: LETRA }}>Contraseña nueva:</div>
			<div style={{ position: 'absolute', top: campo.y - CAJA_CLAVE.y - 58, left: 24, width: campo.ancho }}>
				<div style={{ position: 'relative' }}>
					<Campo valor={'•'.repeat(e.escrita)} foco={e.foco} cursor={e.cursor} />
					<div style={{ position: 'absolute', right: 8, top: 8 }}><Icono cual="eye" tam={16} color={TEXTO_TENUE} /></div>
				</div>
				<div style={{ marginTop: 6, fontSize: LETRA - 1.5, color: 'rgba(0,0,0,0.45)', lineHeight: '19px' }}>
					Mínimo 4 caracteres. Sin espacios, ni Ñ, ni tildes. Doble clic en el campo para verla.
				</div>
			</div>
		</Dialogo>
	);
};

export { BORDE };
