# Machine Learning System Design Document

## Executive Summary
- **Project Name**: Lynx/FinRed
- **Problem Statement**: It is impossible to manually analyze the high volume of financial news quickly and accurately.

- **Business Impact**: 
- Automating news analysis for analysts and investors
    - The system highlights key events in financial news (who did what, with whom/what) and presents them as a connected graph.
    - This allows you to navigate the information flow faster and make investment decisions.

- KPIs (key performance indicators):
    - The quality of text analysis: at least 8 out of 10 automatically found facts must match the expert markup.
    - The speed of analysts' work: the time for processing news should be reduced by an average of 70% compared to manual analysis.


- **Timeline**: 
- Technical report:
    - D1(16.09): One PDF file with status + link to GitHub. In PDF file write the name of the team (with names and surnames of the participants, their innopolis mails), link to the repository, project topic, what has been done so far. Tell about the data and the scripts used. Summarize the intermediate results. Also mention the work distribution.

    - D2(07.10): One PDF file with status + link to GitHub. 
    - D3(28.10): One PDF file with status + link to GitHub. 
    - Final technical report(approx: 02.12)
- Presentation(XX.12): 1 set of slides + 10-15 min. talk, Q/A session, user feedback

# I. Problem Definition

## i. Origin

- **Core Problem**: It is impossible to manually and quickly analyze the constant flow of financial news.  
- **Stakeholders**: Analysts, traders, risk managers, investment funds.  
- **Current Limitations**: Reading and processing takes too much time, with a high risk of missing key events.  
- **Current Workflow**: Manual monitoring of news feeds (Bloomberg, RBC, Interfax).  

---

## ii. Relevance & Reasons

- **Importance**: Reaction speed to news is critical in financial markets.  
- **Benefits**: Reduced human error, automated analysis.  
- **Business Impact**: Direct influence on the speed and quality of investment decisions.  
- **Current Cost**: Lost opportunities and inefficiency due to late reactions.  

---

## iii. Previous Work

- **Tried Solutions**: Manual analysis, simple keyword-based systems.  
- **Worked/Didn’t**: Keywords produce too much noise and fail to capture relationships.  
- **Learnings**: NER (Named Entity Recognition) + Relation Extraction are needed.  
- **Improvements**: ML/NLP enables extraction of triplets (subject, action, object).  

---

## iv. Other Issues & Risks

- **Infrastructure**: GPU/CPU for inference, Neo4j cluster.  
- **Failure Modes**: Incorrect links (false edges in the graph).  
- **Cost of Mistakes**: Analytical errors → potential financial losses.  
- **Checks**: Human verification of critical events.  


# II. Metrics and Losses

## i. Metrics

### Business Metrics
- **Speed of news analysis**: average time saved per analyst compared to manual processing.  
- **Automated insights coverage**: percentage of correct automatically extracted triplets  

### Model Metrics
- **NER (entity extraction)**: Precision, Recall, F1 for predicted entities.  
- **Relation Extraction**: Precision, Recall, F1 for predicted relations.  
- **Triplet-level (end-to-end)**: Precision, Recall, F1 for `(subject, action, object)` matches.  

### Alignment with business goals
- High **Recall** → fewer missed critical events.  
- High **Precision** → less noise and fewer false alerts.  
- Trade-off: in finance, **Recall is more critical**.  

---

## ii. Loss Functions

### NER
- **Cross-Entropy Loss** for token classification.  
- **Optional CRF layer** for sequence consistency.  

### Relation Extraction
- **Multi-class Cross-Entropy Loss** for relation classification.    

### Edge Cases
- Ambiguous phrasing, metaphors, nested entities.


# III. Dataset

## i. Data Sources

- **Internal**: Student-created dataset (CSV/JSON with `title`, `text`, `date`, `source`).  
- **External**: Free APIs / RSS for Russian financial news (NewsData.io, GNews.io, RBC RSS).  
- **Data Quality Issues**: Duplicates, inconsistent entity names, varying styles.  
- **Freshness**: Daily or weekly updates preferred; critical for finance.

## ii. Data Labeling

- **Method**: Manual annotation of entities and relations; optionally pre-labeled using pre-trained models.  
- **Tools**: Label Studio, Brat.  
- **Quality Assurance**: Multiple annotators, conflict resolution, teacher review.  
- **Costs**: Mainly student time; small dataset of ~100–500 articles is sufficient for proof of concept.

## iii. Available Metadata

- Publication date, source, category, URL, author.  
- **Usage**: Filtering, deduplication, weighting reliability of triplets.

## iv. Data Quality Issues

- **Problems**: Missing text, duplicates, noise (ads, images, scripts).  
- **Solution**: Deduplication, regex-based cleaning, removing empty/short texts.

## v. ETL Pipeline

- **Extract**: Python scripts to collect news from APIs/RSS.  
- **Transform**: Clean text, tokenize, lemmatize, format for NER/RE models.  
- **Load**: Save in JSON/CSV for training; load triplets into Neo4j for graph visualization.  
- **Update Frequency**: Daily/weekly for students; streaming possible in production.


# IV. Validation Schema

## i. Requirements

- **Prevent data leakage**: Ensure that no news articles from the test set appear in the training set. This avoids inflated metrics and ensures realistic evaluation.  
- **Temporal constraints**: Test on recent news, train on older news. Financial news is dynamic, so splitting by date reflects real-world conditions.

---

## ii. Inference Process

- **Predict entities and relations → construct triplets**:  
  Input news text → NER extracts entities → RE predicts relationships → form `(subject, action, object)` triplets.  
- **Confidence scores** (optional): Store prediction probabilities to filter low-confidence results or for human-in-the-loop verification.  
- **Prediction horizon**: Model predicts only on current news, without access to future events.

---

## iii. Inner and Outer Loops

- **K-fold or temporal cross-validation**:  
  - K-fold CV: split training data into K parts for validation.  
  - Temporal CV: split chronologically to respect time order.  
- **Handle time-series**: Do not shuffle news randomly; maintain chronological order to prevent future information leakage.

---

## iv. Update Frequency

- **Retraining**: Retrain the model when new annotated data is available or when performance drops.  
- **Data drift monitoring**: Detect changes in entity distributions, new company names, or new financial terms. If drift is significant, update the model to maintain performance.


# V. Baseline Solution

## i. Constant Baseline

**Chosen Strategy: Keyword-based heuristic**

- **Idea**: Use simple keyword rules to extract triplets `(subject, action, object)` from text without machine learning.  
- **How it works**:  
  1. Identify entities in the sentence using basic NER or regex patterns.  
  2. Search for **action keywords** in the text (e.g., "купил", "продал", "повысил", "понизил").  
  3. Assign the nearest entity to the left as **subject** and the nearest entity to the right as **object**.  
- **Advantages**:  
  - Easy to implement.  
  - Provides a minimal working baseline for Russian financial news.  
  - No GPU or model training required.  
- **Evaluation**:  
  - Metrics: Precision, Recall, F1 at the triplet level.  
  - Minimum acceptable result: better than random guessing; at least some correct triplets are extracted.

---

## ii. Model Baselines

- **BiLSTM + CRF** for NER: extract entities with sequence modeling and tagging consistency.  
- **Pre-trained Transformers (RuBERT/FinBERT)** for NER and Relation Extraction: leverage contextual embeddings for better accuracy.  
- **Trade-offs**:  
  - BiLSTM + CRF: simpler, faster, works with smaller data, but lower accuracy on complex sentences.  
  - Transformers: higher accuracy, captures context, but requires more computation and annotated data.  
- **Comparison**: Evaluate all models against the constant baseline using the same metrics (Precision, Recall, F1).

---

## iii. Feature Baselines

- **Initial features**:  
  - Tokens, POS tags, entity types.  
  - Dependency paths and context window around entity pairs for Relation Extraction.  
- **Feature importance**:  
  - Attention weights for transformers.  
  - Permutation importance for classical models.  
- **Feature engineering**:  
  - Lemmatization and normalization of entity mentions (e.g., unify "ЦБ РФ" and "Центробанк России").  
  - Contextual features such as distance between entities and surrounding words to help relation classification.


# VI. Error Analysis

## i. Learning Curve Analysis

- **Purpose**: Visualize how model metrics (Precision, Recall, F1, Loss) change with training set size or epochs.  
- **Analysis**:  
  1. Plot Training vs. Validation Loss curves.  
  2. Plot Precision/Recall/F1 curves for training and validation.  
- **Patterns to look for**:  
  - **Underfitting**: both training and validation metrics are low → model too simple or not enough data.  
  - **Overfitting**: training metrics high, validation metrics low → model too complex, poor generalization.  
- **Handling issues**:  
  - Underfitting → increase data, add layers, more features.  
  - Overfitting → regularization, dropout, reduce model size, data augmentation.

---

## ii. Residual Analysis

- **Purpose**: Examine model errors at the prediction level (where entities or relations are incorrectly extracted).  
- **Analysis**:  
  - Distribution of errors by entity or relation type.  
  - Frequently confused entities (e.g., "ЦБ РФ" vs "Минфин").  
  - Errors more common in long or complex sentences.  
- **Handling outliers**:  
  - Remove or mark noisy data (ads, non-relevant text).  
  - Add more training examples for frequently mispredicted patterns.

---

## iii. Best/Worst Case Analysis

- **Goal**: Identify scenarios where the model performs perfectly vs. fails completely.  
- **Identifying edge cases**:  
  - Triplets with low model confidence.  
  - Long, complex, or ambiguous sentences.  
- **Common failure modes**:  
  - Mismatched entities in context.  
  - Multi-subject/object sentences.  
  - Action verbs not matching the correct relation.  
- **Improving worst cases**:  
  - Add more examples of challenging cases to the training set.  
  - Use contextual models (Transformers) for better understanding.  
  - Post-processing rules to correct obvious errors (e.g., subject and object cannot be identical).


# VII. Training Pipeline

## i. Overview

- **Training architecture**:  
  - NER Model: BiLSTM + CRF or pre-trained Transformer (RuBERT/FinBERT).  
  - Relation Extraction Model: Classifier (BiLSTM / Transformer) for entity pairs.  
  - Triplet Formation: Combine predicted entities and relations into `(subject, action, object)` triplets.  

- **Tools**:  
  - Python, PyTorch or TensorFlow/Keras.  
  - HuggingFace Transformers for pre-trained models.  
  - Pandas / NumPy for data handling.  
  - Neo4j / NetworkX for graph visualization.  

- **Reproducibility**:  
  - Fix random seeds in Python, PyTorch, and NumPy.  
  - Version datasets and models.  
  - Document all hyperparameters.

---

## ii. Data Preprocessing

- **Preprocessing steps**:  
  - Clean text: remove HTML, links, special characters.  
  - Tokenization and lemmatization.  
  - Normalize entity mentions (e.g., "ЦБ РФ" → "Central Bank of Russia").  

- **Feature engineering**:  
  - POS tags, dependency paths, context windows for Relation Extraction.  
  - Encode entities and relations for the classifier.  

- **Normalization**:  
  - Lowercasing (if using uncased models).  
  - Remove extra spaces and special symbols.  

---

## iii. Model Training

- **Training process**:  
  - Split data into train/validation/test with temporal ordering.  
  - Train NER model → extract entities.  
  - Generate all possible entity pairs → train Relation Extraction model.  
  - Post-processing: form triplets for graph visualization.  

- **Hyperparameter tuning**:  
  - Learning rate, batch size, number of epochs.  
  - Grid search or random search for optimization.  
  - For Transformers: number of layers, hidden size, dropout rate.  

- **Hardware requirements**:  
  - BiLSTM + CRF: CPU sufficient for small datasets.  
  - Transformer-based models: GPU recommended 

---

## iv. Experiment Tracking

- **Tracking experiments**:  
  - MLflow or Weights & Biases.  
  - Save all model versions, hyperparameters, and datasets.  

- **Metrics to log**:  
  - Precision, Recall, F1 for NER and Relation Extraction.  
  - Triplet-level metrics (end-to-end).  
  - Training/validation loss per epoch.  

- **Model versioning**:  
  - Each model version linked to a specific training configuration and dataset.  
  - Allows rollback in case of performance degradation.


# VIII. Integration

### i. Fallback Strategies
- Use keyword heuristic if model confidence low or service unavailable.  
- Recover: retry inference, alert students/engineers, queue news for later processing.

### ii. API Design
- `/extract_triplets`: input text → output triplets.  
- `/get_graph`: fetch knowledge graph.  
- Interfaces: REST API JSON; optional WebSocket for streaming.  
- SLAs: response ≤2s, 99% uptime.

### iii. Release Cycle
- Retrain weekly/monthly with new data.  
- Minor updates for bug fixes.  
- Deploy via Docker; staging → production.  
- Rollback via versioned models.

### iv. Operational Concerns
- Monitor API response, model confidence, uptime.  
- Alerts for failures, downtime, data drift.  
- Incident handling: investigate errors, reprocess queued news, document issues.