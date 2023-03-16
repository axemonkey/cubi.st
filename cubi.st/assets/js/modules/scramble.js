import {timerSettings} from './settings.js';
import {moveConfigs} from './move-configs.js';

const getModifier = () => {
	const modifiers = [
		{
			text: '',
			label: '90º clockwise',
		},
		{
			text: '&rsquo;',
			label: '90º anticlockwise',
		},
		{
			text: '2',
			label: '180º',
		},
	];
	const r = Math.floor(Math.random() * modifiers.length);

	return modifiers[r];
};

const generateScramble = puzzle => {
	const scramble = [];
	const scrambleConfigs = {
		'2x2x2': {
			numMoves: 25,
			turns: moveConfigs.small,
		},
		'3x3x3': {
			numMoves: 30,
			turns: moveConfigs.small,
		},
		'4x4x4': {
			numMoves: 35,
			turns: moveConfigs.medium,
		},
		'5x5x5': {
			numMoves: 35,
			turns: moveConfigs.medium,
		},
		'6x6x6': {
			numMoves: 45,
			turns: moveConfigs.large,
		},
		'7x7x7': {
			numMoves: 55,
			turns: moveConfigs.large,
		},
	};

	scrambleConfigs.mirror3x3x3 = scrambleConfigs['3x3x3'];

	const puzzleConfig = scrambleConfigs[puzzle];

	while (scramble.length < puzzleConfig.numMoves) {
		const randMove = Math.floor(Math.random() * puzzleConfig.turns.length);
		const move = puzzleConfig.turns[randMove];
		const modifier = getModifier();
		const pushMove = (move, modifier) => {
			scramble.push({move, modifier});
		};

		if (scramble.length === 0) { // is first move
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
	const scramble = getScramble();
	console.log(scramble);

	let scrambleHTML = '<ul>';
	const scrambleSuffix = '</ul>';

	for (const element of scramble) {
		scrambleHTML += `<li><span class="moveLabel" title="Turn the ${[element.move.label, element.modifier.label].join(' ')}">${element.move.text + element.modifier.text}</span></li>`;
	}

	scrambleHTML += scrambleSuffix;

	timerSettings.scrambleEl.innerHTML = scrambleHTML;
};

export {showScramble};
