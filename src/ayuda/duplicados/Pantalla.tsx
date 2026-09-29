import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { BotonP, Dialogo, En, IconoP, LETRA, Pagina, TEXTO, Titulo } from '../personas/comun';
import {
	ALTO_CABEZA,
	ALTO_ELEGIR,
	ALTO_FICHA,
	ALTO_PAGINA,
	ALTO_REVISADO,
	ANCHO,
	CUENTA,
	FILAS_TOTALES,
	type FichaDup,
	GRUPO1,
	GRUPO2,
	GUIA,
	INTRO,
	MUEVE,
	NOTA2,
	PIE_ELEGIR,
	PIE_REVISADO,
	POR_DOCUMENTO,
	POR_NOMBRE,
	REVISADO,
	SE_QUEDA,
	SE_VACIA,
	X0,
	Y,
	deDonde,
	dialogo,
	rectFichaRadio,
	rectPie,
	rectUnir,
} from './datos';

const SUAVE = 'rgba(0,0,0,0.65)';
const TENUE = 'rgba(0,0,0,0.45)';
const LINEA = '#e5e7eb';
const ZONA = '#f5f6f8';

export const PantallaDuplicados: React.FC<{ encimaUnir?: boolean }> = ({ encimaUnir = false }) => (
	<Pagina alto={ALTO_PAGINA}>
		<En r={{ x: X0, y: Y.cabecera, ancho: ANCHO, alto: 40 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<Titulo texto="Alumnos duplicados" />
			<BotonP texto="Recargar" icono="reload" ancho={112} />
		</En>

		<En r={INTRO} style={{ fontSize: LETRA, lineHeight: '22px', color: TENUE }}>
			El documento <strong style={{ color: SUAVE }}>no es único</strong> en la base, y no puede serlo: hay fichas antiguas con el documento
			vacío o repetido. Por eso se cuela la misma persona dos veces — casi siempre al pasar de Registro Civil a Tarjeta de Identidad, o al
			rematricular a alguien que se retiró hace años y no se buscó antes.
		</En>

		<TituloBloque y={Y.bloque1} icono="ficha" texto="Mismo documento" cuenta={1} />
		<En r={{ x: X0, y: Y.bloque1 + 30 }} style={{ fontSize: LETRA, color: SUAVE }}>Casi con seguridad son la misma persona.</En>
		<Grupo r={GRUPO1} etiqueta="Documento" clave={POR_DOCUMENTO.clave} fichas={POR_DOCUMENTO.fichas} encimaUnir={encimaUnir} />

		<TituloBloque y={Y.bloque2} icono="usuario" texto="Mismo nombre, documento distinto" cuenta={1} />
		<En
			r={NOTA2}
			style={{ display: 'flex', alignItems: 'center', gap: 7, boxSizing: 'border-box', padding: '0 10px', borderRadius: 6, background: '#fffbe6', border: '1px solid #ffe58f', color: '#ad6800', fontSize: LETRA }}
		>
			<IconoP cual="alerta" tam={15} color="#faad14" />
			Pueden ser hermanos o primos. Compruébalo antes de unir nada.
		</En>
		<Grupo r={GRUPO2} etiqueta="Nombre" clave={POR_NOMBRE.clave} fichas={POR_NOMBRE.fichas} />
	</Pagina>
);

const TituloBloque: React.FC<{ y: number; icono: 'ficha' | 'usuario'; texto: string; cuenta: number }> = ({ y, icono, texto, cuenta }) => (
	<En r={{ x: X0, y, alto: 26 }} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18.5, fontWeight: 700, color: TEXTO }}>
		<IconoP cual={icono} tam={18} />
		{texto}
		<span style={{ fontSize: 12.5, fontWeight: 700, padding: '1px 8px', borderRadius: 999, background: '#e6f4ff', color: SUAVE }}>{cuenta}</span>
	</En>
);

const Grupo: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; etiqueta: string; clave: string; fichas: FichaDup[]; encimaUnir?: boolean }> = ({
	r, etiqueta, clave, fichas, encimaUnir = false,
}) => {
	const unir = rectUnir(r);
	return (
		<En r={r} style={{ boxSizing: 'border-box', border: `1px solid ${LINEA}`, borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
			<div style={{ height: ALTO_CABEZA, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 13, padding: '0 13px', background: ZONA, borderBottom: `1px solid ${LINEA}` }}>
				<span style={{ fontSize: 14.5 }}>{etiqueta}: <strong>{clave}</strong></span>
				<span style={{ fontSize: 13.5, color: TENUE, marginRight: 'auto' }}>{fichas.length} fichas</span>
			</div>
			<div style={{ position: 'absolute', left: unir.x - r.x - 1, top: unir.y - r.y - 1 }}>
				<BotonP texto="Unir" icono="unir" tipo="primary" pequeno ancho={unir.ancho} encima={encimaUnir} />
			</div>
			{fichas.map((f, i) => (
				<div key={f.id} style={{ height: ALTO_FICHA, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 13, padding: '0 13px', borderTop: i > 0 ? `1px solid ${LINEA}` : 'none' }}>
					<Avatar tipo={f.cara.tipo} variante={f.cara.variante} tam={40} />
					<DatosFicha f={f} conEstado />
					<BotonP texto="Ver ficha" pequeno ancho={82} />
				</div>
			))}
		</En>
	);
};

const DatosFicha: React.FC<{ f: FichaDup; conEstado?: boolean; creadaLarga?: boolean }> = ({ f, conEstado = false, creadaLarga = false }) => (
	<div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
		<span style={{ fontWeight: 700, fontSize: LETRA, color: TEXTO, lineHeight: '21px' }}>{f.nombres} {f.apellidos}</span>
		<span style={{ fontSize: 13.5, color: SUAVE, lineHeight: '19px' }}>
			{f.tipoDoc} {f.documento} · {creadaLarga ? 'ficha creada' : 'creada'} el {f.creada}
		</span>
		<span style={{ fontSize: 13.5, color: SUAVE, lineHeight: '19px' }}>
			{f.matriculas} matrículas · última en <strong>{f.ultimoGrupo} ({f.ultimoYear})</strong>
			{conEstado ? `, ${f.estado}` : ''} · {f.notas} notas
		</span>
	</div>
);

/* ── El diálogo «Unir fichas del mismo alumno» ────────────────────────────────────────────── */

export type PasoUnir = 'elegir' | 'mirando' | 'revisado';

export const DialogoUnir: React.FC<{ aparece: number; paso: PasoUnir; elegida: number | null; encima?: 'radio' | 'ver' | 'unir' | null }> = ({
	aparece, paso, elegida, encima = null,
}) => {
	const alto = paso === 'revisado' ? ALTO_REVISADO : ALTO_ELEGIR;
	const r = dialogo(alto);
	const fichas = POR_DOCUMENTO.fichas;
	const pie = paso === 'revisado'
		? [
				<BotonP key="a" texto="Atrás" ancho={PIE_REVISADO[0]} />,
				<BotonP key="u" texto="Unir las fichas" tipo="primary" peligro ancho={PIE_REVISADO[1]} encima={encima === 'unir'} />,
			]
		: [
				<BotonP key="c" texto="Cancelar" ancho={PIE_ELEGIR[0]} />,
				paso === 'mirando'
					? <BotonP key="v" texto="Ver qué se movería" tipo="primary" ancho={PIE_ELEGIR[1]} deshabilitado />
					: <BotonP key="v" texto="Ver qué se movería" tipo="primary" ancho={PIE_ELEGIR[1]} deshabilitado={elegida === null} encima={encima === 'ver'} />,
			];

	return (
		<Dialogo r={r} titulo="Unir fichas del mismo alumno" aparece={aparece} pie={<>{pie}</>}>
			{paso === 'elegir' && (
				<>
					<div style={{ height: GUIA, fontSize: LETRA, lineHeight: '22px', color: SUAVE }}>
						<strong style={{ color: TEXTO }}>¿Cuál se queda con todo?</strong> Las demás se vacían y van a la papelera. Mira de qué año viene cada una.
					</div>
					{fichas.map((f, i) => {
						const fr = rectFichaRadio(i);
						return (
							<div
								key={f.id}
								style={{
									position: 'absolute',
									left: fr.x - (r.x + 24),
									top: fr.y - (r.y + 56 + 18),
									width: fr.ancho,
									height: fr.alto,
									boxSizing: 'border-box',
									display: 'flex',
									alignItems: 'center',
									gap: 11,
									padding: '0 11px',
									border: `1px solid ${elegida === i ? '#1677ff' : LINEA}`,
									borderRadius: 8,
									background: '#fff',
								}}
							>
								<Radio marcado={elegida === i} encima={encima === 'radio' && i === SE_QUEDA} />
								<Avatar tipo={f.cara.tipo} variante={f.cara.variante} tam={40} />
								<DatosFicha f={f} creadaLarga />
							</div>
						);
					})}
				</>
			)}
			{paso === 'mirando' && (
				<div style={{ height: 200, display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA, color: TEXTO }}>
					<IconoP cual="cargando" tam={18} color="#1677ff" />
					Mirando qué habría que mover…
				</div>
			)}
			{paso === 'revisado' && <Revisado />}
		</Dialogo>
	);
};

const Radio: React.FC<{ marcado: boolean; encima: boolean }> = ({ marcado, encima }) => (
	<div style={{ width: 16, height: 16, borderRadius: '50%', boxSizing: 'border-box', border: `${marcado ? 5 : 1}px solid ${marcado || encima ? '#1677ff' : '#d9d9d9'}`, background: '#fff', flex: 'none' }} />
);

const Revisado: React.FC = () => {
	const origen = POR_DOCUMENTO.fichas[SE_VACIA];
	const destino = POR_DOCUMENTO.fichas[SE_QUEDA];
	const base = { x: REVISADO.guia.x, y: REVISADO.guia.y };
	const en = (b: { x: number; y: number; ancho: number; alto: number }): React.CSSProperties => ({
		position: 'absolute', left: b.x - base.x, top: b.y - base.y, width: b.ancho, height: b.alto, boxSizing: 'border-box',
	});
	const cual: React.CSSProperties = { fontSize: 13, color: TENUE, whiteSpace: 'nowrap' };
	return (
		<>
			<div style={{ ...en(REVISADO.guia), fontSize: LETRA, lineHeight: '22px', color: SUAVE }}>
				Todo lo de <strong style={{ color: TEXTO }}>{origen.nombres} {origen.apellidos}</strong>
				<span style={cual}>&nbsp;{deDonde(origen)}</span> pasa a <strong style={{ color: TEXTO }}>{destino.nombres} {destino.apellidos}</strong>
				<span style={cual}>&nbsp;{deDonde(destino)}</span>.
			</div>
			<div style={{ ...en(REVISADO.cifra), display: 'flex', alignItems: 'baseline', gap: 10, padding: '14px 16px', borderRadius: 8, background: ZONA, border: `1px solid ${LINEA}` }}>
				<span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, color: TEXTO }}>{FILAS_TOTALES}</span>
				<span style={{ fontSize: LETRA, color: TEXTO }}>filas se mueven</span>
			</div>
			<div style={{ ...en(REVISADO.tablas), display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start' }}>
				{MUEVE.map((m) => (
					<span key={m.tabla} style={{ display: 'flex', gap: 6, alignItems: 'baseline', padding: '4px 9px', borderRadius: 6, background: '#e6f4ff', fontSize: 13.5 }}>
						<code style={{ color: SUAVE, fontFamily: 'Menlo, monospace', fontSize: 12.5 }}>{m.tabla}</code>
						<span style={{ fontWeight: 700 }}>{m.filas}</span>
					</span>
				))}
			</div>
			<div style={{ ...en(REVISADO.cuenta), display: 'flex', alignItems: 'center', gap: 8, padding: '0 11px', borderRadius: 6, background: ZONA, border: `1px solid ${LINEA}`, fontSize: 14 }}>
				<IconoP cual="llave" tam={15} />
				<span>
					Seguirá entrando con <Codigo>{CUENTA.queda}</Codigo>. La otra, <Codigo>{CUENTA.otra}</Codigo>, se desactiva.
				</span>
			</div>
			<div style={{ ...en(REVISADO.peligro), display: 'flex', alignItems: 'center', padding: '0 13px', borderRadius: 6, background: '#fff1f0', color: '#a8071a', border: '1px solid #ffa39e', fontWeight: 700, fontSize: LETRA }}>
				La ficha {deDonde(origen)} quedará vacía y en la papelera. Esto no se deshace solo.
			</div>
		</>
	);
};

const Codigo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<code style={{ fontFamily: 'Menlo, monospace', fontSize: 13, background: '#f0f0f0', padding: '1px 5px', borderRadius: 4 }}>{children}</code>
);

export { rectPie, ALTO_ELEGIR, ALTO_REVISADO, PIE_ELEGIR, PIE_REVISADO };
