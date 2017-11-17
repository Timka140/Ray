module.exports = (password)=> {
    const crypto = require('crypto');
    const secret = 'qpdgwriwdlf';

    const hash = crypto.createHmac('sha256', secret)
                    .update(password)
                    .digest('hex');
    return hash;
}
