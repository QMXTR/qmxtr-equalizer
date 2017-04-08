class EqualizerPlugin{
	constructor(eq){
		this.eq = {
			60: 1,
			170: 1,
			310: 1,
			600: 1,
			1000: 1,
			3000: 1,
			6000: 1,
			12000: 1,
			14000: 1,
			16000: 1
		};

		Object.keys(eq).forEach((k) => {
			this.eq[k] = eq[k];
		});

		this.nodes = [];
	}

	getName(){
		return 'equalizer';
	}

	connect(ctx, player){
		this.ctx = ctx;
		this.nodes = [];
		this.player = player;

		Object.keys(this.eq).forEach((hz, i, arr) => {
			player.vuexMutationDefinitions[`eq-${hz}`] = (state, db) => {
				state[`eq-${hz}`] = db;
			};

			player.vuexStates[`eq-${hz}`] = this.eq[hz];

			const node = ctx.createBiquadFilter();

			if(i === 0) {
				node.type = 'lowshelf';
			}else if(i === arr.length - 1){
				node.type = 'highshelf';
			}else {
				node.type = 'peaking';
				node.Q.value = 0.5;
			}

			node.gain.value = this.eq[hz];
			node.frequency.value = parseInt(hz);

			this.nodes[i] = node;
		});

		this.nodes.reduce((prev, curr) => {
			prev.connect(curr);
			return curr;
		});

		return [this.nodes[0], this.nodes[this.nodes.length - 1]];
	}

	updateEQ(){
		Object.keys(this.eq).forEach((hz, i) => {
			this.player.emit(`eq-${hz}`, this.eq[hz]);

			if(this.nodes[i]){
				this.nodes[i].gain.value = this.eq[hz];
			}
		});
	}
}

export default EqualizerPlugin;
