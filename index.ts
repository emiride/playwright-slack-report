import dotenv from 'dotenv';
import * as core from '@actions/core';
import ResultsParser from './app/results-parser.js';
import SlackMessage from './app/slack-message.js';
import ActionInfo from './app/action-info.js';
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();
let slackWebhookUrl = core.getInput("slack-webhook-url") ? core.getInput("slack-webhook-url") : process.env.SLACK_WEBHOOK_URL;
let testOutputFile = core.getInput("directory-path") ? core.getInput("directory-path") : process.env.TEST_OUTPUT_FILE;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname.split('_actions')[0];
console.log('working directory: ' + rootDir);
console.log('test output file: ' + testOutputFile);
(async () => {
  const result = new ResultsParser(rootDir + testOutputFile);
  await result.parse();
  await new SlackMessage(result).send(slackWebhookUrl, new ActionInfo());
})();