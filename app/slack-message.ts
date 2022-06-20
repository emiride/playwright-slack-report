//@ts-check
import { IncomingWebhook } from '@slack/webhook';
import ResultsParser from './results-parser';

export default class SlackMessage {
  testResults: ResultsParser;
  constructor(testResults: ResultsParser) {
    this.testResults = testResults;
  }

  async send(slackWebhookUrl: string, actionInfo) {
    const webhook = new IncomingWebhook(slackWebhookUrl);
    const blocks = this.getBlocks(this.testResults);
    await webhook.send({ text: "Test results", blocks: JSON.parse(blocks) });
  }

  private getFailedTestsSections(failed, failedTestsList: string[]): string {
    const template = (testName, isFailed) =>  `{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "${isFailed ? ":red_circle: " + testName : ":tada: *ALL PASSED*"} "
        }
    },`;
    if (!failed) {
        return template("", false);
    }
    else{
        return failedTestsList.map(testName => template(testName, true)).join("\n");
    }
  }

  getBlocks(testResults: ResultsParser): string {
    const failedTests = testResults.failedTests;
    const skippedTests = testResults.skippedTests;
    const passedTests = testResults.passedTests;
    const failedTestsList = testResults.failedTestsList;
    const failed = failedTests > 0;
    const failedTestsSections = this.getFailedTestsSections(failed, failedTestsList);
  const nesta = `
  [
    {
        "type": "context",
        "elements": [
            {
                "type": "plain_text",
                "text": "Action: TODO",
                "emoji": true
            }
        ]
    },
    {
        "type": "divider"
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "${failed ? ":red_circle: *FAILED*" : ":large_green_circle: *PASSED*"}"
        }
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": ":clock1: *Execution time:* ${testResults.executionTime}"
        }
    },
    {
        "type": "divider"
    },
    ${failedTestsSections}
    {
        "type": "divider"
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Go to Action",
                    "emoji": true
                },
                "value": "action_go",
                "url": "https://google.com"
            }
        ]
    }
]
  `
  return nesta;
    }
}