from motor.motor_asyncio import AsyncIOMotorClient

from .constants import MONGODB_URL

client = AsyncIOMotorClient(MONGODB_URL)
db = client["LAB"]