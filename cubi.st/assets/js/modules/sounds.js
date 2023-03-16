import {timerSettings} from './settings.js';
import {setConfig} from './timer-config.js';

const initSounds = () => {
	let sounds = timerSettings.defaults.soundsOn;
	if (timerSettings.configObj.soundsOn) {
		sounds = timerSettings.configObj.soundsOn;
	}

	timerSettings.soundsOn = sounds;
	timerSettings.soundCheckbox.checked = sounds;
	console.log(`timerSettings.soundsOn: ${timerSettings.soundsOn}`);
};

const checkSoundsCheckbox = () => {
	timerSettings.soundsOn = timerSettings.soundCheckbox.checked;
	console.log(`timerSettings.soundsOn: ${timerSettings.soundsOn}`);
	setConfig();
};

export {initSounds, checkSoundsCheckbox};
