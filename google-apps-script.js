/**
 * ============================================================================
 * Google Apps Script for Asish & Rachel Wedding RSVP Integration
 * ============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new blank spreadsheet.
 * 2. Rename your spreadsheet (e.g., "Asish & Rachel Wedding RSVPs").
 * 3. Click on "Extensions" in the top menu -> Select "Apps Script".
 * 4. Clear any existing code in Code.gs and paste all the code from this file into Code.gs.
 * 5. Click "Save project" (the disk icon).
 * 6. Click "Deploy" button (top right) -> Select "New deployment".
 * 7. Click the gear icon next to "Select type" -> Choose "Web app".
 * 8. Configure the deployment settings:
 *    - Description: "Wedding RSVP Web App"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (IMPORTANT: Must be "Anyone", NOT "Anyone with Google account")
 * 9. Click "Deploy".
 * 10. Click "Authorize access", select your Google account, click "Advanced" -> "Go to Untitled project (unsafe)" -> "Allow".
 * 11. Copy the generated "Web app URL" (looks like: https://script.google.com/macros/s/AKfycb.../exec).
 * 12. Paste the Web App URL into `js/main.js` in the `SCRIPT_URL` variable:
 *     var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwF_rH8Brdu9WZ4frjkehRgXYxXO0D0mb6VGw-w-lMOVfckjz-0PZ4hi8nlxdYSvg/exec';
 * ============================================================================
 */

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    var name      = data.name || 'Guest';
    var side      = data.side || 'Groom Side';
    var attending = data.attending || 'Yes';
    var guests    = data.guests || '1';
    var wish      = data.wish || '';

    // Append to sheet: [Timestamp, Full Name, Side, Attending, Number of Guests, Warm Wishes]
    sheet.appendRow([timestamp, name, side, attending, guests, wish]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var action = e && e.parameter ? e.parameter.action : '';
    
    // Fetch warm wishes to display on website wishes wall if requested
    if (action === 'getWishes') {
      var sheet = getOrCreateSheet();
      var rows = sheet.getDataRange().getValues();
      var wishes = [];
      
      // Skip header row (row index 0)
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var name = row[1]; // Column B: Full Name
        var wish = row[5]; // Column F: Warm Wishes
        if (wish && String(wish).trim() !== '') {
          wishes.push({
            name: String(name || 'Well-wisher').trim(),
            wish: String(wish).trim()
          });
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', wishes: wishes }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'online', message: 'RSVP Web App is active and ready to accept responses.' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName('RSVP');
  if (!sheet) {
    sheet = doc.insertSheet('RSVP');
    sheet.appendRow(['Timestamp', 'Full Name', 'Side', 'Attending', 'Number of Guests', 'Warm Wishes']);
    var headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#F4EAE1');
  }
  return sheet;
}
