/* eslint-disable no-undef */
import { expect } from 'chai'
import supertest from 'supertest'
import { fakerES as faker } from '@faker-js/faker'

const request = supertest('http://localhost:8080')

describe('Test routes', function () {
  this.timeout(4000)
  describe('Register, login, logout', function () {
    describe('Register', () => {
      const userValid = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 100 }),
        password: faker.internet.password()
      }
      const userInvalid = {
        email: 'userinvalid@gmail.com',
        password: 'userinvalid'
      }

      it('should register a new user', async () => {
        const response = await request
          .post('/api/session/register')
          .send(userValid)
          .expect(302)
        expect(response.header.location).to.equal('/')
      })

      it('should not register a new user', async () => {
        const response = await request
          .post('/api/session/register')
          .send(userInvalid)
        expect(response.status).to.equal(500)
      })
    })
    describe('Login', () => {
      const userValid = {
        email: 'alvarof260@gmail.com',
        password: 'delfina2'
      }
      const userInvalid = {
        email: '',
        password: ''
      }
      it('should login a user', async () => {
        const response = await request
          .post('/api/session/login')
          .send(userValid)
          .expect(302)
        expect(response.header.location).to.equal('/products')
      })
      it('should not login a user', async () => {
        const response = await request
          .post('/api/session/login')
          .send(userInvalid)
        expect(response.status).to.equal(302)
      })
    })
    describe('Logout', () => {
      it('should logout a user', async () => {
        const response = await request.get('/api/session/logout').expect(302)
        expect(response.header.location).to.equal('/')
      })
    })
  })
  describe('Products', () => {
    let token
    before(async () => {
      const response = await request.post('/api/session/login').send({
        email: 'alvarof260@gmail.com',
        password: 'delfina2'
      })
      token = response.header['set-cookie'].find((cookie) =>
        cookie.includes('jwt-token')
      )
    })
    describe('Get products', () => {
      it('should get all products', async () => {
        const response = await request
          .get('/api/products')
          .set('Cookie', token)
          .expect(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.payload).to.be.an('array')
      })
    })
    describe('Get product by id', () => {
      it('should get a product by id', async () => {
        const response = await request
          .get('/api/products/659861f40ccd98933085ec99')
          .set('Cookie', token)
          .expect(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.payload).to.be.an('object')
      })
    })
  })
  describe('Cart', () => {
    let token
    before(async () => {
      const response = await request.post('/api/session/login').send({
        email: 'alvarof260@gmail.com',
        password: 'delfina2'
      })
      token = response.header['set-cookie'].find((cookie) =>
        cookie.includes('jwt-token')
      )
    })
    describe('Get cart', () => {
      it('should get a cart', async () => {
        const response = await request
          .get('/api/carts/659de753bfa5d9a67cd18741')
          .set('Cookie', token)
          .expect(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.payload).to.be.an('object')
      })
    })
  })
})
