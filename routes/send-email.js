const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = async function (msg) {
	msg = msg || {}
	msg.from = msg.from || process.env.EMAIL_FROM
	
	sgMail.send(msg);
}
