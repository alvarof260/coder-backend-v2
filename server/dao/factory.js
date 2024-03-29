import config from '../config/config.js'

export let User
export let Product
export let Cart
export let Ticket
export let UserPassword

switch (config.config.persistence) {
  case 'MONGO': {
    const { default: UserMongoDAO } = await import('./user.mongo.js')
    const { default: ProductMongoDAO } = await import('./product.mongo.js')
    const { default: CartMongoDAO } = await import('./cart.mongo.js')
    const { default: TicketMongoDAO } = await import('./ticket.mongo.js')
    const { default: UserPasswordMongoDAO } = await import('./userpassword.mongo.js')
    User = UserMongoDAO
    Product = ProductMongoDAO
    Cart = CartMongoDAO
    Ticket = TicketMongoDAO
    UserPassword = UserPasswordMongoDAO
    break
  }
  case 'FILESYSTEM': {
    const { default: ProductFileDAO } = await import('./product.file.js')
    const { default: CartFileDAO } = await import('./cart.file.js')
    Product = ProductFileDAO
    Cart = CartFileDAO
    break
  }
}
