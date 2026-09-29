import React from 'react';

import { Rejilla, type Columna } from '../montar-el-ano/Rejilla';
import { BotonP, En, IconoP, LETRA, MAIN, Pagina, TEXTO, TEXTO_TENUE, Titulo, type Rect } from '../personas/comun';
import { ConCara, SelectorDeGrupos, rectBotonDeGrupo } from '../secretaria/piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS DOS PANTALLAS DEL VÍDEO DE ACUDIENTES:
 *
 *   · INICIO, tal como lo ve una secretaria (`paginas/panel/inicio`): tipo «Usuario» y personal, así
 *     que ve «Clases de hoy» con el botón para elegir docente (`eligeDocente`), y «Avisos del
 *     colegio». «Lo que viene» no sale si no hay nada en el calendario (`hayAlgo`), y aquí no hay.
 *   · ACUDIENTES (`paginas/acudientes`): cabecera con «Exportar», los botones de grupo, «Mostrar los
 *     NO asignados», «Bajar lo que se ve (CSV)», el aviso azul si no hay grupo, y la rejilla.
 *
 * LOS ACUDIENTES SON INVENTADOS: nombres, usuarios, documentos. Los correos van a `example.com`, el
 * dominio reservado para ejemplos. Las caras, el avatar dibujado.
 */

export interface Acudiente { id: number; nombres: string; apellidos: string; sexo: 'M' | 'F'; usuario: string; correo: string; documento: string; variante: number }

export const ACUDIENTES_9B: Acudiente[] = [
	{ id: 4412, nombres: 'Claudia Patricia', apellidos: 'Bermúdez Soto', sexo: 'F', usuario: 'claudia.bermudez', correo: 'claudia.bermudez@example.com', documento: '43512876', variante: 2 },
	{ id: 4418, nombres: 'Jhon Fredy', apellidos: 'Castaño Ríos', sexo: 'M', usuario: 'jhon.castano', correo: 'jhon.castano@example.com', documento: '71654320', variante: 4 },
	{ id: 4425, nombres: 'Luz Marina', apellidos: 'Díaz Ocampo', sexo: 'F', usuario: 'luz.diaz', correo: 'luz.diaz@example.com', documento: '42987611', variante: 0 },
	{ id: 4431, nombres: 'Hernando', apellidos: 'Galeano Pérez', sexo: 'M', usuario: 'hernando.galeano', correo: '', documento: '98543217', variante: 1 },
	{ id: 4437, nombres: 'Gloria Amparo', apellidos: 'Muñoz Henao', sexo: 'F', usuario: 'gloria.munoz', correo: 'gloria.munoz@example.com', documento: '43876502', variante: 5 },
	{ id: 4440, nombres: 'Óscar Darío', apellidos: 'Restrepo Vélez', sexo: 'M', usuario: 'oscar.restrepo', correo: 'oscar.restrepo@example.com', documento: '70123984', variante: 3 },
];

export const GRUPO = '9B';

export const COLUMNAS_ACUDIENTES: Columna[] = [
	{ clave: 'id', titulo: 'Id', ancho: 90, filtro: true },
	{ clave: 'alumnos', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 190, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 170, filtro: true },
	{ clave: 'sexo', titulo: 'Sexo', ancho: 110, filtro: true },
	{ clave: 'usuario', titulo: 'Usuario', ancho: 170, filtro: true },
	{ clave: 'correo', titulo: 'Correo de la cuenta', ancho: 250, filtro: true },
	{ clave: 'documento', titulo: 'Documento', ancho: 150, filtro: true },
];

/* ── Geometría (cáscara) ──────────────────────────────────────────────────────────────────── */

export const Y = {
	grupos: MAIN.y + 40 + 16,
	enlaces: MAIN.y + 40 + 16 + 32 + 8,
	cuerpo: MAIN.y + 40 + 16 + 32 + 8 + 32 + 16,
};
export const ALTO_REJILLA = 49 * 2 + ACUDIENTES_9B.length * 42 + 22;
export const REJILLA: Rect = { x: MAIN.x, y: Y.cuerpo, ancho: MAIN.ancho, alto: ALTO_REJILLA };
export const rectGrupo = (abrev: string): Rect => {
	const r = rectBotonDeGrupo(abrev, 0);
	return { x: MAIN.x + r.x, y: Y.grupos, ancho: r.ancho, alto: 32 };
};
export const FILTROS: Rect = { x: MAIN.x, y: Y.grupos, ancho: MAIN.ancho, alto: 32 + 8 + 32 };
export const AVISO_SIN_GRUPO: Rect = { x: MAIN.x, y: Y.cuerpo, ancho: MAIN.ancho, alto: 42 };
export const rectBotonFila = (i: number): Rect => ({ x: MAIN.x + 1 + 90 + 10, y: Y.cuerpo + 1 + 98 + i * 42 + 5, ancho: 32, alto: 32 });
export const COLUMNA_BOTON: Rect = { x: MAIN.x + 1 + 90, y: Y.cuerpo, ancho: 56, alto: ALTO_REJILLA };

export const PantallaAcudientes: React.FC<{ grupo: string | null; llegada?: number; encimaGrupo?: string | null; encimaFila?: number | null }> = ({
	grupo, llegada = 1, encimaGrupo = null, encimaFila = null,
}) => (
	<Pagina alto={Y.cuerpo + ALTO_REJILLA + 16 - (MAIN.y - 16)}>
		<En r={{ x: MAIN.x, y: MAIN.y, ancho: MAIN.ancho, alto: 40 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<Titulo texto="Acudientes" />
			<BotonP texto="Exportar" icono="bajar" ancho={112} />
		</En>
		<En r={{ x: MAIN.x, y: Y.grupos }}>
			<SelectorDeGrupos elegido={grupo} encima={encimaGrupo} />
		</En>
		<En r={{ x: MAIN.x, y: Y.enlaces }} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
			<BotonP texto="Mostrar los NO asignados" tipo="link" />
			<BotonP texto="Bajar lo que se ve (CSV)" icono="bajar" ancho={214} />
		</En>
		{grupo === null ? (
			<En r={AVISO_SIN_GRUPO} style={{ display: 'flex', alignItems: 'center', gap: 9, boxSizing: 'border-box', padding: '0 14px', background: '#e6f4ff', border: '1px solid #91caff', borderRadius: 8, fontSize: LETRA, color: TEXTO }}>
				<IconoP cual="info" tam={16} color="#1677ff" />
				Elige un grupo para ver sus acudientes, o pulsa «Mostrar los NO asignados».
			</En>
		) : (
			<En r={REJILLA}>
				<Rejilla
					columnas={COLUMNAS_ACUDIENTES}
					ancho={REJILLA.ancho}
					alto={REJILLA.alto}
					filas={ACUDIENTES_9B.map((a, i) => ({
						clave: String(a.id),
						opacidad: Math.max(0, Math.min(1, llegada * (ACUDIENTES_9B.length + 2) - i)),
						celdas: {
							id: <span style={{ color: TEXTO_TENUE }}>{a.id}</span>,
							alumnos: (
								<div style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: encimaFila === i ? '#1677ff' : TEXTO, background: encimaFila === i ? 'rgba(0,0,0,0.06)' : 'transparent' }}>
									<IconoP cual="contactos" tam={18} />
								</div>
							),
							nombres: <ConCara tipo={a.sexo === 'F' ? 'mujer' : 'hombre'} variante={a.variante} texto={a.nombres} />,
							apellidos: a.apellidos,
							sexo: a.sexo,
							usuario: a.usuario,
							correo: a.correo,
							documento: a.documento,
						},
					}))}
				/>
			</En>
		)}
	</Pagina>
);

/* ── Inicio, visto por una secretaria ─────────────────────────────────────────────────────── */

export const INICIO = {
	trabajo: { x: MAIN.x, y: MAIN.y, ancho: 700, alto: 200 },
	avisos: { x: MAIN.x + 700 + 24, y: MAIN.y, ancho: MAIN.ancho - 724, alto: 260 },
};

export const PantallaInicio: React.FC = () => (
	<Pagina alto={320}>
		<En r={INICIO.trabajo} style={{ boxSizing: 'border-box', border: '1px solid #f0f0f0', borderRadius: 10, padding: 20 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 600, color: TEXTO }}>
					<IconoP cual="reloj" tam={17} />
					Clases de hoy
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 7, height: 30, padding: '0 12px', border: '1px solid #d9d9d9', borderRadius: 999, fontSize: LETRA - 0.5, color: TEXTO }}>
					<IconoP cual="maletin" tam={15} />
					Selecciona aquí tu docente
				</div>
			</div>
			<div style={{ marginTop: 34, textAlign: 'center', color: TEXTO_TENUE, fontSize: LETRA }}>
				Elige un docente y verás sus clases de hoy, con su lista para llamar a lista.
			</div>
		</En>
		<En r={INICIO.avisos} style={{ boxSizing: 'border-box', border: '1px solid #f0f0f0', borderRadius: 10, padding: 20 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 600, color: TEXTO }}>
				<IconoP cual="megafono" tam={17} />
				Avisos del colegio
			</div>
			<div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
				<svg width="64" height="40" viewBox="0 0 64 40">
					<ellipse cx="32" cy="34" rx="30" ry="5" fill="#f5f5f5" />
					<path d="M12 12 L20 4 H44 L52 12 V30 H12 Z" fill="#fafafa" stroke="#d9d9d9" />
					<path d="M12 12 H24 C24 16 40 16 40 12 H52" fill="none" stroke="#d9d9d9" />
				</svg>
				<div style={{ fontSize: LETRA - 1, color: 'rgba(0,0,0,0.35)', textAlign: 'center' }}>No hay avisos publicados para todo el colegio.</div>
			</div>
		</En>
	</Pagina>
);
