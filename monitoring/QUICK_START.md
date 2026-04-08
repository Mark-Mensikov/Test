# Monitooringu Stäkk — Kiire Stardi Juhend

Samm-sammult juhend monitooringu paigaldamiseks ja käivitamiseks.

## ✅ Enne Algust: Kontrolljuhend

- [ ] Docker ja Docker Compose on installitud
- [ ] PocketBase on juba töötav
- [ ] Coolify on konfigureeritud (kui kasutad Coolify)
- [ ] Telegrami konto olemas
- [ ] Õigused serveri administreerimiseks

---

## 🚀 Kiire Start (5 minuti jooksul)

### 1. Docker-composega käivitamine (lokaalne)

```bash
# Liigu monitooringu kausta
cd /Users/konstantingavrin/Test/monitoring

# Käivita kogu stäkk
docker-compose up -d

# Kontrolli, et kõik konteinerid töötavad
docker-compose ps
```

**Oodatav väljund:**
```
NAME                COMMAND                  SERVICE             STATUS
prometheus          /bin/prometheus --config...  prometheus      Up 2 minutes
grafana             /run.sh                      grafana         Up 2 minutes
node-exporter       /bin/node_exporter ...       node-exporter   Up 2 minutes
cadvisor            /usr/bin/cadvisor            cadvisor        Up 2 minutes
```

### 2. Juurdepääs teenustele

| Teenus | Aadress | Vaikimisi login |
|--------|---------|-----------------|
| **Prometheus** | http://localhost:9090 | Avalik |
| **Grafana** | http://localhost:3001 | admin / admin |
| **Node Exporter** | http://localhost:9100 | Avalik |
| **cAdvisor** | http://localhost:8080 | Avalik |

### 3. Prometheus-e konfigureerimine

1. Ava http://localhost:9090
2. Mine **Status → Targets**
3. Kontrolli, et kõik on **UP** (roheline)

**Kui mõni on DOWN:**
```bash
# Taaskäivita Prometheus
docker-compose restart prometheus

# Kontrolli logisid
docker-compose logs prometheus
```

### 4. Grafana andmeallikas

1. Ava http://localhost:3001
2. Logi sisse: `admin` / `admin`
3. Mine **Connections → Data Sources**
4. Klõpsi **+ Add new data source** → **Prometheus**
5. URL: `http://prometheus:9090`
6. Salvesta ja testa

---

## 🎨 Dashboardide Importimine

### Valmistaasid Dashboardid

1. Grafanas: **Dashboards → Import**
2. Sisesta ID ja klõpsi Load:

| ID | Nimi |
|----|------|
| **1860** | Node Exporter — Server hardware full |
| **14282** | cAdvisor — Konteineri meetrikad |

3. Vali Data Source: **Prometheus**
4. Impordi

---

## 📱 Telegrami Häiresüsteem

### Lühike seadistamine

1. **Loo Telegram bot** (@BotFather):
   - Käsk: `/newbot`
   - Kopeeri Bot Token

2. **Loo grupp ja hangi Chat ID**:
   - Loo grupp ("SaaS Monitoring Alerts")
   - Lisa bot gruppi
   - Käsk URL: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Otsi Chat ID

3. **Grafana Contact Point**:
   - **Alerting → Contact Points → New contact point**
   - Tüüp: **Telegram**
   - Token: `<BOT_TOKEN>`
   - Chat ID: `<CHAT_ID>`
   - Salvesta

### Alerting Rule — CPU ülekoormuse tuvastamine

1. **Alerting → Alert Rules → New alert rule**
2. **PromQL:**
   ```promql
   rate(container_cpu_usage_seconds_total[5m]) * 100 > 70
   ```
3. **Evaluate:** `1m` | **For:** `1m`
4. **Action: Notification**
   - Vali Contact Point: **Telegram Bot**
5. Salvesta

---

## 🧪 Load Testing

### Kerge test (pole häireid)

```bash
ab -n 5000 -c 50 http://pocketbase.local/
```

### Raske test (peaks häireid käivitama)

```bash
k6 run - <<'EOF'
import http from 'k6/http';
export let options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '1m', target: 0 },
  ],
};
export default function () {
  http.get('http://pocketbase.local/');
}
EOF
```

---

## 🔧 Tõrkeotsing

### Prometheus ei näe cAdvisor'i

**Probleem:** Targets lehel cAdvisor on **DOWN**

**Lahendus:**
```bash
# Kontrolli, et konteinerid on samas võrgus
docker network ls
docker network inspect monitoring-stack

# Uuesti käivita
docker-compose restart cadvisor
```

### Grafana ei ühenda Prometheus'ele

**Lahendus:**
1. Kontrolli, et Prometheus töötab: http://localhost:9090
2. Grafana Data Source URL peab olema **siseselt**: `http://prometheus:9090`
3. Kui see on väliselt, kasuta: `http://host.docker.internal:9090` (macOS)

### Telegrami häireid ei tule

**Kontrolljuhend:**
1. ✅ Bot on grupp liige?
2. ✅ API Token on õige?
3. ✅ Chat ID on õige (algab `-100...`)?
4. ✅ Alert Rule on **Enabled**?
5. ✅ Contact Point test töötab?

---

## 📚 Linkid ja Dokumentatsioon

| Ressurss | Link |
|----------|------|
| **PromQL** | https://prometheus.io/docs/prometheus/latest/querying/basics/ |
| **Grafana** | https://grafana.com/docs/ |
| **Telegram Bot API** | https://core.telegram.org/bots/api |
| **k6 Dokumentatsioon** | https://k6.io/docs/ |

---

## 📊 Järgmine Samm

Kui kõik töötab, võid teha:

1. **Custom Dashboard'ide loomine** PromQL-iga
2. **SLO-de defineerimine** ja seiskamine
3. **Logi kogumine** Grafana Lokiga
4. **Distributed Tracing** Grafana Tempoga

---

## 🎯 Õppimise Ajakava

| Nädal | Modulid |
|-------|---------|
| **1. nädal** | Stäkk üles + meetrikate kogumine |
| **2. nädal** | Töölauad (dashboards) + PromQL |
| **3. nädal** | Häirenupp ja Telegrami häireid |
| **4. nädal** | Load testing ja optimimine |

---

Edu monitooringu seadistamisega! 🚀
