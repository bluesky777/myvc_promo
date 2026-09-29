import { escrito } from '../../comunes/movimiento';
import { Paso } from '../tiempos';
import { EstadoEditor, EstadoRubricas, alertasDe } from './Rubricas';
import {
	NIVELES, NUEVA, PG, TALLER, alFotograma, centro, datosDeLista, planoEditor, rectAlerta, rectBotonNueva,
	rectCabeceraNiveles, rectCelda, rectColumnaPesos, rectCriterio, rectFilaLista, rectGuardar, rectMando, rectNombre,
	rectPeso, rectVolver, Rect,
} from './datos';
import { CORRECCION, GUARDADA, POR_LETRA, POR_LETRA_DESCRIPTOR, SALEN_LOS_NIVELES, T } from './tiempo';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA EN CADA FOTOGRAMA (local, desde que se monta). Es una función y no un montón de
 * condiciones en el dibujo para que el foco y el puntero puedan preguntar «¿dónde está el botón
 * Guardar en el fotograma 1026?» con la misma cuenta con la que se pinta.
 */

const tecleado = (f: number, texto: string, desde: number, porLetra = POR_LETRA) => escrito(f, texto, desde, porLetra);

/** Las teclas de un número que reemplaza al que había: «0» -> «3», «30». */
function numero(f: number, antes: string, valor: string, desde: number): string {
	if (f < desde) { return antes; }
	const n = Math.min(valor.length, Math.floor((f - desde) / 5) + 1);
	return valor.slice(0, n);
}

/** El listado: la nueva aparece en él en cuanto se guarda. Por orden alfabético, como el de app2. */
function listado(f: number) {
	const taller = { nombre: TALLER.nombre, datos: datosDeLista(3, 4, 100, 1) };
	if (f < GUARDADA) { return [taller]; }
	return [{ nombre: NUEVA.nombre, datos: datosDeLista(3, 4, 100, 0) }, taller];
}

function editorNuevo(f: number): EstadoEditor {
	const filas = [0, 1, 2]
		.filter((i) => i === 0 || f >= T.pulsaMasCriterio[i - 1])
		.map((i) => {
			const c = NUEVA.criterios[i];
			let peso = numero(f, '0', c.peso, T.tecleaPeso[i]);
			if (i === 2 && f >= T.corrige) {
				peso = CORRECCION[Math.min(CORRECCION.length - 1, Math.floor((f - T.corrige) / 5))];
			}
			return {
				definicion: tecleado(f, c.definicion, T.tecleaDef[i]),
				peso,
				focoDef: f >= T.pulsaDef[i] && f < T.pulsaPeso[i],
				focoPeso: (f >= T.pulsaPeso[i] && f < (i < 2 ? T.pulsaMasCriterio[i] : T.pulsaCorrige - 20)) || (i === 2 && f >= T.pulsaCorrige && f < T.pulsaCelda[0]),
			};
		});

	const columnas = f >= SALEN_LOS_NIVELES ? NIVELES : [];
	const celdas = filas.map((_, i) => columnas.map((__, j) => {
		if (i !== 0 || j > 1) { return ''; }
		return tecleado(f, NUEVA.descriptores[j], T.tecleaCelda[j], POR_LETRA_DESCRIPTOR);
	}));
	const celdaFoco: [number, number] | null = f >= T.pulsaCelda[0] && f < T.pulsaCelda[1]
		? [0, 0]
		: f >= T.pulsaCelda[1] && f < T.llegaGuardar ? [0, 1] : null;

	const encima = f >= T.llegaSembrar - 4 && f < T.pulsaSembrar + 10
		? 'sembrar' as const
		: T.pulsaMasCriterio.some((p) => f >= p - 12 && f < p + 8)
			? 'criterio' as const
			: f >= T.llegaGuardar - 4 && f < T.pulsaGuardar + 10
				? 'guardar' as const
				: f >= T.pulsaVolver - 12 && f < T.pulsaVolver + 4 ? 'volver' as const : null;

	return {
		nombre: tecleado(f, NUEVA.nombre, T.tecleaNombre),
		nombreFoco: f >= T.pulsaNombre && f < T.llegaSembrar - 20,
		columnas,
		filas,
		celdas,
		celdaFoco,
		enUso: false,
		conId: f >= GUARDADA,
		hayCambios: f >= T.tecleaNombre && f < GUARDADA,
		encima,
	};
}

export function editorTaller(f: number, llegaEnlace = T.llegaEnlace): EstadoEditor {
	return {
		nombre: TALLER.nombre,
		columnas: NIVELES,
		filas: TALLER.criterios.map((c) => ({ definicion: c.definicion, peso: String(c.peso) })),
		celdas: TALLER.criterios.map((c) => c.descriptores),
		enUso: true,
		conId: true,
		hayCambios: false,
		encima: f >= llegaEnlace - 4 ? 'enlace' : null,
	};
}

export function estadoEn(f: number): EstadoRubricas {
	if (f < T.pulsaNueva) {
		return { vista: 'listado', listado: listado(f), nuevaEncima: f >= T.llegaNueva - 4 };
	}
	if (f < T.pulsaVolver) {
		return { vista: 'editor', listado: listado(f), editor: editorNuevo(f) };
	}
	if (f < T.pulsaTaller) {
		return { vista: 'listado', listado: listado(f), filaEncima: f >= T.llegaTaller - 4 ? 1 : null };
	}
	return { vista: 'editor', listado: listado(f), editor: editorTaller(f) };
}

/* ── Dónde está cada cosa en un fotograma, en coordenadas del panel ────────────────────────── */

export function planoEn(f: number) {
	const e = estadoEn(f);
	if (!e.editor) { return null; }
	return { e: e.editor, p: planoEditor(alertasDe(e.editor), e.editor.filas.length) };
}

function enEditor(f: number, que: (p: ReturnType<typeof planoEditor>, e: EstadoEditor) => Rect): Rect {
	const x = planoEn(f);
	if (!x) { throw new Error(`Guion: en el fotograma ${f} no se ve el editor.`); }
	return que(x.p, x.e);
}

const holgado = (r: Rect, h = 6): Rect => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

/* Los focos, en el fotograma, calculados sobre el estado del fotograma en que se encienden. */
export const FOCOS: Record<string, Paso['foco']> = {
	nueva: alFotograma(holgado(rectBotonNueva())),
	nombre: alFotograma(holgado(enEditor(T.pulsaNombre, (p) => rectNombre(p.ficha)))),
	sembrar: alFotograma(holgado(enEditor(T.llegaSembrar, (p) => rectMando(p.mandos, 'sembrar')))),
	niveles: alFotograma(holgado(enEditor(SALEN_LOS_NIVELES + 20, (p) => rectCabeceraNiveles(p.matriz, 4)), 4)),
	avisoPesos: alFotograma(holgado(enEditor(T.tecleaPeso[2] + 10, (p) => rectAlerta(p.alertas.pesos!)), 4)),
	pesos: alFotograma(holgado(enEditor(T.corrige + 30, (p, e) => rectColumnaPesos(p.matriz, e.filas.length)), 4)),
	fila1: alFotograma(holgado(enEditor(T.pulsaCelda[0], (p) => {
		const a = rectCriterio(p.matriz, 0);
		return { ...a, ancho: PG.ancho - PG.relleno * 2 };
	}), 3)),
	filaTaller: alFotograma(holgado(rectFilaLista(1), 4)),
	enUso: alFotograma(holgado(enEditor(T.pulsaTaller + 20, (p) => rectAlerta(p.alertas.enUso!)), 4)),
};

/* ── El puntero, en coordenadas del panel ─────────────────────────────────────────────────── */

const c = centro;

export function puntosDelPuntero() {
	const nombre = enEditor(T.pulsaNombre, (p) => rectNombre(p.ficha));
	const sembrar = enEditor(T.llegaSembrar, (p) => rectMando(p.mandos, 'sembrar'));
	const def = (i: number) => enEditor(T.pulsaDef[i], (p) => rectCriterio(p.matriz, i));
	const peso = (i: number, f = T.pulsaPeso[i]) => enEditor(f, (p) => rectPeso(p.matriz, i));
	const mas = (i: number) => enEditor(T.pulsaMasCriterio[i] - 1, (p) => rectMando(p.mandos, 'criterio'));
	const celda = (j: number) => enEditor(T.pulsaCelda[j], (p) => rectCelda(p.matriz, 0, j));
	const guardar = enEditor(T.llegaGuardar, (p) => rectGuardar(p.guardar));
	const volver = enEditor(T.pulsaVolver - 1, (p) => rectVolver(p.volver));
	const enUso = enEditor(T.pulsaTaller + 20, (p) => rectAlerta(p.alertas.enUso!));
	/* El enlace «Taller» va en el segundo renglón del aviso, detrás de «La usan 1 indicador: ». */
	const enlace = { x: enUso.x + 44 + 205, y: enUso.y + 14 + 26 + 4 + 14 };
	const aparte = (r: Rect) => ({ x: r.x + r.ancho / 2 + 60, y: r.y + r.alto + 50 });
	const izq = (r: Rect, dx = 60) => ({ x: r.x + dx, y: r.y + r.alto / 2 });
	/* A la derecha del campo, para no tapar el número ni la suma de debajo. */
	const derecha = (r: Rect) => ({ x: r.x + r.ancho + 60, y: r.y + r.alto / 2 + 6 });

	return [
		{ frame: T.cursorEntra, x: PG.ancho - 200, y: 600 },
		{ frame: T.llegaNueva, ...c(rectBotonNueva()) },
		{ frame: T.pulsaNueva + 20, ...c(rectBotonNueva()) },
		{ frame: T.pulsaNombre - 6, ...izq(nombre) },
		{ frame: T.pulsaNombre + 10, ...izq(nombre) },
		{ frame: T.tecleaNombre + 10, ...aparte(nombre) },
		{ frame: T.llegaSembrar - 50, ...aparte(nombre) },
		{ frame: T.llegaSembrar, ...c(sembrar) },
		{ frame: T.pulsaSembrar + 20, ...c(sembrar) },
		{ frame: T.pulsaDef[0] - 40, ...c(sembrar) },
		...[0, 1, 2].flatMap((i) => [
			{ frame: T.pulsaDef[i] - 6, ...izq(def(i)) },
			{ frame: T.pulsaDef[i] + 10, ...izq(def(i)) },
			{ frame: T.pulsaPeso[i] - 6, ...c(peso(i)) },
			{ frame: T.pulsaPeso[i] + 12, ...c(peso(i)) },
			{ frame: T.tecleaPeso[i] + 16, ...derecha(peso(i)) },
			...(i < 2 ? [{ frame: T.pulsaMasCriterio[i] - 6, ...c(mas(i)) }, { frame: T.pulsaMasCriterio[i] + 8, ...c(mas(i)) }] : []),
		]),
		{ frame: T.pulsaCorrige - 40, ...derecha(peso(2)) },
		{ frame: T.pulsaCorrige - 6, ...c(peso(2, T.pulsaCorrige)) },
		{ frame: T.pulsaCorrige + 10, ...c(peso(2, T.pulsaCorrige)) },
		{ frame: T.corrige + 26, ...derecha(peso(2, T.corrige + 26)) },
		{ frame: T.pulsaCelda[0] - 6, ...c(celda(0)) },
		{ frame: T.tecleaCelda[0] + 10, ...aparte(celda(0)) },
		{ frame: T.pulsaCelda[1] - 20, ...aparte(celda(0)) },
		{ frame: T.pulsaCelda[1] - 6, ...c(celda(1)) },
		{ frame: T.tecleaCelda[1] + 10, ...aparte(celda(1)) },
		{ frame: T.llegaGuardar - 40, ...aparte(celda(1)) },
		{ frame: T.llegaGuardar, ...c(guardar) },
		{ frame: T.pulsaGuardar + 30, ...c(guardar) },
		{ frame: T.pulsaVolver - 8, ...c(volver) },
		{ frame: T.pulsaVolver + 10, ...c(volver) },
		{ frame: T.llegaTaller, ...c(rectFilaLista(1)) },
		{ frame: T.pulsaTaller + 12, ...c(rectFilaLista(1)) },
		{ frame: T.llegaEnlace - 60, ...c(rectFilaLista(1)) },
		{ frame: T.llegaEnlace, ...enlace },
	];
}

export const CLICS = [
	T.pulsaNueva, T.pulsaNombre, T.pulsaSembrar, ...T.pulsaDef, ...T.pulsaPeso, ...T.pulsaMasCriterio, T.pulsaCorrige,
	...T.pulsaCelda, T.pulsaGuardar, T.pulsaVolver, T.pulsaTaller,
].sort((a, b) => a - b);

