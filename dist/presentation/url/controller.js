"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlController = void 0;
const domain_1 = require("../../domain");
class UrlController {
    // dependency injection 💉
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
        this.handleError = (error, res) => {
            if (error instanceof domain_1.CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.log(error); // winston logger
            return res.status(500).json({ error: 'internal server error' });
        };
        this.createUrl = (req, res) => {
            let userId;
            if (req.body.user) {
                userId = req.body.user.id;
            }
            const createParams = {
                name: req.body.name,
                originalUrl: req.body.originalUrl,
                userId
            };
            const [error, createUrlDto] = domain_1.CreateUrlDto.create(createParams);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            // create use case instance
            new domain_1.CreateUrl(this.urlRepository)
                .execute(createUrlDto)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.getUrls = (req, res) => {
            const userId = req.body.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            new domain_1.GetUrls(this.urlRepository)
                .execute(userId, page, limit, search)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.deleteUrl = (req, res) => {
            const urlId = req.params.id;
            new domain_1.DeleteUrl(this.urlRepository)
                .execute(urlId)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.getUrl = (req, res) => {
            const urlId = req.params.id;
            new domain_1.GetUrl(this.urlRepository)
                .execute(urlId)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
        this.updateUrl = (req, res) => {
            const [error, updateUrlDto] = domain_1.UpdateUrlDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }
            const urlId = req.params.id;
            const userId = req.body.user.id;
            new domain_1.UpdateUrl(this.urlRepository)
                .execute(urlId, userId, updateUrlDto)
                .then(data => res.json(data))
                .catch(error => this.handleError(error, res));
        };
    }
}
exports.UrlController = UrlController;
//# sourceMappingURL=controller.js.map