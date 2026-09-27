/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «LA RED CONECTADA» — el 6.7 del vídeo: traslados, certificados y SunPlus.
 *
 * ESTE CLIP NO ES UNA PANTALLA DEL PORTAL, Y ES LA ÚNICA EXCEPCIÓN DE LOS SIETE. Los otros seis
 * enseñan una pantalla porque lo que cuentan **pasa dentro de una pantalla**: un gráfico, una tabla,
 * un formulario. Estas tres cosas no:
 *
 *   · un traslado pasa ENTRE DOS COLEGIOS, y una captura del colegio de destino no enseña el viaje;
 *   · un certificado con QR se comprueba FUERA del portal, con el teléfono de quien lo recibe;
 *   · una integración pasa ENTRE DOS PROGRAMAS, y ninguno de los dos la enseña por su cuenta.
 *
 * Las tres son relaciones, no vistas. Un diagrama las cuenta en veintiséis segundos; tres capturas
 * seguidas de las pantallas `12`, `13` y `9` del diseño no las contarían en ninguno. La piel sí es
 * la del portal --papel crema, azul de tinta, la serif de los titulares--, así que montado entre el
 * clip de encuestas y el del trato no cambia de superficie: cambia lo que hay encima.
 *
 * LOS TRES ACTOS, y lo que dice la voz encima de cada uno:
 *
 *   1  EL TRASLADO      la ficha de una alumna sale de un colegio y entra en otro, con su historial
 *   2  EL CERTIFICADO   se expide, el teléfono de quien lo recibe lee el código y sale el sello
 *   3  LA INTEGRACIÓN   MyVC le manda a SunPlus y SunPlus le devuelve
 *
 * CADA ACTO SE VA ANTES DE QUE ENTRE EL SIGUIENTE. Sin solapes: son tres argumentos distintos y
 * encadenarlos como si fueran uno haría que el segundo se leyera como consecuencia del primero.
 */

export const FPS = 30;

/* ── LA CABECERA. Está los veintiséis segundos: es lo que ata el diagrama al portal. ───────── */
export const CABECERA = 0;

/* ── 1 · EL TRASLADO ───────────────────────────────────────────────────────────────────────── */
export const TITULO_1 = 8;
export const COLEGIO_A = 22;
export const COLEGIO_B = 34;
/** La línea de puntos entre los dos: la red, dibujada antes de que nada la recorra. */
export const VIA = 48;
export const FICHA = 66;
export const DOCS = 80;
export const PASO_DOC = 7;

/*
 * EL VIAJE DURA 2,4 SEGUNDOS A PROPÓSITO. Más rápido se lee como un corte --la ficha aparece en el
 * otro colegio-- y lo que hay que ver es justamente el trayecto: que va POR la red y no en un sobre.
 */
export const VUELA_DESDE = 120;
export const VUELA_HASTA = 192;

/** Los tres vistos del historial, al llegar. En cascada: se leen uno a uno. */
export const VISTOS = 202;
export const PASO_VISTO = 10;

export const SALE_1 = 258;

/* ── 2 · EL CERTIFICADO CON CÓDIGO QR ──────────────────────────────────────────────────────── */
export const TITULO_2 = 286;
export const CERTIFICADO = 296;
export const LINEAS = 314;
export const QR = 332;
export const MOVIL = 368;
/** El haz del teléfono al código, y el barrido que lo recorre. */
export const HAZ = 392;
export const BARRIDO = 398;
export const BARRIDO_FIN = 438;
/** La pantalla del teléfono deja de buscar y confirma. */
export const VERIFICADO = 442;
/** Y sólo entonces el sello, por delante de todo. Primero se comprueba, después se sella. */
export const MEDALLA = 456;
export const SALE_2 = 524;

/* ── 3 · LA INTEGRACIÓN ────────────────────────────────────────────────────────────────────── */
export const TITULO_3 = 552;
export const MYVC = 562;
export const SUNPLUS = 578;
export const IDA = 604;
export const IDA_FIN = 636;
/** La vuelta arranca cuando la ida ya llegó: es una respuesta, no un cruce. */
export const VUELTA = 650;
export const VUELTA_FIN = 682;

/*
 * LA SALIDA, UNA POR UNA Y LENTA. Es el final del clip, así que no se aplica el «irse cuesta menos
 * que llegar» del resto de la casa: aquí las cuatro piezas se apagan por turnos --primero la vuelta,
 * luego la ida, luego SunPlus, luego MyVC-- y la cabecera cierra detrás.
 */
export const SALIDA = 704;
export const PASO_SALIDA = 16;
export const DUR_SALIDA = 28;

export const DURACION = 800;
