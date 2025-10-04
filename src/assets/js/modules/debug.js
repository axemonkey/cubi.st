import { timerSettings } from "./settings.js";
import { getConfig, setConfig } from "./timer-config.js";

const initDebug = () => {
	if (document.querySelector("#debug")) {
		const getConfigLink = document.querySelector("#getConfig");
		getConfigLink.addEventListener("click", function (event) {
			event.preventDefault();
			getConfig();
		});

		const setConfigLink = document.querySelector("#setConfig");
		setConfigLink.addEventListener("click", function (event) {
			event.preventDefault();
			setConfig();
		});

		const deleteConfigLink = document.querySelector("#deleteConfig");
		deleteConfigLink.addEventListener("click", function (event) {
			event.preventDefault();
			console.log("deleting config");
			localStorage.removeItem(timerSettings.configStorageItem);
		});

		const logTimesLink = document.querySelector("#logTimes");
		logTimesLink.addEventListener("click", function (event) {
			event.preventDefault();
			console.log("all times:");
			console.log(timerSettings.timesObj);
		});

		const deleteTimesLink = document.querySelector("#deleteTimes");
		deleteTimesLink.addEventListener("click", function (event) {
			event.preventDefault();
			console.log("deleting all times");
			localStorage.removeItem(timerSettings.timesStorageItem);
		});
	}
};

export { initDebug };
