export default class Keys {
	constructor() {
		this.pressed = {};
		//keycodes correspond to the DFJK keys
		this.pos = {
			0: 68,
			1: 70,
			2: 74,
			3: 75
		};
		this.D = 68;
		this.F = 70;
		this.J = 74;
		this.K = 75;

		this.addKeyListeners();
	}

	addKeyListeners() {
		document.addEventListener('keydown', (e) => {
			this.onKeyDown(e);
		});
		document.addEventListener('keyup', (e) => {
			this.onKeyUp(e);
		});
	}

	onKeyDown(e) {
		this.pressed[e.keyCode] = true;
	}

	onKeyUp(e) {
		this.pressed[e.keyCode] = false;
	}

	isDown(key) {
		return this.pressed[key];
	}
}
