# kimsufi-telegram-watcher
Get a Telegram notification from your bot when the Kimsufi server you're looking for is available.

## Usage
### Env vars
 - `BOT_TOKEN`: First of all, you need to own a Telegram bot. If you don't, talk to @BotFather on Telegram: it takes 
less than 3 minutes to create one. After creating the bot, you'll be provided with it's token, it looks like
`123456789:ABCDEFGHIJKLMNO-PQRSTUVWXYZ12345678 `. 
You must initiate a conversation with your bot after creating it, find it on Telegram and tap on /start.

 - `CHAT_ID`: You also need your own Telegram chat ID, use any of bots available to get it, for example, talk to @myidbot.

 - `REFERENCE` and optional `ZONE`: Finally, you need the to know the server reference you want to watch, inspect the table element on 
[Kimsufi Servers page](https://www.kimsufi.com/en/servers.xml) with your favorite browser and get the value
of the `data-ref` attribute on the `<td>` element of the server you wish. Optionally, you may also want to 
select a specific zone for it, otherwise it defaults to `westernEurope`.

### Running
Just run
```sh
docker run -t \
    -e BOT_TOKEN=123456789:ABCDEFGHIJKLMNO-PQRSTUVWXYZ12345678 \
    -e CHAT_ID=123456789 \ 
    -e REFERENCE=1801sk14 \
    colega/kimsufi-telegram-watcher
```
I recommend you trying with an available server reference first, in order to make sure that your notification arrives correctly.
Check the stdout if something fails.
