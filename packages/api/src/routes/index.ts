import { Router } from "express";
import { authRouter } from "./auth.routes";
import { cacheRouter } from "./cache.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/cache-test", cacheRouter);

// Add more routers here:
// router.use('/users', usersRouter);

export { router };
