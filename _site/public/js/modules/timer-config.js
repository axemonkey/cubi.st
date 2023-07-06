import {timerSettings} from './settings.js';
import {initOptions} from './options.js';

const logConfig = () => {
	console.log(timerSettings.configObj);
};

const getConfig = () => {
	console.log('getting config');
	const ls = localStorage.getItem(timerSettings.configStorageItem);
	const configObjString = ls || '{}';
	timerSettings.configObj = JSON.parse(configObjString);
	logConfig();
};

const setConfig = () => {
	const configObj = {
		soundsOn: timerSettings.soundsOn,
		focusOn: timerSettings.focusOn,
		countdownDuration: timerSettings.countdownDuration.toString(),
		theme: timerSettings.theme,
		puzzle: timerSettings.puzzle,
	};

	console.log('setting config');
	timerSettings.configObj = configObj;
	localStorage.setItem(timerSettings.configStorageItem, JSON.stringify(configObj));
	logConfig();
	initOptions();
};

export {getConfig, setConfig};
