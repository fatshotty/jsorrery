
import $ from 'jquery';
import 'style-loader!./scss/master.scss';
import '../assets/data/elp.js'
import '../assets/data/vsop-earth.js'

import JSOrrery from './core/JSOrrery';

require('jquery-mousewheel');

if (!window.WebGLRenderingContext) {
	console.warn('WebGLRenderingContext is not suppoerted');
}

const DefaultScenarios = [
		'SolarSystem',
		'SolarSystemDwarves',
		'InnerSolarSystem',
		'Apollo',
		'EarthMoon',
		'Artificial',
		'JupiterMoon',
		'NEO',
		'BigJupiter',
		'MoonSoi'
	];

export default {
	JSOrrery,
	Scenarios: JSOrrery.Scenarios,
	DefaultScenarios
}

module.exports = {
	JSOrrery,
	Scenarios: JSOrrery.Scenarios,
	DefaultScenarios
};

// TEST
// const scens = DefaultScenarios;
// const index = 15;
// const jsOrrery = new JSOrrery();
// const scene = JSOrrery.Scenarios.getList().find(e => e.name == scens[index] ) || JSOrrery.Scenarios.getList()[0];
// jsOrrery.loadScenario(scene);
// window.P = JSOrrery;
