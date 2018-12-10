const mailing = require('./nodemailer.helper');
const EmailTemplate = require('email-templates');
const path = require('path');

/**
 * @description: Sends an rendered email
 * @param template
 * @param contexts
 * @return {Promise<any>}
 */
module.exports.mail = (template, contexts) => {

    // Contexts need to be typeof Array
    if (!Array.isArray(contexts)) {
        let temp = contexts;
        contexts = [];
        contexts.push(temp);
    }

    return new Promise((resolve, reject) => {
        loadTemplate(template, contexts).then(results => {
            let sent = [], unsent = [];
            const promises = [];
            results.forEach(result => {
                promises.push(new Promise((success, error) => {
                    mailing.transporter.sendMail({
                        to: result.context.email,
                        from: mailing.sender,
                        subject: result.context.subject,
                        html: result.email
                    }, (err, info) => {
                        if (err) { unsent.push(err.rejected[0]); } else { sent.push(info.accepted[0]); }
                        success();
                    });
                }));
            });
            Promise.all(promises).then(() => {
                resolve({ sent, unsent });
            }).catch(error => {
                reject(error);
            });
        });
    })

};

/**
 * @description: Loads and renders an email template
 * @param template
 * @param contexts
 * @return {Promise<any[]>}
 */
function loadTemplate (template, contexts) {

    let Template = new EmailTemplate({
        views: {
            options: {
                extension: 'ejs'
            },
            root: path.resolve(__dirname)
        }
    });

    return Promise.all(contexts.map(context => {
        return new Promise((resolve, reject) => {
            Template.render(path.join('../templates/emails', template, 'index'), context)
                .then(result => {
                    return resolve({ email: result, context });
                })
                .catch(error => { return reject(error) });
        });
    }));

}