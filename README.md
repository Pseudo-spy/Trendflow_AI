# TrendWear AI

AI-powered Integrated S&OP and Procurement Planning platform for TrendWear Apparel.

## Problem

TrendWear needs to synchronize demand, production, inventory and procurement, while intelligently allocating material procurement across suppliers.

## Use Cases

### P2
Integrated S&OP for TrendWear Apparel.

### PR1
Procurement Planning & Supplier Allocation Automation + Supplier Risk Prediction.

## Architecture

```text
React (Frontend)
   |
   v
FastAPI (Backend)
   |
   +--> P2 Forecasting / S&OP
   |
   +--> PR1 Risk Prediction
   |
   +--> PR1 Supplier Optimization (OR-Tools)
   |
   +--> Supabase PostgreSQL (Database)