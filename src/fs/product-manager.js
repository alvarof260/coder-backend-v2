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
      const response = await readFile(this.#path, 'utf-8') // recibo los datos que tiene el archivo como json stringify
      const products = JSON.parse(response) // paso a tenerlo parseado para poder trabajar con el array
      return products
    } catch (err) {
      console.error('Error al leer el archivo: ', err) // manejo los errores
    }
  }

  addProduct = async (product) => {
    try {
      const { title, description, price, thumbnail, code, stock } = product // recibo los datos del producto a añadir
      if (!title || !description || !price || !thumbnail || !code || !stock) return { sucess: false, error: 'Faltan datos al productos.' } // verificacion de datos, en el cual faltan datos retorna un error
      const products = await this.getProduct() // obtengo el array de producto para trabajar
      const id = this.generateID(products) // genero el id
      const productToAdd = { title, description, price, thumbnail, code, stock, id } // creo el objeto del producto
      products.push(productToAdd) // agrego al array para luego pasarlo al archivo
      await this.atomicWriteFile(products)
      return { sucess: true, payload: productToAdd }
    } catch (err) {
      console.error('Error al añadir el producto al archivo: ', err)
      throw new Error('No se pudo añadir el producto.')
    }
  }

  generateID = (products) => {
    return (products.length === 0) ? 1 : products[products.length - 1].id + 1
  }

  atomicWriteFile = async (products) => {
    try {
      // Realizar escritura de manera "atómica" para garantizar la consistencia de los datos
      await writeFile(this.#path, JSON.stringify(products, null, '\t'))
    } catch (err) {
      console.error('Error al escribir en el archivo: ', err)
      throw new Error('No se pudo escribir en el archivo.') // Propagar el error para un manejo superior
    }
  }
}
(async () => {
  const dm = new ProductManager('src/data/products.json')
  const products = await dm.getProduct()
  const productAdd = await dm.addProduct({
    title: 'Libreta de Notas',
    description: 'Libreta con tapa dura y páginas rayadas',
    price: 9.99,
    thumbnail: 'https://ejemplo.com/libreta.png',
    code: 'LB_RAYADA_003'
  })
  console.log(products)
  console.log(productAdd)
})()
