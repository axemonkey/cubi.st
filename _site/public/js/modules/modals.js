// import {timerSettings} from './settings.js';
// import {hardStop} from './timer.js';
// import {lz} from './tools.js';

// const updateModal = () => {
// 	const modal = document.querySelector(`#${timerSettings.deleteTimesModalId}`);
// 	if (modal) {
// 		const spans = modal.querySelectorAll('.puzzle');

// 		for (const span in spans) {
// 			if (Object.prototype.hasOwnProperty.call(spans, span)) {
// 				console.log(span);
// 				spans[span].textContent = timerSettings.puzzle;
// 			}
// 		}
// 	}
// };

// const resetInfoTabs = () => {
// 	console.log('resetInfoTabs');
// 	const firstTab = document.querySelector('#infoModal input[type="radio"]');
// 	firstTab.click();
// };

// const onShowModal = () => {
// 	document.body.classList.add('modal-visible');
// 	hardStop();
// 	timerSettings.modalVisible = true;
// };

// const onCloseModal = () => {
// 	document.body.classList.remove('modal-visible');
// 	timerSettings.modalVisible = false;
// 	timerSettings.timerEl.focus();
// };

// const infoModal = () => {
// 	MicroModal.show('infoModal', {
// 		debugMode: true,
// 		disableScroll: true,
// 		onShow: () => {
// 			resetInfoTabs();
// 			onShowModal();
// 		},
// 		onClose: () => {
// 			onCloseModal();
// 			resetInfoTabs();
// 		},
// 	});
// 	timerSettings.modalVisible = true;
// };

// const settingsModal = () => {
// 	MicroModal.show('settings-modal', {
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

// const timesListModal = () => {
// 	listTimesForModal();
// 	MicroModal.show('times-list-modal', {
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

// const listTimesForModal = () => {
// 	const times = timerSettings.timesObj[timerSettings.puzzle];
// 	const modal = document.querySelector(`#${timerSettings.timesListModalId}`);
// 	const spans = modal.querySelectorAll('.puzzle');
// 	const timesList = modal.querySelector('#times-modal-list');

// 	console.log('-----> listTimesForModal');
// 	console.log(`timerSettings.puzzle: ${timerSettings.puzzle}`);
// 	console.log(times);

// 	for (const span in spans) {
// 		if (Object.prototype.hasOwnProperty.call(spans, span)) {
// 			console.log(span);
// 			spans[span].textContent = timerSettings.puzzle;
// 		}
// 	}

// 	let listItems = '';
// 	for (let index = times.length - 1; index >= 0; index--) {
// 		const time = times[index];
// 		const listEl = `<li><span class="count">${lz(index + 1, 4)}:</span> <span class="time">${time.time}</span> <span class="timestamp">${time.timestamp}</span> <button class="deleteTime" data-timeindex="${index}">Delete</button></li>`;

// 		listItems += listEl;
// 	}

// 	timesList.innerHTML = listItems;
// };

// export {updateModal, infoModal, settingsModal, timesListModal, onShowModal, onCloseModal, listTimesForModal};
