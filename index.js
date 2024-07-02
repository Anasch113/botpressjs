



let isListening = false;
let isSpeaking = false;
let shouldstartListening = false;
let isConversation = false;



let messageCount = 0;
let isPermissionGranted = false
let pendingMessages = [];
var startSpeakTextButton;



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
      // pendingMessages.push(message.text);


      // speakText(pendingMessages.shift());
      document.getElementById('tts-btn').click()

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
var SpeechSDK;
var synthesizer;



document.addEventListener('DOMContentLoaded', function speakText() {

  startSpeakTextButton = document.getElementById("tts-btn");


  startSpeakTextButton.addEventListener("click", function () {





    speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);

    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    let text = "hello it is working"
    console.log("text in speakText", text);
    if (synthesizer) {
      isSpeaking = true;

      synthesizer.speakTextAsync(
        text,
        function (result) {
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            console.log('Speech synthesized for text [' + text + ']');
            isSpeaking = false;
            messageCount--;
            console.log("Speech synthesis completed");
            console.log("result data", result);
            console.log(" pending messages ", pendingMessages.length);
            const duration = result.privAudioDuration / 10000;

            // if (messageCount > 0 && pendingMessages.length > 0) {
            //   botSpeaking = true;

            //   setTimeout(() => {
            //     speakText(pendingMessages.shift());
            //   }, duration);

            // } else {



            //   if (!isListening) {
            //     botSpeaking = false;
            //     setTimeout(() => {

            //       startListening2();
            //     }, duration);


            //   }
            // }
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


  })
  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startSpeakTextButton.disabled = false;

    //    document.getElementById('content').style.display = 'block';
    //    document.getElementById('warning').style.display = 'none';
  }

})

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