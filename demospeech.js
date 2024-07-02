
// // TTS 2 
// // document.getElementById('tts-btn-2').addEventListener('click', speakText3)





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
                         console.log("TTS Completed")
                    } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
                         console.log("TTS Canceled")
                    }
                    const duration = result.privAudioDuration / 10000

                    // setTimeout(() => {
                    //      document.getElementById('spinner-box').style.display = 'flex'
                    // }, duration)

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