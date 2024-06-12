
// TTS 2 
document.getElementById('tts-btn-2').addEventListener('click', speakText2)

function speakText2() {

    console.log("AI is speaking.....");
    const utterance = new SpeechSynthesisUtterance("Permission Enabled");
    utterance.lang = 'en-US'; // or use selectedLanguage if you have a language selection mechanism
    utterance.pitch = 1;
  
    utterance.onend = () => {
         // Ensure the queue is processed after speaking
    };
  
   
    window.speechSynthesis.speak(utterance);
  }