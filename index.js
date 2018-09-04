/*
 * Name:
 * Kimsufi-watcher
 *
 * Description:
 * Get a Telegram notification when the kimsufi server you're looking for
 * becomes available.
 *
 * Author:
 * colega (http://github.com/colega)
 * Statox (http://github.com/statox) (original code for slack integration)
 *
 * License:
 * MIT (https://github.com/colega/kimsufi-watcher/blob/master/LICENSE)
 *
 * Requirements:
 * - telegram-send-message: this can be installed with `npm install telegram-send-message`
 * - Telegram BOT configured, check: https://core.telegram.org/bots#3-how-do-i-create-a-bot
 * - Your telegram user ID, talk to @myidbot or similar in Telegram for this
 *
 * Usage:
 * - Set the following env vars:
 *   - REFERENCE: from `data-ref` attribute of the <td> on https://www.kimsufi.com/fr/serveurs.xml
 *   - ZONE: from same document, defaults to westernEurope if not provided
 *   - BOT_TOKEN: your telegram bot token (@BotFather has provided it after creation)
 *   - CHAT_ID: your chat ID, talk to @myidbot to get it
 */

var botToken = process.env.BOT_TOKEN;
if (!botToken) {
    console.log("BOT_TOKEN env var not provided");
    process.exit(1);
}

var chatId = process.env.CHAT_ID;
if (!chatId) {
    console.log("CHAT_ID env var not provided");
    process.exit(1);
}

var targetReference = process.env.REFERENCE
if (!targetReference) {
    console.log("REFERENCE env var not provided");
    process.exit(1);
}

var targetZone = process.env.ZONE || "westernEurope";

var kimsufiApiUrl = "https://ws.ovh.com/dedicated/r2/ws.dispatcher/getAvailability2?callback=Request.JSONP.request_map.request_0";

/*
 *Get the availability for the required reference in every zones
 */
function parseResponse(targetRef, body) {
    var jsonBody = body.replace(/[^(]*\(/,'').replace(/\);$/, '');

    jsonBody = JSON.parse(jsonBody);

    var availability = {};

    var ref = jsonBody = jsonBody
        .answer.availability
        .filter(a => a.reference == targetRef)[0];
    
    if (!ref) {
        console.log(`No info found for ref: ${targetReference}`);
        process.exit(1);
    }

    ref.metaZones.forEach(function(a) {
        availability[a.zone] = a.availability;
    });

    return availability;
}

function sendNotification(text) {
    request({
        method: "POST",
        uri: `https://api.telegram.org/bot${botToken}/sendMessage`,
        body: {
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        },
        json: true,
    }, (error, response, body) => {
        if (!body.ok) {
            console.error(`Telegram notification failed, error_code: ${body.error_code}, description: ${body.description}`);
        } else {
            console.debug("Telegram notification successfully sent");
        }
    });
}

function checkResponse(body) {
    var availability = parseResponse(targetReference, body);

    if (availability[targetZone] != "unavailable") {
        var message = `A ${targetReference} server is currently available at Kimsufi:\n`;
        message += "```";

        for (var zone in availability) {
            if (availability[zone] != "unavailable") {
                message += `${zone}\t${availability[zone]}\n`;
            }
        }

        message += "```\n";
        message += "URL Kimsufi: https://www.kimsufi.com/en/servers.xml";

        sendNotification(message);
    }
}

var request = require("request");
request({
   url: kimsufiApiUrl,
   time: true
}, (error, response, body) => {
    console.debug(`Request to Kimsufi took ${response.timingPhases.total}ms`);
    checkResponse(body);
});
