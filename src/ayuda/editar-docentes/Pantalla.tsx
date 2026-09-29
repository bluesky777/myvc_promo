import React from 'react';

import { Rejilla, Corte, type Columna } from '../montar-el-ano/Rejilla';
import { BotonP, En, IconoP, LETRA, MAIN, Pagina, SiNo, TEXTO, TEXTO_TENUE, Titulo, type Rect } from '../personas/comun';
import { ConCara } from '../secretaria/piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PERSONAS ▸ EDITAR DOCENTES (`paginas/profesores/profesores.html`), vista por una secretaria SIN
 * superusuario: sin «Nuevo profesor» (`puedeEditar` es `is_superuser`), con la pista de «aquí se ve
 * pero no se toca», el usuario y la cuenta activa de sólo lectura. Y el botón del contrato, que NO
 * depende del superusuario: sólo se apaga si el año está cerrado (`soloLectura`).
 *
 * LOS DOCENTES SON INVENTADOS (los de `montar-el-ano/reparto.ts` más uno nuevo, sin contrato). Las
 * caras, el avatar dibujado. Los documentos y los celulares no salen: quedan a la derecha, fuera.
 */

export interface Docente { id: number; nombres: string; apellidos: string; tipo: 'mujer' | 'hombre'; variante: number; usuario: string; sexo: 'M' | 'F'; contratado: boolean; nacimiento: string }

export const DOCENTES: Docente[] = [
	{ id: 31, nombres: 'Ana María', apellidos: 'Herrera Lugo', tipo: 'mujer', variante: 1, usuario: 'ana.herrera', sexo: 'F', contratado: true, nacimiento: '1984-03-12' },
	{ id: 34, nombres: 'Diego', apellidos: 'Ocampo Ruiz', tipo: 'hombre', variante: 3, usuario: 'diego.ocampo', sexo: 'M', contratado: true, nacimiento: '1979-11-02' },
	{ id: 36, nombres: 'Luisa', apellidos: 'Bernal Pino', tipo: 'mujer', variante: 4, usuario: 'luisa.bernal', sexo: 'F', contratado: true, nacimiento: '1990-07-25' },
	{ id: 40, nombres: 'Marcela', apellidos: 'Zapata Iregui', tipo: 'mujer', variante: 2, usuario: 'marcela.zapata', sexo: 'F', contratado: true, nacimiento: '1987-01-30' },
	{ id: 58, nombres: 'Camilo Andrés', apellidos: 'Reyes Pardo', tipo: 'hombre', variante: 0, usuario: 'camilo.reyes', sexo: 'M', contratado: false, nacimiento: '1995-05-08' },
	{ id: 29, nombres: 'Beatriz Elena', apellidos: 'Muñoz Cano', tipo: 'mujer', variante: 5, usuario: 'beatriz.munoz', sexo: 'F', contratado: false, nacimiento: '1968-12-19' },
];
/** El que se contrata en el vídeo: el nuevo. Beatriz sigue sin contrato (ya no trabaja allí). */
export const EL_NUEVO = 4;

export const COLUMNAS_TODOS: Columna[] = [
	{ clave: 'acciones', titulo: 'Acciones', ancho: 84 },
	{ clave: 'id', titulo: 'Id', ancho: 40 },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 130, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 120, filtro: true },
	{ clave: 'contrato', titulo: 'Contrato 2026', ancho: 145, filtro: true },
	{ clave: 'usuario', titulo: 'Usuario', ancho: 170, filtro: true },
	{ clave: 'activo', titulo: 'Cuenta activa', ancho: 145, filtro: true },
	{ clave: 'sexo', titulo: 'Sexo', ancho: 80, filtro: true },
	{ clave: 'documento', titulo: 'Documento', ancho: 130, filtro: true },
	{ clave: 'celular', titulo: 'Celular', ancho: 130, filtro: true },
];
export const COLUMNAS_CONTRATADOS: Columna[] = [
	{ clave: 'acciones', titulo: 'Acciones', ancho: 84 },
	{ clave: 'id', titulo: 'Id', ancho: 80, filtro: true },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 150, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 150, filtro: true },
	{ clave: 'usuario', titulo: 'Usuario', ancho: 170, filtro: true },
	{ clave: 'sexo', titulo: 'Sexo', ancho: 80, filtro: true },
	{ clave: 'nacimiento', titulo: 'Nacimiento', ancho: 130, filtro: true },
	{ clave: 'celular', titulo: 'Celular', ancho: 130, filtro: true },
	{ clave: 'correo', titulo: 'Correo de la cuenta', ancho: 220, filtro: true },
];

const x = (cols: Columna[], clave: string) => { let n = 0; for (const c of cols) { if (c.clave === clave) { return n; } n += c.ancho; } throw new Error(clave); };
const w = (cols: Columna[], clave: string) => cols.find((c) => c.clave === clave)!.ancho;

/* ── Geometría (cáscara, SIN desplazar) ───────────────────────────────────────────────────── */

export const ALTO_TODOS = 405;
/** 35vh son 315; aquí 330 para que la barra de lado no pise la quinta fila, que es la que se enseña. */
export const ALTO_CONTRATADOS = 330;
export const Y = {
	h2: MAIN.y + 40 + 8,
	pista: MAIN.y + 40 + 8 + 30,
	csv: MAIN.y + 40 + 8 + 30 + 28,
	todos: MAIN.y + 40 + 8 + 30 + 28 + 40,
	h2b: MAIN.y + 40 + 8 + 30 + 28 + 40 + ALTO_TODOS + 24,
	csvb: MAIN.y + 40 + 8 + 30 + 28 + 40 + ALTO_TODOS + 24 + 30,
	contratados: MAIN.y + 40 + 8 + 30 + 28 + 40 + ALTO_TODOS + 24 + 30 + 40,
};
export const ALTO_PAGINA = Y.contratados + ALTO_CONTRATADOS + 16 - (MAIN.y - 16);

const baja = (r: Rect, d: number): Rect => ({ ...r, y: r.y - d });
export const PISTA = (d = 0): Rect => baja({ x: MAIN.x, y: Y.pista, ancho: 640, alto: 22 }, d);
export const CELDA_TODOS = (i: number, clave: string, d = 0): Rect =>
	baja({ x: MAIN.x + 1 + x(COLUMNAS_TODOS, clave), y: Y.todos + 1 + 98 + i * 42, ancho: w(COLUMNAS_TODOS, clave), alto: 42 }, d);
export const COLUMNA_CONTRATO = (d = 0): Rect => baja({ x: MAIN.x + 1 + x(COLUMNAS_TODOS, 'contrato'), y: Y.todos, ancho: 145, alto: ALTO_TODOS }, d);
export const BOTON_CONTRATO = (i: number, d = 0): Rect => {
	const c = CELDA_TODOS(i, 'contrato', d);
	return { x: c.x + 14, y: c.y + 9, ancho: 104, alto: 24 };
};
export const FILA_CONTRATADOS = (i: number, d = 0): Rect => baja({ x: MAIN.x, y: Y.contratados + 1 + 98 + i * 42, ancho: MAIN.ancho, alto: 42 }, d);
export const ACCION_CONTRATADOS = (i: number, k: 0 | 1, d = 0): Rect => {
	const f = FILA_CONTRATADOS(i, d);
	return { x: MAIN.x + 1 + 8 + k * 34, y: f.y + 5, ancho: 32, alto: 32 };
};

/* ── La pantalla ───────────────────────────────────────────────────────────────────────────── */

export const PantallaDocentes: React.FC<{ contratado: boolean; desplazada?: number; encimaContrato?: boolean; cargandoContrato?: boolean; encimaAccion?: 0 | 1 | null; nuevaFila?: number }> = ({
	contratado, desplazada = 0, encimaContrato = false, cargandoContrato = false, encimaAccion = null, nuevaFila = 1,
}) => {
	const docentes = DOCENTES.map((d, i) => (i === EL_NUEVO ? { ...d, contratado: contratado || d.contratado } : d));
	const contratados = docentes.filter((d) => d.contratado);
	return (
		<Pagina alto={ALTO_PAGINA} desplazada={desplazada}>
			<En r={{ x: MAIN.x, y: MAIN.y, ancho: MAIN.ancho, alto: 40 }} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<Titulo texto="Docentes" />
				<span style={{ marginLeft: 'auto' }}><BotonP texto="Recargar" icono="reload" ancho={112} /></span>
			</En>

			<En r={{ x: MAIN.x, y: Y.h2 }} style={{ fontSize: 19, fontWeight: 600, color: TEXTO }}>Todos los docentes</En>
			<En r={{ x: MAIN.x, y: Y.pista, ancho: 900 }} style={{ fontSize: LETRA - 1, color: 'rgba(0,0,0,0.45)' }}>
				Sólo un superusuario puede editar la ficha de un docente, así que aquí se ve pero no se toca.
			</En>
			<En r={{ x: MAIN.x, y: Y.csv }}><BotonP texto="Bajar lo que se ve (CSV)" icono="bajar" ancho={214} /></En>
			<En r={{ x: MAIN.x, y: Y.todos }}>
				<Rejilla
					columnas={COLUMNAS_TODOS}
					ancho={MAIN.ancho}
					alto={ALTO_TODOS}
					filas={docentes.map((d, i) => ({
						clave: String(d.id),
						celdas: {
							acciones: <Acciones iconos={['edit', 'delete']} />,
							id: <span style={{ color: TEXTO_TENUE }}>{d.id}</span>,
							nombres: <ConCara tipo={d.tipo} variante={d.variante} texto={d.nombres} />,
							apellidos: <Corte>{d.apellidos}</Corte>,
							contrato: <BotonEstado contratado={d.contratado} encima={i === EL_NUEVO && encimaContrato} cargando={i === EL_NUEVO && cargandoContrato} />,
							usuario: (
								<span style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
									<Corte>{d.usuario}</Corte>
									<IconoP cual="llave" tam={14} color="#bfbfbf" />
								</span>
							),
							activo: <SiNo encendido apagado />,
							sexo: d.sexo,
							documento: '',
							celular: '',
						},
					}))}
				/>
			</En>

			<En r={{ x: MAIN.x, y: Y.h2b }} style={{ fontSize: 19, fontWeight: 600, color: TEXTO }}>Contratados para 2026</En>
			<En r={{ x: MAIN.x, y: Y.csvb }}><BotonP texto="Bajar lo que se ve (CSV)" icono="bajar" ancho={214} /></En>
			<En r={{ x: MAIN.x, y: Y.contratados }}>
				<Rejilla
					columnas={COLUMNAS_CONTRATADOS}
					ancho={MAIN.ancho}
					alto={ALTO_CONTRATADOS}
					filas={contratados.map((d) => {
						const nueva = DOCENTES[EL_NUEVO].id === d.id;
						return {
							clave: String(d.id),
							opacidad: nueva ? nuevaFila : 1,
							fondo: nueva ? '#f6ffed' : undefined,
							celdas: {
								acciones: <Acciones iconos={['edit', 'usuario-menos']} encima={nueva ? encimaAccion : null} />,
								id: <span style={{ color: TEXTO_TENUE }}>{d.id}</span>,
								nombres: <ConCara tipo={d.tipo} variante={d.variante} texto={d.nombres} />,
								apellidos: <Corte>{d.apellidos}</Corte>,
								usuario: <Corte>{d.usuario}</Corte>,
								sexo: d.sexo,
								nacimiento: d.nacimiento,
								celular: '',
								correo: '',
							},
						};
					})}
				/>
			</En>
		</Pagina>
	);
};

const Acciones: React.FC<{ iconos: ('edit' | 'delete' | 'usuario-menos')[]; encima?: 0 | 1 | null }> = ({ iconos, encima = null }) => (
	<div style={{ display: 'flex', gap: 2, marginLeft: -6 }}>
		{iconos.map((ic, k) => {
			const color = ic === 'edit' ? '#1677ff' : '#d4380d';
			return (
				<div key={ic} style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color, background: encima === k ? 'rgba(0,0,0,0.06)' : 'transparent' }}>
					<IconoP cual={ic} tam={17} color={color} />
				</div>
			);
		})}
	</div>
);

/** `comunes/boton-estado`: píldora de texto, verde «Rescindir» si está contratado, azul «Contratar» si no. */
const BotonEstado: React.FC<{ contratado: boolean; encima?: boolean; cargando?: boolean }> = ({ contratado, encima = false, cargando = false }) => {
	const color = contratado ? '#389e0d' : '#1677ff';
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 4,
				height: 24,
				padding: '0 8px',
				borderRadius: 999,
				border: `1px solid ${color}59`,
				background: `${color}${encima ? '38' : '1f'}`,
				color,
				fontWeight: 600,
				fontSize: LETRA - 1,
				whiteSpace: 'nowrap',
			}}
		>
			{cargando ? <IconoP cual="cargando" tam={13} /> : <IconoP cual={contratado ? 'usuario-menos' : 'maletin'} tam={14} />}
			{contratado ? 'Rescindir' : 'Contratar'}
		</div>
	);
};
