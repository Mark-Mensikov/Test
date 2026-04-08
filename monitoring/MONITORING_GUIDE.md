# Monitooringu stäkk 2026

Praktiline neljaosaline kursus, mis viib sind samm-sammult läbi tänapäevase monitooringu infrastruktuuri ülesseadmise. Õpid käivitama Prometheus ja Grafana keskkonnas Coolify, koguma meetrikaid riistvaralt ja konteineritelt, looma professionaalseid töölaudu ning seadistama automaatse häiresüsteemi koos Telegrami teavitustega.

## 📋 Modulid

### 01 - Stäkk üles
Prometheus ja Grafana paigaldamine ning omavaheline sidumine Coolify keskkonnas.

### 02 - Meetrikate kogumine  
Node Exporter ja cAdvisor seadistamine — andmed riistvaralt ja Dockeri konteineritelt.

### 03 - Töölauad
Grafana dashboardide importimine ja kohandamine PromQL-päringutega.

### 04 - Häirenupp
Koormustest k6 või ab tööriistaga ning Telegrami häiresüsteemi aktiveerimine.

### 05 - oAuth, Stripe ja turvatestid ⚠️
NB! Kellel veel ei ole tehtud, peab lisama Stripe'i ja OAuthi. Samuti tuleb jälgida, et kõikide sõltuvuste (näiteks Node.js) versioonid oleksid ajakohased. Viige läbi turvaaudit ja tuvastage potentsiaalsed nõrgad kohad. Kõik see tuleb panna kirja dokumentatsiooni!

---

## Paaristund 1️⃣: Monitooringu stäkk üles

Esimese paaristunni eesmärk on käivitada Prometheus ja Grafana Coolify platvormis ning need kaks teenust omavahel siduda. Pärast selle tunni läbimist on sul töötav monitooringuplatvorm, mis on valmis andmeid vastu võtma.

### Installeerimine Coolifys

1. Ava Coolify halduspaneel
2. Loo kaks eraldi teenust:
   - **Vali New Service → otsi mallist Prometheus**
   - **Loo teine teenus, kasutades Grafana malli**
3. Veendu, et mõlemad teenused on **ühes ja samas võrgus (network)**
4. Käivita mõlemad teenused ja oota, kuni staatus muutub **Running**

### Grafana ja Prometheuse sidumine

Kui mõlemad teenused töötavad, ava **Grafana veebibrauser** ja tee järgmised sammud:

1. Mine **Connections → Data Sources**
2. Vali **Add data source → vali Prometheus**
3. Sisesta ühenduse URL: **`http://prometheus:9090`**
4. Vajuta **Save & Test**

✅ **Kui nupp muutub roheliseks** ja ilmub teade *"Data source is working"*, on ühendus edukalt loodud.

❌ **Punane teavitus** tähendab võrguprobleemi — kontrolli konteinerite võrku Coolifys.

> 💡 **Oluline:** Prometheuse sisemise aadressi kasutamine (`http://prometheus:9090`) töötab ainult siis, kui mõlemad konteinerid asuvad samas Dockeri võrgus. Coolify loob selle automaatselt, kui teenused on loodud sama projekti alla. Välise IP-aadressi kasutamine ei ole soovitatav, kuna see tekitab turvaauke ja võib lõpetada töö pärast konteinerite taaskäivitamist.

---

## Paaristund 2️⃣: Meetrikate kogumine "põllult"

Monitooringuplatvorm on kasutu ilma andmeteta. Teises paaristunnis seadistame kaks olulist eksportijat (exporter), mis koguvad andmeid otse serverist ja Dockeri konteineritelt. Pärast selle tunni läbimist näed Prometheuses reaalajas, kui palju RAM-i ja CPU-d sinu teenused tarbivad.

### Node Exporter — serveri silm

Juuruta Coolifys **Node Exporter** teenus. See komponent kogub hosti tasandi meetrikaid:
- CPU kasutus
- RAM
- Kettaruum
- Võrguliiklus

ℹ️ Kõik andmed muutuvad kättesaadavaks aadressil **`node-exporter:9100`**

### cAdvisor — konteinerite silm

Juuruta **cAdvisor** (Container Advisor). See näeb iga Dockeri konteinerit eraldi — sh PocketBase'i ja frontendi ressursikasutust.

ℹ️ Kuulab pordil **`cadvisor:8080`**

### Prometheus.yml seadistamine

Lisa Prometheuse konfiguratsioonifaili kaks uut sihtmärki (scrape target), et Prometheus hakkaks andmeid koguma mõlemalt eksportijalt automaatselt.

#### Scrape Config — prometheus.yml

Ava Prometheuse konfiguratsioonifail ja lisa `scrape_configs` sektsiooni järgmised kaks plokki. Need plokid ütlevad Prometheusele, kust ja kui tihti andmeid koguda:

```yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'containers'
    static_configs:
      - targets: ['cadvisor:8080']
```

### Konfiguratsiooni rakendamine

1. Pärast faili salvestamist **taaskäivita Prometheuse konteiner** Coolifys
2. Muudatused rakenduvad automaatselt pärast taaskäivitust
3. 📌 **Vaikimisi scrape intervall on 15 sekundit** — see tähendab, et Prometheus küsib iga 15 sekundi tagant uusi andmeid mõlemalt sihtmärgilt

### Kontrollimine: Status → Targets

1. Ava Prometheuse veebibrauser
2. Mine **Status → Targets**
3. Näed nimekirja kõigist seadistatud sihtmärkidest
4. **Kõik peavad olema olekus UP** (roheline)

**Kui mõni on DOWN, kontrolli:**
- ✅ Kas konteiner töötab Coolifys?
- ✅ Kas konteinerid on samas Dockeri võrgus?
- ✅ Kas pordinumber on õige?

---

## Paaristund 3️⃣: Inseneride töölauad

Kolmandas paaristunnis muudame rohtunud meetrikaandmed visuaalselt arusaadavateks juhtimiskeskusteks. Grafana võimaldab importida eelnevalt valmistatud töölaudu laiast kogukonnast ning luua kohandatud paneele oma ärimeetrikate jaoks. Siin tutvud ka PromQL-i päringkeelega, mis on Prometheuse südameks.

### Valmis töölaudade importimine

Mine Grafanas **Dashboards → Import** ja sisesta järgmised kogukonna ID-d:

#### ID: 1860 — Node Exporter Full
Serveri RAM, CPU, kettaruum kõik ühes vaates

#### ID: 14282 — cAdvisor
Konteinerite ressursikasutus, mälu ja CPU konteinerite kaupa

**Pärast importimist:**
1. Vali andmeallikaks (Data Source) eelnevalt seadistatud **Prometheus**
2. Dashboard täitub koheselt reaalajas andmetega

### Oma paneeli loomine PromQL-iga

1. Loo tühi uus Dashboard
2. Lisa esimene paneel:
   - Vali **+ Add panel**
   - Kirjuta Query väljale oma esimene PromQL-päring
   - Vali visualisatsioonitüübiks **Time series**
   - Anna paneelile kirjeldav pealkiri ja salvesta

#### Näited PromQL-päringutest

**PocketBase'i mälukasutuse kuvamiseks:**
```promql
container_memory_usage_bytes{
  name="pocketbase-konteineri-nimi"
}
```

**CPU kasutus protsendina:**
```promql
rate(container_cpu_usage_seconds_total[5m]) * 100
```

**Teenuse tööaeg (üles/alla):**
```promql
up{job="containers"}
```

**Mälu kasutusprotsent:**
```promql
container_memory_usage_bytes / container_spec_memory_limit_bytes * 100
```

### Ärimeetrikad — mis tegelikult loeb

Tehnilised meetrikad on vajalikud, kuid päris juhtimiskeskus sisaldab ka ärimeetrikaid. Need näitavad, kas sinu teenus tegelikult toimib kasutajate jaoks — mitte ainult kas server on elus.

#### HTTP-päringute arv
Kui PocketBase väljastab HTTP-meetrikaid, saad kuvada päringute arvu ajaühiku kohta. See näitab reaalkasutuse trende — kas kasutajate arv kasvab või on olnud katkestus.

#### Teenuse tööaeg (uptime)
PromQL-funktsioon `up{job="containers"}` annab väärtuse:
- **1** = töötab ✅
- **0** = maas ❌

Lihtne, kuid kriitiliselt oluline paneel igas juhtimiskeskuses.

#### Mälu ja CPU kasutusprotsent
Absoluutarv baitides on raske tõlgendada. Kasuta PromQL-i, et arvutada protsent:
```promql
(container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100
```

---

## Paaristund 4️⃣: Koormustest ja häirenupp

Viimases paaristunnis pannakse kogu süsteem proovile. Seadistame Telegrami häiresüsteemi, loome reegli CPU ülekoormuse tuvastamiseks ja korraldame simuleeritud "rünnaku" oma PocketBase'i teenuse vastu. Finaalivisioon: graafik tõuseb, ületab punase joone ja kogu meeskonna Telegram hakkab helisema.

### Telegrami boti loomine

Enne Grafana seadistamist loo Telegram bot:

1. Ava **Telegram** ja otsi **@BotFather**
2. Saada käsk **/newbot**
3. Anna botile nimi ja kasutajanimi
4. **Kopeeri saadud Bot API Token** — see läheb Grafanasse
5. **Loo grupp, lisa bot sinna ja hangi Chat ID**

💡 Chat ID saad, kui saadad gruppi sõnumi ja küsid seejärel:
```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

### Contact Point Grafanas

1. Mine Grafanas **Alerting → Contact Points → New contact point**
2. Vali tüübiks **Telegram**
3. Sisesta **Bot API Token**
4. Sisesta **Chat ID**
5. Vajuta **Test** — Telegrami grupp peaks saama testiteavituse
6. Salvesta **contact point**

### Alert Rule — CPU ülekoormuse tuvastamine

Mine **Alerting → Alert Rules → New alert rule** ja loo reegel:

**Kui PocketBase'i CPU kasutus ületab 70% ühe järjestikuse minuti jooksul, saadab süsteem automaatse häire** eelnevalt seadistatud Contact Pointi kaudu.

```promql
rate(container_cpu_usage_seconds_total{name="pocketbase-konteineri-nimi"}[5m]) * 100 > 70
```

### Koormustest — süsteem "katki teha"

Häirereegel on seadistatud — nüüd tuleb see päriselt käivitada. Laadi alla koormustest tööriist ja pommita oma PocketBase'i teenust tuhande samaaegse päringuga.

#### Tööriista allalaadimine

**macOS:**
```bash
brew install apache2-utils
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-get install apache2-utils
```

**k6 allalaadimine (alternatiiv):**
```bash
brew install k6
```

#### Rünnaku käivitamine Apache Benchmarkiga (ab)

```bash
ab -n 10000 -c 100 http://sinu-pocketbase-url/
```

**Parameetrite selgitus:**
- `-n 10000` = saada 10 000 päringut
- `-c 100` = 100 päringut korraga (concurrent)

#### Rünnaku käivitamine k6-ga

```bash
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
  let res = http.get('http://sinu-pocketbase-url/');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
EOF
```

### Tulemuste jälgimine

1. **Ava Grafana suurele ekraanile** ja vaata oma CPU dashboard
2. **CPU graafik hakkab tõusma** — näed reaalkasutust
3. **Punane häirejoon läheneb** — oota hetk
4. ⚡ **Minuti pärast saab kogu meeskond Telegrami grupi teavituse**

✅ **Automaatne monitooring töötab!**

---

## 📚 Kokkuvõte ja järgmised sammud

Oled nüüd seadistanud **täieliku tootmistaseme monitooringu infrastruktuuri**. Sinu stäkk sisaldab:

| Komponent | Funktsioon |
|-----------|-----------|
| **Prometheus** | Meetrikate kogumine ja säilitamine ajaseeria andmebaasis |
| **Grafana** | Visualiseerimine, töölauad ja häirereeglistik |
| **Node Exporter** | Hosti tasandi meetrikad: CPU, RAM, ketas, võrk |
| **cAdvisor** | Konteinerite ressursikasutus reaalajas |
| **Telegram Alert** | Automaatne teavitussüsteem häirete korral |

See on sama arhitektuur, mida kasutavad professionaalsed insenerid igas suuremas tarkvaraettevõttes.

### Edasised väljakutsed

#### 1️⃣ Logi haldus Lokiga
Lisa stäkki **Grafana Loki** — see on logi agregaator, mis töötab koos Grafanaga sarnaselt nagu Prometheus meetrikatega. Saad vaadata konteinerite logisid otse Grafana töölaualt, kõrvuti meetrikagraafikutega.

#### 2️⃣ Distributed Tracing Tempoga
Kui su rakendus muutub keerukamaks (mitu mikroteeenust), lisa **Grafana Tempo hajutatud jälgimiseks** (distributed tracing). See näitab, millised teenuse kutsed võtavad kaua aega.

#### 3️⃣ SLO-de defineerimine
Defineeri oma teenusele **Service Level Objectives (SLO)**:
- Nt: "99.9% ajast peab vastamisaeg olema alla 200ms"
- Grafana Scenes võimaldab SLO-töölaudu automaatselt genereerida

> 🎯 **Hea monitooringusüsteem ei ütle sulle ainult seda, et midagi läks katki — ta hoiatab sind enne, kui see juhtub. Sinu ülesanne on nüüd treenida seda süsteemi tundma oma teenuse normaalset käitumist.**
