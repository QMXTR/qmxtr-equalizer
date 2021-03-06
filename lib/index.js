import "roboto-fontface";
import QEqualizerPanel from "./components/QEqualizerPanel.vue";

class EqualizerPlugin{
	constructor(eq){
		this.eq = {
			60: 0,
			170: 0,
			310: 0,
			600: 0,
			1000: 0,
			3000: 0,
			6000: 0,
			12000: 0,
			14000: 0,
			16000: 0
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
		player.vuexMutationDefinitions['equalizer'] = (state, {hz, gain}) => {
			state.eq[hz] = gain;
		};

		player.addCommand(this, 'eq', ({hz, gain}) => {
			this.eq[hz] = gain;
			this.updateEQ();
		});

		player.vuexStates.eq = {};

		Object.keys(this.eq).forEach((hz, i, arr) => {

			player.vuexStates.eq[hz] = this.eq[hz];

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
			this.player.emit('equalizer', {hz: hz, gain: this.eq[hz]});

			if(this.nodes[i]){
				this.nodes[i].gain.value = this.eq[hz];
			}
		});
	}

	install(Vue){
		Vue.component('q-equalizer-panel', QEqualizerPanel);
	}
}

export default EqualizerPlugin;
