"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortenerController = void 0;
const domain_1 = require("../../domain");
const domain_2 = require("../../domain");
class ShortenerController {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
        this.handleError = (error, res) => {
            if (error instanceof domain_1.CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.log(error); // winston logger
            return res.status(500).json({ error: 'internal server error' });
        };
        this.shorten = (req, res) => {
            const shortId = req.params.shortId;
            new domain_2.RedirectUrl(this.urlRepository)
                .execute(shortId)
                .then(data => res.redirect(data.originalUrl))
                .catch(error => this.handleError(error, res));
        };
        this.welcome = (req, res) => {
            res.send('Welcome to the amazing and powerful ClipLink API!');
        };
    }
}
exports.ShortenerController = ShortenerController;
//# sourceMappingURL=controller.js.map