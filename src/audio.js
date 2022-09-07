import * as THREE from 'three';
import Note from './note';

export default class Audio {
	constructor(renderer, camera, scene, musicDeley, path, track) {
		this.renderer = renderer;
		this.camera = camera;
		this.scene = scene;
		this.musicDeley = musicDeley;
		this.path = path;

		this.listener = new THREE.AudioListener();
		this.sound = new THREE.Audio(this.listener);
		this.audioLoader = new THREE.AudioLoader();

		this.track = track;
		this.playing = false;

		this.timeZero;
		this.audio = require('./songs/650415 MAZARE - Mazare Party/audio.mp3');
		this.song = require("./songs/650415 MAZARE - Mazare Party/MAZARE - Mazare Party (Insp1r3) [Cokii's 4K Hard].osu");
	}

	// getFiles() {
	// 	var fs = require(path);
	// 	var files = fs.readdirSync(path);
	// 	console.log(files);
	// }

	async parseFile(vel, keys) {
		let song = this.song;
		// let song = "./src/songs/chakra/1494300 uma - Chakra/uma - Chakra (Shima Rin) [MD's NOVICE].osu";

		let _song = song.default.split('\n');
		console.warn(_song);
		let objects = [];
		let loader = new THREE.FileLoader();
		// _song = loader.loadAsync(song);
		_song = await _song;
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

		this.song = this.audioLoader.load(this.audio, (buffer) => {
			this.sound.setBuffer(buffer);
			this.sound.setLoop(false);
			this.sound.setVolume(0.01);
			let timeZero = Date.now() + this.track.fallTime * 1000;
			console.log('trueStart ' + Date.now());
			console.log('new start ' + timeZero);
			//console.log('diff = ' + (timeZero - (timeZero - this.sound._startedAt * 1000)));
			this.track.createNotes(timeZero);
			console.log('cunt' + this.sound._startedAt * 1000);
			let audioOffset = this.track.fallTime * 1000 - this.track.firstNoteTime;
			console.warn('audioOffset ' + audioOffset / 1000);
			//this.sound.play(audioOffset > 0 ? audioOffset / 1000 : 0);
			this.sound.play(this.track.fallTime);
			this.track.playing = true;
		});
		return objects;
	}
}
