import app from '../../server'
import chai from 'chai'
import chaiHttp = require('chai-http')
import 'mocha'
import { UserDetail, ApplicationUsers } from '../../models/user'
// const expect = chai.expect;
const appUser = new ApplicationUsers()
chai.use(chaiHttp)

let createdUser: UserDetail
let token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiJDJiJDEwJFlycVZySTUxY1p4bWs4OHlzSWZuUXV2UGk1Rjg1eXM1U3lTcFhieWFyQU1Ub2hjbm50U21LIn0sImlhdCI6MTY1NTcyNjk1NH0.deMwtxZMr_m-vhncz0WUOVcHfq4-Nm1bs9e18jsuPVs'

describe('Application Users Handler', async () => {
    it('create should be response with created user token on call', async () => {
        await appUser.clear()

        return chai
            .request(app)
            .post('/users?firstname=test&lastname=test2&password=test123')
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .then(async (res) => {
                chai.expect(res.status).to.equals(200)
                token = res.text.split('"')[1]
                chai.expect(res.text.length).to.greaterThan(0)
            })
    })

    it('index should be response with all users on call', () => {
        return chai
            .request(app)
            .get('/users')
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .then(async (res) => {
                chai.expect(res.status).to.equals(200)

                const value = JSON.parse(res.text) as UserDetail[]
                chai.expect(value.length).to.equals(1)
                createdUser = value[0]
            })
    })

    it('authenticate should be response with a created user token', () => {
        return chai
            .request(app)
            .post(
                `/users/authenticate?firstname=${createdUser.firstname}&lastname=${createdUser.lastname}&password=test123`
            )
            .set('Accept', 'application/json')
            .then(async (res) => {
                chai.expect(res.status).to.equals(200)

                token = res.text.split('"')[1]
            })
    })

    it('show should be response with a single user or empty on call', () => {
        return chai
            .request(app)
            .get(`/users/${createdUser.id}`)
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .then(async (res) => {
                chai.expect(res.status).to.equals(200)

                const value = JSON.parse(res.text) as UserDetail
                chai.expect(value).to.eqls(createdUser)
            })
    })
})
