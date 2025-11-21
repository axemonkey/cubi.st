const moveConfigs = {
	// 2x2x2, 3x3x3
	small: [
		{ text: 'F', label: 'front face', axis: 'z' },
		{ text: 'B', label: 'back face', axis: 'z' },
		{ text: 'U', label: 'top (up) face', axis: 'y' },
		{ text: 'D', label: 'bottom (down) face', axis: 'y' },
		{ text: 'L', label: 'left face', axis: 'x' },
		{ text: 'R', label: 'right face', axis: 'x' },
	],

	// 4x4x4, 5x5x5
	medium: [
		{ text: 'F', label: 'front face', axis: 'z' },
		{ text: 'B', label: 'back face', axis: 'z' },
		{ text: 'U', label: 'top (up) face', axis: 'y' },
		{ text: 'D', label: 'bottom (down) face', axis: 'y' },
		{ text: 'L', label: 'left face', axis: 'x' },
		{ text: 'R', label: 'right face', axis: 'x' },
		{ text: '2F', label: 'front two layers', axis: 'z' },
		{ text: '2B', label: 'back two layers', axis: 'z' },
		{ text: '2U', label: 'top (up) two layers', axis: 'y' },
		{ text: '2D', label: 'bottom (down) two layers', axis: 'y' },
		{ text: '2L', label: 'left two layers', axis: 'x' },
		{ text: '2R', label: 'right two layers', axis: 'x' },
	],

	// 6x6x6, 7x7x7
	large: [
		{ text: 'F', label: 'front face', axis: 'z' },
		{ text: 'B', label: 'back face', axis: 'z' },
		{ text: 'U', label: 'top (up) face', axis: 'y' },
		{ text: 'D', label: 'bottom (down) face', axis: 'y' },
		{ text: 'L', label: 'left face', axis: 'x' },
		{ text: 'R', label: 'right face', axis: 'x' },
		{ text: '2F', label: 'front two layers', axis: 'z' },
		{ text: '2B', label: 'back two layers', axis: 'z' },
		{ text: '2U', label: 'top (up) two layers', axis: 'y' },
		{ text: '2D', label: 'bottom (down) two layers', axis: 'y' },
		{ text: '2L', label: 'left two layers', axis: 'x' },
		{ text: '2R', label: 'right two layers', axis: 'x' },
		{ text: '3F', label: 'front three layers', axis: 'z' },
		{ text: '3B', label: 'back three layers', axis: 'z' },
		{ text: '3U', label: 'top (up) three layers', axis: 'y' },
		{ text: '3D', label: 'bottom (down) three layers', axis: 'y' },
		{ text: '3L', label: 'left three layers', axis: 'x' },
		{ text: '3R', label: 'right three layers', axis: 'x' },
	],
};

export { moveConfigs };
