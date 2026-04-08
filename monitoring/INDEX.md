# 📑 Моніторингу Стеку - Файлів Індекс

## 📁 Структура каталогу

```
/monitoring/
├── 📖 Документація
│   ├── README.md                    ⭐ Головна документація (почни звідси!)
│   ├── QUICK_START.md               🚀 Швидкий старт (5 хвилин)
│   ├── MONITORING_GUIDE.md          📚 Повний посібник (4 модулі)
│   ├── PROMQL_QUERIES.md            📊 PromQL запити та приклади
│   ├── TELEGRAM_SETUP.md            📱 Telegram сповіщення
│   ├── LOAD_TESTING.md              🧪 Load testing інструкції
│   └── DEPLOYMENT_CHECKLIST.md      ✅ Контрольний список розгортання
│
├── ⚙️ Конфігурація
│   ├── docker-compose.yml           🐳 Docker для всього стека
│   └── prometheus.yml               📊 Prometheus конфіг
│
└── 🔧 Скрипти
    ├── startup.sh                   🚀 Запуск стека
    └── load-test.sh                 🧪 Load testing скрипт
```

---

## 📄 Описание Кожного Файла

### 🟢 Файли Документації

#### **README.md** (⭐ ПОЧНИ ТУТ)
- 🎯 Загальний огляд мониторингу
- 🗺️ Архітектурна схема
- 📚 Посилання на інші документи
- ✅ Контрольний список перевірки
- **Читай першим!**

#### **QUICK_START.md** (🚀 Для нетерпимих)
- ⏱️ 5-хвилинний старт
- 🐳 Docker Compose запуск
- 📊 Prometheus підключення
- 📌 Базові кроки

#### **MONITORING_GUIDE.md** (📚 Повний курс)
- 📖 **Модуль 1:** Стек запуску (Prometheus + Grafana)
- 📈 **Модуль 2:** Збір метрик (Node Exporter + cAdvisor)
- 🎨 **Модуль 3:** Графіки та панелі (Dashboards)
- 🔔 **Модуль 4:** Сповіщення (Telegram інтеграція)
- ⏱️ Кожен модуль - 30-45 хвилин

#### **PROMQL_QUERIES.md** (📊 Довідник PromQL)
- 🔍 CPU запити
- 💾 Запам'ятовування запити
- 🌐 Мережевих запити
- 🚨 Alert запити
- 💡 Поради та трюки

#### **TELEGRAM_SETUP.md** (📱 Telegram интеграция)
- 🤖 Створення Telegram бота
- 💬 Налаштування групи та Chat ID
- 📞 Grafana Contact Point
- 🔔 Alert Rule налаштування
- 🐛 Тиражування проблем

#### **LOAD_TESTING.md** (🧪 Тестування навантаження)
- 🔧 Apache Benchmark встановлення
- 📊 k6 load testing
- 🎯 Тестові сценарії
- 📈 Результати аналізу
- ⚠️ Етикет та аспекти

#### **DEPLOYMENT_CHECKLIST.md** ✅ Розгортання
- 📋 Контрольний список перед початком
- 7️⃣ Контрольні пункти
- 🔍 Перевірки Prometheus
- 📱 Перевірки Grafana
- 🚨 Перевірки Telegram

---

### 🟣 Конфігураційні Файли

#### **docker-compose.yml** (🐳 Docker Compose)
- **Prometheus** - Метрики базі даних
  - Порт: 9090
  - Volume: prometheus_data:/prometheus
  
- **Grafana** - Наглядні панелі
  - Порт: 3001
  - Кредити: admin/admin
  - Volume: grafana_data:/var/lib/grafana
  
- **Node Exporter** - Сервер метрики
  - Порт: 9100
  - Збирає: CPU, RAM, Диск, Мережеві
  
- **cAdvisor** - Docker контейнери метрик
  - Порт: 8080
  - Збирає: CPU, Память, Мережеві контейнерів

#### **prometheus.yml** (⚙️ Prometheus конфіг)
- `scrape_configs` для:
  - Prometheus (самоспостереження)
  - Node Exporter (:9100)
  - cAdvisor (:8080)
  - PocketBase (опціонально)
- `evaluation_interval: 15s`
- `scrape_interval: 15s`

---

### 🟠 Виконавчі Скрипти

#### **startup.sh** (🚀 Запуск стека)
```bash
./startup.sh
```
- ✅ Перевіряє Docker
- ✅ Запускає docker-compose
- ✅ Чекає на послуги
- ✅ Показує статус всіх сервісів
- 🌐 Виводить URL-адреси

#### **load-test.sh** (🧪 Load тестування)
```bash
./load-test.sh [URL] [TEST_TYPE]

# Приклади:
./load-test.sh http://localhost:3000 light    # Легкий
./load-test.sh http://localhost:3000 medium   # Середній
./load-test.sh http://localhost:3000 heavy    # Важкий
./load-test.sh http://localhost:3000 spike    # Spike тест
```

---

## 🎯 Як Користуватися Цим Стеком

### 1️⃣ **Перший раз?** (Новачки)
1. Читай: **README.md**
2. Читай: **QUICK_START.md**
3. Запусти: `./startup.sh`
4. Розпочни: **MONITORING_GUIDE.md** (Модуль 1)

### 2️⃣ **Потрібні PromQL запити?**
- Перейди: **PROMQL_QUERIES.md**
- Копіюй приклади
- Тестуй у Prometheus'e
- Use in Grafana dashboards

### 3️⃣ **Telegram сповіщення не працюють?**
- Читай: **TELEGRAM_SETUP.md**
- Перевір: Bot Token
- Перевір: Chat ID
- Тестуй: Contact Point

### 4️⃣ **Хочеш протестувати навантаження?**
- Запусти: `./load-test.sh`
- Читай: **LOAD_TESTING.md**
- Смотри: Grafana dashboards
- Слухай: Telegram notification 🔔

### 5️⃣ **Розгортання в продакшн?**
- Читай: **DEPLOYMENT_CHECKLIST.md**
- Слідуй: Всім 7-ми етапам
- Перевір: Усі чек-боксы

---

## 📊 Служби та Порти

| Служба | Порт | URL | Вхідні дані |
|--------|------|-----|---------|
| **Prometheus** | 9090 | http://localhost:9090 | Без автентифікації |
| **Grafana** | 3001 | http://localhost:3001 | admin/admin |
| **Node Exporter** | 9100 | http://localhost:9100 | Без автентифікації |
| **cAdvisor** | 8080 | http://localhost:8080 | Без автентифікації |

---

## 📚 Рекомендуємий Порядок Читання

```
1. README.md (10 хв)
   ↓
2. QUICK_START.md (5 хв) + запусти стек
   ↓
3. MONITORING_GUIDE.md § 1-2 (50 хв)
   ↓
4. PROMQL_QUERIES.md (30 хв) + тестуй запити
   ↓
5. MONITORING_GUIDE.md § 3 (40 хв) + створюй панелі
   ↓
6. TELEGRAM_SETUP.md (30 хв) + налаштуй сповіщення
   ↓
7. LOAD_TESTING.md (30 хв) + запусти тести
   ↓
8. DEPLOYMENT_CHECKLIST.md (30 хв) + перевір все
```

**Загальний час:** ~225 хвилин (3.5 години)

---

## 🔧 Швидкі Команди

```bash
# Запуск стека
./startup.sh

# Перегляд логів
docker-compose logs -f prometheus
docker-compose logs -f grafana

# Зупинка стека
docker-compose down

# Перезапуск контейнера
docker-compose restart prometheus

# Load тест (легкий)
./load-test.sh http://localhost:3000 light

# Load тест (важкий - triggering alerts)
./load-test.sh http://localhost:3000 heavy
```

---

## ✅ Перевірка Встановлення

```bash
# Prometheus надається?
curl http://localhost:9090

# Grafana надається?
curl http://localhost:3001

# Targets в Prometheus?
curl http://localhost:9090/api/v1/targets

# Метрики?
curl 'http://localhost:9090/api/v1/query?query=up'
```

---

## 🎓 Обов'язкові Теми

### Prometheus
- Time series database
- Scraping метрики
- Retention policy
- Alert rules

### Grafana
- Data sources
- Dashboards
- Panels та типи візуалізацій
- Alert management

### PromQL
- Мгновенні пошуки (instant queries)
- Діапазонні пошуки (range queries)
- Агрегаційні функції
- Join операції

### Docker
- docker-compose файли
- Контейнерні об'єми
- Мережеві з контейнерів
- Lifecycle управління

---

## 🐛 Comuni Проблеми

| Проблема | Рішення |
|----------|---------|
| Prometheus не бачить cAdvisor | Перезапусти сервіси, перевір мережу |
| Grafana не підключається до Prometheus | URL має бути `http://prometheus:9090` |
| Telegram не одержує сповіщення | Перевір Bot Token, Chat ID, Contact Point |
| Load тест не запускається | Встанови Apache Benchmark: `brew install httpd` |

---

## 📞 Отримати Допомогу

1. **Читай документацію** - 95% відповідей там!
2. **Перевір логи**: `docker-compose logs`
3. **Графана UI** - Status → Targets для діагностики
4. **Prometheus UI** - Graph для пробування запитів

---

## 🎯 Наступні Кроки

Після завершення базового курсу:

- ✅ **Loki** для логів
- ✅ **Tempo** для distributed tracing
- ✅ **Alertmanager** для поккеденої логіки
- ✅ **Custom dashboards** для вашого бізнесу

---

**Насолоджуйся мониторингом!** 🚀

**Версія:** 2.0 | **Дата:** 2026-04-08 | **Стан:** ✅ Готово до використання
