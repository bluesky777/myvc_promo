import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { LlegadaA } from '../no-me-deja-escribir/Llegada';
import { EstadoRubricas, PantallaRubricas } from '../rubricas-montar/Rubricas';
import { ENCUADRE as ENCUADRE_R, LA_DE_RUBRICAS, NUEVA, PG as PG_R, TALLER, centro, datosDeLista, rectFilaLista } from '../rubricas-montar/datos';
import { editorTaller } from '../rubricas-montar/estado';
import { EstadoGrupo, PantallaGrupo } from './Grupo';
import { CRITERIOS, ENCUADRE, ESTUDIANTES, MARCAS, PG, TEXTOS, rectGuardar, rectOpcion, rectSelector } from './datos';
import {
	AVISO, BOTON_RUBRICAS, CIERRE, DURA_MARCA, ENLACE, ENTRA, ESCRITAS, LLEGADA, PASOS, T, TARJETA, VUELVE_GUARDAR, inicioDeMarca,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * RÚBRICAS, CALIFICAR: encadena. La llegada por Mis asignaturas, la pantalla de rúbricas de
 * `rubricas-montar` (lista y editor del taller) y, al pulsar el nombre del indicador, la parrilla
 * del grupo. Cada pantalla lleva su propio puntero en sus coordenadas.
 */

export const EscenaRubricasCalificar: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <LlegadaA frame={frame} fps={fps} t={LLEGADA} boton={centro(BOTON_RUBRICAS)} fila={LA_DE_RUBRICAS} />}

			<Sequence from={ENTRA}>
				<Pantallas />
			</Sequence>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<AvisoBajoLaCabecera texto={TEXTOS.toast(ESCRITAS)} desde={AVISO.desde} dura={AVISO.dura} tipo="info" />
			<Efecto cual="aviso" en={AVISO.desde} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/* ── La pantalla de rúbricas, y luego la parrilla ─────────────────────────────────────────── */

function rubricasEn(f: number): EstadoRubricas {
	const listado = [
		{ nombre: NUEVA.nombre, datos: datosDeLista(3, 4, 100, 0) },
		{ nombre: TALLER.nombre, datos: datosDeLista(3, 4, 100, 1) },
	];
	if (f < T.pulsaTaller) { return { vista: 'listado', listado, filaEncima: f >= T.llegaTaller - 4 ? 1 : null }; }
	return { vista: 'editor', listado, editor: editorTaller(f, T.llegaEnlace) };
}

function grupoEn(f: number): EstadoGrupo {
	const marcas: (number | null)[][] = ESTUDIANTES.map(() => CRITERIOS.map(() => null));
	let abierto: EstadoGrupo['abierto'] = null;
	MARCAS.forEach((m, k) => {
		const a = inicioDeMarca(k);
		if (f >= a + DURA_MARCA) { marcas[m.fila][m.criterio] = m.nivel; }
		else if (f >= a) {
			/* La lista abre con «—» resaltado y el ratón baja hasta el nivel a mitad del gesto. */
			abierto = { fila: m.fila, criterio: m.criterio, resaltada: f >= a + 10 ? m.nivel + 1 : 0 };
		}
	});
	return {
		marcas,
		abierto,
		calculadas: f >= VUELVE_GUARDAR,
		hayCambios: f >= inicioDeMarca(0) + DURA_MARCA && f < VUELVE_GUARDAR,
		guardarEncima: f >= T.llegaGuardar - 4 && f < T.pulsaGuardar + 10,
	};
}

const Pantallas: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(f, fps, 0, 14);
	const seVaA = interpolate(f, [T.pulsaEnlace + 4, T.montaGrupo], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const b = interpolate(f, [T.montaGrupo, T.montaGrupo + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill>
			{f < T.montaGrupo && (
				<div style={{ position: 'absolute', left: ENCUADRE_R.x, top: ENCUADRE_R.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE_R.escala * interpolate(a, [0, 1], [0.985, 1])})`, opacity: a * (1 - seVaA) }}>
					<PantallaRubricas estado={rubricasEn(f)} />
					<Cursor
						puntos={[
							{ frame: T.cursorEntra, x: PG_R.ancho - 200, y: 600 },
							{ frame: T.llegaTaller, ...centro(rectFilaLista(1)) },
							{ frame: T.pulsaTaller + 14, ...centro(rectFilaLista(1)) },
							{ frame: T.llegaEnlace, ...ENLACE },
						]}
						clics={[T.pulsaTaller, T.pulsaEnlace]}
						aparece={T.cursorEntra}
						sale={T.pulsaEnlace + 10}
						tam={36}
					/>
				</div>
			)}
			{f >= T.montaGrupo && (
				<div style={{ position: 'absolute', left: ENCUADRE.x, top: ENCUADRE.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE.escala * interpolate(b, [0, 1], [0.985, 1])})`, opacity: b }}>
					<PantallaGrupo e={grupoEn(f)} />
					<Cursor puntos={puntosDelGrupo()} clics={clicsDelGrupo()} aparece={T.cursorGrupo} sale={T.cursorSale} tam={36} />
				</div>
			)}
		</AbsoluteFill>
	);
};

/* ── El puntero de la parrilla, en coordenadas de su panel ────────────────────────────────── */

function puntosDelGrupo() {
	const c = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
	const puntos = [{ frame: T.cursorGrupo, x: PG.ancho - 260, y: 560 }, { frame: inicioDeMarca(0) - 40, x: PG.ancho - 260, y: 560 }];
	MARCAS.forEach((m, k) => {
		const a = inicioDeMarca(k);
		const s = rectSelector(m.fila, m.criterio);
		const o = rectOpcion(m.fila, m.criterio, m.nivel + 1);
		puntos.push({ frame: a - 4, x: s.x + s.ancho - 60, y: c(s).y });
		puntos.push({ frame: a + 12, x: o.x + o.ancho - 60, y: c(o).y });
		puntos.push({ frame: a + DURA_MARCA + 2, x: o.x + o.ancho - 60, y: c(o).y });
	});
	const g = rectGuardar();
	const ultima = rectSelector(MARCAS[MARCAS.length - 1].fila, MARCAS[MARCAS.length - 1].criterio);
	puntos.push({ frame: inicioDeMarca(MARCAS.length - 1) + 60, x: ultima.x + ultima.ancho + 80, y: ultima.y + 140 });
	puntos.push({ frame: T.llegaGuardar - 60, x: ultima.x + ultima.ancho + 80, y: ultima.y + 140 });
	puntos.push({ frame: T.llegaGuardar, ...c(g) });
	puntos.push({ frame: T.pulsaGuardar + 20, ...c(g) });
	puntos.push({ frame: T.cursorSale, x: g.x + g.ancho + 260, y: g.y + 30 });
	return puntos;
}

function clicsDelGrupo() {
	return [...MARCAS.flatMap((_, k) => [inicioDeMarca(k), inicioDeMarca(k) + DURA_MARCA]), T.pulsaGuardar];
}
