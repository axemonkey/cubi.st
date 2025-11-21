import { timerSettings } from './settings.js';
import { startCountdown } from './countdown.js';
import { stopTimer, hardStop } from './timer.js';

const spacePressed = (element) => {
	if (
		element.tagName.toLowerCase() === 'input' ||
		element.tagName.toLowerCase() === 'select'
	) {
		return;
	}

	if (timerSettings.modalVisible) {
		return;
	}
	if (timerSettings.timerRunning) {
		return stopTimer();
	}
	if (timerSettings.countdownRunning) {
		timerSettings.countdownRunning = false;
		document.body.classList.remove('countdownRunning');
		return window.clearInterval(timerSettings.timerIntervalVar);
	}
	startCountdown();
};

const escPressed = () => {
	hardStop();
};

const onFirstHover = () => {
	hoverActivate();
};

const hoverActivate = () => {
	timerSettings.userCanHover = true;
	document.body.classList.add('hover');
	window.removeEventListener('mouseover', onFirstHover, false);
};

export { spacePressed, escPressed, onFirstHover };
