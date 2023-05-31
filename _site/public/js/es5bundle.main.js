(function () {
	'use strict';

	var timerSettings = {
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

	var initOptions = function initOptions() {
	  var optionsEl = document.querySelector('#options');
	  if (optionsEl) {
	    var optionsStrings = ["Puzzle: <strong>".concat(timerSettings.puzzle, "</strong>"), "Inspection: <strong>".concat(timerSettings.countdownDuration, "s</strong>"), "Theme: <strong>".concat(timerSettings.theme, "</strong>"), "Sound: <strong>".concat(timerSettings.soundsOn ? 'On' : 'Off', "</strong>"), "Focus: <strong>".concat(timerSettings.focusOn ? 'On' : 'Off', "</strong>")];
	    var html = optionsStrings.join(' ~&bull;~ ');
	    optionsEl.innerHTML = html;
	    document.querySelector('#scramble-container .puzzle').innerHTML = timerSettings.puzzle;
	  }
	};

	var getConfig = function getConfig() {
	  console.log('getting config');
	  var ls = localStorage.getItem(timerSettings.configStorageItem);
	  var configObjString = ls || '{}';
	  timerSettings.configObj = JSON.parse(configObjString);
	  logConfig();
	};
	var setConfig = function setConfig() {
	  var configObj = {
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

	var initDebug = function initDebug() {
	  if (document.querySelector('#debug')) {
	    var getConfigLink = document.querySelector('#getConfig');
	    getConfigLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      getConfig();
	    });
	    var setConfigLink = document.querySelector('#setConfig');
	    setConfigLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      setConfig();
	    });
	    var deleteConfigLink = document.querySelector('#deleteConfig');
	    deleteConfigLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      console.log('deleting config');
	      localStorage.removeItem(timerSettings.configStorageItem);
	    });
	    var logTimesLink = document.querySelector('#logTimes');
	    logTimesLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      console.log('all times:');
	      console.log(timerSettings.timesObj);
	    });
	    var deleteTimesLink = document.querySelector('#deleteTimes');
	    deleteTimesLink.addEventListener('click', function (event) {
	      event.preventDefault();
	      console.log('deleting all times');
	      localStorage.removeItem(timerSettings.timesStorageItem);
	    });
	  }
	};
	var logConfig = function logConfig() {
	  // TODO - that nifty thing Morgan C wrote
	  console.log(timerSettings.configObj);
	};

	function _iterableToArrayLimit(arr, i) {
	  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
	  if (null != _i) {
	    var _s,
	      _e,
	      _x,
	      _r,
	      _arr = [],
	      _n = !0,
	      _d = !1;
	    try {
	      if (_x = (_i = _i.call(arr)).next, 0 === i) {
	        if (Object(_i) !== _i) return;
	        _n = !1;
	      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
	    } catch (err) {
	      _d = !0, _e = err;
	    } finally {
	      try {
	        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
	      } finally {
	        if (_d) throw _e;
	      }
	    }
	    return _arr;
	  }
	}
	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}
	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;
	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	  return arr2;
	}
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _createForOfIteratorHelper(o, allowArrayLike) {
	  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
	  if (!it) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	      if (it) o = it;
	      var i = 0;
	      var F = function () {};
	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }
	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }
	  var normalCompletion = true,
	    didErr = false,
	    err;
	  return {
	    s: function () {
	      it = it.call(o);
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	var lz = function lz(n) {
	  var desiredLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  // return (n > 9 ? n.toString() : '0' + n);
	  var numString = n.toString();
	  while (numString.length < desiredLength) {
	    numString = '0' + numString;
	  }
	  return numString;
	};
	var formatTime = function formatTime(ms) {
	  var seconds = Math.floor(ms / 1000);
	  var minutes = Math.floor(seconds / 60);
	  var milliseconds = ms % 1000;
	  var hundredths = Math.floor(milliseconds / 10);
	  return lz(minutes) + '.' + lz(seconds % 60) + '.' + lz(hundredths);
	};
	var sumArray = function sumArray(arrayOfNumbers) {
	  return arrayOfNumbers.reduce(function (acc, val) {
	    return acc + val;
	  }, 0);
	};
	var roundToTwo = function roundToTwo(num) {
	  return Number(Math.round(num + 'e+2') + 'e-2');
	};
	var sortNumber = function sortNumber(a, b) {
	  return a - b;
	};
	var sortArray = function sortArray(arrayOfNumbers) {
	  var sortedArray = arrayOfNumbers.concat().sort(sortNumber);
	  return sortedArray;
	};
	var removeHighestAndLowest = function removeHighestAndLowest(arrayOfNumbers) {
	  var sortedArray = sortArray(arrayOfNumbers);
	  var arrayWithoutExtremes = sortedArray.slice(1, -1);
	  return arrayWithoutExtremes;
	};
	var convertTimeStringToSeconds = function convertTimeStringToSeconds(timeString) {
	  var timeStringSplit = timeString.split('.');
	  var minutes = Number(timeStringSplit[0]);
	  var seconds = Number(timeStringSplit[1]);
	  var hundredths = Number(timeStringSplit[2]);
	  var timeInSeconds = minutes * 60 + seconds + hundredths / 100;
	  return timeInSeconds;
	};
	var convertSecondsToTimeString = function convertSecondsToTimeString(timeInSeconds) {
	  var minutes = Math.floor(timeInSeconds / 60);
	  var leftoverSeconds = timeInSeconds - minutes * 60;
	  var seconds = Math.floor(leftoverSeconds);
	  var hundredths = Math.round(roundToTwo(timeInSeconds - Math.floor(timeInSeconds)) * 100);
	  var timeString = [lz(minutes), lz(seconds), lz(hundredths)].join('.');
	  console.log("timeInSeconds: ".concat(timeInSeconds));
	  console.log("Math.floor(timeInSeconds): ".concat(Math.floor(timeInSeconds)));
	  console.log("timeInSeconds - Math.floor(timeInSeconds): ".concat(timeInSeconds - Math.floor(timeInSeconds)));
	  console.log("minutes: ".concat(minutes));
	  console.log("leftoverSeconds: ".concat(leftoverSeconds));
	  console.log("seconds: ".concat(seconds));
	  console.log("hundredths: ".concat(hundredths));
	  console.log("timeString: ".concat(timeString));
	  return timeString;
	};

	var moveConfigs = {
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

	var getModifier = function getModifier() {
	  var modifiers = [{
	    text: '',
	    label: '90º clockwise'
	  }, {
	    text: '&rsquo;',
	    label: '90º anticlockwise'
	  }, {
	    text: '2',
	    label: '180º'
	  }];
	  var r = Math.floor(Math.random() * modifiers.length);
	  return modifiers[r];
	};
	var generateScramble = function generateScramble(puzzle) {
	  var scramble = [];
	  var scrambleConfigs = {
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
	  var puzzleConfig = scrambleConfigs[puzzle];
	  while (scramble.length < puzzleConfig.numMoves) {
	    var randMove = Math.floor(Math.random() * puzzleConfig.turns.length);
	    var move = puzzleConfig.turns[randMove];
	    var modifier = getModifier();
	    var pushMove = function pushMove(move, modifier) {
	      scramble.push({
	        move: move,
	        modifier: modifier
	      });
	    };
	    if (scramble.length === 0) {
	      // is first move
	      pushMove(move, modifier);
	    } else {
	      var prevAxis = scramble[scramble.length - 1].move.axis;
	      if (prevAxis !== move.axis) {
	        pushMove(move, modifier);
	      }
	    }
	  }
	  return scramble;
	};
	var getScramble = function getScramble() {
	  return generateScramble(timerSettings.puzzle);
	};
	var showScramble = function showScramble() {
	  if (timerSettings.scrambleEl) {
	    var scramble = getScramble();
	    console.log(scramble);
	    var scrambleHTML = '<ul>';
	    var scrambleSuffix = '</ul>';
	    var _iterator = _createForOfIteratorHelper(scramble),
	      _step;
	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        var element = _step.value;
	        scrambleHTML += "<li><span class=\"moveLabel\" title=\"Turn the ".concat([element.move.label, element.modifier.label].join(' '), "\">").concat(element.move.text + element.modifier.text, "</span></li>");
	      }
	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
	    }
	    scrambleHTML += scrambleSuffix;
	    timerSettings.scrambleEl.innerHTML = scrambleHTML;
	  }
	};

	var updateModal = function updateModal() {
	  var modal = document.querySelector("#".concat(timerSettings.deleteTimesModalId));
	  if (modal) {
	    var spans = modal.querySelectorAll('.puzzle');
	    for (var span in spans) {
	      if (Object.prototype.hasOwnProperty.call(spans, span)) {
	        console.log(span);
	        spans[span].textContent = timerSettings.puzzle;
	      }
	    }
	  }
	};
	var onShowModal = function onShowModal() {
	  document.body.classList.add('modal-visible');
	  hardStop();
	  timerSettings.modalVisible = true;
	};
	var onCloseModal = function onCloseModal() {
	  document.body.classList.remove('modal-visible');
	  timerSettings.modalVisible = false;
	  timerSettings.timerEl.focus();
	};
	var settingsModal = function settingsModal() {
	  MicroModal.show('settings-modal', {
	    debugMode: true,
	    disableScroll: true,
	    onShow: function onShow() {
	      onShowModal();
	    },
	    onClose: function onClose() {
	      onCloseModal();
	    }
	  });
	  timerSettings.modalVisible = true;
	};
	var timesListModal = function timesListModal() {
	  listTimesForModal();
	  MicroModal.show('times-list-modal', {
	    debugMode: true,
	    disableScroll: true,
	    onShow: function onShow() {
	      onShowModal();
	    },
	    onClose: function onClose() {
	      onCloseModal();
	    }
	  });
	  timerSettings.modalVisible = true;
	};
	var listTimesForModal = function listTimesForModal() {
	  var times = timerSettings.timesObj[timerSettings.puzzle];
	  var modal = document.querySelector("#".concat(timerSettings.timesListModalId));
	  var spans = modal.querySelectorAll('.puzzle');
	  var timesList = modal.querySelector('#times-modal-list');
	  console.log('-----> listTimesForModal');
	  console.log("timerSettings.puzzle: ".concat(timerSettings.puzzle));
	  console.log(times);
	  for (var span in spans) {
	    if (Object.prototype.hasOwnProperty.call(spans, span)) {
	      console.log(span);
	      spans[span].textContent = timerSettings.puzzle;
	    }
	  }
	  var listItems = '';
	  for (var index = times.length - 1; index >= 0; index--) {
	    var time = times[index];
	    var listEl = "<li><span class=\"count\">".concat(lz(index + 1, 4), ":</span> <span class=\"time\">").concat(time.time, "</span> <span class=\"timestamp\">").concat(time.timestamp, "</span> <button class=\"deleteTime\" data-timeindex=\"").concat(index, "\">Delete</button></li>");
	    listItems += listEl;
	  }
	  timesList.innerHTML = listItems;
	};

	var setupForPuzzle = function setupForPuzzle() {
	  hardStop();
	  getTimesForPuzzle();
	  showScramble();
	  updateModal();
	};
	var initPuzzle = function initPuzzle() {
	  var puzzle = timerSettings.defaults.puzzle;
	  if (timerSettings.configObj.puzzle) {
	    puzzle = timerSettings.configObj.puzzle;
	  }
	  timerSettings.puzzle = puzzle;
	  console.log("timerSettings.puzzle: ".concat(timerSettings.puzzle));
	  if (timerSettings.selectPuzzleEl) {
	    var _iterator = _createForOfIteratorHelper(timerSettings.selectPuzzleEl.querySelectorAll('option')),
	      _step;
	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        var elem = _step.value;
	        var puzzleOption = elem;
	        puzzleOption.selected = false;
	      }
	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
	    }
	    timerSettings.selectPuzzleEl.querySelector('#puzzle_' + puzzle).selected = true;
	    setupForPuzzle();
	  }
	};
	var selectPuzzle = function selectPuzzle() {
	  timerSettings.puzzle = timerSettings.selectPuzzleEl.value;
	  console.log("timerSettings.puzzle: ".concat(timerSettings.puzzle));
	  setConfig();
	  setupForPuzzle();
	};

	var getAverages = function getAverages(timeStringsArray) {
	  if (!timeStringsArray || timeStringsArray.length === 0) {
	    return {};
	  }
	  var times = [];
	  var averages = {};
	  var _iterator = _createForOfIteratorHelper(timeStringsArray.entries()),
	    _step;
	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      var _step$value = _slicedToArray(_step.value, 2),
	        time = _step$value[0],
	        element = _step$value[1];
	      times[time] = convertTimeStringToSeconds(element.time);
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
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
	var getAverage = function getAverage(times, howMany, removeExtremes) {
	  var timesToCheck = [];
	  var howManyToCheck = howMany;
	  for (var count = 0; count < howMany; count++) {
	    timesToCheck.push(times[times.length - 1 - count]);
	  }
	  if (removeExtremes) {
	    timesToCheck = removeHighestAndLowest(timesToCheck);
	    howManyToCheck = howMany - 2;
	  }
	  var total = sumArray(timesToCheck);
	  var averageResult = roundToTwo(total / howManyToCheck);
	  return averageResult;
	};
	var getBest = function getBest(times) {
	  var sortedTimes = sortArray(times);
	  console.log('BEST LOL ' + sortedTimes[0]);
	  return sortedTimes[0];
	};
	var getAveragesHTML = function getAveragesHTML(averagesObj) {
	  var prefix = '<ul id="averages-list">';
	  var suffix = '</ul>';
	  var averagesListItemsObjArray = [{
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
	  var averagesListItemsHTML = '';
	  for (var _i = 0, _averagesListItemsObj = averagesListItemsObjArray; _i < _averagesListItemsObj.length; _i++) {
	    var obj = _averagesListItemsObj[_i];
	    var listItemHTML = "<li><span class=\"averageLabelOuter\"><span class=\"averageLabel\" title=\"".concat(obj.tooltip, "\">").concat(obj.label, ":</span></span> <span class=\"averageTime\">").concat(obj.value, "</span></li>");
	    averagesListItemsHTML += listItemHTML;
	  }
	  return prefix + averagesListItemsHTML + suffix;
	};

	var clearTimesDialog = function clearTimesDialog() {
	  MicroModal.show(timerSettings.deleteTimesModalId, {
	    debugMode: true,
	    disableScroll: true,
	    onShow: function onShow() {
	      onShowModal();
	    },
	    onClose: function onClose() {
	      onCloseModal();
	    }
	  });
	  timerSettings.modalVisible = true;
	};
	var getTimesForPuzzle = function getTimesForPuzzle(newTime) {
	  var timesPanel = document.querySelector('#times');
	  if (timesPanel) {
	    console.log('getting times');
	    var ls = localStorage.getItem(timerSettings.timesStorageItem);
	    var timesObjString = ls || '{}';
	    var timesArray = [];
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
	    var firstTimeToShow = 0;
	    var showMoreLink = false;
	    if (timesArray.length > timerSettings.timesListLength) {
	      firstTimeToShow = timesArray.length - timerSettings.timesListLength;
	      showMoreLink = true;
	    }
	    var listPrefix = "<div id=\"times-container\"><h2>Times for ".concat(timerSettings.puzzle, "</h2><button id=\"clear-times\">Clear</button><div id=\"times-list-outer\"><ul id=\"times-list\">");
	    var listSuffix = '</ul>';
	    if (showMoreLink) {
	      listSuffix += "<a id=\"view-all-link\" href=\"/times/".concat(timerSettings.puzzle, "\">View all</a>");
	    }
	    listSuffix += '</div></div>';
	    var listItems = '';
	    var timeAdditionalClass = newTime ? ' new' : '';
	    for (var i = firstTimeToShow; i < timesArray.length; i++) {
	      listItems += '<li><span class="count">';
	      listItems += lz(i + 1, 4);
	      listItems += ":</span> <span class=\"time".concat(i === timesArray.length - 1 ? timeAdditionalClass : '', "\"");
	      if (timesArray[i].timestamp) {
	        listItems += " title=\"".concat(timesArray[i].timestamp, "\"");
	      }
	      listItems += ">";
	      listItems += timesArray[i].time;
	      listItems += '</span>';
	      listItems += "<button class=\"deleteTime\" data-timeindex=\"".concat(i, "\">Delete</button>");
	      listItems += '</li>';
	    }
	    var averages = getAverages(timesArray);
	    console.log(averages);
	    var averagesHTML = getAveragesHTML(averages);
	    timesPanel.innerHTML = listPrefix + listItems + listSuffix + averagesHTML;
	    document.querySelector('#times-list-outer').scrollTop = document.querySelector('#times-list').offsetHeight;
	    document.querySelector('#clear-times').addEventListener('click', function (event) {
	      event.preventDefault();
	      event.target.blur();
	      clearTimesDialog();
	    });
	  }
	};
	var removeNewClass = function removeNewClass() {
	  var timesPanel = document.querySelector('#times');
	  var timesEls = timesPanel.querySelectorAll('.time');
	  var _iterator = _createForOfIteratorHelper(timesEls),
	    _step;
	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      var timeEl = _step.value;
	      timeEl.classList.remove('new');
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
	  }
	};
	var storeTimesObj = function storeTimesObj() {
	  localStorage.setItem(timerSettings.timesStorageItem, JSON.stringify(timerSettings.timesObj));
	};
	var deleteTime = function deleteTime(button) {
	  var timeIndex = button.dataset.timeindex;
	  console.log("timeIndex: ".concat(timeIndex));
	  console.log('times before:');
	  console.log(timerSettings.timesObj[timerSettings.puzzle]);
	  timerSettings.timesObj[timerSettings.puzzle].splice(timeIndex, 1);
	  console.log('times after:');
	  console.log(timerSettings.timesObj[timerSettings.puzzle]);
	  storeTimesObj();
	  getTimesForPuzzle();

	  // if times modal is visible, update the list there too
	  if (document.querySelector("#".concat(timerSettings.timesListModalId)).classList.contains('is-open')) {
	    listTimesForModal();
	  }
	};
	var clearTimes = function clearTimes() {
	  timerSettings.timesObj[timerSettings.puzzle] = [];
	  storeTimesObj();
	  setupForPuzzle();
	  MicroModal.close(timerSettings.deleteTimesModalId);
	};
	var storeTime = function storeTime() {
	  var time = timerSettings.timerEl.textContent;
	  var timesForPuzzle = [];
	  console.log("storing ".concat(time));
	  if (timerSettings.timesObj[timerSettings.puzzle]) {
	    timesForPuzzle = timerSettings.timesObj[timerSettings.puzzle];
	  }
	  timesForPuzzle.push({
	    time: time,
	    timestamp: moment().format('DD-MM-YYYY, HH:MM:SS')
	  });
	  // timesForPuzzle.push(time);
	  timerSettings.timesObj[timerSettings.puzzle] = timesForPuzzle;
	  storeTimesObj();
	  getTimesForPuzzle(true);
	};

	var initTimerButton = function initTimerButton() {
	  if (timerSettings.timerEl) {
	    var newButton = document.createElement('button');
	    newButton.id = 'timer';
	    newButton.innerHTML = timerSettings.timerEl.innerHTML;
	    timerSettings.timerEl.parentNode.replaceChild(newButton, timerSettings.timerEl);
	    timerSettings.timerEl = newButton;
	  }
	};
	var hardStop = function hardStop() {
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
	var checkTimer = function checkTimer() {
	  console.log('checkTimer');
	  timerSettings.currTime = Date.now();
	  var diff = timerSettings.currTime - timerSettings.startTime;
	  timerSettings.timerEl.textContent = formatTime(diff);
	};
	var startTimer = function startTimer() {
	  console.log('start timer');
	  timerSettings.timerEl.classList.add('start');
	  window.setTimeout(function () {
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
	    timerSettings.timerIntervalVar = window.setInterval(function () {
	      checkTimer();
	    }, timerSettings.timerInterval);
	  }
	  if (timerSettings.soundsOn) {
	    document.querySelector('#sounds-startTimer').play();
	  }
	  timerSettings.timerEl.focus();
	};
	var stopTimer = function stopTimer() {
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
	    window.setTimeout(function () {
	      timerSettings.timerRunning = false;
	      timerSettings.cooldown = false;
	      timerSettings.timerEl.classList.remove('cooldown');
	    }, timerSettings.cooldownMs);
	  }
	};

	var initCountdownDuration = function initCountdownDuration() {
	  var duration = Number(timerSettings.defaults.countdownDuration);
	  if (timerSettings.configObj.countdownDuration) {
	    duration = Number(timerSettings.configObj.countdownDuration);
	  }
	  timerSettings.countdownDuration = duration;
	  if (timerSettings.countdownDurationEl) {
	    var _iterator = _createForOfIteratorHelper(timerSettings.countdownDurationEl.querySelectorAll('option')),
	      _step;
	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        var elem = _step.value;
	        var dropdownOption = elem;
	        dropdownOption.selected = false;
	      }
	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
	    }
	    timerSettings.countdownDurationEl.querySelector('#duration' + duration).selected = true;
	  }
	};
	var getCountdownDuration = function getCountdownDuration() {
	  timerSettings.countdownDuration = Number(timerSettings.countdownDurationEl.value);
	  console.log("timerSettings.countdownDuration: ".concat(timerSettings.countdownDuration));
	  setConfig();
	};
	var startCountdown = function startCountdown() {
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
	  timerSettings.timerIntervalVar = window.setInterval(function () {
	    checkCountdown();
	  }, timerSettings.countdownInterval);
	};
	var checkCountdown = function checkCountdown() {
	  timerSettings.currTime = Date.now();
	  var diff = timerSettings.currTime - timerSettings.startTime;
	  var seconds = Math.floor(diff / 1000);
	  var secondsLeft = timerSettings.countdownDuration - seconds;
	  timerSettings.timerEl.textContent = secondsLeft.toString();
	  if (secondsLeft === 0) {
	    timerSettings.timerEl.classList.remove('flash');
	    return startTimer();
	  }
	  if (secondsLeft < 4 && timerSettings.countdownPings[secondsLeft] !== true) {
	    timerSettings.countdownPings[secondsLeft] = true;
	    timerSettings.timerEl.classList.add('flash');
	    window.setTimeout(function () {
	      timerSettings.timerEl.classList.remove('flash');
	    }, 750);
	    if (timerSettings.soundsOn) {
	      document.querySelector('#sounds-ping').play();
	    }
	  }
	};

	var initSounds = function initSounds() {
	  var sounds = timerSettings.defaults.soundsOn;
	  if (timerSettings.configObj.soundsOn) {
	    sounds = timerSettings.configObj.soundsOn;
	  }
	  timerSettings.soundsOn = sounds;
	  console.log("timerSettings.soundsOn: ".concat(timerSettings.soundsOn));
	  if (timerSettings.soundCheckbox) {
	    timerSettings.soundCheckbox.checked = sounds;
	  }
	};
	var checkSoundsCheckbox = function checkSoundsCheckbox() {
	  timerSettings.soundsOn = timerSettings.soundCheckbox.checked;
	  console.log("timerSettings.soundsOn: ".concat(timerSettings.soundsOn));
	  setConfig();
	};

	var initFocus = function initFocus() {
	  var focus = timerSettings.defaults.focusOn;
	  if (timerSettings.configObj.focusOn) {
	    focus = timerSettings.configObj.focusOn;
	  }
	  timerSettings.focusOn = focus;
	  console.log("timerSettings.focusOn: ".concat(timerSettings.focusOn));
	  if (timerSettings.focusCheckbox) {
	    timerSettings.focusCheckbox.checked = focus;
	  }
	};
	var checkFocusCheckbox = function checkFocusCheckbox() {
	  timerSettings.focusOn = timerSettings.focusCheckbox.checked;
	  console.log("timerSettings.focusOn: ".concat(timerSettings.focusOn));
	  setConfig();
	};

	var initTheme = function initTheme() {
	  var theme = timerSettings.defaults.theme;
	  if (timerSettings.configObj.theme) {
	    theme = timerSettings.configObj.theme;
	  }
	  clearTheme();
	  timerSettings.theme = theme;
	  document.body.classList.add(theme);
	  setThemeDropdown();
	  console.log("timerSettings.theme: ".concat(timerSettings.theme));
	};
	var checkThemeDropdown = function checkThemeDropdown() {
	  timerSettings.theme = timerSettings.themeDropdown.value;
	  clearTheme();
	  document.body.classList.add(timerSettings.theme);
	  setConfig();
	};
	var getThemes = function getThemes() {
	  return timerSettings.themesAvailable;
	};
	var clearTheme = function clearTheme() {
	  var allThemes = getThemes();
	  var _iterator = _createForOfIteratorHelper(allThemes),
	    _step;
	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      var theme = _step.value;
	      document.body.classList.remove(theme);
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
	  }
	};
	var setThemeDropdown = function setThemeDropdown() {
	  if (timerSettings.themeDropdown) {
	    var themeOptions = timerSettings.themeDropdown.querySelectorAll('option');
	    var _iterator2 = _createForOfIteratorHelper(themeOptions),
	      _step2;
	    try {
	      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	        var themeOption = _step2.value;
	        if (themeOption.value === timerSettings.theme) {
	          themeOption.selected = true;
	        }
	      }
	    } catch (err) {
	      _iterator2.e(err);
	    } finally {
	      _iterator2.f();
	    }
	  }
	};

	var spacePressed = function spacePressed(element) {
	  if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'select') {
	    return;
	  }
	  if (timerSettings.modalVisible) {
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
	var escPressed = function escPressed() {
	  hardStop();
	};
	var onFirstHover = function onFirstHover() {
	  hoverActivate();
	};
	var hoverActivate = function hoverActivate() {
	  timerSettings.userCanHover = true;
	  document.body.classList.add('hover');
	  window.removeEventListener('mouseover', onFirstHover, false);
	};

	var init = function init() {
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
	    timerSettings.timerEl.addEventListener('click', function (event) {
	      console.log('timer clicked');
	      console.log('timerSettings.timerRunning: ' + timerSettings.timerRunning);
	      console.log('timerSettings.countdownRunning: ' + timerSettings.countdownRunning);
	      event.preventDefault();
	      spacePressed(event.target);
	    }, false);
	  }
	  if (timerSettings.countdownDurationEl) {
	    timerSettings.countdownDurationEl.addEventListener('change', function () {
	      getCountdownDuration();
	    });
	  }
	  if (timerSettings.soundCheckbox) {
	    timerSettings.soundCheckbox.addEventListener('change', function () {
	      checkSoundsCheckbox();
	    });
	  }
	  if (timerSettings.focusCheckbox) {
	    timerSettings.focusCheckbox.addEventListener('change', function () {
	      checkFocusCheckbox();
	    });
	  }
	  if (timerSettings.themeDropdown) {
	    timerSettings.themeDropdown.addEventListener('change', function () {
	      checkThemeDropdown();
	    });
	  }
	  if (timerSettings.selectPuzzleEl) {
	    timerSettings.selectPuzzleEl.addEventListener('change', function () {
	      selectPuzzle();
	    });
	  }
	  document.addEventListener('keydown', function (event) {
	    if (event.key === 'Escape') {
	      escPressed();
	    }
	    if (event.key === ' ' && event.target.tagName.toLowerCase() === 'body') {
	      timerSettings.timerEl.focus();
	      spacePressed(timerSettings.timerEl);
	    }
	  });
	  document.addEventListener('click', function (event) {
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
	    if (event.target.id === 'view-all-link') {
	      console.log('#view-all-link clicked');
	      timesListModal();
	    }
	    if (event.target.id === 'settings-button') {
	      console.log('#settings-button clicked');
	      settingsModal();
	    }
	  });
	  document.addEventListener('touchend', function (event) {
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

})();
