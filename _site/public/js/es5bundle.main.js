(function () {
	'use strict';

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
	  themesAvailable: ['Dark', 'Light', 'Newspaper', 'Trinity', 'ADHD'],
	  defaults: {
	    soundsOn: true,
	    focusOn: false,
	    countdownDuration: '15',
	    theme: 'Dark',
	    puzzle: '3x3x3'
	  }
	};

	const initOptions = () => {
	  const optionsEl = document.querySelector('#options');
	  if (optionsEl) {
	    const optionsStrings = [`Puzzle: <strong>${timerSettings.puzzle}</strong>`, `Inspection: <strong>${timerSettings.countdownDuration}s</strong>`, `Theme: <strong>${timerSettings.theme}</strong>`, `Sound: <strong>${timerSettings.soundsOn ? 'On' : 'Off'}</strong>`, `Focus: <strong>${timerSettings.focusOn ? 'On' : 'Off'}</strong>`];
	    const html = optionsStrings.join(' ~&bull;~ ');
	    optionsEl.innerHTML = html;
	    document.querySelector('#scramble-container .puzzle').innerHTML = timerSettings.puzzle;
	  }
	};

	const logConfig = () => {
	  console.log(timerSettings.configObj);
	};
	const getConfig = () => {
	  console.log('getting config');
	  const ls = localStorage.getItem(timerSettings.configStorageItem);
	  const configObjString = ls || '{}';
	  timerSettings.configObj = JSON.parse(configObjString);
	  logConfig();
	};
	const setConfig = () => {
	  const configObj = {
	    soundsOn: timerSettings.soundsOn,
	    focusOn: timerSettings.focusOn,
	    countdownDuration: timerSettings.countdownDuration.toString(),
	    theme: timerSettings.theme,
	    puzzle: timerSettings.puzzle
	  };
	  console.log('setting config');
	  timerSettings.configObj = configObj;
	  localStorage.setItem(timerSettings.configStorageItem, JSON.stringify(configObj));
	  logConfig();
	  initOptions();
	};

	const initDebug = () => {
	  if (document.querySelector('#debug')) {
	    const getConfigLink = document.querySelector('#getConfig');
	    getConfigLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      getConfig();
	    });
	    const setConfigLink = document.querySelector('#setConfig');
	    setConfigLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      setConfig();
	    });
	    const deleteConfigLink = document.querySelector('#deleteConfig');
	    deleteConfigLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      console.log('deleting config');
	      localStorage.removeItem(timerSettings.configStorageItem);
	    });
	    const logTimesLink = document.querySelector('#logTimes');
	    logTimesLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      console.log('all times:');
	      console.log(timerSettings.timesObj);
	    });
	    const deleteTimesLink = document.querySelector('#deleteTimes');
	    deleteTimesLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      console.log('deleting all times');
	      localStorage.removeItem(timerSettings.timesStorageItem);
	    });
	  }
	};

	const lz = function (n) {
	  let desiredLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  // return (n > 9 ? n.toString() : '0' + n);
	  let numString = n.toString();
	  while (numString.length < desiredLength) {
	    numString = '0' + numString;
	  }
	  return numString;
	};
	const formatTime = ms => {
	  const seconds = Math.floor(ms / 1000);
	  const minutes = Math.floor(seconds / 60);
	  const milliseconds = ms % 1000;
	  const hundredths = Math.floor(milliseconds / 10);
	  return lz(minutes) + '.' + lz(seconds % 60) + '.' + lz(hundredths);
	};
	const sumArray = arrayOfNumbers => {
	  return arrayOfNumbers.reduce((acc, val) => {
	    return acc + val;
	  }, 0);
	};
	const roundToTwo = num => {
	  return Number(Math.round(num + 'e+2') + 'e-2');
	};
	const sortNumber = (a, b) => {
	  return a - b;
	};
	const sortArray = arrayOfNumbers => {
	  const sortedArray = arrayOfNumbers.concat().sort(sortNumber);
	  return sortedArray;
	};
	const removeHighestAndLowest = arrayOfNumbers => {
	  const sortedArray = sortArray(arrayOfNumbers);
	  const arrayWithoutExtremes = sortedArray.slice(1, -1);
	  return arrayWithoutExtremes;
	};
	const convertTimeStringToSeconds = timeString => {
	  const timeStringSplit = timeString.split('.');
	  const minutes = Number(timeStringSplit[0]);
	  const seconds = Number(timeStringSplit[1]);
	  const hundredths = Number(timeStringSplit[2]);
	  const timeInSeconds = minutes * 60 + seconds + hundredths / 100;
	  return timeInSeconds;
	};
	const convertSecondsToTimeString = timeInSeconds => {
	  const minutes = Math.floor(timeInSeconds / 60);
	  const leftoverSeconds = timeInSeconds - minutes * 60;
	  const seconds = Math.floor(leftoverSeconds);
	  const hundredths = Math.round(roundToTwo(timeInSeconds - Math.floor(timeInSeconds)) * 100);
	  const timeString = [lz(minutes), lz(seconds), lz(hundredths)].join('.');
	  console.log(`timeInSeconds: ${timeInSeconds}`);
	  console.log(`Math.floor(timeInSeconds): ${Math.floor(timeInSeconds)}`);
	  console.log(`timeInSeconds - Math.floor(timeInSeconds): ${timeInSeconds - Math.floor(timeInSeconds)}`);
	  console.log(`minutes: ${minutes}`);
	  console.log(`leftoverSeconds: ${leftoverSeconds}`);
	  console.log(`seconds: ${seconds}`);
	  console.log(`hundredths: ${hundredths}`);
	  console.log(`timeString: ${timeString}`);
	  return timeString;
	};

	const moveConfigs = {
	  // 2x2x2, 3x3x3
	  small: [{
	    text: 'F',
	    label: 'front face',
	    axis: 'z'
	  }, {
	    text: 'B',
	    label: 'back face',
	    axis: 'z'
	  }, {
	    text: 'U',
	    label: 'top (up) face',
	    axis: 'y'
	  }, {
	    text: 'D',
	    label: 'bottom (down) face',
	    axis: 'y'
	  }, {
	    text: 'L',
	    label: 'left face',
	    axis: 'x'
	  }, {
	    text: 'R',
	    label: 'right face',
	    axis: 'x'
	  }],
	  // 4x4x4, 5x5x5
	  medium: [{
	    text: 'F',
	    label: 'front face',
	    axis: 'z'
	  }, {
	    text: 'B',
	    label: 'back face',
	    axis: 'z'
	  }, {
	    text: 'U',
	    label: 'top (up) face',
	    axis: 'y'
	  }, {
	    text: 'D',
	    label: 'bottom (down) face',
	    axis: 'y'
	  }, {
	    text: 'L',
	    label: 'left face',
	    axis: 'x'
	  }, {
	    text: 'R',
	    label: 'right face',
	    axis: 'x'
	  }, {
	    text: '2F',
	    label: 'front two layers',
	    axis: 'z'
	  }, {
	    text: '2B',
	    label: 'back two layers',
	    axis: 'z'
	  }, {
	    text: '2U',
	    label: 'top (up) two layers',
	    axis: 'y'
	  }, {
	    text: '2D',
	    label: 'bottom (down) two layers',
	    axis: 'y'
	  }, {
	    text: '2L',
	    label: 'left two layers',
	    axis: 'x'
	  }, {
	    text: '2R',
	    label: 'right two layers',
	    axis: 'x'
	  }],
	  // 6x6x6, 7x7x7
	  large: [{
	    text: 'F',
	    label: 'front face',
	    axis: 'z'
	  }, {
	    text: 'B',
	    label: 'back face',
	    axis: 'z'
	  }, {
	    text: 'U',
	    label: 'top (up) face',
	    axis: 'y'
	  }, {
	    text: 'D',
	    label: 'bottom (down) face',
	    axis: 'y'
	  }, {
	    text: 'L',
	    label: 'left face',
	    axis: 'x'
	  }, {
	    text: 'R',
	    label: 'right face',
	    axis: 'x'
	  }, {
	    text: '2F',
	    label: 'front two layers',
	    axis: 'z'
	  }, {
	    text: '2B',
	    label: 'back two layers',
	    axis: 'z'
	  }, {
	    text: '2U',
	    label: 'top (up) two layers',
	    axis: 'y'
	  }, {
	    text: '2D',
	    label: 'bottom (down) two layers',
	    axis: 'y'
	  }, {
	    text: '2L',
	    label: 'left two layers',
	    axis: 'x'
	  }, {
	    text: '2R',
	    label: 'right two layers',
	    axis: 'x'
	  }, {
	    text: '3F',
	    label: 'front three layers',
	    axis: 'z'
	  }, {
	    text: '3B',
	    label: 'back three layers',
	    axis: 'z'
	  }, {
	    text: '3U',
	    label: 'top (up) three layers',
	    axis: 'y'
	  }, {
	    text: '3D',
	    label: 'bottom (down) three layers',
	    axis: 'y'
	  }, {
	    text: '3L',
	    label: 'left three layers',
	    axis: 'x'
	  }, {
	    text: '3R',
	    label: 'right three layers',
	    axis: 'x'
	  }]
	};

	const getModifier = () => {
	  const modifiers = [{
	    text: '',
	    label: '90º clockwise'
	  }, {
	    text: '&rsquo;',
	    label: '90º anticlockwise'
	  }, {
	    text: '2',
	    label: '180º'
	  }];
	  const r = Math.floor(Math.random() * modifiers.length);
	  return modifiers[r];
	};
	const generateScramble = puzzle => {
	  const scramble = [];
	  const scrambleConfigs = {
	    '2x2x2': {
	      numMoves: 25,
	      turns: moveConfigs.small
	    },
	    '3x3x3': {
	      numMoves: 30,
	      turns: moveConfigs.small
	    },
	    '4x4x4': {
	      numMoves: 35,
	      turns: moveConfigs.medium
	    },
	    '5x5x5': {
	      numMoves: 35,
	      turns: moveConfigs.medium
	    },
	    '6x6x6': {
	      numMoves: 45,
	      turns: moveConfigs.large
	    },
	    '7x7x7': {
	      numMoves: 55,
	      turns: moveConfigs.large
	    }
	  };
	  scrambleConfigs.mirror3x3x3 = scrambleConfigs['3x3x3'];
	  const puzzleConfig = scrambleConfigs[puzzle];
	  while (scramble.length < puzzleConfig.numMoves) {
	    const randMove = Math.floor(Math.random() * puzzleConfig.turns.length);
	    const move = puzzleConfig.turns[randMove];
	    const modifier = getModifier();
	    const pushMove = (move, modifier) => {
	      scramble.push({
	        move,
	        modifier
	      });
	    };
	    if (scramble.length === 0) {
	      // is first move
	      pushMove(move, modifier);
	    } else {
	      const prevAxis = scramble[scramble.length - 1].move.axis;
	      if (prevAxis !== move.axis) {
	        pushMove(move, modifier);
	      }
	    }
	  }
	  return scramble;
	};
	const getScramble = () => {
	  return generateScramble(timerSettings.puzzle);
	};
	const showScramble = () => {
	  if (timerSettings.scrambleEl) {
	    const scramble = getScramble();
	    console.log(scramble);
	    let scrambleHTML = '<ul>';
	    const scrambleSuffix = '</ul>';
	    for (const element of scramble) {
	      scrambleHTML += `<li><span class="moveLabel" title="Turn the ${[element.move.label, element.modifier.label].join(' ')}">${element.move.text + element.modifier.text}</span></li>`;
	    }
	    scrambleHTML += scrambleSuffix;
	    timerSettings.scrambleEl.innerHTML = scrambleHTML;
	  }
	};

	const toasty = options => {
	  const {
	    text,
	    type = 'info'
	  } = options;
	  Toastify({
	    /* eslint-disable-line new-cap */
	    text,
	    className: `toast-${type}`
	  }).showToast();
	};

	const setupForPuzzle = () => {
	  hardStop();
	  getTimesForPuzzle();
	  showScramble();
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
	  toasty({
	    text: `Puzzle: ${timerSettings.puzzle}`
	  });
	  setConfig();
	  setupForPuzzle();
	};

	const getAverages = timeStringsArray => {
	  if (!timeStringsArray || timeStringsArray.length === 0) {
	    return {};
	  }
	  const times = [];
	  const averages = {};
	  for (const [time, element] of timeStringsArray.entries()) {
	    times[time] = convertTimeStringToSeconds(element.time);
	  }
	  averages.average = convertSecondsToTimeString(getAverage(times, times.length));
	  averages.best = convertSecondsToTimeString(getBest(times));
	  if (times.length >= 5) {
	    averages.average5 = convertSecondsToTimeString(getAverage(times, 5));
	    averages.a3of5 = convertSecondsToTimeString(getAverage(times, 5, true));
	  }
	  if (times.length >= 10) {
	    averages.average10 = convertSecondsToTimeString(getAverage(times, 10));
	  }
	  if (times.length >= 12) {
	    averages.a10of12 = convertSecondsToTimeString(getAverage(times, 12, true));
	  }
	  return averages;
	};
	const getAverage = (times, howMany, removeExtremes) => {
	  let timesToCheck = [];
	  let howManyToCheck = howMany;
	  for (let count = 0; count < howMany; count++) {
	    timesToCheck.push(times[times.length - 1 - count]);
	  }
	  if (removeExtremes) {
	    timesToCheck = removeHighestAndLowest(timesToCheck);
	    howManyToCheck = howMany - 2;
	  }
	  const total = sumArray(timesToCheck);
	  const averageResult = roundToTwo(total / howManyToCheck);
	  return averageResult;
	};
	const getBest = times => {
	  const sortedTimes = sortArray(times);
	  console.log('BEST LOL ' + sortedTimes[0]);
	  return sortedTimes[0];
	};
	const getAveragesHTML = averagesObj => {
	  const prefix = '<ul id="averages-list">';
	  const suffix = '</ul>';
	  const averagesListItemsObjArray = [{
	    label: 'Average',
	    value: averagesObj.average || '...',
	    tooltip: 'The mean average of all times recorded for this puzzle'
	  }, {
	    label: 'Best time',
	    value: averagesObj.best || '...',
	    tooltip: 'The fastest time recorded for this puzzle'
	  }, {
	    label: 'Average 5',
	    value: averagesObj.average5 || '...',
	    tooltip: 'The mean average of the most recent 5 times recorded for this puzzle'
	  }, {
	    label: 'A3of5',
	    value: averagesObj.a3of5 || '...',
	    tooltip: 'The mean average of the most recent 5 times recorded for this puzzle, with the fastest and slowest times removed'
	  }, {
	    label: 'Average 10',
	    value: averagesObj.average10 || '...',
	    tooltip: 'The mean average of the most recent 10 times recorded for this puzzle'
	  }, {
	    label: 'A10of12',
	    value: averagesObj.a10of12 || '...',
	    tooltip: 'The mean average of the most recent 12 times recorded for this puzzle, with the fastest and slowest times removed'
	  }];
	  let averagesListItemsHTML = '';
	  for (const obj of averagesListItemsObjArray) {
	    const listItemHTML = `<li><span class="averageLabelOuter"><span class="averageLabel" title="${obj.tooltip}">${obj.label}:</span></span> <span class="averageTime">${obj.value}</span></li>`;
	    averagesListItemsHTML += listItemHTML;
	  }
	  return prefix + averagesListItemsHTML + suffix;
	};

	const populateTimesObj = () => {
	  const ls = localStorage.getItem(timerSettings.timesStorageItem);
	  const timesObjString = ls || '{}';
	  timerSettings.timesObj = JSON.parse(timesObjString);
	};
	const clearTimesInlinePopup = () => {
	  console.log('-----> clearTimesInlinePopup');
	  document.querySelector('#clear-times-confirm').classList.remove('hide');
	};
	const dismissClearTimesInlinePopup = () => {
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
	      listSuffix += `<button id="view-all-button">View all</button>`;
	    }
	    listSuffix += '</div></div>';
	    let listItems = '';
	    const timeAdditionalClass = newTime ? ' new' : '';
	    for (let i = firstTimeToShow; i < timesArray.length; i++) {
	      listItems += '<li><span class="count">';
	      listItems += lz(i + 1, 4);
	      listItems += `:</span> <span class="time${i === timesArray.length - 1 ? timeAdditionalClass : ''}"`;
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
	    document.querySelector('#view-all-button').addEventListener('click', event => {
	      event.preventDefault();
	      event.target.blur();
	      document.location.href = `/times/?puzzle=${timerSettings.puzzle}`;
	    });
	    document.querySelector('#clear-times').addEventListener('click', event => {
	      event.preventDefault();
	      event.target.blur();
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
	      dismissClearTimesInlinePopup();
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
	  if (document.querySelector('#times-full-list')) {
	    initTimesList();
	  }
	};
	const clearTimes = () => {
	  timerSettings.timesObj[timerSettings.puzzle] = [];
	  storeTimesObj();
	  setupForPuzzle();
	};
	const storeTime = () => {
	  const time = timerSettings.timerEl.textContent;
	  const now = new Date();
	  const timestamp = now.toLocaleString('en-GB');
	  let timesForPuzzle = [];
	  console.log(`storing ${time}`);
	  if (timerSettings.timesObj[timerSettings.puzzle]) {
	    timesForPuzzle = timerSettings.timesObj[timerSettings.puzzle];
	  }
	  timesForPuzzle.push({
	    time,
	    timestamp
	  });
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

	const initTimerButton = () => {
	  if (timerSettings.timerEl) {
	    const newButton = document.createElement('button');
	    newButton.id = 'timer';
	    newButton.innerHTML = timerSettings.timerEl.innerHTML;
	    timerSettings.timerEl.parentNode.replaceChild(newButton, timerSettings.timerEl);
	    timerSettings.timerEl = newButton;
	  }
	};
	const hardStop = () => {
	  if (timerSettings.timerEl) {
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
	  }
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

	const initCountdownDuration = () => {
	  let duration = Number(timerSettings.defaults.countdownDuration);
	  if (timerSettings.configObj.countdownDuration) {
	    duration = Number(timerSettings.configObj.countdownDuration);
	  }
	  timerSettings.countdownDuration = duration;
	  if (timerSettings.countdownDurationEl) {
	    for (const elem of timerSettings.countdownDurationEl.querySelectorAll('option')) {
	      const dropdownOption = elem;
	      dropdownOption.selected = false;
	    }
	    timerSettings.countdownDurationEl.querySelector('#duration' + duration).selected = true;
	  }
	};
	const getCountdownDuration = () => {
	  timerSettings.countdownDuration = Number(timerSettings.countdownDurationEl.value);
	  console.log(`timerSettings.countdownDuration: ${timerSettings.countdownDuration}`);
	  toasty({
	    text: `Inspection time set: ${timerSettings.countdownDuration} seconds`
	  });
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

	const initSounds = () => {
	  let sounds = timerSettings.defaults.soundsOn;
	  if (timerSettings.configObj.soundsOn) {
	    sounds = timerSettings.configObj.soundsOn;
	  }
	  timerSettings.soundsOn = sounds;
	  console.log(`timerSettings.soundsOn: ${timerSettings.soundsOn}`);
	  if (timerSettings.soundCheckbox) {
	    timerSettings.soundCheckbox.checked = sounds;
	  }
	};
	const checkSoundsCheckbox = () => {
	  timerSettings.soundsOn = timerSettings.soundCheckbox.checked;
	  console.log(`timerSettings.soundsOn: ${timerSettings.soundsOn}`);
	  toasty({
	    text: `Sounds: ${timerSettings.soundsOn ? 'on' : 'off'}`
	  });
	  setConfig();
	};

	const initFocus = () => {
	  let focus = timerSettings.defaults.focusOn;
	  if (timerSettings.configObj.focusOn) {
	    focus = timerSettings.configObj.focusOn;
	  }
	  timerSettings.focusOn = focus;
	  console.log(`timerSettings.focusOn: ${timerSettings.focusOn}`);
	  if (timerSettings.focusCheckbox) {
	    timerSettings.focusCheckbox.checked = focus;
	  }
	};
	const checkFocusCheckbox = () => {
	  timerSettings.focusOn = timerSettings.focusCheckbox.checked;
	  console.log(`timerSettings.focusOn: ${timerSettings.focusOn}`);
	  toasty({
	    text: `Focus mode: ${timerSettings.focusOn ? 'on' : 'off'}`
	  });
	  setConfig();
	};

	const initTheme = () => {
	  let theme = timerSettings.defaults.theme;
	  if (timerSettings.configObj.theme) {
	    theme = timerSettings.configObj.theme;
	  }
	  clearTheme();
	  timerSettings.theme = theme;
	  document.body.classList.add(theme);
	  setThemeDropdown();
	  console.log(`timerSettings.theme: ${timerSettings.theme}`);
	};
	const checkThemeDropdown = () => {
	  timerSettings.theme = timerSettings.themeDropdown.value;
	  clearTheme();
	  document.body.classList.add(timerSettings.theme);
	  toasty({
	    text: `Theme: ${timerSettings.theme}`
	  });
	  setConfig();
	};
	const getThemes = () => {
	  return timerSettings.themesAvailable;
	};
	const clearTheme = () => {
	  const allThemes = getThemes();
	  for (const theme of allThemes) {
	    document.body.classList.remove(theme);
	  }
	};
	const setThemeDropdown = () => {
	  if (timerSettings.themeDropdown) {
	    const themeOptions = timerSettings.themeDropdown.querySelectorAll('option');
	    for (const themeOption of themeOptions) {
	      if (themeOption.value === timerSettings.theme) {
	        themeOption.selected = true;
	      }
	    }
	  }
	};

	const spacePressed = element => {
	  if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'select') {
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
	  initTimesList();
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
	  });
	  document.addEventListener('touchend', event => {
	    if (timerSettings.countdownRunning || timerSettings.timerRunning) {
	      event.preventDefault();
	      spacePressed(event.target);
	    }
	  }, false);
	};

	// const timerTapped = () => {
	// 	// document.querySelector('h1').innerHTML += 'tapped';
	// 	var element = document.getElementById('timer');
	// 	spacePressed(element);
	// };

	window.addEventListener('load', init);

})();
