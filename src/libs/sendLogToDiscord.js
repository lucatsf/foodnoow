
export const sendLogToDiscord = (key, message) => {
  try {
    if (process.env.NEXT_NODE_ENV === 'production') {
      let webhookUrl
      if (key === 'log') {
        webhookUrl = 'https://discord.com/api/webhooks/1182139163982696558/T4ddNG7g9WXalfDXjXhxp-MqKQxeZDJXgkOu_ojgg3hELUDUW1dPMnU6Hi5F6_QhG3za';
      }
      if (key === 'checkout') {
        webhookUrl = 'https://discord.com/api/webhooks/1182145916732440639/QnNLu2gZq2peYZJs0neaFrSGvr4QRszjVTbJRD61uB-MHPfpgX43Tj3BbbpPCNh2D-77';
      }
      const payload = {
        content: message,
      };
      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      return fetch(webhookUrl, params);
    }
  } catch (error) {
    console.error(error);
  }
}