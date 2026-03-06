import { login } from "../controllers/user.controller";

const userRoutes = async(fastify, options) => {
    fastify.post("/login", login);
}

export default userRoutes;