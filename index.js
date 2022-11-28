require('dotenv').config();
const http = require('http');
const Discord = require('discord.js');
const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
    ],
});

const DISC_TOKEN = process.env.PENGS_DISC_TOKEN;
bot.login(DISC_TOKEN);

bot.once("ready", function(error){
    sendMessage("Bot Started...")
    bot.user.setActivity("Hunting Penguins");
});

var timeout = 15 * 1000;
let lastLocation = "";

setInterval(getPenguins, timeout);

async function getPenguins()
{
    let str = '';

    var options = {
        host: 'jq.world60pengs.com',
        path: '/rest/index.php?m=activepenguin'
    };

    callback = function(response) {
        str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            try {
                let json = JSON.parse(str);
                findPenguin(json);
            } catch (error) {
                console.error(error.message);
            };
        });
    }

    http.request(options, callback).end();
}

function findPenguin(json)
{
    json.forEach(obj => {

        if (!obj.hasOwnProperty("penguin_id") || !obj.hasOwnProperty("last_location"))
        {
            return;
        }

        if (obj["penguin_id"] === "69"){
            let location = obj["last_location"];

            if (location !== lastLocation)
            {
                lastLocation = location;
                sendMessage(location);
            }
        }
    })
}

async function sendMessage(message)
{
    bot.guilds.cache.get("363323293731651584").channels.cache.get("1046921573187199056").send(message);
}

// On Bot Exit
process.on('exit', function () {
    console.log(`Exiting...`);
});

// On Exception
process.on('uncaughtException', function(err,origin) {
    console.error('Caught exception: ' + err + ", " + origin);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});