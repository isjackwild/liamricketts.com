// NPM
import request from 'request';
import PubSub from 'pubsub-js';

let toLoad = 0;
let loaded = 0;
let percent = 0;
let started = false;
let minLoadTimePassed = false;

let minLoadTimeTimeout = null;

const minLoadTime = 1222;

export const init = () => {
	PubSub.subscribe('load.add', onImageAdded);
	PubSub.subscribe('load.loaded', onImageLoaded);
};

export const kill = (pathname) => {
};

const reset = () => {
	PubSub.publish('load.reset', true);
	clearTimeout(minLoadTimeTimeout);
	toLoad = 0;
	loaded = 0;
	started = false;
	minLoadTimePassed = false;
}


const onImageAdded = () => {
	if (!started) {
		clearTimeout(minLoadTimeTimeout);
		minLoadTimeTimeout = setTimeout(() => {
			minLoadTimePassed = true;
			if (toLoad === loaded) onComplete();
		}, minLoadTime);
	}
	started = true;
	toLoad++;
}

const onImageLoaded = () => {
	loaded++;
	percent = (loaded / toLoad) * 100;
	PubSub.publish('load.percent', percent);
	if (toLoad === loaded && minLoadTimePassed) onComplete();
}

const onComplete = () => {
	clearTimeout(minLoadTimeTimeout);
	PubSub.publish('load.complete');
}