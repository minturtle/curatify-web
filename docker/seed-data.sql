-- Curify 시드 데이터 스크립트

-- 문자셋 설정
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- 데이터베이스 사용
USE curatify;

-- 사용자 예시 데이터
INSERT INTO users (email, password, name, is_verified) VALUES
('tester@test.com', '$2b$12$ixsz8fg5jJAjgfTfpCEuf.CI1bVbWfuelhFOuMrAiwGs29sq8v10W', '테스트 사용자', TRUE);

-- RSS URL 예시 데이터
INSERT INTO rss_urls (type, url, user_id) VALUES
('normal', 'https://feeds.feedburner.com/TechCrunch', 1),
('normal', 'https://rss.cnn.com/rss/edition.rss', 1),
('youtube', 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw', 1),
('normal', 'https://feeds.arstechnica.com/arstechnica/index', 1),
('youtube', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsT0YIqwnpJCM-mx7-gSA4Q', 1);

-- CS Papers 예시 데이터
INSERT INTO cs_papers (title, all_categories, authors, update_date, url, abstract, summary) VALUES
('Attention Is All You Need', 'cs.CL, cs.AI', 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin', '2017-06-12 00:00:00', 'https://arxiv.org/abs/1706.03762', 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.', 'Transformer 아키텍처를 제안한 논문으로, RNN과 CNN 없이 attention 메커니즘만으로 구성된 모델입니다.'),
('BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'cs.CL', 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova', '2018-10-11 00:00:00', 'https://arxiv.org/abs/1810.04805', 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.', '양방향 Transformer를 사용한 언어 이해 모델 BERT를 제안한 논문입니다.'),
('ResNet: Deep Residual Learning for Image Recognition', 'cs.CV', 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun', '2015-12-10 00:00:00', 'https://arxiv.org/abs/1512.03385', 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.', '깊은 신경망의 학습을 위한 residual learning 프레임워크를 제안한 논문입니다.'),
('Generative Adversarial Networks', 'cs.LG, cs.AI', 'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio', '2014-06-10 00:00:00', 'https://arxiv.org/abs/1406.2661', 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.', '생성 모델과 판별 모델을 동시에 학습하는 GAN 프레임워크를 제안한 논문입니다.'),
('YOLO: Real-Time Object Detection', 'cs.CV', 'Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi', '2015-06-08 00:00:00', 'https://arxiv.org/abs/1506.02640', 'We present YOLO, a new approach to object detection. Prior work on object detection repurposes classifiers to perform detection. Instead, we frame object detection as a regression problem to spatially separated bounding boxes and associated class probabilities.', '실시간 객체 탐지를 위한 YOLO 모델을 제안한 논문입니다.');

-- Paper Content 예시 데이터
INSERT INTO paper_content (title, authors, content, paper_id) VALUES
('Attention Is All You Need - 상세 내용', 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin', '이 논문은 Transformer 아키텍처의 상세한 구현 방법과 실험 결과를 다룹니다. Multi-head attention 메커니즘, positional encoding, 그리고 encoder-decoder 구조에 대해 자세히 설명합니다. WMT 2014 English-to-German 번역 태스크에서 28.4 BLEU 점수를 달성했으며, 이는 기존의 최고 성능을 크게 향상시킨 결과입니다.', 1),
('BERT: Pre-training of Deep Bidirectional Transformers - 상세 내용', 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova', 'BERT 모델의 사전 학습 방법과 fine-tuning 과정을 상세히 설명합니다. Masked Language Model (MLM)과 Next Sentence Prediction (NSP) 태스크를 통한 사전 학습 방법, 그리고 다양한 NLP 태스크에 대한 fine-tuning 결과를 제시합니다. GLUE 벤치마크에서 11개 태스크 중 9개에서 최고 성능을 달성했습니다.', 2),
('ResNet: Deep Residual Learning - 상세 내용', 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun', 'ResNet의 핵심 아이디어인 residual connection과 skip connection에 대해 자세히 설명합니다. 152층 깊이의 ResNet을 ImageNet 데이터셋에서 학습시켜 3.57% top-5 에러율을 달성했습니다. 이는 당시 최고 성능이었으며, 깊은 신경망 학습의 새로운 패러다임을 제시했습니다.', 3),
('Generative Adversarial Networks - 상세 내용', 'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio', 'GAN의 수학적 기반과 학습 과정을 상세히 설명합니다. 생성자와 판별자의 minimax 게임 이론, 그리고 실제 구현에서의 학습 안정성 문제와 해결 방법을 다룹니다. MNIST, CIFAR-10, ImageNet 데이터셋에서의 실험 결과를 제시합니다.', 4),
('YOLO: Real-Time Object Detection - 상세 내용', 'Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi', 'YOLO의 단일 단계 객체 탐지 방법과 실시간 처리 능력에 대해 상세히 설명합니다. 이미지를 그리드로 분할하고 각 그리드 셀에서 바운딩 박스와 클래스 확률을 동시에 예측하는 방법을 제시합니다. 45 FPS로 실시간 객체 탐지를 가능하게 했으며, PASCAL VOC 데이터셋에서 63.4% mAP를 달성했습니다.', 5);

-- RSS Feed 예시 데이터
INSERT INTO rss_feeds (title, summary, writed_at, original_url, rss_url_id) VALUES
('TechCrunch: 최신 AI 기술 동향', '인공지능 분야의 최신 기술 동향과 스타트업 소식을 다룹니다.', '2024-01-15 10:30:00', 'https://techcrunch.com/2024/01/15/ai-trends', 1),
('CNN: 글로벌 기술 뉴스', '전 세계 기술 산업의 주요 뉴스와 분석을 제공합니다.', '2024-01-15 09:15:00', 'https://cnn.com/tech/global-news', 2),
('Google Developers: Android 개발 팁', 'Android 앱 개발을 위한 실용적인 팁과 튜토리얼을 제공합니다.', '2024-01-15 14:20:00', 'https://youtube.com/watch?v=example', 3),
('Ars Technica: 하드웨어 리뷰', '최신 하드웨어 제품에 대한 상세한 리뷰와 성능 분석을 제공합니다.', '2024-01-15 11:45:00', 'https://arstechnica.com/hardware-review', 4),
('TED: 혁신적인 아이디어', '세계 각지의 혁신적인 아이디어와 영감을 주는 이야기를 다룹니다.', '2024-01-15 16:30:00', 'https://youtube.com/watch?v=ted-example', 5),
('TechCrunch: 웹3 생태계 분석', '블록체인과 웹3 기술의 현재와 미래에 대한 심층 분석입니다.', '2024-01-14 15:20:00', 'https://techcrunch.com/2024/01/14/web3-ecosystem', 1),
('CNN: 사이버 보안 위협', '최신 사이버 보안 위협과 대응 방안에 대한 전문가 의견을 다룹니다.', '2024-01-14 13:10:00', 'https://cnn.com/tech/cybersecurity', 2);

-- User Library 예시 데이터 (사용자가 논문을 라이브러리에 추가)
INSERT INTO user_library (user_id, paper_content_id) VALUES
(1, 1), -- 테스트 사용자가 "Attention Is All You Need" 추가
(1, 3), -- 테스트 사용자가 "ResNet" 추가
(1, 2), -- 테스트 사용자가 "BERT" 추가
(1, 4), -- 테스트 사용자가 "GAN" 추가
(1, 5); -- 테스트 사용자가 "YOLO" 추가


SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'RSS URLs', COUNT(*) FROM rss_urls
UNION ALL
SELECT 'RSS Feeds', COUNT(*) FROM rss_feeds
UNION ALL
SELECT 'CS Papers', COUNT(*) FROM cs_papers
UNION ALL
SELECT 'Paper Content', COUNT(*) FROM paper_content
UNION ALL
SELECT 'User Library', COUNT(*) FROM user_library;