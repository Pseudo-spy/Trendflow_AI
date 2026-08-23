"""
Day-1 smoke test for the backend health endpoint.
Requires the FastAPI server to be running locally (uvicorn app.main:app --reload).
"""
import requests
import pytest

BASE_URL = "http://127.0.0.1:8000"


@pytest.mark.skip(reason="Enable once backend server is running locally")
def test_health_endpoint_returns_200():
    response = requests.get(f"{BASE_URL}/api/health")
    assert response.status_code == 200


@pytest.mark.skip(reason="Enable once backend server is running locally")
def test_health_endpoint_reports_healthy_status():
    response = requests.get(f"{BASE_URL}/api/health")
    body = response.json()
    assert body.get("status") == "healthy"