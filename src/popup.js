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
          document.getElementById('streetAddressVal').innerHTML = response.sellerInfo.streetAddress;


          // import chalk from "chalk";
          // console.log(chalk.bgCyan("これはテストメッセージです"));
          // const enrichment = require("imi-enrichment-address")
          // enrichment('東京都千代田区霞が関1-3-1').then(json => {
          //   console.log(JSON.stringify(json));
          // });

          // var hosts = ['google.com'];
          // ping.sys.probe(host, function(isAlive){
          //   var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
          //   console.log(msg);
          // });
          
          document.getElementById('phoneNumberVal').innerHTML = response.sellerInfo.phoneNumber;
          document.getElementById('emailAddressVal').innerHTML = response.sellerInfo.emailAddress;

          

        }
      );
    });
    // // とりあえず、ダミーデータを挿入する
    // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    //   const tab = tabs[0];

    //   console.log("Creating dummy data...")
    //   console.log(tab.id)

    //   chrome.tabs.sendMessage(
    //     tab.id,
    //     {
    //       type: 'SET-SELLER-INFO',
    //       payload: {
    //         streetAddress: `dummy streetAddress for ${tab.id}`,
    //         phoneNumber: `dummy phoneNumber for ${tab.id}`,
    //         emailAddress: `dummy emailtAddress for ${tab.id}`
    //       }
    //     },
    //     response => {
    //       console.log("Result for SET-SELLER-INFO are returned!")
    //       console.log(response);


    //     }
    //   );
    // });
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
