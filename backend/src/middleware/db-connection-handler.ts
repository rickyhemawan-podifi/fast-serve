import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { ServiceError } from '../shared/error'
export default (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    throw ServiceError.DATABASE_CONNECTION_FAILED
  }
  next()
}
