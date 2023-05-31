import {convertTimeStringToSeconds, convertSecondsToTimeString, sumArray, roundToTwo, sortArray, removeHighestAndLowest} from './tools.js';

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
	const averagesListItemsObjArray = [
		{
			label: 'Average',
			value: averagesObj.average || '...',
			tooltip: 'The mean average of all times recorded for this puzzle',
		},
		{
			label: 'Best time',
			value: averagesObj.best || '...',
			tooltip: 'The fastest time recorded for this puzzle',
		},
		{
			label: 'Average 5',
			value: averagesObj.average5 || '...',
			tooltip: 'The mean average of the most recent 5 times recorded for this puzzle',
		},
		{
			label: 'A3of5',
			value: averagesObj.a3of5 || '...',
			tooltip: 'The mean average of the most recent 5 times recorded for this puzzle, with the fastest and slowest times removed',
		},
		{
			label: 'Average 10',
			value: averagesObj.average10 || '...',
			tooltip: 'The mean average of the most recent 10 times recorded for this puzzle',
		},
		{
			label: 'A10of12',
			value: averagesObj.a10of12 || '...',
			tooltip: 'The mean average of the most recent 12 times recorded for this puzzle, with the fastest and slowest times removed',
		},
	];
	let averagesListItemsHTML = '';

	for (const obj of averagesListItemsObjArray) {
		const listItemHTML = `<li><span class="averageLabelOuter"><span class="averageLabel" title="${obj.tooltip}">${obj.label}:</span></span> <span class="averageTime">${obj.value}</span></li>`;
		averagesListItemsHTML += listItemHTML;
	}

	return prefix + averagesListItemsHTML + suffix;
};

export {getAverages, getAveragesHTML};
