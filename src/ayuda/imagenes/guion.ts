import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, focoDelMenu, puntoDelMenu } from '../el-ano/Aplicacion';
import { enElFotograma } from '../encuadre';
import {
	ALBUM, ALUMNOS, FIRMAS_AVISO, LA_ALUMNA, LA_DE_LA_ALUMNA, MODAL, SIN_FIRMA, SUBIR, TEXTOS, enLaCascara, rectAlumno, rectBotonModal,
	rectBotonVisor, rectCerrarVisor, rectFirmante, rectMini, rectPestana, rectTarjeta,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «IMÁGENES: FOTOS Y FIRMAS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     Foto ≠ imagen: una sale en el boletín y la otra es el avatar.
 *
 * Es `paginas/imagenes/tipos.ts:26-36`: la «imagen» (`users.imagen_id`, botón «Mi perfil») es la
 * cara que se ve en la aplicación; la «foto» (`foto_id`, «Mi foto oficial») es la de boletines y
 * certificados, y la propia se pide y la aprueba un administrador (el globo del botón). Y el
 * comentario que hace falta decir en voz alta, `asignar-alumnos.ts:62-63`: «Poner una donde va la
 * otra no da ningún error: simplemente el boletín sale con la cara que no era».
 *
 * TODO LO QUE PARECE UNA FOTO ES EL AVATAR DIBUJADO; las firmas, trazos inventados.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   Configuración -> Imágenes (Mi galería)
 *     2. EL VISOR     «Mi perfil» es la imagen; «Mi foto oficial» es la foto
 *     3. ASIGNAR      la foto oficial de una alumna, desde «Asignar a alumnos»
 *     4. FIRMAS       sin firma, el renglón sale en blanco
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaConfig: 36,
	pulsaConfig: 42,
	abreConfig: 44,
	llegaEntrada: 84,
	pulsaEntrada: 96,
	monta: 100,

	llegaTarjeta: 212,
	pulsaTarjeta: 228,
	visor: 232,
	llegaPerfil: 292,
	llegaOficial: 444,
	globo: 458,
	llegaCerrar: 690,
	pulsaCerrar: 704,
	cierraVisor: 706,
	llegaPestanaAsignar: 724,
	pulsaPestanaAsignar: 738,
	montaAsignar: 742,

	llegaMini: 790,
	pulsaMini: 804,
	llegaAlumno: 830,
	pulsaAlumno: 844,
	modal: 848,
	llegaSi: 960,
	pulsaSi: 976,
	/** El PUT vuelve: «Foto asignada a …», la tarjeta ya tiene foto y la imagen sale de la tira. */
	asignada: 992,

	llegaPestanaFirmas: 1130,
	pulsaPestanaFirmas: 1144,
	montaFirmas: 1148,
	cursorSale: 1290,
};

const cas = enLaCascara;
const NOMBRE = ALUMNOS[LA_ALUMNA].nombre;

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	config: puntoDelMenu('Configuración'),
	imagenes: puntoDelMenu('Configuración', 'Imágenes'),
	tarjeta: centro(cas(rectTarjeta(0))),
	perfil: centro(rectBotonVisor(1)),
	oficial: centro(rectBotonVisor(2)),
	cerrar: centro(rectCerrarVisor()),
	asignar: centro(cas(rectPestana(1))),
	mini: centro(cas(rectMini(LA_DE_LA_ALUMNA))),
	alumno: centro(cas(rectAlumno(LA_ALUMNA))),
	si: centro(rectBotonModal('si')),
	firmas: centro(cas(rectPestana(3))),
};

const f = (r: { x: number; y: number; ancho: number; alto: number }, margen = 6, radio = 10) => alFotograma(r, margen, radio);
/** El visor tapa también la barra: su foco no se recorta a la pantalla de dentro. */
const sinRecortar = (r: { x: number; y: number; ancho: number; alto: number }, margen = 6, radio = 10) => ({
	...enElFotograma({ x: r.x - margen, y: r.y - margen, ancho: r.ancho + margen * 2, alto: r.alto + margen * 2 }),
	radio,
});

export const FOCOS = {
	config: focoDelMenu('Configuración'),
	subir: f(cas(SUBIR[0]), 4, 12),
	album: f(cas({ ...ALBUM, alto: rectTarjeta(0).y + rectTarjeta(0).alto + 40 - ALBUM.y }), 4, 12),
	perfil: { ...enElFotograma(rectBotonVisor(1)), radio: 8, x: enElFotograma(rectBotonVisor(1)).x - 6, y: enElFotograma(rectBotonVisor(1)).y - 6, ancho: enElFotograma(rectBotonVisor(1)).ancho + 12, alto: enElFotograma(rectBotonVisor(1)).alto + 12 },
	oficial: sinRecortar({ x: rectBotonVisor(2).x + rectBotonVisor(2).ancho / 2 - 210, y: rectBotonVisor(2).y, ancho: 420, alto: 92 }, 6, 10),
	botones: sinRecortar({ x: rectBotonVisor(1).x, y: rectBotonVisor(1).y, ancho: rectBotonVisor(2).x + rectBotonVisor(2).ancho - rectBotonVisor(1).x, alto: 32 }, 8, 8),
	pestanaAsignar: f(cas(rectPestana(1)), 4, 6),
	eleccion: f(cas({ x: rectMini(LA_DE_LA_ALUMNA).x, y: rectMini(0).y, ancho: rectAlumno(LA_ALUMNA).x + rectAlumno(LA_ALUMNA).ancho - rectMini(0).x, alto: rectAlumno(LA_ALUMNA).y + rectAlumno(LA_ALUMNA).alto - rectMini(0).y }), 6, 12),
	modal: f({ x: (1440 - MODAL.ancho) / 2, y: MODAL.y, ancho: MODAL.ancho, alto: MODAL.alto }, 4, 10),
	alumno: f(cas(rectAlumno(LA_ALUMNA)), 6, 10),
	pestanaFirmas: f(cas(rectPestana(3)), 4, 6),
	sinFirma: f(cas({ ...FIRMAS_AVISO, alto: rectFirmante(SIN_FIRMA).y + rectFirmante(SIN_FIRMA).alto - FIRMAS_AVISO.y }), 4, 12),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_GALERIA = { ubicacion: 'Menú ▸ Configuración ▸ Imágenes ▸ Mi galería', url: '/imagenes/galeria' };
const EN_ASIGNAR = { ubicacion: 'Menú ▸ Configuración ▸ Imágenes ▸ Asignar a alumnos', url: '/imagenes/asignar' };
const EN_FIRMAS = { ubicacion: 'Menú ▸ Configuración ▸ Imágenes ▸ Firmas de docentes', url: '/imagenes/firmas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Configuración, Imágenes.', ...EN_EL_MENU, foco: FOCOS.config, focoHasta: T.pulsaConfig + 20 },
	{ desde: 124, texto: 'Aquí se suben las fotos; al pulsar una, se abre en grande.', ...EN_GALERIA, foco: FOCOS.album, focoHasta: T.pulsaTarjeta + 2 },
	{ desde: 278, texto: '«Mi perfil» es la imagen: la cara que se ve en la aplicación.', ...EN_GALERIA, foco: FOCOS.perfil },
	{ desde: 428, texto: '«Mi foto oficial» sale en boletines; la aprueba un administrador.', ...EN_GALERIA, foco: FOCOS.oficial },
	{ desde: 590, texto: 'Poner una por otra no da error: el boletín sale con otra cara.', ...EN_GALERIA, foco: FOCOS.botones, focoHasta: T.pulsaCerrar - 4 },
	{ desde: 736, texto: 'En «Asignar a alumnos», se pulsa la imagen y luego al alumno.', ...EN_ASIGNAR, foco: FOCOS.eleccion, focoHasta: T.pulsaAlumno + 2 },
	{ desde: 895, texto: 'Siempre como foto oficial: la de su boletín.', ...EN_ASIGNAR, foco: FOCOS.modal, focoHasta: T.pulsaSi + 4 },
	{ desde: 1018, texto: 'Asignada: ya tiene foto, y la imagen deja la galería.', ...EN_ASIGNAR, foco: FOCOS.alumno, focoHasta: T.pulsaPestanaFirmas - 2 },
	{ desde: T.montaFirmas + 20, texto: 'En Firmas: sin firma, el renglón sale en blanco.', ...EN_FIRMAS, foco: FOCOS.sinFirma },
];

export const AVISO = { desde: T.asignada, dura: 60, texto: TEXTOS.asignada(NOMBRE) };

export const TARJETA = 1312;
export const DURACION = TARJETA + 120;

export const CLAVE = 'imagenes';
export const TITULO = 'Imágenes: fotos y firmas';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Configuración, Imágenes' },
	{ desde: 278, titulo: 'La imagen de perfil y la foto oficial' },
	{ desde: 736, titulo: 'La foto oficial de un alumno' },
	{ desde: T.montaFirmas + 20, titulo: 'Las firmas de los docentes' },
];

export const CIERRE: Cierre = {
	hiciste: 'Distinguiste la imagen de perfil de la foto oficial y le pusiste foto a una alumna.',
	seVe: 'El aviso «Foto asignada a …» y su tarjeta, ya sin «Sin foto oficial».',
	despues: 'Siguiente: el compromiso académico.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.pulsaPestanaAsignar < PASOS[5].desde) { throw new Error('Guion: se cambia de pestaña antes de su paso.'); }
if (T.asignada >= PASOS[7].desde || T.pulsaSi < PASOS[6].desde) { throw new Error('Guion: la asignación no cae en sus pasos.'); }
if (T.pulsaPestanaFirmas < PASOS[7].desde + 100 || T.montaFirmas >= PASOS[8].desde) { throw new Error('Guion: Firmas no cae en su paso.'); }
