export async function GET() {
    const mockData = {
        "fraudulent_apps": [
          {
            "app_name": "FakeBank Pro",
            "developer": "XYZ Solutions",
            "category": "Finance",
            "risk_level": "High",
            "reported_on": "2025-03-15",
            "preventive_measures": [
        "Verify app developer through official banking websites",
        "Check for proper SSL encryption (https://)",
        "Enable two-factor authentication for financial apps",
        "Regularly monitor bank statements for suspicious activity"
      ]
          },
          {
            "app_name": "FreeCryptoWin",
            "developer": "ABC Corp",
            "category": "Trading",
            "risk_level": "Medium",
            "reported_on": "2025-03-12",
            "preventive_measures": [
        "Verify app developer through official banking websites",
        "Check for proper SSL encryption (https://)",
        "Enable two-factor authentication for financial apps",
        "Regularly monitor bank statements for suspicious activity"
      ]
          },
          {
            "app_name": "LoanFastNow",
            "developer": "QuickMoney Ltd",
            "category": "Finance",
            "risk_level": "High",
            "reported_on": "2025-03-10",
            "preventive_measures": [
        "Verify app developer through official banking websites",
        "Check for proper SSL encryption (https://)",
        "Enable two-factor authentication for financial apps",
        "Regularly monitor bank statements for suspicious activity"
      ]
          },
          {
            "app_name": "MusicDownloader",
            "developer": "Unknown Dev",
            "category": "Entertainment",
            "risk_level": "Low",
            "reported_on": "2025-03-09",
            "preventive_measures": [
        "Verify app developer through official banking websites",
        "Check for proper SSL encryption (https://)",
        "Enable two-factor authentication for financial apps",
        "Regularly monitor bank statements for suspicious activity"
      ]
          },
          {
            "app_name": "InstaFollowers",
            "developer": "GrowthHackers Inc",
            "category": "Social Media",
            "risk_level": "Medium",
            "reported_on": "2025-03-07",
            "preventive_measures": [
        "Verify app developer through official banking websites",
        "Check for proper SSL encryption (https://)",
        "Enable two-factor authentication for financial apps",
        "Regularly monitor bank statements for suspicious activity"
      ]
          }
        ],
        "fraudulent_urls": [
          {
            "url": "http://free-money-now.com",
            "risk_level": "High",
            "detected_on": "2025-03-14",
            "category": "Phishing",
            "preventive_measures": [
        "Never enter personal information on suspicious links",
        "Check URL spelling carefully for typosquatting",
        "Use browser phishing protection extensions",
        "Hover over links to verify destination before clicking"
      ]
          },
          {
            "url": "http://get-rich-fast.biz",
            "risk_level": "Medium",
            "detected_on": "2025-03-12",
            "category": "Scam",
            "preventive_measures": [
        "Never enter personal information on suspicious links",
        "Check URL spelling carefully for typosquatting",
        "Use browser phishing protection extensions",
        "Hover over links to verify destination before clicking"
      ]
          },
          {
            "url": "http://unlimited-downloads.net",
            "risk_level": "Low",
            "detected_on": "2025-03-10",
            "category": "Malware",
            "preventive_measures": [
        "Never enter personal information on suspicious links",
        "Check URL spelling carefully for typosquatting",
        "Use browser phishing protection extensions",
        "Hover over links to verify destination before clicking"
      ]
          },
          {
            "url": "http://win-bitcoins-today.com",
            "risk_level": "High",
            "detected_on": "2025-03-09",
            "category": "Crypto Scam",
            "preventive_measures": [
        "Never enter personal information on suspicious links",
        "Check URL spelling carefully for typosquatting",
        "Use browser phishing protection extensions",
        "Hover over links to verify destination before clicking"
      ]
          },
          {
            "url": "http://fakebank-login.com",
            "risk_level": "High",
            "detected_on": "2025-03-06",
            "category": "Phishing",
            "preventive_measures": [
        "Never enter personal information on suspicious links",
        "Check URL spelling carefully for typosquatting",
        "Use browser phishing protection extensions",
        "Hover over links to verify destination before clicking"
      ]
          }
        ],
        "fraud_trends_30_days": [
          { "date": "2025-02-18", "fraud_cases_detected": 12 },
          { "date": "2025-02-19", "fraud_cases_detected": 15 },
          { "date": "2025-02-20", "fraud_cases_detected": 18 },
          { "date": "2025-02-21", "fraud_cases_detected": 20 },
          { "date": "2025-02-22", "fraud_cases_detected": 25 },
          { "date": "2025-02-23", "fraud_cases_detected": 22 },
          { "date": "2025-02-24", "fraud_cases_detected": 27 },
          { "date": "2025-02-25", "fraud_cases_detected": 30 },
          { "date": "2025-02-26", "fraud_cases_detected": 28 },
          { "date": "2025-02-27", "fraud_cases_detected": 35 },
          { "date": "2025-02-28", "fraud_cases_detected": 40 },
          { "date": "2025-02-29", "fraud_cases_detected": 42 },
          { "date": "2025-03-01", "fraud_cases_detected": 38 },
          { "date": "2025-03-02", "fraud_cases_detected": 37 },
          { "date": "2025-03-03", "fraud_cases_detected": 50 },
          { "date": "2025-03-04", "fraud_cases_detected": 45 },
          { "date": "2025-03-05", "fraud_cases_detected": 52 },
          { "date": "2025-03-06", "fraud_cases_detected": 55 },
          { "date": "2025-03-07", "fraud_cases_detected": 58 },
          { "date": "2025-03-08", "fraud_cases_detected": 60 },
          { "date": "2025-03-09", "fraud_cases_detected": 62 },
          { "date": "2025-03-10", "fraud_cases_detected": 65 },
          { "date": "2025-03-11", "fraud_cases_detected": 67 },
          { "date": "2025-03-12", "fraud_cases_detected": 70 },
          { "date": "2025-03-13", "fraud_cases_detected": 75 },
          { "date": "2025-03-14", "fraud_cases_detected": 80 },
          { "date": "2025-03-15", "fraud_cases_detected": 85 },
          { "date": "2025-03-16", "fraud_cases_detected": 90 },
          { "date": "2025-03-17", "fraud_cases_detected": 95 },
          { "date": "2025-03-18", "fraud_cases_detected": 100 }
        ],
        "user_authentication": [
          {
            "email": "admin@frauddashboard.com",
            "password_hashed": "$2a$10$XYZ1234abcd$",
            "role": "Admin"
          },
          {
            "email": "analyst@frauddashboard.com",
            "password_hashed": "$2a$10$ABC5678efgh$",
            "role": "Analyst"
          }
        ]
    };
      
  
    return new Response(JSON.stringify(mockData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }