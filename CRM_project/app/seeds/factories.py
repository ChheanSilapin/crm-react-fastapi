"""
Data factories for generating realistic seed data using Faker.
This module provides factory functions to create realistic test data for all models.
"""

import random
from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Dict, Any, Optional
from faker import Faker
from passlib.context import CryptContext

# Initialize Faker with multiple locales for diverse data
fake = Faker(['en_US', 'en_GB', 'en_CA', 'en_AU'])

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class DataFactory:
    """Factory class for generating realistic seed data."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt."""
        return pwd_context.hash(password)
    
    @staticmethod
    def generate_permissions() -> List[Dict[str, Any]]:
        """Generate comprehensive permission data for CRM system."""
        permissions = [
            # User Management Permissions
            {"name": "users:create", "description": "Create new users"},
            {"name": "users:read", "description": "View user information"},
            {"name": "users:update", "description": "Update user information"},
            {"name": "users:delete", "description": "Delete users"},
            {"name": "users:list", "description": "List all users"},
            {"name": "users:status", "description": "Change user status"},
            
            # Role Management Permissions
            {"name": "roles:create", "description": "Create new roles"},
            {"name": "roles:read", "description": "View role information"},
            {"name": "roles:update", "description": "Update role information"},
            {"name": "roles:delete", "description": "Delete roles"},
            {"name": "roles:list", "description": "List all roles"},
            {"name": "roles:assign", "description": "Assign roles to users"},
            
            # Permission Management
            {"name": "permissions:create", "description": "Create new permissions"},
            {"name": "permissions:read", "description": "View permission information"},
            {"name": "permissions:update", "description": "Update permission information"},
            {"name": "permissions:delete", "description": "Delete permissions"},
            {"name": "permissions:list", "description": "List all permissions"},
            {"name": "permissions:assign", "description": "Assign permissions to roles"},
            
            # Bank Management Permissions
            {"name": "banks:create", "description": "Create new banks"},
            {"name": "banks:read", "description": "View bank information"},
            {"name": "banks:update", "description": "Update bank information"},
            {"name": "banks:delete", "description": "Delete banks"},
            {"name": "banks:list", "description": "List all banks"},
            
            # Customer Management Permissions
            {"name": "customers:create", "description": "Create new customers"},
            {"name": "customers:read", "description": "View customer information"},
            {"name": "customers:update", "description": "Update customer information"},
            {"name": "customers:delete", "description": "Delete customers"},
            {"name": "customers:list", "description": "List all customers"},
            {"name": "customers:export", "description": "Export customer data"},
            
            # System Administration Permissions
            {"name": "system:admin", "description": "Full system administration access"},
            {"name": "system:audit", "description": "View audit logs and system information"},
            {"name": "system:backup", "description": "Perform system backups"},
            {"name": "system:maintenance", "description": "Perform system maintenance"},
            
            # Dashboard and Reporting
            {"name": "dashboard:view", "description": "View dashboard"},
            {"name": "reports:generate", "description": "Generate reports"},
            {"name": "reports:export", "description": "Export reports"},
            {"name": "analytics:view", "description": "View analytics data"},
        ]
        
        return permissions
    
    @staticmethod
    def generate_roles() -> List[Dict[str, Any]]:
        """Generate role hierarchy data."""
        roles = [
            {
                "name": "admin",
                "description": "System Administrator with full access",
                "permissions": [
                    "system:admin", "system:audit", "system:backup", "system:maintenance",
                    "users:create", "users:read", "users:update", "users:delete", "users:list", "users:status",
                    "roles:create", "roles:read", "roles:update", "roles:delete", "roles:list", "roles:assign",
                    "permissions:create", "permissions:read", "permissions:update", "permissions:delete", "permissions:list", "permissions:assign",
                    "banks:create", "banks:read", "banks:update", "banks:delete", "banks:list",
                    "customers:create", "customers:read", "customers:update", "customers:delete", "customers:list", "customers:export",
                    "dashboard:view", "reports:generate", "reports:export", "analytics:view"
                ]
            },
            {
                "name": "manager",
                "description": "Manager with limited administrative access",
                "permissions": [
                    "users:read", "users:update", "users:list", "users:status",
                    "roles:read", "roles:list",
                    "permissions:read", "permissions:list",
                    "banks:create", "banks:read", "banks:update", "banks:list",
                    "customers:create", "customers:read", "customers:update", "customers:list", "customers:export",
                    "dashboard:view", "reports:generate", "reports:export", "analytics:view"
                ]
            },
            {
                "name": "user",
                "description": "Regular user with basic access",
                "permissions": [
                    "users:read",
                    "banks:read", "banks:list",
                    "customers:read", "customers:list",
                    "dashboard:view"
                ]
            },
            {
                "name": "viewer",
                "description": "Read-only access user",
                "permissions": [
                    "banks:read", "banks:list",
                    "customers:read", "customers:list",
                    "dashboard:view"
                ]
            }
        ]
        
        return roles
    
    @staticmethod
    def generate_users(num_users: int = 20) -> List[Dict[str, Any]]:
        """Generate diverse user data."""
        users = []
        
        # Create default admin user
        users.append({
            "username": "admin",
            "password_hash": DataFactory.hash_password("password123"),
            "role_name": "admin",
            "status": "active",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
        })
        
        # Create default manager user
        users.append({
            "username": "manager",
            "password_hash": DataFactory.hash_password("password123"),
            "role_name": "manager",
            "status": "active",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=manager"
        })
        
        # Create default regular user
        users.append({
            "username": "user",
            "password_hash": DataFactory.hash_password("password123"),
            "role_name": "user",
            "status": "active",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
        })
        
        # Generate additional random users
        statuses = ["active", "inactive", "suspended"]
        role_names = ["admin", "manager", "user", "viewer"]
        
        for i in range(num_users - 3):
            # Generate unique username
            base_username = fake.user_name()
            username = f"{base_username}_{i+1}" if len(base_username) > 45 else base_username
            
            users.append({
                "username": username[:50],  # Ensure it fits in the 50 char limit
                "password_hash": DataFactory.hash_password("password123"),
                "role_name": random.choice(role_names),
                "status": random.choices(statuses, weights=[80, 15, 5])[0],  # 80% active, 15% inactive, 5% suspended
                "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
            })
        
        return users

    @staticmethod
    def generate_banks(num_banks: int = 15) -> List[Dict[str, Any]]:
        """Generate realistic Cambodian bank data."""
        banks = []

        # Real Cambodian banks for more realistic data
        real_banks = [
            {"name": "ABA Bank", "desc": "Advanced Bank of Asia Limited, a leading commercial bank in Cambodia"},
            {"name": "ACLEDA Bank", "desc": "ACLEDA Bank Plc, the largest local commercial bank in Cambodia"},
            {"name": "Canadia Bank", "desc": "Canadia Bank Plc, one of the oldest and largest local banks"},
            {"name": "Campu Bank", "desc": "Cambodian Public Bank, a premier commercial bank"},
            {"name": "Sathapana Bank", "desc": "Sathapana Bank Plc, a leading commercial bank in Cambodia"},
            {"name": "FTB Bank", "desc": "Foreign Trade Bank of Cambodia, the first commercial bank in Cambodia"},
            {"name": "BIDC Bank", "desc": "Bank for Investment and Development of Cambodia"},
            {"name": "J Trust Royal Bank", "desc": "A major joint venture commercial bank"},
            {"name": "Wing Bank", "desc": "Wing Bank (Cambodia) Plc, leading mobile banking service provider"},
            {"name": "Vattanac Bank", "desc": "Vattanac Bank, a Cambodian-owned commercial bank"},
            {"name": "Prince Bank", "desc": "Prince Bank Plc, offering comprehensive banking services"},
            {"name": "SBI Ly Hour Bank", "desc": "SBI Ly Hour Bank Plc, offering retail and commercial banking"},
            {"name": "Maybank Cambodia", "desc": "Maybank (Cambodia) Plc, subsidiary of Malaysia's largest bank"},
            {"name": "BRED Bank", "desc": "BRED Bank Cambodia, European bank operating in Cambodia"},
            {"name": "Shinhan Bank", "desc": "Shinhan Bank Cambodia, subsidiary of Shinhan Financial Group"}
        ]

        for i in range(min(num_banks, len(real_banks))):
            bank_data = real_banks[i]
            banks.append({
                "bank_name": bank_data["name"],
                "logo": f"https://ui-avatars.com/api/?name={bank_data['name'].replace(' ', '+')}&background=random&color=fff&size=128",
                "description": bank_data["desc"],
                "created_by_user_name": "admin"  # Will be resolved to user ID later
            })

        # Generate additional banks if needed
        if num_banks > len(real_banks):
            for i in range(len(real_banks), num_banks):
                company_name = fake.company()
                bank_name = f"{company_name} Bank" if not company_name.endswith('Bank') else company_name

                banks.append({
                    "bank_name": bank_name[:255],  # Ensure it fits in the 255 char limit
                    "logo": f"https://ui-avatars.com/api/?name={bank_name.replace(' ', '+')}&background=random&color=fff&size=128",
                    "description": fake.catch_phrase()[:1000],  # Ensure it fits in description limit
                    "created_by_user_name": random.choice(["admin", "manager"])
                })

        return banks

    @staticmethod
    def generate_customers(num_customers: int = 50, bank_names: List[str] = None, user_names: List[str] = None) -> List[Dict[str, Any]]:
        """Generate diverse customer data."""
        customers = []

        # Customer types for CRM system
        customer_types = ["individual", "business", "corporate", "premium", "vip"]

        # Common currencies
        currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]

        # Default values if not provided
        if bank_names is None:
            bank_names = ["ABA Bank", "ACLEDA Bank", "Canadia Bank"]
        if user_names is None:
            user_names = ["admin", "manager", "user"]

        for i in range(num_customers):
            # Generate customer ID (format: CUST-YYYYMMDD-XXXX)
            customer_id = f"CUST-{fake.date_this_year().strftime('%Y%m%d')}-{fake.random_int(1000, 9999)}"

            # Generate amounts with realistic distributions
            customer_type = random.choice(customer_types)
            if customer_type == "vip":
                credit = Decimal(str(random.uniform(100000, 1000000)))
                amount = Decimal(str(random.uniform(50000, 500000)))
            elif customer_type == "corporate":
                credit = Decimal(str(random.uniform(50000, 500000)))
                amount = Decimal(str(random.uniform(25000, 250000)))
            elif customer_type == "premium":
                credit = Decimal(str(random.uniform(25000, 100000)))
                amount = Decimal(str(random.uniform(10000, 50000)))
            elif customer_type == "business":
                credit = Decimal(str(random.uniform(10000, 50000)))
                amount = Decimal(str(random.uniform(5000, 25000)))
            else:  # individual
                credit = Decimal(str(random.uniform(1000, 25000)))
                amount = Decimal(str(random.uniform(500, 10000)))

            # Round to 2 decimal places
            credit = credit.quantize(Decimal('0.01'))
            amount = amount.quantize(Decimal('0.01'))

            # Generate note (optional)
            note = None
            if random.random() < 0.3:  # 30% chance of having a note
                note = fake.sentence(nb_words=random.randint(5, 15))[:255]

            customers.append({
                "customer_id": customer_id,
                "type": customer_type,
                "currency": random.choices(currencies, weights=[50, 20, 15, 8, 5, 2])[0],  # USD most common
                "credit": credit,
                "amount": amount,
                "bank_name": random.choice(bank_names),
                "note": note,
                "created_by_user_name": random.choice(user_names)
            })

        return customers
