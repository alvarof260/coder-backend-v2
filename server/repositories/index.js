import { User, Product, Cart } from '../dao/factory.js'
import UserRepository from './user.js'
import ProductRepository from './product.js'
import CartRepository from './cart.js'

export const UserServices = new UserRepository(new User())
export const ProductServices = new ProductRepository(new Product())
export const CartServices = new CartRepository(new Cart())
