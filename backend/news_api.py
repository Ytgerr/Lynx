"""
    Module for recent news collection by using News API + Readability + Beautiful Soup 4
    with MongoDB connected. All collected news will be in `articles/` directory
"""

import hashlib
import os
from sys import stdout

import lxml
import requests
from bs4 import BeautifulSoup
from loguru import logger
from newsapi import NewsApiClient
from pymongo import MongoClient
from readability import Document
from requests.exceptions import ConnectionError, ConnectTimeout, ReadTimeout

DEBUG_MODE=1
OVERWRITE_DATABASE=1
CATEGORY="business"

CHOSEN_KEYS = [
    "author",
    "title",
    "description",
    "publishedAt",
    "url",
]    

REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
}

if DEBUG_MODE == 1:
    logger.remove()
    logger.add(stdout, level="TRACE")

def get_content(url):
    """
        Returns the content of page by it's url by using `readability` library
    """
    try:
        response = requests.get(url, timeout=5, headers=REQUEST_HEADERS)
        if response.status_code != 200:
            logger.error(f"Site {url} has bad request")
            return None

    except ConnectionError:
        logger.error(f"Site {url} doesnt responses")
        return None
    except ConnectTimeout:
        logger.error(f"Site {url} doesnt responses")
        return None
    except ReadTimeout:
        logger.error(f"Timeout for {url}")
        return None
        
    logger.trace("Response collected")

    readable = Document(response.text)

    soup = BeautifulSoup(readable.summary(), "lxml")
    siblings = soup.find_all("p")

    # Check for <p> siblings
    logger.trace(f"Found {len(siblings)} siblings <p> of content")
    
    content = ""

    for idx, sibling in enumerate(siblings):
        if sibling.string:
            content += "\n" + sibling.string.strip()

        if idx % 3 == 0:
            logger.trace(f"{idx + 1}/{len(siblings)} collected!")

    return content


def main():
    hasher = hashlib.sha256()
    client = MongoClient()
    db = client["news_db"]
    news_collection = db["raw_news"]

    os.makedirs("articles", exist_ok=True)

    api = NewsApiClient(api_key='9c321eb916414dbcad8165d1fda83f45')

    result = api.get_top_headlines(category=CATEGORY)

    if result["status"] == "ok":
        logger.success(f"{result['totalResults']} results recieved!")

        filtered_articles = []

        for article in result["articles"]:
            encoded_title = (article["title"] + article["publishedAt"]).encode("utf-8")
            hasher.update(encoded_title)
            article_id = hasher.hexdigest()

            if OVERWRITE_DATABASE == 1:
                if news_collection.find_one({"article_id": article_id}) is not None:
                    news_collection.delete_one({"article_id": article_id})
                if os.path.exists(f"articles/{article_id}.txt"):
                    os.remove(f"articles/{article_id}.txt")

            if news_collection.find_one({"article_id": article_id}) is None:
                filtered_articles.append({key: value for key, value in article.items() if key in CHOSEN_KEYS})
                filtered_articles[-1]["article_id"] = article_id
                filtered_articles[-1]["category"] = CATEGORY
                logger.info(article_id)

                if article["content"]:
                    print("=" * 80)
                    for key, value in article.items():
                        print(f"{key}: {value}")

                    print("=-" * 40)

                    content = get_content(article["url"])

                    print("=" * 80)
                    if content is not None and len(content) != 0:
                        with open(f"articles/{article_id}.txt", "w", encoding="utf-8") as f:
                            logger.trace(f"{article_id}.txt created!")
                            f.write(content)
                    else:
                        logger.error("Content is None")
                        del filtered_articles[-1]
                        continue
                else:
                    logger.error("Content is None")
                    del filtered_articles[-1]
                    continue
            else:
                logger.info(f"Article <{article['title']}> already present in database!")
        
        if len(filtered_articles) != 0:
            news_collection.insert_many(filtered_articles)

    else:
        logger.error("News API doens't work!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
        exit(0)