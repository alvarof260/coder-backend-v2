/* eslint-disable no-undef */

Swal.fire({
  title: 'Authentication',
  input: 'text',
  allowOutsideClick: false,
  confirmButtonText: 'Continue',
  preConfirm: (value) => {
    if (!value || value.trim() === '') {
      Swal.showValidationMessage('Please enter a value')
    } else {
      return value
    }
  }
})
  .then(result => {
    if (result.isConfirmed) {
      const socketClient = io()

      console.log('Input value:', result.value)

      const user = result.value
      document.getElementById('username').innerText = `${user}: `

      const messageInput = document.getElementById('message')
      messageInput.addEventListener('keyup', (evt) => {
        if (evt.key === 'Enter') {
          if (messageInput.value.trim().length > 0) {
            socketClient.emit('message', {
              user,
              message: messageInput.value
            })
            messageInput.value = ''
          }
        }
      })

      document.getElementById('send').addEventListener('click', () => {
        if (messageInput.value.trim().length > 0) {
          socketClient.emit('message', {
            user,
            message: messageInput.value
          })
          messageInput.value = ''
        }
      })
    }
  })

const socketClient = io()

socketClient.on('messages', (data) => {
  const history = document.getElementById('history')
  history.innerHTML = ''
  for (const message of data) {
    const div = document.createElement('div')
    div.className = 'messages'
    div.innerHTML = `<span>${message.user}: </span> <p>${message.message} </p>`
    history.appendChild(div)
  }
})
