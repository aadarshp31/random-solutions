require('dotenv').config();
const fetch = require('node-fetch');
const path = require('path');
const cheerio = require('cheerio');
const notifier = require('node-notifier');
const fs = require('fs');
const FormData = require('form-data');

const trackingNumber = process.env.BLUEDART_TRACKING_WAYBILL_NUMBER;
const url = `https://www.bluedart.com/web/guest/trackdartresult?trackFor=0&trackNo=${trackingNumber}`;

let previousTime = '';

async function getLatestStatus() {
  try {
    const response = await fetch(url, {
      method: 'get',
      headers: { 'Content-Type': 'text/html' }
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const latestStatus = {
      location: $('.table-bordered tbody:eq(1)').children().eq(0).children().eq(0).text(),
      details: $('.table-bordered tbody:eq(1)').children().eq(0).children().eq(1).text(),
      date: $('.table-bordered tbody:eq(1)').children().eq(0).children().eq(2).text(),
      time: $('.table-bordered tbody:eq(1)').children().eq(0).children().eq(3).text()
    }
    return latestStatus;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}

async function checkForUpdates() {
  const latestStatus = await getLatestStatus();

  if (latestStatus && latestStatus.time !== previousTime) {
    console.log('New Update at:', new Date().toLocaleTimeString());
    console.log(latestStatus);

    notifier.notify({
      title: 'Blue Dart Shipment Update',
      message: `Details: ${latestStatus.details}\nLocation: ${latestStatus.location}\nTime: ${latestStatus.time}\n Date: ${latestStatus.date}`,
      sound: 'ping', // Play a sound notification
      icon: fs.readFileSync(path.join(__dirname, 'assets/image/bluedart_logo.jpeg')),
      wait: true, // Wait with callback, until user action is taken against notification,
      timeout: 300000,
    });

    previousTime = latestStatus.time;

    // notify me on mail
    const formData = new FormData();
    formData.append('name', 'bluedart-status-checker-app');
    formData.append('subject', 'Tracking Update');
    formData.append('email', process.env.TEST_EMAIL);
    formData.append('message', `Details: ${latestStatus.details}\nLocation: ${latestStatus.location}\nTime: ${latestStatus.time}\n Date: ${latestStatus.date}`);

    const res = await fetch(process.env.EMAIL_NOTIFICATION_URL, {
      method: 'POST',
      body: formData
    });

    switch (res.status) {
      case 200:
        console.log('Notified via email');
        break;

      default:
        console.error('failed to send email', res.status);
        break;
    }
    return;
  }

  console.log('Nothing changed:', new Date().toLocaleTimeString());
}

setInterval(checkForUpdates, process.env.POLLING_INTERVAL_IN_MS);

// Initial check for updates
checkForUpdates();
