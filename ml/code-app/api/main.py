from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from typing import List, Dict, Optional
from natasha import (
    Segmenter, NewsEmbedding, NewsNERTagger, 
    NewsMorphTagger, NewsSyntaxParser, Doc
)

app = FastAPI()

model = spacy.load("en_core_web_sm")

segmenter = Segmenter()
emb = NewsEmbedding()
ner_tagger = NewsNERTagger(emb)
morph_tagger = NewsMorphTagger(emb)
syntax_parser = NewsSyntaxParser(emb)

class WorkingRelationExtractor:
    def __init__(self):
        self.segmenter = Segmenter()
        self.emb = NewsEmbedding()
        self.ner_tagger = NewsNERTagger(self.emb)
        self.morph_tagger = NewsMorphTagger(self.emb)
        self.syntax_parser = NewsSyntaxParser(self.emb)
    
    def extract_per_sentence(self, text):
        doc = Doc(text)
        doc.segment(self.segmenter)
        results = []
        for sent in doc.sents:
            sent_doc = Doc(sent.text)
            sent_doc.segment(self.segmenter)
            sent_doc.tag_ner(self.ner_tagger)
            
            entities = list(sent_doc.spans)
            relations = []
            words = sent.text.split()
            
            for i in range(len(entities)):
                for j in range(i + 1, len(entities)):
                    entity1 = entities[i]
                    entity2 = entities[j]
                    
                    start_idx = min(entity1.start, entity2.start)
                    end_idx = max(entity1.stop, entity2.stop)
                    
                    between_words = words[start_idx:end_idx]
                    
                    verbs = self._find_potential_verbs(between_words)
                    
                    for verb in verbs:
                        if entity1.stop < entity2.start:
                            subject, obj = entity1, entity2
                        else:
                            subject, obj = entity2, entity1
                        
                        relations.append({
                            'subject': subject.text,
                            'subject_type': subject.type,
                            'relation': verb,
                            'relation_type': self._classify_relation(verb),
                            'object': obj.text,
                            'object_type': obj.type,
                            'sentence': sent.text
                        })
            
            results.append({
                'sentence': sent.text,
                'entities': [
                    {"text": span.text, "type": span.type, "start": span.start, "stop": span.stop}
                    for span in entities
                ],
                'relations': relations
            })
        
        return results
    
    def _find_potential_verbs(self, words):
        common_verbs = {
            'назначил', 'заявил', 'сообщил', 'сказал', 'отметил',
            'приговорили', 'поедет', 'расформировал', 'умерла',
            'эвакуировали', 'выступили', 'завершила', 'утвердил',
            'создал', 'реорганизовал', 'участвовал', 'принял',
            'ввел', 'санкционировал', 'подписал', 'договорился',
            'обвинил', 'арестовал', 'освободил', 'погиб', 'атаковал',
            'бомбил', 'инвестировал', 'купил', 'продал', 'объявил',
            'финансировал', 'экспортировал', 'импортировал', 'нарастил',
            'снизил', 'увеличил', 'заявил_о', 'признал', 'отказался',
            'поддержал', 'критиковал', 'встретился', 'переговорил',
            'заключил', 'разорвал', 'нарушил', 'выполнил', 'планирует',
            'ожидает', 'предупредил', 'угрожал', 'осудил', 'одобрил',
            'отклонил', 'инициировал', 'завершил', 'продлил', 'отменил',
            'разработал', 'представил', 'опубликовал', 'скрыл',
            'раскрыл', 'похитил', 'уничтожил', 'построил', 'разрушил',
            'эвакуировал', 'мобилизовал', 'демобилизовал', 'напал',
            'защитил', 'захватил', 'освободил', 'присоединил',
            'отделил', 'аннексировал', 'признал_независимость',
            'отверг', 'подтвердил', 'опроверг', 'расследовал',
            'завел_дело', 'закрыл_дело', 'приговорил', 'оправдал',
            'амнистировал', 'помиловал', 'экстрадировал', 'депортировал',
            'иммигрировал', 'эмигрировал', 'натурализовал', 'лишил_гражданства',
            'национализировал', 'приватизировал', 'конфисковал',
            'компенсировал', 'субсидировал', 'дотировал', 'обложил_налогом',
            'снизил_налоги', 'повысил_налоги', 'инфляция', 'дефляция',
            'рецессия', 'рост_ВВП', 'падение_ВВП', 'дефолт', 'реструктуризация',
            'кредитовал', 'займовал', 'погасил_долг', 'рефинансировал',
            'спекулировал', 'манипулировал_рынком', 'монополизировал',
            'демонополизировал', 'регулировал', 'дерегулировал',
            'либерализовал', 'протекционировал', 'эмбарго', 'тарифы',
            'квоты', 'лицензировал', 'сертифицировал', 'стандартизировал',
            'инновация', 'патентовал', 'лицензировал_технологию',
            'экспортировал_технологию', 'импортировал_технологию',
            'санкционировал_технологию', 'запретил', 'разрешил',
            'легализовал', 'криминализовал', 'декриминализовал',
            'реформировал', 'модернизировал', 'оптимизировал',
            'централизовал', 'децентрализовал', 'федерализовал',
            'унитаризировал', 'секуляризовал', 'исламизировал',
            'христианизировал', 'секуляризировал', 'милитаризовал',
            'демилитаризовал', 'демократизировал','прилетел', 'авторитаризировал',
            'национализировал', 'денатурализовал', 'колонизировал',
            'деколонизировал', 'интегрировал', 'сегрегировал',
            'дискриминировал', 'эмансипировал', 'экспроприировал',
            'компенсировал', 'репатриировал', 'эвакуировал', 'выкупил'
        }
        
        found_verbs = []
        for word in words:
            if word.lower() in common_verbs:
                found_verbs.append(word)
        
        return found_verbs
    
    def _classify_relation(self, verb):
        verb_lower = verb.lower()
    
        if any(word in verb_lower for word in ['назначил', 'утвердил', 'избрал', 'сменил', 'уволил', 'реорганизовал', 'расформировал', 'создал', 'закрыл', 'реформировал']):
            return 'POLITICAL_APPOINTMENT'
        elif any(word in verb_lower for word in ['заявил', 'сообщил', 'сказал', 'отметил', 'объявил', 'предупредил', 'угрожал', 'осудил', 'одобрил', 'отклонил', 'опроверг', 'подтвердил']):
            return 'POLITICAL_STATEMENT'
        elif any(word in verb_lower for word in ['приговорили', 'осудил', 'арестовал', 'освободил', 'оправдал', 'амнистировал', 'помиловал', 'экстрадировал', 'депортировал', 'расследовал', 'завел_дело', 'закрыл_дело']):
            return 'LEGAL_ACTION'
        elif any(word in verb_lower for word in ['атаковал', 'бомбил', 'напал', 'защитил', 'захватил', 'освободил', 'милитаризовал', 'демилитаризовал', 'мобилизовал', 'демобилизовал']):
            return 'MILITARY_ACTION'
        elif any(word in verb_lower for word in ['выкупил','инвестировал', 'купил', 'продал', 'финансировал', 'экспортировал', 'импортировал', 'нарастил', 'снизил', 'увеличил', 'субсидировал', 'дотировал', 'обложил_налогом', 'снизил_налоги', 'повысил_налоги', 'кредитовал', 'займовал', 'погасил_долг', 'рефинансировал', 'спекулировал', 'манипулировал_рынком', 'монополизировал', 'демонополизировал', 'регулировал', 'дерегулировал', 'либерализовал', 'протекционировал', 'эмбарго', 'тарифы', 'квоты', 'лицензировал', 'сертифицировал', 'стандартизировал', 'национализировал', 'приватизировал', 'конфисковал', 'компенсировал', 'экспроприировал']):
            return 'FINANCIAL_TRANSACTION'
        elif any(word in verb_lower for word in ['подписал', 'договорился', 'встретился', 'переговорил', 'заключил', 'разорвал', 'нарушил', 'выполнил', 'планирует', 'ожидает']):
            return 'AGREEMENT_MEETING'
        elif any(word in verb_lower for word in ['умерла', 'скончался', 'погиб']):
            return 'DEATH_EVENT'
        elif any(word in verb_lower for word in ['расформировал', 'создал', 'реорганизовал', 'модернизировал', 'оптимизировал', 'централизовал', 'децентрализовал']):
            return 'ORGANIZATIONAL_CHANGE'
        elif any(word in verb_lower for word in ['прилетел', 'поедет', 'отправился', 'прибыл', 'эвакуировали', 'иммигрировал', 'эмигрировал', 'натурализовал', 'лишил_гражданства', 'репатриировал', 'эвакуировал']):
            return 'MIGRATION_MOVEMENT'
        elif any(word in verb_lower for word in ['разработал', 'представил', 'опубликовал', 'скрыл', 'раскрыл', 'патентовал', 'лицензировал_технологию', 'экспортировал_технологию', 'импортировал_технологию', 'санкционировал_технологию']):
            return 'INNOVATION_TECH'
        elif any(word in verb_lower for word in ['федерализовал', 'унитаризировал', 'секуляризовал', 'исламизировал', 'христианизировал', 'секуляризировал', 'демократизировал', 'авторитаризировал', 'колонизировал', 'деколонизировал', 'интегрировал', 'сегрегировал', 'дискриминировал', 'эмансипировал']):
            return 'POLITICAL_SOCIAL_CHANGE'
        else:
            return 'GENERAL_ACTION'


class TextInput(BaseModel):
    text: str

@app.post("/entity-recognition_eng")
async def ner_eng(input_data: TextInput):
    doc = model(input_data.text)
    triplets = [{"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char} for ent in doc.ents]
    return {"triplets": triplets}

@app.post("/entity-recognition_ru")
async def ner_ru(input_data: TextInput):
    """
    Извлечение именованных сущностей и отношений между ними из русского текста используя Наташу для NER и rule-based RE
    
    Принимает:
    input_data : TextInput
        Объект с полем 'text', содержащий текст для анализа на русском языке.
        
    Возвращает:
    JSON-объект со следующими полями:
        results : List[Dict]
            Список результатов анализа по каждому предложению текста. Каждый элемент содержит:
            - sentence (str): исходное предложение
            - entities (List[Dict]): список извлеченных сущностей с атрибутами:
                * text (str): текст сущности
                * type (str): тип сущности (PER, LOC, ORG и т.д.)
                * start (int): начальная позиция в предложении
                * stop (int): конечная позиция в предложении
            - relations (List[Dict]): список отношений между сущностями:
                * subject (str): субъект отношения
                * subject_type (str): тип субъекта
                * relation (str): глагол/действие, описывающее отношение
                * relation_type (str): классифицированный тип отношения
                * object (str): объект отношения
                * object_type (str): тип объекта
                * sentence (str): предложение, в котором найдено отношение
    
    Примеры использования:
    ----------------------
    Запрос:
    {
        "text": "Президент России Владимир Путин подписал указ о новых санкциях."
    }
    
    Ответ:
    {
        "results": [
            {
                "sentence": "Президент России Владимир Путин подписал указ о новых санкциях.",
                "entities": [
                    {"text": "России", "type": "LOC", "start": 1, "stop": 2},
                    {"text": "Владимир Путин", "type": "PER", "start": 2, "stop": 4}
                ],
                "relations": [
                    {
                        "subject": "Владимир Путин",
                        "subject_type": "PER",
                        "relation": "подписал",
                        "relation_type": "POLITICAL_APPOINTMENT",
                        "object": "России", 
                        "object_type": "LOC",
                        "sentence": "Президент России Владимир Путин подписал указ о новых санкциях."
                    }
                ]
            }
        ]
    }
    """
    extractor = WorkingRelationExtractor()
    results = extractor.extract_per_sentence(input_data.text)
    
    return {"results": results}