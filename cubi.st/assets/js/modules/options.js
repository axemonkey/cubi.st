import {timerSettings} from './settings.js';

const initOptions = () => {
	const optionsEl = document.querySelector('#options');
	if (optionsEl) {
		const optionsStrings = [
			`Puzzle: <strong>${timerSettings.puzzle}</strong>`,
			`Inspection: <strong>${timerSettings.countdownDuration}s</strong>`,
			`Theme: <strong>${timerSettings.theme}</strong>`,
			`Sound: <strong>${(timerSettings.soundsOn ? 'On' : 'Off')}</strong>`,
			`Focus: <strong>${(timerSettings.focusOn ? 'On' : 'Off')}</strong>`,
		];

		const html = optionsStrings.join(' ~&bull;~ ');

		optionsEl.innerHTML = html;
		document.querySelector('#scramble-container .puzzle').innerHTML = timerSettings.puzzle;
	}
};

export {initOptions};
