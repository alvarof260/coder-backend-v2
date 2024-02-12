import { User, Product, Ticket, Cart, UserPassword } from '../dao/factory.js'
import UserRepository from './user.js'
import ProductRepository from './product.js'
import TicketRepository from './ticket.js'
import CartRepository from './cart.js'
import UserPasswordRepository from './userpassword.js'

export const UserServices = new UserRepository(new User())
export const ProductServices = new ProductRepository(new Product())
export const TicketServices = new TicketRepository(new Ticket())
export const CartServices = new CartRepository(new Cart())
export const UserPasswordServices = new UserPasswordRepository(new UserPassword())
