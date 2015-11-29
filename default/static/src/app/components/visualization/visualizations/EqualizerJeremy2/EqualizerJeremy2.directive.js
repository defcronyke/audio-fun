/*global console */
/*global selectedVisual:true */
/*global URL */
/*global window */
/*global Uint8Array */
/*global setInterval */
/*global clearInterval */
/*global setTimeout */
/*global requestAnimationFrame */
/*global document */

class EqualizerJeremy2Directive {
	
	constructor(name) {
		'ngInject';
		
		this.name = name;
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/components/visualization/visualizations/EqualizerJeremy2/EqualizerJeremy2.html',
			scope: {},
			controller: EqualizerJeremy2Controller,
			controllerAs: 'vm',
			bindToController: true
		};
		
		return directive;
	}
}

class EqualizerJeremy2Controller {
	constructor() {
		'ngInject';
		
		console.log('EqualizerJeremy2Controller called');
		
		if (selectedVisual.name !== 'equalizer-jeremy2') {
			
			this.checkSelectedVisual = setInterval((function(){
				
				if (selectedVisual.name === 'equalizer-jeremy2') {
					
					clearInterval(this.checkSelectedVisual);
					
					this.constructor();
				}
				
			}).bind(this), 1000);
			
			return;
		}
		
		if (selectedVisual.name === 'equalizer-jeremy2') {
		
			let fullscreenButton = angular.element('#equalizer-jeremy2-fullscreen-button')[0];
			
			fullscreenButton.onclick = this.fullScreen.bind(this);
			
			document.onwebkitfullscreenchange = (function() {
				
				if (document.webkitFullscreenElement === null) {
					this.canvas.style.width = '800px';
					this.canvas.style.height = '600px';
				}
				
			}).bind(this);
			
			document.onmozfullscreenchange = (function() {
				
				if (document.mozFullscreenElement === null) {
					this.canvas.style.width = '800px';
					this.canvas.style.height = '600px';
				}
				
			}).bind(this);
		
			if (this.audioSource) {
				this.audioSource.disconnect();
			}
		
			this.canvasWidth = 1024;
			this.canvasHeight = 768;
		
			this.audioPlayer = angular.element('#audio-player')[0];
			this.audioPlayerFile = angular.element('#audio-player-file')[0];
			
			this.audioPlayerFile.onchange = (function() {
				this.audioPlayer.src = URL.createObjectURL(this.audioPlayerFile.files[0]);
			}).bind(this);
			
			let AudioContext = window.AudioContext || window.webkitAudioContext;
			
			if (!this.audioContext) {
				this.audioContext = new AudioContext();
			}
			
			if (!this.audioSource) {
				this.audioSource = this.audioContext.createMediaElementSource(this.audioPlayer);
			}
			
			this.audioAnalyser = this.audioContext.createAnalyser();
			this.audioAnalyser.fftSize = 2048;
			this.bufferLength = this.audioAnalyser.frequencyBinCount;
	
			this.dataArray = new Uint8Array(this.bufferLength);
//			this.dataFloatArray = new Float32Array(this.bufferLength);
			
			this.audioAnalyser.getByteTimeDomainData(this.dataArray);
//			this.audioAnalyser.getFloatTimeDomainData(this.dataFloatArray);
			
			this.audioSource.connect(this.audioAnalyser);
			
			this.audioAnalyser.connect(this.audioContext.destination);
			
			
			
			this.canvas = angular.element('#equalizer-jeremy2-canvas1')[0];
			this.canvasContext = this.canvas.getContext('2d');
			this.canvasContext.fillStyle = 'rgba(0, 0, 0, 1.0)';
			this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
			
			
			//this.n = 0;
			this.backgroundFillStyle = 'rgba(0, 0, 0, 1.0)';
			this.processAudio();
		}
	}
	
	processAudio() {
		
		let fps = 60;
		setTimeout((function() {
			
			this.processAudioHandle = requestAnimationFrame(this.processAudio.bind(this));
			
		}).bind(this), 1000 / fps);
		
		
		this.audioAnalyser.getByteTimeDomainData(this.dataArray);
//		this.audioAnalyser.getFloatTimeDomainData(this.dataFloatArray);
		
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

		//this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		//console.log(this.n);

		this.canvasContext.fillStyle = this.backgroundFillStyle;
		this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		

		for (let i = 0; i < dataArray.length; i++) {
			
			let data = dataArray[i];

			let rand_r = Math.floor(Math.random() * 255);
			let rand_g = Math.floor(Math.random() * 255);
			let rand_b = Math.floor(Math.random() * 255);

			this.canvasContext.fillStyle = 'rgba('+rand_r+', 0, '+rand_b+', 1.0)';
//			this.canvasContext.fillRect(i, 0, 1, data);
			this.canvasContext.fillRect(i, data, 1, 15);
			
			this.canvasContext.fillStyle = 'rgba(0, '+rand_g+', '+rand_b+', 1.0)';
//			this.canvasContext.fillRect(i, this.canvasHeight, 1, -data);
			this.canvasContext.fillRect(i, this.canvasHeight - data, 1, 15);
			
			if (data <= 8) {
			
				console.log('changing background colour');
				
				let rand_r = Math.floor(Math.random() * 255);
				let rand_g = Math.floor(Math.random() * 255);
				let rand_b = Math.floor(Math.random() * 255);
		
				//this.canvasContext.fillStyle = 'rgba(0, 0, 0, 1.0)';
				
				this.canvasContext.fillStyle = 'rgba('+dataArray[rand_r]+', '+dataArray[rand_g]+', '+dataArray[rand_b]+', 1.0)';
				this.backgroundFillStyle = this.canvasContext.fillStyle;
			}
		}
		
		//this.n = (this.n + 1) % this.bufferLength;
	}
	
	fullScreen() {

		if (this.canvas.webkitRequestFullScreen) {
			this.canvas.webkitRequestFullScreen();
		} else if (this.canvas.mozRequestFullScreen) {
			this.canvas.mozRequestFullScreen();
		}
		
		console.log('style' + this.canvas.style);
		
		this.canvas.style.width = window.innerWidth + 'px';
		this.canvas.style.height = '100%';
	}
}

export default EqualizerJeremy2Directive;