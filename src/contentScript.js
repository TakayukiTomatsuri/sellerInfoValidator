'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// // （テンプレートに元からあったやつ）
// // Log `title` of current active web page
// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );

// // （テンプレートに元からあったやつ）
// // Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   response => {
//     console.log(response.message);
//   }
// );

// // これを介して販売者情報を読み書きする
// // 販売者情報はタブごとに持っててほしいからcontentScript.jsで記録している
// const sellerInfoStorage = {
//   // JSON文字列を取り出しJSONオブジェクトにして返す
//   get: function() {
//     const temp = sessionStorage.hasOwnProperty('sellerInfo');
//     console.log(`Does have sellerInfo property?: ${temp}`);

//     let sellerInfo = {};
//     if(sessionStorage.hasOwnProperty('sellerInfo')) {
//       sellerInfo = JSON.parse(sessionStorage["sellerInfo"]);
//     }else{
//       const dummyData = {
//         streetAddress: {
//           rawValue: `dummy streetAddress`,
//         },
//         postalCode:{
//           rawValue: `dummy postalCode`,
//         } ,
//         phoneNumber: {
//           rawValue: `dummy phoneNumber`,
//         },
//         emailAddress: {
//           rawValue: `dummy emailtAddress`,
//         },
//       };

//       // JSON形式のオブジェクトを格納するときは文字列に直さなくちゃいけないらしい
//       sessionStorage["sellerInfo"] =  JSON.stringify(dummyData);
//       sellerInfo = dummyData;
//     }

//     return sellerInfo;
//   },
//   // JavaScriptオブジェクトを受け取る。JSON文字列に直して格納（このやりかたあまりよくなかった）
//   set: function(sellerInfo){
//     console.log(`sellerInfoStorage.set: ${sellerInfo}`);
//     console.log(sellerInfo);
//     sessionStorage["sellerInfo"] = JSON.stringify(sellerInfo);
//   },
//   add: function(sellerInfo){
//     console.log(`sellerInfoStorage.add: ${sellerInfo}`);
//     console.log(sellerInfo);
//     const currentSellerInfo = this.get();
//     this.set( Object.assign(sellerInfo, currentSellerInfo) );
//   }
// };



// メッセージが送られてきたら呼ばれる関数を登録する
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`recv MSG!!`);

  // これを介して販売者情報を読み書きする
  // 販売者情報はタブごとに持っててほしいからcontentScript.jsで記録している
  const sellerInfoStorage = {
    // JSON文字列を取り出しJSONオブジェクトにして返す
    get: function() {
      const temp = sessionStorage.hasOwnProperty('sellerInfo');
      console.log(`Does have sellerInfo property?: ${temp}`);

      let sellerInfo = {};
      if(sessionStorage.hasOwnProperty('sellerInfo')) {
        sellerInfo = JSON.parse(sessionStorage["sellerInfo"]);
      }else{
        // もしsellerInfoが存在しないなら空のオブジェクトを保存しとく
        // JSON形式のオブジェクトを格納するときは文字列に直さなくちゃいけないらしい
        const emptyObject = {};
        sessionStorage["sellerInfo"] =  JSON.stringify(emptyObject);
        sellerInfo = emptyObject;
      }

      return sellerInfo;
    },
    // JavaScriptオブジェクトを受け取る。JSON文字列に直して格納（このやりかたあまりよくなかった）
    set: function(sellerInfo){
      console.log(`sellerInfoStorage.set: ${sellerInfo}`);
      console.log(sellerInfo);
      sessionStorage["sellerInfo"] = JSON.stringify(sellerInfo);
    },
    add: function(sellerInfo){
      console.log(`sellerInfoStorage.add: ${sellerInfo}`);
      console.log(sellerInfo);
      const currentSellerInfo = this.get();
      this.set( Object.assign(currentSellerInfo, sellerInfo) );
    }
  };

  // 選択されたテキストを住所(or電話番号)などとして記録する
  if (request.text == "select-street-address") {
    console.log(`hit command select-street-address!!`);
    const selection = window.getSelection().toString()
    console.log(`selected: ${selection}`)
    // const insertContent = `<samp>${selection}</samp>`;
    // document.execCommand("insertHTML", false, insertContent);

    let sellerInfo = {};
    sellerInfo.streetAddress = {};
    sellerInfo.streetAddress.rawValue = selection;
    console.log(sellerInfo);
    sellerInfoStorage.add(sellerInfo);

    sendResponse({ "text": selection });
    return true;
  }
  // 選択されたテキストを住所(or電話番号)などとして記録する
  if (request.text == "select-postal-code") {
    console.log(`hit command select-postal-code!!`);
    const selection = window.getSelection().toString()
    console.log(`selected: ${selection}`)

    let sellerInfo = {};
    sellerInfo.postalCode = {};
    sellerInfo.postalCode.rawValue = selection;
    console.log(sellerInfo);
    sellerInfoStorage.add(sellerInfo);

    sendResponse({ "text": selection });
    return true;
  }

  if (request.text == "select-phone-number") {
    console.log(`hit command select-phone-number!!`);
    const selection = window.getSelection().toString()

    let sellerInfo = {};
    sellerInfo.phoneNumber = {};
    sellerInfo.phoneNumber.rawValue = selection;
    console.log(sellerInfo);
    sellerInfoStorage.add(sellerInfo);

    sendResponse({ "text": selection });
    return true;
  }


  if (request.text == "select-email-address") {
    console.log(`hit command select-email-address!!`);
    const selection = window.getSelection().toString()

    let sellerInfo = {};
    sellerInfo.emailAddress = {};
    sellerInfo.emailAddress.rawValue = selection;
    console.log(sellerInfo);
    sellerInfoStorage.add(sellerInfo);

    sendResponse({ "text": selection });
    return true;
  }

  
  // // （テンプレートにもともとあったやつ）
  // if (request.type === 'COUNT') {
  //   console.log("type   COUNT received.")
  //   console.log(`Current count is ${request.payload.count}`);
  // }

  // 販売者情報をSET/GETするためのもの
  if (request.type === 'SET-SELLER-INFO') {
    console.log("type SET-SELLER-INFO received.")
    console.log(request.payload)
    console.log(JSON.stringify(request.payload) )
    
    sellerInfoStorage.set(request.payload)
  }

  if (request.type === 'GET-SELLER-INFO') {
    console.log("type GET-SELLER-INFO received.")
    const sellerInfo = sellerInfoStorage.get();

    console.log(sellerInfo)
    sendResponse({ "sellerInfo": sellerInfo });
    return true;
  }

  // これは使われていないが将来的に必要になるかもしれない
  // if (request.type === 'ADD-SELLER-INFO') {
  //   console.log("type ADD-SELLER-INFO received.")

  //   const sellerInfo = sellerInfoStorage.add(request.payload);

  //   console.log(sellerInfo)
  //   // sendResponse({ "sellerInfo": sellerInfo });
  //   return true;
  // }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
