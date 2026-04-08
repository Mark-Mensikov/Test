# 📋 Monitooringu Stäkk — Juurutamise Kontrolljuhend

Kontrolljuhend Prometheus, Grafana, Node Exporter, cAdvisor ja Telegrami häirete juurutamiseks.

## ✅ Etapp 1: Enne Algust

### Vajalikud komponendid

- [ ] Docker on installitud (`docker --version`)
- [ ] Docker Compose on installitud (`docker-compose --version`)
- [ ] PocketBase on juba käimas
- [ ] Telegrami konto (bot loomine)
- [ ] Administraatoriõigused serverisse

### Kontrolli

```bash
# Kontrolli Docker'it
docker --version
docker ps

# Kontrolli Docker Compose'i
docker-compose --version

# Kontrolli, et teie PocketBase on käimas
curl http://localhost:8090
```

---

## ✅ Etapp 2: Monitooringu Stäkk — Lokaalne Käivitamine

### 2.1 Docker Compose käivitamine

```bash
cd monitoring
docker-compose up -d
```

### 2.2 Teenuste olek

- [ ] Prometheus on UP (`docker-compose ps | grep prometheus`)
- [ ] Grafana on UP (`docker-compose ps | grep grafana`)
- [ ] Node Exporter on UP
- [ ] cAdvisor on UP

**Kontrolli:**
```bash
docker-compose ps
```

**Kõik peavad arvama ON "Up"**

### 2.3 Juurdepääs teenustele

- [ ] Prometheus: http://localhost:9090 (külasta)
- [ ] Grafana: http://localhost:3001 (logi sisse admin/admin)
- [ ] Node Exporter: http://localhost:9100 (külasta)
- [ ] cAdvisor: http://localhost:8080 (külasta)

---

## ✅ Etapp 3: Prometheuse Konfigureerimine

### 3.1 Kontrolli konfiguratsiooni

1. Ava Prometheus: http://localhost:9090
2. Mine **Status → Configuration**
3. Kontrolli, et `scrape_configs` sisaldab:
   - `node` (Node Exporter)
   - `containers` (cAdvisor)

### 3.2 Kontrolli sihtmärke

1. Mine **Status → Targets**
2. Kõik peavad olema **UP** (rohelised)

**Kui mõni on DOWN:**
```bash
# Taaskäivita
docker-compose restart prometheus

# Kontrolli logisid
docker-compose logs prometheus
```

---

## ✅ Etapp 4: Grafana Seadistamine

### 4.1 Andmeallikas (Data Source)

1. Ava Grafana: http://localhost:3001
2. Logi sisse: `admin` / `admin`
3. Mine **Connections → Data Sources → + Add data source**
4. Tüüp: **Prometheus**
5. URL: `http://prometheus:9090`
6. Klõpsi **Save & Test**
   - [ ] Testi tulemus on roheline ("Data source is working")

### 4.2 Dashboardide import

1. Mine **Dashboards → + New → Import**
2. Sisesta ID: **1860** (Node Exporter)
   - [ ] Impordi edukalt
3. Sisesta ID: **14282** (cAdvisor)
   - [ ] Impordi edukalt

**Kontrolli:**
- [ ] Graafikud näevad andmeid (mitte tühje)
- [ ] Graafikud värskendavad reaalajas

---

## ✅ Etapp 5: Telegrami Häire Seadistamine

### 5.1 Telegrami Bot

- [ ] Bot loodud (@BotFather `/newbot`)
- [ ] Bot API Token kopeeritud
- [ ] Grupp loodud ("SaaS Monitoring Alerts")
- [ ] Bot lisatud gruppi
- [ ] Chat ID hanget (`/getUpdates` API kaudu)

### 5.2 Grafana Contact Point

1. Mine Grafana **Alerting → Contact Points → New contact point**
2. Nimi: "Telegram Bot"
3. Tüüp: **Telegram**
4. **Bot Token:** `<YOUR_BOT_TOKEN>`
5. **Chat ID:** `<YOUR_CHAT_ID>`
6. Klõpsi **Send test notification**
   - [ ] Telegrami grupp sai testiteavituse
7. Salvesta
   - [ ] Contact Point ilmub nimekirja

### 5.3 Alert Rule — CPU Ülekoormuse Häire

1. Mine **Alerting → Alert Rules → New alert rule**
2. Nimi: "PocketBase CPU Ülekoormuse Häire"
3. **PromQL päring:**
   ```promql
   rate(container_cpu_usage_seconds_total[5m]) * 100 > 70
   ```
4. **Evaluate every:** 1m
5. **For:** 1m
6. **Action: Set notification**
   - Vali Contact Point: **Telegram Bot**
7. Salvesta
   - [ ] Alert Rule on nähtav "Alerting → Alert Rules" all

---

## ✅ Etapp 6: Load Testing

### 6.1 Apache Benchmark paigaldamine

**macOS:**
```bash
brew install httpd
```

**Linux:**
```bash
sudo apt-get install apache2-utils
```

- [ ] `ab --version` töötab

### 6.2 Kerge test (pole häireid)

```bash
./load-test.sh http://localhost:3000 light
```

**Kontrolli:**
- [ ] Test läbib ilma vigadeta
- [ ] Grafana CPU graafik tõuseb veidi

### 6.3 Keskmise koormusega test

```bash
./load-test.sh http://localhost:3000 medium
```

**Kontrolli:**
- [ ] CPU graafik tõuseb märgatavalt (40-60%)

### 6.4 Raske test (triggib häireid)

```bash
./load-test.sh http://localhost:3000 heavy
```

**Kontrolli:**
- [ ] CPU graafik tõuseb >70%
- [ ] ⏱️ Oota ~1 minut
- [ ] ✅ Telegrami grupp sai häireteavituse
- [ ] Grafana Alert Rule näitab "FIRING"

---

## ✅ Etapp 7: Coolify Juurutamine

### 7.1 Prometheus Coolifys

1. Ava Coolify halduspaneel
2. **New Service → Prometheus**
3. Määra Port: **9090**
4. Määra Volume: `/prometheus`
5. Käivita
   - [ ] Teenus on "Running"

### 7.2 Grafana Coolifys

1. **New Service → Grafana**
2. Määra Port: **3000** (või oma soov)
3. Määra Volume: `/var/lib/grafana`
4. Käivita
   - [ ] Teenus on "Running"

### 7.3 Node Exporter Coolifys

1. **New Service → Node Exporter**
2. Määra Port: **9100**
3. Käivita
   - [ ] Teenus on "Running"

### 7.4 cAdvisor Coolifys

1. **New Service → cAdvisor**
2. Määra Port: **8080**
3. Käivita
   - [ ] Teenus on "Running"

### 7.5 Võrgutoimik

- [ ] Kõik teenused on **samas projektis** (võrgus)
- [ ] Prometheus URL Grafanas: `http://prometheus:9090`

---

## ✅ Finali Kontrolljuhend

### Teenuste kontrollimine

```bash
# Kõik konteinerid elus?
docker-compose ps

# Prometheus töötab?
curl http://localhost:9090

# Grafana töötab?
curl http://localhost:3001

# Andmeid? (Prometheus peaksid andmeid koguma)
curl 'http://localhost:9090/api/v1/query?query=up'
```

### Dokumentatsiooni kontrollimine

- [ ] README.md on kirjutatud
- [ ] QUICK_START.md on saadaval
- [ ] MONITORING_GUIDE.md on täielik
- [ ] PROMQL_QUERIES.md sisaldab näiteid
- [ ] TELEGRAM_SETUP.md on taisnud
- [ ] LOAD_TESTING.md on taisnud

### Doka kontrollimine

- [ ] startup.sh skript on käivitatav
- [ ] load-test.sh skript on käivitatav

---

## 📊 Oodatavad Tulemused

| Kontroll | Oodatav | Tegelik |
|----------|---------|---------|
| Prometheus on UP | ✅ | __ |
| Grafana on UP | ✅ | __ |
| Node Exporter on sihtkohana UP | ✅ | __ |
| cAdvisor on sihtkohana UP | ✅ | __ |
| Dashbordid näevad andmeid | ✅ | __ |
| Telegrami häire töötab | ✅ | __ |
| Load test käivitub | ✅ | __ |

---

## 🚨 Häirete Kontrolljuhend

### Häire 1: CPU ülekoormuse häire

**Trigger:**
```bash
./load-test.sh http://localhost:3000 heavy
```

**Oodatav:**
- Grafana näitab CPU >70%
- ~1 min pärast Telegram saab häire

**Kui ei tule:**
1. Kontrolli Alert Rule olekut (Enabled?)
2. Kontrolli PromQL päringut
3. Kontrolli Contact Pointi testi

### Häire 2: Mälu ülekoormuse häire

**Alert Rule:**
```promql
(container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100 > 85
```

- [ ] Häire Rule on loodud
- [ ] Kontakt Punkt on määratud
- [ ] Test käivitus töötas

---

## 📚 Dokumentatsiooni Failid

| Fail | Otstarbeks |
|------|-----------|
| **README.md** | 📖 Ülevaade |
| **QUICK_START.md** | 🚀 5-minutiline alustamine |
| **MONITORING_GUIDE.md** | 📚 4 mõõdulit: stäkk, meetrikad, töölauad, häireid |
| **PROMQL_QUERIES.md** | 📊 PromQL näited |
| **TELEGRAM_SETUP.md** | 📱 Telegrami häire seadistamine |
| **LOAD_TESTING.md** | 🧪 Load testing juhend |

---

## ✅ Juurutamise Märksõnad

- [ ] Lokaalne test käinud edukalt
- [ ] Docker Compose failid on valmis
- [ ] prometheus.yml on seadistatud
- [ ] Coolify teenused on loodud
- [ ] Telegrami häire on konfigureeritud
- [ ] Load test on testitud
- [ ] Dokumentatsioon on kirjutatud
- [ ] Kontrolljuhend on läbitud

---

## 🎯 Järgmised Sammd

1. **Esimene nädal:** Stäkk + Meetrikad kogus tõendid
2. **Teine nädal:** Töölauad + PromQL harjutused
3. **Kolmas nädal:** Telegrami häireid + kohandused
4. **Neljas nädal:** Load testing + jõudluse optimmistk

---

**Loodud:** 2026-04-08  
**Versioon:** 1.0  
**Olek:** ✅ Juurutamisvalmis
