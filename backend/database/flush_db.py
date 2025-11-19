"""
Script to flush the database - drops all tables and recreates them
WARNING: This will delete all data!
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from database import engine, Base
from models import User, Project, Scene, Connection

def flush_database():
    """Drop all tables and recreate them"""
    print("⚠️  WARNING: This will delete all data from the database!")
    print("Dropping all tables...")
    
    with engine.connect() as conn:
        try:
            # Drop all tables in reverse order of dependencies
            conn.execute(text("DROP TABLE IF EXISTS connections CASCADE"))
            conn.execute(text("DROP TABLE IF EXISTS scenes CASCADE"))
            conn.execute(text("DROP TABLE IF EXISTS projects CASCADE"))
            conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
            conn.commit()
            print("✅ All tables dropped successfully!")
        except Exception as e:
            print(f"❌ Error dropping tables: {e}")
            conn.rollback()
            raise
    
    print("Creating tables with new schema...")
    try:
        # Recreate all tables with the current schema
        Base.metadata.create_all(bind=engine)
        print("✅ Database flushed and recreated successfully!")
        print("✅ All tables created with the new schema (no user_id in projects)")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise

if __name__ == "__main__":
    confirm = input("Are you sure you want to delete all data? (yes/no): ")
    if confirm.lower() == "yes":
        flush_database()
    else:
        print("Cancelled.")

