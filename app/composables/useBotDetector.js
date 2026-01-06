export default (userAgent) => {
  if (!userAgent || typeof userAgent !== 'string') {
    return false
  }
  // This regex checks for common bot keywords in a case-insensitive manner.
  // It includes specific bots like YandexBot and Googlebot.
  const botRegex = /bot|crawl|spider|yandex|googlebot|googleother|headless|go-http-client|urllib3/i
  return botRegex.test(userAgent)
}