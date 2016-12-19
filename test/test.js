'use strict';

const expect   = require('expect');
const tinystub = require('../index');
const request  = require('request-promise');

const api = request.defaults({
  json: true,
  resolveWithFullResponse: true,
})

describe("tinystub", function () {
  let handle;
  before(function() {
    handle = tinystub(4242);
  })

  after(function() {
    handle();
  })

  it("listens", function () {
    const handle = tinystub(6969);
    return api('http://localhost:6969').then(function(response) {
      expect(response.statusCode).toEqual(200);
      handle();
    })
  });

  it("closes", function () {
    const handle = tinystub(6888);
    handle();

    return api('http://localhost:6888').then(shouldFail).catch(function(err) {
      expect(err.name).toEqual('RequestError');
      expect(err.message).toMatch('ECONNREFUSED');
    })
  });

  describe("echoing", function() {
    it("sends back status code", function () {
      return api('http://localhost:4242?status=418').then(shouldFail).catch(function(err) {
        expect(err.statusCode).toEqual(418);
      });
    });

    it("sends back request body", function () {
      const body = { payload_received: 'absolutely' };
      return api('http://localhost:4242?status=269', { body: body}).then(function(response) {
        expect(response.statusCode).toEqual(269);
        expect(response.body).toExist();
        expect(response.body.payload_received).toEqual('absolutely');
      })
    });

    it("listens on arbitrary nested paths", function () {
      return api('http://localhost:4242/cool/nice/great?status=204').then(function(response) {
        expect(response.statusCode).toEqual(204);
      })
    });
  })
});

function shouldFail(result) {
  throw new Error(`Expected failure but got success: ${JSON.stringify(result)}`)
}
