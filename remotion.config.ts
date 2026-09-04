/*
 * Lo que vale para TODOS los renders. Lo de cada clip --tamaño, fps, duración-- va en `src/Root.tsx`,
 * que es donde se registran las composiciones.
 */
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

/*
 * SE CONDUCE EL CHROME DEL SISTEMA y no se descarga otro navegador, igual que hacen las pruebas de
 * `myvc_front` con Playwright. Si algún día falla, quitar esta línea hace que Remotion se baje su
 * propio Chrome headless (~150 MB) la primera vez.
 */
Config.setBrowserExecutable('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
