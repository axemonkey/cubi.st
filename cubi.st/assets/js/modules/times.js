import {timerSettings} from './settings.js';
import {setupForPuzzle} from './puzzle.js';
import {getAverages, getAveragesHTML} from './averages.js';
import {lz} from './tools.js';
import {onShowModal, onCloseModal, listTimesForModal} from './modals.js';

const clearTimesDialog = () => {
	MicroModal.show(timerSettings.deleteTimesModalId, {
		debugMode: true,
		disableScroll: true,
		onShow: () => {
			onShowModal();
		},
		onClose: () => {
			onCloseModal();
		},
	});
	timerSettings.modalVisible = true;
};

const getTimesForPuzzle = newTime => {
	const timesPanel = document.querySelector('#times');

	if (timesPanel) {
		console.log('getting times');
		const ls = localStorage.getItem(timerSettings.timesStorageItem);
		const timesObjString = ls || '{}';
		let timesArray = [];

		timerSettings.timesObj = JSON.parse(timesObjString);
		if (timerSettings.timesObj[timerSettings.puzzle]) {
			timesArray = timerSettings.timesObj[timerSettings.puzzle];
		}

		console.log('TIMESARRAY');
		console.log(timesArray);

		if (timesArray.length === 0) {
			timesPanel.innerHTML = '';
			return;
		}

		let firstTimeToShow = 0;
		let showMoreLink = false;
		if (timesArray.length > timerSettings.timesListLength) {
			firstTimeToShow = timesArray.length - timerSettings.timesListLength;
			showMoreLink = true;
		}

		const listPrefix = `<div id="times-container"><h2>Times for ${timerSettings.puzzle}</h2><button id="clear-times">Clear</button><div id="times-list-outer"><ul id="times-list">`;
		let listSuffix = '</ul>';
		if (showMoreLink) {
			listSuffix += '<button id="show-more-button">View all</button>';
		}
		listSuffix += '</div></div>';

		let listItems = '';
		const timeAdditionalClass = (newTime ? ' new' : '');

		for (let i = firstTimeToShow; i < timesArray.length; i++) {
			listItems += '<li><span class="count">';
			listItems += lz(i + 1, 4);
			listItems += `:</span> <span class="time${(i === timesArray.length - 1 ? timeAdditionalClass : '')}"`;
			if (timesArray[i].timestamp) {
				listItems += ` title="${timesArray[i].timestamp}"`;
			}
			listItems += `>`;
			listItems += timesArray[i].time;
			listItems += '</span>';
			listItems += `<button class="deleteTime" data-timeindex="${i}">Delete</button>`;
			listItems += '</li>';
		}

		const averages = getAverages(timesArray);
		console.log(averages);
		const averagesHTML = getAveragesHTML(averages);

		timesPanel.innerHTML = listPrefix + listItems + listSuffix + averagesHTML;
		document.querySelector('#times-list-outer').scrollTop = document.querySelector('#times-list').offsetHeight;

		document.querySelector('#clear-times').addEventListener('click', event => {
			event.preventDefault();
			event.target.blur();
			clearTimesDialog();
		});
	}
};

const removeNewClass = () => {
	const timesPanel = document.querySelector('#times');
	const timesEls = timesPanel.querySelectorAll('.time');
	for (const timeEl of timesEls) {
		timeEl.classList.remove('new');
	}
};

const storeTimesObj = () => {
	localStorage.setItem(timerSettings.timesStorageItem, JSON.stringify(timerSettings.timesObj));
};

const deleteTime = button => {
	const timeIndex = button.dataset.timeindex;
	console.log(`timeIndex: ${timeIndex}`);
	console.log('times before:');
	console.log(timerSettings.timesObj[timerSettings.puzzle]);
	timerSettings.timesObj[timerSettings.puzzle].splice(timeIndex, 1);
	console.log('times after:');
	console.log(timerSettings.timesObj[timerSettings.puzzle]);
	storeTimesObj();
	getTimesForPuzzle();

	// if times modal is visible, update the list there too
	if (document.querySelector(`#${timerSettings.timesListModalId}`).classList.contains('is-open')) {
		listTimesForModal();
	}
};

const clearTimes = () => {
	timerSettings.timesObj[timerSettings.puzzle] = [];
	storeTimesObj();
	setupForPuzzle();
	MicroModal.close(timerSettings.deleteTimesModalId);
};

const storeTime = () => {
	const time = timerSettings.timerEl.textContent;
	let timesForPuzzle = [];

	console.log(`storing ${time}`);

	if (timerSettings.timesObj[timerSettings.puzzle]) {
		timesForPuzzle = timerSettings.timesObj[timerSettings.puzzle];
	}

	timesForPuzzle.push({
		time,
		timestamp: moment().format('DD-MM-YYYY, HH:MM:SS'),
	});
	// timesForPuzzle.push(time);
	timerSettings.timesObj[timerSettings.puzzle] = timesForPuzzle;
	storeTimesObj();
	getTimesForPuzzle(true);
};

export {getTimesForPuzzle, deleteTime, clearTimes, storeTime, removeNewClass};
