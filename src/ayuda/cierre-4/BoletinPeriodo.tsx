import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { Escudo as EscudoDelColegio, Rubrica } from '../colegio';
import { MINIMA_ACEPTADA } from '../../notas/planilla';
import {
	ALUMNO, ARRIBA_COMPORTAMIENTO, ARRIBA_LEYENDA, ARRIBA_PIE, BANDAS, COLEGIO, GRUPO, H, HOJA, LEYENDA_NIVELADA, MATERIAS,
	Materia, arribaDeMateria, banda,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL BOLETÍN DEL PERIODO (tipo 1, variante 1), la hoja oficial: la que sale cuando lo saca alguien
 * que no es docente (`informes/boletin-periodo/boletin-periodo.html`).
 *
 * NO ES UNA TABLA: un bloque por asignatura. Su cabecera --materia, «- Prof.», «A: / T:», el
 * desempeño en su celda de 66 px y la nota--, la tira de periodos («Per1:», no «P1:») con «Def:»,
 * y la unidad numerada con sus indicadores. Si la materia se niveló, **la nota de antes va tachada
 * delante de la que quedó**, en la cabecera y en el indicador, y al final la leyenda lo explica
 * (sólo sale cuando hay algo tachado).
 *
 * TODO VA A ALTURAS FIJAS (las de `datos.ts`): los planos cortos del guion apuntan a franjas de esta
 * hoja con esos números, y un bloque que midiera lo que le diera la gana los dejaría torcidos.
 * Los colores son los del papel de la aplicación, los mismos que el boletín por competencias.
 */

const AZUL = '#1f4e79';
const AZUL_TEXTO = '#173859';
const AZUL_SUAVE = '#9db8d2';
const BANDA = '#dae7f5';
const GUIA = '#a8bccf';
const GRIS = '#5c6b7a';
const ROJO = '#8a0000';
const ROJO_TENUE = '#fbecec';

const IZQ = 26;
const DER = 18;
const ANCHO_NIVEL = 66;
const ANCHO_NOTA = 50;
const ANCHO_PORC = 34;

export const BoletinPeriodo: React.FC = () => (
	<div
		style={{
			position: 'relative',
			width: HOJA.ancho,
			height: HOJA.alto,
			background: '#fff',
			color: '#000',
			borderRadius: 4,
			boxShadow: '0 24px 64px rgba(15, 28, 52, .18), 0 2px 8px rgba(15, 28, 52, .07)',
			overflow: 'hidden',
			fontSize: 11,
			lineHeight: 1.2,
		}}
	>
		<Lomo />
		<Membrete />
		<Franja />

		{MATERIAS.map((m, i) => (
			<React.Fragment key={m.materia}>
				{m.area && (i === 0 || MATERIAS[i - 1].area !== m.area) && (
					<div
						style={{
							position: 'absolute',
							left: IZQ,
							right: DER,
							top: arribaDeMateria(i) - H.areaTitulo + 2,
							height: H.areaTitulo - 4,
							padding: '0 6px',
							background: BANDA,
							color: AZUL_TEXTO,
							borderLeft: `3px solid ${AZUL}`,
							fontSize: 9.5,
							fontWeight: 700,
							letterSpacing: 0.7,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{m.area}
					</div>
				)}
				<BloqueDeMateria m={m} arriba={arribaDeMateria(i)} />
			</React.Fragment>
		))}

		<Comportamiento />

		<div style={{ position: 'absolute', left: IZQ, right: DER, top: ARRIBA_LEYENDA, height: H.leyendaNivelada, fontSize: 9.5, color: '#333', fontStyle: 'italic', lineHeight: 1.3 }}>
			{conTachado(LEYENDA_NIVELADA)}
		</div>

		<Pie />
	</div>
);

/* EL LOMO: el nombre en vertical a la izquierda, con su hoja, y «fin» al final. Guía de archivo. */
const Lomo: React.FC = () => (
	<>
		<div style={{ position: 'absolute', left: 3, top: 0, bottom: 0, width: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 7.5, color: GRIS, whiteSpace: 'nowrap' }}>
				{ALUMNO.lomo} · Hoja 1
			</span>
		</div>
		<span style={{ position: 'absolute', left: 3, bottom: 6, writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 7.5, color: GRIS, whiteSpace: 'nowrap' }}>
			fin · {ALUMNO.lomo}
		</span>
	</>
);

/* EL MEMBRETE OFICIAL: escudo (inventado, dibujado), el colegio, la resolución, el título y la foto. */
const Membrete: React.FC = () => (
	<div style={{ position: 'absolute', left: IZQ, right: DER, top: H.arriba, height: H.membrete - 8, display: 'flex', alignItems: 'center', gap: 14, borderBottom: `1px solid ${AZUL_SUAVE}` }}>
		<Escudo />
		<div style={{ flex: 1, textAlign: 'center' }}>
			<div style={{ fontSize: 16, fontWeight: 700 }}>{COLEGIO.nombre} - {COLEGIO.abreviatura}</div>
			<div style={{ fontSize: 8.5, color: GRIS, marginTop: 2 }}>{COLEGIO.resolucion}</div>
			<div style={{ display: 'inline-block', marginTop: 5, padding: '2px 14px', borderRadius: 999, background: BANDA, color: AZUL_TEXTO, fontSize: 12, fontWeight: 600, letterSpacing: 0.8 }}>
				{ALUMNO.tituloHoja}
			</div>
		</div>
		<div style={{ width: 54, height: 54, borderRadius: 4, border: `1px solid ${AZUL_SUAVE}`, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: '#eef3f9' }}>
			<Avatar tipo="mujer" variante={4} tam={52} />
		</div>
	</div>
);

const Escudo: React.FC = () => <EscudoDelColegio tam={52} />;

const Franja: React.FC = () => (
	<div style={{ position: 'absolute', left: IZQ, right: DER, top: H.arriba + H.membrete, height: H.franja - 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 10.5 }}>
		<div>
			<div>Grupo: <b>{GRUPO}</b></div>
			<div style={{ marginTop: 2 }}>Titular: {ALUMNO.titular}</div>
		</div>
		<div style={{ textAlign: 'right' }}>
			<div style={{ fontSize: 15, fontWeight: 700 }}>{ALUMNO.nombre}</div>
			<div style={{ marginTop: 2 }}>{ALUMNO.puntaje}</div>
		</div>
	</div>
);

const perdida = (n: number) => n < MINIMA_ACEPTADA;

const BloqueDeMateria: React.FC<{ m: Materia; arriba: number }> = ({ m, arriba }) => (
	<div style={{ position: 'absolute', left: IZQ + 8, right: DER, top: arriba }}>
		<div
			style={{
				height: H.materiaCabeza,
				display: 'flex',
				alignItems: 'center',
				gap: 6,
				padding: '0 4px',
				borderLeft: `2px solid ${AZUL}`,
				borderBottom: `0.8px solid ${AZUL_SUAVE}`,
				fontWeight: 700,
				boxSizing: 'border-box',
			}}
		>
			<span style={{ flex: '1 1 auto', fontSize: 11.5 }}>
				{m.materia}
				<span style={{ fontSize: 10, fontStyle: 'italic', fontWeight: 400, marginLeft: 4 }}>- Prof. {m.profesor}</span>
			</span>
			<span style={{ fontSize: 9.5, color: GRIS, fontWeight: 400, whiteSpace: 'nowrap' }}>A:{m.a} / T:{m.t}</span>
			<span style={{ width: ANCHO_NIVEL, textAlign: 'center', fontSize: 9.5, color: perdida(m.nota) ? ROJO : '#000' }}>{banda(m.nota)}</span>
			<span style={{ width: ANCHO_NOTA, textAlign: 'right', fontSize: 11.5, whiteSpace: 'nowrap' }}>
				{m.original !== undefined && <s style={{ fontWeight: 400, color: GRIS, marginRight: 4, fontSize: 10 }}>{m.original}</s>}
				<Nota n={m.nota} />
			</span>
		</div>

		<div style={{ height: H.tira, display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 12, fontSize: 9.5, color: '#222' }}>
			{m.per.map((p, k) => (
				<span key={k} style={{ minWidth: 58 }}>
					Per{k + 1}: <b>{p ?? ''}</b>
					{(m.perMarcas?.[k] ?? []).map((x) => <span key={x} style={{ marginLeft: 3, fontSize: 8.5 }}>{x}</span>)}
				</span>
			))}
			<span>Def: <b>{m.def}</b></span>
		</div>

		<div style={{ marginLeft: 10, paddingLeft: 8, borderLeft: `1px dotted ${GUIA}` }}>
			<Linea texto={`1. ${m.unidad.texto}`} porc={m.unidad.porc} nota={m.unidad.nota} alto={H.unidad} unidad />
			{m.subunidades.map((s, k) => (
				<Linea key={s.texto} texto={`${k + 1} ${s.texto}`} porc={s.porc} nota={s.nota} original={s.original} alto={H.subunidad} nivel={banda(s.nota)} />
			))}
		</div>
	</div>
);

const Linea: React.FC<{ texto: string; porc: number; nota: number; original?: number; alto: number; unidad?: boolean; nivel?: string }> = ({
	texto, porc, nota, original, alto, unidad = false, nivel,
}) => (
	<div style={{ height: alto, display: 'flex', alignItems: 'center', gap: 6, fontSize: unidad ? 10 : 9.5, paddingLeft: unidad ? 0 : 12 }}>
		<span style={{ flex: '1 1 auto', fontWeight: unidad ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{texto}</span>
		<span style={{ width: ANCHO_PORC, textAlign: 'right', fontSize: 8.5, fontStyle: unidad ? 'italic' : 'normal', fontWeight: unidad ? 700 : 400, color: GRIS }}>{porc}%</span>
		<span style={{ width: ANCHO_NIVEL, textAlign: 'center', fontSize: 8.5, color: nivel && perdida(nota) ? ROJO : '#000' }}>{nivel ?? ''}</span>
		<span style={{ width: ANCHO_NOTA, textAlign: 'right', whiteSpace: 'nowrap' }}>
			{original !== undefined && <s style={{ color: GRIS, marginRight: 4, fontSize: 9 }}>{original}</s>}
			<Nota n={nota} />
		</span>
	</div>
);

/* La nota; perdida, con el recuadro rojo alrededor de la cifra (no de la casilla). */
const Nota: React.FC<{ n: number }> = ({ n }) =>
	perdida(n) ? (
		<span style={{ color: ROJO, background: ROJO_TENUE, boxShadow: `inset 0 0 0 1px ${ROJO}`, borderRadius: 2, padding: '0 3px' }}>{n}</span>
	) : (
		<span>{n}</span>
	);

const Comportamiento: React.FC = () => (
	<div style={{ position: 'absolute', left: IZQ, right: DER, top: ARRIBA_COMPORTAMIENTO, height: H.comportamiento }}>
		<div style={{ height: 18, display: 'flex', alignItems: 'center', padding: '0 6px', background: BANDA, borderLeft: `3px solid ${AZUL}`, color: AZUL_TEXTO, fontSize: 10.5, fontWeight: 700, gap: 8 }}>
			<span style={{ flex: 1 }}>Comportamiento</span>
			<span style={{ width: ANCHO_NIVEL, textAlign: 'center', fontSize: 9.5 }}>{ALUMNO.comportamiento.desempenio}</span>
			<span style={{ width: ANCHO_NOTA, textAlign: 'right' }}>{ALUMNO.comportamiento.nota}</span>
		</div>
		<div style={{ marginLeft: 16, paddingLeft: 10, borderLeft: `1px dashed ${GUIA}`, fontSize: 9.5, lineHeight: '13px', marginTop: 3 }}>
			<div><b>Llegadas tarde</b> a la institución: {ALUMNO.faltas.tardeInstitucion}.</div>
			<div><b>Ausencias</b> en la entrada: {ALUMNO.faltas.ausenciasEntrada}.</div>
			<div><b>Tardanzas</b> a clases: {ALUMNO.faltas.tardanzasClases}.</div>
			<div><b>Ausencias</b> a clases: {ALUMNO.faltas.ausenciasClases}</div>
		</div>
	</div>
);

const Pie: React.FC = () => (
	<div style={{ position: 'absolute', left: IZQ, right: DER, top: ARRIBA_PIE }}>
		<div style={{ display: 'flex', justifyContent: 'space-around', gap: 40, marginBottom: 10 }}>
			{[
				{ nombre: ALUMNO.rector, cargo: 'Rector' },
				{ nombre: ALUMNO.titular, cargo: 'Titular' },
			].map((f) => (
				<div key={f.cargo} style={{ flex: 1, textAlign: 'center' }}>
					{/* El rector firma con su rúbrica, la misma de los certificados y la constancia. */}
					{f.cargo === 'Rector' ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 24, overflow: 'visible' }}><div style={{ marginBottom: -2 }}><Rubrica cual="rector" ancho={110} /></div></div> : <Firma />}
					<div style={{ borderTop: `1px solid ${GRIS}`, paddingTop: 3, fontSize: 10 }}>{f.nombre}</div>
					<div style={{ fontSize: 9, color: GRIS }}>{f.cargo}</div>
				</div>
			))}
		</div>
		<div style={{ fontSize: 8.5, color: '#444', lineHeight: 1.35, borderTop: `1px solid ${AZUL_SUAVE}`, paddingTop: 6 }}>
			<div>
				<b>A:</b> Ausencias. <b>IH:</b> Intensidad horaria semanal. 55 minutos de clase. 40 semanas escolares al año.
			</div>
			<div>
				<b>Valoración:</b> Según la escala nacional. Calificativo adquirido, siendo {MINIMA_ACEPTADA} la nota mínima aprobatoria.
			</div>
			<div style={{ marginTop: 1 }}>
				{BANDAS.map(([b, a, z], i) => (
					<span key={b}>
						<b>D. {b}:</b> de {a} a {z}{i < BANDAS.length - 1 ? ' · ' : ''}
					</span>
				))}
			</div>
		</div>
	</div>
);

/* Una firma dibujada: un trazo, no la de nadie. */
const Firma: React.FC = () => (
	<svg width="110" height="24" viewBox="0 0 110 24" style={{ display: 'block', margin: '0 auto' }}>
		<path d="M8 17 C18 4 24 22 34 11 C40 5 44 18 52 12 C60 6 66 19 76 10 C84 4 92 16 102 9" fill="none" stroke="#2b3a55" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);

function conTachado(texto: string): React.ReactNode {
	const i = texto.indexOf('tachado');
	return (
		<>
			{texto.slice(0, i)}
			<s>tachado</s>
			{texto.slice(i + 'tachado'.length)}
		</>
	);
}
