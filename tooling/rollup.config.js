import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {babel} from '@rollup/plugin-babel';
import {logger} from './build-logger.js';
import {assetsRoot} from './project-settings.js';

const outputPlugins = [];

const plugins = [
	commonjs(),
	babel({
		configFile: path.resolve('../babel.config.js'),
		babelHelpers: 'bundled',
	}),
	nodeResolve(), // Locates and bundles third-party dependencies in node_modules
];

function output(file) {
	return [{
		file,
		format: 'iife',
		sourcemap: false,
		plugins: outputPlugins,
	}];
}

function exportsObj(bundles) {
	const exportsArray = [];
	for (const bundle of bundles) {
		const thisExport = {
			input: `src/js/${bundle}/index.js`,
			output: output(`${assetsRoot}/scripts/${bundle}.bundled.js`),
			onwarn(warning) {
				logger.warning(warning);
			},
			plugins,
		};
		exportsArray.push(thisExport);
	}
	return exportsArray;
}

export default exportsObj(['cookie-consent', 'cross-promo', 'preferences', 'signup']);
