var _a;
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';
export class CreateUrlMiddleware {
}
_a = CreateUrlMiddleware;
CreateUrlMiddleware.validateJWT = async (req, res, next) => {
    const token = req.cookies.access_token;
    try {
        const payload = await JwtAdapter.validateToken(token);
        if (!payload)
            return next();
        const user = await UserModel.findById(payload.id);
        if (!user)
            return next();
        req.body.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server error' });
    }
};
//# sourceMappingURL=create-url.middleware.js.map