-- Curatify Oracle 19c 시드 데이터 스크립트

-- 사용자 예시 데이터
INSERT INTO USERS (EMAIL, PASSWORD, NAME, IS_VERIFIED) VALUES
('tester@test.com', '$2b$12$ixsz8fg5jJAjgfTfpCEuf.CI1bVbWfuelhFOuMrAiwGs29sq8v10W', '테스트 사용자', 1);

-- RSS URL 예시 데이터
INSERT INTO RSS_URLS (TYPE, URL, USER_ID) VALUES ('normal', 'https://feeds.feedburner.com/TechCrunch', 1);
INSERT INTO RSS_URLS (TYPE, URL, USER_ID) VALUES ('normal', 'https://rss.cnn.com/rss/edition.rss', 1);
INSERT INTO RSS_URLS (TYPE, URL, USER_ID) VALUES ('youtube', 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw', 1);
INSERT INTO RSS_URLS (TYPE, URL, USER_ID) VALUES ('normal', 'https://feeds.arstechnica.com/arstechnica/index', 1);
INSERT INTO RSS_URLS (TYPE, URL, USER_ID) VALUES ('youtube', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsT0YIqwnpJCM-mx7-gSA4Q', 1);

-- Paper Categories 예시 데이터
INSERT INTO CS_PAPER_CATEGORIES (NAME) VALUES ('cs.CL');
INSERT INTO CS_PAPER_CATEGORIES (NAME) VALUES ('cs.AI');
INSERT INTO CS_PAPER_CATEGORIES (NAME) VALUES ('cs.CV');
INSERT INTO CS_PAPER_CATEGORIES (NAME) VALUES ('cs.LG');

-- Papers 예시 데이터 (Oracle에서는 각각 삽입)
INSERT INTO PAPERS (TITLE, AUTHORS, UPDATE_DATE, URL, ABSTRACT, SUMMARY) VALUES (
'Attention Is All You Need', 
'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin', 
TO_TIMESTAMP('2017-06-12 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
'https://arxiv.org/abs/1706.03762', 
'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.', 
'Transformer 아키텍처를 제안한 논문으로, RNN과 CNN 없이 attention 메커니즘만으로 구성된 모델입니다.'
);

INSERT INTO PAPERS (TITLE, AUTHORS, UPDATE_DATE, URL, ABSTRACT, SUMMARY) VALUES (
'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 
'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova', 
TO_TIMESTAMP('2018-10-11 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
'https://arxiv.org/abs/1810.04805', 
'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.', 
'양방향 Transformer를 사용한 언어 이해 모델 BERT를 제안한 논문입니다.'
);

INSERT INTO PAPERS (TITLE, AUTHORS, UPDATE_DATE, URL, ABSTRACT, SUMMARY) VALUES (
'ResNet: Deep Residual Learning for Image Recognition', 
'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun', 
TO_TIMESTAMP('2015-12-10 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
'https://arxiv.org/abs/1512.03385', 
'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.', 
'깊은 신경망의 학습을 위한 residual learning 프레임워크를 제안한 논문입니다.'
);

INSERT INTO PAPERS (TITLE, AUTHORS, UPDATE_DATE, URL, ABSTRACT, SUMMARY) VALUES (
'Generative Adversarial Networks', 
'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio', 
TO_TIMESTAMP('2014-06-10 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
'https://arxiv.org/abs/1406.2661', 
'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.', 
'생성 모델과 판별 모델을 동시에 학습하는 GAN 프레임워크를 제안한 논문입니다.'
);

INSERT INTO PAPERS (TITLE, AUTHORS, UPDATE_DATE, URL, ABSTRACT, SUMMARY) VALUES (
'YOLO: Real-Time Object Detection', 
'Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi', 
TO_TIMESTAMP('2015-06-08 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
'https://arxiv.org/abs/1506.02640', 
'We present YOLO, a new approach to object detection. Prior work on object detection repurposes classifiers to perform detection. Instead, we frame object detection as a regression problem to spatially separated bounding boxes and associated class probabilities.', 
'실시간 객체 탐지를 위한 YOLO 모델을 제안한 논문입니다.'
);

-- Paper-Category 관계 데이터
INSERT INTO CS_PAPER_CATEGORY_RELATIONS (PAPER_ID, CATEGORY_ID) VALUES (1, 1); -- Attention Is All You Need - cs.CL
INSERT INTO CS_PAPER_CATEGORY_RELATIONS (PAPER_ID, CATEGORY_ID) VALUES (1, 2); -- Attention Is All You Need - cs.AI
INSERT INTO CS_PAPER_CATEGORY_RELATIONS (PAPER_ID, CATEGORY_ID) VALUES (2, 1); -- BERT - cs.CL
INSERT INTO CS_PAPER_CATEGORY_RELATIONS (PAPER_ID, CATEGORY_ID) VALUES (3, 3); -- ResNet - cs.CV
INSERT INTO CS_PAPER_CATEGORY_RELATIONS (PAPER_ID, CATEGORY_ID) VALUES (4, 4); -- GAN - cs.LG
INSERT INTO CS_PAPER_CATEGORY_RELATIONS (PAPER_ID, CATEGORY_ID) VALUES (4, 2); -- GAN - cs.AI
INSERT INTO CS_PAPER_CATEGORY_RELATIONS (PAPER_ID, CATEGORY_ID) VALUES (5, 3); -- YOLO - cs.CV

-- Paper Content 예시 데이터 (Oracle에서는 order 대신 order_num 사용)
-- Attention Is All You Need (Transformer)
INSERT INTO PAPER_CONTENT (CONTENT_TITLE, CONTENT, ORDER_NUM, PAPER_ID) VALUES
('Abstract', '# Abstract\n\n지배적인 시퀀스 변환 모델들은 인코더와 디코더를 포함하는 복잡한 순환 신경망이나 컨볼루션 신경망을 기반으로 합니다. 최고 성능을 보이는 모델들은 또한 어텐션 메커니즘을 통해 인코더와 디코더를 연결합니다. 우리는 순환과 컨볼루션을 완전히 배제하고 오직 어텐션 메커니즘만을 기반으로 하는 새로운 간단한 네트워크 아키텍처인 **Transformer**를 제안합니다.\n\n두 개의 기계 번역 작업에서의 실험은 이러한 모델들이 품질 면에서 우수하면서도 더 병렬화 가능하고 훈련 시간이 훨씬 적게 걸린다는 것을 보여줍니다. 우리의 모델은 WMT 2014 영어-독일어 번역 작업에서 28.4 BLEU를 달성하여, 앙상블을 포함한 기존 최고 결과보다 2 BLEU 이상 향상되었습니다. WMT 2014 영어-프랑스어 번역 작업에서는 8개 GPU에서 3.5일간 훈련한 후 41.8의 새로운 단일 모델 최고 BLEU 점수를 달성했으며, 이는 문헌의 최고 모델들의 훈련 비용의 일부에 불과합니다.\n\n우리는 Transformer가 대량의 훈련 데이터로 영어 구문 분석에 성공적으로 적용함으로써 다른 작업에도 잘 일반화된다는 것을 보여줍니다.', 1, 1),
('Introduction', '# Introduction\n\n## 기존 접근 방식의 한계\n\n순환 신경망, 특히 **LSTM(Long Short-Term Memory)**과 **GRU(Gated Recurrent Neural Networks)**는 언어 모델링과 기계 번역과 같은 시퀀스 모델링 및 변환 문제에서 최첨단 접근 방식으로 확고히 자리잡았습니다. 그 이후로 순환 언어 모델과 인코더-디코더 아키텍처의 경계를 넓히기 위한 수많은 노력이 계속되었습니다.\n\n## 순차적 처리의 문제점\n\n순환 모델들은 일반적으로 입력 및 출력 시퀀스의 심볼 위치를 따라 계산을 분해합니다. 위치를 계산 시간의 단계에 맞추면, 이전 숨겨진 상태 h<sub>t-1</sub>과 위치 t의 입력의 함수로서 숨겨진 상태 h<sub>t</sub>의 시퀀스를 생성합니다. 이러한 본질적으로 순차적인 특성은 훈련 예제 내에서 병렬화를 방해하며, 이는 더 긴 시퀀스 길이에서 메모리 제약이 예제 간 배치를 제한하기 때문에 중요해집니다.\n\n최근 연구들은 조건부 계산을 통해 계산 효율성에서 상당한 개선을 달성했으며, 일부 경우에는 모델 성능도 향상시켰습니다. 그러나 근본적인 계산 제약은 여전히 남아있습니다.', 2, 1),
('Model Architecture', '# Model Architecture\n\n## 인코더-디코더 구조\n\n대부분의 경쟁력 있는 신경 시퀀스 변환 모델들은 인코더-디코더 구조를 가지고 있습니다. 여기서 인코더는 심볼 표현의 입력 시퀀스 (x<sub>1</sub>, ..., x<sub>n</sub>)을 연속 표현의 시퀀스 z = (z<sub>1</sub>, ..., z<sub>n</sub>)에 매핑합니다. z가 주어지면, 디코더는 한 번에 하나의 요소씩 심볼의 출력 시퀀스 (y<sub>1</sub>, ..., y<sub>m</sub>)을 생성합니다. 각 단계에서 모델은 자동 회귀적이며, 다음을 생성할 때 이전에 생성된 심볼들을 추가 입력으로 소비합니다.\n\n## Transformer의 핵심 구성 요소\n\n**Transformer**는 인코더와 디코더 모두에 대해 스택된 자기 어텐션과 포인트별 완전 연결 계층을 사용하여 이 전체 아키텍처를 따릅니다.\n\n<img src="https://miro.medium.com/max/1400/1*BHzGVskWGS_3jEcYYi6miQ.png" alt="Transformer Architecture" style="max-width: 100%; height: auto; margin: 20px 0;" />', 3, 1),
('Experiments', '# Experiments\n\n## 데이터셋 및 전처리\n\n우리는 약 450만 개의 문장 쌍으로 구성된 표준 WMT 2014 영어-독일어 데이터셋에서 모델을 훈련했습니다. 문장들은 약 37,000개의 토큰의 공유 소스-타겟 어휘를 가진 바이트 쌍 인코딩을 사용하여 인코딩되었습니다. 영어-프랑스어의 경우, 36M 문장으로 구성된 훨씬 큰 WMT 2014 영어-프랑스어 데이터셋을 사용했으며, 토큰을 32,000개의 워드피스 어휘로 분할했습니다.\n\n## 훈련 설정\n\n문장 쌍들은 대략적인 시퀀스 길이에 따라 함께 배치되었습니다. 각 훈련 배치는 약 25,000개의 소스 토큰과 25,000개의 타겟 토큰을 포함하는 문장 쌍 세트를 포함했습니다.\n\n**주요 실험 설정:**\n- **데이터셋**: WMT 2014 English-German (4.5M pairs)\n- **인코딩**: Byte-pair encoding (37K shared vocabulary)\n- **배치 크기**: ~25K source tokens + ~25K target tokens', 4, 1),
('Results', '# Results\n\n## 번역 성능\n\nWMT 2014 영어-독일어 번역 작업에서, 큰 Transformer 모델(표 2의 Transformer (big))은 앙상블을 포함한 이전에 보고된 최고 모델들보다 2.0 BLEU 이상 우수한 성능을 보이며, 28.4의 새로운 최고 BLEU 점수를 달성했습니다. 이 모델의 구성은 표 3의 하단에 나열되어 있습니다. 훈련은 8개의 P100 GPU에서 3.5일이 걸렸습니다.\n\n## 효율성 비교\n\n우리의 기본 모델조차도 모든 이전에 발표된 모델들과 앙상블을 능가하며, 경쟁 모델들의 훈련 비용의 일부에 불과합니다.\n\n**주요 성과:**\n- **BLEU Score**: 28.4 (English-German)\n- **Training Time**: 3.5 days on 8 P100 GPUs\n- **Cost Efficiency**: Fraction of competitive models', 5, 1),

-- BERT: Pre-training of Deep Bidirectional Transformers
('Abstract', '# Abstract\n\n우리는 **BERT(Bidirectional Encoder Representations from Transformers)**라는 새로운 언어 표현 모델을 소개합니다. 최근의 언어 표현 모델들과 달리, BERT는 모든 계층에서 좌우 컨텍스트를 공동으로 조건화하여 라벨이 없는 텍스트에서 깊은 양방향 표현을 사전 훈련하도록 설계되었습니다.\n\n결과적으로, 사전 훈련된 BERT 모델은 단 하나의 추가 출력 계층으로 미세 조정하여 질문 답변 및 언어 추론과 같은 광범위한 작업에 대해 실질적인 작업별 아키텍처 수정 없이 최첨단 모델을 생성할 수 있습니다. BERT는 개념적으로 간단하면서도 경험적으로 강력합니다.\n\n11개의 자연어 처리 작업에서 새로운 최첨단 결과를 얻었으며, GLUE 점수를 80.5%(7.7% 절대 개선), MultiNLI 정확도를 86.7%(4.6% 절대 개선), SQuAD v1.1 질문 답변 테스트 F1을 93.2(1.5점 절대 개선), SQuAD v2.0 테스트 F1을 83.1(5.1점 절대 개선)로 향상시켰습니다.', 1, 2),
('Introduction', '# Introduction\n\n## 언어 모델 사전 훈련의 중요성\n\n언어 모델 사전 훈련은 많은 자연어 처리 작업을 개선하는 데 효과적인 것으로 입증되었습니다. 여기에는 문장을 전체적으로 분석하여 문장 간의 관계를 예측하는 것을 목표로 하는 자연어 추론 및 패러프레이징과 같은 문장 수준 작업과, 모델이 토큰 수준에서 세밀한 출력을 생성해야 하는 명명된 엔티티 인식 및 질문 답변과 같은 토큰 수준 작업이 포함됩니다.\n\n## 기존 접근 방식의 한계\n\n사전 훈련된 언어 표현을 다운스트림 작업에 적용하는 두 가지 기존 전략이 있습니다: **특징 기반(feature-based)**과 **미세 조정(fine-tuning)**입니다. ELMo와 같은 특징 기반 접근 방식은 사전 훈련된 표현을 추가 특징으로 포함하는 작업별 아키텍처를 사용합니다. OpenAI GPT와 같은 미세 조정 접근 방식은 최소한의 작업별 매개변수를 도입하고 모든 사전 훈련된 매개변수를 단순히 미세 조정하여 다운스트림 작업에서 훈련됩니다.', 2, 2),
('BERT', '# BERT\n\n## 프레임워크 개요\n\n이 섹션에서 BERT와 그 상세한 구현을 소개합니다. 우리의 프레임워크에는 두 단계가 있습니다: **사전 훈련(pre-training)**과 **미세 조정(fine-tuning)**입니다.\n\n## 사전 훈련과 미세 조정\n\n사전 훈련 중에는 모델이 다양한 사전 훈련 작업에 대해 라벨이 없는 데이터로 훈련됩니다. 미세 조정을 위해 BERT 모델은 먼저 사전 훈련된 매개변수로 초기화되고, 모든 매개변수는 다운스트림 작업의 라벨이 있는 데이터를 사용하여 미세 조정됩니다. 각 다운스트림 작업은 동일한 사전 훈련된 매개변수로 초기화되더라도 별도의 미세 조정된 모델을 가집니다.\n\n<img src="https://miro.medium.com/max/1400/1*S3Yl1ti6j1kmyXG2D8S3FQ.png" alt="BERT Architecture" style="max-width: 100%; height: auto; margin: 20px 0;" />\n\n이 섹션에서는 질문 답변 예제를 실행 예제로 사용할 것입니다.', 3, 2),
('Experiments', '# Experiments\n\n## 다운스트림 작업 성능\n\n우리는 11개의 NLP 작업에 대한 BERT 미세 조정 결과를 제시합니다. 우리의 일반적인 작업 불가지론적 모델은 작업별 아키텍처보다 큰 차이로 우수한 성능을 보입니다. 최고 성능 시스템은 연구된 11개 작업 중 9개에서 새로운 최첨단 결과를 얻었습니다.\n\n## 성능 비교\n\n특정 경우에는 우리의 작업별 미세 조정 접근 방식이 특징 기반 접근 방식보다 4.5% 절대 개선을 얻었습니다. 110M 매개변수 모델에도 불구하고, BERT Large는 기존 문헌과 비교하여 가장 큰 모델은 아닙니다. 그러나 이는 라벨이 없는 텍스트의 대규모 코퍼스에서 사전 훈련하여 깊은 양방향 표현을 생성하는 데 사용된 가장 큰 모델입니다.\n\n**주요 실험 결과:**\n- **GLUE Score**: 80.5% (7.7% 절대 개선)\n- **MultiNLI Accuracy**: 86.7% (4.6% 절대 개선)\n- **SQuAD v1.1 F1**: 93.2 (1.5점 절대 개선)', 4, 2),
('Ablation Studies', '# Ablation Studies\n\n## 연구 목적\n\n우리는 상대적 중요성을 더 잘 이해하기 위해 BERT의 여러 측면에 대해 **어블레이션 연구(ablation studies)**를 수행합니다. 추가 어블레이션 연구는 부록 C에서 찾을 수 있습니다.\n\n## 실험 설정\n\n우리는 비교를 위해 OpenAI GPT와 동일한 크기인 **BERT<sub>BASE</sub>**에 집중합니다. 효과는 MNLI의 검증 세트에서 입증됩니다. 우리는 이전 실험과 동일한 미세 조정 절차와 하이퍼파라미터를 사용합니다.\n\n**어블레이션 연구 결과:**\n- **No NSP**: -2.5% 성능 저하\n- **No MLM**: -3.3% 성능 저하\n- **LTR + No NSP**: -5.5% 성능 저하', 5, 2),

-- ResNet: Deep Residual Learning for Image Recognition
('Abstract', '# Abstract\n\n더 깊은 신경망은 훈련하기가 더 어렵습니다. 우리는 이전에 사용된 것보다 훨씬 더 깊은 네트워크의 훈련을 용이하게 하기 위한 **잔차 학습(residual learning)** 프레임워크를 제시합니다. 우리는 계층 입력을 참조하여 계층을 잔차 함수를 학습하도록 명시적으로 재구성하며, 참조되지 않은 함수를 학습하는 대신 사용합니다.\n\n우리는 이러한 잔차 네트워크가 최적화하기 쉽고 상당히 증가된 깊이에서 정확도를 얻을 수 있다는 것을 보여주는 포괄적인 경험적 증거를 제공합니다. ImageNet 데이터셋에서 우리는 최대 152개 계층의 깊이를 가진 잔차 네트워크를 평가했으며, 이는 VGG 네트워크보다 8배 더 깊지만 여전히 더 낮은 복잡성을 가집니다.\n\n이러한 잔차 네트워크의 앙상블은 ImageNet 테스트 세트에서 3.57% 오류를 달성했습니다. 이 결과는 ILSVRC 2015 분류 작업에서 1위를 차지했습니다. 우리는 또한 100개와 1000개 계층으로 CIFAR-10에 대한 분석을 제시합니다.', 1, 3),
('Introduction', '# Introduction\n\n## 깊은 신경망의 발전\n\n깊은 컨볼루션 신경망은 이미지 분류에서 일련의 돌파구를 이끌어왔습니다. 깊은 네트워크는 자연스럽게 낮은/중간/높은 수준의 특징과 분류기를 엔드투엔드 다층 방식으로 통합하며, 특징의 "수준"은 쌓인 계층의 수(깊이)에 의해 풍부해질 수 있습니다.\n\n## 깊이의 중요성\n\n최근 증거는 네트워크 깊이가 매우 중요하다는 것을 보여주며, 도전적인 ImageNet 데이터셋의 선도적인 결과들은 모두 16개에서 30개의 깊이를 가진 "매우 깊은" 모델을 활용합니다. 많은 다른 중요한 시각 인식 작업들도 매우 깊은 모델로부터 크게 혜택을 받았습니다.\n\n<img src="https://miro.medium.com/max/1400/1*D0F3UItQv1n8ddwnz_KQjA.png" alt="ResNet Architecture" style="max-width: 100%; height: auto; margin: 20px 0;" />', 2, 3),
('Deep Residual Learning', '# Deep Residual Learning\n\n## 잔차 학습의 수학적 기초\n\nH(x)를 몇 개의 쌓인 계층(반드시 전체 네트워크일 필요는 없음)에 의해 맞춰질 기본 매핑으로 고려해 보겠습니다. 여기서 x는 이러한 계층들 중 첫 번째 계층의 입력을 나타냅니다. 여러 비선형 계층이 복잡한 함수를 점근적으로 근사할 수 있다고 가정한다면, 이는 잔차 함수, 즉 H(x) − x(입력과 출력이 동일한 차원이라고 가정)를 점근적으로 근사할 수 있다고 가정하는 것과 동일합니다.\n\n## 잔차 함수의 정의\n\n따라서 쌓인 계층이 H(x)를 근사할 것으로 기대하는 대신, 우리는 이러한 계층들이 잔차 함수 F(x) := H(x) − x를 근사하도록 명시적으로 합니다. 원래 함수는 따라서 F(x) + x가 됩니다. 두 형태 모두 원하는 함수를 점근적으로 근사할 수 있어야 하지만(가정된 대로), 학습의 용이성은 다를 수 있습니다.\n\n**잔차 블록의 핵심 아이디어:**\n- **Skip Connection**: 입력을 출력에 직접 더함\n- **Residual Function**: F(x) = H(x) - x\n- **Identity Mapping**: x + F(x) = H(x)', 3, 3),
('Experiments', '# Experiments\n\n## 데이터셋 및 평가\n\n우리는 1000개 클래스로 구성된 ImageNet 2012 분류 데이터셋에서 우리의 방법을 평가합니다. 우리는 128만 개의 훈련 이미지에서 모델을 훈련하고, 5만 개의 검증 이미지에서 평가합니다. 우리는 또한 테스트 서버에서 보고된 10만 개의 테스트 이미지에 대한 최종 결과를 얻습니다.\n\n## 훈련 설정\n\n우리는 top-1과 top-5 오류율을 모두 평가합니다. 우리는 문헌에서 찾을 수 있는 최고의 방법들과 비교합니다. 우리는 훈련을 위해 표준 데이터 증강을 채택합니다. 이미지는 스케일 증강을 위해 더 짧은 쪽이 [256, 480]에서 무작위로 샘플링되도록 크기가 조정됩니다. 224×224 크롭은 이미지나 그 수평 뒤집기에서 무작위로 샘플링되며, 픽셀별 평균이 뺍니다.\n\n**실험 설정:**\n- **데이터셋**: ImageNet 2012 (1000 classes)\n- **훈련 이미지**: 1.28M\n- **검증 이미지**: 50K\n- **배치 크기**: 256\n- **데이터 증강**: Scale [256, 480], 224×224 crop', 4, 3),
('Results', '# Results\n\n## 성능 평가\n\n우리는 ImageNet 검증 세트에서 결과를 보여주고, 선도적인 방법들과 비교합니다. top-5 오류는 중앙 크롭으로 측정됩니다. VGG 네트워크의 관례를 따라, 우리는 10-크롭 테스트를 사용하여 모델을 평가합니다.\n\n## 주요 발견\n\n우리는 또한 GoogLeNet의 최선의 관례를 사용하여 중앙 크롭과 10-크롭 결과를 모두 보여주며 평가합니다. 우리는 다음을 보여줍니다:\n\n1. **우리의 극도로 깊은 잔차 네트워크는 최적화하기 쉽지만**, 대응하는 "일반" 네트워크(단순히 계층을 쌓는 것)는 깊이가 증가할 때 더 높은 훈련 오류를 보입니다.\n\n2. **우리의 깊은 잔차 네트워크는 크게 증가된 깊이에서 정확도 향상을 쉽게 즐길 수 있으며**, 이전 네트워크보다 훨씬 더 나은 결과를 생성합니다.\n\n**주요 성과:**\n- **Top-5 Error**: 3.57% (ImageNet)\n- **ILSVRC 2015**: 1st place\n- **Depth**: Up to 152 layers', 5, 3),

-- Generative Adversarial Networks
('Abstract', '# Abstract\n\n우리는 적대적 과정을 통해 생성 모델을 추정하기 위한 새로운 프레임워크를 제안합니다. 이 프레임워크에서는 두 개의 모델을 동시에 훈련합니다: 데이터 분포를 포착하는 생성 모델 G와 샘플이 G가 아닌 훈련 데이터에서 나왔을 확률을 추정하는 판별 모델 D입니다.\n\nG의 훈련 절차는 D가 실수할 확률을 최대화하는 것입니다. 이 프레임워크는 미니맥스 2인용 게임에 해당합니다. 임의의 함수 G와 D의 공간에서, G가 훈련 데이터 분포를 복구하고 D가 모든 곳에서 1/2과 같은 고유한 해가 존재합니다.\n\nG와 D가 다층 퍼셉트론으로 정의되는 경우, 전체 시스템은 역전파로 훈련될 수 있습니다. 훈련이나 샘플 생성 중에 마르코프 체인이나 펼쳐진 근사 추론 네트워크가 필요하지 않습니다. 실험은 생성된 샘플의 정성적 및 정량적 평가를 통해 프레임워크의 잠재력을 보여줍니다.', 1, 4),
('Introduction', '# Introduction\n\n## 딥러닝의 목표\n\n딥러닝의 약속은 자연 이미지, 음성을 포함한 오디오 파형, 자연어 코퍼스의 심볼과 같은 인공지능 응용 프로그램에서 접하는 데이터 유형에 대한 확률 분포를 나타내는 풍부하고 계층적인 모델을 발견하는 것입니다.\n\n## 기존 접근 방식의 한계\n\n지금까지 딥러닝에서 가장 놀라운 성공은 판별 모델, 보통 고차원의 풍부한 감각 입력을 클래스 레이블에 매핑하는 것과 관련이 있었습니다. 이러한 놀라운 성공은 주로 역전파와 드롭아웃 알고리즘을 기반으로 하며, 특히 잘 동작하는 그래디언트를 가진 조각별 선형 단위를 사용합니다.\n\n깊은 생성 모델은 최대 가능도 추정 및 관련 전략에서 발생하는 많은 다루기 어려운 확률적 계산을 근사하는 어려움과 생성 맥락에서 조각별 선형 단위의 이점을 활용하는 어려움으로 인해 덜한 영향을 미쳤습니다.', 2, 4),
('Adversarial Nets', '# Adversarial Nets\n\n## 프레임워크 개요\n\n모델이 다층 퍼셉트론일 때, 적대적 모델링 프레임워크가 가장 직관적으로 적용됩니다. 데이터 x에 대한 생성기의 분포 p<sub>g</sub>를 학습하기 위해, 우리는 입력 노이즈 변수 p<sub>z</sub>(z)에 대한 사전을 정의하고, 그 다음 데이터 공간에 대한 매핑을 G(z; θ<sub>g</sub>)로 나타냅니다. 여기서 G는 매개변수 θ<sub>g</sub>를 가진 다층 퍼셉트론으로 표현되는 미분 가능한 함수입니다.\n\n## 생성자와 판별자\n\n우리는 또한 단일 스칼라를 출력하는 두 번째 다층 퍼셉트론 D(x; θ<sub>d</sub>)를 정의합니다. D(x)는 x가 p<sub>g</sub>가 아닌 데이터에서 나왔을 확률을 나타냅니다.\n\n<img src="https://miro.medium.com/max/1400/1*IZQ3XQGhJgoXaLgfa8m-4A.png" alt="GAN Architecture" style="max-width: 100%; height: auto; margin: 20px 0;" />\n\n**GAN의 핵심 아이디어:**\n- **Generator (G)**: 노이즈에서 실제와 같은 데이터 생성\n- **Discriminator (D)**: 실제 데이터와 생성된 데이터 구분\n- **Adversarial Training**: G와 D의 경쟁적 학습', 3, 4),
('Theoretical Results', '# Theoretical Results\n\n## 수렴성 분석\n\n생성기 G는 z ∼ p<sub>z</sub>일 때 얻은 샘플 G(z)의 분포로서 확률 분포 p<sub>g</sub>를 암묵적으로 정의합니다. 따라서 충분한 용량과 훈련 시간이 주어진다면 알고리즘 1이 p<sub>data</sub>의 좋은 추정자로 수렴하기를 원합니다.\n\n## 이론적 보장\n\n이 섹션의 결과는 비모수적 설정에서 수행됩니다. 예를 들어, 우리는 확률 밀도 함수의 공간에서 수렴을 연구함으로써 무한한 용량을 가진 모델을 나타냅니다.\n\n**이론적 보장:**\n- **Convergence**: 충분한 용량에서 최적해로 수렴\n- **Uniqueness**: 고유한 해의 존재\n- **Optimality**: G가 실제 분포를 복구, D가 1/2이 됨', 4, 4),
('Experiments', '# Experiments\n\n## 데이터셋 및 모델 설정\n\n우리는 MNIST, Toronto Face Database (TFD), CIFAR-10을 포함한 다양한 데이터셋에서 적대적 네트워크를 훈련했습니다. 생성기 네트워크는 정류 선형 활성화와 시그모이드 활성화의 혼합을 사용했으며, 판별기 네트워크는 맥스아웃 활성화를 사용했습니다.\n\n## 훈련 세부사항\n\n드롭아웃은 판별기 네트워크 훈련에 적용되었습니다. 우리의 이론적 프레임워크는 생성기의 중간 계층에서 드롭아웃과 다른 노이즈의 사용을 허용하지만, 우리는 노이즈를 생성기 네트워크의 가장 하단 계층에만 입력으로 사용했습니다.\n\n**실험 결과:**\n- **MNIST**: 고품질 숫자 이미지 생성\n- **TFD**: 사실적인 얼굴 이미지 생성\n- **CIFAR-10**: 다양한 객체 이미지 생성', 5, 4),

-- YOLO: Real-Time Object Detection
('Abstract', '# Abstract\n\n우리는 객체 탐지를 위한 새로운 접근 방식인 **YOLO(You Only Look Once)**를 제시합니다. 이전의 객체 탐지 작업들은 분류기를 탐지 수행을 위해 재활용했습니다. 대신, 우리는 객체 탐지를 공간적으로 분리된 바운딩 박스와 관련 클래스 확률에 대한 회귀 문제로 프레임합니다.\n\n단일 신경망이 전체 이미지에서 한 번의 평가로 바운딩 박스와 클래스 확률을 직접 예측합니다. 전체 탐지 파이프라인이 단일 네트워크이기 때문에, 탐지 성능에 대해 직접 엔드투엔드로 최적화할 수 있습니다.\n\n우리의 통합 아키텍처는 극도로 빠릅니다. 우리의 기본 YOLO 모델은 초당 45프레임으로 실시간 이미지 처리를 수행합니다. 네트워크의 더 작은 버전인 Fast YOLO는 초당 놀라운 155프레임을 처리하면서도 다른 실시간 탐지기보다 두 배의 mAP를 달성합니다.\n\n최첨단 탐지 시스템과 비교하여, YOLO는 더 많은 위치 오류를 만들지만 배경에서의 거짓 양성을 예측할 가능성이 적습니다. 마지막으로, YOLO는 객체의 매우 일반적인 표현을 학습합니다. 자연 이미지에서 예술 작품과 같은 다른 도메인으로 일반화할 때 DPM과 R-CNN을 포함한 다른 탐지 방법들을 능가합니다.', 1, 5),
('Introduction', '# Introduction\n\n## 인간 시각 시스템의 영감\n\n인간은 이미지를 한 번 보고 즉시 이미지에 어떤 객체들이 있는지, 어디에 있는지, 어떻게 상호작용하는지 알 수 있습니다. 인간의 시각 시스템은 빠르고 정확하여, 우리가 의식적인 생각 없이도 운전과 같은 복잡한 작업을 수행할 수 있게 합니다.\n\n## 실시간 객체 탐지의 중요성\n\n빠르고 정확한 객체 탐지 알고리즘은 컴퓨터가 특수 센서 없이도 자동차를 운전할 수 있게 하고, 보조 장치가 인간 사용자에게 실시간 장면 정보를 전달할 수 있게 하며, 범용 목적의 반응형 로봇 시스템의 잠재력을 해방시킬 수 있습니다.\n\n<img src="https://miro.medium.com/max/1400/1*RqXFpi9wqbuSuCr6l29dyw.png" alt="YOLO Detection" style="max-width: 100%; height: auto; margin: 20px 0;" />', 2, 5),
('Unified Detection', '# Unified Detection\n\n## 통합 아키텍처\n\n우리는 객체 탐지의 개별 구성 요소들을 단일 신경망으로 통합합니다. 우리의 네트워크는 전체 이미지의 특징을 사용하여 바운딩 박스를 예측합니다. 또한 이러한 박스들에 대한 클래스 확률도 예측합니다. YOLO는 전체 이미지에서 훈련하고 탐지 성능을 직접 최적화합니다.\n\n## 주요 이점\n\n이 통합 설계는 전통적인 객체 탐지 방법들보다 여러 이점을 제공합니다:\n\n1. **YOLO는 극도로 빠릅니다**. 탐지를 회귀 문제로 프레임하기 때문에 복잡한 파이프라인이 필요하지 않습니다. 테스트 시간에 새로운 이미지에서 우리의 신경망을 단순히 실행하여 탐지를 예측합니다.\n\n2. **YOLO는 예측할 때 이미지에 대해 전역적으로 추론합니다**. 슬라이딩 윈도우와 지역 제안 기반 기술과 달리, YOLO는 훈련과 테스트 시간에 전체 이미지를 보므로 클래스와 그 외관에 대한 컨텍스트 정보를 암묵적으로 인코딩합니다.\n\n3. **YOLO는 객체의 일반화 가능한 표현을 학습합니다**. 자연 이미지에서 훈련되고 예술 작품에서 테스트될 때, YOLO는 DPM과 R-CNN과 같은 최고 탐지 방법들을 큰 차이로 능가합니다.', 3, 5),
('Network Design', '# Network Design\n\n## 아키텍처 개요\n\n우리의 네트워크 아키텍처는 이미지 분류를 위한 GoogLeNet 모델에서 영감을 받았습니다. 우리의 네트워크는 24개의 컨볼루션 계층과 그 뒤에 2개의 완전 연결 계층을 가집니다. GoogLeNet에서 사용하는 인셉션 모듈 대신, 우리는 단순히 1 × 1 축소 계층과 그 뒤에 3 × 3 컨볼루션 계층을 사용하며, 이는 Lin et al.과 유사합니다.\n\n## Fast YOLO 변형\n\n우리는 또한 빠른 객체 탐지의 경계를 밀어붙이기 위해 설계된 YOLO의 빠른 버전을 훈련합니다. Fast YOLO는 더 적은 컨볼루션 계층(24개 대신 9개)과 그 계층들에서 더 적은 필터를 가진 신경망을 사용합니다. 네트워크 크기 외에는 YOLO와 Fast YOLO 간의 모든 훈련 및 테스트 매개변수가 동일합니다.\n\n**네트워크 구조:**\n- **24 Convolutional Layers**: 특징 추출\n- **2 Fully Connected Layers**: 최종 예측\n- **1×1 Reduction + 3×3 Convolution**: 효율적인 특징 처리', 4, 5),
('Training', '# Training\n\n## 사전 훈련\n\n우리는 ImageNet 1000클래스 경쟁 데이터셋에서 컨볼루션 계층들을 사전 훈련합니다. 사전 훈련을 위해 우리는 그림 3의 처음 20개 컨볼루션 계층과 그 뒤에 평균 풀링 계층과 완전 연결 계층을 사용합니다. 우리는 이 네트워크를 약 일주일간 훈련하고 ImageNet 2012 검증 세트에서 단일 크롭 top-5 정확도 88%를 달성하며, 이는 Caffe의 Model Zoo의 GoogLeNet 모델들과 비교할 수 있습니다.\n\n## 탐지 훈련\n\n우리는 모든 훈련과 추론에 Darknet 프레임워크를 사용합니다. 그런 다음 모델을 탐지 수행을 위해 변환합니다. Ren et al.은 사전 훈련된 네트워크에 컨볼루션과 연결 계층을 모두 추가하면 성능이 향상될 수 있다는 것을 보여줍니다. 그들의 예를 따라, 우리는 무작위로 초기화된 가중치로 4개의 컨볼루션 계층과 2개의 완전 연결 계층을 추가합니다.\n\n**훈련 설정:**\n- **Pretraining**: ImageNet 1000-class (88% top-5 accuracy)\n- **Detection Training**: 448×448 resolution\n- **Framework**: Darknet\n- **Training Time**: ~1 week', 5, 5),
('Results', '# Results\n\n## PASCAL VOC 성능\n\n우리는 PASCAL VOC 2007 테스트 세트에서 YOLO를 실행하고 다른 실시간 탐지 시스템들과 비교합니다. YOLO는 실시간 성능으로 63.4% mAP를 얻습니다. 우리의 Fast YOLO는 테스트 세트에서 가장 빠른 방법으로, 초당 155 FPS로 실행하면서 52.7% mAP를 달성합니다.\n\n## 다양한 데이터셋에서의 성능\n\n우리는 또한 VOC 2012에서 YOLO를 훈련하고 테스트 세트에서 57.9% mAP를 달성하며, 이는 경쟁 방법들보다 높습니다. 전체 결과는 PASCAL VOC 리더보드에서 확인할 수 있습니다. 더 도전적인 객체 카테고리를 가진 새로운 COCO 데이터셋에서 YOLO는 초당 35 FPS로 실행하면서 19.8% mAP를 달성합니다.\n\n**주요 성과:**\n- **PASCAL VOC 2007**: 63.4% mAP (real-time)\n- **Fast YOLO**: 155 FPS, 52.7% mAP\n- **PASCAL VOC 2012**: 57.9% mAP\n- **COCO**: 19.8% mAP at 35 FPS', 6, 5);

-- RSS Feed 예시 데이터 (Oracle에서는 각각 삽입)
INSERT INTO RSS_FEEDS (TITLE, SUMMARY, WRITED_AT, ORIGINAL_URL, RSS_URL_ID) VALUES ('TechCrunch: 최신 AI 기술 동향', '인공지능 분야의 최신 기술 동향과 스타트업 소식을 다룹니다.', TO_TIMESTAMP('2024-01-15 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'https://techcrunch.com/2024/01/15/ai-trends', 1);
INSERT INTO RSS_FEEDS (TITLE, SUMMARY, WRITED_AT, ORIGINAL_URL, RSS_URL_ID) VALUES ('CNN: 글로벌 기술 뉴스', '전 세계 기술 산업의 주요 뉴스와 분석을 제공합니다.', TO_TIMESTAMP('2024-01-15 09:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'https://cnn.com/tech/global-news', 2);
INSERT INTO RSS_FEEDS (TITLE, SUMMARY, WRITED_AT, ORIGINAL_URL, RSS_URL_ID) VALUES ('Google Developers: Android 개발 팁', 'Android 앱 개발을 위한 실용적인 팁과 튜토리얼을 제공합니다.', TO_TIMESTAMP('2024-01-15 14:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'https://youtube.com/watch?v=example', 3);
INSERT INTO RSS_FEEDS (TITLE, SUMMARY, WRITED_AT, ORIGINAL_URL, RSS_URL_ID) VALUES ('Ars Technica: 하드웨어 리뷰', '최신 하드웨어 제품에 대한 상세한 리뷰와 성능 분석을 제공합니다.', TO_TIMESTAMP('2024-01-15 11:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'https://arstechnica.com/hardware-review', 4);
INSERT INTO RSS_FEEDS (TITLE, SUMMARY, WRITED_AT, ORIGINAL_URL, RSS_URL_ID) VALUES ('TED: 혁신적인 아이디어', '세계 각지의 혁신적인 아이디어와 영감을 주는 이야기를 다룹니다.', TO_TIMESTAMP('2024-01-15 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'https://youtube.com/watch?v=ted-example', 5);
INSERT INTO RSS_FEEDS (TITLE, SUMMARY, WRITED_AT, ORIGINAL_URL, RSS_URL_ID) VALUES ('TechCrunch: 웹3 생태계 분석', '블록체인과 웹3 기술의 현재와 미래에 대한 심층 분석입니다.', TO_TIMESTAMP('2024-01-14 15:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'https://techcrunch.com/2024/01/14/web3-ecosystem', 1);
INSERT INTO RSS_FEEDS (TITLE, SUMMARY, WRITED_AT, ORIGINAL_URL, RSS_URL_ID) VALUES ('CNN: 사이버 보안 위협', '최신 사이버 보안 위협과 대응 방안에 대한 전문가 의견을 다룹니다.', TO_TIMESTAMP('2024-01-14 13:10:00', 'YYYY-MM-DD HH24:MI:SS'), 'https://cnn.com/tech/cybersecurity', 2);

-- User Library 예시 데이터 (사용자가 논문을 라이브러리에 추가)
INSERT INTO USER_LIBRARY (USER_ID, PAPER_ID) VALUES (1, 1); -- 테스트 사용자가 "Attention Is All You Need" 추가
INSERT INTO USER_LIBRARY (USER_ID, PAPER_ID) VALUES (1, 3); -- 테스트 사용자가 "ResNet" 추가
INSERT INTO USER_LIBRARY (USER_ID, PAPER_ID) VALUES (1, 2); -- 테스트 사용자가 "BERT" 추가
INSERT INTO USER_LIBRARY (USER_ID, PAPER_ID) VALUES (1, 4); -- 테스트 사용자가 "GAN" 추가
INSERT INTO USER_LIBRARY (USER_ID, PAPER_ID) VALUES (1, 5); -- 테스트 사용자가 "YOLO" 추가


-- 데이터 확인 쿼리 (Oracle 버전)
SELECT 'Users' AS TABLE_NAME, COUNT(*) AS COUNT FROM USERS
UNION ALL
SELECT 'RSS URLs', COUNT(*) FROM RSS_URLS
UNION ALL
SELECT 'RSS Feeds', COUNT(*) FROM RSS_FEEDS
UNION ALL
SELECT 'Papers', COUNT(*) FROM PAPERS
UNION ALL
SELECT 'Paper Categories', COUNT(*) FROM CS_PAPER_CATEGORIES
UNION ALL
SELECT 'Paper-Category Relations', COUNT(*) FROM CS_PAPER_CATEGORY_RELATIONS
UNION ALL
SELECT 'Paper Content', COUNT(*) FROM PAPER_CONTENT
UNION ALL
SELECT 'User Library', COUNT(*) FROM USER_LIBRARY
UNION ALL
SELECT 'User Interests', COUNT(*) FROM USER_INTERESTS;