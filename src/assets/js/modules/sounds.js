import { timerSettings } from './settings.js';
import { setConfig } from './timer-config.js';
import { toasty } from './toasties.js';

const initSounds = () => {
	let sounds = timerSettings.defaults.soundsOn;
	if (timerSettings.configObj.soundsOn) {
		sounds = timerSettings.configObj.soundsOn;
	}

	timerSettings.soundsOn = sounds;
	console.log(`timerSettings.soundsOn: ${timerSettings.soundsOn}`);

	if (timerSettings.soundCheckbox) {
		timerSettings.soundCheckbox.checked = sounds;
	}
};

const checkSoundsCheckbox = () => {
	timerSettings.soundsOn = timerSettings.soundCheckbox.checked;
	console.log(`timerSettings.soundsOn: ${timerSettings.soundsOn}`);
	toasty({
		text: `Sounds: ${timerSettings.soundsOn ? 'on' : 'off'}`,
	});
	setConfig();
};

export { initSounds, checkSoundsCheckbox };
