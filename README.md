# Asish Varghese & Rachel Koshy Wedding Invitation

A elegant, interactive web invitation for the Engagement and Wedding of Asish Varghese and Rachel Koshy.

---

## 💌 RSVP & Google Sheets Integration

This website includes a complete RSVP form that submits guest responses directly to a Google Sheet using **Google Apps Script**.

### Step-by-Step Google Apps Script Setup:

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
   - Name it `Asish & Rachel Wedding RSVPs`.

2. **Open Apps Script Editor**:
   - In the top menu, click `Extensions` -> `Apps Script`.

3. **Paste the Script**:
   - Copy all contents from [`google-apps-script.js`](./google-apps-script.js).
   - Clear any default code in `Code.gs` and paste the script.
   - Click the **Save** (disk) icon.

4. **Deploy as Web App**:
   - Click **Deploy** (top right) -> **New deployment**.
   - Click the gear icon next to *Select type* -> Choose **Web app**.
   - Set parameters:
     - **Description**: `Wedding RSVP Service`
     - **Execute as**: `Me` (your Google email)
     - **Who has access**: `Anyone` *(Crucial: must be set to Anyone)*
   - Click **Deploy**.

5. **Authorize Permissions**:
   - Click **Authorize access**, choose your account.
   - Click **Advanced** -> **Go to Untitled project (unsafe)** -> **Allow**.

6. **Connect to Website**:
   - Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).
   - Open [`js/main.js`](./js/main.js) and replace `SCRIPT_URL` at line 751:
     ```javascript
     var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwF_rH8Brdu9WZ4frjkehRgXYxXO0D0mb6VGw-w-lMOVfckjz-0PZ4hi8nlxdYSvg/exec';
     ```

---

## 📊 Recorded Fields

The Google Sheet will automatically generate a sheet named `RSVP` with headers:
- `Timestamp`
- `Full Name`
- `Side` (Bride Side / Groom Side / Both)
- `Attending` (Yes / No)
- `Number of Guests`
- `Warm Wishes`