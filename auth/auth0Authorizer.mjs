import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJIJAmBZt7ASdgMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1wbjNidmUxZW5tZXBvYTJpLnVzLmF1dGgwLmNvbTAeFw0yNDA0MTYw
NzI5MzBaFw0zNzEyMjQwNzI5MzBaMCwxKjAoBgNVBAMTIWRldi1wbjNidmUxZW5t
ZXBvYTJpLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANgehVnnu3v1xfVBrr3oHqAeMbjmbeJ+zSzh3CaNn8NQgxngqFrSNtEX+3YY
Ks/kartmjOfVxMWjXvXJFHfNG5oBUeUGUlk3zqFQpGqjIZP0oW6jhJ/vDS1dP6mk
0HmQalq46lSrFDlgIlvkqWIfTwO20YodjpftxUxYHOEE5b+E8lOpqVBCsXki1mqD
yPab53GypfkKoQSuaUWr48x8RamnVTfMROAD2bxuNCT54EvjaQy1KZa/DDqlaAg8
bZND45Qz+4+IUQ4cpOSoumvGAxBon/2ACrStDL11pZZoZWgfjV741KWyWT92/o4g
03djgLag+Gbu6LHOIt/wsEZt+40CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUD1pskUvntXXei5RQU5dJOegjm30wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBNLcCsRCLQsd3139xuOB6uUvrKWN4owCj9Dliqwwix
nRGFDN/VI6V2k7/bIzLKBZoxY51ev+gp2ZiFnifRSEK7m530W/Os0QuQdzocOH6S
M5eysenuH1marAHWtRmMGnT6BCsL/Rl895fGubWPoWVnnpy7Xsni9XmFYMv6tpN2
KVfoEv3InDSPNbkzHIfuCAU6xpvEz8YVAfEh0ffVzgj6FQQFAhG10vi9ondKtAKh
nhPAt0cSVftGmlsiHmgMQh6ugpwtoWIlugoamSEiEQYgQQlLI63Q7ytxnyGBSdIc
Kxmpp478JtBeBvpka5Wh3JXFbsHe7ervLW0GjOzIzfNr
-----END CERTIFICATE-----`
const logger = createLogger('auth')

//const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const verifyToken = jsonwebtoken.verify(token, certificate, {
    algorithms: ['RS256']
  });
  return verifyToken
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
