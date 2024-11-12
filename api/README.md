# API

This directory is responsible for all of the backend-related code.

## Getting started

To start the application, run the following:

```bash
# Create and activate a virtual environment
python -m venv .venv && source .venv/bin/activate

# Install dependencies
python -m pip install .

# Start the server
fastapi --host 0.0.0.0 --port 1140 run ./app.py
```

## Unit tests

To execute the tests, run the following:

```bash
# Create and activate a virtual environment
python -m venv .venv && source .venv/bin/activate

# Install test dependencies
python -m pip install .[test]

# Start the tests
python -m unittest
```
