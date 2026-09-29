import { ALTO_CONTROL } from '../montar-el-ano/ant';
import { ALTO_CABECERA, MAIN, anchoDeBoton, anchoDeTexto, enCascara, type Rect } from '../secretaria/piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «NUEVO ALUMNO» (`/alumnos/nuevo`, `paginas/alumnos-nuevo`), EN NÚMEROS.
 *
 * El formulario es un `<form>` sin `nzLayout`: cada `nz-form-item` es una fila con la etiqueta y sus
 * dos puntos a la izquierda y el control a lo ancho, 32 de alto y 24 de margen. Ninguna etiqueta
 * lleva asterisco (`alumnos-nuevo.html`: no hay `nzRequired`). La tarjeta del duplicado va entre
 * «Nombres» y «Apellidos» (html:29-35), y el pie con «Cerrar» y «Crear» fuera de las pestañas.
 */

export const LETRA_FORM = 15;
export const ITEM = ALTO_CONTROL + 24;
export const HUECO = 16;

/** Pestañas: la barra (46) y su margen (16). */
export const PESTANAS_Y = ALTO_CABECERA + HUECO;
export const LEYENDA_BASICA = PESTANAS_Y + 46 + HUECO;

/** La tarjeta del duplicado, según frene o no (`aviso-duplicados.ts`). */
export const ALTO_TARJETA = (frena: boolean) => (frena ? 186 : 149);

export const CAMPOS_BASICA = ['nombres', 'apellidos', 'sexo', 'celular', 'matricula', 'marcas', 'documento', 'tipo'] as const;
export type CampoBasica = (typeof CAMPOS_BASICA)[number];

export const ETIQUETAS: Record<CampoBasica, string | null> = {
	nombres: 'Nombres',
	apellidos: 'Apellidos',
	sexo: 'Sexo',
	celular: 'Celular',
	matricula: '# Matrícula',
	marcas: null,
	documento: 'Documento',
	tipo: 'Tipo de documento',
};

export interface DisposicionNuevo {
	campo: Record<CampoBasica, number>;
	tarjeta: number | null;
	tarjetaAlto: number;
	leyendaProceso: number;
	radios: number;
	grupo: number;
	masDatos: number;
	pie: number;
	fin: number;
}

/** `tarjeta`: null si no hay candidatos; si no, si frena. */
export function disposicionNuevo(tarjeta: boolean | null): DisposicionNuevo {
	let y = LEYENDA_BASICA + 22 + 8;
	const campo = {} as Record<CampoBasica, number>;
	let tarjetaY: number | null = null;
	const alto = tarjeta === null ? 0 : ALTO_TARJETA(tarjeta);
	for (const c of CAMPOS_BASICA) {
		campo[c] = y;
		y += ITEM;
		if (c === 'nombres' && tarjeta !== null) {
			tarjetaY = y;
			y += alto + HUECO;
		}
	}
	/* Fin del fieldset «Básica» y su margen de 1,5rem. */
	const leyendaProceso = y + 24;
	const radios = leyendaProceso + 22 + 8;
	const grupo = radios + ALTO_CONTROL + HUECO;
	const masDatos = grupo + ITEM + 24;
	const pie = masDatos + ALTO_CONTROL + HUECO;
	return { campo, tarjeta: tarjetaY, tarjetaAlto: alto, leyendaProceso, radios, grupo, masDatos, pie, fin: pie + ALTO_CONTROL };
}

/** Donde empieza el control de un campo: después de la etiqueta, sus dos puntos y 8 de aire. */
export const xDelControl = (etiqueta: string) => anchoDeTexto(`${etiqueta}:`, LETRA_FORM) + 12;

export function rectCampo(d: DisposicionNuevo, c: CampoBasica, desplazada = 0): Rect {
	const etq = ETIQUETAS[c] ?? '';
	const x = etq ? xDelControl(etq) : 0;
	return enCascara({ x, y: d.campo[c], ancho: MAIN.ancho - x, alto: ALTO_CONTROL }, desplazada);
}

/* ── La tarjeta del duplicado ─────────────────────────────────────────────────────────────── */

export const TARJETA = {
	relleno: { v: 14, h: 16 },
	titulo: 24,
	/** La ficha del candidato: 86 de alto, con sus dos botones pequeños a la derecha. */
	ficha: 86,
};

export const BOTON_VER_FICHA = anchoDeBoton('Ver su ficha', false, true);
export const BOTON_ES_ESTE = anchoDeBoton('Es éste', false, true);
export const BOTON_ESCAPE = anchoDeBoton('No es ninguno de éstos, crear uno nuevo', false, true);

export function rectTarjeta(d: DisposicionNuevo, desplazada = 0): Rect {
	return enCascara({ x: 0, y: d.tarjeta!, ancho: MAIN.ancho, alto: d.tarjetaAlto }, desplazada);
}

const yFicha = (d: DisposicionNuevo) => d.tarjeta! + TARJETA.relleno.v + TARJETA.titulo + 11;

/** Los dos botones de la ficha del candidato: 0 «Ver su ficha», 1 «Es éste». */
export function rectBotonFicha(d: DisposicionNuevo, cual: 0 | 1, desplazada = 0): Rect {
	const derecha = MAIN.ancho - TARJETA.relleno.h - 12;
	const x = cual === 1 ? derecha - BOTON_ES_ESTE : derecha - BOTON_ES_ESTE - 6 - BOTON_VER_FICHA;
	return enCascara({ x, y: yFicha(d) + (TARJETA.ficha - 26) / 2, ancho: cual === 1 ? BOTON_ES_ESTE : BOTON_VER_FICHA, alto: 26 }, desplazada);
}

export function rectEscape(d: DisposicionNuevo, desplazada = 0): Rect {
	return enCascara({ x: TARJETA.relleno.h, y: yFicha(d) + TARJETA.ficha + 11, ancho: BOTON_ESCAPE, alto: 26 }, desplazada);
}

/* ── Qué se va a hacer con él, el grupo y el pie ──────────────────────────────────────────── */

export const RADIOS = ['Matricular 2026', 'Prematric 2027', 'Formulario 2027', 'Matricular 2027'];
export const anchoDeRadio = (t: string) => anchoDeTexto(t) + 30;
export const ANCHO_GRUPO = 320;

export function rectProceso(d: DisposicionNuevo, desplazada = 0): Rect {
	const x = xDelControl('Grupo de 2026');
	return enCascara({ x: 0, y: d.leyendaProceso, ancho: x + ANCHO_GRUPO, alto: d.grupo + ALTO_CONTROL - d.leyendaProceso }, desplazada);
}

export function rectGrupo(d: DisposicionNuevo, desplazada = 0): Rect {
	return enCascara({ x: xDelControl('Grupo de 2026'), y: d.grupo, ancho: ANCHO_GRUPO, alto: ALTO_CONTROL }, desplazada);
}

export const BOTON_CERRAR = anchoDeBoton('Cerrar');
export const BOTON_CREAR = 76;

export function rectCrear(d: DisposicionNuevo, desplazada = 0): Rect {
	return enCascara({ x: MAIN.ancho - BOTON_CREAR, y: d.pie, ancho: BOTON_CREAR, alto: ALTO_CONTROL }, desplazada);
}

export function rectPie(d: DisposicionNuevo, desplazada = 0): Rect {
	return enCascara({ x: MAIN.ancho - BOTON_CREAR - 8 - BOTON_CERRAR, y: d.pie, ancho: BOTON_CREAR + 8 + BOTON_CERRAR, alto: ALTO_CONTROL }, desplazada);
}

/** Cuánto se puede bajar la página: lo que mide menos lo que cabe entre el panel y el pie de la cáscara. */
export const VISIBLE = 900 - MAIN.y - 16 - 24;
export const maxDesplazada = (d: DisposicionNuevo) => Math.max(0, d.fin - VISIBLE);
