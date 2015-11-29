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
		
		this.visualName = 'equalizer-daphne1';
		
		if (selectedVisual.name !== this.visualName) {
			
			this.checkSelectedVisual = setInterval((function(){
				
				if (selectedVisual.name === this.visualName) {
					
					clearInterval(this.checkSelectedVisual);
					
					this.constructor();
				}
				
			}).bind(this), 1000);
			
			return;
		
		} else {
			
			this.checkSelectedVisual2 = setInterval((function(){
				
				if (selectedVisual.name !== this.visualName) {
					
					clearInterval(this.checkSelectedVisual2);
					
					this.checkSelectedVisual3 = setInterval((function(){
					
						if (selectedVisual.name === this.visualName) {
							
							clearInterval(this.checkSelectedVisual3);
							
							this.constructor();
						}
						
					}).bind(this), 1000);
				}
				
			}).bind(this), 1000);
		}
		
		if (selectedVisual.name === this.visualName) {
		
			let fullscreenButton = angular.element('#'+this.visualName+'-fullscreen-button')[0];
			
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
				
				console.log('!! Creating new AudioContext()');
				
				delete this.audioContext;
				
				this.audioContext = new AudioContext();
				//this.audioPlayer = angular.element('#audio-player')[0];
				
				let audioPlayerArea = angular.element('#audio-stream-file1');
				
				this.audioPlayer.parentNode.removeChild(this.audioPlayer);
				
				let newAudioPlayer = document.createElement('audio');
				newAudioPlayer.src = 'assets/audio/03_Big-Dater_Big-Data.ogg';
				newAudioPlayer.setAttribute('type', 'audio/ogg');
				newAudioPlayer.setAttribute('controls', '');
				newAudioPlayer.id = 'audio-player';
				
				audioPlayerArea.append(newAudioPlayer);
				
				this.audioPlayer = newAudioPlayer;
			}
			
			if (!this.audioSource) {
				
				console.log('!! Creating new MediaElementSource');
				
				try {
					this.audioSource = this.audioContext.createMediaElementSource(this.audioPlayer);
				
				} catch(e) {
					console.log('Caught exception:');
					console.log(e);
				}
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
			
			
			
			this.canvas = angular.element('#'+this.visualName+'-canvas1')[0];
			this.canvasContext = this.canvas.getContext('2d');
			this.canvasContext.fillStyle = 'rgba(0, 0, 0, 1.0)';
			this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
			
			
			
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
		this.canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight);
		
		//let fillColors = ['red','orange','yellow','green','blue','purple'];
		
		//let rand_y = Math.floor(Math.random() * this.canvasHeight);
		


		for (let i = 0; i < dataArray.length; i++) {		
			let data = dataArray[i];
			
			
			if (i%40 !== 0) {
				continue;
			}
			
			let y1 = data %(this.canvasHeight);
			let y2 = (data + 128) %(this.canvasHeight);
			let y3 = (data + 256) %this.canvasHeight;
			
			let r1 = 0;
			let b1 = Math.floor((i/dataArray.length) * 255);
			let g1 = Math.floor(255-((i/dataArray.length) * 255));
			
			let r2 = Math.floor((i/dataArray.length) * 255);
			let b2 = Math.floor(255-((i/dataArray.length) * 255));
			let g2 = 0;
			
			let r3 = Math.floor(255-((i/dataArray.length) * 255));
			let b3 = 0;
			let g3 = Math.floor((i/dataArray.length) * 255);
			
			this.canvasContext.fillStyle = "rgba(" + r1 + "," + g1 + "," + b1 + "," + (1.0 - (data/255)) + ")";
			this.canvasContext.beginPath();
			this.canvasContext.arc((i+700)%1025, y1, (data/256)* 100, 0, 2 * Math.PI, false);
			this.canvasContext.fill();
			
			this.canvasContext.fillStyle = "rgba(" + r2 + "," + g2 + "," + b2 + "," + (1.0 - (data/255)) + ")";
			this.canvasContext.beginPath();
			this.canvasContext.arc((i+300)%1025, y2+50, (data/256)* 100, 0, 2 * Math.PI, false);
			this.canvasContext.fill();
			
			this.canvasContext.fillStyle = "rgba(" + r3 + "," + g3 + "," + b3 + "," + (1.0 - (data/255)) + ")";
			this.canvasContext.beginPath();
			this.canvasContext.arc(i, y3+100, (data/256)* 100, 0, 2 * Math.PI, false);
			this.canvasContext.fill();
		}
		
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

export default EqualizerDaphne1Directive;