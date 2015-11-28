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
		
			if (this.audioSource) {
				this.audioSource.disconnect();
			}
		
			this.canvasWidth = 1024;
			this.canvasHeight = 768;
		
			this.audioPlayer = angular.element('#audio-player')[0];
			
			let AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContext();
			
			this.audioSource = this.audioContext.createMediaElementSource(this.audioPlayer);
			
			this.audioAnalyser = this.audioContext.createAnalyser();
			this.audioAnalyser.fftSize = 2048;
			this.bufferLength = this.audioAnalyser.frequencyBinCount;
	
			this.dataArray = new Uint8Array(this.bufferLength);
//			this.dataFloatArray = new Float32Array(this.bufferLength);
			
			this.audioAnalyser.getByteTimeDomainData(this.dataArray);
//			this.audioAnalyser.getFloatTimeDomainData(this.dataFloatArray);
			
			this.audioSource.connect(this.audioAnalyser);
			
			this.audioAnalyser.connect(this.audioContext.destination);
			
			
			
			this.canvas = angular.element('#equalizer-jeremy1-canvas1')[0];
			this.canvasContext = this.canvas.getContext('2d');
			this.canvasContext.fillStyle = 'rgba(0, 0, 0, 1.0)';
			this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
			
			
			
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
		
		this.audioAnalyser.getByteTimeDomainData(this.dataArray)
//		this.audioAnalyser.getFloatTimeDomainData(this.dataFloatArray)
		
		let skip = true;
		
		for (let i = 0; i < this.bufferLength; i++) {
			
			let data = this.dataArray[i];
//			let data = this.dataFloatArray[i];
			
//			if (data !== 0.0) {
//				skip = false;
//			}

			if (data !== 128) {
				skip = false;
			}
		}
		
		if (!skip) {
			
//			console.log(this.dataArray);
			this.draw(this.dataArray);
			
//			console.log(this.dataFloatArray);
//			this.draw(this.dataFloatArray);
		}
	}
	
	draw(dataArray) {

		let rand_r = Math.floor(Math.random() * 255);
		let rand_g = Math.floor(Math.random() * 255);
		let rand_b = Math.floor(Math.random() * 255);

		//this.canvasContext.fillStyle = 'rgba(0, 0, 0, 1.0)';
		
		this.canvasContext.fillStyle = 'rgba('+dataArray[rand_r]+', '+dataArray[rand_g]+', '+dataArray[rand_b]+', 1.0)';
		
		this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.canvasContext.fillStyle = 'rgba(255, 0, 0, 1.0)';

		for (let i = 0; i < dataArray.length; i++) {
			
			let data = dataArray[i];

			let rand_r2 = Math.floor(Math.random() * 255);
			let rand_g2 = Math.floor(Math.random() * 255);
			let rand_b2 = Math.floor(Math.random() * 255);

			this.canvasContext.fillStyle = 'rgba('+rand_r2+', 0, '+rand_b2+', 1.0)';
			this.canvasContext.fillRect(i, 0, 1, data);
			
			this.canvasContext.fillStyle = 'rgba(0, '+rand_g2+', '+rand_b2+', 1.0)';
			this.canvasContext.fillRect(i, this.canvasHeight, 1, -data);
		}
	}
}

export default EqualizerJeremy1Directive;