'use strict';

import './popup.css';

// import chalk from "chalk";
// var cookieParser = require('cookie-parser');
// var ping = require('ping');
// const enrichment = require("imi-enrichment-address")
// const enrichment = require("../node_modules/imi-enrichment-address/bundle.js")

(function() {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: cb => {
      chrome.storage.sync.get(['count'], result => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter(initialValue = 0) {
    document.getElementById('counter').innerHTML = initialValue;

    document.getElementById('incrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'INCREMENT',
      });
    });

    document.getElementById('decrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'DECREMENT',
      });
    });
  }

  function updateCounter({ type }) {
    counterStorage.get(count => {
      let newCount;

      if (type === 'INCREMENT') {
        newCount = count + 1;
      } else if (type === 'DECREMENT') {
        newCount = count - 1;
      } else {
        newCount = count;
      }

      counterStorage.set(newCount, () => {
        document.getElementById('counter').innerHTML = newCount;

        // Communicate with content script of
        // active tab by sending a message
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tab = tabs[0];

          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'COUNT',
              payload: {
                count: newCount,
              },
            },
            response => {
              console.log('Current count value passed to contentScript file');
            }
          );
        });
      });
    });
  }

  function restoreCounter() {
    // Restore count value
    counterStorage.get(count => {
      if (typeof count === 'undefined') {
        // Set counter value as 0
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);

  // ---- 

  function checkSellerInfo() {
    document.getElementById('streetAddressVal').innerHTML = "replaced_OK!";

    document.getElementById('streetAddressBtn').addEventListener('click', () => {
      console.log("Button streetAddressBtn clicked!");
    });

    // データをフェッチする（ダミーデータがない場合、contentScript.jsの側で自動で作る）
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];

      chrome.tabs.sendMessage(
        tab.id,
        {
          type: 'GET-SELLER-INFO',
        },
        response => {
          console.log("Result for GET-SELLER-INFO are returned!!")
          console.log(response);

          // popup内に表示

          // 住所の生の値
          document.getElementById('streetAddressVal').innerHTML = response.sellerInfo.streetAddress;
          // 住所の正当性の確認結果
          getLatLng(response.sellerInfo.streetAddress, (latlng) => {
            // 普通に緯度経度を返してきたら正当
            document.getElementById('streetAddressValidationResult').innerHTML = "正当"
          },(error) => {
            // もしエラーを返すためのコールバック関数が呼ばれたら、正当じゃないってこと
            document.getElementById('streetAddressValidationResult').innerHTML = error
          })
          // ↑（コールバック関数が両方呼ばれうる場合はこのやり方ダメだが、たぶん片方しか呼ばれないハズ）
          // 住所の周辺の航空写真
          // (Google Maps Embed APIキーはまだ公開しないでください。無制限に使える状態です。いくら使ってもお金かからないはずだけど、BANされるかも。ふつうはリファラを利用し、埋め込み先サイトを制限するがChrome拡張機能だとサイトとかじゃないのでリファラで制限できるのか...?)
          document.getElementById('streetAddressImg').innerHTML = `<iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCMdL_FxjySdXcAVkYtK0Q3D9r_Z3mX_A0&zoom=17&maptype=satellite&q=${response.sellerInfo.streetAddress}"></iframe>`

          // 電話番号の生の値        
          document.getElementById('phoneNumberVal').innerHTML = response.sellerInfo.phoneNumber;
          // 電話番号の正当性の確認結果
          const phoneNumValidationResult = IMIEnrichmentContact(response.sellerInfo.phoneNumber);
          if(phoneNumValidationResult.hasOwnProperty('メタデータ')){
            document.getElementById('phoneNumberValidationResult').innerHTML = phoneNumValidationResult.メタデータ.説明;
          }else{
            document.getElementById('phoneNumberValidationResult').innerHTML = "正当";
          }
         
          // Eメールアドレスの生の値
          document.getElementById('emailAddressVal').innerHTML = response.sellerInfo.emailAddress;
          // メアドの形式確認
          // <!-- // See http://rosskendall.com/blog/web/javascript-function-to-check-an-email-address-conforms-to-rfc822 -->
          // function isEmail(email){
          //   return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );	
          // }
      
          // 正規表現で確かめる関数、ここ→からコピペした　　https://www.w3resource.com/javascript/form/example-javascript-form-validation-email-REC-2822.html
          function isEmail(text)
          {
            var mailformat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            if(text.match(mailformat))
            {
              // document.form1.text1.focus();
              // alert("Valid email address!");
              return true;
            }
            else
            {
              // alert("You have entered an invalid email address!");
              // document.form1.text1.focus();
              return false;
            }
          }

          if(isEmail(response.sellerInfo.emailAddress)){
            document.getElementById('emailAddressValidationResult').innerHTML = "正当";
          }else{
            document.getElementById('emailAddressValidationResult').innerHTML = "eメールアドレスがRFC2822に沿っていません";
          }

          // メアドのドメイン名のレピュテーションを調べる
          console.log("Querying reputation...");
          // const emailDomainName = `${response.sellerInfo.emailAddress}`.replace(/.*?@/, '');
          const urlEmailReputation = `https://emailrep.io/${response.sellerInfo.emailAddress}`; // リクエスト先URL
          console.log(urlEmailReputation);
          let request = new XMLHttpRequest();
          request.open('GET', urlEmailReputation);
          request.onreadystatechange = function () {
              if (request.readyState != 4) {
                  // リクエスト中
                  console.log("requesting...");
              } else if (request.status != 200) {
                  // 失敗
                  document.getElementById('emailAddressReputation').innerHTML = "取得に失敗しました";
              } else {
                  // 取得成功
                  // const resultJson = JSON.parse(request.responseText);
                  // TODO: curlでやったときみたいにJSONだけ返ってはこない。ページ丸ごと来る。User-Agentを見て応答を変えてる？
                  // TODO: これ、1日のアクセス数が厳しくてたぶん10回かそれ以下くらいしか使えない感じ
                  const resultJson = request.responseText;
                  console.log(resultJson);
                  document.getElementById('emailAddressReputation').innerHTML = resultJson;
              }
          };
          request.send();

          
          
        }
      );
    });
  }
  document.addEventListener('DOMContentLoaded', checkSellerInfo);


  // ----

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message);
    }
  );
})();
