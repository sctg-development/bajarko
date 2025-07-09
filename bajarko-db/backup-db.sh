#!/bin/bash

# Function to display help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Bajarko Database Backup and Restore Script"
    echo ""
    echo "Options:"
    echo "  (no arguments)    Create a backup of the database"
    echo "  --restore         Restore the database from backup"
    echo "  --create-user     Create the medusa user if it does not exist and grant privileges"
    echo "  --help, -h        Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  PROJECT_ROOT      Root directory of the Bajarko project (required)"
    echo ""
    echo "Examples:"
    echo "  $0                # Create backup"
    echo "  $0 --restore      # Restore from backup"
    echo ""
}

# Parse command line arguments
case "$1" in
    "")
        ACTION="backup"
        ;;
    "--restore")
        ACTION="restore"
        ;;
    "--create-user")
        ACTION="create_user"
        ;;
    "--help"|"-h")
        show_help
        exit 0
        ;;
    *)
        echo "Error: Unknown option '$1'"
        echo ""
        show_help
        exit 1
        ;;
esac

# Find non localhost ip address on linux use ifconfig or ip addr, on mac use ifconfig
OS=$(uname -s)
if [ "$OS" = "Linux" ]; then
    # Linux: Try to get the first non-loopback IPv4 address
    IP=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' | head -1)
    if [ -z "$IP" ]; then
        # Fallback: use hostname -I to get local IP
        IP=$(hostname -I | awk '{print $1}')
    fi
    if [ -z "$IP" ]; then
        # Last resort: parse ifconfig output
        IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
    fi
else
    # MacOS: Get the first non-loopback IPv4 address
    IP=$(route get default 2>/dev/null | grep interface | awk '{print $2}' | xargs ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -1)
    if [ -z "$IP" ]; then
        # Fallback: parse ifconfig output directly
        IP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -1)
    fi
fi

# Verify that we found a valid IP
if [ -z "$IP" ]; then
    echo "Could not determine local IP address. Please set IP manually."
    exit 1
fi

echo "Using IP address: $IP"

# Verify that PROJECT_ROOT is set
if [ -z "$PROJECT_ROOT" ]; then
    echo "PROJECT_ROOT is not set. Please set it to the root of your Bajarko project."
    exit 1
fi

# Verify that the bajarko-db directory exists
if [ ! -d "$PROJECT_ROOT/bajarko-db" ]; then
    echo "bajarko-db directory does not exist in the PROJECT_ROOT. Please check your setup."
    exit 1
fi

# Verify if the container is running
if ! docker ps | grep -q "sctg/bajarko-db"; then
    echo "The Bajarko database container is not running. Please start it with 'docker-compose up -d bajarko-db'."
    exit 1
fi

# Function to perform backup
perform_backup() {
    echo "Creating backup of the database..."
    if docker run --rm -e PGPASSWORD=postgres sctg/bajarko-db:15-alpine pg_dump -h $IP -U postgres -d medusa > "$PROJECT_ROOT/bajarko-db/medusa_backup.sql"; then
        echo "Backup completed successfully: $PROJECT_ROOT/bajarko-db/medusa_backup.sql"
    else
        echo "Backup failed!"
        exit 1
    fi
}

# Function to perform restore
perform_restore() {
    local backup_file="$PROJECT_ROOT/bajarko-db/medusa_backup.sql"
    
    # Check if backup file exists
    if [ ! -f "$backup_file" ]; then
        echo "Backup file not found: $backup_file"
        exit 1
    fi
    
    echo "Restoring database from backup..."
    echo "Warning: This will overwrite all existing data in the database!"
    
    # Drop the database if it exists and recreate it
    echo "Dropping and recreating database..."
    if docker run --rm -e PGPASSWORD=postgres sctg/bajarko-db:15-alpine psql -h $IP -U postgres -c "DROP DATABASE IF EXISTS medusa;" postgres && \
       docker run --rm -e PGPASSWORD=postgres sctg/bajarko-db:15-alpine psql -h $IP -U postgres -c "CREATE DATABASE medusa;" postgres; then
        echo "Database recreated successfully."
    else
        echo "Failed to recreate database!"
        exit 1
    fi
    
    # Restore the backup
    echo "Restoring data from backup..."
    if docker run --rm -e PGPASSWORD=postgres -i sctg/bajarko-db:15-alpine psql -h $IP -U postgres -d medusa < "$backup_file"; then
        echo "Database restored successfully from: $backup_file"
    else
        echo "Restore failed!"
        exit 1
    fi
}

# Create the medusa user if it does not exist and grant privileges
create_medusa_user() {
    echo "Creating medusa user if it does not exist..."
    if docker run --rm -e PGPASSWORD=postgres sctg/bajarko-db:15-alpine psql -h $IP -U postgres -c "DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'medusa') THEN
        CREATE USER medusa WITH PASSWORD 'secret_password';
    END IF;
END\$$;" postgres && \
       docker run --rm -e PGPASSWORD=postgres sctg/bajarko-db:15-alpine psql -h $IP -U postgres -d medusa -c "
        GRANT ALL PRIVILEGES ON DATABASE medusa TO medusa;
        GRANT ALL ON SCHEMA public TO medusa;
        GRANT CREATE ON SCHEMA public TO medusa;
        GRANT USAGE ON SCHEMA public TO medusa;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO medusa;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO medusa;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO medusa;
       "; then
        echo "medusa user created and granted privileges successfully."
    else
        echo "Failed to create medusa user or grant privileges!"
        exit 1
    fi
}

# Execute the requested action
case "$ACTION" in
    "backup")
        perform_backup
        ;;
    "restore")
        perform_restore
        ;;
    "create_user")
        create_medusa_user
        ;;
esac