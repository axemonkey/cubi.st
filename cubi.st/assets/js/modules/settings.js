const timerSettings = {
	showDebug: true,
	userCanHover: false,
	timerInterval: 25,
	timerIntervalVar: undefined,
	countdownInterval: 25,
	countdownIntervalVar: undefined,
	timerEl: document.querySelector('#timer'),
	soundCheckbox: document.querySelector('#sound-checkbox'),
	focusCheckbox: document.querySelector('#focus-checkbox'),
	themeDropdown: document.querySelector('#theme-dropdown'),
	countdownDurationEl: document.querySelector('#countdown-duration'),
	selectPuzzleEl: document.querySelector('#select-puzzle'),
	scrambleContainerEl: document.querySelector('#scramble-container'),
	scrambleEl: document.querySelector('#scramble'),
	deleteTimesModalId: 'delete-times-modal',
	timesListModalId: 'times-list-modal',
	defaultState: 'START',
	startTime: undefined,
	currTime: undefined,
	timerRunning: false,
	countdownRunning: false,
	countdownPings: [],
	cooldown: false,
	cooldownMs: 1000,
	modalVisible: false,
	configStorageItem: 'cmCubeTimerConfig',
	timesStorageItem: 'cmCubeTimerTimes',
	configObj: {},
	timesObj: {},
	timesListLength: 10,
	themesAvailable: [
		'Dark',
		'Light',
		'Newspaper',
		'Trinity',
		'ADHD',
	],
	defaults: {
		soundsOn: true,
		focusOn: false,
		countdownDuration: '15',
		theme: 'Dark',
		puzzle: '3x3x3',
	},
};

export {timerSettings};
