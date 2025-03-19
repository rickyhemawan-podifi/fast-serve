import express from 'express'
import { MenuController } from '../controllers'

const router = express.Router()

router.get('/active', MenuController.getActiveMenu)
router.get('/item/:id', MenuController.getMenuItem)

export default router
