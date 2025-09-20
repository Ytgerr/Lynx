import hashlib

from loguru import logger
from newsapi import NewsApiClient
from pymongo import MongoClient

CHOSEN_KEYS = [
    "author",
    "title",
    "description",
    "publishedAt",
    "url",
]

hasher = hashlib.sha256()
client = MongoClient()
db = client["news_db"]
news_collection = db["raw_news"]

api = NewsApiClient(api_key='9c321eb916414dbcad8165d1fda83f45')

result = api.get_top_headlines(category="business")

if result["status"] == "ok":
    logger.success(f"{result['totalResults']} results recieved!")

    filtered_articles = []

    for article in result["articles"]:
        encoded_title = (article["title"] + article["publishedAt"]).encode("utf-8")
        hasher.update(encoded_title)
        article_id = hasher.hexdigest()

        if news_collection.find_one({"article_id": article_id}) is None:
            filtered_articles.append({key: value for key, value in article.items() if key in CHOSEN_KEYS})
            filtered_articles[-1]["article_id"] = article_id
        else:
            logger.warning(f"Article {article['title']} already present in database!")

    # for key, value in filtered_articles[0].items():
    #     print(f"{key}: {value}")
    if len(filtered_articles) != 0:
        news_collection.insert_many(filtered_articles)

else:
    logger.error("News API doens't work!")