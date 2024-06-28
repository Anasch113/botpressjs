
// TTS 2 
// document.getElementById('tts-btn-2').addEventListener('click', speakText3)







// function calculateSpeechDuration(text) {
//      const wordsPerMinute = 100; // Average speaking rate
//      const words = text.split(' ').length;
//      const minutes = words / wordsPerMinute;
//      return minutes * 60 * 1000; // Convert to milliseconds
// }



// function speakText3() {

//      const text = "Hey, I am your storyteller for fairy tales. Which fairy tale would you like to hear?"
//      const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
//      const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
//      const synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

//      if (synthesizer) {

//           // const duration = calculateSpeechDuration(text);

//           synthesizer.speakTextAsync(
//                text,
//                (result) => {
//                     if (result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
//                          console.log('Speech synthesized for text [' + text + ']');

//                          setTimeout(() => {
//                               document.getElementById('spinner-box').style.display = 'flex'
//                          }, text.length * 90)

//                          console.log("Speech synthesis completed");


//                     } else {
//                          console.error('Speech synthesis canceled, ' + result.errorDetails);


//                     }
//                },
//                (err) => {
//                     console.trace('Error synthesizing speech:', err);


//                }
//           );
//      } else {
//           console.error('Synthesizer not initialized');
//      }
// }



















var authorizationToken;
var SpeechSDK;
var synthesizer;

document.addEventListener("DOMContentLoaded", function () {

     startSpeakTextAsyncButton = document.getElementById("tts-btn-2");


     startSpeakTextAsyncButton.addEventListener("click", function () {

          startSpeakTextAsyncButton.disabled = true;


          speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);


          synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

          let inputText = "Hey, I am your storyteller for fairy tales. Which fairy tale would you like to hear?";
          synthesizer.speakTextAsync(
               inputText,
               function (result) {
                    startSpeakTextAsyncButton.disabled = false;

                    if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                         toastr.success("TTS Completed")
                    } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
                         toastr.info("TTS Canceled")
                    }
                    const duration = result.privAudioDuration / 10000

                    setTimeout(() => {
                         document.getElementById('spinner-box').style.display = 'flex'
                    }, duration)

                    window.console.log("result duration", result.privAudioDuration / 10000
                    );

                    synthesizer.close();
                    synthesizer = undefined;
               },
               function (err) {
                    startSpeakTextAsyncButton.disabled = false;

                    window.console.log("err", err);

                    synthesizer.close();
                    synthesizer = undefined;
                    toastr.error("error", err)
               });
     });

     if (!!window.SpeechSDK) {
          SpeechSDK = window.SpeechSDK;
          startSpeakTextAsyncButton.disabled = false;

          //    document.getElementById('content').style.display = 'block';
          //    document.getElementById('warning').style.display = 'none';
     }
});