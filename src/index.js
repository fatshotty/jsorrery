
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

const OBJ = {
	JSOrrery,
	Scenarios: JSOrrery.Scenarios,
	DefaultScenarios
};

export default OBJ;


window.JSORRERY = OBJ;

// EXAMPLE CODE

// const scens = DefaultScenarios;
// const jsOrrery = new JSOrrery();
// jsOrrery.loadScenario( JSOrrery.Scenarios.getList()[0]);
// window.P = JSOrrery;
