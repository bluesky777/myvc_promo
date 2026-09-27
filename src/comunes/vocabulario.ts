/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CÓMO LLAMA EL COLEGIO A SUS COSAS. **«Unidad» y «subunidad» no son palabras de pantalla.**
 *
 * Son los nombres de la base de datos, y en la aplicación **casi ningún colegio los ve**: cada uno
 * escribe los suyos en la ficha del año, y viajan en la sesión (`unidad_displayname`,
 * `unidades_displayname`, y los suyos para la subunidad). La propia ficha lo dice cuando los pide:
 * *«Por ejemplo: Logro, Indicador de desempeño, Descriptor»*.
 *
 * LO MÁS COMÚN, con diferencia, ES **LOGROS E INDICADORES**, y por eso es lo que sale en los
 * vídeos. Los hay que dicen «Desempeños», «Criterios» o «Componentes» --en un colegio por
 * competencias la ficha sugiere justo esos dos últimos--, así que un vídeo que enseñe la palabra
 * **tiene que decir una vez que la pone el colegio**. Sin esa frase, a quien vea «Logros» y en su
 * pantalla ponga «Desempeños» le parecerá otro programa.
 *
 * Y POR ESO ESTÁ AQUÍ Y NO DENTRO DE UN CLIP: la palabra sale en la planilla, en la pantalla de
 * unidades y en los rótulos de los vídeos de ayuda. Tres copias se separan a la primera, y entonces
 * el mismo colegio se llamaría de dos maneras en dos vídeos seguidos.
 */

export const VOCABULARIO = {
	/** Lo que agrupa: en la base, `unidades`. */
	unidad: 'Logro',
	unidades: 'Logros',
	/** Lo que cuelga de ella y es una columna de la planilla: en la base, `subunidades`. */
	subunidad: 'Indicador',
	subunidades: 'Indicadores',
};

/**
 * LA FRASE QUE HAY QUE DECIR UNA VEZ POR VÍDEO en el que la palabra salga. Se escribe aquí para que
 * no se quede en la cabeza de quien montó el primero.
 */
export const AVISO_DEL_VOCABULARIO = `Cada colegio les pone nombre: aquí se llaman ${VOCABULARIO.unidades}.`;
