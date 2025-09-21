import os
import shutil

from loguru import logger
from pymongo import MongoClient


def main():
    
    client = MongoClient()
    db = client["news_db"]
    news_collection = db["raw_news"]

    result = news_collection.delete_many({})
    if os.path.exists("articles"):
        shutil.rmtree("articles")

    logger.info(f"Removed {result.deleted_count} recordings")

if __name__ == "__main__":
    main()