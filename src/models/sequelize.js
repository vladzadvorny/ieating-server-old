import { Sequelize } from 'sequelize'

import {
  dbName,
  dbUser,
  dbPassword,
  dbHost as host,
  dbPort as port
} from '../constants/config'

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host,
  port,
  dialect: 'mysql',
  logging: console.log
})

export default sequelize
