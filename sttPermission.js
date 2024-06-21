


const azureKey = '381cba4fbffc487e8e9b47de5887d40d';
const azureRegion = 'eastus';


document.getElementById('start-btn-2').addEventListener('click', startListening2);
document.getElementById('stop-btn-2').addEventListener('click', stopListening2);
// const azureKey = '381cba4fbffc487e8e9b47de5887d40d';
// const azureRegion = 'eastus';

let recognizer = null;






function startListening2() {


    try {


        const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
        const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognized = (s, e) => {
            if (e.result.reason === window.SpeechSDK.ResultReason.RecognizedSpeech) {
                const transcript = e.result.text;

                toastr.success(transcript)

                window.botpressWebChat.sendPayload({ type: 'text', text: transcript });

                recognizer.stopContinuousRecognitionAsync();

            } else {

                console.log('No speech could be recognized.');
                stopListening2()
                // toastr.warning('No speech could be recognized. Microphone off.');
            }
        };

        recognizer.startContinuousRecognitionAsync(
            () => {

                toastr.success('Microphone on!');
                document.getElementById('start-btn-2').style.display = 'none';
                document.getElementById('stop-btn-2').style.display = 'block';
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
            document.getElementById('start-btn-2').style.display = 'block';
            document.getElementById('stop-btn-2').style.display = 'none';
        };

        recognizer.canceled = () => {
            console.log('Recognition canceled.');
            toastr.info('Recognition canceled. Microphone off.');
            recognizer.stopContinuousRecognitionAsync();
            isListening = false;
            document.getElementById('start-btn-2').style.display = 'block';
            document.getElementById('stop-btn-2').style.display = 'none';
        };

    } catch (error) {
        console.log("Error while startListening", error)
        toastr.error("error", error)
    }

}



function stopListening2() {
    isListening = false;
    toastr.info("Microphone is off");
    document.getElementById('start-btn-2').style.display = 'block';
    document.getElementById('stop-btn-2').style.display = 'none';

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

