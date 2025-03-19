import express from 'express'
import menuRouter from './menu'
import orderRouter from './order'

const router = express.Router()

router.use('/menu', menuRouter)
router.use('/order', orderRouter)

export default router
