import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

let setStateFn = () => {
	console.log("State not yet initialized");
};

function backgroundTask() {
	console.log("background task");
	try {
		// fetch data here...
		const backendData = "Simulated fetch " + Math.random();
		console.log("myTask() ", backendData);
		return backendData;
	} catch (err) {
		return BackgroundFetch.Result.Failed;
	}
}

async function initBackgroundFetch(taskName, taskFn, interval = 60 * 15) {
	console.log("backfground fetching");
	try {
		if (!TaskManager.isTaskDefined(taskName)) {
			TaskManager.defineTask(taskName, taskFn);
		}
		const options = {
			minimumInterval: interval, // in seconds
		};
		await BackgroundFetch.registerTaskAsync(taskName, options);
	} catch (err) {
		console.log("registerTaskAsync() failed:", err);
	}
}

initBackgroundFetch("myTaskName", backgroundTask, 5);

export default initBackgroundFetch;
