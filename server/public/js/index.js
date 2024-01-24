/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const socketClient = io()

document.getElementById('formPost').addEventListener('submit', (evt) => {
  // evitar el evento predeterminado del submit
  evt.preventDefault()
  // creo el producto para poder pasar por body del fetch
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('desc').value,
    price: parseInt(document.getElementById('price').value),
    code: document.getElementById('code').value,
    stock: parseInt(document.getElementById('stock').value),
    status: document.getElementById('status').value === 'true',
    category: document.getElementById('category').value
  }

  // reseteo los inputs
  document.getElementById('title').value = ''
  document.getElementById('desc').value = ''
  document.getElementById('price').value = ''
  document.getElementById('code').value = ''
  document.getElementById('stock').value = ''

  // configuracion para fetch
  const postOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }

  fetch('/api/products', postOptions)
    .then(response => response.json())
    .then(response => {
      // manejar el error para que lo trabaje el catch
      if (response.status === 'error') throw new Error(response.error || 'error desconocido')
      if (response.status === 'unauthorized') throw new Error(response.error || 'error desconocido')
      alert('The product was created successfully!')
    })
    .then(() => fetch('/api/products/realtime'))
    .then(response => response.json())
    .then(data => {
      socketClient.emit('listProductUpdate', data)
    })
    .catch(err => {
      console.log(err)
      alert(err || 'se produjo un error')
    })
})

const tbody = document.getElementById('list') || document.getElementsByTagName('tbody')

socketClient.on('listProduct', (data) => {
  tbody.innerHTML = ' '
  for (const product of data) {
    const tr = document.createElement('tr')
    const status = product.status === true ? '✅' : '❌'
    tr.innerHTML =
    `
    <td><button onclick="deleteProduct('${product._id}')">Eliminar</button></td>
    <td>${product.title}</td>
    <td>${product.description}</td>
    <td>${product.price}</td>
    <td>${product.code}</td>
    <td>${product.stock}</td>
    <td>${status}</td>
    <td>${product.category}</td>
    `
    tbody.appendChild(tr)
  }
})

const deleteOptions = {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'
  }

}

function deleteProduct (id) {
  fetch(`/api/products/${id}`, deleteOptions)
    .then(response => response.json())
    .then(response => {
      if (response.status === 'error') throw new Error(response.error || 'error desconocido')
      if (response.status === 'unauthorized') throw new Error(response.error || 'error desconocido')
      alert('The product was deleted successfully!')
    })
    .then(() => fetch('/api/products/realtime'))
    .then(response => response.json())
    .then(data => {
      socketClient.emit('listProductUpdate', data)
    })
    .catch(err => {
      console.log(err)
      alert(err || 'se produjo un error')
    })
}
