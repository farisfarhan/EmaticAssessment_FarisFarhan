const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const client = require('@mailchimp/mailchimp_marketing');

const apiKey = "a654f5ddfb31e732e94af681c661de42-us14";
const server = "us14";
const listId = "4b7ba719ba";
const campaignId = "5e18fd3253";

app.use(express());
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

client.setConfig({
  apiKey: apiKey,
  server: server,
});

const run = async () => {
  try {

    const test = await client.ping.get();
    console.log(test);
    //I need to delete list since free mailchimp account only allow one list
    const deleteResponse = await client.lists.deleteList(listId);
    console.log("deleted previous list. Response:" + deleteResponse);
    console.log("Moving to next step: create list")

    //step 1: create a list
    const event = {
      name: "EmaticSolutionsAssessment"
    };
    
    const footerContactInfo = {
      company: "FarisXEmaticSolutionsAssessment",
      address1: "Batu 25 1/2",
      address2: "Kg Ramuan China Kechil",
      city: "Masjid Tanah",
      state: "Melaka",
      zip: "78100",
      country: "MY"
    };
    
    const campaignDefaults = {
      from_name: "Faris Farhan Mohamed",
      from_email: "farisfarhanmohamed@gmail.com",
      subject: "Ematic Solution Assessment for Faris Farhan",
      language: "EN_US"
    };
    
    const response = await client.lists.createList({
      name: event.name,
      contact: footerContactInfo,
      permission_reminder: "permission_reminder",
      email_type_option: true,
      campaign_defaults: campaignDefaults
    });
  
    console.log(
      `Successfully created an audience/list. The list id is ${response.id}.`
    );
    console.log("moving to step2: addEmail ")

    //step 2: add my email to the list
    const response2 = await client.lists.addListMember(response.id, {
      email_address: "farisfarhanmohamed@gmail.com",
      status: "subscribed",
    });
    console.log("successfully added my email, response: " + response2);
    console.log("moving to step3: adding your emails");

    //step3: add your emails to the list
    const response3_1 = await client.lists.addListMember(response.id, {
      email_address: "ryan.ramadhan@ematicsolutions.com",
      status: "subscribed",
    });

    const response3_2 = await client.lists.addListMember(response.id, {
      email_address: "edwin.melendez@ematicsolutions.com",
      status: "subscribed",
    });

    const response3_3 = await client.lists.addListMember(response.id, {
      email_address: "christianto@ematicsolutions.com",
      status: "subscribed",
    });
    console.log("successfully added your emails, response: " + response3_1 + response3_2 + response3_3);
    console.log("moving to step4: sending campaign to list");

    //step 4: Send a campaign to the list
    const response4 = await client.campaigns.send(campaignId);
    console.log("successfully sent campaigns. Reponse: " + response4);
    console.log("moving to step5: Retrieve campaign info and print info");

    //step 5: Retrieving campaign info and print in console.log
    const response5 = await client.campaigns.get(campaignId);
    console.log("Successfully retrieved campaign. Campaign info: " + response5);

    console.log("All done! Thank you. :)")
  } catch (e) {
    console.error(e);
  }

}

run();

app.listen(5000, () => {
  console.log('server is running on 5000')
})