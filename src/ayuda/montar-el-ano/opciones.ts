import type { Opcion } from './ant';
import { DOCENTES, GRUPOS, MATERIAS, etiquetaDeMateria, type ClaveDocente } from './reparto';

/*
 * LO QUE OFRECE CADA DESPLEGABLE mientras se teclea en su buscador. Filtran como `nzShowSearch`:
 * por el texto de la etiqueta, sin mayúsculas. El de grupos busca también en el nombre del titular
 * («escribir “ana” encuentra los grupos de la profe Ana», `desplegable-grupo.ts`).
 *
 * El panel de Ant mide 256 px de alto y desplaza el resto: se enseñan las que caben.
 */

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const casa = (texto: string, busqueda: string | null) => !busqueda || sinTildes(texto).includes(sinTildes(busqueda));

export function opcionesDeMaterias(busqueda: string | null, caben = 7): Opcion[] {
	return MATERIAS.filter((m) => casa(etiquetaDeMateria(m), busqueda)).slice(0, caben).map((m) => ({ texto: etiquetaDeMateria(m) }));
}

export function opcionesDeGrupos(busqueda: string | null, caben = 5): Opcion[] {
	return GRUPOS.filter((g) => casa(`${g.nombre} ${DOCENTES[g.titular].nombre}`, busqueda))
		.slice(0, caben)
		.map((g) => ({ texto: g.nombre, debajo: DOCENTES[g.titular].nombre, cara: g.titular }));
}

/** Los docentes contratados, por apellido, como los ordena la lista del año. */
export const CONTRATADOS: ClaveDocente[] = (Object.keys(DOCENTES) as ClaveDocente[])
	.slice()
	.sort((a, b) => DOCENTES[a].nombre.split(' ').slice(-2).join(' ').localeCompare(DOCENTES[b].nombre.split(' ').slice(-2).join(' '), 'es'));

export function opcionesDeDocentes(busqueda: string | null, caben = 7): Opcion[] {
	return CONTRATADOS.filter((k) => casa(DOCENTES[k].nombre, busqueda)).slice(0, caben).map((k) => ({ texto: DOCENTES[k].nombre, cara: k }));
}
