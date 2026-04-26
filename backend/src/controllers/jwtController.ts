import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (user: any) : any => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) : any => {
    return jwt.verify(token, JWT_SECRET);
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Unauthorized" });
    }
};

