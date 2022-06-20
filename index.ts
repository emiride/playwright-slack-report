import dotenv from 'dotenv';
import * as core from '@actions/core';
import * as github from '@actions/github';
import ResultsParser from './app/results-parser.js';
import SlackMessage from './app/slack-message.js';
import ActionInfo from './app/action-info.js';

dotenv.config();
let slackWebhookUrl = core.getInput("") ? core.getInput("") : process.env.SLACK_WEBHOOK_URL;
(async () => {
  const result = new ResultsParser("results2.xml");
  await result.parse();
  await new SlackMessage(result).send(slackWebhookUrl, new ActionInfo());
})();