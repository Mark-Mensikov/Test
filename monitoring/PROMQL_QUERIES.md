# PromQL Queries Reference

Käsitsi PromQL (Prometheus Query Language) päringute kogu, mida saad Grafana töölaudade paneelides kasutada.

## 📊 Node Exporter Queries (Server Hardware)

### CPU Kasutus

**CPU kasutus protsendina (viimased 5 minutit):**
```promql
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**CPU kasutus per core:**
```promql
rate(node_cpu_seconds_total{mode!="idle"}[5m]) * 100
```

**Load average:**
```promql
node_load1
```

### Mälu (RAM)

**Vaba mälu (baitides):**
```promql
node_memory_MemAvailable_bytes
```

**Mälu kasutus protsendina:**
```promql
((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes) * 100
```

**Swap kasutus:**
```promql
(1 - (node_memory_SwapFree_bytes / node_memory_SwapTotal_bytes)) * 100
```

### Ketta kasutus

**Ketta kasutus protsendina:**
```promql
(node_filesystem_size_bytes{fstype=~"ext4|xfs"} - node_filesystem_avail_bytes{fstype=~"ext4|xfs"}) / node_filesystem_size_bytes{fstype=~"ext4|xfs"} * 100
```

**Ketta I/O - lugemise valtsus:**
```promql
rate(node_disk_read_bytes_total[5m]) / 1024 / 1024
```

**Ketta I/O - kirjutamise valtsus:**
```promql
rate(node_disk_written_bytes_total[5m]) / 1024 / 1024
```

### Võrk

**Võrgu tulevate andmete valtsus (Mbps):**
```promql
rate(node_network_receive_bytes_total[5m]) * 8 / 1024 / 1024
```

**Võrgu väljuvate andmete valtsus (Mbps):**
```promql
rate(node_network_transmit_bytes_total[5m]) * 8 / 1024 / 1024
```

**Võrgu paketid tulemas:**
```promql
rate(node_network_receive_packets_total[5m])
```

---

## 🐳 cAdvisor Queries (Docker Containers)

### Container olekud

**Konteineri tööaeg (UP/DOWN):**
```promql
up{job="containers"}
```

**Kõik konteinerid:**
```promql
container_last_seen
```

### Mälu

**Konteineri mälu kasutus (baitides):**
```promql
container_memory_usage_bytes{name="pocketbase"}
```

**Mälu kasutusprotsendina:**
```promql
(container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100
```

**Mälu kasutus kõikidele konteineritele:**
```promql
sum by (name) (container_memory_usage_bytes)
```

### CPU

**CPU kasutus (sekunditeks):**
```promql
rate(container_cpu_usage_seconds_total[5m])
```

**CPU kasutus protsendina:**
```promql
rate(container_cpu_usage_seconds_total[5m]) * 100
```

**CPU kasutus: PocketBase vs teised konteinerid:**
```promql
rate(container_cpu_usage_seconds_total{name=~"pocketbase|node-exporter|cadvisor"}[5m]) * 100
```

### Võrk

**Võrgu vastu võetud baiti:**
```promql
rate(container_network_receive_bytes_total[5m])
```

**Võrgu saadetud baiti:**
```promql
rate(container_network_transmit_bytes_total[5m])
```

### Salvestus (Storage)

**Ketta I/O - lugemised:**
```promql
rate(container_fs_io_time_seconds_total{name="pocketbase"}[5m])
```

**Ketta I/O - kirjutamised:**
```promql
rate(container_fs_write_seconds_total[5m])
```

---

## 🚨 Alert Queries

### CPU ülekoormuse häire

**Kui CPU > 70% ma 1 minut:**
```promql
rate(container_cpu_usage_seconds_total[5m]) * 100 > 70
```

**Kui CPU > 80% ma 5 minutit:**
```promql
rate(container_cpu_usage_seconds_total[5m]) * 100 > 80
```

### Mälu ülekoormuse häire

**Kui mälu > 85%:**
```promql
(container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100 > 85
```

**Kui serveri RAM > 90%:**
```promql
((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes) * 100 > 90
```

### Ketta ruumi häire

**Kui ketta > 80%:**
```promql
(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100 > 80
```

### Teenuse tööaja häire

**Kui teenus on DOWN:**
```promql
up{job="containers"} == 0
```

---

## 📈 Business Metrics (Ärmeetrikad)

### HTTP päringute arv

**Päringute koguarv:**
```promql
increase(http_requests_total[5m])
```

**Päringute valtsus:**
```promql
rate(http_requests_total[5m])
```

### Vastuse aeg (latency)

**Keskmine vastuse aeg:**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Error rate

**Vead protsendina:**
```promql
(increase(http_requests_total{status=~"5.."}[5m]) / increase(http_requests_total[5m])) * 100
```

---

## 🔗 Composites - Keerukamad päringud

### Dashboard - Kogu süsteemi ülevaade

**Vaba ressuurss (%):**
```promql
min by (instance) (
  100 - (
    max(
      100 - (avg (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100),
      ((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes) * 100
    )
  )
)
```

### Top 5 kõige rohkem RAM kasutavad konteinerid

```promql
topk(5, container_memory_usage_bytes) / 1024 / 1024 / 1024
```

### Top 5 kõige rohkem CPU kasutavad konteinerid

```promql
topk(5, rate(container_cpu_usage_seconds_total[5m])) * 100
```

---

## 🎓 PromQL Tips & Tricks

### Agregaadid
- `sum()` — summa
- `avg()` — keskmine
- `min()` — miinimum
- `max()` — maksimum
- `count()` — element arv

### Operaatorid
- `rate()` — muutus sekundis (kasuta ajaseeria jaoks)
- `increase()` — toote kogumuutus
- `irate()` — hetkeline muutus

### Filtreerimine
```promql
metric_name{label1="value1", label2=~"pattern.*"}
```

### Offset (minevik)
```promql
metric_name offset 1h  # 1 tund tagasi
metric_name offset 7d  # 7 päeva tagasi
```

---

**Rohkem infot:** https://prometheus.io/docs/prometheus/latest/querying/basics/
