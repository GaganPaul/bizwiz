import os
import uuid
from firebase_admin_setup import db

RULES = [
    {
        "category": "GST",
        "description": "GST Registration is mandatory if aggregate turnover exceeds Rs. 40 lakhs (goods) or Rs. 20 lakhs (services).",
        "applicability": "Businesses exceeding turnover thresholds.",
        "penalty": "10% of the tax due subject to a minimum of Rs. 10,000. For intentional fraud, 100% of tax due.",
        "recommended_action": "Apply for GST registration via GST portal and ensure monthly/quarterly return filing."
    },
    {
        "category": "Labour Laws",
        "description": "Provident Fund (PF) registration is mandatory for establishments with 20 or more employees.",
        "applicability": "Any establishment employing 20 or more persons.",
        "penalty": "Damages up to 100% of the arrears plus interest at 12% p.a. for delayed deposits.",
        "recommended_action": "Register with EPFO and deduct PF contributions from employee salaries monthly."
    },
    {
        "category": "Company Law",
        "description": "Filing of Annual Return (MGT-7) and Financial Statements (AOC-4) with ROC.",
        "applicability": "All registered companies in India.",
        "penalty": "Rs. 100 per day of default. Directors may face disqualification.",
        "recommended_action": "Ensure board meetings are held and annual returns filed within 30 days of AGM."
    },
    {
        "category": "MSME Compliance",
        "description": "Udyam Registration for micro, small, and medium enterprises to avail benefits.",
        "applicability": "Manufacturing and Service enterprises meeting MSME investment and turnover criteria.",
        "penalty": "No penalty for non-registration, but loss of government benefits and protection against delayed payments.",
        "recommended_action": "Register on the Udyam portal to get the MSME certificate."
    }
]

def seed_database():
    if not db:
        print("Database not initialized. Ensure firebase credentials are set.")
        return

    print("Seeding compliance_rules...")
    for rule in RULES:
        rule_id = str(uuid.uuid4())
        rule["id"] = rule_id
        db.collection("compliance_rules").document(rule_id).set(rule)
        print(f"Added rule: {rule['category']}")
        
    print("Seeding completed!")

if __name__ == '__main__':
    seed_database()
