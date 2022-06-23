import app from '../../server'
import chai from 'chai'
import chaiHttp = require('chai-http')
import 'mocha'
chai.use(chaiHttp)

describe('Hello World API Request', () => {
    it('should return response on call', () => {
        return chai
            .request(app)
            .get('/')
            .then((res) => {
                chai.expect(res.text).to.eql('Hello World!')
            })
    })
})
