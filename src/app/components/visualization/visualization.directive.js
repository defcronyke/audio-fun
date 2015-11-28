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
		
		this.selectedVisual = this.visuals[1];	// TODO: Use this to set the default visual.
		selectedVisual = this.selectedVisual;
	}
	
	setSelectedVisual(visual) {
		
		this.selectedVisual = visual;
		selectedVisual = visual;
		
		console.log(selectedVisual);
	}
}

export default VisualizationDirective;
