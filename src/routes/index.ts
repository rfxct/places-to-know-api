import 'express-async-errors'
import { Router } from 'express'

import AuthController from '@controllers/AuthController'
import AuthValidator from '@validators/AuthValidator'

import ValidateRequestMiddleware from '@middlewares/ValidateRequestMiddleware'
// import AuthMiddleware from '@middlewares/AuthMiddleware'

const router = Router()

// Auth
router.post('/login', AuthValidator.auth, ValidateRequestMiddleware, AuthController.authenticate)
router.post('/register', AuthValidator.store, ValidateRequestMiddleware, AuthController.register)

export default router
