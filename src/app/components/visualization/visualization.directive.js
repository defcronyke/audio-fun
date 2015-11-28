class VisualizationDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/visualization/visualization.html',
      scope: {},
      controller: VisualizationController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }
}

class VisualizationController {
	constructor () {
		'ngInject';
	
		this.visuals = [
			{
				'name': 'equalizer-daphne1'
			},
			
			{
				'name': 'equalizer-jeremy1',
			}
		];
		
		this.selectedVisual = this.visuals[1];
	}
	
	setSelectedVisual(visual) {
		
		this.selectedVisual = this.selectedVisual ? delete this.selectedVisual : this.selectedVisual;
		this.selectedVisual = visual;
	}
}

export default VisualizationDirective;
