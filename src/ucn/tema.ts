/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS COLORES Y LAS MEDIDAS DEL PORTAL DE LA UCN.
 *
 * **No son los de MyVC.** El portal es otro producto y tiene su propia piel: papel crema en vez de
 * blanco, un azul de tinta en vez del color que elige cada colegio, y una serif para los titulares.
 * Un clip del portal montado con los colores de la aplicación diría que son el mismo programa, y lo
 * que se le vende a la Unión es justamente lo contrario: el portal es lo que ella recibe **encima**
 * de lo que ya tienen sus colegios.
 *
 * SALEN DEL DISEÑO, no de un ojo: `myvc_ucn/diseno/_base.py`, diccionario `C`. Si allí cambian, aquí
 * hay que cambiarlos también.
 */

export const PAPEL = '#FAF7F0';
export const TARJETA = '#FFFDF9';
export const RAIL = '#F2ECE0';
export const RAYA = '#E3DCCC';
export const RAYA2 = '#D3C9B4';
export const RELLENO = '#EDE6D8';

export const TINTA = '#1E1D19';
export const TINTA2 = '#56534A';
export const TINTA3 = '#8A8577';

/** Los cinco acentos. `AZUL` es el del portal; los otros cuatro tienen significado fijo. */
export const AZUL = '#2073AE';
export const NARANJA = '#C0521C';
export const VERDE = '#12876B';
export const MORADO = '#7B4FB0';
export const OCRE = '#9C8A0F';

/** La rampa de azules para las series, de claro a oscuro. `TINTA_AZUL` es el de los botones. */
export const AZUL1 = '#89B6DC';
export const AZUL2 = '#4F92CB';
export const AZUL3 = '#2073AE';
export const TINTA_AZUL = '#124B76';

export const GRIS = '#B5AF9F';
export const AZUL_SUAVE = '#EFF4F9';
export const OCRE_SUAVE = '#F7F1E6';

/*
 * LAS TRES FAMILIAS. Se cargan de Google Fonts en `fuentes.ts` -- y con una espera con tope, para
 * que un render sin internet salga con las de respaldo en vez de quedarse colgado.
 */
export const SANS = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif';
export const SERIF = '"Newsreader", Georgia, "Times New Roman", serif';
export const MONO = '"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL ENCUADRE DE ESTOS SEIS CLIPS. **A propósito no está en `comunes/encuadre.ts`.**
 *
 * Aquel fichero existe para que dos clips de MyVC montados seguidos no enseñen la aplicación a dos
 * tamaños distintos. Estos seis son de otro producto y de otro vídeo: lo que tienen que compartir es
 * la escala **entre ellos**, y eso es lo que se garantiza aquí. Mezclarlos allí no arreglaría nada y
 * haría que tocar el portal moviera de tamaño los clips de la aplicación.
 *
 * LA PANTALLA NO ES LA PÁGINA ENTERA. El diseño del portal mide 1440 de ancho y hasta 1960 de alto:
 * a página completa dentro de un 16:9 no se leería ni un rótulo. Cada clip enseña **la franja que
 * está contando** dentro del cromo del portal --su rail y su cabecera--, que es lo que hace que se
 * lea «esto es una pantalla del portal» y no «esto es un gráfico».
 */
export const PANTALLA = { ancho: 1440, alto: 812 };

/** Cuánto se agranda la pantalla dentro del fotograma. Uno solo para los seis. */
export const ESCALA = 1.28;

/** Con rótulo abajo, la pantalla se encoge para dejarle sitio. Igual que en el resto de la casa. */
export const CON_ROTULO = 0.9;

/** El rail de la izquierda, que es idéntico en las seis pantallas. */
export const ANCHO_RAIL = 236;
