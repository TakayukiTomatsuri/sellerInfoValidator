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

  // const streetAddressStorage = {
  //   get: cb => {
  //     chrome.storage.sync.get(['streetAddress'], result => {
  //       cb(result.streetAddress);
  //     });
  //   },
  //   set: (value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         streetAddress: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };

  // const phoneNumberStorage = {
  //   get: cb => {
  //     chrome.storage.sync.get(['phoneNumber'], result => {
  //       cb(result.phoneNumber);
  //     });
  //   },
  //   set: (value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         phoneNumber: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };

  // const emailAddressStorage = {
  //   get: cb => {
  //     chrome.storage.sync.get(['emailAddress'], result => {
  //       cb(result.emailAddress);
  //     });
  //   },
  //   set: (value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         emailAddress: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };


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
         
          // Eメールアドレス
          document.getElementById('emailAddressVal').innerHTML = response.sellerInfo.emailAddress;
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
