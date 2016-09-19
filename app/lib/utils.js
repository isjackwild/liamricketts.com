// NPM
import request from 'request';

// Other
import { dataStore } from '../app.js';
import { INDEX_ROUTE } from '../app.js';

export const getData = (url) => {
	return new Promise((resolve, reject) => {
		if (dataStore[url]) return resolve(dataStore[url]); // Check if caches JSON exists
		request.get(url, (error, response, body) => {
			if (error) return reject(error);

			const json = JSON.parse(body);
			dataStore[url] = json; // Cache the response

			resolve(json);
		});
	});
};


export const buildApiEndpoint = (pathname) => {
	const newPathname = pathname === '/' ? INDEX_ROUTE : pathname;
	return `${window.location.origin}/api${newPathname}`;
};

export const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}