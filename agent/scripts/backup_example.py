#!/usr/bin/env python3
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
