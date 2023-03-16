import {timerSettings} from './settings.js';
import {setConfig} from './timer-config.js';

const initFocus = () => {
	let focus = timerSettings.defaults.focusOn;
	if (timerSettings.configObj.focusOn) {
		focus = timerSettings.configObj.focusOn;
	}

	timerSettings.focusOn = focus;
	timerSettings.focusCheckbox.checked = focus;
	console.log(`timerSettings.focusOn: ${timerSettings.focusOn}`);
};

const checkFocusCheckbox = () => {
	timerSettings.focusOn = timerSettings.focusCheckbox.checked;
	console.log(`timerSettings.focusOn: ${timerSettings.focusOn}`);
	setConfig();
};

export {initFocus, checkFocusCheckbox};
