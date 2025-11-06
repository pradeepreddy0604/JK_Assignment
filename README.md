# 🧪 HTTPBin API Performance Testing Framework (JMeter + Docker + GitHub Actions)

---

## 📘 Overview

This project implements a **complete performance testing framework** for the [HTTPBin API](https://github.com/postmanlabs/httpbin), validating its **scalability, stability, and responsiveness** under various load conditions.

It covers four core performance testing types — **Load, Stress, Spike, and Endurance (Soak)** — using **Apache JMeter** and integrates automated execution with **GitHub Actions** for CI/CD.

---

## 🎯 Objectives

The primary goal is to:

* Evaluate HTTPBin API’s **performance and stability** under different workloads.
* Measure key metrics such as:

  * Response Time (Avg, 90th, 95th Percentile)
  * Throughput
  * Error Rate
  * CPU and Memory Utilization
* Automatically generate and publish HTML performance reports.

---

## ⚡ GitHub Actions CI/CD Workflow

The pipeline automatically:

1. Checks out the repo.
2. Installs Java + JMeter.
3. Builds and runs the HTTPBin container.
4. Executes JMeter tests (non-GUI mode).
5. Generates **HTML reports**.
6. Publishes the latest HTML report to the `gh-pages` branch.

---

## ⚙️ Tools & Technology Stack

| Component                  | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| **Apache JMeter (v5.6.3)** | Performance test design and execution          |
| **Docker**                 | API containerization (HTTPBin)                 |
| **GitHub Actions**         | Automated CI/CD for performance testing        ||
| **Ubuntu (runner)**        | Execution environment for the pipeline         |

---

## 📂 Project Structure

```
├── .github/workflows/
│   └── jmeter_load_test.yml           # CI/CD pipeline for test execution
├── Jmeter_scripts/
│   ├── httpbin_loadtest.jmx
│   ├── httpbin_stress-test.jmx
│   ├── httpbin_spike-test.jmx
│   └── Endurance_test.jmx
├── httpbin/
│   └── Dockerfile                     # HTTPBin API Docker setup
├── HTML_Reports/                      # Auto-generated HTML dashboards
├── jtl_files/                         # Raw JTL result files
├── logs/                              # JMeter logs and ping logs
├── LATEST_REPORT/                     # Published report folder
├── docker-compose.yml                 # Optional container orchestration
└── README.md                          # Project documentation
```

---

## 🧪 Test Types and Purpose

| Test Type          | Description                                  | Example Config                 |
| ------------------ | -------------------------------------------- | ------------------------------ |
| **Load Test**      | Measure performance under expected user load | 50–500 users, 5 min            |
| **Stress Test**    | without psce & think time                    | Gradual ramp-up until failures |
| **Spike Test**     | Evaluate response to sudden surges           | 350 → 40 users instantly       |
| **Endurance Test** | Check long-term stability                    | 350 users for 1 hour           |

---

## 📈 Key Performance Indicators (KPIs)

| KPI                   | Description                   | Target      |
| --------------------- | ----------------------------- | ----------- |
| Average Response Time | Mean time to serve requests   | ≤ 1 sec     |
| Throughput            | Requests handled per second   | ≥ 100 req/s |
| Error Rate            | Percentage of failed requests | ≤ 1%        |
| CPU Utilization       | Server-side CPU usage         | ≤ 75%       |
| Memory Utilization    | RAM usage during load         | ≤ 70%       |

---

## 🧱 Test Scenarios (JMeter Plans)

Each `.jmx` file contains:

* **Thread Groups** simulating various user loads.
* **HTTP Samplers** for `/get`, `/post`, `/put`, `/patch`, `/delete`.
* **Assertions:**

  * Response Time ≤ 1000 ms
  * Error Rate ≤ 1%
* **Listeners:**

  * Summary Report
  * Aggregate Report
  * View Results Tree (optional)
  * HTML Report Generator

---

## 🐳 Docker Setup (HTTPBin + cAdvisor)

### Run HTTPBin Locally:

```bash
docker run -d --name=httpbin -p 8080:80 kennethreitz/httpbin
```

Verify:

```
http://localhost:8080/get
```

### Monitoring container resorce utilisation via Docker stats:

```bash
docker run -d \
  --name=cadvisor \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=8081:8080 \
  gcr.io/cadvisor/cadvisor:latest
```

Access dashboard:

```
http://localhost:8081
```

---

### Workflow File:

`.github/workflows/jmeter_load_test.yml`

Triggers:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

---

## 🚀 Run Tests Locally (Optional)

To execute manually:

```bash
jmeter -n -t Jmeter_scripts/httpbin_loadtest.jmx \
  -l results/httpbin_results.jtl \
  -e -o report-html/httpbin_report
```

---

## 🧾 Reporting & Results

After test execution:

* **Raw Results:** `jtl_files/*.jtl`
* **HTML Report:** `HTML_Reports/{testname_timestamp}/index.html`
* **Published Report (GitHub Pages):**
  👉 [https://pradeepreddy0604.github.io/JK_Assignment](https://pradeepreddy0604.github.io/JK_Assignment)

---

## 🧠 Analysis & Observations

Post-test analysis includes:

* Response time trend across loads.
* Throughput comparison between scenarios.
* Error % and failure correlation.
* Resource utilization patterns from cAdvisor.

---
