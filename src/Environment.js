class Environment{

    static getEnvironment(env){

        const config = {
            production: 'https://api.trusona.net',
            uat: 'https://api.staging.trusona.net'
          }
    
          return config[env] || config.production
    }
}

module.exports = Environment