const lz = (n, desiredLength = 2) => {
	// return (n > 9 ? n.toString() : '0' + n);
	let numString = n.toString();

	while (numString.length < desiredLength) {
		numString = "0" + numString;
	}

	return numString;
};

const ucfirst = (str) => {
	return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
};

const formatTime = (ms) => {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const milliseconds = ms % 1000;
	const hundredths = Math.floor(milliseconds / 10);

	return lz(minutes) + "." + lz(seconds % 60) + "." + lz(hundredths);
};

const sumArray = (arrayOfNumbers) => {
	return arrayOfNumbers.reduce((acc, val) => {
		return acc + val;
	}, 0);
};

const roundToTwo = (num) => {
	return Number(Math.round(num + "e+2") + "e-2");
};

const sortNumber = (a, b) => {
	return a - b;
};

const sortArray = (arrayOfNumbers) => {
	const sortedArray = arrayOfNumbers.concat().sort(sortNumber);
	return sortedArray;
};

const removeHighestAndLowest = (arrayOfNumbers) => {
	const sortedArray = sortArray(arrayOfNumbers);
	const arrayWithoutExtremes = sortedArray.slice(1, -1);

	return arrayWithoutExtremes;
};

const convertTimeStringToSeconds = (timeString) => {
	const timeStringSplit = timeString.split(".");
	const minutes = Number(timeStringSplit[0]);
	const seconds = Number(timeStringSplit[1]);
	const hundredths = Number(timeStringSplit[2]);
	const timeInSeconds = minutes * 60 + seconds + hundredths / 100;

	return timeInSeconds;
};

const convertSecondsToTimeString = (timeInSeconds) => {
	const minutes = Math.floor(timeInSeconds / 60);
	const leftoverSeconds = timeInSeconds - minutes * 60;
	const seconds = Math.floor(leftoverSeconds);
	const hundredths = Math.round(
		roundToTwo(timeInSeconds - Math.floor(timeInSeconds)) * 100,
	);

	const timeString = [lz(minutes), lz(seconds), lz(hundredths)].join(".");

	console.log(`timeInSeconds: ${timeInSeconds}`);
	console.log(`Math.floor(timeInSeconds): ${Math.floor(timeInSeconds)}`);
	console.log(
		`timeInSeconds - Math.floor(timeInSeconds): ${timeInSeconds - Math.floor(timeInSeconds)}`,
	);

	console.log(`minutes: ${minutes}`);
	console.log(`leftoverSeconds: ${leftoverSeconds}`);
	console.log(`seconds: ${seconds}`);
	console.log(`hundredths: ${hundredths}`);

	console.log(`timeString: ${timeString}`);
	return timeString;
};

export {
	formatTime,
	ucfirst,
	lz,
	convertTimeStringToSeconds,
	convertSecondsToTimeString,
	sumArray,
	roundToTwo,
	sortArray,
	sortNumber,
	removeHighestAndLowest,
};
