import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import errorHandler from './middleware/error-handler'
import { connect as connectMongo } from './utilities/mongo-connection'
import router from './routes'
import dbConnectionHandler from './middleware/db-connection-handler'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(dbConnectionHandler)
app.use(router)
app.use(errorHandler)

connectMongo()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
