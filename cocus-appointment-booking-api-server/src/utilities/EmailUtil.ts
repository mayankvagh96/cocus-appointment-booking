import config from "config";
const mailgun = require("mailgun-js");
const mg = mailgun({ apiKey: config.get("emailConnections.apiKey"), domain: config.get("emailConnections.domain") });

/**
 * For sending email to appointment participants
 * 
 * @class EmailUtil
 */
class EmailUtil {

    /**
    * Returns an
    * 
    * @static
    * @returns {error object}
    * 
    * @memberOf EmailUtil
    */
    public static async sendEmail(participants: string, subject: string, description: string, place: string, date: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const participantList: string[] = participants.split(";");
            console.log(participantList);
            const data = {
                from: config.get("emailConnections.from"),
                to: participantList,
                subject: subject,
                text: "Appointment Date: " + date + ". \n" +
                    "Place: " + place + ".  \n" +
                    "Description: " + description + "."
            };
            mg.messages().send(data, ((error: any, body: any) => {
                if (error)
                    return reject(error);
                return resolve(body);
            }));
        });
    }

}

export = EmailUtil;