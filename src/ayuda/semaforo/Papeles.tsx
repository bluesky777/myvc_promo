import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { COLEGIO } from '../colegio';
import { Escudo, PAPEL } from '../cierre-6/Papel';
import { ESCALA, MINIMA, TITULAR_7A } from '../informes/gente';
import { AlumnoDelSemaforo, RIESGO } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS DOS PAPELES DEL SEMÁFORO (`informes/semaforo/`), dibujados:
 *
 *   · LA MEDIA HOJA (`semaforo.html`): membrete con la fecha de entrega en negro y el semáforo a
 *     color, el nombre del alumno, la tabla a dos columnas --Asignatura, Nota (o Valoración), A/T--
 *     con la celda teñida por el nivel de su banda (`semaforo.scss:496`: perdida rojo con recuadro,
 *     básica amarilla, media y alta verdes, la alta con recuadro verde), la tira de faltas, la
 *     escala al pie, los renglones del titular y las dos firmas.
 *   · LA HOJA DE RIESGO (`resumen-de-riesgo.html`): va delante, «Esta hoja no se entrega».
 *
 * Los colores son los de `papel.scss`. Sin escala del año, sólo se tiñe lo perdido y la leyenda
 * vuelve a su frase de respaldo («Perdida: menos de 60.»).
 */

export const MEDIA = { ancho: 816, alto: 528 };
export const HOJA_RIESGO = { ancho: 816, alto: 1056 };

const NIVEL = { perdida: '#f2bfba', basica: '#f2d77a', alta: '#bfe3c0', sinEvaluar: '#ccd2d7' };
const ROJO = '#c62828';
const VERDE_FUERTE = '#2e7d32';

type Nivel = 'perdida' | 'basica' | 'media' | 'alta' | null;

function nivelDe(nota: number, conEscala: boolean): Nivel {
	if (nota < MINIMA) { return 'perdida'; }
	if (!conEscala) { return null; }
	const i = ESCALA.findIndex((e) => nota >= e.desde && nota <= e.hasta);
	return i === 1 ? 'basica' : i === ESCALA.length - 1 ? 'alta' : 'media';
}

const fondoDe = (n: Nivel) => (n === 'perdida' ? NIVEL.perdida : n === 'basica' ? NIVEL.basica : n === 'media' || n === 'alta' ? NIVEL.alta : undefined);
const recuadroDe = (n: Nivel) => (n === 'perdida' ? `inset 0 0 0 1.6px ${ROJO}` : n === 'alta' ? `inset 0 0 0 1.6px ${VERDE_FUERTE}` : undefined);
const bandaDe = (n: number) => ESCALA.find((e) => n >= e.desde && n <= e.hasta)?.nombre ?? '';

/** El semáforo del membrete: tres luces a color, lo único del papel fuera de la paleta de la casa. */
export const Semaforito: React.FC<{ alto?: number }> = ({ alto = 42 }) => (
	<svg width={(alto * 24) / 40} height={alto} viewBox="0 0 24 40" aria-hidden>
		<rect x="1" y="1" width="22" height="38" rx="5.5" fill="#2b2f36" />
		{[
			['#ff5a4d', '#d7392e', 9.5],
			['#ffd166', '#f0a318', 20],
			['#5fd685', '#2c9a4a', 30.5],
		].map(([claro, oscuro, cy]) => (
			<g key={String(cy)}>
				<circle cx="12" cy={Number(cy)} r="7.2" fill={String(claro)} opacity="0.35" />
				<circle cx="12" cy={Number(cy)} r="5.4" fill={String(oscuro)} />
				<ellipse cx="10" cy={Number(cy) - 1.9} rx="2.2" ry="1.3" fill="#fff" opacity="0.7" transform={`rotate(-35 10 ${Number(cy) - 1.9})`} />
			</g>
		))}
	</svg>
);

export const RECTS_MEDIA = {
	membrete: { x: 22, y: 16, ancho: 772, alto: 58 },
	entrega: { x: 566, y: 18, ancho: 140, alto: 38 },
	tabla: { x: 22, y: 104, ancho: 772, alto: 190 },
	tira: { x: 22, y: 296, ancho: 772, alto: 20 },
	leyenda: { x: 22, y: 316, ancho: 772, alto: 28 },
	firmas: { x: 22, y: 468, ancho: 772, alto: 52 },
};

export const MediaHoja: React.FC<{ a: AlumnoDelSemaforo; valoracion: boolean; conEscala?: boolean; entrega: string }> = ({ a, valoracion, conEscala = true, entrega }) => {
	const mitad = Math.ceil(a.materias.length / 2);
	const columnas = [a.materias.slice(0, mitad), a.materias.slice(mitad)];
	return (
		<div style={{ width: MEDIA.ancho, height: MEDIA.alto, boxSizing: 'border-box', padding: '16px 22px 14px', background: '#fff', color: '#000', fontSize: 11.5, position: 'relative', overflow: 'hidden' }}>
			{/* Membrete: logo, colegio y papel; periodo y entrega; el semáforo; la cara. */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 58, borderBottom: `1.5px solid ${PAPEL.azul}`, paddingBottom: 6, boxSizing: 'border-box' }}>
				<Escudo tam={44} />
				<div style={{ flex: 1 }}>
					<div style={{ fontSize: 13.5, fontWeight: 700, color: PAPEL.azulTexto }}>{COLEGIO.nombre}</div>
					<div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.3 }}>Semáforo académico</div>
				</div>
				<div style={{ textAlign: 'right', fontSize: 11.5, color: PAPEL.gris, lineHeight: 1.35 }}>
					<div>Periodo 3 · 2026</div>
					{entrega && <div style={{ color: '#000', fontWeight: 700, fontSize: 12.5 }}>Entrega: {entrega}</div>}
				</div>
				<Semaforito />
				<div style={{ width: 44, height: 44, borderRadius: 4, overflow: 'hidden', background: '#eef2f7', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
					<Avatar tipo={a.sexo} variante={a.variante} tam={42} />
				</div>
			</div>
			<div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '8px 0 6px' }}>
				<span style={{ fontSize: 17, fontWeight: 700 }}>{a.nombre}</span>
				<span style={{ fontSize: 11.5, padding: '1px 8px', borderRadius: 99, background: PAPEL.banda, color: PAPEL.azul, fontWeight: 700 }}>7°A</span>
			</div>

			{/* La tabla, a dos columnas. */}
			<div style={{ display: 'flex', gap: 10 }}>
				{columnas.map((col, k) => (
					<div key={k} style={{ flex: 1 }}>
						<div style={{ display: 'flex', background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700, fontSize: 10.5, height: 20, alignItems: 'center' }}>
							<span style={{ flex: 1, paddingLeft: 6 }}>Asignatura</span>
							<span style={{ width: 74, textAlign: 'center' }}>{valoracion ? 'Valoración' : 'Nota'}</span>
							<span style={{ width: 40, textAlign: 'center' }}>A/T</span>
						</div>
						{col.map((m, i) => {
							const n = nivelDe(m.nota, conEscala);
							return (
								<div key={m.materia} style={{ display: 'flex', alignItems: 'stretch', height: 34, borderBottom: `0.8px solid ${PAPEL.azulSuave}`, background: i % 2 ? '#f4f8fc' : '#fff' }}>
									<div style={{ flex: 1, paddingLeft: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.15 }}>
										<span style={{ fontSize: 11.5, fontWeight: 600 }}>{m.materia}</span>
										<span style={{ fontSize: 8.5, color: PAPEL.gris }}>{m.docente}</span>
									</div>
									<div
										style={{
											width: 74,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontWeight: 700,
											fontSize: valoracion ? 10.5 : 13,
											background: fondoDe(n),
											boxShadow: recuadroDe(n),
										}}
									>
										{valoracion ? bandaDe(m.nota) : m.nota}
									</div>
									<div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, color: PAPEL.gris }}>{m.at}</div>
								</div>
							);
						})}
					</div>
				))}
			</div>

			{/* La tira de faltas. */}
			<div style={{ display: 'flex', gap: 22, marginTop: 8, fontSize: 11.5 }}>
				<span><b>{a.tardanzas}</b> tardanzas</span>
				<span><b>{a.ausencias}</b> ausencias</span>
				<span><b>{a.situaciones}</b> {a.situaciones === 1 ? 'situación' : 'situaciones'}</span>
				<span style={{ color: a.perdidas ? ROJO : undefined }}>
					<b>{a.perdidas}</b> {a.perdidas === 1 ? 'asignatura perdida' : 'asignaturas perdidas'}
				</span>
			</div>

			{/* La escala al pie. */}
			<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 7, fontSize: 10 }}>
				{conEscala ? (
					ESCALA.map((b, i) => {
						const n: Nivel = i === 0 ? 'perdida' : i === 1 ? 'basica' : i === ESCALA.length - 1 ? 'alta' : 'media';
						return (
							<span key={b.nombre} style={{ padding: '2px 6px', background: fondoDe(n), boxShadow: recuadroDe(n), fontWeight: 600 }}>
								{b.nombre} {b.desde} - {b.hasta}
							</span>
						);
					})
				) : (
					<>
						<span style={{ width: 14, height: 11, background: NIVEL.perdida, boxShadow: recuadroDe('perdida') }} />
						<span>Perdida: menos de {MINIMA}.</span>
					</>
				)}
				<span style={{ marginLeft: 8, color: PAPEL.gris }}>A/T: ausencias y tardanzas de la asignatura.</span>
			</div>

			{/* Los renglones del titular. */}
			<div style={{ marginTop: 8 }}>
				<div style={{ fontSize: 10, fontWeight: 700, color: PAPEL.gris }}>Observaciones del titular</div>
				<div style={{ height: 22, borderBottom: '0.8px solid #b9c3cf' }} />
				<div style={{ height: 20, borderBottom: '0.8px solid #b9c3cf' }} />
			</div>

			{/* Las dos firmas. */}
			<div style={{ position: 'absolute', left: 22, right: 22, bottom: 14, display: 'flex', gap: 60, padding: '0 30px' }}>
				{[
					['Estudiante o acudiente', 'Recibí este informe'],
					['Titular del grupo', TITULAR_7A],
				].map(([rotulo, pista]) => (
					<div key={rotulo} style={{ flex: 1, textAlign: 'center' }}>
						<div style={{ height: 22, borderBottom: `1px solid ${PAPEL.linea}` }} />
						<div style={{ fontSize: 11, fontWeight: 700, marginTop: 3 }}>{rotulo}</div>
						<div style={{ fontSize: 9.5, color: PAPEL.gris }}>{pista}</div>
					</div>
				))}
			</div>
		</div>
	);
};

/** Un folio de carta: dos medias hojas, una encima de otra. */
export const FOLIO = { ancho: MEDIA.ancho, alto: MEDIA.alto * 2 };

export const Folio: React.FC<{ arriba: AlumnoDelSemaforo; abajo: AlumnoDelSemaforo; valoracion: boolean; conEscala?: boolean; entrega: string }> = ({ arriba, abajo, valoracion, conEscala = true, entrega }) => (
	<div style={{ width: FOLIO.ancho, height: FOLIO.alto, background: '#fff', boxShadow: '0 24px 64px rgba(15,28,52,.18), 0 2px 8px rgba(15,28,52,.07)', borderRadius: 3, overflow: 'hidden' }}>
		<MediaHoja a={arriba} valoracion={valoracion} conEscala={conEscala} entrega={entrega} />
		<div style={{ height: 0, borderTop: '1px dashed #b9c3cf' }} />
		<MediaHoja a={abajo} valoracion={valoracion} conEscala={conEscala} entrega={entrega} />
	</div>
);

/** La hoja de riesgo, la primera: «quién va en rojo». */
export const HojaRiesgo: React.FC = () => (
	<div style={{ width: HOJA_RIESGO.ancho, height: HOJA_RIESGO.alto, boxSizing: 'border-box', padding: '22px 26px', background: '#fff', color: '#000', fontSize: 12, boxShadow: '0 10px 30px rgba(15,28,52,.14), 0 1px 4px rgba(15,28,52,.08)' }}>
		<div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 60, borderBottom: `1.5px solid ${PAPEL.azul}`, paddingBottom: 6, boxSizing: 'border-box' }}>
			<Escudo tam={46} />
			<div style={{ flex: 1 }}>
				<div style={{ fontSize: 14, fontWeight: 700, color: PAPEL.azulTexto }}>{COLEGIO.nombre}</div>
				<div style={{ fontSize: 16, fontWeight: 700 }}>Semáforo académico · quién va en rojo</div>
			</div>
			<div style={{ textAlign: 'right', fontSize: 12, lineHeight: 1.4 }}>
				<div>7°A · Periodo 3 · 2026</div>
				<div style={{ fontWeight: 700, color: ROJO }}>Esta hoja no se entrega: se queda en el colegio</div>
			</div>
		</div>
		<div style={{ display: 'flex', gap: 12, margin: '14px 0' }}>
			{RIESGO.cifras.map((c) => (
				<div key={c.texto} style={{ flex: 1, border: `1px solid ${c.alarma ? ROJO : PAPEL.azulSuave}`, borderRadius: 6, padding: '8px 10px', background: c.alarma ? '#fdecea' : '#f7fafd' }}>
					<div style={{ fontSize: 24, fontWeight: 800, color: c.alarma ? ROJO : '#000' }}>{c.n}</div>
					<div style={{ fontSize: 11, color: PAPEL.gris }}>{c.texto}</div>
				</div>
			))}
		</div>
		<div style={{ display: 'flex', background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700, fontSize: 11, height: 24, alignItems: 'center' }}>
			<span style={{ width: 30, textAlign: 'center' }}>#</span>
			<span style={{ width: 250 }}>Alumno</span>
			<span style={{ width: 50, textAlign: 'center' }}>Perdi</span>
			<span style={{ flex: 1 }}>Cuáles</span>
			<span style={{ width: 80, textAlign: 'center' }}>Aus/Tard</span>
			<span style={{ width: 50, textAlign: 'center' }}>Situa</span>
		</div>
		{RIESGO.filas.map((f, i) => (
			<div key={f.nombre} style={{ display: 'flex', alignItems: 'center', height: 28, borderBottom: `0.8px solid ${PAPEL.azulSuave}`, fontSize: 12 }}>
				<span style={{ width: 30, textAlign: 'center', color: PAPEL.gris }}>{i + 1}</span>
				<span style={{ width: 250 }}>{f.nombre}</span>
				<span style={{ width: 50, textAlign: 'center', fontWeight: 700 }}>
					{f.perdidas >= 3 ? <span style={{ color: '#fff', background: ROJO, borderRadius: 3, padding: '0 5px' }}>{f.perdidas}</span> : f.perdidas}
				</span>
				<span style={{ flex: 1, fontSize: 11, color: PAPEL.gris }}>{f.cuales}</span>
				<span style={{ width: 80, textAlign: 'center' }}>
					{f.ausencias >= 10 ? <span style={{ color: '#fff', background: ROJO, borderRadius: 3, padding: '0 5px' }}>{f.ausencias}</span> : f.ausencias}/{f.tardanzas}
				</span>
				<span style={{ width: 50, textAlign: 'center' }}>{f.situaciones}</span>
			</div>
		))}
		<div style={{ fontSize: 11, color: PAPEL.gris, marginTop: 8 }}>Los otros {20 - RIESGO.filas.length} del grupo no tienen ninguna perdida.</div>
	</div>
);
