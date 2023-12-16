import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

class ProductManager {
  #path // ocultar la propiedad
  constructor (path) {
    this.#path = path // guardar ruta donde se guarda los productos
    this.#init() // inicializar la ruta donde se guarda los productos
  }

  #init = async () => {
    if (!existsSync(this.#path)) {
      await writeFile(this.#path, JSON.stringify([], null, '\t'))
    }
  }

  getProduct = async () => {
    try {
      const response = await readFile(this.#path, 'utf-8')
      const products = JSON.parse(response)
      return products
    } catch (err) {
      console.error('Error al leer el archivo', err)
    }
  }
}
(async () => {
  const dm = new ProductManager('src/data/products.json')
  const products = await dm.getProduct()
  console.log(products)
})()
