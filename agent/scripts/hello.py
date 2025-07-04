#!/usr/bin/env python3
import os
import sys
from datetime import datetime

print(f"Hello from Python agent!")
print(f"Hostname: {os.environ.get('HOSTNAME', 'unknown')}")
print(f"Timestamp: {datetime.now()}")

# Access parameters via environment variables
name = os.environ.get('PARAM_NAME', 'World')
print(f"Hello, {name}!")

# Example of using parameters
if 'PARAM_COUNT' in os.environ:
    count = int(os.environ.get('PARAM_COUNT', '1'))
    for i in range(count):
        print(f"Message {i+1}: Hello from iteration {i+1}")
