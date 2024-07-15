let isListening = false;
let isSpeaking = false;
let shouldstartListening = false;
let isConversation = false;

let synthesizer = null;
let isPermissionGranted = false

let messageQueue = [];

const didkey = "YWRkaWN0Z2FtZXI5ODFAZ21haWwuY29t:X1jWDEaJ-W8zFeFN1luSA"

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

window.botpressWebChat.onEvent(async (event) => {
  if (event.type === 'MESSAGE.RECEIVED') {
    console.log("A new message was received", event);
    const message = event.value.payload;
    if (message && message.text) {
      stopListening2();
      enqueueMessage(message.text);
    }
  } else if (event.type === 'LIFECYCLE.READY') {
    console.log("Chat interface ready", event);

    isWebChatReady = true;
    startListening2();

    document.getElementById('spinner-box').style.display = 'none';
  }
}, ['MESSAGE.RECEIVED', 'LIFECYCLE.READY']);

function enqueueMessage(text) {
  messageQueue.push(text);
  if (!isSpeaking) {
    processQueue();
  }
}

async function processQueue() {
  if (messageQueue.length === 0) {
    if (!isListening) {
      setTimeout(() => {
        startListening2();
      }, 500);
    }
    return;
  }
  const text = messageQueue.shift();
  await speakText(text);
  processQueue();
}

function speakText(text) {
  return new Promise((resolve, reject) => {
    var SpeechSDK;
    var synthesizer;

    if (!window.SpeechSDK) {
      console.error('SpeechSDK is not available');
      reject('SpeechSDK not available');
      return;
    }

    SpeechSDK = window.SpeechSDK;

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    console.log("text in speakText", text);
    if (synthesizer) {
      isSpeaking = true;

      // Play the avatar video
      const avatarVideo = document.getElementById('avatar');
      const avatarPauseVideo = document.getElementById('pause-avatar');



      synthesizer.speakTextAsync(
        text,
        (result) => {

          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {

            avatarVideo.play();
            avatarPauseVideo.pause();

            avatarVideo.style.display = 'block'
            avatarPauseVideo.style.display = 'none'

            console.log('Speech synthesized for text [' + text + ']');
            isSpeaking = false;
            console.log("Speech synthesis completed");
            const duration = result.privAudioDuration / 10000;
            setTimeout(() => {
              resolve();
              avatarPauseVideo.play();
              avatarVideo.pause();
             
              avatarVideo.style.display = 'none'
              avatarPauseVideo.style.display = 'block'

            }, duration);
          } else {
            console.error('Speech synthesis canceled, ' + result.errorDetails);
            toastr.error("error:", result.errorDetails);
            isSpeaking = false;
            resolve();
          }
          synthesizer.close();
          synthesizer = undefined;
        },
        (err) => {
          toastr.error("error", err);
          console.trace('Error synthesizing speech:', err);
          isSpeaking = false;
          resolve();
          avatarVideo.pause();
          synthesizer.close();
          synthesizer = undefined;
        }
      );
    } else {
      console.error('Synthesizer not initialized');
      toastr.error("Synthesizer not initialized");
      reject('Synthesizer not initialized');
    }
  });
}
// Select all elements with the class name 'avatar-box'
const avatarElements = document.getElementsByClassName('avatar-box');

// Loop through each element and add an event listener
for (let i = 0; i < avatarElements.length; i++) {
  avatarElements[i].addEventListener('click', () => {
    if (isWebChatReady === false) {
      document.getElementById('tts-btn-2').click();
    }

    setTimeout(() => {
      window.botpressWebChat.sendEvent({ type: 'toggleBotInfo' });
    }, 2000);

    if (isWebChatReady === true) {
      startListening2();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.avatar-box').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.add('clicked');
      setTimeout(() => {
        box.classList.remove('clicked');
      }, 100);
    });
  });
});
