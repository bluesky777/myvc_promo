import { enElFotograma } from '../encuadre';
import { MANDOS } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { ALTO_OPCION_DOBLE } from '../montar-el-ano/ant';
import { ENTRADA_DEL_PUNTERO, PERSONAS, dePersonas, puntoDelMenu, rectDelMenu } from '../secretaria/menu';
import { centro, type Rect } from '../secretaria/piezas';
import { disposicionDirectorio, rectEstado, rectGrupo } from '../secretaria/planoDirectorio';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { BAJADA_FINAL, DESPLAZADA, FILA_CANDIDATO, FILA_QUE_CAMBIA, M, NOTAS, QUIEN_VUELVE } from './datos';
import { PIE_EN, PIE_NOTAS, rectExplicacion, rectSelectorEn } from './Dialogos';
import { rectBotonCandidato, rectEstadoEnElGrupo, rectSeccion2, rectSelector } from './Matricular';
import { NOVENO_B } from '../secretaria/personas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «MATRICULAR».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Los candidatos salen del grado anterior del año anterior.** La pantalla busca el grupo
 *        cuyo `orden_grado` es el del elegido menos uno y pide sus alumnos de `year - 1`
 *        (`matriculas.ts:204-210`, 322-325). Por eso en 9°B salen los de 8° de 2025, y un alumno
 *        nuevo no sale: ése se busca abajo o se crea.
 *     2. **Moverlo de 9°A a 9°B deja las notas atrás, y la aplicación lo dice… desde Alumnos.**
 *        «Deja notas en 9°A» (`traer-notas.ts`) sólo lo abre `panel-alumnos.ts:993-1021`. Desde
 *        esta pantalla, «…» cambia el grupo y ya (`matriculas.ts:442`): no avisa. Por eso el vídeo
 *        cambia de grupo en Alumnos, y el rótulo lo dice.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA    Personas ▸ Matricular, con 9°B elegido (la pantalla recuerda el último)
 *     2. MATRICULAR    «Matric» en la fila de Jerónimo: sin pregunta, sube a «Ya en 9°B»
 *     3. CAMBIAR       Personas ▸ Alumnos ▸ 9°A ▸ «…» ▸ «Matricular en…» 9°B ▸ «Deja notas en 9°A»
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

const DIR = disposicionDirectorio(false, false);
const unir = (a: Rect, b: Rect): Rect => ({ x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: a.alto });

export const FOCOS = {
	personas: enElFotograma(rectDelMenu(PERSONAS, null, null)),
	selector: f(rectSelector(0), 8),
	candidatos: f(rectSeccion2(DESPLAZADA, 5), 6),
	matric: f(rectBotonCandidato(FILA_CANDIDATO, 'Matric', DESPLAZADA), 8),
	alumnos: enElFotograma(rectDelMenu(PERSONAS, dePersonas('Alumnos'), PERSONAS)),
	puntos: f(rectEstado(DIR, FILA_QUE_CAMBIA, '…'), 8),
	explicacion: f(rectExplicacion(), 4),
	/* El año de arriba, en la barra: sin `f`, que recorta por debajo de la barra. */
	ano: enElFotograma({ x: MANDOS.selector.x - 4, y: MANDOS.selector.y - 4, ancho: MANDOS.selector.ancho + 8, alto: MANDOS.selector.alto + 8 }),
	/* «Reti» y «Dese» en la fila recién matriculada: las dos maneras de sacar a alguien sin borrarlo. */
	retiDese: f(unir(rectEstadoEnElGrupo(NOVENO_B.length, 'Reti', DESPLAZADA, BAJADA_FINAL), rectEstadoEnElGrupo(NOVENO_B.length, 'Dese', DESPLAZADA, BAJADA_FINAL)), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(PERSONAS, null, null),
	matricular: puntoDelMenu(PERSONAS, dePersonas('Matricular'), PERSONAS),
	matric: centro(rectBotonCandidato(FILA_CANDIDATO, 'Matric', DESPLAZADA)),
	ano: centro(MANDOS.selector),
	retiDese: centro(rectEstadoEnElGrupo(NOVENO_B.length, 'Reti', DESPLAZADA, BAJADA_FINAL)),
	alumnos: puntoDelMenu(PERSONAS, dePersonas('Alumnos'), PERSONAS),
	grupo9A: centro(rectGrupo('9A')),
	puntos: centro(rectEstado(DIR, FILA_QUE_CAMBIA, '…')),
	selector: { x: rectSelectorEn().x + 200, y: centro(rectSelectorEn()).y },
	opcion9B: { x: rectSelectorEn().x + 160, y: rectSelectorEn().y + 32 + 4 + 4 + ALTO_OPCION_DOBLE * 1.5 },
	matricularEn: centro(PIE_EN[1]),
	traer: centro(PIE_NOTAS(NOTAS)[1]),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Personas ▸ Matricular', url: '/matriculas' };
const EN_ALUMNOS = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Para matricular: Personas, en Matricular.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: M.pulsaPersonas + 10 },
	{ desde: 139, texto: 'Arriba, el grupo donde matriculas: aquí, 9°B.', voz: 'Arriba, el grupo donde matriculas: aquí, noveno B.', ...AQUI, foco: FOCOS.selector, focoHasta: M.bajaDesde - 4 },
	{ desde: 296, texto: 'Abajo, los de 8° del año pasado que aún no están en 9°B.', voz: 'Abajo, los de octavo del año pasado que aún no están en noveno B.', ...AQUI, foco: FOCOS.candidatos },
	{ desde: 442, texto: 'Antes de «Matric», mira que el año de arriba sea el nuevo.', voz: 'Antes de pulsar Matric, mira que el año de arriba sea el nuevo.', ...AQUI, foco: FOCOS.ano, rojo: true },
	{ desde: 611, texto: 'Matric lo matricula en 9°B, sin preguntar nada.', voz: 'Matric lo matricula en noveno B, sin preguntar nada.', ...AQUI, foco: FOCOS.matric, focoHasta: M.pulsaMatric + 8 },
	{ desde: 746, texto: 'Nunca lo borres: si se va, «Reti» o «Dese» en su fila.', voz: 'Nunca borres a un alumno: si se va, se marca Reti o Dese en su fila.', ...AQUI, foco: FOCOS.retiDese, rojo: true },
	{ desde: 945, texto: 'Cambiar de grupo, mejor desde Alumnos: avisa si deja notas.', ...AQUI, foco: FOCOS.alumnos, focoHasta: M.pulsaAlumnos + 10 },
	{ desde: 1104, texto: 'Elige su grupo, 9°A, y en su fila pulsa «…».', voz: 'Elige su grupo, noveno A, y en su fila pulsa los tres puntos.', ...EN_ALUMNOS, foco: FOCOS.puntos, focoHasta: M.pulsaPuntos + 4 },
	{ desde: 1268, texto: 'Elige el grupo nuevo y pulsa Matricular.', ...EN_ALUMNOS },
	{ desde: 1395, texto: 'Deja notas en 9°A: sin traerlas, su boletín nuevo sale en blanco.', voz: 'Deja notas en noveno A: sin traerlas, su boletín nuevo sale en blanco.', ...EN_ALUMNOS, foco: FOCOS.explicacion },
	{ desde: 1580, texto: '«Traer las 11» las pasa a 9°B; si no, quedan donde están.', voz: 'Traer las once las pasa a noveno B; si no, quedan donde están.', ...EN_ALUMNOS },
];

export const AVISOS = [
	{ desde: M.matriculado, dura: fotogramasDe(3000), texto: 'Alumno matriculado con éxito.' },
	{ desde: M.matriculadoEn, dura: fotogramasDe(3000), texto: 'Alumno matriculado con éxito.' },
	{ desde: M.traidas, dura: fotogramasDe(3000), texto: `${NOTAS} notas traídas a 9°B.` },
];

export const TARJETA = 1733;
export const DURACION = 1843;

export const CLAVE = 'matricular';
export const TITULO = 'Matricular';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Personas, Matricular' },
	{ desde: 296, titulo: 'Los candidatos: el grado anterior' },
	{ desde: 442, titulo: 'Matric, con el año nuevo arriba' },
	{ desde: 746, titulo: 'Al que se va no se le borra' },
	{ desde: 945, titulo: 'Cambiar de grupo, desde Alumnos' },
	{ desde: 1395, titulo: 'Las notas que se quedan atrás' },
];

export const CIERRE: Cierre = {
	hiciste: `Matriculaste a ${QUIEN_VUELVE.nombres} en 9°B y pasaste a Alejandro de 9°A a 9°B.`,
	seVe: 'Salen en «Ya en 9°B» con Matr hundido, y «11 notas traídas a 9°B.».',
	despues: 'Siguiente: el directorio de alumnos.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* «Reti» y «Dese» se señalan en la fila nueva ya bajada, y «Matric» se pulsa después de la advertencia del año. */
if (M.bajaFilasHasta > PASOS[5].desde || M.pulsaMatric < PASOS[4].desde || M.bajaHasta > PASOS[2].desde) {
	throw new Error('Guion (matricular): lo que se señala tiene que estar quieto y en pantalla cuando se nombra.');
}

if (PASOS[9].desde < M.cargadoNotas - 20 || PASOS[9].desde > M.cargadoNotas) {
	throw new Error('Guion: el paso de «Deja notas» tiene que empezar cuando el diálogo ya tiene sus cifras.');
}
