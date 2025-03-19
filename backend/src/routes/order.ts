import express from 'express'
import { OrderController } from '../controllers'

const router = express.Router()

router.post('/', OrderController.addToOrder)

router.get('/item/:id', OrderController.getOrderItem)
router.patch('/item/:id', OrderController.updateOrderItem)
router.delete('/item/:id', OrderController.removeOrderItem)

router.post('/confirm/:id', OrderController.confirmOrder)

router.get('/:id', OrderController.getOrder)
router.put('/:id', OrderController.updateOrder)
router.delete('/:id', OrderController.removeOrderItem)

export default router
