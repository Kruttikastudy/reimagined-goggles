import pytest

from intake_extraction_agent import _clean_number, regex_extract_all, IntakeExtractionAgent


def test_clean_number_basic():
    assert _clean_number("160 mg/dL") == 160.0
    assert _clean_number("1,234") == 1234.0
    assert _clean_number("-12.5") == -12.5
    assert _clean_number("not a number") is None


def test_regex_glucose_and_bp():
    text = "Fasting glucose: 160 mg/dL; BP 140/90 mmHg"
    res = regex_extract_all(text)
    assert "glucose" in res
    assert float(res["glucose"]) == 160.0
    assert float(res["blood_pressure_systolic"]) == 140.0
    assert float(res["blood_pressure_diastolic"]) == 90.0


def test_unify_features_numbers():
    agent = IntakeExtractionAgent()
    raw = agent.extract_from_text("35-year-old female, Hb 13.2 g/dL, LDL 120 mg/dL")
    unified = agent.unify_features(raw)
    assert unified["features"]["age"] == 35.0
    # hemoglobin is present as 'hemoglobin' mapping -> 'hemoglobin'
    assert unified["features"]["hemoglobin"] == 13.2
    assert unified["features"]["ldl_cholesterol"] == 120.0
