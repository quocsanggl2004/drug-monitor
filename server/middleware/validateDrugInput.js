// Middleware to validate drug input
module.exports = function validateDrugInput(req, res, next) {
    const { name, dosage, card, pack, perDay } = req.body;
    // a. Name has length is more than five
    if (!name || name.length <= 5) {
        return res.status(400).send({ message: 'Name must be longer than 5 characters.' });
    }
    // b. Dosage follows the format: XX-morning,XX-afternoon,XX-night . X is digit
    const dosageRegex = /^\d+-morning,\d+-afternoon,\d+-night$/;
    if (!dosage || !dosageRegex.test(dosage)) {
        return res.status(400).send({ message: 'Dosage must follow format: XX-morning,XX-afternoon,XX-night (X is digit).' });
    }
    // c. Card is more than 1000
    if (!card || Number(card) <= 1000) {
        return res.status(400).send({ message: 'Card must be greater than 1000.' });
    }
    // d. Pack is more than 0
    if (!pack || Number(pack) <= 0) {
        return res.status(400).send({ message: 'Pack must be greater than 0.' });
    }
    // e. PerDay is more than 0 and less than 90
    if (!perDay || Number(perDay) <= 0 || Number(perDay) >= 90) {
        return res.status(400).send({ message: 'PerDay must be greater than 0 and less than 90.' });
    }
    next();
}
