'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

// // （テンプレートにもともとあったやつ、使わない)
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'GREETINGS') {
//     const message = `Hi ${
//       sender.tab ? 'Con' : 'Pop'
//     }, my name is Bac. I am from Background. It's great to hear from you.`;

//     // Log message coming from the `request` parameter
//     console.log(request.payload.message);
//     // Send a response message
//     sendResponse({
//       message,
//     });
//   }
// });

// キーコマンドが入力されたときに呼ばれる関数をセット
chrome.commands.onCommand.addListener(function (command) {
  console.log("Hit command!")

  // キーコマンドが入力されたときにcontentScript.jsにメッセージを送り、選択個所を住所などとして保存させる
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

// コンテクストメニュー（右クリック）の表示
// ここ参考 -> https://qiita.com/plumfield56/items/e98c247888d82a79c7ea
chrome.runtime.onInstalled.addListener(() => {
  const parent = chrome.contextMenus.create({
    id: 'parent',
    title: 'SellerInfoValidator',
    contexts: ["selection"]       // テキスト選択時のみ表示される
  });
  chrome.contextMenus.create({
    id: 'streetAddress',
    parentId: 'parent',
    title: '住所として選択',
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: 'postalCode',
    parentId: 'parent',
    title: '郵便番号として選択',
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: 'phoneNumber',
    parentId: 'parent',
    title: '電話番号として選択',
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: 'emailAddress',
    parentId: 'parent',
    title: 'メールアドレスとして選択',
    contexts: ["selection"]
  });
});

// 現在のタブにメッセージ送るだけの関数
function sendMessageToCurrentTab(content) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, content, function (response) {
      console.log(response);
    });
  });
}

// メニューをクリック時に実行される関数の登録
chrome.contextMenus.onClicked.addListener(item => {
  console.log(item);
  console.log(item.menuItemId);

  // contentScripにメッセージを送信し、選択されたテキストの情報を保存させる
  switch (item.menuItemId) {
    case "streetAddress":
      sendMessageToCurrentTab({ text: "select-street-address" });
      break;
    case "postalCode":
      sendMessageToCurrentTab({ text: "select-postal-code" });
      break;
    case "phoneNumber":
      sendMessageToCurrentTab({ text: "select-phone-number" });
      break;
    case "emailAddress":
      sendMessageToCurrentTab({ text: "select-email-address" });
      break;
    default:
      console.log(`Unknown context menu selected. ${item.menuItemId}`);
  }
});
