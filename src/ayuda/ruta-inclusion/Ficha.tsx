import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO } from '../../notas/tema';
import { IconoLapiz } from '../disciplina/Rejilla';
import { Casilla, IconoDocumento, IconoFlechaIzq, IconoImpresora, IconoReloj, IconoVistoRedondo, PALETA } from '../ant';
import { COLEGIO, Escudo } from '../colegio';
import { BotonAnt } from '../sin-internet/Bajar';
import { BotonPequeno } from './Listado';
import { AJUSTES, ANCHO_MATERIA, APOYOS, EL_ESTUDIANTE, ESTUDIANTES, F, GRUPO, MATERIAS, PARTES, TITULAR, estadoDe, xDeMateria, xDePestana } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA FICHA DE INCLUSIÓN (`app2/.../ruta-inclusion/alumno-inclusion.html`): «Volver a la ruta de
 * inclusión», la cabecera con el estudiante, el grupo y el titular, las cinco pestañas (`nz-tabs`,
 * cada una con su número y, salvo la 3, su visto verde o su reloj), y en cada pestaña la cabecera
 * del paso (`cabecera-paso.ts`): el número, el título, qué es, y «Lo escribe: …» — con «Usted lo
 * puede leer, no cambiar.» cuando quien mira no puede.
 *
 * QUIÉN PUEDE, SEGÚN `permisos-piar.ts`, visto como el titular de 9°B que dicta Matemáticas y
 * Geometría: la caracterización NO (sólo la administración la sube); valoración, contexto e
 * informe SÍ (son del titular); los ajustes de SUS materias sí y los de las otras no; las actas sí
 * (titular o administración).
 */

export interface EstadoFicha {
	pestana: number;
	/** Cuándo (fotograma de la secuencia) se cambió a esta pestaña: lo de dentro llega desde ahí. */
	pestanaDesde: number;
	materia: number;
	encima: string | null;
}

const GRIS = 'rgba(0,0,0,.6)';
const EST = ESTUDIANTES[EL_ESTUDIANTE];
const ICONO_DE: (boolean | null)[] = [EST.hechas[0], EST.hechas[1], null, EST.hechas[2], EST.hechas[3]];

export const Ficha: React.FC<{ e: EstadoFicha }> = ({ e }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const est = estadoDe(EST);
	const hechas = EST.hechas.filter(Boolean).length;
	const cabeza = llega(frame, fps, 0, 4, 0);
	const pestanas = entra(frame, fps, 14, 14);
	const cuerpo = llega(frame, fps, 0, Math.max(e.pestanaDesde, 20), 0);
	const parte = PARTES[e.pestana];
	const ajena = e.pestana === 2 && !MATERIAS[e.materia].suya;
	const puede = e.pestana === 2 ? !ajena : parte.puede;

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%', color: TEXTO }}>
			<div style={{ position: 'absolute', left: F.lados, top: F.arriba, display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: ACENTO, opacity: cabeza.opacidad }}>
				<IconoFlechaIzq />Volver a la ruta de inclusión
			</div>

			<div style={{ position: 'absolute', left: F.lados, top: F.yCabeza, width: F.ancho, height: F.altoCabeza, boxSizing: 'border-box', border: `1px solid ${PALETA.linea}`, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', background: SUPERFICIE, opacity: cabeza.opacidad, transform: `translateY(${cabeza.y}px)` }}>
				<Avatar tipo={EST.sexo} variante={EST.avatar} tam={58} />
				<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
					<span style={{ fontSize: 24, fontWeight: 600 }}>{EST.nombres} {EST.apellidos}</span>
					<span style={{ fontSize: 15, color: GRIS }}>{GRUPO.nombre} · Titular: {TITULAR}</span>
				</div>
				<span style={{ flex: 1 }} />
				<div style={{ textAlign: 'right' }}>
					<div style={{ fontSize: 22, fontWeight: 700 }}>{hechas} de 4</div>
					<div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: GRIS }}><IconoReloj tam={15} />{est.texto}</div>
				</div>
			</div>

			{/* Las pestañas. */}
			<div style={{ position: 'absolute', left: F.lados, top: F.yPestanas, width: F.ancho, height: F.altoPestanas, boxShadow: `inset 0 -1px 0 ${PALETA.linea}`, opacity: pestanas }}>
				{PARTES.map((p, i) => {
					const activa = i === e.pestana;
					const icono = ICONO_DE[i];
					return (
						<div key={p.corto} style={{ position: 'absolute', left: xDePestana(i) - F.lados, top: 0, height: F.altoPestanas, display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: activa ? ACENTO : e.encima === `pestana-${i}` ? ACENTO : TEXTO, boxShadow: activa ? `inset 0 -3px 0 ${ACENTO}` : 'none', padding: '0 4px', whiteSpace: 'nowrap' }}>
							<span style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(0,0,0,.45)', color: '#fff', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
							{p.corto}
							{icono !== null && <span style={{ color: icono ? '#237804' : 'rgba(0,0,0,.45)', display: 'inline-flex' }}>{icono ? <IconoVistoRedondo tam={15} /> : <IconoReloj tam={15} />}</span>}
						</div>
					);
				})}
			</div>

			{/* La cabecera del paso: número, título, qué es, y quién lo escribe. */}
			<div style={{ position: 'absolute', left: F.lados, top: F.yPaso, width: F.ancho, opacity: cuerpo.opacidad, transform: `translateY(${cuerpo.y}px)` }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<span style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 17, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{e.pestana + 1}</span>
					<span style={{ fontSize: 22, fontWeight: 600 }}>{parte.titulo}</span>
				</div>
				<div style={{ marginTop: 8, fontSize: 16, color: GRIS }}>{parte.explica}</div>
				<div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: 'rgba(0,0,0,.7)' }}>
					<IconoLapiz />Lo escribe: {parte.escribe}.
					{!puede && <i style={{ marginLeft: 6 }}>Usted lo puede leer, no cambiar.</i>}
				</div>
			</div>

			<div style={{ position: 'absolute', left: F.lados, top: F.yContenido, width: F.ancho, opacity: cuerpo.opacidad, transform: `translateY(${cuerpo.y}px)` }}>
				{e.pestana === 0 && <QuienEs />}
				{e.pestana === 1 && <Valoracion encima={e.encima} />}
				{e.pestana === 2 && <Ajustes materia={e.materia} encima={e.encima} />}
				{e.pestana === 3 && <Actas />}
				{e.pestana === 4 && <Informe encima={e.encima} />}
			</div>
		</div>
	);
};

const H3: React.FC<{ children: React.ReactNode; nota?: string }> = ({ children, nota }) => (
	<div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
		<span style={{ fontSize: 18, fontWeight: 600 }}>{children}</span>
		{nota && <span style={{ fontSize: 14, color: 'rgba(0,0,0,.55)' }}>{nota}</span>}
	</div>
);

const QuienEs: React.FC = () => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
		<div style={{ display: 'flex', gap: 24, fontSize: 16, color: GRIS }}>
			<span>☏ 310 555 0142</span><span>⌂ Carrera 10 # 20-30</span>
		</div>
		<div>
			<H3>Acudientes</H3>
			<div style={{ marginTop: 6, fontSize: 15, fontStyle: 'italic', color: GRIS }}>Los acudientes no se muestran en esta pantalla salvo a un superusuario. Están en la ficha del estudiante.</div>
		</div>
		<div>
			<H3 nota="se escriben en la ficha del estudiante, no aquí">Observaciones rápidas</H3>
			<div style={{ marginTop: 6, fontSize: 16 }}>{EST.observacion}</div>
		</div>
		<CajaDoc titulo="Caracterización del estudiante" nota="el informe que hace el colegio, en PDF" archivo="caracterizacion-2026.pdf" />
	</div>
);

const CajaDoc: React.FC<{ titulo: string; nota: string; archivo?: string; subir?: boolean }> = ({ titulo, nota, archivo, subir = false }) => (
	<div style={{ boxSizing: 'border-box', border: `1px solid ${PALETA.linea}`, borderRadius: 2, padding: '12px 16px', background: SUPERFICIE }}>
		<H3 nota={nota}>{titulo}</H3>
		{archivo && (
			<div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: ACENTO }}>
				<IconoDocumento tam={18} />{archivo}
			</div>
		)}
		{!archivo && <div style={{ marginTop: 8, fontSize: 15, color: GRIS }}>(No se ha subido ningún archivo todavía)</div>}
		{subir && (
			<div style={{ marginTop: 10, height: 64, boxSizing: 'border-box', border: '2px dashed #d9d9d9', borderRadius: 6, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 16, color: GRIS }}>
				Arrastre aquí el archivo, o <BotonPequeno>Elegir archivo</BotonPequeno>
			</div>
		)}
	</div>
);

const CampoRico: React.FC<{ titulo: string; nota: string; texto: string | null; vacio: string; puede: boolean; encima?: boolean }> = ({ titulo, nota, texto, vacio, puede, encima = false }) => (
	<div style={{ position: 'relative', boxSizing: 'border-box', minHeight: 96 }}>
		<H3 nota={nota}>{titulo}</H3>
		<div style={{ marginTop: 8, width: 860, fontSize: 16, lineHeight: 1.5, color: texto ? TEXTO : GRIS, fontStyle: texto ? 'normal' : 'italic' }}>{texto ?? vacio}</div>
		{puede && <div style={{ position: 'absolute', right: 0, top: 34 }}><BotonPequeno icono={<IconoLapiz />} encima={encima}>Editar</BotonPequeno></div>}
	</div>
);

const Valoracion: React.FC<{ encima: string | null }> = ({ encima }) => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
		<CampoRico titulo="Valoración pedagógica" nota="cómo va, qué se le observa" texto={null} vacio="(Todavía no se ha escrito la valoración pedagógica)" puede encima={encima === 'editar'} />
		<CampoRico titulo="Ajustes generales" nota="lo que vale para todas sus materias" texto="Una instrucción a la vez, escrita en el tablero; revisar la agenda al terminar el día." vacio="" puede />
	</div>
);

const Ajustes: React.FC<{ materia: number; encima: string | null }> = ({ materia, encima }) => {
	const m = MATERIAS[materia];
	return (
		<div>
			<div style={{ fontSize: 14, color: 'rgba(0,0,0,.55)', width: 980, height: AJUSTES.nota, lineHeight: '20px' }}>
				Este paso no entra en la cuenta de «al día»: hay uno por materia, lo escribe cada docente en la suya, y desde el listado del grupo no se pueden saber.
			</div>
			<div style={{ position: 'relative', height: 56, marginTop: AJUSTES.hueco }}>
				{MATERIAS.map((mt, i) => (
					<span key={mt.nombre} style={{ position: 'absolute', left: xDeMateria(i), top: AJUSTES.arriba }}>
						<BotonAnt primario={i === materia} encima={encima === `materia-${i}`} ancho={ANCHO_MATERIA[i]} alto={38} tam={16}>{mt.nombre}</BotonAnt>
					</span>
				))}
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
				<CampoRico titulo="Apoyos y/o ajustes razonables" nota="(modificado por el docente de la materia)" texto={APOYOS[m.nombre] ?? null} vacio="(Todavía no se ha escrito nada)" puede={m.suya} />
				<CampoRico titulo="Seguimientos" nota="(modificado por el docente de la materia)" texto={null} vacio="(Todavía no se ha escrito nada)" puede={m.suya} />
			</div>
		</div>
	);
};

const Actas: React.FC = () => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
		<CajaDoc titulo="Acta 2026" nota="la de este año" subir />
		<CajaDoc titulo="Acta 2025" nota="8B" archivo="acta-de-acuerdo-2025.pdf" />
	</div>
);

const Informe: React.FC<{ encima: string | null }> = ({ encima }) => (
	<div>
		<div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 16 }}>
			<span style={{ color: GRIS }}>Qué sale en la hoja:</span>
			{['Logo', 'Foto', 'Firma del titular', 'Firma del rector'].map((c) => (
				<span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Casilla marcada tam={18} />{c}</span>
			))}
			<BotonAnt primario ancho={130} alto={38} encima={encima === 'imprimir'} icono={<IconoImpresora />}>Imprimir</BotonAnt>
		</div>
		<div style={{ marginTop: 16, marginLeft: 100, width: 820, height: 320, boxSizing: 'border-box', padding: '26px 40px', background: '#fff', border: `1px solid ${BORDE}`, boxShadow: '0 6px 20px rgba(0,0,0,.08)' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				{/* «Logo» está marcado: sale el escudo del colegio. */}
				<Escudo tam={46} />
				<div style={{ flex: 1 }}>
					<div style={{ fontSize: 17, fontWeight: 700 }}>{COLEGIO.nombre}</div>
					<div style={{ fontSize: 15, marginTop: 2 }}>Informe de proceso pedagógico 2026</div>
				</div>
				<Avatar tipo={EST.sexo} variante={EST.avatar} tam={52} />
			</div>
			<div style={{ marginTop: 14, fontSize: 15, lineHeight: 1.6 }}>
				Grupo: <b>{GRUPO.nombre}</b> · Titular: {TITULAR}<br />{EST.nombres} {EST.apellidos}
			</div>
			<div style={{ marginTop: 12, fontSize: 15, fontStyle: 'italic', color: GRIS }}>(Este informe todavía no tiene texto)</div>
			<div style={{ display: 'flex', gap: 120, marginTop: 58, fontSize: 14, color: GRIS }}>
				<div style={{ width: 220, borderTop: '1px solid #999', paddingTop: 6, textAlign: 'center' }}>Titular</div>
				<div style={{ width: 220, borderTop: '1px solid #999', paddingTop: 6, textAlign: 'center' }}>Rector</div>
			</div>
		</div>
	</div>
);
