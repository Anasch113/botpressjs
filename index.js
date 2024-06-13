const azureKey = '381cba4fbffc487e8e9b47de5887d40d';
const azureRegion = 'eastus';


let isListening = false;
let isSpeaking = false;
let shouldStartListening = false;
let isConversation = false;
let recognizer = null;
let synthesizer = null;
let botSpeaking = false;
let messageCount = 0;


// Toastr configuration
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};


window.botpressWebChat.onEvent((event) => {

  if (event.type === 'MESSAGE.RECEIVED') {

    console.log("A new message was received", event);
    const message = event.value.payload;
    if (message && message.text) {
      messageCount++;
      botSpeaking = true;
      stopListening();
      speakText(message.text);
    }
  }
  else if (event.type === 'LIFECYCLE.READY') {
    console.log("Chat interface ready", event);
    const initialMessage = "Conversation Started";
    window.botpressWebChat.sendPayload({
      type: 'text',
      text: initialMessage,
    });
  }
}, ['MESSAGE.RECEIVED', 'LIFECYCLE.READY']);





function speakText(text) {
  console.log("AI is speaking...");
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  utterance.onend = () => {
    isSpeaking = false;
    messageCount--;
    console.log("Speech synthesis completed");

    if (messageCount === 0) {
      botSpeaking = false;
      if (!isListening) {
        startListening();
      }
    }
  };

  utterance.onerror = (event) => {
    console.error("Speech synthesis error:", event.error);
    isSpeaking = false;
    messageCount--;
    if (messageCount === 0) {
      botSpeaking = false;
      if (!isListening) {
        startListening();
      }
    }
  };

  isSpeaking = true;
  window.speechSynthesis.speak(utterance);
}


console.log("botSpeaking", botSpeaking)
document.getElementById('start-permission-btn').addEventListener('click', requestPermission);

function requestPermission() {
  // Request permission to use the microphone
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    // Initialize microphone
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].stop(); // Immediately stop the tracks to just get the permission
    }
    document.getElementById('start-permission-btn').style.display = 'none';
    document.getElementById('start-btn').style.display = 'block';
    startListening();
  }).catch(function (err) {
    console.error('Permission denied for microphone:', err);
    toastr.error('Microphone permission denied. Please enable it in your browser settings.');
  });
}



document.getElementById('start-btn').addEventListener('click', startListening);
document.getElementById('stop-btn').addEventListener('click', stopListening);

// STT Integration
function startListening() {


  if (isSpeaking || isListening) return;
  isListening = true;
  toastr.success('Microphone on!');
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('stop-btn').style.display = 'block';


  const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
  const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  recognizer = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognized = (s, e) => {
    if (e.result.reason === window.SpeechSDK.ResultReason.RecognizedSpeech) {
      const transcript = e.result.text;
      window.botpressWebChat.sendPayload({ type: 'text', text: transcript });

    
      recognizer.stopContinuousRecognitionAsync();

    } else {

      console.log('No speech could be recognized.');
      stopListening()
      // toastr.warning('No speech could be recognized. Microphone off.');
    }
  };

  recognizer.startContinuousRecognitionAsync(
    () => {
      console.log('Recognition started.');
    },
    (err) => {
      console.error('Error starting recognition:', err);
      isListening = false;
      toastr.error('Error starting recognition.');
    }
  );

  recognizer.sessionStopped = () => {
    console.log('Session stopped.');
    // toastr.info('Session stopped. Microphone off.');
    recognizer.stopContinuousRecognitionAsync();
    isListening = false;
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('stop-btn').style.display = 'none';
  };

  recognizer.canceled = () => {
    console.log('Recognition canceled.');
    toastr.info('Recognition canceled. Microphone off.');
    recognizer.stopContinuousRecognitionAsync();
    isListening = false;
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('stop-btn').style.display = 'none';
  };
}

function stopListening() {
  isListening = false;
  toastr.info("Microphone is off")
  document.getElementById('start-btn').style.display = 'block';
  document.getElementById('stop-btn').style.display = 'none';

  if (recognizer) {
    recognizer.stopContinuousRecognitionAsync(
      () => {
        console.log('Recognition stopped.');
      },
      (err) => {
        console.error('Error stopping recognition:', err);
      }
    );
  }
}
