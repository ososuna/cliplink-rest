import { CustomError } from '../../domain';
import { RedirectUrl } from '../../domain';
export class ShortenerController {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
        this.handleError = (error, res) => {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.log(error); // winston logger
            return res.status(500).json({ error: 'internal server error' });
        };
        this.shorten = (req, res) => {
            const shortId = req.params.shortId;
            new RedirectUrl(this.urlRepository)
                .execute(shortId)
                .then(data => res.redirect(data.originalUrl))
                .catch(error => this.handleError(error, res));
        };
        this.welcome = (req, res) => {
            res.send('Welcome to the amazing and powerful ClipLink API!');
        };
    }
}
//# sourceMappingURL=controller.js.map