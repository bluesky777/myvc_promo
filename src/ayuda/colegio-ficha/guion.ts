import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { MEDIDAS } from '../medidas';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, focoDelMenu, puntoDelMenu, type Rect } from '../el-ano/Aplicacion';
import { ANCHO_PANEL, CG, P_CERTIFICADOS, P_FICHA, enLaCascara, rectGuardarDeLaBarra, rectPestana } from '../el-ano/colegio';
import { rectCajaConfirmar, rectConfirmar } from '../el-ano/piezas';
import { finDelTecleo } from '../montar-el-ano/tiempo';
import { INTRO, P_CARGOS, P_CONTACTO, P_IDENT, P_VOCABULARIO, SCROLL, TELEFONO_NUEVO, TEXTOS, YEAR_ID, rectCampoVocabulario, rectControl } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «LA FICHA DEL COLEGIO Y EL MEMBRETE».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     Aquí no se autoguarda; y las plantillas de certificado son del colegio, no del año.
 *
 * La primera mitad es la pantalla entera: «Esta ficha no se guarda sola» arriba, «sin guardar»
 * en la etiqueta tocada, la barra de abajo, y la guarda de salida (`canDeactivate`), que el vídeo
 * dispara de verdad al pulsar otra pestaña. La segunda mitad NO se enseña aquí --tiene su vídeo,
 * «certificado-membrete»--: el vídeo sólo dice dónde está y por qué no está en la ficha. La ficha
 * no tiene escudo, ni membrete, ni firmas (`colegio-ficha.ts:586-598`).
 *
 * De paso, el sitio donde el colegio pone nombre a sus unidades («Cómo llama este colegio a sus
 * cosas»): es la frase que PLAN §2.12 pide decir una vez, y aquí se enseña en su pantalla.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CINCO ACTOS
 *
 *     1. LA LLEGADA     Configuración -> El colegio (Periodos) -> Ficha del colegio
 *     2. NO SE GUARDA   el teléfono: «sin guardar» y la barra
 *     3. SALIR          otra pestaña -> «Tienes cambios sin guardar» -> Seguir aquí -> Guardar
 *     4. LO DEMÁS       cargos que firman; cómo se llaman las unidades
 *     5. EL MEMBRETE    no está aquí: Certificados
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaConfig: 36,
	pulsaConfig: 42,
	abreConfig: 44,
	llegaColegio: 100,
	pulsaColegio: 112,
	montaColegio: 116,
	llegaPestana: 170,
	pulsaPestana: 182,
	montaFicha: 186,

	llegaTelefono: 396,
	/** Doble clic: el número queda seleccionado y lo tecleado lo sustituye. */
	pulsaTelefono: 408,
	teclea: 420,

	llegaCertificados: 560,
	pulsaCertificados: 572,
	confirm: 576,
	llegaSeguir: 712,
	pulsaSeguir: 726,

	llegaGuardar: 816,
	pulsaGuardar: 830,
	/** El PUT vuelve: aviso y la barra se va. */
	guardado: 846,

	bajaCargosDesde: 910,
	bajaCargosHasta: 942,
	bajaVocDesde: 1046,
	bajaVocHasta: 1078,
	subeDesde: 1188,
	subeHasta: 1214,
	cursorSale: 1310,
};

export const FIN_TECLEO = finDelTecleo(TELEFONO_NUEVO, T.teclea);

const cas = (r: Rect, scroll = 0) => enLaCascara(r, scroll);
/** La barra de abajo no se mueve con la página: va en coordenadas del hueco de la pantalla. */
const barra: Rect = { x: CG.lado, y: MEDIDAS.alto - MEDIDAS.barra - 16 - 60, ancho: ANCHO_PANEL, alto: 60 };
export const ANCHO_GUARDAR = 176;

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	config: puntoDelMenu('Configuración'),
	colegio: puntoDelMenu('Configuración', 'El colegio'),
	pestana: centro(cas(rectPestana(P_FICHA))),
	telefono: centro(cas(rectControl(P_CONTACTO, 0, false))),
	certificados: centro(cas(rectPestana(P_CERTIFICADOS))),
	seguir: centro(rectConfirmar('no')),
	guardar: centro(cas(rectGuardarDeLaBarra(ANCHO_GUARDAR))),
};

export const FOCOS = {
	config: focoDelMenu('Configuración'),
	pestana: alFotograma(cas(rectPestana(P_FICHA)), 4, 6),
	datos: alFotograma(cas({ x: P_IDENT.x, y: P_IDENT.y, ancho: P_CONTACTO.x + P_CONTACTO.ancho - P_IDENT.x, alto: P_IDENT.alto }), 4, 12),
	intro: alFotograma(cas(INTRO), 4, 12),
	telefono: alFotograma(cas({ ...rectControl(P_CONTACTO, 0, false), y: rectControl(P_CONTACTO, 0, false).y - 26, alto: 58 }), 8, 8),
	barra: alFotograma(cas(barra), 4, 12),
	confirm: alFotograma(rectCajaConfirmar(), 6, 10),
	cargos: alFotograma(cas(P_CARGOS, SCROLL.cargos), 4, 12),
	vocabulario: alFotograma(
		cas({ x: P_VOCABULARIO.x, y: P_VOCABULARIO.y, ancho: P_VOCABULARIO.ancho, alto: rectCampoVocabulario(3).y + rectCampoVocabulario(3).alto + 10 - P_VOCABULARIO.y }, SCROLL.vocabulario),
		4,
		12,
	),
	certificados: alFotograma(cas(rectPestana(P_CERTIFICADOS)), 4, 6),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_PERIODOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Periodos', url: `/colegio/${YEAR_ID}/periodos` };
const AQUI = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Ficha del colegio', url: `/colegio/${YEAR_ID}/ficha` };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Configuración, El colegio.', ...EN_EL_MENU, foco: FOCOS.config, focoHasta: T.pulsaConfig + 20 },
	{ desde: T.montaColegio + 4, texto: 'Abre en Periodos; la ficha es la segunda pestaña.', ...EN_PERIODOS, foco: FOCOS.pestana, focoHasta: T.pulsaPestana + 12 },
	{ desde: 258, texto: 'Esta ficha no se guarda sola: lo avisa arriba.', ...AQUI, foco: FOCOS.intro },
	{ desde: 382, texto: 'Al cambiar el teléfono, queda «sin guardar» y sale la barra.', ...AQUI, foco: FOCOS.telefono },
	{ desde: 542, texto: 'Si intenta salir, pregunta antes: lo escrito se perdería.', ...AQUI, foco: FOCOS.confirm },
	{ desde: 694, texto: '«Seguir aquí» vuelve sin perder nada.', ...AQUI, foco: FOCOS.confirm, focoHasta: T.pulsaSeguir + 4 },
	{ desde: 802, texto: 'Se guarda con «Guardar los cambios».', ...AQUI, foco: FOCOS.barra, focoHasta: T.guardado },
	{ desde: 915, texto: 'Rector y secretario firman boletines y certificados.', ...AQUI, foco: FOCOS.cargos },
	{ desde: 1050, texto: 'Aquí el colegio nombra sus cosas: Logros e Indicadores.', ...AQUI, foco: FOCOS.vocabulario, focoHasta: T.subeDesde - 2 },
	{ desde: T.subeHasta + 4, texto: 'El membrete no está aquí: va en Certificados.', ...AQUI, foco: FOCOS.certificados },
];

export const AVISO = { desde: T.guardado, dura: 60, texto: TEXTOS.guardado };

export const TARJETA = 1338;
export const DURACION = TARJETA + 120;

export const CLAVE = 'colegio-ficha';
export const TITULO = 'La ficha del colegio y el membrete';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: El colegio, Ficha del colegio' },
	{ desde: 258, titulo: 'No se guarda sola' },
	{ desde: 542, titulo: 'Salir con cambios sin guardar' },
	{ desde: 915, titulo: 'Los cargos y los nombres de las cosas' },
	{ desde: T.subeHasta + 4, titulo: 'El membrete, en Certificados' },
];

export const CIERRE: Cierre = {
	hiciste: 'Cambiaste el teléfono del colegio y lo guardaste con el botón.',
	seVe: 'El aviso «Guardado: …» y que la barra de abajo desaparece.',
	despues: 'Siguiente: niveles, grados y grupos.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (FIN_TECLEO >= PASOS[4].desde) {
	throw new Error('Guion: el teléfono no termina de teclearse antes de intentar salir.');
}
if (T.pulsaCertificados < PASOS[4].desde || T.pulsaSeguir < PASOS[5].desde) {
	throw new Error('Guion: la guarda de salida no cae en sus pasos.');
}
if (T.guardado < PASOS[6].desde || T.guardado >= PASOS[7].desde) {
	throw new Error('Guion: el aviso de guardado no cae en su paso.');
}
