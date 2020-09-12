'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);



// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  response => {
    console.log(response.message);
  }
);


  const sellerInfoStorage = {
    get:() => {
      const temp = sessionStorage.hasOwnProperty('sellerInfo');
      console.log(`Does have sellerInfo property?: ${temp}`);
  
      let sellerInfo = {};
      if(sessionStorage.hasOwnProperty('sellerInfo')) {
        sellerInfo = JSON.parse(sessionStorage["sellerInfo"]);
      }else{
        const dummyData = {
          streetAddress: `dummy streetAddress`,
          phoneNumber: `dummy phoneNumber`,
          emailAddress: `dummy emailtAddress`
        };
  
        sessionStorage["sellerInfo"] =  JSON.stringify(dummyData);
        sellerInfo = dummyData;
      }

      return sellerInfo;
    },
    set: (sellerInfo) => {
      sessionStorage["sellerInfo"] = JSON.stringify(sellerInfo);
    },
  };

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`recv MSG!!`);

  if (request.text == "select-street-address") {
    console.log(`hit command select-street-address!!`);
    const selection = window.getSelection().toString()
    console.log(`selected: ${selection}`)
    // const insertContent = `<samp>${selection}</samp>`;
    // document.execCommand("insertHTML", false, insertContent);

    let sellerInfo = sellerInfoStorage.get();
    sellerInfo.streetAddress = selection
    console.log(sellerInfo)
    sellerInfoStorage.set(sellerInfo)

    sendResponse({ "text": selection });
    return true;
  }

  if (request.text == "select-phone-number") {
    console.log(`hit command select-phone-number!!`);
    const selection = window.getSelection().toString()

    let sellerInfo = sellerInfoStorage.get();
    sellerInfo.phoneNumber = selection
    sellerInfoStorage.set(sellerInfo)

    sendResponse({ "text": selection });
    return true;
  }


  if (request.text == "select-email-address") {
    console.log(`hit command select-email-address!!`);
    const selection = window.getSelection().toString()

    let sellerInfo = sellerInfoStorage.get();
    sellerInfo.emailAddress = selection;
    sellerInfoStorage.set(sellerInfo)

    sendResponse({ "text": selection });
    return true;
  }

  

  if (request.type === 'COUNT') {
    console.log("type   COUNT received.")
    console.log(`Current count is ${request.payload.count}`);
  }

  if (request.type === 'SET-SELLER-INFO') {
    console.log("type SET-SELLER-INFO received.")
    console.log(request.payload)
    console.log(JSON.stringify(request.payload) )
    // JSON形式のオブジェクトを格納するときは文字列に直さなくちゃいけないらしい
    // sessionStorage["sellerInfo"] = JSON.stringify(request.payload);
    sellerInfoStorage.set(request.payload)
  }

  if (request.type === 'GET-SELLER-INFO') {
    console.log("type GET-SELLER-INFO received.")
    const sellerInfo = sellerInfoStorage.get();

    console.log(sellerInfo)
    sendResponse({ "sellerInfo": sellerInfo });
    return true;
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
