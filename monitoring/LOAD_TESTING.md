# Load Testing ja Stress Testing Juhend

Kuidas teha teie süsteemi load testing ja triggida häireid Grafanas.

## 🎯 Eesmärk

Load testing abil saad:
- ✅ Kontrollida, kuidas sinu PocketBase käitub koormusega
- ✅ Triggida CPU/Mälu häireid Grafanas seadistatud reeglite kaudu
- ✅ Kinnitada, et Telegrami häiresüsteem töötab
- ✅ Leida sinu API "limit" (maksimaalne jõudlus)

---

## 🔧 Seadistus

### macOS

```bash
# Apache Benchmark (ab) - kõige lihtsam
brew install httpd

# k6 - professionaalne load testing tööriist
brew install k6
```

### Linux (Debian/Ubuntu)

```bash
# Apache Benchmark
sudo apt-get install apache2-utils

# k6
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.deb -L -o k6.deb
sudo dpkg -i k6.deb
```

---

## 📊 Meetod 1: Apache Benchmark (ab)

Lihtne, kiire, käsureaast käivitatav load testing.

### Põhi-käsk

```bash
ab -n <total> -c <concurrent> https://pocketbase.local
```

| Parameeter | Selgitus |
|-----------|----------|
| `-n` | Kogu päringute arv |
| `-c` | Samaaeguste päringute arv (concurrent) |
| `-t` | Testi aeg sekundites |

### Näited

#### Kerge koormus (test)

```bash
ab -n 1000 -c 10 http://pocketbase.local/
```

- 1 000 päringut
- 10 korraga
- ≈ 100 sekundit keskmiselt

#### Keskmise koormuse test

```bash
ab -n 10000 -c 50 http://pocketbase.local/
```

- 10 000 päringut
- 50 korraga
- ≈ CPU tõuseb ≈40-60%

#### Kõrge koormus (stress)

```bash
ab -n 100000 -c 500 http://pocketbase.local/
```

- 100 000 päringut
- 500 korraga
- ⚠️ CPU tõuseb 70-100%+
- **TRIGGER HÄIREID!**

### Tulemuste lugemine

```
This is ApacheBench, Version 2.3
Benchmarking pocketbase.local (be patient)...done

Server Software:        PocketBase
Server Hostname:        pocketbase.local
Server Port:            80
Document Path:          /
Document Length:        1234 bytes

Concurrency Level:      50
Time taken for tests:   45.234 seconds
Complete requests:      10000
Failed requests:        12

Requests per second:    221.05 [#/sec] (mean)
Time per request:       226.17 [ms] (mean)
Time per request:       4.52 [ms] (mean, across all concurrent requests)
Transfer rate:          50.45 [Kbytes/sec] received
```

**Olulised väärtused:**
- **Requests per second** = Jõudlus
- **Time per request** = Vastuse aeg
- **Failed requests** = Vigade arv

---

## 🚀 Meetod 2: k6 (Professionaalne Load Testing)

k6 on mooderni test tööriist koos skriptimisega.

### Põhi-skript

#### 1. Lihtne HTTP GET test

```bash
k6 run - <<'EOF'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 50,           // 50 virtuaalset kasutajat
  duration: '5m',    // 5 minutit
};

export default function () {
  let res = http.get('http://pocketbase.local/');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
EOF
```

#### 2. Ramping test (koormus suureneb)

```bash
k6 run - <<'EOF'
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 0 },     // Algus
    { duration: '5m', target: 100 },   // Tõus: 0 → 100 VU
    { duration: '10m', target: 100 },  // Püsiv: 100 VU
    { duration: '5m', target: 50 },    // Langus: 100 → 50 VU
    { duration: '1m', target: 0 },     // Lõpp
  ],
};

export default function () {
  http.get('http://pocketbase.local/');
}
EOF
```

#### 3. Stress test (äkki suurenenud koormus)

```bash
k6 run - <<'EOF'
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 500 },   // SPIKE!
    { duration: '1m', target: 1000 },  // MEGA SPIKE!
    { duration: '1m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  http.get('http://pocketbase.local/');
}
EOF
```

#### 4. Reaalne API test (auth-iga)

```bash
k6 run - <<'EOF'
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://pocketbase.local';

export let options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% vastuste aeg < 500ms
  },
};

export default function () {
  // Login
  let authPayload = JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  });
  
  let authRes = http.post(`${BASE_URL}/api/collections/users/auth-with-password`, authPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  let token = authRes.json('token');
  
  // List posts
  let postsRes = http.get(`${BASE_URL}/api/collections/posts/records`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  check(postsRes, {
    'posts fetched': (r) => r.status === 200,
  });
}
EOF
```

### k6 käivitatava skriptiga failia kasutamine

1. Loo fail `load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://pocketbase.local/api/collections/posts/records');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

2. Käivita:

```bash
k6 run load-test.js
```

---

## 🎬 Sammud häire triggermiseks

### 1. Avage Grafana monitoring

```bash
# Ava Grafana brauser
open http://localhost:3001/d/containers-cAdvisor

# Või Node Exporter dashboard
open http://localhost:3001/d/node-exporter
```

### 2. Avage Telegram grupp

Ava paralleelselt `Telegram grupp`, kus oled häiresüsteem seadistanud.

### 3. Käivita load test

**Kerge test (pole häireid):**
```bash
ab -n 5000 -c 25 http://pocketbase.local/
```

**Raske test (peaks triggermisele häireid):**
```bash
k6 run - <<'EOF'
import http from 'k6/http';
export let options = {
  stages: [
    { duration: '1m', target: 200 },
    { duration: '3m', target: 200 },
    { duration: '1m', target: 0 },
  ],
};
export default function () {
  http.get('http://pocketbase.local/');
}
EOF
```

### 4. Jälgi tulemusi

| Punkt | Tegevus |
|-------|---------|
| ⏱️ **0-30s** | CPU ja Mälu graafiku tõus Grafanas |
| ⏱️ **60s** | Võib ilmneda esimene hoiatus (kui reegel on `For: 1m`) |
| ⏱️ **90s** | Telegrami grupp peaks saama testiteavituse |
| ⏱️ **Test lõpp** | Graafik langeb tagasi |

---

## 📈 Suurte konkreetsed testid

### Stsenaarium 1: API ülekoormuse test

```bash
# Simuleerige tuhandest samaaegset kasutajat
ab -n 50000 -c 1000 http://pocketbase.local/api/collections/posts/records
```

**Oodatav:**
- CPU: 80-95%
- Mälu: 70-85%
- Häireid: ✅ JÄAH

### Stsenaarium 2: Lühike spike koormus

```bash
k6 run - <<'EOF'
import http from 'k6/http';
export let options = {
  stages: [
    { duration: '30s', target: 0 },
    { duration: '30s', target: 50 },     // Kiire spike
    { duration: '2m', target: 500 },     // Pea kõrgel
    { duration: '30s', target: 0 },
  ],
};
export default function () {
  http.get('http://pocketbase.local/');
}
EOF
```

### Stsenaarium 3: Gradualine koormus tõus

```bash
k6 run - <<'EOF'
import http from 'k6/http';
export let options = {
  stages: [
    { duration: '10m', target: 500 },    // Aeglane tõus 10 minuti jooksul
  ],
};
export default function () {
  http.get('http://pocketbase.local/');
}
EOF
```

---

## ⚠️ Ettevaatused

### Kunagi EI tee

❌ **Ei** testida teiste avalike serveritega (see on DDoS-i katsetus!)
❌ **Ei** testita ühisarhitektuuri servoritest
❌ **Ei** unusta load testi lõpetada

### Kunagi TEE

✅ **TEEL** testida ainult omi serverjeid
✅ **TEEL** säilitada dokumentatiooni test tulemustest
✅ **TEEL** teha testi väikesest kuni suureni
✅ **TEEL** jälgis tulemusi käes

---

## 📊 Tulemuste salvestamine

Salvesta iga testi tulemus tabelisse:

| Kuupäev | Test tüüp | VU | Kestvus | CPU Max % | Mälu Max % | Requests/sec | Failed | Häireid? | Märkused |
|---------|----------|----|---------|-----------|-----------|--------------|---------|---------|----|
| 2026-04-08 | Kerge | 50 | 5m | 35% | 42% | 200 | 0 | ❌ | OK |
| 2026-04-08 | Raske | 200 | 5m | 78% | 81% | 150 | 5 | ✅ | Telegram alert tuli! |

---

## 🔗 Vahendite Dokumentatsioon

- **Apache Benchmark:** http://httpd.apache.org/docs/current/programs/ab.html
- **k6 dokumentatsioon:** https://k6.io/docs/
- **k6 GitHub:** https://github.com/grafana/k6

---

Edu testimisega! 🚀
