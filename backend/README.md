# AUST-IPMS Laravel Backend

This directory contains the **PHP & Laravel** backend implementation for the **AUST Intelligent Parking Management System (AUST-IPMS)**, matching 100% of the API specifications, route contracts, vehicle classification rules, and response payloads.

---

## 🛠️ Tech Stack

* **Framework**: Laravel 12.x
* **Language**: PHP 8.2+
* **Storage/Cache**: SQLite + Laravel Database Cache
* **Auth & Tokens**: Laravel Sanctum

---

## 🚀 Getting Started

### 1. Installation
```bash
composer install
php artisan key:generate
php artisan migrate
```

### 2. Start the Server
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

---

## 📡 API Endpoints Reference

### Root
* `GET /` — Service status, campus metadata, and API version

### Parking
* `GET /api/v1/parking-status` — All zones status (supports `?basement=B1|B2`)
* `GET /api/v1/parking-status/{zoneId}` — Specific zone details
* `GET /api/v1/parking-slots` — Real-time parking slot list (supports `?zoneId=...`)
* `POST /api/v1/parking-status/refresh` — Force status refresh timestamp

### Analytics
* `GET /api/v1/analytics/dashboard` — Live dashboard metrics and utilization rates
* `GET /api/v1/analytics/hourly` — Hourly occupancy distribution (Sunday–Thursday, 7:30 AM – 9:00 PM)
* `GET /api/v1/analytics/daily` — Daily traffic logs
* `GET /api/v1/analytics/weekly-comparison` — Week-over-week trends
* `POST /api/v1/analytics/predict` — ML parking demand forecast

### Vehicles & AUST Gate Policy
* `POST /api/v1/vehicles/entry` — Log entry (enforces university zone classification rules: Student $\rightarrow$ B1, Faculty $\rightarrow$ B2, Guest $\rightarrow$ B2 Guest)
* `POST /api/v1/vehicles/exit` — Log vehicle departure
* `GET /api/v1/vehicles` — Vehicle directory
* `GET /api/v1/vehicles/{plateNumber}` — Vehicle lookup

### Cameras
* `GET /api/v1/cameras` — Camera feeds directory
* `GET /api/v1/cameras/{id}` — Specific camera telemetry

### Authentication
* `POST /api/v1/auth/login` — Authentication session token
* `POST /api/v1/auth/register` — Vehicle/member registration submission
* `POST /api/v1/auth/logout` — Invalidate session
* `GET /api/v1/auth/me` — Authenticated profile

### Notifications & Admin
* `GET /api/v1/notifications` — Campus parking alerts
* `PATCH /api/v1/notifications/{id}/read` — Acknowledge notification
* `GET /api/v1/admin/users` — Governance and proctor members
* `GET /api/v1/admin/logs` — Security and gate audit logs
* `POST /api/v1/admin/zones/{id}/update` — Dynamic zone slot capacity adjustment
