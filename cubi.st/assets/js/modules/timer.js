import {timerSettings} from './settings.js';
import {formatTime} from './tools.js';
import {storeTime, removeNewClass} from './times.js';
import {showScramble} from './scramble.js';

const initTimerButton = () => {
	const newButton = document.createElement('button');
	newButton.id = 'timer';
	newButton.innerHTML = timerSettings.timerEl.innerHTML;
	timerSettings.timerEl.parentNode.replaceChild(newButton, timerSettings.timerEl);
	timerSettings.timerEl = newButton;
};

const hardStop = () => {
	console.log('HARD STOP');
	window.clearInterval(timerSettings.timerIntervalVar);
	timerSettings.timerEl.innerHTML = timerSettings.defaultState;
	timerSettings.timerRunning = false;
	timerSettings.cooldown = false;
	removeNewClass();
	document.body.classList.remove('countdownRunning');
	document.body.classList.remove('timerRunning');
	timerSettings.countdownRunning = false;
	timerSettings.timerEl.focus();
	showScramble();
};

const checkTimer = () => {
	console.log('checkTimer');
	timerSettings.currTime = Date.now();
	const diff = timerSettings.currTime - timerSettings.startTime;
	timerSettings.timerEl.textContent = formatTime(diff);
};

const startTimer = () => {
	console.log('start timer');
	timerSettings.timerEl.classList.add('start');
	window.setTimeout(() => {
		timerSettings.timerEl.classList.remove('start');
	}, 1000);
	window.clearInterval(timerSettings.timerIntervalVar);
	timerSettings.countdownRunning = false;
	timerSettings.timerRunning = true;
	document.body.classList.remove('countdownRunning');
	document.body.classList.add('timerRunning');
	timerSettings.startTime = Date.now();
	if (timerSettings.focusOn) {
		timerSettings.timerEl.textContent = 'Go!';
	} else {
		timerSettings.timerIntervalVar = window.setInterval(() => {
			checkTimer();
		}, timerSettings.timerInterval);
	}
	if (timerSettings.soundsOn) {
		document.querySelector('#sounds-startTimer').play();
	}
	timerSettings.timerEl.focus();
};

const stopTimer = () => {
	console.log('stop timer');
	window.clearInterval(timerSettings.timerIntervalVar);

	if (!timerSettings.cooldown) {
		timerSettings.cooldown = true;
		checkTimer(); // get final exact time
		document.body.classList.remove('timerRunning');
		timerSettings.timerEl.classList.remove('start');
		timerSettings.timerEl.classList.add('cooldown');
		if (timerSettings.soundsOn) {
			document.querySelector('#sounds-finished').play();
		}
		storeTime();
		showScramble();

		window.setTimeout(() => {
			timerSettings.timerRunning = false;
			timerSettings.cooldown = false;
			timerSettings.timerEl.classList.remove('cooldown');
		}, timerSettings.cooldownMs);
	}
};

export {initTimerButton, hardStop, startTimer, stopTimer};
