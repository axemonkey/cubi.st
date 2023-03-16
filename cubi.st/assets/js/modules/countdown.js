import {timerSettings} from './settings.js';
import {setConfig} from './timer-config.js';
import {startTimer} from './timer.js';

const initCountdownDuration = () => {
	let duration = Number(timerSettings.defaults.countdownDuration);
	if (timerSettings.configObj.countdownDuration) {
		duration = Number(timerSettings.configObj.countdownDuration);
	}
	timerSettings.countdownDuration = duration;
	for (const elem of timerSettings.countdownDurationEl.querySelectorAll('option')) {
		const dropdownOption = elem;
		dropdownOption.selected = false;
	}
	timerSettings.countdownDurationEl.querySelector('#duration' + duration).selected = true;
};

const getCountdownDuration = () => {
	timerSettings.countdownDuration = Number(timerSettings.countdownDurationEl.value);
	console.log(`timerSettings.countdownDuration: ${timerSettings.countdownDuration}`);
	setConfig();
};

const startCountdown = () => {
	if (timerSettings.countdownDuration === 0) {
		return startTimer();
	}
	console.log('start countdown');
	if (timerSettings.soundsOn) {
		document.querySelector('#sounds-startCountdown').play();
	}
	timerSettings.timerRunning = false;
	timerSettings.countdownRunning = true;
	document.body.classList.add('countdownRunning');
	timerSettings.countdownPings = [];
	timerSettings.startTime = Date.now();
	window.clearInterval(timerSettings.timerIntervalVar);
	timerSettings.timerIntervalVar = window.setInterval(() => {
		checkCountdown();
	}, timerSettings.countdownInterval);
};

const checkCountdown = () => {
	timerSettings.currTime = Date.now();
	const diff = timerSettings.currTime - timerSettings.startTime;
	const seconds = Math.floor(diff / 1000);
	const secondsLeft = timerSettings.countdownDuration - seconds;

	timerSettings.timerEl.textContent = secondsLeft.toString();

	if (secondsLeft === 0) {
		timerSettings.timerEl.classList.remove('flash');
		return startTimer();
	}

	if (secondsLeft < 4 && timerSettings.countdownPings[secondsLeft] !== true) {
		timerSettings.countdownPings[secondsLeft] = true;
		timerSettings.timerEl.classList.add('flash');
		window.setTimeout(() => {
			timerSettings.timerEl.classList.remove('flash');
		}, 750);
		if (timerSettings.soundsOn) {
			document.querySelector('#sounds-ping').play();
		}
	}
};

export {initCountdownDuration, getCountdownDuration, startCountdown};
