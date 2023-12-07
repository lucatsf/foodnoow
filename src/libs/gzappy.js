export const gzappy = async ({message, phone}) => {
  try {
    if (process.env.NEXT_NODE_ENV === 'development') {
      return {success: true}
    }
    const response = await fetch(process.env.NEXT_GZAPPY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "user_token_id": process.env.NEXT_GZAPPY_USER_TOKEN_ID,
      },
      body: JSON.stringify({
        instance_id: process.env.NEXT_GZAPPY_INSTANCE_ID,
        instance_token: process.env.NEXT_GZAPPY_INSTANCE_TOKEN,
        message,
        phone: 55+phone,
      })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error);
  }
}