const azureKey = '381cba4fbffc487e8e9b47de5887d40d';
const azureRegion = 'eastus';
const botId = '3dccdf08-4fc2-462e-b70e-3cf786df4926';
const botClientId = '3dccdf08-4fc2-462e-b70e-3cf786df4926';

let isListening = false;
let isSpeaking = false;
let shouldStartListening = false;
let isConversation = false;
let recognizer = null;
let synthesizer = null;
let speechQueue = [];


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

// Botpress Integration
window.botpressWebChat.init({
    botId: botId,
    hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
    messagingUrl: 'https://messaging.botpress.cloud',
    clientId: botClientId,
    botName: 'Fairy Tales',
    enableConversationDeletion: true,
    showConversationsButton: true,
});

window.botpressWebChat.onEvent((event) => {
    // if (event.type === 'LIFECYCLE.READY') {
    //     console.log("Chat interface ready", event);
    //     const initialMessage = "Conversation Started";
    //     window.botpressWebChat.sendPayload({
    //         type: 'text',
    //         text: initialMessage,
    //     });
    // }
    if (event.type === 'MESSAGE.RECEIVED')
    console.log("A new message was received", event);
    const message = event.value.payload;
    isConversation = true;
    if (message && message.text) {
        speechQueue.push(message.text);
        processSpeechQueue();
    }

}, [ 'MESSAGE.RECEIVED']);

// Initialize Azure Speech Synthesizer
const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

// TTS Integration
function speakText(text) {
    if (synthesizer) {
        isSpeaking = true;
        synthesizer.speakTextAsync(
            text,
            (result) => {
                if (result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    console.log('Speech synthesized for text [' + text + ']');
                    setTimeout(() => {
                        isSpeaking = false;
                        shouldStartListening = true;
                        processSpeechQueue();
                        if (!isListening && speechQueue.length === 0) {
                            startListening();
                        }
                    }, text.length * 100);
                } else {
                    console.error('Speech synthesis canceled, ' + result.errorDetails);
                    isSpeaking = false;
                }
            },
            (err) => {
                console.trace('Error synthesizing speech:', err);
                isSpeaking = false;
            }
        );
    } else {
        console.error('Synthesizer not initialized');
    }
}

function processSpeechQueue() {
    if (!isSpeaking && speechQueue.length > 0 && isConversation) {
        stopListening();
        const nextText = speechQueue.shift();
        speakText(nextText);
    } else if (!isSpeaking && speechQueue.length === 0 && shouldStartListening) {
        startListening();
        shouldStartListening = false;
    }
}

document.getElementById('start-permission-btn').addEventListener('click', requestPermission);

function requestPermission() {
  // Request permission to use the microphone
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    // Initialize microphone
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].stop(); // Immediately stop the tracks to just get the permission
    }
    document.getElementById('start-permission-btn').style.display = 'none';
    document.getElementById('start-btn').style.display = 'block';
    startListening();
  }).catch(function(err) {
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
    toastr.success('Microphone is on, you can start speaking now.');
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('stop-btn').style.display = 'block';


    const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
    const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognized = (s, e) => {
        if (e.result.reason === window.SpeechSDK.ResultReason.RecognizedSpeech) {
            const transcript = e.result.text;
            window.botpressWebChat.sendPayload({ type: 'text', text: transcript });
            toastr.success('Recognition complete. Microphone off.');
            recognizer.stopContinuousRecognitionAsync();

        } else {
            recognizer.stopContinuousRecognitionAsync();
            console.log('No speech could be recognized.');
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
