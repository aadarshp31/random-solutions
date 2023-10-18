import dotenv from 'dotenv';
import GithubAPI from './helpers/GithubAPI';
import notifier from 'node-notifier';

dotenv.config();

(async () => {
  // @ts-ignore
  const contributions = await GithubAPI.getContributionsForUser(process.env.USERNAME);

  if (!contributions || contributions.length === 0) {
    const message = 'No contributions found!';
    console.error(message);
    // notify the user via system notification
    notifier.notify({
      title: 'Gitub Contribution Update',
      message: message,
      sound: 'ping', // Play a sound notification
      wait: true, // Wait with callback, until user action is taken against notification,
      timeout: 300000,
    });
    return;
  }

  const contribution = contributions.find((item: any) => {
    return (item.type === 'PushEvent' || item.type === 'CreateEvent');
  });

  if (!contribution) {
    const message = 'Couldn\'t find any contributions recently done.';
    console.log(message);
    // notify the user via system notification
    notifier.notify({
      title: 'Gitub Contribution Update',
      message: message,
      sound: 'ping', // Play a sound notification
      wait: true, // Wait with callback, until user action is taken against notification,
      timeout: 300000,
    });
    return;
  }

  const eventType: 'PushEvent' | 'CreateEvent' | 'WatchEvent' = contribution.type;

  let infoMessage = '';
  switch (eventType) {
    case 'PushEvent':
    case 'CreateEvent':
      const latestCommitDate = new Date(contribution.created_at).toDateString();
      const CurrentDate = new Date().toDateString();

      if (latestCommitDate === CurrentDate) {
        infoMessage = `Already Contributed today!\nLast contribution done on: ${new Date(contribution.created_at).toLocaleString()}`;
        console.info(infoMessage);
        // notify the user via system notification
        notifier.notify({
          title: 'Gitub Contribution Update',
          message: infoMessage,
          sound: 'ping', // Play a sound notification
          wait: true, // Wait with callback, until user action is taken against notification,
          timeout: 300000,
        });
        return;
      }

      infoMessage = `You've yet not contributed today on Github.\nLast contribution done on: ${new Date(contribution.created_at).toLocaleString()}`;
      console.warn(infoMessage);
      // notify the user via system notification
      notifier.notify({
        title: 'Gitub Contribution Update',
        message: infoMessage,
        sound: 'ping', // Play a sound notification
        wait: true, // Wait with callback, until user action is taken against notification,
        timeout: 300000,
      });
      break;

    default:
      infoMessage = 'Couldn\'t find any contributions recently done.';
      console.error(infoMessage);
      // notify the user via system notification
      notifier.notify({
        title: 'Gitub Contribution Update',
        message: infoMessage,
        sound: 'ping', // Play a sound notification
        wait: true, // Wait with callback, until user action is taken against notification,
        timeout: 300000,
      });
      break;
  }
})();