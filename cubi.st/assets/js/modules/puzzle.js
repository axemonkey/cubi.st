import {timerSettings} from './settings.js';
import {hardStop} from './timer.js';
import {getTimesForPuzzle} from './times.js';
import {showScramble} from './scramble.js';
import {updateModal} from './modals.js';
import {setConfig} from './timer-config.js';

const setupForPuzzle = () => {
	hardStop();
	getTimesForPuzzle();
	showScramble();
	updateModal();
};

const initPuzzle = () => {
	let puzzle = timerSettings.defaults.puzzle;
	if (timerSettings.configObj.puzzle) {
		puzzle = timerSettings.configObj.puzzle;
	}
	timerSettings.puzzle = puzzle;
	console.log(`timerSettings.puzzle: ${timerSettings.puzzle}`);

	if (timerSettings.selectPuzzleEl) {
		for (const elem of timerSettings.selectPuzzleEl.querySelectorAll('option')) {
			const puzzleOption = elem;
			puzzleOption.selected = false;
		}
		timerSettings.selectPuzzleEl.querySelector('#puzzle_' + puzzle).selected = true;
		setupForPuzzle();
	}
};

const selectPuzzle = () => {
	timerSettings.puzzle = timerSettings.selectPuzzleEl.value;
	console.log(`timerSettings.puzzle: ${timerSettings.puzzle}`);
	setConfig();
	setupForPuzzle();
};

export {initPuzzle, setupForPuzzle, selectPuzzle};
