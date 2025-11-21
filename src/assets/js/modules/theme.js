import { timerSettings } from './settings.js';
import { setConfig } from './timer-config.js';
import { toasty } from './toasties.js';

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
		text: `Theme: ${timerSettings.theme}`,
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

export { initTheme, checkThemeDropdown };
