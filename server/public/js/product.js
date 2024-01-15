/* eslint-disable no-undef */
const postOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}
const cid = document.getElementById('cart')
const url = cid.href
const urlObj = new URL(url)
const ruta = urlObj.pathname

addToCart = (pid) => {
  fetch(`/api${ruta}/product/${pid}`, postOptions)
    .then(response => response.json)
    .then(response => {
      console.log(response)
      if (response.status === 'error') throw new Error(response.error)
      alert('se agrego el producto al carrito!')
    })
    .catch(err => {
      console.log(err)
      alert(err || 'se produjo un error')
    })
}

// Obtener todos los botones con la clase 'addToCartBtn'
const addToCartButtons = document.querySelectorAll('.addToCartBtn')

// Agregar evento 'click' a cada botón
addToCartButtons.forEach(button => {
  button.addEventListener('click', function (event) {
    const productId = event.target.dataset.productId // Obtener el ID del producto desde el atributo 'data-product-id'
    addToCart(productId) // Llamar a addToCart con el ID del producto
  })
})
