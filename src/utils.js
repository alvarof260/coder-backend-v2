export const verifyProduct = (product) => {
  const message = {}
  if (typeof product.title !== 'string') {
    message.title = 'Title must be a String'
  }
  if (typeof product.description !== 'string') {
    message.description = 'Description must be a String'
  }
  if (typeof product.price !== 'number') {
    message.price = 'Price must be a Number'
  }
  if (product.thumbnail) {
    if (Array.isArray(product.thumbnail) === false) {
      message.thumbnail = 'Thumbnail must be a Array'
    }
  }
  if (typeof product.code !== 'string') {
    message.thumbnail = 'Code must be a String'
  }
  if (typeof product.stock !== 'number') {
    message.stock = 'Stock must be a Number'
  }
  return Object.keys(message).length > 0 ? message : null
}
