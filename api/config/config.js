require('dotenv').config();

module.exports = {
  development: {
    database: 'cyf_todolist',
    use_env_variables: 'DB_DEV_URL',
    username: 'cyf',
    password: 'password',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    database: 'cyf_todolist',
    use_env_variables: 'DB_TEST_URL',
    dialect: 'postgres',
  },
  production: {
    database: 'cyf_todolist',
    use_env_variables: 'DB_PROD_URL',
    dialect: 'postgres',
  },
}