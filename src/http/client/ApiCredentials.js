class ApiCredentials{

  constructor(token, secret) {
    this.token = token
    this.secret = secret
  }

  getParsedToken() {
    let parsedToken = null
    const parts = this.token.split('.')

    if (parts.length == 3) {
        const part = parts[1]
        let data = this.addPadding(part)

        data = this.replace(data, '_', '/')
        data = this.replace(data, '-', '+')

        const decodedData = Buffer.from(data, 'base64')
        parsedToken = JSON.parse(decodedData)
    }else{
        console.log('Invalid token')
    }
    return parsedToken
  }

  addPadding(s) {
    const missing = s.length % 4
    let ret = s
    for (let i = 0; i < missing; i++) {
      ret = ret + '='
    }
    return ret
  }

  replace(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement)
  }
}
module.exports = ApiCredentials