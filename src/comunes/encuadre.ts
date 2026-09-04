/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CUÁNTO OCUPA CADA PANTALLA DENTRO DEL FOTOGRAMA. **Un solo sitio para los ocho clips.**
 *
 * Estaba repartido --un número en cada escena-- y eso es lo que hace que dos clips montados seguidos
 * enseñen la aplicación a dos tamaños distintos. Pegados en el vídeo final eso se ve como un salto,
 * aunque cada clip por separado esté bien.
 *
 * LOS NÚMEROS NO SON UNA PREFERENCIA: cada pantalla tiene su tamaño de diseño y aquí se dice cuánto
 * se agranda hasta rozar el borde. Se subieron todos el 2026-09-03 a petición suya -- el cuadro se
 * veía pequeño dentro del fotograma, y en un vídeo que se mira en el móvil eso es texto que no se
 * lee. El límite es que quepa: 1920 × 1080 con un margen que respire, y con sitio para el aviso del
 * lote arriba y para el rótulo abajo.
 */

export const ENCUADRE = {
	/** La planilla de notas entera: seis filas por seis columnas. */
	planilla: 1.38,
	/** La planilla en primer plano del clip de rúbricas: tres filas y tres columnas. */
	planillaCorta: 1.62,
	/** La matriz de la rúbrica, que ya es ancha de por sí. */
	matriz: 1.12,
	/** Las fichas de comportamiento. */
	comportamiento: 1.22,
	/** La rejilla de disciplina: seis columnas, así que es la que menos margen tiene. */
	rejilla: 1.14,
	/** El diálogo de crear una situación. */
	dialogo: 1.24,
	/* ── El programa de horarios, que es otra aplicación y tiene sus propias pantallas ──────── */
	/** La disponibilidad de un salón: lista a la izquierda y la semana entera a la derecha. */
	horarioDatos: 1.3,
	/** La rejilla del horario, con la bandeja debajo. Es la más ancha de las tres. */
	horarioRejilla: 1.24,
	/** La hoja del informe, tal como sale impresa. */
	horarioInforme: 1.2,
	/*
	 * EL TELÉFONO. Es el único encuadre VERTICAL, y ahí el límite no es el ancho sino el alto: un
	 * móvil de pie en un fotograma apaisado sólo puede crecer hasta rozar arriba y abajo. Por eso su
	 * interfaz va con la letra más grande de lo que le tocaría --lo que en el sistema sería «texto
	 * grande»--: a tamaño real, en un vídeo que alguien mira en su propio móvil, no se leería nada.
	 */
	movil: 1.05,
};

/**
 * CON RÓTULO, LA PANTALLA SE ENCOGE. El texto de abajo no es algo que se pega encima al final: es
 * parte del encuadre, y si la pantalla no le deja sitio se le echa encima. Un solo factor para todos
 * los clips, por lo mismo que las escalas.
 */
export const CON_ROTULO = 0.9;
