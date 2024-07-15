




const botId = 'fd1cd0c2-7f7c-40cc-a27e-4910b771b151';
const botClientId = 'fd1cd0c2-7f7c-40cc-a27e-4910b771b151';

// Botpress Integration
window.botpressWebChat.init({
  botId: botId,
  hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
  messagingUrl: 'https://messaging.botpress.cloud',
  clientId: botClientId,
  botName: 'Fairy Tales',
  enableConversationDeletion: true,
  stylesheet: "https://webchat-styler-css.botpress.app/prod/code/ba3a8c3d-4c8f-4551-b743-dfd4a69e436e/v90243/style.css"



});
