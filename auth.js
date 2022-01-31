'use strict';

const jwt = require('jsonwebtoken');

const jwksClient = require('jwks-rsa');

// jwks uri comes from Auth0 advanced settings -> endpoints -> Oauth -> JSON Web Key Set
// if no -endpoints- the build from Basic Information -> Domain
const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

// getKey function from jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// function to verify user on our route
function verifyUser(req, errFirstOrUserCallbackFunction) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    // from jsonwebtoken
    jwt.verify(token, getKey, {}, errFirstOrUserCallbackFunction);
  } catch(err) {
    errFirstOrUserCallbackFunction('not authorized');
  }
}

module.exports = verifyUser;
