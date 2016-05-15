var ball   = document.querySelector('.ball');
var garden = document.querySelector('.garden');
var output = document.querySelector('.output');

var maxX = garden.clientWidth  - ball.clientWidth;
var maxY = garden.clientHeight - ball.clientHeight;


var context;
var gainNode;
var biquadFilter;

function handleOrientation(event) {
  var x = event.beta;  // In degree in the range [-180,180]
  var y = event.gamma; // In degree in the range [-90,90]

  output.innerHTML  = "beta : " + x + "\n";
  output.innerHTML += "gamma: " + y + "\n";

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x >  90) { x =  90};
  if (x < -90) { x = -90};

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 90;


  x /=  90;
  y /=  90;

  // gainNode.gain.value = x;
  gainNode.gain.value = x;
  biquadFilter.Q.value = y * 20;
  biquadFilter.frequency.value = y * 1000.0;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  ball.style.top  = (maxX*x/180 - 10) + "px";
  ball.style.left = (maxY*y/180 - 10) + "px";
}

window.addEventListener('deviceorientation', handleOrientation);


window.addEventListener('load', init, false);
function init() {
  try {
      window.onload = init;
      var context;
      var bufferLoader;

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();

      gainNode = context.createGain();

      bufferLoader = new BufferLoader(
        context,
        [
          'white-noise.wav',
        ],
        finishedLoading
      );

      bufferLoader.load();

      function finishedLoading(bufferList) {
        console.log('finished loading');
        // Create two sources and play them both together.
        var source1 = context.createBufferSource();
        source1.buffer = bufferList[0];
        source1.loop = true;

        biquadFilter = context.createBiquadFilter();

        source1.connect(gainNode);
        gainNode.connect(biquadFilter);
        // gainNode.conect(context.destination)
        biquadFilter.connect(context.destination);
        gainNode.gain.value = 0.5;

        biquadFilter.type = "lowpass";

        source1.start(0);
      }
  } catch(e) {
    console.log(e);
    alert('Web Audio API is not supported in this browser');
  }
}
