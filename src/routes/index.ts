import 'express-async-errors'
import { Router } from 'express'

import ValidateRequestMiddleware from '@middlewares/ValidateRequestMiddleware'
import AuthMiddleware from '@middlewares/AuthMiddleware'

import AuthController from '@controllers/AuthController'
import AuthValidator from '@validators/AuthValidator'

import PlacesController from '@controllers/PlacesController'
import PlacesValidator from '@validators/PlacesValidator'

const router = Router()

// Auth
router.post('/login', AuthValidator.login, ValidateRequestMiddleware, AuthController.login)
router.post('/register', AuthValidator.register, ValidateRequestMiddleware, AuthController.register)

// Places
router.post('/places', PlacesValidator.store, ValidateRequestMiddleware, AuthMiddleware, PlacesController.store)
router.get('/places', AuthMiddleware, PlacesController.index)
router.get('/places/:placeId', PlacesValidator.checkIdParam, ValidateRequestMiddleware, AuthMiddleware, PlacesController.show)
router.put('/places/', PlacesValidator.put, ValidateRequestMiddleware, AuthMiddleware, PlacesController.put)
router.delete('/places/:placeId', PlacesValidator.checkIdParam, ValidateRequestMiddleware, AuthMiddleware, PlacesController.show)
export default router
