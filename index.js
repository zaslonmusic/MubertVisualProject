
/*                        
    // create an AudioListener and add it to the camera
    var listener = new THREE.AudioListener();
    // create an Audio source
    var sound = new THREE.Audio( listener );
    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load
    ( 'https://api.soundcloud.com/tracks/313500510/stream?client_id=b1495e39071bd7081a74093816f77ddb', function( buffer ) 
    {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setVolume(1.0);
        sound.play();
    }
    );

    // create an AudioAnalyser, passing in the sound and desired fftSize
    var analyser = new THREE.AudioAnalyser( sound, 32 );

    // get the average frequency of the sound
    var data = analyser.getAverageFrequency();
    

    
    
*/



/**
 * The following demo should work in Chrome, Safari 7 (and iOS 7?) and Firefox 25+, but seems to work only in Chrome at present.
 * This demo is based on code posted to http://stackoverflow.com/questions/13958158/why-arent-safari-or-firefox-able-to-process-audio-data-from-mediaelementsource
 *
 * Earlier variant of visualization demo that works in Chrome 18+:
 * http://updates.html5rocks.com/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs
 */

// wait for window onload, otherwise may fail under Chrome. See http://crbug.com/112368
window.onload = function() {

    console.log('window.onload()');

    var AudioContext = (window.AudioContext || window.webkitAudioContext),
	audioContext, audioProcess, audioSource, didConnect,
	    result = document.createElement('p'),
	    output = document.createElement('span'),
	    mp3 = 'media/04. Everything Connected.mp3',
	    ogg = '20130320%20-%20Po%27ipu%20Beach%20Waves.ogg',
	    audio = new Audio();

	    result.style.fontWeight = 'bold';

	function connect() {

		if (didConnect) {
		  return false;
		}

		if (!AudioContext) {
			console.log('No AudioContext / webkitAudioContext detected.');
			return false;
		}

		var audioContext,
			audioSource,
			audioScript;

		console.log('Audio fired canplay, connecting...');

        console.log('Creating audio context');

		audioContext = new AudioContext();

		console.log('Creating mediaElementSource');

 		audioSource = audioContext.createMediaElementSource(audio);

        console.log('Creating script processor');

		audioScript = audioContext.createScriptProcessor(512);

        console.log('Connecting...');

		audioSource.connect(audioScript);
		audioSource.connect(audioContext.destination);
		audioScript.connect(audioContext.destination);

		console.log('Connect OK');

		console.log('Adding audioprocess() listener...');

		audioScript.addEventListener('audioprocess', function(e) {
			console.log('audioprocess event');
        	var data = e.inputBuffer.getChannelData(0)[0]*3;
			output.innerHTML = Math.abs(data).toFixed(3);
		}, false);

		console.log('audioprocess() added OK');

		didConnect = true;

	}

	(function setup() {
		var demo = document.getElementById('demo');
		audio.volume = 1/3;
		audio.controls = true;
                if (!navigator.userAgent.match(/mobile/i)) {
	 	  audio.autoplay = true;
                }
		audio.src = audio.canPlayType('audio/mpeg') ? mp3 : ogg;
		audio.addEventListener('canplay', function() {
			// Timing issue with Chrome - if console opened, audioprocess stops firing during playback?
			// a timeout here seems to help, but does not completely fix.
			window.setTimeout(function() {
				connect();
			}, 20);
		}, false);
		if (AudioContext) {
			result.innerHTML = 'Channel Data: ';
			output.innerHTML = '[waiting for audioprocess event]';
		} else {
			result.innerHTML = 'No AudioContext / webkitAudioContext support found.';
		}
		demo.appendChild(result).appendChild(output);
		demo.appendChild(audio);
	})();

}