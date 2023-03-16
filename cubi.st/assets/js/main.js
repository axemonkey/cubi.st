import {timerSettings} from './modules/settings.js';
import {initDebug} from './modules/debug.js';
import {getConfig} from './modules/timer-config.js';
import {initCountdownDuration, getCountdownDuration} from './modules/countdown.js';
import {initSounds, checkSoundsCheckbox} from './modules/sounds.js';
import {initFocus, checkFocusCheckbox} from './modules/focus.js';
import {initTheme, checkThemeDropdown} from './modules/theme.js';
import {initPuzzle, selectPuzzle} from './modules/puzzle.js';
import {spacePressed, escPressed, onFirstHover} from './modules/events.js';
import {infoModal, settingsModal, timesListModal} from './modules/modals.js';
import {deleteTime, clearTimes} from './modules/times.js';
import {initOptions} from './modules/options.js';
import {initTimerButton, hardStop} from './modules/timer.js';

const init = () => {
	console.log('init timer js');
	document.body.classList.add('js');
	window.addEventListener('mouseover', onFirstHover, false);

	initTimerButton();
	initDebug();
	getConfig();
	initCountdownDuration();
	initSounds();
	initFocus();
	initTheme();
	initPuzzle();
	initOptions();

	timerSettings.timerEl.innerHTML = timerSettings.defaultState;

	timerSettings.timerEl.addEventListener('click', event => {
		console.log('timer clicked');
		console.log('timerSettings.timerRunning: ' + timerSettings.timerRunning);
		console.log('timerSettings.countdownRunning: ' + timerSettings.countdownRunning);
		event.preventDefault();
		spacePressed(event.target);
	}, false);

	timerSettings.countdownDurationEl.addEventListener('change', () => {
		getCountdownDuration();
	});
	timerSettings.soundCheckbox.addEventListener('change', () => {
		checkSoundsCheckbox();
	});
	timerSettings.focusCheckbox.addEventListener('change', () => {
		checkFocusCheckbox();
	});
	timerSettings.themeDropdown.addEventListener('change', () => {
		checkThemeDropdown();
	});
	timerSettings.selectPuzzleEl.addEventListener('change', () => {
		selectPuzzle();
	});
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			escPressed();
		}
		if (event.key === ' ' && event.target.tagName.toLowerCase() === 'body') {
			timerSettings.timerEl.focus();
			spacePressed(timerSettings.timerEl);
		}
	});
	document.addEventListener('click', event => {
		if (event.target.classList.contains('deleteTime')) {
			deleteTime(event.target);
		}
		if (event.target.classList.contains('delete_times_yes_button')) {
			clearTimes();
		}
		if (event.target.id === 'cancel-button') {
			console.log('CANCEL');
			hardStop();
		}
		if (event.target.id === 'show-more-button') {
			console.log('#show-more-button clicked');
			timesListModal();
		}
		if (event.target.id === 'settings-button') {
			console.log('#settings-button clicked');
			settingsModal();
		}
		if (event.target.id === 'help-button') {
			console.log('#help-button clicked');
			infoModal();
		}
	});
	document.addEventListener('touchend', event => {
		if (timerSettings.countdownRunning || timerSettings.timerRunning) {
			event.preventDefault();
			spacePressed(event.target);
		}
	}, false);

	MicroModal.init();
};

// const timerTapped = () => {
// 	// document.querySelector('h1').innerHTML += 'tapped';
// 	var element = document.getElementById('timer');
// 	spacePressed(element);
// };

window.addEventListener('load', init);
