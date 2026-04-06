# Expense Tracker with Cashfree Payment

## Setup

1. Install dependencies:
   npm install

2. Edit `.env` file:
   - Add your MySQL credentials
   - Add your Cashfree App ID and Secret Key from https://merchant.cashfree.com

3. Run:
   node app.js

4. Open http://localhost:3000

## Notes
- Cashfree is set to SANDBOX mode
- To go live: change `Cashfree.Environment.SANDBOX` to `Cashfree.Environment.PRODUCTION` in routes/payment.js
- Also change `Cashfree({ mode: 'sandbox' })` to `Cashfree({ mode: 'production' })` in dashboard.html
- Premium membership price is set to ₹499 (change in routes/payment.js)
