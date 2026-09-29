import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega } from '../../comunes/movimiento';
import { ACENTO, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { MEDIDAS } from '../medidas';
import { Alerta, Casilla, Desplegable, IconoExcel, IconoSubir, ListaDesplegada, PALETA, Pildora, Progreso, Radio } from '../ant';
import { BotonAnt } from './Bajar';
import { ANCHO_CONTENIDO } from './datos';
import {
	ARCHIVO, CASILLAS, CHOQUES, ClaveDePaso, Cuentas, DESCARGADO_EL, DOCENTE, EL_CHOQUE_A_MANO, FILAS_QUE_SE_ANADEN, FILAS_QUE_SE_BORRAN,
	BORRADAS_9B, HOJAS_DEL_LIBRO, HOJAS_EN_CERO, HOJAS_LEIDAS, NUEVAS_9B, PASOS_DE_LA_SUBIDA, RESERVA, SE_ANADEN, SE_BORRAN, cuentas,
} from './datos-de-la-subida';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «SUBIR UNA PLANILLA» (`app2/.../notas-sin-internet/subir/subir.html`): la zona para soltar el
 * libro, la lectura, la barra de pasos y cinco de sus pasos --Archivo, Columnas nuevas, Choques,
 * Ausencias y Qué va a pasar--, con el pie de «Atrás · Paso N de M · Siguiente» y el de importar.
 *
 * LA BARRA DE PASOS NO ES `nz-steps`: son píldoras separadas por «›» (`nav.pasos`), la actual
 * teñida de azul, las anteriores en verde, y con un contador ámbar las que tienen algo. Y SÓLO
 * SALEN LOS PASOS QUE ESTE LIBRO NECESITA (`pasosDeLaSubida`): aquí no salen Estructura, Celdas ni
 * Alumnos, porque el libro no trae esos problemas.
 *
 * Los textos son los de la plantilla, palabra por palabra; los que vienen del servidor
 * («Esas 28 notas no se importan: ese indicador todavía no existe.») son los de
 * `8myvc/app/Services/EnsayoDeLaPlanilla.php`.
 */

export interface EstadoSubir {
	fase: 'soltar' | 'leyendo' | 'leido';
	/** 0..1 mientras se lee. */
	progreso: number;
	paso: ClaveDePaso;
	/** Fotograma (de la secuencia) en que se entró al paso: lo de dentro llega desde ahí. */
	pasoDesde: number;
	/** Hasta qué paso se ha llegado (los anteriores salen en verde). */
	hasta: number;
	encima: string | null;
	reserva: { decision: 'crear' | null; lista: boolean; encimaOpcion: number | null; nombre: string; tecleando: boolean };
	choques: { modo: 'sistema' | 'archivo' | 'una'; aMano: boolean; lista: boolean };
	ausencias: { anadir: boolean; borrar: boolean };
	resumen: { cuentas: Cuentas; planDeAntes: boolean; decisiones: number; releyendo: boolean };
	importando: number | null;
	importado: boolean;
	/** Cuánto ha bajado la página (px de la cáscara). */
	scroll: number;
}

/* ── La geometría, en coordenadas del CONTENIDO ─────────────────────────────────────────────── */

export const S = {
	arriba: 26,
	lados: 36,
	ancho: ANCHO_CONTENIDO - 72,
	yPasos: 138,
	altoPasos: 48,
	yCuerpo: 206,
};

/** El ancho de cada píldora de la barra, medido a ojo contra el render (16 px, peso 600 en la actual). */
const ANCHO_PASO: Record<ClaveDePaso, number> = { archivo: 96, reserva: 190, choques: 130, ausencias: 146, resumen: 162 };
const FLECHA = 22;

export function xDelPaso(clave: ClaveDePaso): number {
	let x = S.lados + 12;
	for (const p of PASOS_DE_LA_SUBIDA) {
		if (p.clave === clave) { return x; }
		x += ANCHO_PASO[p.clave] + FLECHA;
	}
	return x;
}

/** Del contenido a la cáscara, con el desplazamiento de la página. */
const aCascara = (r: { x: number; y: number; ancho: number; alto: number }, scroll = 0) => ({
	x: MEDIDAS.menu + r.x,
	y: MEDIDAS.barra + r.y - scroll,
	ancho: r.ancho,
	alto: r.alto,
});

/**
 * LA ZONA DE SOLTAR, con alturas de línea fijas para que el botón caiga donde dice la cuenta (antes
 * era un 352 medido a ojo y el foco quedaba 24 px por debajo del botón).
 */
const ZONA = { top: 138, borde: 2, arriba: 30, icono: 46, hueco: 12, titulo: 26, parrafo: 2 * 23, antesDelBoton: 4 };
const Y_ELEGIR = ZONA.top + ZONA.borde + ZONA.arriba + ZONA.icono + ZONA.hueco + ZONA.titulo + ZONA.hueco + ZONA.parrafo + ZONA.hueco + ZONA.antesDelBoton;

/** Los sitios que el guion señala, en coordenadas de la CÁSCARA. */
export const GEO_SUBIR = {
	elegir: aCascara({ x: S.lados + S.ancho / 2 - 110, y: Y_ELEGIR, ancho: 220, alto: 46 }),
	pasos: aCascara({ x: S.lados, y: S.yPasos, ancho: S.ancho, alto: S.altoPasos }),
	paso: (clave: ClaveDePaso) => aCascara({ x: xDelPaso(clave), y: S.yPasos + 9, ancho: ANCHO_PASO[clave], alto: 30 }),
	pasosDelMedio: aCascara({ x: xDelPaso('reserva') - 6, y: S.yPasos + 4, ancho: xDelPaso('resumen') - xDelPaso('reserva') - FLECHA + 12, alto: 40 }),
	cifras: aCascara({ x: S.lados, y: 300, ancho: S.ancho, alto: 100 }),
	tablaHojas: aCascara({ x: S.lados, y: 416, ancho: S.ancho, alto: 36 + 44 + 58 * HOJAS_LEIDAS.length }),
	siguiente: (yPie: number, scroll = 0) => aCascara({ x: S.lados + S.ancho - 130, y: yPie, ancho: 130, alto: 40 }, scroll),
	/* Columnas nuevas */
	filaReserva: aCascara({ x: S.lados, y: 306, ancho: S.ancho, alto: 44 + 132 }),
	selectReserva: aCascara({ x: S.lados + 720 + 14, y: 306 + 44 + 16, ancho: 340, alto: 36 }),
	opcionCrear: aCascara({ x: S.lados + 720 + 14, y: 306 + 44 + 16 + 40 + 4 + 36, ancho: 340, alto: 36 }),
	nombreReserva: aCascara({ x: S.lados + 720 + 14, y: 306 + 44 + 16 + 44, ancho: 190, alto: 34 }),
	/* Choques */
	opciones: aCascara({ x: S.lados, y: 298, ancho: S.ancho, alto: 3 * 66 + 2 * 8 }),
	opcion: (i: number) => aCascara({ x: S.lados, y: 298 + i * 74, ancho: S.ancho, alto: 66 }),
	tablaChoques: aCascara({ x: S.lados, y: 532, ancho: S.ancho, alto: 40 + 50 * CHOQUES.length }),
	entraChoque: (i: number) => aCascara({ x: S.lados + 922, y: 532 + 40 + 50 * i + 8, ancho: 180, alto: 34 }),
	opcionDelChoque: (i: number, cual: number) => aCascara({ x: S.lados + 922, y: 532 + 40 + 50 * i + 8 + 38 + 4 + cual * 36, ancho: 180, alto: 36 }),
	/* Ausencias (con la página bajada `scroll`) */
	seAnaden: (scroll: number) => aCascara({ x: S.lados, y: 300, ancho: S.ancho, alto: 330 }, scroll),
	seBorran: (scroll: number) => aCascara({ x: S.lados, y: 640, ancho: S.ancho, alto: 344 }, scroll),
	casillaBorrar: (scroll: number) => aCascara({ x: S.lados + 20, y: 648 + 124 + 150, ancho: 22, alto: 22 }, scroll),
	/* Resumen */
	cifrasResumen: aCascara({ x: S.lados, y: 270, ancho: S.ancho, alto: 100 }),
	barraDeAntes: (scroll: number) => aCascara({ x: S.lados, y: 800, ancho: S.ancho, alto: 60 }, scroll),
	volverALeer: (scroll: number) => aCascara({ x: S.lados + S.ancho - 340, y: 810, ancho: 340, alto: 40 }, scroll),
	importar: (scroll: number, ancho: number) => aCascara({ x: S.lados + S.ancho - ancho, y: 880, ancho, alto: 40 }, scroll),
};

/** Dónde va el pie de cada paso (en el contenido, sin bajar). */
export const Y_PIE: Record<ClaveDePaso, number> = { archivo: 716, reserva: 520, choques: 776, ausencias: 1000, resumen: 880 };

/* ── La pantalla ──────────────────────────────────────────────────────────────────────────── */

const TITULO = 4;

export const Subir: React.FC<{ e: EstadoSubir }> = ({ e }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const texto = 'Subir una planilla';
	const cursorTitulo = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const intro = entra(frame, fps, TITULO + 14, 14);

	return (
		<div style={{ position: 'relative', width: ANCHO_CONTENIDO, height: '100%', overflow: 'hidden', color: TEXTO }}>
			<div style={{ position: 'absolute', left: 0, top: -e.scroll, width: ANCHO_CONTENIDO, height: 1400 }}>
				{/* La cabecera. */}
				<div style={{ position: 'absolute', left: S.lados, top: S.arriba, width: S.ancho }}>
					<div style={{ height: 40, display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 600, whiteSpace: 'pre' }}>
						{escrito(frame, texto, TITULO, 2)}
						<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
					</div>
					<div style={{ width: 700, marginTop: 6, fontSize: 17, lineHeight: 1.45, color: PALETA.textoSuave, opacity: intro }}>
						Suba el mismo libro que bajó de aquí. Primero se lee y se le dice qué va a pasar; nada se escribe hasta que usted lo confirme.
					</div>
					{e.fase === 'leido' && (
						<div style={{ position: 'absolute', right: 0, top: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
							{e.importado
								? <Pildora tono="bien">Ya se escribió</Pildora>
								: <Pildora tono="gris">Ensayo · no se ha escrito nada</Pildora>}
							{e.importando === null && <BotonAnt icono={<IconoOtraVez />}>Otro archivo</BotonAnt>}
						</div>
					)}
				</div>

				{e.fase === 'soltar' && <ZonaSoltar encima={e.encima === 'elegir'} />}
				{e.fase === 'leyendo' && <Leyendo t={e.progreso} />}

				{e.fase === 'leido' && (
					<>
						<BarraDePasos actual={e.paso} hasta={e.hasta} encima={e.encima} />
						<Cuerpo e={e} />
					</>
				)}
			</div>
		</div>
	);
};

/* ── Antes de leer ────────────────────────────────────────────────────────────────────────── */

const ZonaSoltar: React.FC<{ encima: boolean }> = ({ encima }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = llega(frame, fps, 0, 30, 0);
	return (
		<div
			style={{
				position: 'absolute', left: S.lados, top: ZONA.top, width: S.ancho, height: 330, boxSizing: 'border-box',
				border: `${ZONA.borde}px dashed #d9d9d9`, borderRadius: 8, background: PALETA.zona,
				display: 'flex', flexDirection: 'column', alignItems: 'center', gap: ZONA.hueco, paddingTop: ZONA.arriba, textAlign: 'center',
				opacity: a.opacidad, transform: `translateY(${a.y}px)`,
			}}
		>
			<IconoExcel tam={46} color="#52c41a" />
			<div style={{ fontSize: 20, fontWeight: 600, lineHeight: `${ZONA.titulo}px` }}>Suba el libro que bajó</div>
			<div style={{ width: 760, fontSize: 16, lineHeight: `${ZONA.parrafo / 2}px`, color: PALETA.textoSuave }}>
				Se sube para <b>leerlo</b>: MyVc lo recorre entero y le enseña qué notas entrarían, cuáles chocan con el sistema y qué se guardaría en cada caso. <b>Nada se escribe</b> hasta que lo confirme.
			</div>
			<div style={{ marginTop: ZONA.antesDelBoton, display: 'flex' }}>
				<span style={{ height: 46, width: 220, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 23, background: encima ? '#4096ff' : ACENTO, color: '#fff', fontSize: 18, fontWeight: 600 }}>
					<IconoSubir tam={18} />Elegir el archivo
				</span>
			</div>
			<div style={{ fontSize: 15, color: TEXTO_TENUE }}>
				O suéltelo aquí · .xls o .xlsx · ¿no lo tiene? <span style={{ color: ACENTO }}>baje el libro</span>
			</div>
		</div>
	);
};

const Leyendo: React.FC<{ t: number }> = ({ t }) => (
	<div style={{ position: 'absolute', left: S.lados, top: 138, width: S.ancho, boxSizing: 'border-box', padding: 24, border: `1px solid ${PALETA.linea}`, borderRadius: 8, background: SUPERFICIE, display: 'flex', flexDirection: 'column', gap: 10 }}>
		<div style={{ fontSize: 18, fontWeight: 600 }}>Leyendo {ARCHIVO}…</div>
		<Progreso t={t} ancho="100%" />
		<div style={{ fontSize: 16, color: PALETA.textoSuave }}>Se está leyendo el libro entero para poder decirle qué pasaría. No se escribe nada.</div>
	</div>
);

/* ── La barra de pasos ────────────────────────────────────────────────────────────────────── */

const BarraDePasos: React.FC<{ actual: ClaveDePaso; hasta: number; encima: string | null }> = ({ actual, hasta, encima }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, 0, 14);
	return (
		<div style={{ position: 'absolute', left: S.lados, top: S.yPasos, width: S.ancho, height: S.altoPasos, boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 12px', border: `1px solid ${PALETA.linea}`, borderRadius: 8, background: PALETA.zona, opacity: a }}>
			{PASOS_DE_LA_SUBIDA.map((p, i) => {
				const esActual = p.clave === actual;
				const hecho = i < hasta && !esActual;
				const sobre = encima === `paso-${p.clave}`;
				return (
					<React.Fragment key={p.clave}>
						<span
							style={{
								width: ANCHO_PASO[p.clave], height: 30, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
								borderRadius: 999, fontSize: 16, fontWeight: esActual ? 600 : 400,
								background: esActual ? '#e6f4ff' : sobre ? PALETA.zonaMarcada : 'transparent',
								border: `1px solid ${esActual ? '#91caff' : 'transparent'}`,
								color: esActual ? '#0958d9' : hecho ? PALETA.exitoLegible : PALETA.textoSuave,
								whiteSpace: 'nowrap',
							}}
						>
							{p.etiqueta}
							{p.contador ? (
								<span style={{ minWidth: 22, height: 20, padding: '0 6px', boxSizing: 'border-box', borderRadius: 999, background: PALETA.avisoTinte, border: `1px solid ${PALETA.avisoBorde}`, color: PALETA.avisoLegible, fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
									{p.contador}
								</span>
							) : null}
						</span>
						{i < PASOS_DE_LA_SUBIDA.length - 1 && <span style={{ width: FLECHA, textAlign: 'center', color: TEXTO_TENUE, fontSize: 18 }}>›</span>}
					</React.Fragment>
				);
			})}
		</div>
	);
};

/* ── El cuerpo de cada paso ──────────────────────────────────────────────────────────────── */

const Cuerpo: React.FC<{ e: EstadoSubir }> = ({ e }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = llega(frame, fps, 0, e.pasoDesde, 0);
	const indice = PASOS_DE_LA_SUBIDA.findIndex((p) => p.clave === e.paso);

	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO_CONTENIDO, height: 1400, opacity: a.opacidad, transform: `translateY(${a.y}px)` }}>
			{e.paso === 'archivo' && <PasoArchivo />}
			{e.paso === 'reserva' && <PasoReserva e={e} />}
			{e.paso === 'choques' && <PasoChoques e={e} />}
			{e.paso === 'ausencias' && <PasoAusencias e={e} />}
			{e.paso === 'resumen' && <PasoResumen e={e} />}

			{/* El pie: «Atrás», y «Paso N de M · Siguiente» o el botón de importar. */}
			{e.importando === null && !e.importado && (
				<div style={{ position: 'absolute', left: S.lados, top: Y_PIE[e.paso], width: S.ancho, height: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
					{indice > 0 && <BotonAnt>Atrás</BotonAnt>}
					<span style={{ flex: 1 }} />
					{e.paso === 'resumen' ? (
						<BotonAnt primario={!e.resumen.planDeAntes} apagado={e.resumen.planDeAntes || e.resumen.releyendo} encima={e.encima === 'importar'} ancho={360}>
							{textoDeImportar(e)}
						</BotonAnt>
					) : (
						<>
							<span style={{ fontSize: 15, color: PALETA.textoSuave }}>Paso {indice + 1} de {PASOS_DE_LA_SUBIDA.length}</span>
							<BotonAnt primario ancho={130} encima={e.encima === 'siguiente'}>Siguiente</BotonAnt>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export function textoDeImportar(e: Pick<EstadoSubir, 'resumen' | 'ausencias'>): string {
	const anadidas = e.ausencias.anadir ? FILAS_QUE_SE_ANADEN : 0;
	const borradas = e.ausencias.borrar ? FILAS_QUE_SE_BORRAN : 0;
	const falta = (n: number) => (n === 1 ? 'falta' : 'faltas');
	const coletilla = anadidas && borradas ? `, crear ${anadidas} ${falta(anadidas)} y borrar ${borradas}`
		: anadidas ? ` y crear ${anadidas} ${falta(anadidas)}`
			: borradas ? ` y borrar ${borradas} ${falta(borradas)}` : '';
	return `Importar ${e.resumen.cuentas.entran} notas${coletilla}`;
}

const H3: React.FC<{ y: number; children: React.ReactNode; color?: string }> = ({ y, children, color = TEXTO }) => (
	<div style={{ position: 'absolute', left: S.lados, top: y, width: S.ancho, fontSize: 20, fontWeight: 600, color }}>{children}</div>
);
const Menuda: React.FC<{ y: number; children: React.ReactNode; ancho?: number; x?: number }> = ({ y, children, ancho = S.ancho, x = S.lados }) => (
	<div style={{ position: 'absolute', left: x, top: y, width: ancho, fontSize: 16, lineHeight: 1.45, color: PALETA.textoSuave }}>{children}</div>
);
const En: React.FC<{ y: number; x?: number; ancho?: number; children: React.ReactNode }> = ({ y, x = S.lados, ancho = S.ancho, children }) => (
	<div style={{ position: 'absolute', left: x, top: y, width: ancho }}>{children}</div>
);

const Cifras: React.FC<{ y: number; cifras: { k: string; v: React.ReactNode; n: string; color?: string; texto?: boolean }[] }> = ({ y, cifras }) => (
	<div style={{ position: 'absolute', left: S.lados, top: y, width: S.ancho, height: 100, display: 'flex', gap: 10 }}>
		{cifras.map((c) => (
			<div key={c.k} style={{ flex: 1, minWidth: 0, boxSizing: 'border-box', padding: '12px 14px', border: `1px solid ${PALETA.linea}`, borderRadius: 8, background: PALETA.zona, display: 'flex', flexDirection: 'column', gap: 4 }}>
				<span style={{ fontSize: 13, letterSpacing: 0.6, textTransform: 'uppercase', color: TEXTO_TENUE, whiteSpace: 'nowrap' }}>{c.k}</span>
				<span style={{ fontSize: c.texto ? 16 : 28, fontWeight: 600, lineHeight: 1.15, color: c.color ?? TEXTO, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontVariantNumeric: 'tabular-nums' }}>{c.v}</span>
				<span style={{ fontSize: 14, color: PALETA.textoSuave, whiteSpace: 'nowrap' }}>{c.n}</span>
			</div>
		))}
	</div>
);

const Tabla: React.FC<{ y: number; columnas: { t: string; ancho: number; cifra?: boolean }[]; filas: React.ReactNode[][]; altoFila: number; altoCabecera?: number }> = ({ y, columnas, filas, altoFila, altoCabecera = 44 }) => (
	<div style={{ position: 'absolute', left: S.lados, top: y, width: S.ancho, boxSizing: 'border-box', outline: `1px solid ${PALETA.linea}`, borderRadius: 8, background: SUPERFICIE, overflow: 'hidden' }}>
		<div style={{ display: 'flex', height: altoCabecera, alignItems: 'center', background: PALETA.zona, boxShadow: `inset 0 -1px 0 ${PALETA.linea}`, fontSize: 16, fontWeight: 600, color: PALETA.textoSuave }}>
			{columnas.map((c) => <div key={c.t} style={{ width: c.ancho, padding: '0 14px', boxSizing: 'border-box', textAlign: c.cifra ? 'right' : 'left' }}>{c.t}</div>)}
		</div>
		{filas.map((f, i) => (
			<div key={i} style={{ display: 'flex', height: altoFila, alignItems: 'center', fontSize: 17, boxShadow: i === filas.length - 1 ? 'none' : `inset 0 -1px 0 ${PALETA.linea}` }}>
				{f.map((celda, j) => (
					<div key={j} style={{ width: columnas[j].ancho, padding: '0 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: columnas[j].cifra ? 'flex-end' : 'flex-start', justifyContent: 'center', fontVariantNumeric: 'tabular-nums' }}>
						{celda}
					</div>
				))}
			</div>
		))}
	</div>
);

const Pequena: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontSize: 14, color: PALETA.textoSuave }}>{children}</span>;

/* ── Archivo ─────────────────────────────────────────────────────────────────────────────── */

const PasoArchivo: React.FC = () => {
	const c = cuentas(false, 0);
	return (
		<>
			<En y={S.yCuerpo}>
				<Alerta tono="exito" titulo="Reconocí el libro entero" texto={`Lo descargó usted el ${DESCARGADO_EL}. La firma está intacta: puedo saber exactamente qué casillas tocó.`} />
			</En>
			<Cifras
				y={300}
				cifras={[
					{ k: 'Archivo', v: ARCHIVO, n: 'formato v1', texto: true },
					{ k: 'Docente', v: DOCENTE, n: 'usted', texto: true },
					{ k: 'Periodo', v: 2, n: 'abierto' },
					{ k: 'Hojas', v: HOJAS_DEL_LIBRO, n: `${HOJAS_DEL_LIBRO} reconocidas` },
					{ k: 'Notas que entrarían', v: c.entran, n: `de ${CASILLAS} casillas`, color: PALETA.exitoLegible },
				]}
			/>
			<Menuda y={416}>
				De las {HOJAS_DEL_LIBRO} hojas del libro <b>tocó {HOJAS_LEIDAS.length}</b>, y son las de abajo. Las demás están en cero, y eso no es un error: es que no las tocó.
			</Menuda>
			<Tabla
				y={452}
				altoFila={58}
				columnas={[{ t: 'Hoja', ancho: 240 }, { t: 'Asignatura', ancho: 380 }, { t: 'Estado', ancho: 260 }, { t: 'Cambió', ancho: 120, cifra: true }, { t: 'Entra', ancho: 120, cifra: true }]}
				filas={HOJAS_LEIDAS.map((h) => [
					<span key="h" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16 }}>{h.nombre}</span>,
					<><span>{h.asignatura}</span><Pequena>{h.alumnos} alumnos · periodo 2</Pequena></>,
					h.problemas ? <Pildora tono="aviso" tam={15}>{h.problemas} cosas que revisar</Pildora> : <Pildora tono="bien" tam={15}>lista</Pildora>,
					h.cambiaron,
					h.entran,
				])}
			/>
			<Menuda y={626}>
				<span style={{ color: TEXTO }}>▸ Ver las {HOJAS_EN_CERO} hojas que dejó en cero</span>
				<span style={{ marginLeft: 12, fontSize: 14, color: TEXTO_TENUE }}>todas con 0 cambios y 0 notas</span>
			</Menuda>
			<Menuda y={664}>Se puede ir directo al resumen y volver; nada se escribe hasta el final.</Menuda>
		</>
	);
};

/* ── Columnas nuevas ─────────────────────────────────────────────────────────────────────── */

const PasoReserva: React.FC<{ e: EstadoSubir }> = ({ e }) => {
	const frame = useCurrentFrame();
	const r = e.reserva;
	const crear = r.decision === 'crear';
	return (
		<>
			<H3 y={S.yCuerpo}>Escribió notas en una columna que todavía no existe</H3>
			<Menuda y={244}>
				Las columnas de reserva del libro están para eso. Crear el indicador se puede, pero hay que ponerle nombre — y, cuando el colegio reparte por porcentaje, decir cuánto vale.
			</Menuda>
			<Tabla
				y={306}
				altoFila={132}
				columnas={[{ t: 'Columna', ancho: 300 }, { t: 'Notas', ancho: 90, cifra: true }, { t: 'Qué pasa si no hago nada', ancho: 330 }, { t: 'Qué hago', ancho: 400 }]}
				filas={[[
					<><b>{RESERVA.hoja} · columna {RESERVA.columna}</b><Pequena>la número {RESERVA.numero} del Excel · {RESERVA.unidad}</Pequena></>,
					RESERVA.notas,
					<span key="s" style={{ fontSize: 16, lineHeight: 1.4 }}>Esas {RESERVA.notas} notas no se importan: ese indicador todavía no existe.</span>,
					<div key="q" style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16, height: 132, boxSizing: 'border-box' }}>
						<Desplegable valor={crear ? 'Crear el indicador' : null} marcador="Sin decidir" ancho={340} alto={36} tam={16} abierto={r.lista} senalado={e.encima === 'select-reserva'} />
						{crear && (
							<div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
								<div style={{ width: 190, height: 34, boxSizing: 'border-box', border: `1px solid ${r.tecleando ? ACENTO : '#d9d9d9'}`, boxShadow: r.tecleando ? `0 0 0 2px ${ACENTO}22` : 'none', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 16, color: r.nombre ? TEXTO : '#bfbfbf', whiteSpace: 'pre', overflow: 'hidden' }}>
									{r.nombre || 'Cómo se llama'}
									{r.tecleando && <span style={{ opacity: frame % 30 < 16 ? 1 : 0 }}>|</span>}
								</div>
								<div style={{ width: 70, height: 34, boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 16 }}>{RESERVA.pesoSugerido}</div>
								<span style={{ fontSize: 14, color: PALETA.textoSuave, whiteSpace: 'nowrap' }}>% del {RESERVA.unidad}</span>
								{!r.nombre && <span style={{ fontSize: 14, color: PALETA.peligro }}>Falta el nombre o el peso: así no se puede crear.</span>}
							</div>
						)}
					</div>,
				]]}
			/>
			{r.lista && (
				<div style={{ position: 'absolute', left: S.lados + 720 + 14, top: 306 + 44 + 16 + 40, zIndex: 10 }}>
					<ListaDesplegada opciones={['Dejar esas notas fuera', 'Crear el indicador']} ancho={340} encima={r.encimaOpcion} tam={16} alto={36} />
				</div>
			)}
		</>
	);
};

/* ── Choques ─────────────────────────────────────────────────────────────────────────────── */

const PasoChoques: React.FC<{ e: EstadoSubir }> = ({ e }) => {
	const n = CHOQUES.length;
	const c = e.choques;
	const opciones = [
		{ clave: 'sistema', t: `El sistema manda en las ${n}`, d: <>Sus {n} notas del Excel se quedan fuera. El resto de su trabajo entra igual. <b>Es lo seguro</b>: si cambió en el sistema, alguien lo tocó sabiendo lo que hacía.</> },
		{ clave: 'archivo', t: `Mi archivo manda en las ${n}`, d: <>Se pisan las {n} del sistema con lo que usted escribió.</> },
		{ clave: 'una', t: 'Ver una por una', d: <>{n} decisiones. Útil cuando son cuatro; con treinta y una, casi nadie llega al final.</> },
	];
	const gana = (i: number): 'archivo' | 'sistema' => (c.modo === 'archivo' || (c.aMano && i === EL_CHOQUE_A_MANO) ? 'archivo' : 'sistema');
	const suyas = CHOQUES.filter((_, i) => gana(i) === 'archivo').length;
	return (
		<>
			<H3 y={S.yCuerpo}>{n} notas cambiaron en los dos sitios</H3>
			<Menuda y={240}>
				Usted las cambió en el Excel, y también cambiaron en el sistema desde que bajó el libro el {DESCARGADO_EL}. Las que sólo cambiaron en su archivo no salen aquí: son la mayoría, y son el trabajo.
			</Menuda>
			{opciones.map((o, i) => (
				<div key={o.clave} style={{ position: 'absolute', left: S.lados, top: 298 + i * 74, width: S.ancho, height: 66, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', border: `1px solid ${c.modo === o.clave ? '#91caff' : '#d9d9d9'}`, background: c.modo === o.clave ? '#f0f7ff' : SUPERFICIE, borderRadius: 8 }}>
					<div style={{ paddingTop: 2 }}><Radio puesto={c.modo === o.clave} /></div>
					<div>
						<div style={{ fontSize: 17, fontWeight: 600 }}>{o.t}</div>
						<div style={{ fontSize: 14, color: PALETA.textoSuave, marginTop: 2 }}>{o.d}</div>
					</div>
				</div>
			))}
			<Tabla
				y={532}
				altoFila={50}
				altoCabecera={40}
				columnas={[{ t: 'Alumno', ancho: 330 }, { t: 'Su archivo', ancho: 130, cifra: true }, { t: 'El sistema', ancho: 130, cifra: true }, { t: 'Cambió en el sistema', ancho: 318 }, { t: 'Entra', ancho: 212 }]}
				filas={CHOQUES.map((ch, i) => [
					<><span style={{ fontSize: 16 }}>{ch.alumno}</span><span style={{ fontSize: 13, color: PALETA.textoSuave }}>{ch.indicador}</span></>,
					<span key="a" style={{ fontWeight: gana(i) === 'archivo' ? 700 : 400, color: gana(i) === 'archivo' ? ACENTO : TEXTO }}>{ch.archivo}</span>,
					<span key="s" style={{ fontWeight: gana(i) === 'sistema' ? 700 : 400, color: gana(i) === 'sistema' ? ACENTO : TEXTO }}>{ch.sistema}</span>,
					<span key="c" style={{ fontSize: 15 }}>{ch.cuando}</span>,
					<Desplegable key="e" valor={gana(i) === 'archivo' ? `${ch.archivo} (su archivo)` : `${ch.sistema} (sistema)`} ancho={180} alto={34} tam={15} senalado={e.encima === `choque-${i}`} abierto={c.lista && i === EL_CHOQUE_A_MANO} />,
				])}
			/>
			{c.lista && (
				<div style={{ position: 'absolute', left: S.lados + 922, top: 532 + 40 + 50 * EL_CHOQUE_A_MANO + 8 + 38, zIndex: 10 }}>
					<ListaDesplegada
						opciones={[`${CHOQUES[EL_CHOQUE_A_MANO].sistema} (sistema)`, `${CHOQUES[EL_CHOQUE_A_MANO].archivo} (su archivo)`]}
						ancho={180}
						marcada={0}
						encima={e.encima === 'opcion-archivo' ? 1 : null}
						tam={15}
						alto={36}
					/>
				</div>
			)}
			<Menuda y={740}>Entrarían {suyas} de las suyas y {n - suyas} del sistema.</Menuda>
		</>
	);
};

/* ── Ausencias ───────────────────────────────────────────────────────────────────────────── */

const PasoAusencias: React.FC<{ e: EstadoSubir }> = ({ e }) => (
	<>
		<H3 y={S.yCuerpo}>Ausencias y tardanzas · {FILAS_QUE_SE_ANADEN + FILAS_QUE_SE_BORRAN} filas</H3>
		<Menuda y={240}>
			La columna del libro sólo lleva <b>el total del periodo</b>. En el sistema cada ausencia es una fila con su fecha, así que cambiar ese total no cambia un número: crea o borra filas.
		</Menuda>

		<div style={{ position: 'absolute', left: S.lados, top: 300, fontSize: 18, fontWeight: 600 }}>Se añaden · {FILAS_QUE_SE_ANADEN} filas</div>
		<En y={334}>
			<Alerta tono="info" tam={16} titulo="Las nuevas quedan fechadas hoy, no el día que faltó" texto="El libro sólo trae el total del periodo, así que no hay forma de saber qué día fue cada falta: las filas que se creen llevan la fecha de esta importación." />
		</En>
		<TarjetaDeAusencias y={430} cambios={SE_ANADEN} marcada={e.ausencias.anadir} baja={false} />

		<div style={{ position: 'absolute', left: S.lados, top: 648, fontSize: 18, fontWeight: 600, color: PALETA.peligroLegible }}>Se borran · {FILAS_QUE_SE_BORRAN} fila</div>
		<En y={682}>
			<Alerta tono="error" tam={16} titulo="Borrar una ausencia se lleva su fecha, y no vuelve" texto="El libro sólo trae el total, así que para bajarlo hay que borrar filas enteras con el día en que se registraron. Las planillas de ausencias que se les entregan a los acudientes leen esas fechas." />
		</En>
		<TarjetaDeAusencias y={778} cambios={SE_BORRAN} marcada={e.ausencias.borrar} baja encima={e.encima === 'borrar'} />
	</>
);

const TarjetaDeAusencias: React.FC<{ y: number; cambios: typeof SE_ANADEN; marcada: boolean; baja: boolean; encima?: boolean }> = ({ y, cambios, marcada, baja, encima = false }) => {
	const filas = cambios.reduce((n, c) => n + Math.abs(c.enElLibro - c.enElSistema), 0);
	const rojo = baja;
	/* «Si no hace nada»: el texto del servidor (`EnsayoDeLaPlanilla::siNoHagoNadaConElConteo`). */
	const siNoHaceNada = (c: (typeof SE_ANADEN)[number]) => {
		const n = Math.abs(c.enElLibro - c.enElSistema);
		const palabra = n === 1 ? 'ausencia' : 'ausencias';
		return baja
			? <>No se borra nada: se queda en {c.enElSistema}. Bajarlo a {c.enElLibro} significa <b>borrar {n} {palabra} con su fecha</b>, que {n === 1 ? 'es la que sale' : 'son las que salen'} en la planilla de ausencias del acudiente, así que sólo pasa si se pide.</>
			: <>Se crear{n === 1 ? 'á' : 'án'} {n} {palabra} con la fecha del día en que se importe, no la del día que faltó: la columna sólo trae el total. Pasará de {c.enElSistema} a {c.enElLibro}.</>;
	};
	return (
		<div style={{ position: 'absolute', left: S.lados, top: y, width: S.ancho, boxSizing: 'border-box', padding: '12px 16px', border: `1px solid ${rojo ? PALETA.peligroBorde : PALETA.linea}`, borderRadius: 8, background: rojo && marcada ? PALETA.peligroTinte : SUPERFICIE }}>
			<div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
				<span style={{ fontSize: 17, fontWeight: 600 }}>Ausencias · Matemáticas</span>
				<span style={{ fontSize: 14, color: PALETA.textoSuave }}>
					Hoja «9A Matemáticas» · {cambios.length} {cambios.length === 1 ? 'alumno' : 'alumnos'} · {filas} {baja ? (filas === 1 ? 'fila con fecha' : 'filas con fecha') : (filas === 1 ? 'fila nueva' : 'filas nuevas')}
				</span>
			</div>
			<div style={{ display: 'flex', height: 34, alignItems: 'center', marginTop: 8, fontSize: 15, fontWeight: 600, color: PALETA.textoSuave, boxShadow: `inset 0 -1px 0 ${PALETA.linea}` }}>
				<span style={{ width: 280 }}>Alumno</span><span style={{ width: 130, textAlign: 'right' }}>En el sistema</span><span style={{ width: 120, textAlign: 'right' }}>En el libro</span><span style={{ width: 80, textAlign: 'right' }}>Filas</span><span style={{ flex: 1, paddingLeft: 24 }}>Si no hace nada</span>
			</div>
			{cambios.map((c) => (
				<div key={c.alumno} style={{ display: 'flex', minHeight: 64, alignItems: 'center', fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>
					<span style={{ width: 280 }}>{c.alumno}</span>
					<span style={{ width: 130, textAlign: 'right' }}>{c.enElSistema}</span>
					<span style={{ width: 120, textAlign: 'right', fontWeight: marcada ? 700 : 400, color: marcada ? ACENTO : TEXTO }}>{c.enElLibro}</span>
					<span style={{ width: 80, textAlign: 'right' }}>{baja ? `−${c.enElSistema - c.enElLibro}` : `+${c.enElLibro - c.enElSistema}`}</span>
					<span style={{ flex: 1, paddingLeft: 24, fontSize: 13.5, lineHeight: 1.35, color: PALETA.textoSuave }}>{siNoHaceNada(c)}</span>
				</div>
			))}
			<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
				<Casilla marcada={marcada} roja={baja} senalada={encima} />
				<span style={{ fontSize: 16 }}>{baja ? (filas === 1 ? 'Sí, bórrala' : 'Sí, bórralas') : `Añadir las ${filas} filas`}</span>
				<span style={{ flex: 1 }} />
				{baja
					? (marcada ? <Pildora tono="mal" tam={14}>{filas === 1 ? 'Se borra 1 fila con su fecha' : `Se borran ${filas} filas con sus fechas`}</Pildora> : <Pildora tono="bien" tam={14}>No se borra nada</Pildora>)
					: (marcada ? <Pildora tono="bien" tam={14}>{filas === 1 ? 'Se crea 1 fila, fechada hoy' : `Se crean ${filas} filas, fechadas hoy`}</Pildora> : <Pildora tono="gris" tam={14}>No se añade nada</Pildora>)}
			</div>
		</div>
	);
};

/* ── Qué va a pasar ──────────────────────────────────────────────────────────────────────── */

const PasoResumen: React.FC<{ e: EstadoSubir }> = ({ e }) => {
	const c = e.resumen.cuentas;
	/* Mientras escribe, y después, el plan se va: queda la barra de progreso o «Lo que pasó». */
	if (e.importando !== null) {
		return (
			<div style={{ position: 'absolute', left: S.lados, top: S.yCuerpo, width: S.ancho, boxSizing: 'border-box', padding: 20, border: `1px solid ${PALETA.linea}`, borderRadius: 8, background: SUPERFICIE, display: 'flex', flexDirection: 'column', gap: 8 }}>
				<div style={{ fontSize: 18, fontWeight: 600 }}>Escribiendo las notas…</div>
				<Progreso t={e.importando} ancho="100%" />
				<div style={{ fontSize: 15, color: PALETA.textoSuave }}>Ahora sí se está escribiendo. Si se corta, vuelva a subir el mismo archivo: continúa donde se quedó.</div>
			</div>
		);
	}
	if (e.importado) {
		const anadidas = e.ausencias.anadir ? FILAS_QUE_SE_ANADEN : 0;
		const borradas = e.ausencias.borrar ? FILAS_QUE_SE_BORRAN : 0;
		const titulo = `Entraron ${c.entran} notas y ${c.seBorran === 1 ? 'se borró 1' : `se borraron ${c.seBorran}`}`
			+ (anadidas || borradas ? ` · ${anadidas === 1 ? 'se creó 1 falta' : `se crearon ${anadidas} faltas`} y ${borradas === 1 ? 'se borró 1' : `se borraron ${borradas}`}` : '');
		return (
			<>
				<H3 y={S.yCuerpo}>Lo que pasó</H3>
				<En y={246}>
					<Alerta tono="exito" titulo={titulo} texto="Lo prometido y lo hecho coinciden en todas las hojas." />
				</En>
				<Tabla
					y={340}
					altoFila={48}
					altoCabecera={40}
					columnas={[{ t: 'Hoja', ancho: 400 }, { t: 'Prometido', ancho: 240, cifra: true }, { t: 'Hecho', ancho: 240, cifra: true }, { t: '', ancho: 240 }]}
					filas={[
						[<span key="h" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16 }}>9B Matemáticas</span>, 2, 2, <Pildora key="p" tono="bien" tam={14}>igual</Pildora>],
						[<span key="h" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16 }}>9A Matemáticas</span>, c.entran - 1, c.entran - 1, <Pildora key="p" tono="bien" tam={14}>igual</Pildora>],
					]}
				/>
			</>
		);
	}
	return (
		<>
			<H3 y={S.yCuerpo}>Qué va a pasar</H3>
			<Menuda y={236}>Leído contra la base, y todavía sin escribir nada.</Menuda>
			<Cifras
				y={270}
				cifras={[
					{ k: 'Notas que entran', v: c.entran, n: `de ${HOJAS_LEIDAS.reduce((n, h) => n + h.cambiaron, 0)} que cambió`, color: PALETA.exitoLegible },
					{ k: 'Se borran', v: c.seBorran, n: 'las del guion', color: PALETA.avisoLegible },
					{ k: 'Se quedan fuera', v: c.fuera, n: 'choques y casillas descartadas' },
					{ k: 'Filas descartadas', v: c.descartadas, n: 'no se reconocen' },
					{ k: 'Definitivas a recalcular', v: c.definitivas, n: 'asignaturas', color: '#0958d9' },
				]}
			/>
			<Menuda y={388}>
				<b style={{ color: TEXTO }}>Ausencias y tardanzas</b>
				{'  '}<span style={{ color: PALETA.exitoLegible, fontWeight: 600 }}>{e.ausencias.anadir ? FILAS_QUE_SE_ANADEN : 0} se añaden</span>
				{'  '}<span style={{ color: PALETA.peligroLegible, fontWeight: 600 }}>{e.ausencias.borrar ? FILAS_QUE_SE_BORRAN : 0} se borran</span>
				<br />Filas, no notas. Van aparte y nunca sumadas: las que se añaden quedan fechadas hoy y las que se borran se llevan sus fechas.
			</Menuda>
			<Menuda y={456}>
				Se escribe en <b>{HOJAS_LEIDAS.length} hojas</b> de las {HOJAS_DEL_LIBRO} del libro. En las demás no se toca nada: lo que ya tengan en el sistema se queda como está.
			</Menuda>
			<Tabla
				y={520}
				altoFila={48}
				altoCabecera={40}
				columnas={[{ t: 'Hoja', ancho: 260 }, { t: 'Entran', ancho: 130, cifra: true }, { t: 'Borran', ancho: 130, cifra: true }, { t: 'Fuera', ancho: 130, cifra: true }, { t: 'Qué queda pendiente', ancho: 470 }]}
				filas={[
					[<span key="h" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16 }}>9B Matemáticas</span>, NUEVAS_9B, BORRADAS_9B, 0, <Pildora key="p" tono="aviso" tam={14}>1 sin pasar</Pildora>],
					[<span key="h" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 16 }}>9A Matemáticas</span>, c.entran - NUEVAS_9B, 0, c.fuera, <Pildora key="p" tono="bien" tam={14}>quedará completa</Pildora>],
				]}
			/>
			<Menuda y={668}>
				<span style={{ color: TEXTO }}>▸ Ver las {HOJAS_EN_CERO} hojas donde no se escribe nada</span>
			</Menuda>
			<En y={704}>
				<Alerta tono="info" tam={16} titulo="Se puede parar a medias sin perder nada" texto="Si el servidor se corta, vuelva a subir el mismo archivo y continúa por donde iba. No se repite ninguna nota." />
			</En>
			{e.resumen.planDeAntes && (
				<div style={{ position: 'absolute', left: S.lados, top: 800, width: S.ancho, height: 60, display: 'flex', alignItems: 'center', gap: 14 }}>
					<div style={{ flex: 1, fontSize: 16, lineHeight: 1.4, color: PALETA.textoSuave }}>
						<b style={{ color: TEXTO }}>{e.resumen.decisiones} {e.resumen.decisiones === 1 ? 'decisión tomada' : 'decisiones tomadas'}.</b> El plan de arriba todavía es el de antes de corregir: vuelva a leer el archivo para ver qué cambia.
					</div>
					<BotonAnt primario apagado={e.resumen.releyendo} encima={e.encima === 'volver-a-leer'} ancho={340}>Volver a leer con estas correcciones</BotonAnt>
				</div>
			)}
		</>
	);
};

const IconoOtraVez: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M20 12a8 8 0 1 1-2.3-5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** El estado de partida: el libro sin elegir, y todas las decisiones por defecto. */
export function estadoInicial(): EstadoSubir {
	return {
		fase: 'soltar',
		progreso: 0,
		paso: 'archivo',
		pasoDesde: 0,
		hasta: 0,
		encima: null,
		reserva: { decision: null, lista: false, encimaOpcion: null, nombre: '', tecleando: false },
		choques: { modo: 'sistema', aMano: false, lista: false },
		ausencias: { anadir: true, borrar: false },
		resumen: { cuentas: cuentas(false, 0), planDeAntes: false, decisiones: 0, releyendo: false },
		importando: null,
		importado: false,
		scroll: 0,
	};
}
