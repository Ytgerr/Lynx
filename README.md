# Lynx 🐱‍💻
> **Automated Financial News Analysis & Knowledge Graph System**

**Lynx** (formerly FinRed) is an advanced machine learning platform designed to revolutionize how financial analysts process information. By automating the analysis of high-volume financial news, Lynx extracts key entities and relationships to build a dynamic knowledge graph, enabling faster and more accurate investment decisions.

---

## 🚀 Key Features

*   **📰 Automated News Ingestion**: Seamlessly collects and processes financial news from multiple sources.
*   **🧠 Advanced NLP Pipeline**: Utilizes state-of-the-art Named Entity Recognition (NER) and Relation Extraction (RE) models to identify companies, people, and their interactions.
*   **🕸️ Interactive Knowledge Graph**: Visualizes complex relationships in a navigable graph format, highlighting "who did what with whom."
*   **⚡ Real-Time Insights**: Reduces manual analysis time by up to 70%, allowing analysts to focus on strategy rather than reading.

## 🛠️ Built With

### Frontend
*   **React** & **Vite**: Fast, modern UI development.
*   **TailwindCSS**: sleek, responsive styling.
*   **React Force Graph**: Powerful 2D/3D graph visualization.

### Backend
*   **FastAPI**: High-performance API framework.
*   **MongoDB**: Flexible document storage for news and metadata.
*   **Python**: The core logic and orchestration.

### Machine Learning
*   **PyTorch**: Deep learning frameworks.
*   **HuggingFace Transformers**: Pre-trained models (BERT, RoBERTa) for superior text understanding.

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   **Python 3.10+**
*   **Node.js 18+**
*   **Docker** (for running the database)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Ytgerr/Lynx.git
    cd Lynx
    ```

2.  **Run with Docker**
    Start the entire system (Database, Backend, Frontend, ML) with a single command:
    ```bash
    docker-compose up --build
    ```

3.  **Access the App**
    Open your browser and navigate to `http://localhost:5173`.
    - API Documentation: `http://localhost:8000/docs`
    - ML Service: `http://localhost:8001`

---

## 📖 Usage

1.  **Dashboard**: View the latest processed news articles.
2.  **Graph View**: Explore the knowledge graph to see connections between entities.
3.  **Search**: Filter news and graph nodes by company name or keyword.

---

## 🗺️ Roadmap

- [ ] Integration with more news APIs (Bloomberg, Reuters).
- [ ] Temporal graph analysis (how relations change over time).
- [ ] User feedback loop for model fine-tuning.
- [ ] Deployment to cloud infrastructure.

---

## 👥 Team

*   **Andrei Zhdanov** - *ML Engineer / Lead*
*   **Mikhail Sofin** - *Frontend Developer*
*   

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.