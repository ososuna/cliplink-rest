import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
export class Server {
    constructor(options) {
        this.app = express();
        const { port = 3000, routes } = options;
        this.port = port;
        this.routes = routes;
    }
    async start() {
        // middlewares
        this.app.use(cors({
            origin: 'http://localhost:4321', // Frontend URL
            credentials: true, // Allow cookies to be sent
        }));
        this.app.use(express.json());
        this.app.use(cookieParser());
        // this.app.use(express.urlencoded({ extended: true })); // x-www-formurlencoder
        this.app.use(this.routes);
        this.app.listen(this.port, () => {
            console.log(`server running on port ${this.port}`);
        });
        return this.app;
    }
}
//# sourceMappingURL=server.js.map