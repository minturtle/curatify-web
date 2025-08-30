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
('Attention Is All You Need - 상세 내용', 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin', '# Transformer 아키텍처 상세 분석

## 개요
이 논문은 **Transformer** 아키텍처의 상세한 구현 방법과 실험 결과를 다룹니다.

## 핵심 구성 요소

### 1. Multi-Head Attention
Multi-head attention 메커니즘은 다음과 같은 특징을 가집니다:

- **병렬 처리**: 여러 attention head가 동시에 작동
- **다양한 표현 학습**: 각 head가 서로 다른 관점에서 학습
- **확장성**: head 수를 조절하여 모델 크기 조정 가능

### 2. Positional Encoding
RNN과 달리 Transformer는 위치 정보를 명시적으로 주입해야 합니다:

```python
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

### 3. Encoder-Decoder 구조
<img src="https://miro.medium.com/max/1400/1*BHzGVskWGS_3jEcYYi6miQ.png" alt="Transformer Architecture" width="600" style="display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

## 실험 결과

### 번역 성능
- **WMT 2014 English-to-German**: 28.4 BLEU 점수
- **WMT 2014 English-to-French**: 41.8 BLEU 점수

### 학습 효율성
- **훈련 시간**: 기존 모델 대비 1/4 단축
- **병렬화**: GPU 활용도 대폭 향상

## 영향과 의의
이 논문은 NLP 분야에 **혁명적인 변화**를 가져왔으며, 현재 대부분의 최신 언어 모델의 기반이 되고 있습니다.', 1),

('BERT: Pre-training of Deep Bidirectional Transformers - 상세 내용', 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova', '# BERT: 양방향 Transformer 기반 언어 모델

## 모델 아키텍처

### 사전 학습 태스크

#### 1. Masked Language Model (MLM)
- **목적**: 문맥을 고려한 단어 예측
- **방법**: 입력의 15% 토큰을 [MASK]로 대체하여 예측

#### 2. Next Sentence Prediction (NSP)
- **목적**: 문장 간 관계 학습
- **방법**: 두 문장이 연속인지 판단하는 이진 분류

<img src="https://miro.medium.com/max/1400/1*SutAQhVWrD3QwqJhVnqQjg.png" alt="BERT Pre-training Tasks" width="500" style="display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

## Fine-tuning 과정

### 다양한 태스크 적용
BERT는 다음과 같은 태스크에 fine-tuning이 가능합니다:

1. **문장 분류** (Sentiment Analysis)
2. **개체명 인식** (NER)
3. **질의응답** (QA)
4. **문장 유사도** (Sentence Similarity)

### GLUE 벤치마크 결과
| 태스크 | 성능 | 순위 |
|--------|------|------|
| CoLA | 60.5 | 1st |
| SST-2 | 93.5 | 1st |
| MRPC | 88.9 | 1st |
| STS-B | 87.1 | 1st |

## 기술적 특징

### 양방향 컨텍스트
- **양방향**: 좌우 문맥을 모두 고려
- **깊은 표현**: 12-24층의 Transformer 레이어
- **대규모 데이터**: BooksCorpus + Wikipedia

### 계산 복잡도
- **Base 모델**: 110M 파라미터
- **Large 모델**: 340M 파라미터
- **훈련 시간**: 4일 (16 TPU)', 2),

('ResNet: Deep Residual Learning - 상세 내용', 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun', '# ResNet: 깊은 신경망 학습의 혁신

## 문제 정의

### 기존 문제점
깊은 신경망에서 발생하는 문제들:

- **Vanishing Gradient**: 그래디언트 소실
- **Degradation**: 깊이가 깊어질수록 성능 저하
- **학습 어려움**: 20층 이상에서 학습 불안정

## 해결 방법: Residual Learning

### 핵심 아이디어
**Skip Connection**을 통한 residual learning:

```
F(x) = H(x) - x
H(x) = F(x) + x
```

<img src="https://miro.medium.com/max/1400/1*D0F3UItQ2l5Q0Ak-tjEdJg.png" alt="ResNet Block" width="400" style="display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

### Residual Block 구조
```python
class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, 3, padding=1)
        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, padding=1)
        self.relu = nn.ReLU()
        
    def forward(self, x):
        residual = x
        out = self.relu(self.conv1(x))
        out = self.conv2(out)
        out += residual  # Skip connection
        return self.relu(out)
```

## 실험 결과

### ImageNet 성능
| 모델 | 깊이 | Top-5 에러율 |
|------|------|---------------|
| ResNet-50 | 50층 | 6.7% |
| ResNet-101 | 101층 | 6.0% |
| ResNet-152 | 152층 | **5.7%** |

### 학습 안정성
- **수렴 속도**: 기존 모델 대비 2배 빠름
- **그래디언트 흐름**: 안정적인 역전파
- **깊이 확장**: 1000층 이상까지 확장 가능

## 영향과 의의

### 컴퓨터 비전 분야
- **표준 아키텍처**: 대부분의 CNN 기반 모델이 채택
- **성능 향상**: ImageNet 정확도 대폭 개선
- **학습 방법론**: 깊은 신경망 학습의 새로운 패러다임

### 후속 연구
- **DenseNet**: 모든 레이어 연결
- **Highway Networks**: 게이팅 메커니즘 도입
- **ResNeXt**: 그룹 컨볼루션 적용', 3),

('Generative Adversarial Networks - 상세 내용', 'Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio', '# GAN: 생성적 적대 신경망

## 기본 개념

### 게임 이론적 접근
GAN은 **minimax 게임**으로 모델링됩니다:

```
min_G max_D V(D,G) = E_x[log D(x)] + E_z[log(1-D(G(z)))]
```

### 두 네트워크의 역할

#### Generator (G)
- **목적**: 실제 데이터와 구분할 수 없는 가짜 데이터 생성
- **입력**: 랜덤 노이즈 z
- **출력**: 생성된 이미지 G(z)

#### Discriminator (D)
- **목적**: 실제 데이터와 가짜 데이터를 구분
- **입력**: 실제 이미지 x 또는 가짜 이미지 G(z)
- **출력**: 실제일 확률 D(x) 또는 D(G(z))

<img src="https://miro.medium.com/max/1400/1*IZGu6tkoYVN_hEZVdc-uNQ.png" alt="GAN Architecture" width="600" style="display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

## 학습 과정

### 1. Discriminator 학습
```python
# 실제 데이터에 대한 손실
d_loss_real = -log(D(real_images))

# 가짜 데이터에 대한 손실
d_loss_fake = -log(1 - D(G(noise)))

# 전체 Discriminator 손실
d_loss = d_loss_real + d_loss_fake
```

### 2. Generator 학습
```python
# Generator는 Discriminator를 속이려 함
g_loss = -log(D(G(noise)))
```

## 실험 결과

### 데이터셋별 성능
| 데이터셋 | 해상도 | 품질 점수 |
|----------|--------|-----------|
| MNIST | 28x28 | 0.95 |
| CIFAR-10 | 32x32 | 0.87 |
| ImageNet | 64x64 | 0.82 |

### 생성된 이미지 예시
<img src="https://miro.medium.com/max/1400/1*_CkXj0W3vQmWmJqJGk_0Lg.png" alt="Generated Images" width="500" style="display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

## 기술적 도전과제

### 1. 학습 안정성
- **Mode Collapse**: 생성자가 제한된 패턴만 생성
- **Gradient Vanishing**: 학습 초기에 발생하는 문제
- **Nash Equilibrium**: 두 네트워크의 균형점 찾기

### 2. 해결 방법
- **Wasserstein GAN**: 새로운 손실 함수 도입
- **DCGAN**: 딥 컨볼루션 구조 적용
- **Progressive GAN**: 점진적 해상도 증가

## 응용 분야

### 이미지 생성
- **StyleGAN**: 고품질 얼굴 이미지 생성
- **BigGAN**: 대규모 이미지 생성
- **CycleGAN**: 스타일 변환

### 기타 분야
- **텍스트 생성**: SeqGAN, TextGAN
- **음성 합성**: WaveGAN, MelGAN
- **3D 모델링**: 3D-GAN', 4),

('YOLO: Real-Time Object Detection - 상세 내용', 'Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi', '# YOLO: 실시간 객체 탐지 시스템

## 핵심 아이디어

### 단일 단계 탐지 (One-Stage Detection)
기존의 **two-stage** 방식과 달리, YOLO는 **single-stage** 방식입니다:

- **Two-Stage**: R-CNN, Fast R-CNN, Faster R-CNN
- **Single-Stage**: YOLO, SSD, RetinaNet

### 그리드 기반 접근법
이미지를 **S×S 그리드**로 분할하여 각 셀에서 객체를 탐지합니다.

<img src="https://miro.medium.com/max/1400/1*RqKs7YtQwWtKJqHfFJw5MQ.png" alt="YOLO Grid" width="500" style="display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

## 아키텍처 상세

### 네트워크 구조
```
Input: 448×448×3
↓
24 Convolutional Layers
↓
2 Fully Connected Layers
↓
Output: 7×7×30
```

### 출력 형식
각 그리드 셀마다 다음 정보를 예측:

- **바운딩 박스**: (x, y, w, h) - 4개 값
- **신뢰도**: objectness score - 1개 값
- **클래스 확률**: 20개 클래스 - 20개 값

### 총 25개 값 × 7×7 그리드 = 1225개 출력

## 학습 과정

### 손실 함수
```
Loss = λ_coord × Coordinate Loss + 
       Objectness Loss + 
       λ_noobj × No-Object Loss + 
       Classification Loss
```

### 좌표 손실
```python
def coordinate_loss(pred_xy, true_xy, pred_wh, true_wh):
    xy_loss = MSE(pred_xy, true_xy)
    wh_loss = MSE(sqrt(pred_wh), sqrt(true_wh))
    return xy_loss + wh_loss
```

## 성능 비교

### 속도 vs 정확도
| 모델 | FPS | mAP | 정확도 순위 |
|------|-----|-----|-------------|
| R-CNN | 0.1 | 66.0 | 1st |
| Fast R-CNN | 0.5 | 70.0 | 2nd |
| Faster R-CNN | 7.0 | 73.2 | 3rd |
| **YOLO** | **45.0** | **63.4** | **4th** |

### 실시간 처리 능력
<img src="https://miro.medium.com/max/1400/1*_CkXj0W3vQmWmJqJGk_0Lg.png" alt="YOLO Speed Comparison" width="600" style="display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

## 장단점

### 장점
- **실시간 처리**: 45 FPS로 실시간 객체 탐지
- **전역적 컨텍스트**: 전체 이미지를 한 번에 분석
- **적은 오탐**: 배경 오탐률이 낮음

### 단점
- **정확도**: 작은 객체 탐지 성능 부족
- **위치 정확도**: 바운딩 박스 정확도 상대적으로 낮음
- **클래스 불균형**: 드문 클래스 탐지 어려움

## 후속 연구

### YOLO v2 (YOLO9000)
- **고해상도**: 448×448 → 416×416
- **Anchor Boxes**: k-means 클러스터링으로 앵커 박스 최적화
- **다중 스케일**: 다양한 해상도에서 훈련

### YOLO v3
- **다중 스케일 예측**: 3개 다른 스케일에서 예측
- **더 나은 백본**: Darknet-53 사용
- **FPN**: Feature Pyramid Network 적용

### YOLO v4/v5
- **Bag of Freebies**: 훈련 시 개선 기법들
- **Bag of Specials**: 추론 시 개선 기법들
- **AutoML**: 자동 아키텍처 탐색', 5);

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