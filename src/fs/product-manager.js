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
}
