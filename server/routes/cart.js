import { Router } from 'express'
import {
  createCartController as createCart,
  getByIdCartController as getByIdCart,
  updateProductFromCartController as updateProductFromCart,
  deleteProductFromCartController as deleteProductFromCart,
  updateCartController as updateCart,
  updateQuantityProductController as updateQuantityProduct,
  deleteCartController as deleteCart,
  purchasedCartController as purchaseCart,
  successPurchaseController as successPurchase
} from '../controllers/cart.js'
import { passportCall } from '../utils.js'
import { handlePolicies } from '../middlewares/auth.js'

const router = Router()

// crear el carrito
router.post('/', createCart)

// Obtener el carrito por su ID
router.get('/:cid([a-fA-F0-9]{24})', getByIdCart)

// Actualizar los productos que estan en el carrito
router.post('/:cid([a-fA-F0-9]{24})/product/:pid([a-fA-F0-9]{24})', passportCall('jwt'), handlePolicies(['USER', 'PREMIUM', 'ADMIN']), updateProductFromCart)

// borrar un producto de un carrito
router.delete('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', deleteProductFromCart)

// Modificar el carrito
router.put('/:cid([a-fA-F0-9]{24})', updateCart)

// Modificar la cantidad del producto en un carrito
router.put('/:cid([a-fA-F0-9]{24})/products/:pid([a-fA-F0-9]{24})', updateQuantityProduct)

// eliminar todos los productos del carrito
router.delete('/:cid([a-fA-F0-9]{24})', deleteCart)

router.post('/:cid([a-fA-F0-9]{24})/purchase', passportCall('jwt'), purchaseCart)

router.get('/success/:tid', successPurchase)

router.get('/cancel', (req, res) => res.send('Compra cancelada'))

export default router
