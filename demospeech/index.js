

document.getElementById('start-btn').addEventListener('click', speakText)
// TTS Integration
function speakText() {

    console.log("AI is speaking.....");
    const utterance = new SpeechSynthesisUtterance("Hello, The web speech api is working");
    utterance.lang = 'en-US'; // or use selectedLanguage if you have a language selection mechanism
    utterance.pitch = 1;
  
    utterance.onend = () => {
      console.log("Speech synthesis completed");
      isSpeaking = false;
      shouldStartListening = true;
      processSpeechQueue(); // Ensure the queue is processed after speaking
    };
  
    isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

