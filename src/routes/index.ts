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
router.post('/places', AuthMiddleware, PlacesValidator.store, ValidateRequestMiddleware, PlacesController.store)
router.get('/places', AuthMiddleware, PlacesController.index)
router.get('/places/:placeId', AuthMiddleware, PlacesValidator.checkIdParam, ValidateRequestMiddleware, PlacesController.show)
router.put('/places/', AuthMiddleware, PlacesValidator.put, ValidateRequestMiddleware, PlacesController.put)
router.delete('/places/:placeId', AuthMiddleware, PlacesValidator.checkIdParam, ValidateRequestMiddleware, PlacesController.delete)

export default router
