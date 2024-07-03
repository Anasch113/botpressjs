





let isListening = false;
let isSpeaking = false;
let shouldstartListening = false;
let isConversation = false;

let synthesizer = null;

let messageCount = 0;
let isPermissionGranted = false
let pendingMessages = [];



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
      botSpeaking = true
      stopListening2();
      pendingMessages.push(message.text);

      if (!isSpeaking) {
        speakText(pendingMessages.shift());
      }
    }
  }
  else if (event.type === 'LIFECYCLE.READY') {
    console.log("Chat interface ready", event);
    isWebChatReady = true

    startListening2()

    document.getElementById('spinner-box').style.display = 'none'

  }
}, ['MESSAGE.RECEIVED', 'LIFECYCLE.READY']);




console.log("bot speaking", botSpeaking)
// }

function speakText(text) {
  var SpeechSDK;
  var synthesizer;

  // Ensure Speech SDK is available
  if (!window.SpeechSDK) {
    console.error('SpeechSDK is not available');
    return;
  }

  SpeechSDK = window.SpeechSDK;

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
  synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

  console.log("text in speakText", text);
  if (synthesizer) {
    isSpeaking = true;

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log('Speech synthesized for text [' + text + ']');
          isSpeaking = false;
          messageCount--;
          console.log("Speech synthesis completed");
          console.log("result data", result);
          console.log(" pending messages ", pendingMessages.length);
          const duration = result.privAudioDuration / 10000;

          if (messageCount > 0 && pendingMessages.length > 0) {
            botSpeaking = true;

            setTimeout(() => {
              speakText(pendingMessages.shift());
            }, duration);

          } else {



            if (!isListening) {
              botSpeaking = false;
              setTimeout(() => {

                startListening2();
              }, duration);


            }
          }
        } else {
          console.error('Speech synthesis canceled, ' + result.errorDetails);
          toastr.error("error:", result.errorDetails)
          isSpeaking = false;
          if (messageCount > 0 && pendingMessages.length > 0) {
            setTimeout(() => {
              speakText(pendingMessages.shift());
            }, duration);
          }
        }

        synthesizer.close();
        synthesizer = undefined;
      },
      (err) => {
        toastr.error("error", err)
        console.trace('Error synthesizing speech:', err);
        isSpeaking = false;
        if (messageCount > 0 && pendingMessages.length > 0) {
          setTimeout(() => {
            speakText(pendingMessages.shift());
          }, duration);
        }

        synthesizer.close();
        synthesizer = undefined;
      }
    );
  } else {
    console.error('Synthesizer not initialized');
    toastr.error("Synthesizer not initialized")
  }
}

console.log("message count", messageCount)


// Add an event listener to the avatar to click the permissions buttons
document.getElementById('avatar').addEventListener('click', () => {
  handleAvatar()

  if (isWebChatReady === true) {
    startListening2();
  }

  if (isWebChatReady === false) {
    document.getElementById('tts-btn-2').click()
  }


});

console.log("iswebchat", isWebChatReady)

function handleAvatar() {

  window.botpressWebChat.sendEvent({ type: 'toggleBotInfo' })

}


document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.avatar-box').forEach(box => {
      box.addEventListener('click', () => {
          box.classList.add('clicked');
          setTimeout(() => {
              box.classList.remove('clicked');
          }, 100); // Duration matches the animation time
      });
  });
});