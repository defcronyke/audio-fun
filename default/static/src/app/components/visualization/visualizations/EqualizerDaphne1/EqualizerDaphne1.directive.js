/*global console */

class EqualizerDaphne1Directive {
	
	constructor(name) {
		'ngInject';
		
		this.name = name;
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/components/visualization/visualizations/EqualizerDaphne1/EqualizerDaphne1.html',
			scope: {},
			controller: EqualizerDaphne1Controller,
			controllerAs: 'vm',
			bindToController: true
		};
		
		return directive;
	}
}

class EqualizerDaphne1Controller {
	constructor() {
		'ngInject';
		
		console.log('EqualizerDaphne1Controller called');
	}
}

export default EqualizerDaphne1Directive;