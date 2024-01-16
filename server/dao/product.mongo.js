import { ProductModel } from './models/product.js'
import config from '../config/config.js'
export default class ProductMongoDao {
  getAll = async () => {
    const result = await ProductModel.find()
    return result
  }

  getAllView = async () => {
    return await ProductModel.find().lean().exec()
  }

  getById = async (id) => {
    const result = await ProductModel.findById(id)
    return result
  }

  getAllPaginates = async (req, res) => {
    try {
      // Configuración de paginación predeterminada (limit y page)
      const limit = req.query.limit || 10 // Obtener el límite de productos por página
      const page = req.query.page || 1 // Obtener la página actual
      const paginateOptions = { lean: true, limit, page } // Opciones de paginación

      // Configuración de opciones de consulta (filtros)
      const queryOptions = {}
      if (req.query.stock) queryOptions.stock = req.query.stock // Filtrar por stock
      if (req.query.price) queryOptions.price = req.query.price // Filtrar por precio
      if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 } // Orden ascendente por precio
      if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 } // Orden descendente por precio

      // Obtener los productos paginados de acuerdo a las opciones de paginación y consulta
      const result = await ProductModel.paginate(queryOptions, paginateOptions)

      // Construir enlaces para la paginación (previo y siguiente)
      let prevLink
      if (!req.query.page) {
        prevLink = `http://${req.hostname}:${config.config.port}${req.originalUrl}&page=${result.prevPage}`
      } else {
        const modifiedUrl = req.originalUrl.replace(`page=${page}`, `page=${result.prevPage}`)
        prevLink = `http://${req.hostname}:${config.config.port}${modifiedUrl}`
      }

      let nextLink
      if (!req.query.page) {
        nextLink = `http://${req.hostname}:${config.config.port}${req.originalUrl}&page=${result.nextPage}`
      } else {
        const modifiedUrl = req.originalUrl.replace(`page=${page}`, `page=${result.nextPage}`)
        nextLink = `http://${req.hostname}:${config.config.port}${modifiedUrl}`
      }

      // Devolver la respuesta con los datos de paginación y los productos obtenidos
      return {
        statusCode: 200,
        response: {
          status: 'success',
          payload: result.docs, // Lista de productos obtenidos
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          page: result.page,
          totalPages: result.totalPages,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: result.hasPrevPage ? prevLink : null,
          nextLink: result.hasNextPage ? nextLink : null
        }
      }
    } catch (err) {
      // Manejo de errores en caso de que falle la obtención de productos
      return {
        statusCode: 500,
        response: { status: 'error', error: err.message } // Devolver un mensaje de error
      }
    }
  }

  create = async (product) => {
    const result = await ProductModel.create(product)
    return result
  }

  update = async (id, product) => {
    const result = await ProductModel.findOneAndUpdate({ _id: id }, product, { returnDocument: 'after' })
    return result
  }

  delete = async (id) => {
    const result = await ProductModel.findOneAndDelete({ _id: id }, { returnDocument: 'after' })
    return result
  }
}
