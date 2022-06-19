import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

try {
    
    let slackWebhookUrl = core.getInput('slack-webhook-url');
    (async () => {
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({"text": "Hello, world."})
      });
    })();
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }