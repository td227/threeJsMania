import * as THREE from '../node_modules/three/build/three.module.js ';
import Note from './note.js';

export default async function parseFile(vel, keys) {
	// let song = './src/songs/chakra/1494300 uma - Chakra/uma - Chakra (Shima Rin) [ADVANCED] - TEST.osu';
	let song = 'src/songs/chakra/1494300 uma - Chakra/uma - Chakra (Shima Rin) [MAXIMUM].osu';

	let _song;
	let objects = [];
	let loader = new THREE.FileLoader();
	_song = loader.loadAsync(song);
	_song = await _song;
	_song = _song.split('\n');
	let startLine;
	for (let i = 0; i < _song.length; i++) {
		if (_song[i].includes('[HitObjects]')) {
			startLine = i;
			i = song.length;
			break;
		}
	}
	for (let i = startLine; i < _song.length; i++) {
		let values = _song[i].split(',');
		switch (values[0]) {
			//64 - 448 correspond to the x position of the note in 4 columns??
			//128 - means the note is a slider
			//thanks peppy :P
			case '64':
				if (values[3] === '128') objects.push(new Note(vel, keys, 0, values[2], true, values[5].split(':')[0]));
				else objects.push(new Note(vel, keys, 0, values[2], vel, keys));
				break;
			case '192':
				if (values[3] === '128') objects.push(new Note(vel, keys, 1, values[2], true, values[5].split(':')[0]));
				else objects.push(new Note(vel, keys, 1, values[2]));
				break;
			case '320':
				if (values[3] === '128') objects.push(new Note(vel, keys, 2, values[2], true, values[5].split(':')[0]));
				else objects.push(new Note(vel, keys, 2, values[2], vel, keys));
				break;
			case '448':
				if (values[3] === '128') objects.push(new Note(vel, keys, 3, values[2], true, values[5].split(':')[0]));
				else objects.push(new Note(vel, keys, 3, values[2], vel, keys));
				break;
		}
	}
	return objects;
}
