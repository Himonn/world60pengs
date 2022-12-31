require('dotenv').config();
const Discord = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
    ],
});

const DISC_TOKEN = process.env.PENGS_DISC_TOKEN;
bot.login(DISC_TOKEN);

bot.once("ready", function(error){
    console.log("Bot Started...");
    sendMessage("Bot Started...")
    bot.user.setActivity("Hunting Penguins");
});

var timeout = 15 * 1000;
let lastLocation = "";

setInterval(getPenguins, timeout);

async function getPenguins()
{
    const url = `https://jq.world60pengs.com/rest/index.php?m=activepenguin`;

    const res = await fetch(url);
    const json = await res.json();
    if (res.status < 200 || res.status >= 300) throw new Error(JSON.stringify(res));

    findPenguin(json);
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