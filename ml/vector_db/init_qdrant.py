#docker run -p 6333:6333 qdrant/qdrant

from qdrant_client import QdrantClient
from qdrant_client.http import models as rest

client = QdrantClient(host="localhost", port=6333)

client.create_collection(
    collection_name="documents",
    vectors_config=rest.VectorParams(size=384, distance=rest.Distance.COSINE),
)

print("Qdrant collection 'documents' created.")