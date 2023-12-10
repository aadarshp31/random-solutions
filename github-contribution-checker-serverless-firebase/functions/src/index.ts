/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import axios from 'axios';

export const checkGitHubContributions = functions.pubsub.schedule('every 24 hours').timeZone('Etc/UTC').onRun(async (context) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    const currentDate = new Date().toISOString().split('T')[0];
    const githubEndpoint = `https://api.github.com/users/${username}/events`;

    // Fetch GitHub events
    const response = await axios.get(githubEndpoint);

    // Check if there's a contribution for today
    const hasContributionToday = response.data.some((event: any) => {
      return event.type === 'PushEvent' && event.created_at.includes(currentDate);
    });

    // Perform action if there's no contribution today
    if (!hasContributionToday) {
      // Perform your desired action here
      console.log('No contribution today. Performing action...');
      logger.info('No contribution today. Performing action...');
      // For example, send a notification, trigger another function, etc.
    } else {
      console.log('Contributions found today. No action needed.');
      logger.info('Contributions found today. No action needed.');
    }

    return null;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null;
  }
});

