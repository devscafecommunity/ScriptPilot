#!/usr/bin/env python3
"""
Simple Task Scheduler Agent
A lightweight agent that receives commands from the scheduler and executes scripts locally.
"""

import os
import sys
import json
import time
import platform
import subprocess
import tempfile
import threading
from datetime import datetime
from flask import Flask, request, jsonify
import psutil

app = Flask(__name__)

class TaskAgent:
    def __init__(self):
        self.hostname = platform.node()
        self.system_info = self._get_system_info()
        self.running_tasks = {}
        
    def _get_system_info(self):
        """Get system information"""
        try:
            cpu_info = platform.processor() or "Unknown"
            memory = psutil.virtual_memory()
            
            return {
                "hostname": self.hostname,
                "os": f"{platform.system()} {platform.release()}",
                "arch": platform.machine(),
                "cpu": cpu_info,
                "ram": f"{memory.total // (1024**3)}GB",
                "python_version": platform.python_version()
            }
        except Exception as e:
            print(f"Error getting system info: {e}")
            return {
                "hostname": self.hostname,
                "os": f"{platform.system()} {platform.release()}",
                "arch": platform.machine(),
                "cpu": "Unknown",
                "ram": "Unknown",
                "python_version": platform.python_version()
            }
    
    def execute_script(self, script_name, script_content, parameters, execution_id):
        """Execute a script with given parameters"""
        start_time = time.time()
        
        try:
            # Determine script type and create temporary file
            script_extension = self._get_script_extension(script_name)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix=script_extension, delete=False) as temp_file:
                temp_file.write(script_content)
                temp_file_path = temp_file.name
            
            try:
                # Make script executable if it's a shell script
                if script_extension in ['.sh', '.bash']:
                    os.chmod(temp_file_path, 0o755)
                
                # Prepare command based on script type
                if script_extension == '.py':
                    cmd = [sys.executable, temp_file_path]
                elif script_extension in ['.sh', '.bash']:
                    cmd = ['/bin/bash', temp_file_path]
                elif script_extension == '.js':
                    cmd = ['node', temp_file_path]
                else:
                    # Try to execute directly
                    cmd = [temp_file_path]
                
                # Add parameters as environment variables
                env = os.environ.copy()
                for key, value in parameters.items():
                    env[f'PARAM_{key.upper()}'] = str(value)
                
                # Execute the script
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=300,  # 5 minutes timeout
                    env=env
                )
                
                duration = int((time.time() - start_time) * 1000)  # milliseconds
                
                if result.returncode == 0:
                    return {
                        "execution_id": execution_id,
                        "status": "success",
                        "output": result.stdout,
                        "duration": duration
                    }
                else:
                    return {
                        "execution_id": execution_id,
                        "status": "error",
                        "output": result.stdout,
                        "error": result.stderr,
                        "duration": duration
                    }
                    
            finally:
                # Clean up temporary file
                try:
                    os.unlink(temp_file_path)
                except:
                    pass
                    
        except subprocess.TimeoutExpired:
            duration = int((time.time() - start_time) * 1000)
            return {
                "execution_id": execution_id,
                "status": "error",
                "error": "Script execution timed out (5 minutes)",
                "duration": duration
            }
        except Exception as e:
            duration = int((time.time() - start_time) * 1000)
            return {
                "execution_id": execution_id,
                "status": "error",
                "error": str(e),
                "duration": duration
            }
    
    def _get_script_extension(self, script_name):
        """Get appropriate file extension based on script name"""
        if script_name.endswith('.py'):
            return '.py'
        elif script_name.endswith('.sh') or script_name.endswith('.bash'):
            return '.sh'
        elif script_name.endswith('.js'):
            return '.js'
        else:
            # Default to shell script
            return '.sh'

# Initialize agent
agent = TaskAgent()

@app.route('/ping', methods=['GET'])
def ping():
    """Health check endpoint"""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

@app.route('/info', methods=['GET'])
def get_info():
    """Get agent system information"""
    info = agent.system_info.copy()
    info["status"] = "online"
    info["ip"] = request.environ.get('SERVER_NAME', 'localhost')
    return jsonify(info)

@app.route('/execute', methods=['POST'])
def execute_script():
    """Execute a script"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        required_fields = ['script_name', 'execution_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        script_name = data['script_name']
        script_content = data.get('script_content', '')
        parameters = data.get('parameters', {})
        execution_id = data['execution_id']
        
        # If no script content provided, try to load from local scripts directory
        if not script_content:
            script_path = os.path.join('scripts', script_name)
            if os.path.exists(script_path):
                with open(script_path, 'r') as f:
                    script_content = f.read()
            else:
                return jsonify({
                    "execution_id": execution_id,
                    "status": "error",
                    "error": f"Script '{script_name}' not found and no content provided"
                }), 404
        
        # Execute script
        result = agent.execute_script(script_name, script_content, parameters, execution_id)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "execution_id": data.get('execution_id', 'unknown'),
            "status": "error",
            "error": str(e)
        }), 500

@app.route('/scripts', methods=['GET'])
def list_scripts():
    """List available local scripts"""
    scripts_dir = 'scripts'
    scripts = []
    
    if os.path.exists(scripts_dir):
        for filename in os.listdir(scripts_dir):
            if os.path.isfile(os.path.join(scripts_dir, filename)):
                scripts.append(filename)
    
    return jsonify(scripts)

@app.route('/status', methods=['GET'])
def get_status():
    """Get agent status and running tasks"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return jsonify({
            "status": "online",
            "hostname": agent.hostname,
            "uptime": time.time() - psutil.boot_time(),
            "cpu_usage": cpu_percent,
            "memory_usage": memory.percent,
            "disk_usage": disk.percent,
            "running_tasks": len(agent.running_tasks),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "status": "online",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        })

if __name__ == '__main__':
    # Create scripts directory if it doesn't exist
    os.makedirs('scripts', exist_ok=True)
    
    # Create some example scripts
    example_scripts = {
        'hello.py': '''#!/usr/bin/env python3
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
''',
        
        'system_info.sh': '''#!/bin/bash
echo "=== System Information ==="
echo "Hostname: $(hostname)"
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Disk Usage:"
df -h
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "Parameters received:"
env | grep "^PARAM_" | sort
''',
        
        'backup_example.py': '''#!/usr/bin/env python3
import os
import shutil
import time
from datetime import datetime

def backup_directory():
    source = os.environ.get('PARAM_SOURCE', '/tmp/test')
    destination = os.environ.get('PARAM_DESTINATION', '/tmp/backup')
    
    print(f"Starting backup from {source} to {destination}")
    print(f"Timestamp: {datetime.now()}")
    
    try:
        # Create destination if it doesn't exist
        os.makedirs(destination, exist_ok=True)
        
        # Simulate backup process
        if os.path.exists(source):
            backup_name = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            backup_path = os.path.join(destination, backup_name)
            
            print(f"Creating backup: {backup_path}")
            # In a real scenario, you'd copy files here
            # shutil.copytree(source, backup_path)
            
            # Simulate work
            time.sleep(2)
            
            print("Backup completed successfully!")
            print(f"Backup size: simulated 1.2GB")
            print(f"Files processed: simulated 1,234 files")
        else:
            print(f"Warning: Source directory {source} does not exist")
            
    except Exception as e:
        print(f"Error during backup: {e}")
        exit(1)

if __name__ == "__main__":
    backup_directory()
'''
    }
    
    # Write example scripts
    for script_name, content in example_scripts.items():
        script_path = os.path.join('scripts', script_name)
        if not os.path.exists(script_path):
            with open(script_path, 'w') as f:
                f.write(content)
            # Make shell scripts executable
            if script_name.endswith('.sh'):
                os.chmod(script_path, 0o755)
    
    print("Task Scheduler Agent starting...")
    print(f"Hostname: {agent.hostname}")
    print(f"System: {agent.system_info['os']}")
    print("Available endpoints:")
    print("  GET  /ping       - Health check")
    print("  GET  /info       - System information")
    print("  GET  /status     - Agent status")
    print("  GET  /scripts    - List available scripts")
    print("  POST /execute    - Execute script")
    print("")
    print("Example scripts created in ./scripts/")
    print("Starting server on http://0.0.0.0:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
