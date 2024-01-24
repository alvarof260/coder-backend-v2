import { Router } from 'express'
import { handlePolicies } from '../middlewares/auth.js'
import {
  getProductsController as getProducts,
  getProductByIdController as getProductByID,
  createProductController as createProduct,
  updateProductController as updateProduct,
  deleteProductController as deleteProduct,
  mockProductsController as mockProducts
} from '../controllers/product.js'

/* import { ProductManager } from '../dao/fs/product-manager.js'
import { verifyProduct, verifyProductPartial } from '../utils.js' */

// Inicializar recursos importantes para el trabajo del CRUD
// const PM = new ProductManager('./server/data/products.json')
const router = Router()

// Obtener todos los productos o limitar la lista de productos
router.get('/', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), getProducts)

// Obtener un producto por su id
router.get('/:pid([a-fA-F0-9]{24})', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), getProductByID)

// Agregar un producto a la base de datos
router.post('/', handlePolicies(['USER', 'PREMIUM', 'ADMIN']), createProduct)

// Obtener un producto por su id y actualizar datos
router.put('/:pid([a-fA-F0-9]{24})', handlePolicies(['PREMIUM', 'ADMIN']), updateProduct)

// Eliminar un producto de la base de datos
router.delete('/:pid([a-fA-F0-9]{24})', handlePolicies(['PREMIUM', 'ADMIN']), deleteProduct)

router.get('/create/mockProducts', mockProducts)

export default router
