# Telegrami Häiresüsteemi Seadistamine

Põhjalik juhend Telegrami häiresüsteemi integreerimiseks Grafanaga ja häirete konfigureerimine.

## 📱 Samm 1: Telegrami Boti Loomine

### 1.1 BotFather'i kontakteeramine

1. Ava Telegram rakendus või veebiversioon
2. Otsi `@BotFather` (ametlik Telegrami bot admin)
3. Klõpsi **Start** nuppu

### 1.2 Uue boti looming

1. Saada käsk: `/newbot`
2. BotFather küsib sinult **nime botile** (kasutusjuhisandatus):
   - Näiteks: `PocketBase Monitoring Bot`
3. Seejärel küsib **kasutajanime** (peavad olema ainult tähted ja numbrid):
   - Näiteks: `pocketbase_monitor_bot`
   - **OLULINE:** Kasutajanimi peab lõppema `_bot`-iga

### 1.3 Bot API Token'i kopeerimine

BotFather saadab sinule sõnumi:
```
🎉 Done! Congratulations on your new bot. You will find it at t.me/pocketbase_monitor_bot. You can now add a description, about section and profile picture for your bot, see `/help` for a list of commands.

Use this token to access the HTTP API:
1234567890:ABCdEfGhIJKlmNoPqRsTuVwXyZ1234567890
```

✅ **Kopeeri see Token** — seda läheb Grafanasse!

---

## 📍 Samm 2: Telegrami Grupi Loomine ja Chat ID Hankimine

### 2.1 Uue grupi loomine

1. Klõpsi Telegrami vasaku paaneli **pencil** ikoonil
2. Vali **New Group**
3. Anna grupile nimi, näiteks: `SaaS Monitoring Alerts 2026`
4. Lisa bott gruppi:
   - Klõpsi grupis **Add members**
   - Otsi oma botti (@pocketbase_monitor_bot)
   - Lisa see grupp

### 2.2 Chat ID hankimine

Chat ID-d saad hankida kahel viisil:

#### Meetod A: API kaudu (kiireim)

1. Ava brauser ja võri:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Asenda `<YOUR_BOT_TOKEN>` oma API token'iga.

2. Saada grupis sõnum: "test" või mis tahes sõnum
3. Laadi URL uuesti
4. Otsi vastusest **Chat ID** (näeb välja selline):
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 1,
        "chat": {
          "id": -1001234567890,  // <-- OLE SEE!
          "title": "SaaS Monitoring Alerts 2026",
          "type": "supergroup"
        },
        ...
      }
    }
  ]
}
```

**Komplekssus:** Chat ID algab tavaliselt miinusega (`-100...`)

#### Meetod B: Boti kaudu (alternatiiv)

1. Lisa grupp bot `/chatid` käsk
2. Bot vastab groupi Chat ID-ga

---

## ⚙️ Samm 3: Grafana Contact Pointi Seadistamine

### 3.1 Contact Point loomine

1. Ava Grafana: `http://localhost:3001`
2. Logi sisse (vaikimisi kasutaja: `admin`, parool: `admin`)
3. Mine vasakus menüüs: **Alerting** → **Contact Points**
4. Klõpsi **+ New contact point**

### 3.2 Telegram konfigureerimine

Täida järgmised väljad:

| Field | Väärtus |
|-------|---------|
| **Name** | Telegram Bot (või muu nimi) |
| **Integration** | Telegram |
| **Bot Token** | Sinu API token (1234567890:ABCdEf...) |
| **Chat ID** | Grupi Chat ID (-1001234567890) |

### 3.3 Ühenduse testimine

1. Klõpsi **Send test notification**
2. Vaata Telegrami rühma
3. ✅ Kui saad testiteavituse, on ühendus õige!

```
[FIRING] Test Notification
This is a test notification from Grafana.
Labels: alertname="Test"
```

### 3.4 Contact Pointi salvestamine

1. Klõpsi **Save contact point**
2. Näed seda nimekirjas tulevikus kasutamiseks

---

## 🔔 Samm 4: Alert Rule'i Loomine

### 4.1 Uue häireegli loomine

1. Mine **Alerting** → **Alert Rules**
2. Klõpsi **+ Create alert rule**
3. Anna reglile nimi ja kirjeldus:
   - Nimi: `PocketBase CPU Ülekoormuse Häire`
   - Kirjeldus: `Saadab häire, kui CPU kasutus ületab 70% ühe minuti jooksul`

### 4.2 Query konfigureerimine

**PromQL päring:**
```promql
rate(container_cpu_usage_seconds_total{name="pocketbase"}[5m]) * 100 > 70
```

**Andmeallikas:** Prometheus (varem seadistatud)

### 4.3 Tingimuste seadistamine

**Evaluate every:** 1m (kontrolli iga minuti tagant)
**For:** 1m (lootus peab püsima 1 minut enne häire saatmist)

### 4.4 Tegevused ja teavitused

1. Klõpsi **+ Add action**
2. Vali **Perform these steps if alert fires:**
3. Klõpsi **Set notification**
4. Vali eelnevalt loodud Contact Point: **Telegram Bot**
5. Sisesta teade:
```
🚨 HÄIRE: PocketBase CPU Ülekoormuse

CPU kasutus on ületanud 70%!
Hetke väärtus: {{ .Annotations.value }}

Brauserid: http://grafana.local/d/dashboard-id
```

---

## 🧪 Samm 5: Häire Testimine

### 5.1 Lihtne test (teativte sõnum)

1. Häire panemiseks, klõpsi Alert Rule küljel **More** → **Send test alert**
2. Valitud Contact Point saab testiteavituse
3. Telegrami grupp peaks saama testiteavituse!

### 5.2 Reaalne test — CPU koormus

**Lokaalselt (macOS/Linux):**

```bash
# k6 kasutades
brew install k6

# Käivita load test
k6 run - <<EOF
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
EOF
```

**Või Apache Benchmark:**

```bash
# Paigalda (macOS)
brew install httpd

# Käivita 10 000 samaaegse taotlusega
ab -n 10000 -c 100 http://localhost:3000/
```

### 5.3 Tulemuste jälgimine

1. **Grafana:** Ava CPU dashboard ja jälgi graafiku tõusmist
2. **Telegram:** Oota 1-2 minutit — grupp peaks saama testiteavituse!
3. **Prometheus:** Mine Status → Targets ja kontrolli, kas cAdvisor kogub andmeid

---

## 📋 Alert Rule Näited

### 1. Mälu ülekoormuse häire

```promql
(container_memory_usage_bytes{name="pocketbase"} / container_spec_memory_limit_bytes{name="pocketbase"}) * 100 > 85
```

**Teade:**
```
💾 HÄIRE: Mälu kasutus KÕRGEL

PocketBase on kasutanud rohkem kui 85% RAM-ist!
Hetke väärtus: {{ .Annotations.value }}
```

### 2. Teenuse mahasoleku häire

```promql
up{job="containers", name="pocketbase"} == 0
```

**Teade:**
```
⚠️ KRIITILINE: PocketBase teenus on MAAS

Teenus ei vasta ping'ile. Kontrolli koheselt!
Näed: http://grafana.local/alerting/list
```

### 3. Ketta ruumi häire

```promql
(node_filesystem_size_bytes{fstype="ext4"} - node_filesystem_avail_bytes{fstype="ext4"}) / node_filesystem_size_bytes{fstype="ext4"} * 100 > 80
```

### 4. Võrgu I/O häire

```promql
rate(container_network_transmit_bytes_total{name="pocketbase"}[5m]) > 104857600
```

(> 100 MB/s)

---

## 🐛 Tõrkeotsing

### Telegram ei saa teavitusi

**Probleem:** Contact Point test läbib, kuid häired ei jõua rühma

**Lahendused:**
1. ✅ Kontrolli, et bot on grupp liige
2. ✅ Kontrolli Chat ID (peab algama `-100...`)
3. ✅ Kontrolli, et Alert Rule on **Enabled**
4. ✅ Kontrolli PromQL päringut — vaata Prometheus'es, kas see toimib
5. ✅ Kontrolli Alert Rule seadistuse: `Evaluate every` ja `For` väärtused

### Bot API Token on vale

**Teade:** `Error: Unauthorized`

**Lahendus:**
1. Ava BotFather (@BotFather)
2. Saada `/mybots`
3. Vali oma bot
4. Vali `/restart`
5. Hangi uus token'i ja asenda Grafanas

### Häiresignaalid on vale

**Probleem:** CPU näitaja näeb välja valesti

**Lahendus:**
1. Kontrolli PromQL päringut otseselt Prometheus'es
2. Kontrolli, et cAdvisor töötab: `docker ps | grep cadvisor`
3. Kontrolli, et konteinerite nimed on õiged
4. Kontrolli Alert Rule `Evaluate every` ja `For` intervalle

---

## 📚 Täiendav Dokumentatsioon

- **Grafana Alerting:** https://grafana.com/docs/grafana/latest/alerting/
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **PromQL:** https://prometheus.io/docs/prometheus/latest/querying/

---

**Testi häireid regulaarselt!** Häiresüsteem võib vales välistoimingul käituda ootamatult.
