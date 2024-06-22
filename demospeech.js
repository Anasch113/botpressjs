
// TTS 2 
document.getElementById('tts-btn-2').addEventListener('click', speakText2)

function speakText2() {

     console.log("AI is speaking.....");
     const utterance = new SpeechSynthesisUtterance("Hey, I am your storyteller for fairy tales. Which fairy tale would you like to hear?");
     utterance.lang = 'en-US'; // or use selectedLanguage if you have a language selection mechanism
     utterance.pitch = 1;

     utterance.onend = () => {
          // Ensure the queue is processed after speaking
           document.getElementById('spinner-box').style.display = 'flex'
     };


     window.speechSynthesis.speak(utterance);
}