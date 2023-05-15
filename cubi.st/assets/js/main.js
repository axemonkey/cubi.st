import {timerSettings} from './modules/settings.js';
import {initDebug} from './modules/debug.js';
import {getConfig} from './modules/timer-config.js';
import {initCountdownDuration, getCountdownDuration} from './modules/countdown.js';
import {initSounds, checkSoundsCheckbox} from './modules/sounds.js';
import {initFocus, checkFocusCheckbox} from './modules/focus.js';
import {initTheme, checkThemeDropdown} from './modules/theme.js';
import {initPuzzle, selectPuzzle} from './modules/puzzle.js';
import {spacePressed, escPressed, onFirstHover} from './modules/events.js';
import {settingsModal, timesListModal} from './modules/modals.js';
import {deleteTime, clearTimes, getTimesForPuzzle} from './modules/times.js';
import {initOptions} from './modules/options.js';
import {initTimerButton, hardStop} from './modules/timer.js';
import {showScramble} from './modules/scramble.js';

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
	showScramble();
	getTimesForPuzzle();

	if (timerSettings.timerEl) {
		timerSettings.timerEl.innerHTML = timerSettings.defaultState;

		timerSettings.timerEl.addEventListener('click', event => {
			console.log('timer clicked');
			console.log('timerSettings.timerRunning: ' + timerSettings.timerRunning);
			console.log('timerSettings.countdownRunning: ' + timerSettings.countdownRunning);
			event.preventDefault();
			spacePressed(event.target);
		}, false);
	}

	if (timerSettings.countdownDurationEl) {
		timerSettings.countdownDurationEl.addEventListener('change', () => {
			getCountdownDuration();
		});
	}

	if (timerSettings.soundCheckbox) {
		timerSettings.soundCheckbox.addEventListener('change', () => {
			checkSoundsCheckbox();
		});
	}

	if (timerSettings.focusCheckbox) {
		timerSettings.focusCheckbox.addEventListener('change', () => {
			checkFocusCheckbox();
		});
	}

	if (timerSettings.themeDropdown) {
		timerSettings.themeDropdown.addEventListener('change', () => {
			checkThemeDropdown();
		});
	}

	if (timerSettings.selectPuzzleEl) {
		timerSettings.selectPuzzleEl.addEventListener('change', () => {
			selectPuzzle();
		});
	}

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
		if (event.target.id === 'show-more-link') {
			console.log('#show-more-link clicked');
			timesListModal();
		}
		if (event.target.id === 'settings-button') {
			console.log('#settings-button clicked');
			settingsModal();
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
