import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { MEDIDAS } from '../medidas';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, entradaDelMenu, focoDelMenu, puntoDelMenu } from '../el-ano/Aplicacion';
import { enElFotograma } from '../encuadre';
import { HASTA_LA_IH, rectColumnasGrupos, type EstadoGrupos } from '../montar-el-ano/planoGrupos';
import { finDelTecleo } from '../montar-el-ano/tiempo';
import { GRUPOS } from '../montar-el-ano/reparto';
import { CON_GRADOS_Y, CON_GRUPOS, GRADOS, NUEVO, TEXTOS, celdasGrados, rectBotonFicha, rectCampo, rectCrearGrado, rectOpcionNivel, rejillaNiveles } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «NIVELES, GRADOS Y GRUPOS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     La cadena es estricta, y la IH del grupo es contra lo que cuadran las asignaturas.
 *
 * La cadena, con lo que la aplicación hace de verdad: Niveles no tiene alta ni baja (sólo se
 * renombra en la rejilla, `niveles.html`); el grado no se crea sin nivel («Elige el nivel
 * educativo: el grado no se puede crear sin él», `grados.ts:178-181`, aviso de error de 6 s); y el
 * servidor no deja borrar un grado del que cuelgan grupos (`GradosController.php:129`,
 * `CatalogoEnUso`). Lo último sólo se dice, sin pulsar: el aviso de ese error es el de
 * `confirmar-borrado.ts`, con acción «Cerrar», y su forma no está dibujada en ningún vídeo.
 *
 * Grupos ya tiene sus dos vídeos: aquí sólo se enseña que el grupo lleva su grado y su IH.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA CADENA   Referencias: Niveles, Grados, Grupos. Niveles: sólo se renombran
 *     2. GRADOS      cada uno con su nivel; «Crear grado» sin nivel no deja; con nivel, sí
 *     3. BORRAR      un grado con grupos no se borra
 *     4. GRUPOS      el grado y la IH semanal: contra ella cuadran las asignaturas
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaReferencias: 34,
	pulsaReferencias: 40,
	abreReferencias: 42,
	llegaEntrada: 66,
	pulsaEntrada: 74,
	monta: 78,

	llegaGrados: 362,
	pulsaGrados: 368,
	seVaNiveles: 370,
	montaGrados: 382,

	llegaCrearGrado: 470,
	pulsaCrearGrado: 478,
	abreFicha: 480,
	llegaNombre: 500,
	pulsaNombre: 506,
	tecleaNombre: 512,
	llegaCrear: 578,
	pulsaCrear: 586,
	/** El `if` de `grados.ts` corta antes de pedir nada: el aviso sale en el acto. */
	sinNivel: 588,
	llegaNivel: 636,
	pulsaNivel: 644,
	llegaOpcion: 662,
	pulsaOpcion: 670,
	llegaCrear2: 700,
	pulsaCrear2: 708,
	/** `postStore` vuelve: «Grado Aceleración creado», la ficha se cierra. */
	creado: 720,

	llegaGrupos: 884,
	pulsaGrupos: 892,
	seVaGrados: 894,
	montaGrupos: 906,
	cursorSale: 980,
};

export const FIN_NOMBRE = finDelTecleo(NUEVO.nombre, T.tecleaNombre);

export const ESTADO_GRUPOS: EstadoGrupos = {
	ficha: null,
	juntos: { forma: 'vacio' },
	filas: GRUPOS.map((g) => ({ nombre: g.nombre, juntos: '' })),
	desplazada: 0,
	desplazadaRejilla: HASTA_LA_IH,
};

const f = (r: { x: number; y: number; ancho: number; alto: number }, margen = 6, radio = 10) => alFotograma(r, margen, radio);

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu('Referencias'),
	niveles: puntoDelMenu('Referencias', 'Niveles'),
	grados: puntoDelMenu('Referencias', 'Grados'),
	grupos: puntoDelMenu('Referencias', 'Grupos'),
	crearGrado: centro(rectCrearGrado()),
	nombre: centro(rectCampo('nombre')),
	crear: centro(rectBotonFicha('crear')),
	nivel: centro(rectCampo('nivel')),
	opcion: centro(rectOpcionNivel(1)),
};

/** Las tres entradas del menú, juntas. */
const cadena = (() => {
	const a = entradaDelMenu('Referencias', 'Niveles').rect(true);
	const c = entradaDelMenu('Referencias', 'Grupos').rect(true);
	return enElFotograma({ x: a.x, y: a.y, ancho: a.ancho, alto: c.y + c.alto - a.y });
})();

export const FOCOS = {
	referencias: focoDelMenu('Referencias'),
	cadena: { ...cadena, radio: 8 },
	niveles: f(rejillaNiveles(), 4, 10),
	nivelDelGrado: f(celdasGrados(0, 0, 'nivel', 'nivel', 9), 2, 8),
	crearGrado: f(rectCrearGrado(), 6, 8),
	ficha: f({ x: rectCampo('nombre').x - 10, y: rectCampo('nombre').y - 40, ancho: rectCampo('nivel').x + rectCampo('nivel').ancho - rectCampo('nombre').x + 20, alto: 130 }, 4, 10),
	fichaYLista: f({ x: rectCampo('nombre').x - 10, y: rectCampo('nombre').y - 40, ancho: rectCampo('nivel').x + rectCampo('nivel').ancho - rectCampo('nombre').x + 20, alto: 200 }, 4, 10),
	borrar: f(celdasGrados(0, CON_GRUPOS, 'quitar', 'nombre'), 2, 8),
	grupos: f(rectColumnasGrupos(ESTADO_GRUPOS, 'grado', 'ih'), 2, 8),
	ih: f(rectColumnasGrupos(ESTADO_GRUPOS, 'ih'), 2, 8),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const EN_NIVELES = { ubicacion: 'Menú ▸ Referencias ▸ Niveles', url: '/niveles' };
const EN_GRADOS = { ubicacion: 'Menú ▸ Referencias ▸ Grados', url: '/grados' };
const EN_GRUPOS = { ubicacion: 'Menú ▸ Referencias ▸ Grupos', url: '/grupos' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está todo en Referencias.', ...EN_EL_MENU, foco: FOCOS.referencias, focoHasta: T.pulsaReferencias + 20 },
	{ desde: 98, texto: 'Cada grupo cuelga de un grado, y cada grado de un nivel.', ...EN_NIVELES, foco: FOCOS.cadena },
	{ desde: 226, texto: 'Los niveles no se crean ni se borran: sólo se renombran.', ...EN_NIVELES, foco: FOCOS.niveles, focoHasta: 356 },
	{ desde: T.montaGrados + 4, texto: 'En Grados, cada fila dice su nivel.', ...EN_GRADOS, foco: FOCOS.nivelDelGrado, focoHasta: 466 },
	{ desde: 495, texto: 'La ficha pide nombre y nivel.', ...EN_GRADOS, foco: FOCOS.ficha },
	{ desde: 586, texto: 'Sin nivel, avisa y no lo crea.', ...EN_GRADOS, foco: FOCOS.ficha },
	{ desde: 688, texto: 'Con el nivel elegido, se crea.', ...EN_GRADOS, foco: FOCOS.fichaYLista, focoHasta: T.creado - 4 },
	{ desde: 790, texto: 'Un grado con grupos no se deja borrar.', ...EN_GRADOS, foco: FOCOS.borrar, focoHasta: T.pulsaGrupos - 2 },
	{ desde: T.montaGrupos + 4, texto: 'Cada grupo lleva su grado y su IH semanal.', voz: 'Cada grupo lleva su grado y su intensidad horaria.', ...EN_GRUPOS, foco: FOCOS.grupos },
	{ desde: 1040, texto: 'Contra esa IH cuadran sus asignaturas.', voz: 'Contra ella cuadran sus asignaturas.', ...EN_GRUPOS, foco: FOCOS.ih },
];

export const AVISO_SIN_NIVEL = { desde: T.sinNivel, dura: 100, texto: TEXTOS.sinNivel };
export const AVISO_CREADO = { desde: T.creado, dura: 60, texto: TEXTOS.creado };

export const TARJETA = 1150;
export const DURACION = TARJETA + 110;

export const CLAVE = 'niveles-grados';
export const TITULO = 'Niveles, grados y grupos';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'La cadena: niveles, grados, grupos' },
	{ desde: T.montaGrados + 4, titulo: 'Grados: cada uno con su nivel' },
	{ desde: 790, titulo: 'Lo que no se deja borrar' },
	{ desde: T.montaGrupos + 4, titulo: 'Grupos: grado e IH semanal' },
];

export const CIERRE: Cierre = {
	hiciste: 'Recorriste la cadena y creaste el grado Aceleración, de Básica primaria.',
	seVe: 'El aviso «Grado Aceleración creado»; sin nivel, el aviso rojo y nada creado.',
	despues: 'Siguiente: áreas, materias y directores.',
	voz: 'Siguiente: áreas y materias.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (FIN_NOMBRE >= T.llegaCrear) { throw new Error('Guion: el nombre no termina de teclearse antes de pulsar Crear.'); }
if (T.pulsaCrear < PASOS[5].desde) { throw new Error('Guion: se pulsa Crear sin nivel antes del paso que lo cuenta.'); }
if (T.creado < PASOS[6].desde || T.creado >= PASOS[7].desde) { throw new Error('Guion: el grado no se crea dentro de su paso.'); }
if (T.montaGrupos + 10 > PASOS[8].desde + 60) { throw new Error('Guion: Grupos se monta tarde para su paso.'); }
if (CON_GRADOS_Y >= 9) { throw new Error('Guion: el grado señalado para borrar no se ve en la rejilla.'); }
void GRADOS;
void MEDIDAS;
