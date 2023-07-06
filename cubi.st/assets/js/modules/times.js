import {timerSettings} from './settings.js';
import {setupForPuzzle} from './puzzle.js';
import {getAverages, getAveragesHTML} from './averages.js';
import {lz} from './tools.js';
// import {onShowModal, onCloseModal} from './modals.js';

// const clearTimesDialog = () => {
// 	MicroModal.show(timerSettings.deleteTimesModalId, {
// 		debugMode: true,
// 		disableScroll: true,
// 		onShow: () => {
// 			onShowModal();
// 		},
// 		onClose: () => {
// 			onCloseModal();
// 		},
// 	});
// 	timerSettings.modalVisible = true;
// };

const populateTimesObj = () => {
	const ls = localStorage.getItem(timerSettings.timesStorageItem);
	const timesObjString = ls || '{}';
	timerSettings.timesObj = JSON.parse(timesObjString);
};

const clearTimesInlinePopup = () => {
	console.log('-----> clearTimesInlinePopup');

	document.querySelector('#clear-times-confirm').classList.remove('hide');
};

const dismissTimesInlinePopup = () => {
	document.querySelector('#clear-times-confirm').classList.add('hide');
};

const getTimesForPuzzle = newTime => {
	const timesPanel = document.querySelector('#times');

	if (timesPanel) {
		console.log('getting times');
		let timesArray = [];

		populateTimesObj();

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

		const listPrefix = `<div id="times-container"><h2>Times for ${timerSettings.puzzle}</h2><button id="clear-times">Clear</button><div id="clear-times-confirm" class="inline-popup hide"><p>Delete all times for ${timerSettings.puzzle}?</p><div class="confirm-buttons-holder"><button id="clear-times-for-real" class="warning-button">Yes, delete them</button><button id="clear-times-cancel">No, keep them</button></div></div><div id="times-list-outer"><ul id="times-list">`;
		let listSuffix = '</ul>';
		if (showMoreLink) {
			listSuffix += `<a id="view-all-link" href="/times/?puzzle=${timerSettings.puzzle}">View all</a>`;
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
			// clearTimesDialog();
			clearTimesInlinePopup();
		});

		document.querySelector('#clear-times-for-real').addEventListener('click', event => {
			event.preventDefault();
			event.target.blur();
			clearTimes();
		});

		document.querySelector('#clear-times-cancel').addEventListener('click', event => {
			event.preventDefault();
			event.target.blur();
			dismissTimesInlinePopup();
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
	// if (document.querySelector(`#${timerSettings.timesListModalId}`).classList.contains('is-open')) {
	// 	listTimesForModal();
	// }

	if (document.querySelector('#times-full-list')) {
		initTimesList();
	}
};

const clearTimes = () => {
	timerSettings.timesObj[timerSettings.puzzle] = [];
	storeTimesObj();
	setupForPuzzle();
	// MicroModal.close(timerSettings.deleteTimesModalId);
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

const initTimesList = () => {
	const timesList = document.querySelector('#times-full-list');

	if (timesList) {
		populateTimesObj();
		const times = timerSettings.timesObj[timerSettings.puzzle];
		const spans = document.querySelectorAll('.puzzle');

		console.log('-----> initTimesList');

		console.log('\n\n-----> BIG DUMP\n\n');
		console.log(timerSettings.timesObj);
		console.log('\n\n-----> END BIG DUMP\n\n');

		console.log(`timerSettings.puzzle: ${timerSettings.puzzle}`);
		console.log(times);

		for (const span in spans) {
			if (Object.prototype.hasOwnProperty.call(spans, span)) {
				console.log(`span: ${span}`);
				spans[span].textContent = timerSettings.puzzle;
			}
		}

		if (times && times.length > 0) {
			let listItems = '';
			for (let index = times.length - 1; index >= 0; index--) {
				const time = times[index];
				const listEl = `<li><span class="count">${lz(index + 1, 4)}:</span> <span class="time">${time.time}</span> <span class="timestamp">${time.timestamp}</span> <button class="deleteTime" data-timeindex="${index}">Delete</button></li>`;

				listItems += listEl;
			}

			timesList.innerHTML = listItems;
		} else {
			timesList.innerHTML = `<li>No times recorded</li>`;
		}
	}
};

export {getTimesForPuzzle, deleteTime, clearTimes, storeTime, removeNewClass, populateTimesObj, initTimesList};
