# TrendWear AI

AI-powered Integrated S&OP and Procurement Planning platform for TrendWear Apparel.

## Problem
TrendWear needs to synchronize demand, production, inventory and procurement, while intelligently allocating material procurement across suppliers.

## Use Cases
### P2
Integrated S&OP for TrendWear Apparel
### PR1
Procurement Planning & Supplier Allocation Automation + Risk Prediction

## Architecture
```
React (Frontend)
   │
   ▼
FastAPI (Backend)
   │
   ├─► P2 Forecasting / S&OP
   ├─► PR1 Risk + Optimization (OR-Tools)
   └─► Supabase PostgreSQL (Database)
```

## Team
- **Mehul Bhowmick** - Backend & Database (Integration)
- **Nisha Sah** - P2 ML & S&OP (Forecasting)
- **Utkarsha Saha** - PR1 Optimization & Risk (OR-Tools)
- **Pankaj Kumar** - Frontend (React Control Tower)
- **Dhanjay Kumar** - Frontend (React Control Tower)
- **Ayan Ghosh** - AI, Scenarios & QA (Gemini AI Explanation)
