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
        const sent = [], unsent = [];
        loadTemplate(template, contexts).then(results => {
            const promises = [];
            results.forEach(result => {
                mailing.transporter.sendMail({
                    to: result.context.email,
                    from: mailer.sender,
                    subject: result.context.subject,
                    html: result.email
                }, (err, info) => {
                    promises.push(new Promise(resolve => resolve()));
                    console.log(err, info);
                    if (err) {
                        unsent.push(info.messageId)
                    } else {
                        sent.push(info.messageId)
                    }
                });
            });
            Promise.all(promises).then(otp => {
                resolve(otp, sent, unsent);
            }).catch(error => {
                resolve(error, sent, unsent);
            });
        });
    })

    // return new Promise((resolve, reject) => {
    //     const sent = [], unsent = [];
    //     loadTemplate(template, contexts).then(results => {
    //         const promises = [];
    //         results.forEach(result => {
    //             mailing.transporter.sendMail({
    //                 to: result.context.email,
    //                 from: mailing.sender,
    //                 subject: result.context.subject,
    //                 html: result.email,
    //             }
    //         });
    //         Promise.all(promises);
    //         })).then(() => resolve()).catch(e => reject(e));
    //     }).catch(e => reject(e));
    // });

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