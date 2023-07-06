import {timerSettings} from './settings.js';
import {setConfig} from './timer-config.js';
import {toasty} from './toasties.js';

const initFocus = () => {
	let focus = timerSettings.defaults.focusOn;
	if (timerSettings.configObj.focusOn) {
		focus = timerSettings.configObj.focusOn;
	}

	timerSettings.focusOn = focus;
	console.log(`timerSettings.focusOn: ${timerSettings.focusOn}`);

	if (timerSettings.focusCheckbox) {
		timerSettings.focusCheckbox.checked = focus;
	}
};

const checkFocusCheckbox = () => {
	timerSettings.focusOn = timerSettings.focusCheckbox.checked;
	console.log(`timerSettings.focusOn: ${timerSettings.focusOn}`);
	toasty({
		text: `Focus mode: ${timerSettings.focusOn ? 'on' : 'off'}`,
	});
	setConfig();
};

export {initFocus, checkFocusCheckbox};
