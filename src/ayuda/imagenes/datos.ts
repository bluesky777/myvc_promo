import type { Rect } from '../el-ano/Aplicacion';
import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CONFIGURACIÓN ▸ IMÁGENES» (`/imagenes/*`): LO QUE SE VE Y DÓNDE CAE.
 *
 * LO QUE ES DE LA APLICACIÓN (`imagenes.html`, `galeria.html`, `asignar-alumnos.html`,
 * `firmas-docentes.html`, `comunes/visor-imagenes`): las cuatro pestañas, los tres paneles de subir,
 * el «Álbum» con su conmutador, las tarjetas con sus botones redondos, el visor a pantalla completa
 * con «Girar», «Mi perfil», «Mi foto oficial» (y su globo), «Logo del colegio» y «Eliminar», la
 * pantalla de asignar con «Tus imágenes», el diálogo «Foto oficial de …», «Foto asignada a …», y el
 * aviso de firmas.
 *
 * LO INVENTADO, Y DIBUJADO: TODAS las fotos son el avatar dibujado de `comunes/Avatar.tsx` sobre un
 * fondo de color; las firmas son trazos SVG hechos aquí. Ni una imagen de verdad: esto va a YouTube.
 * Los alumnos y sus nombres son inventados; los docentes, los de `montar-el-ano/reparto.ts`.
 */

export interface Foto { tipo: 'mujer' | 'hombre'; variante: number; fondo: string }

/** Mis imágenes: la primera es la del propio usuario (la cara de la barra: hombre, variante 2). */
export const MIS_IMAGENES: Foto[] = [
	{ tipo: 'hombre', variante: 2, fondo: '#dbe8f7' },
	{ tipo: 'mujer', variante: 4, fondo: '#f3e1d6' },
	{ tipo: 'hombre', variante: 5, fondo: '#e2f0e0' },
	{ tipo: 'mujer', variante: 1, fondo: '#efe3f3' },
	{ tipo: 'hombre', variante: 0, fondo: '#f6ecd2' },
	{ tipo: 'mujer', variante: 3, fondo: '#dff0f0' },
];
export const PUBLICAS = 4;

/** En «Tus imágenes» (Asignar) salen las privadas; la que se asigna es la de la alumna. */
export const LA_DE_LA_ALUMNA = 5;

export interface Alumno { nombre: string; foto: Foto | null }
export const GRUPO = { nombre: '9°B', titular: 'Ana María Herrera Lugo' };
export const ALUMNOS: Alumno[] = [
	{ nombre: 'Sara Isabel Acosta Rivera', foto: { tipo: 'mujer', variante: 2, fondo: '#e8e4f5' } },
	{ nombre: 'Juan Pablo Beltrán Gil', foto: { tipo: 'hombre', variante: 1, fondo: '#e0ecf6' } },
	{ nombre: 'Valentina Castaño Mejía', foto: null },
	{ nombre: 'Samuel David Duque Arias', foto: { tipo: 'hombre', variante: 3, fondo: '#e6f1e3' } },
	{ nombre: 'Mariana Echeverri López', foto: null },
	{ nombre: 'Tomás Franco Ríos', foto: { tipo: 'hombre', variante: 4, fondo: '#f4eadb' } },
	{ nombre: 'Isabella Gómez Patiño', foto: { tipo: 'mujer', variante: 5, fondo: '#f5e2e6' } },
	{ nombre: 'Nicolás Henao Vargas', foto: { tipo: 'hombre', variante: 0, fondo: '#e3eef0' } },
];
export const LA_ALUMNA = 2;

export const TEXTOS = {
	titulo: 'Imágenes',
	pestanas: ['Mi galería', 'Asignar a alumnos', 'Fotos docentes', 'Firmas de docentes'],
	fotos: 'Fotos de personas',
	fotosPista: 'Se abre el encuadre antes de subir, para que la cara quede centrada. Quedan privadas.',
	logos: 'Logos y material compartido',
	logosPista: ['Se guardan tal cual, sin recortar, y ', { b: 'las ve todo el personal' }, '.'],
	logo: 'Logo del colegio',
	logoPista: 'Para cambiarlo, abre una imagen y pulsa «Logo del colegio».',
	album: 'Álbum',
	albumPista: 'Pulsa una imagen para verla en grande y usarla.',
	mias: `Mis imágenes (${MIS_IMAGENES.length})`,
	publicas: `Públicas (${PUBLICAS})`,
	globoOficial: 'Se envía como solicitud y la aprueba un administrador',
	tuyas: 'Tus imágenes',
	tuyasPista: 'Arrastra una sobre un alumno, o púlsala y luego pulsa al alumno.',
	sinFoto: 'Sin foto oficial',
	modalTitulo: (n: string) => `Foto oficial de ${n}`,
	modalTexto: 'Se usará en sus boletines y certificados. La imagen saldrá de tu galería, porque pasa a pertenecer a esta persona.',
	asignar: 'Asignar como foto oficial',
	asignada: (n: string) => `Foto asignada a ${n}`,
	firmasAviso: '1 docente todavía sin firma',
	firmasAvisoTexto: 'Sus boletines y certificados saldrán con el renglón en blanco.',
	subirFirma: 'Arrastra aquí una firma escaneada, o',
	subirFirmaPista: 'Se recorta el papel sobrante y se deja el fondo transparente. Verás el antes y el después, y a quién se le asigna, antes de guardar.',
};

export type Trozo = string | { b: string };

/* ── La geometría, en coordenadas del CONTENIDO (a la derecha del menú, bajo la barra) ─────── */

export const L = { lado: 24, arriba: 20, hueco: 16, relleno: 20 };
export const ANCHO = MEDIDAS.ancho - MEDIDAS.menu - L.lado * 2;

export const NAV: Rect = { x: L.lado, y: L.arriba, ancho: ANCHO, alto: 122 };
export const ANCHOS_PESTANA = [140, 186, 162, 190];
export function rectPestana(i: number): Rect {
	const x = NAV.x + L.relleno + ANCHOS_PESTANA.slice(0, i).reduce((n, a) => n + a + 6, 0);
	return { x, y: NAV.y + 66, ancho: ANCHOS_PESTANA[i], alto: 42 };
}

/* Mi galería. */
const Y1 = NAV.y + NAV.alto + L.hueco;
export const ANCHO_TERCIO = (ANCHO - L.hueco * 2) / 3;
export const SUBIR: Rect[] = [0, 1, 2].map((i) => ({ x: L.lado + i * (ANCHO_TERCIO + L.hueco), y: Y1, ancho: ANCHO_TERCIO, alto: 176 }));
export const ALBUM: Rect = { x: L.lado, y: Y1 + 176 + L.hueco, ancho: ANCHO, alto: 560 };
export const TARJETA = { lado: 160, acciones: 34, hueco: 14 };
export function rectTarjeta(i: number): Rect {
	const x = ALBUM.x + L.relleno + i * (TARJETA.lado + TARJETA.hueco);
	return { x, y: ALBUM.y + L.relleno + 58, ancho: TARJETA.lado, alto: TARJETA.lado };
}

/* El visor ocupa la ventana entera (`position: fixed; inset: 0`): coordenadas de la CÁSCARA. */
export const VISOR = { barra: 56, botones: [{ t: 'Girar', a: 84 }, { t: 'Mi perfil', a: 90 }, { t: 'Mi foto oficial', a: 128 }, { t: 'Logo del colegio', a: 140 }, { t: 'Eliminar', a: 88 }] };
export function rectBotonVisor(i: number): Rect {
	const derecha = MEDIDAS.ancho - 16 - 40 - 12;
	const despues = VISOR.botones.slice(i + 1).reduce((n, b) => n + b.a + 4, 0);
	return { x: derecha - despues - VISOR.botones[i].a, y: 12, ancho: VISOR.botones[i].a, alto: 32 };
}
export const rectCerrarVisor = (): Rect => ({ x: MEDIDAS.ancho - 16 - 40, y: 8, ancho: 40, alto: 40 });

/* Asignar a alumnos: la tira de la izquierda y el panel del grupo. */
export const TIRA: Rect = { x: L.lado, y: Y1, ancho: 250, alto: 620 };
export function rectMini(i: number): Rect {
	const lado = 96;
	return { x: TIRA.x + L.relleno + (i % 2) * (lado + 12), y: TIRA.y + 96 + Math.floor(i / 2) * (lado + 12), ancho: lado, alto: lado };
}
export const GRUPO_PANEL: Rect = { x: L.lado + 250 + L.hueco, y: Y1, ancho: ANCHO - 250 - L.hueco, alto: 620 };
export const ALUMNO = { ancho: 196, alto: 212, hueco: 14 };
export function rectAlumno(i: number): Rect {
	const por = 4;
	return {
		x: GRUPO_PANEL.x + L.relleno + (i % por) * (ALUMNO.ancho + ALUMNO.hueco),
		y: GRUPO_PANEL.y + 116 + Math.floor(i / por) * (ALUMNO.alto + ALUMNO.hueco),
		ancho: ALUMNO.ancho,
		alto: ALUMNO.alto,
	};
}

/* El diálogo de confirmar la asignación: coordenadas de la CÁSCARA. */
export const MODAL = { ancho: 520, y: 250, alto: 196 };
export function rectBotonModal(cual: 'si' | 'no'): Rect {
	const x0 = (MEDIDAS.ancho - MODAL.ancho) / 2;
	const derecha = x0 + MODAL.ancho - 24;
	const y = MODAL.y + MODAL.alto - 20 - 32;
	return cual === 'si' ? { x: derecha - 210, y, ancho: 210, alto: 32 } : { x: derecha - 210 - 8 - 100, y, ancho: 100, alto: 32 };
}

/* Firmas de docentes. */
export const FIRMAS_AVISO: Rect = { x: L.lado, y: Y1, ancho: ANCHO, alto: 70 };
export const FIRMAS_SUBIR: Rect = { x: L.lado, y: Y1 + 70 + L.hueco, ancho: ANCHO, alto: 150 };
export const FIRMAS_LISTA: Rect = { x: L.lado, y: Y1 + 70 + L.hueco + 150 + L.hueco, ancho: ANCHO, alto: 520 };
export const FIRMANTES: { docente: 'herrera' | 'ocampo' | 'bernal' | 'zapata' | 'salcedo' | 'pena'; firma: number | null }[] = [
	{ docente: 'bernal', firma: 0 },
	{ docente: 'herrera', firma: 1 },
	{ docente: 'ocampo', firma: 2 },
	{ docente: 'pena', firma: null },
	{ docente: 'salcedo', firma: 3 },
	{ docente: 'zapata', firma: 4 },
];
export const SIN_FIRMA = 3;
export const FILA_FIRMA = 62;
export function rectFirmante(i: number): Rect {
	return { x: FIRMAS_LISTA.x + L.relleno, y: FIRMAS_LISTA.y + 72 + i * FILA_FIRMA, ancho: FIRMAS_LISTA.ancho - L.relleno * 2, alto: FILA_FIRMA };
}

/** De coordenadas del contenido a la cáscara. */
export const enLaCascara = (r: Rect): Rect => ({ x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra, ancho: r.ancho, alto: r.alto });
