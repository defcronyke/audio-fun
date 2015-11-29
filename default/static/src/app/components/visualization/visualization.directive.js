/*global selectedVisual:true */
/*global console */

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
				'name': 'equalizer-daphne2'
			},
			
			{
				'name': 'equalizer-jeremy1',
			},
			
			{
				'name': 'equalizer-jeremy2',
			},
			
			{
				'name': 'equalizer-jeremy3',
			}
		];
		
		this.selectedVisual = this.visuals[2];	// TODO: Use this to set the default visual.
		selectedVisual = this.selectedVisual;
	}
	
	setSelectedVisual(visual) {
		
		this.selectedVisual = visual;
		selectedVisual = visual;
		
		console.log(selectedVisual);
	}
}

export default VisualizationDirective;
