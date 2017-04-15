if(typeof require !== 'undefined') {
	if(typeof __webpack_modules__ !== 'undefined'){
		require('./dist/qmxtr-equalizer.bundle.css');
	}

	const EqualizerPlugin = require('./dist/qmxtr-equalizer.bundle.js');

	if(typeof module !== 'undefined' && module.exports) {
		module.exports = EqualizerPlugin;
	} else {
		window.EqualizerPlugin = EqualizerPlugin;
	}
} else {
	console.error('Require doesn\'t exists!');
}
