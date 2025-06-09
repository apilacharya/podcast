import { Router } from "express";

const authRoutes: Router = Router()

authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);
authRoutes.post('/signout', signout);

export default authRoutes;