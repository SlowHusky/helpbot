// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const fetch = require("node-fetch");

const baseUrl = "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&closed=False&site=stackoverflow"



// // Get all the questions (http://api.stackexchange.com/docs/questions)
// context.questions.questions(filter, function(err, results){
//   if (err) throw err;
//
//   console.log(results.items);
//   console.log(results.has_more);
// });
//
// // Get all users
// context.users.users(filter, function(err, results){
//   if (err) throw err;
//
//   console.log(results.items);
//   console.log(results.has_more);
// });

class MyBot {

    async getQuestions(turnContext, q) {
      try {
        var url = `${ baseUrl }&q=${ q }`;
        const response = await fetch(url);
        const json = await response.json();

        var items = json.items.slice(0, 4).map(i => `${ i.title } - ${ i.link }`).join("\n");

        console.log(items);

        if (items.length == 0) {
          await turnContext.sendActivity("No results found!");
        } else {
          await turnContext.sendActivity(`${ items }`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            await this.getQuestions(turnContext, turnContext.activity.text);

        } else {
            //await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }
}

module.exports.MyBot = MyBot;
