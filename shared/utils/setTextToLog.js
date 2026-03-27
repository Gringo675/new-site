// helper function to set text to log
export default async text => {
  $fetch('/api/log/setText', {
    method: 'POST',
    body: {
      text,
    },
  })
}
