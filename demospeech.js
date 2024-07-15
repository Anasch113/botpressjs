
// // TTS 2 
// // document.getElementById('tts-btn-2').addEventListener('click', speakText3)





var SpeechSDK;
var synthesizer;
var startSpeakTextAsyncButton;
var avatarVideo;
var avatarPauseVideo;

document.addEventListener("DOMContentLoaded", function () {

     startSpeakTextAsyncButton = document.getElementById("tts-btn-2");
     avatarVideo = document.getElementById("avatar")
     avatarPauseVideo = document.getElementById("pause-avatar")


     startSpeakTextAsyncButton.addEventListener("click", function () {

          startSpeakTextAsyncButton.disabled = true;


          speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);


          synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

          let inputText = "Hey, ich bin dein Vorleser für Märchen. Welches Märchen möchtest du hören?";
          synthesizer.speakTextAsync(
               inputText,
               function (result) {
                    startSpeakTextAsyncButton.disabled = false;

                    avatarVideo.play();
                    avatarPauseVideo.pause();
                    avatarVideo.style.display = 'block'
                    avatarPauseVideo.style.display = 'none'

                    if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                         console.log("TTS Completed")
                    } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
                         console.log("TTS Canceled")
                    }
                    const duration = result.privAudioDuration / 10000

                    setTimeout(() => {
                         avatarPauseVideo.play();
                         avatarVideo.pause();
                        
                         avatarVideo.style.display = 'none'
                         avatarPauseVideo.style.display = 'block'
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