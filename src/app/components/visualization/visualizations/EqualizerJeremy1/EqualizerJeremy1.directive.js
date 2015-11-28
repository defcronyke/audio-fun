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
		
		if (selectedVisual.name === 'equalizer-jeremy1') {
		
			this.audioPlayer = angular.element('#audio-player')[0];
			
			let AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContext();
			
			this.audioSource = this.audioContext.createMediaElementSource(this.audioPlayer);
			
			this.audioAnalyser = this.audioContext.createAnalyser();
			this.audioAnalyser.fftSize = 2048;
			this.bufferLength = this.audioAnalyser.frequencyBinCount;
	
	//		this.dataArray = new Uint8Array(this.bufferLength);
			this.dataFloatArray = new Float32Array(this.bufferLength);
			
	//		this.audioAnalyser.getByteTimeDomainData(this.dataArray);
			this.audioAnalyser.getFloatTimeDomainData(this.dataFloatArray);
			
			this.audioSource.connect(this.audioAnalyser);
			this.audioAnalyser.connect(this.audioContext.destination);
			
			this.processAudio();
		}
	}
	
	processAudio() {
		
		if (selectedVisual.name !== 'equalizer-jeremy1') {
			
			this.checkSelectedVisual = setInterval((function(){
				
				if (selectedVisual.name === 'equalizer-jeremy1') {
					
					clearInterval(this.checkSelectedVisual);
					
					this.constructor();
				}
				
			}).bind(this), 1000);
			
			return;
		}
		
		this.processAudioHandle = requestAnimationFrame(this.processAudio.bind(this));
		
//		this.audioAnalyser.getByteTimeDomainData(this.dataArray)
		this.audioAnalyser.getFloatTimeDomainData(this.dataFloatArray)
		
		let skip = true;
		
		for (let i = 0; i < this.bufferLength; i++) {
			
			let data = this.dataFloatArray[i];
			
			if (data !== 0.0) {
				skip = false;
			}
		}
		
		if (!skip) {
			console.log(this.dataFloatArray);
		}
	}
}

export default EqualizerJeremy1Directive;