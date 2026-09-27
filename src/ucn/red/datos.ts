/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE DICE EL DIAGRAMA. Todo el texto del clip está aquí y no repartido por la escena.
 *
 * LOS DOS COLEGIOS SON GENÉRICOS A PROPÓSITO. En el vídeo se ve a una alumna **salir** de un colegio
 * y entrar en otro, y eso con dos nombres reales de la Unión se lee como un traslado que ocurrió: en
 * la sala está sentada gente de los dos. «Del Norte» y «Del Sur» no son ninguno de los trece y se
 * entienden igual.
 *
 * LA ALUMNA SALE DE `notas/planilla.ts`, que es la lista ficticia que ya usan los clips de la
 * aplicación. Reutilizarla no es pereza: si en el mismo vídeo el traslado fuera de una alumna que no
 * aparece en ninguna otra pieza, sería un nombre más que memorizar sin que aporte nada.
 */

export const CABECERA = 'Unión Colombiana del Norte · Red Educativa';

/** Un titular por acto. Se escriben, como los de las pantallas del portal. */
export const TITULOS = ['Traslado entre colegios', 'Certificados con código QR', 'Integración con SunPlus'];

export const ORIGEN = { papel: 'Colegio de origen', nombre: 'Colegio Adventista del Norte' };
export const DESTINO = { papel: 'Colegio de destino', nombre: 'Colegio Adventista del Sur' };

/** El sello del centro de la vía: lo que hace que el viaje se lea «por la red» y no «por correo». */
export const VIA = 'Red Educativa · UCN';

export const ALUMNA = { nombre: 'Cardona Ruiz, Mariana', grupo: '9°B · año lectivo 2026' };

/*
 * LAS TRES CARPETAS SON LAS TRES QUE NOMBRA LA VOZ --notas, convivencia, certificados-- y en ese
 * orden. Si aquí hubiera una cuarta, la voz y la pantalla dirían cosas distintas.
 */
export const HISTORIAL = [
	{ clave: 'notas', texto: 'Notas y boletines' },
	{ clave: 'convivencia', texto: 'Convivencia y observador' },
	{ clave: 'certificados', texto: 'Certificados y constancias' },
];

/* ── EL CERTIFICADO ────────────────────────────────────────────────────────────────────────── */

/**
 * EL PIE NO LLEVA NINGUNA DIRECCIÓN WEB. Un `micolevirtual.com/algo` inventado en un certificado
 * dibujado a tamaño legible es exactamente el tipo de detalle que alguien teclea después de la
 * reunión. Lo que el clip afirma --que el código comprueba el documento-- se dice con palabras.
 */
export const CERTIFICADO = {
	emisor: 'Unión Colombiana del Norte · Red Educativa',
	titulo: 'Certificado de estudios',
	lineas: [
		['Alumna', 'Cardona Ruiz, Mariana'],
		['Grado', 'Noveno B · 2026'],
		['Colegio', 'Colegio Adventista del Sur'],
		['Expedido', '4 de septiembre de 2026'],
	] as [string, string][],
	/** De muestra, como todas las cifras de estos clips. No es un consecutivo de nadie. */
	codigo: 'UCN-2026-0004821',
	pie: 'El código lleva al verificador de la Unión.',
};

/** Las dos pantallas del teléfono de quien recibe el certificado: la que busca y la que confirma. */
export const LECTOR = {
	buscando: 'Leyendo el código…',
	hecho: 'Documento auténtico',
	sub: 'Expedido por la Red Educativa de la UCN',
};

/** El sello que sale por delante de todo cuando el teléfono ya confirmó. */
export const SELLO = 'Certificado autenticado';

/* ── LA INTEGRACIÓN ────────────────────────────────────────────────────────────────────────── */

/*
 * LAS DOS ETIQUETAS DE LAS FLECHAS SALEN DE LA PANTALLA `9 · Cartera y SunPlus` del diseño, que es
 * donde el portal cruza las dos cosas. Si la integración de verdad acaba moviendo otra cosa, **es
 * este par de cadenas lo que hay que cambiar**: lo que el clip afirma tiene que ser verdad.
 *
 * EL RECUADRO DE SUNPLUS NO IMITA SU LOGOTIPO. Es su nombre escrito en la tipografía del portal
 * dentro de una tarjeta de papel: enseña «otro programa», que es lo único que el clip necesita
 * decir, y no se apropia de una marca ajena en un vídeo comercial.
 */
export const INTEGRACION = {
	myvc: 'MyVC',
	myvcPie: 'Mi Cole Virtual',
	otro: 'SunPlus',
	otroPie: 'el que ya usan',
	ida: 'matrícula y cartera',
	vuelta: 'pagos y saldos',
};
