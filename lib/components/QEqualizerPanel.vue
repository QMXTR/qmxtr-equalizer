<template>
	<q-panel class="q-eq-panel">
		<q-panel class="q-eq-panel-control" column v-for="hz in eqList" :key="hz">
			<vue-slider :ref="`eq-${hz}`" style="flex: 1" :min="0" :max="20" :value="getEQValue(hz)" @callback="setEQValue(hz, ...arguments)" direction="vertical"></vue-slider>
			<div class="q-eq-caption" v-text="getEQText(hz)"></div>
		</q-panel>
	</q-panel>
</template>

<style lang="less">
	.q-eq-panel {
		@seekbar-background: rgba(0, 0, 0, .2);
		@seekbar-process: rgba(29, 233, 182, .9);
		@seekbar-tooltip: #004d40;
		@seekbar-dot: #004d40;
		@seekbar-dot-hover: #4db6ac;
		@seekbar-dot-click: #f1f1f1;
		@font: 'Roboto', sans-serif;

		align-items: center;
		margin: 0 auto;

		.vue-slider {
			background: @seekbar-background !important;
		}

		.vue-slider-process {
			background: @seekbar-process !important;
		}

		.vue-slider-dot {
			background: @seekbar-dot !important;
			border: 4px solid @seekbar-dot;
			height: 8px !important;
			width: ~"calc(100% - 8px)" !important;
			border-radius: 3px !important;
			box-shadow: initial !important;
			outline: none;

			&:hover {
				background: @seekbar-dot-hover !important;
				border: 4px solid @seekbar-dot-hover;
			}

			&:active {
				background: @seekbar-dot-click !important;
				border: 4px solid @seekbar-dot-click;
			}
		}

		.vue-slider-tooltip {
			background-color: @seekbar-tooltip !important;
			border: 1px solid @seekbar-tooltip !important;
			font-family: @font;
		}

		.q-eq-panel-control {
			justify-content: center;
			max-height: 80%;
			margin: 0 30px;
			font-family: @font;

			.q-eq-caption {
				text-align: center;
			}
		}
	}
</style>

<script>
	import VueSlider from 'vue-slider-component';

	export default {
		computed: {
			eq(){
				return this.$store.state.eq;
			},

			eqList(){
				return Object.keys(this.eq);
			}
		},

		methods: {
			getEQValue(hz){
				return this.eq[hz] * 2;
			},

			setEQValue(hz, gain){
				gain = (gain) / 2;
				this.$store.dispatch('equalizer:eq', {hz, gain});
			},

			getEQText(hz){
				if(hz >= 1000) return Math.round(hz / 1000) + 'k';
				return hz;
			},

			update(){
				setTimeout(() => {
					this.eqList.forEach((v) => {
						this.$refs[`eq-${v}`][0].refresh();
					});
				}, 500);
			}
		},

		mounted(){
			this.$store.watch((state) => state.eq, () => {
				this.eqList.forEach((v) => {
					this.$refs[`eq-${v}`].val = this.eq[v];
					this.$refs[`eq-${v}`].setPosition();
				});
			});
		},

		components: {
			VueSlider
		}
	};
</script>
