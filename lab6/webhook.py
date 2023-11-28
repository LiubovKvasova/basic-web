import os
import logging
import aiohttp

from aiogram import Bot, types
from aiogram.contrib.middlewares.logging import LoggingMiddleware
from aiogram.dispatcher import Dispatcher
from aiogram.dispatcher.webhook import SendMessage
from aiogram.utils.executor import start_webhook


API_TOKEN = os.environ['API_TOKEN']

# webhook settings
WEBHOOK_HOST = 'https://rekechynska-bot.alwaysdata.net/'
WEBHOOK_PATH = '/bot/'
WEBHOOK_URL = f"{WEBHOOK_HOST}{WEBHOOK_PATH}"

# webserver settings
WEBAPP_HOST = '::'  # or ip
WEBAPP_PORT = 8350

logging.basicConfig(level=logging.INFO)

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)
dp.middleware.setup(LoggingMiddleware())

# Define your commands
commands = [
    types.BotCommand(command="/start", description="Start the bot"),
    types.BotCommand(command="/help", description="Get help"),
    types.BotCommand(command="/info", description="Get information"),
    types.BotCommand(command="/joke", description="Get a joke"),
]

@dp.message_handler(commands=["start"])
async def cmd_start(message: types.Message):
    await bot.set_my_commands(commands)
    await message.answer("Вітаю у нашому боті!")

@dp.message_handler(commands=["info"])
async def cmd_info(message: types.Message):
    await bot.set_my_commands(commands)
    await message.answer("Цей бот для того, щоб покращити ваш настрій!)")

@dp.message_handler(commands=["help"])
async def cmd_info(message: types.Message):
    await bot.set_my_commands(commands)
    await message.answer("Для отримання анекдоту застосуйте команду /joke)")

# Handle the /joke command
@dp.message_handler(commands=['joke'])
async def send_joke(message: types.Message):
    # Make an asynchronous GET request to the JokeAPI
    async with aiohttp.ClientSession() as session:
        async with session.get("https://v2.jokeapi.dev/joke/Any") as response:
            # Check if the request was successful (status code 200)
            if response.status == 200:
                # Get the JSON data from the response
                data = await response.json()

                # Extract the joke from the data
                joke = data['joke']

                # Send the joke as a message
                await message.reply(joke)
            else:
                # Send an error message if the request was not successful
                await message.reply("Error: Failed to retrieve joke from JokeAPI")


@dp.message_handler()
async def echo(message: types.Message):
    # Regular request
    # await bot.send_message(message.chat.id, message.text)

    # or reply INTO webhook
    return SendMessage(message.chat.id, message.text)


async def on_startup(dp):
    await bot.set_webhook(WEBHOOK_URL)
    # insert code here to run it after start


async def on_shutdown(dp):
    logging.warning('Shutting down..')

    # insert code here to run it before shutdown

    # Remove webhook (not acceptable in some cases)
    await bot.delete_webhook()

    # Close DB connection (if used)
    await dp.storage.close()
    await dp.storage.wait_closed()

    logging.warning('Bye!')


if __name__ == '__main__':
    start_webhook(
        dispatcher=dp,
        webhook_path=WEBHOOK_PATH,
        on_startup=on_startup,
        on_shutdown=on_shutdown,
        skip_updates=True,
        host=WEBAPP_HOST,
        port=WEBAPP_PORT,
    )