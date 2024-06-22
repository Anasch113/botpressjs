





let isListening = false;
let isSpeaking = false;
let shouldstartListening = false;
let isConversation = false;

let synthesizer = null;
let botSpeaking = false;
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
      botSpeaking = true;
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

  }
}, ['MESSAGE.RECEIVED', 'LIFECYCLE.READY']);



// TTS Integration

// function calculateSpeechDuration(text) {
//   const wordsPerMinute = 150; // Average speaking rate
//   const words = text.split(' ').length;
//   const minutes = words / wordsPerMinute;
//   return minutes * 60 * 1000; // Convert to milliseconds
// }

function speakText(text) {
  const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
  const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);


  console.log("text in speakText", text)
  if (synthesizer) {
    isSpeaking = true;


    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log('Speech synthesized for text [' + text + ']');
          isSpeaking = false;
          messageCount--;
          console.log("Speech synthesis completed");

          if (messageCount > 0 && pendingMessages.length > 0) {
            setTimeout(() => {
              speakText(pendingMessages.shift());
            }, text.length * 90);
          } else {
            botSpeaking = false;
            if (!isListening) {
              startListening2();
            }
          }
        } else {
          console.error('Speech synthesis canceled, ' + result.errorDetails);
          isSpeaking = false;
          if (messageCount > 0 && pendingMessages.length > 0) {
            setTimeout(() => {
              speakText(pendingMessages.shift());
            }, duration);
          }
        }
      },
      (err) => {
        console.trace('Error synthesizing speech:', err);
        isSpeaking = false;
        if (messageCount > 0 && pendingMessages.length > 0) {
          setTimeout(() => {
            speakText(pendingMessages.shift());
          }, duration);
        }
      }
    );
  } else {
    console.error('Synthesizer not initialized');
  }
}


console.log("message count", messageCount)
// function speakText(text) {
//   console.log("AI is speaking...");
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = 'en-US';

//   utterance.onend = () => {
//     isSpeaking = false;
//     messageCount--;
//     console.log("Speech synthesis completed");

//     if (messageCount === 0) {
//       botSpeaking = false;
//       if (!isListening) {
//         startListening2();
//       }
//     }
//   };

//   utterance.onerror = (event) => {
//     console.error("Speech synthesis error:", event.error);
//     isSpeaking = false;
//     messageCount--;
//     if (messageCount === 0) {
//       botSpeaking = false;
//       if (!isListening) {
//         startListening2();
//       }
//     }
//   };

//   isSpeaking = true;
//   window.speechSynthesis.speak(utterance);
// }


console.log("botSpeaking", botSpeaking)


// STT Code


// Add an event listener to the avatar to click the permissions buttons
document.getElementById('avatar').addEventListener('click', () => {
  handleAvatar()

  if (isWebChatReady === true) {
    startListening2();
  }

  if (isWebChatReady === false) {
    document.getElementById('tts-btn-2').click();
  }



});



function handleAvatar() {

  window.botpressWebChat.sendEvent({ type: 'toggleBotInfo' })

}

// Function to request microphone permission

// function requestPermission() {
//   // Request permission to use the microphone
//   navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
//     // Initialize microphone
//     const audioTracks = stream.getAudioTracks();
//     if (audioTracks.length > 0) {
//       toastr.success("Permission Enabled")
//       isPermissionGranted = true
//       audioTracks[0].stop(); // Immediately stop the tracks to just get the permission
//     }

//     startListening2();
//   }).catch(function (err) {
//     console.error('Permission denied for microphone:', err);
//     toastr.error('error:', err);
//   });
// }

