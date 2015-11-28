/*global console */

class EqualizerJeremy1Directive {
	
	constructor(name) {
		'ngInject';
		
		this.name = name;
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/components/visualization/visualizations/EqualizerJeremy1/EqualizerJeremy1.html',
			scope: {},
			controller: EqualizerJeremy1Controller,
			controllerAs: 'vm',
			bindToController: true
		};
		
		return directive;
	}
}

class EqualizerJeremy1Controller {
	constructor() {
		'ngInject';
		
		console.log('EqualizerJeremy1Controller called');
	}
}

export default EqualizerJeremy1Directive;