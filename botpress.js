
const botId = '3dccdf08-4fc2-462e-b70e-3cf786df4926';
const botClientId = '3dccdf08-4fc2-462e-b70e-3cf786df4926';

// Botpress Integration
window.botpressWebChat.init({
    botId: botId,
    hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
    messagingUrl: 'https://messaging.botpress.cloud',
    clientId: botClientId,
    botName: 'Fairy Tales',
    enableConversationDeletion: true,
    // stylesheet: "https://webchat-styler-css.botpress.app/prod/code/ba3a8c3d-4c8f-4551-b743-dfd4a69e436e/v90243/style.css"



});