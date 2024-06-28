
// TTS 2 
document.getElementById('tts-btn-2').addEventListener('click', speakText3)







function calculateSpeechDuration(text) {
     const wordsPerMinute = 100; // Average speaking rate
     const words = text.split(' ').length;
     const minutes = words / wordsPerMinute;
     return minutes * 60 * 1000; // Convert to milliseconds
}



function speakText3() {

     const text = "Hey, I am your storyteller for fairy tales. Which fairy tale would you like to hear?"
     const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
     const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
     const synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

     if (synthesizer) {

          // const duration = calculateSpeechDuration(text);

          synthesizer.speakTextAsync(
               text,
               (result) => {
                    if (result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                         console.log('Speech synthesized for text [' + text + ']');

                         setTimeout(() => {
                              document.getElementById('spinner-box').style.display = 'flex'
                         }, text.length * 90)

                         console.log("Speech synthesis completed");


                    } else {
                         console.error('Speech synthesis canceled, ' + result.errorDetails);


                    }
               },
               (err) => {
                    console.trace('Error synthesizing speech:', err);


               }
          );
     } else {
          console.error('Synthesizer not initialized');
     }
}
