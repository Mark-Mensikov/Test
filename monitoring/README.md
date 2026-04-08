# 📊 Monitooringu Stäkk 2026

Täielik ja professionaalne monitooringu infrastruktuuri lahendus Prometheus, Grafana, Node Exporter, cAdvisor ja Telegrami häireteenustega.

```
┌─────────────────────────────────────────────────────────────────┐
│                   MONITOORINGU ARHITEKTUUR                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐          │
│  │   Server    │  │  Konteinerid │  │   PocketBase   │          │
│  │  (hardware) │  │   (Docker)   │  │   (API)        │          │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────┘          │
│         │                │                    │                 │
│         │                │                    │                 │
│  ┌──────▼──────┐  ┌──────▼───────┐           │                 │
│  │Node Exporter│  │   cAdvisor   │           │                 │
│  │ :9100       │  │   :8080      │           │                 │
│  └──────┬──────┘  └──────┬───────┘           │                 │
│         │                │                    │                 │
│         └────────────────┼────────────────────┘                 │
│                          │                                       │
│                ┌─────────▼──────────┐                            │
│                │   PROMETHEUS       │                            │
│                │   (Metric DB)      │                            │
│                │   :9090            │                            │
│                └─────────┬──────────┘                            │
│                          │                                       │
│                ┌─────────▼──────────┐         ┌──────────────┐  │
│                │    GRAFANA         │────────▶│   Telegram   │  │
│                │   (Dashboards)     │         │   Alerts     │  │
│                │   :3001            │         └──────────────┘  │
│                └────────────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Failid ja Dokumentatsioon

| Fail | Kirjeldus |
|------|-----------|
| **QUICK_START.md** | 🚀 Kiire alustamine — 5 minuti jooksul setup |
| **MONITORING_GUIDE.md** | 📚 Täielik juhend 4 mooduliga |
| **prometheus.yml** | ⚙️ Prometheus konfiguratsioon |
| **docker-compose.yml** | 🐳 Docker stäkk (kogu infrastruktuur) |
| **PROMQL_QUERIES.md** | 📊 PromQL päringute kogu |
| **TELEGRAM_SETUP.md** | 📱 Telegrami häiresüsteemi seadistamine |
| **LOAD_TESTING.md** | 🧪 Load testing ja stress testing juhend |

---

## ⚡ Kiire Alustamine

### 1. Paigaldamine (docker-compose)

```bash
cd monitoring
docker-compose up -d
```

### 2. Teenused on kasutamisvalmis

- **Prometheus** → http://localhost:9090
- **Grafana** → http://localhost:3001 (admin/admin)
- **Node Exporter** → http://localhost:9100
- **cAdvisor** → http://localhost:8080

### 3. Andmeallikas Grafanasse

1. Ava Grafana
2. Connections → Data Sources → + Add
3. Prometheus URL: `http://prometheus:9090`

### 4. Dashboardide import

ID: **1860** (Node Exporter) + **14282** (cAdvisor)

---

## 🎯 Mooduli Kirjeldus

### 1️⃣ Stäkk Üles
Prometheus ja Grafana paigaldamine ja sidumine.
- 📖 Juhend: [MONITORING_GUIDE.md](MONITORING_GUIDE.md#paaristund-1-monitooringu-stäkk-üles)
- ⏱️ Kestus: 15-20 min

### 2️⃣ Meetrikate Kogumine
Node Exporter + cAdvisor seadistamine.
- 📖 Juhend: [MONITORING_GUIDE.md](MONITORING_GUIDE.md#paaristund-2-meetrikate-kogumine-põllult)
- ⏱️ Kestus: 20-30 min

### 3️⃣ Töölauad (Dashboards)
Grafana dashboardide loomine ja kohandamine.
- 📖 Juhend: [MONITORING_GUIDE.md](MONITORING_GUIDE.md#paaristund-3-inseneride-töölauad)
- 📊 PromQL referenss: [PROMQL_QUERIES.md](PROMQL_QUERIES.md)
- ⏱️ Kestus: 30-45 min

### 4️⃣ Häirenupp (Telegrami integratsioon)
Häiresüsteem koos Telegrami teavitustega.
- 📖 Seadistamine: [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md)
- 🧪 Testimine: [LOAD_TESTING.md](LOAD_TESTING.md)
- ⏱️ Kestus: 25-40 min

---

## 🗓️ Õppimise Ajakava

| Nädal | Maht | Teema | Failid |
|-------|------|-------|---------|
| 1 | 1000 min | Stäkk + Meetrikad | MONITORING_GUIDE (1-2) |
| 2 | 1200 min | Töölauad + PromQL | PROMQL_QUERIES, MONITORING_GUIDE (3) |
| 3 | 1500 min | Häirenupp + Telegram | TELEGRAM_SETUP |
| 4 | 1000 min | Load Testing | LOAD_TESTING |

---

## 🔍 Kummuli Metrikad

### Node Exporter (server riistvara)
- ✅ CPU kasutus
- ✅ RAM / Swap
- ✅ Ketta kasutus ja I/O
- ✅ Võrgu liiklus
- ✅ Tõrkuja (uptime)

### cAdvisor (Docker konteinerid)
- ✅ Konteineri CPU kasutus
- ✅ Konteineri mälu kasutus
- ✅ Netitöö I/O detailid
- ✅ Konteinerite arv
- ✅ Iga konteineri statsuga

### Grafana (visualiseerimine)
- ✅ Reaalajas graafikud
- ✅ Alert Rules
- ✅ Dashboard teemplate
- ✅ Telegram integratsioon

---

## 🚨 Alert Näited

### Reaalne Alert Rule

```promql
rate(container_cpu_usage_seconds_total[5m]) * 100 > 70
```

**Häire:** CPU kasutus üle 70%

### Mies Häiresignaal

```json
{
  "name": "PocketBase CPU Alert",
  "status": "FIRING",
  "value": "78.5%",
  "timestamp": "2026-04-08T14:32:00Z"
}
```

**Telegram teavitus:**
```
🚨 HÄIRE: PocketBase CPU ülekoormuse

CPU kasutus on ületanud 70%!
Hetke väärtus: 78.5%

🔗 Vaata: [Grafana Dashboard](http://grafana.local/d/...) 
```

---

## 📈 Jõudluse Optimiseerimine

### CPU kasutuse vähendamine

```promql
# Kontrolli Top 5 konteinerit
topk(5, rate(container_cpu_usage_seconds_total[5m])) * 100
```

### Mälu kasutuse vähendamine

```promql
# Suurimad mälu tarbiajad
topk(5, container_memory_usage_bytes) / 1024 / 1024 / 1024
```

---

## 🐛 Tõrkeotsing

### Prometheus ei näe cAdvisor'i

```bash
# Kontrolli Docker võrgu
docker network inspect monitoring-stack

# Taaskäivita cAdvisor
docker-compose restart cadvisor
```

### Grafana ei ühenda Prometheus'ele

**Probleem:** Data Source testi tulemus: "Error connecting to Prometheus"

**Lahendus:**
- URL peab olema sisenne: `http://prometheus:9090` (mitte `localhost`)
- Konteinerid peavad olema samas võrgus (Docker Compose teeb selle automaatselt)

### Telegrami häireid ei tule

1. ✅ Bot API Token on õige?
2. ✅ Chat ID on õige (algab `-100...`)?
3. ✅ Bot on grupp liige?
4. ✅ Test teavitus töötab?
5. ✅ Alert Rule on Enabled?

---

## 📚 Rohkem Infot

| Ressurss | Link |
|----------|------|
| **Grafana** | https://grafana.com/docs/ |
| **Prometheus** | https://prometheus.io/docs/ |
| **PromQL** | https://prometheus.io/docs/prometheus/latest/querying/basics/ |
| **k6 Load Gaming** | https://k6.io/docs/ |
| **Telegram Bot API** | https://core.telegram.org/bots/api |

---

## 🎓 Õppimise Järgmised Sammd

### Tase 2: Pildid ja Tracing

- [ ] **Grafana Loki** — Logi kogumine ja analüüs
- [ ] **Grafana Tempo** — Distributed tracing
- [ ] **OpenTelemetry** — Telemetriastandard

### Tase 3: Ennustamine

- [ ] **Machine Learning** paremuste ennustamiseks
- [ ] **Anomaalia tuvastamine**
- [ ] **SLO/SLI** seadistamine

---

## ✅ Kontrolljuhend

Enne juurutusele minekust kontrolli:

- [ ] Kõik konteinerid töötavad Docker-composes
- [ ] Prometheus näeb kõiki sihtmärke (Targets)
- [ ] Grafana näeb Prometheus'e andmeid
- [ ] Vähemalt üks dashboard on importeeritud
- [ ] Telegrami häiresüsteem on seadistatud
- [ ] Test häire jõuab Telegrami rühma

---

## 🚀 Planeerimine

**Edukaks monitooringusüsteemiks vaja:**

1. Osata PoQL-i kirjutada (30% ajast)
2. Saada teada metrikaid, mis muutujad (40% ajast)
3. Testada ja optimeerida häireid (30% ajast)

**Tulemus:** Professionaalne ja usaldusväärne monitooringusüsteem!

---

**Loodud:** 2026-04-08  
**Versioon:** 2.0  
**Olek:** ✅ Produktsioonivalmis
