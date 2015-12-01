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

class EqualizerDaphne2Directive {
	
	constructor(name) {
		'ngInject';
		
		this.name = name;
		
		let directive = {
			restrict: 'E',
			templateUrl: 'app/components/visualization/visualizations/EqualizerDaphne2/EqualizerDaphne2.html',
			scope: {},
			controller: EqualizerDaphne2Controller,
			controllerAs: 'vm',
			bindToController: true
		};
		
		return directive;
	}
}

class EqualizerDaphne2Controller {
	constructor() {
		'ngInject';
		
		console.log('EqualizerDaphne2Controller called');
		
		this.visualName = 'equalizer-daphne2';
		
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
		
		let lowest_freq1 = dataArray[0];
		let highest_freq1 = dataArray[0];
		
		let lowest_freq2 = dataArray[0];
		let highest_freq2 = dataArray[0];
		
		let lowest_freq3 = dataArray[0];
		let highest_freq3 = dataArray[0];
		
		let third = Math.floor(dataArray.length/3);
		
		for (let i = 0; i < dataArray.length; i++) {
			let data = dataArray[i];
			
			if (i < third) {
				if (data > highest_freq1) {
					highest_freq1 = data;
				} else if (data < lowest_freq1) {
					lowest_freq1 = data;
				}
			} else if ((i > third) && (i < (third *2))) {
				if (data > highest_freq2) {
					highest_freq2 = data;
				} else if (data < lowest_freq2) {
					lowest_freq2 = data;
				}
			} else if (i > (third*2)) {
				if (data > highest_freq3) {
					highest_freq3 = data;
				} else if (data < lowest_freq3) {
					lowest_freq3 = data;
				}
			}
		}


		let pen = turtle.penFor(this.canvas);
		
		let bg_r = highest_freq2;
		let bg_g = lowest_freq2;
		let bg_b = highest_freq2 - lowest_freq2
		
//		console.log(bg_r);
//		console.log(bg_g);
		
//		this.canvasContext.fillStyle = "rgba(" + bg_r + "," + bg_g + "," + bg_b + ", 1.0)";
		this.canvasContext.fillStyle = "rgba(0,0,0,1.0)";
		this.canvasContext.fillRect(0,0,this.canvasWidth, this.canvasHeight);
		
		pen.color("rgba(255,0,0,1.0)");
		
		let sides = 3 + Math.floor(((highest_freq1 - lowest_freq1)/2)/8);
		let dist = 70;
		let angle = Math.floor(360/sides);
		let rads = (180/sides) * (Math.PI / 180);
		let r = dist/(2*Math.sin(rads));
		let startX = (this.canvasWidth/2) - r;
		let startY = this.canvasHeight/2;
		pen.moveTo(startX, startY);
		pen.penDown();
		let positions = [];
		for (let i = 0; i < sides; i++) {
			let p = pen.position();
			positions.push([p['x'], p['y']]);
			pen.forward(dist);
			pen.turnRight(angle);
		}
		pen.penUp();
		for (let i = 0; i < positions.length; i++) {
			let current_x = positions[i][0];
			let current_y = positions[i][1];
			for (let j = 0; j < (positions.length - i); j++) {
				let next_x = positions[i+j][0];
				let next_y = positions[i+j][1];
				pen.moveTo(current_x, current_y);
				pen.penDown();
				pen.moveTo(next_x, next_y)
				pen.penUp;
			}
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

export default EqualizerDaphne2Directive;