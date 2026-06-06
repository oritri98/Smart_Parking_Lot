# AUST-IPMS Backend — Architecture Plan

## Overview

This directory is reserved for the backend implementation of the **AUST Intelligent Parking Management System (AUST-IPMS)**.

> **Current Status:** Phase 1 — Frontend Only. No backend is deployed.

---

## Planned Technology Stack

| Layer | Technology |
|-------|-----------|
| API Framework | Python FastAPI (or Flask) |
| Database | PostgreSQL (relational) + Redis (caching) |
| Real-Time | WebSocket (camera feeds, live updates) |
| Authentication | JWT + Role-Based Access Control |
| ORM | SQLAlchemy / Alembic (migrations) |
| Task Queue | Celery + Redis (background jobs) |
| ML Engine | Python (TensorFlow / PyTorch / Scikit-learn) |
| Computer Vision | OpenCV + YOLO (vehicle/slot detection) |
| LPR/ANPR | Custom ANPR engine or OpenALPR |
| Deployment | Docker + Docker Compose |
| Reverse Proxy | Nginx |

---

## Planned API Endpoints

### Parking
- `GET /api/v1/parking-status` — Current zone availability (B1/B2)
- `GET /api/v1/parking-status/:zoneId` — Specific zone
- `POST /api/v1/parking-status/refresh` — Force refresh

### Analytics
- `GET /api/v1/analytics/dashboard` — Dashboard stats
- `GET /api/v1/analytics/hourly` — Hourly occupancy data
- `GET /api/v1/analytics/daily` — Daily usage trends
- `GET /api/v1/analytics/weekly-comparison` — Week comparison
- `POST /api/v1/analytics/predict` — ML demand prediction (Phase 4)

### Vehicles
- `POST /api/v1/vehicles/entry` — Log vehicle entry (triggered by LPR)
- `POST /api/v1/vehicles/exit` — Log vehicle exit
- `GET /api/v1/vehicles/:plateNumber` — Vehicle lookup
- `GET /api/v1/vehicles` — All vehicles (admin)

### Cameras
- `GET /api/v1/cameras` — Camera list
- `GET /api/v1/cameras/:id` — Camera info
- `WS /ws/camera-feed/:cameraId` — Live feed stream

### Authentication (Phase 2)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Notifications (Phase 4)
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/:id/read`

### Admin (Phase 5)
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/logs`
- `POST /api/v1/admin/zones/:id/update`

---

## Database Schema (Planned)

### Tables
- `parking_zones` — B1/B2 zone definitions and live status
- `parking_slots` — Individual slot status
- `vehicles` — Registered vehicle database
- `vehicle_logs` — Entry/exit event logs
- `users` — Students, faculty, security, admin
- `cameras` — Camera metadata and status
- `notifications` — Notification records
- `admin_logs` — System audit logs

---

## Vehicle Classification Policy

Per AUST policy:
- Registered students → **Student Zone (B1)**
- Registered faculty → **Faculty Zone (B2)**
- All other vehicles (unregistered/unknown) → **Guest & Visitor Zone (B2)**
- **No vehicle shall ever be classified as "Unknown"** — unrecognized plates default to Guest.

---

## Campus Schedule Integration

- Operating Days: **Sunday – Thursday**
- Operating Hours: **7:30 AM – 9:00 PM**
- Peak Hours: **9:30–11:00 AM** and **1:00–2:30 PM**
- ML models must account for AUST Academic Calendar (exam weeks, semester breaks, campus events)

---

## Governance Alignment

This backend will be developed in coordination with:
- Office of the Proctor — AUST
- Office of the University Engineer — AUST
- ICT Center — AUST
- Campus Safety Division — AUST

---

## Development Timeline

| Phase | Scope | Target |
|-------|-------|--------|
| Phase 1 | Frontend Only | 2026 Q2 |
| Phase 2 | Backend API + Auth + Camera | 2026 Q3 |
| Phase 3 | Vehicle Tracking + LPR | 2026 Q4 |
| Phase 4 | ML Predictions + Notifications | 2027 Q1 |
| Phase 5 | Admin Panel + Full Integration | 2027 Q2 |

---

*AUST Intelligent Parking Management System — CSE Department, Ahsanullah University of Science and Technology*  
*141 & 142, Love Road, Tejgaon Industrial Area, Dhaka-1208, Bangladesh*
