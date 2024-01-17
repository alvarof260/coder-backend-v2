export const generateProductInfoError = (product) => {
  return `One or more properties of the user ${JSON.stringify(product)} are invalid:
    -title: must be a string, received ${typeof product.title},
    -description: must be a string, received ${typeof product.description},
    -price: must be a number, received ${typeof product.price},
    -thumbnail: must be a string, received ${typeof product.thumbnail},
    -code: must be a string, received ${typeof product.code},
    -stock: must be a number, received ${typeof product.stock},
    -status: must be a boolean, received ${typeof product.status},
    -category: must be a string, received ${typeof product.category}`
}
