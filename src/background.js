'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }
});

chrome.commands.onCommand.addListener(function (command) {
  console.log("Hit command!")

  if (command === 'select-street-address') {
    console.log("Hit command select-street-address1!!")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Hit command select-street-address2!")
      chrome.tabs.sendMessage(tabs[0].id, { text: "select-street-address" }, function (response) {
        console.log("Hit command select-street-address3!")
        console.log(response);
      });
    });
  }


  if (command === 'select-phone-number') {
    console.log("Hit command select-phone-number!")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Hit command select-phone-number2!")
      chrome.tabs.sendMessage(tabs[0].id, { text: "select-phone-number" }, function (response) {
        console.log("Hit command select-phone-number3!")
        console.log(response);
      });
    });
  }

  if (command === 'select-email-address') {
    console.log("Hit command select-email-address!")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Hit command sselect-email-address2!")
      chrome.tabs.sendMessage(tabs[0].id, { text: "select-email-address" }, function (response) {
        console.log("Hit command select-email-address3!")
        console.log(response);
      });
    });
  }
});

// chrome.commands.getAll(function(commands){
//   console.log(commands)
// })
