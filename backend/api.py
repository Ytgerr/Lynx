from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient

app = FastAPI()

client = MongoClient()
db = client["news_db"]
news_collection = db["raw_news"]

async def get_all_articles():
    return news_collection.find().to_list()

class Article(BaseModel):
    author: str
    title: str
    description: str
    url: str
    publishedAt: str
    category: str
    content: str

class ArticlesResponse(BaseModel):
    status: Literal["ok"]
    numArticles: int
    articles: list[Article]

@app.get("/articles", response_model=ArticlesResponse)
async def get_articles(
    page: int = 1,
    pageSize: int = 50
):
    try:
        articles = await get_all_articles()
        response_page = articles[pageSize * (page - 1): min(pageSize * (page), len(articles))]
    except IndexError:
        return HTTPException(400, detail="page out of bounds")

    for article in response_page:
        del article["_id"]
        with open(f"articles/{article['article_id']}.txt", "r", encoding="utf-8") as f:
            article["content"] = f.read()

        del article["article_id"]

        print(article)

    return {
        "status": "ok",
        "numArticles": len(response_page),
        "articles": response_page,
    }

if __name__ == "__main__":
    main()

