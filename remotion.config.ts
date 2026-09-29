/*
 * Lo que vale para TODOS los renders. Lo de cada clip --tamaño, fps, duración-- va en `src/Root.tsx`,
 * que es donde se registran las composiciones.
 */
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

/*
 * SE RENDERIZA CON EL CHROME HEADLESS DE REMOTION, no con el del sistema (`npx remotion browser
 * ensure` lo baja a `node_modules/.remotion/`). Con el Chrome del sistema, bajo carga, salían
 * fotogramas sueltos en mosaico 3×3 --medido el 2026-09-28: 23 de 27 vídeos de ayuda los tenían, y
 * en una prueba de 1.100 fotogramas el headless dio cero y el del sistema tres en 700--.
 * `MYVC_CHROME_SISTEMA=1` vuelve al del sistema, por si el headless falta.
 */
if (process.env.MYVC_CHROME_SISTEMA === '1') {
	Config.setBrowserExecutable('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
}
