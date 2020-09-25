'use strict';

import './popup.css';

// import chalk from "chalk";
// var cookieParser = require('cookie-parser');
// var ping = require('ping');
// const enrichment = require("imi-enrichment-address")
// const enrichment = require("../node_modules/imi-enrichment-address/bundle.js")

(function() {
  // // We will make use of Storage API to get and store `count` value
  // // More information on Storage API can we found at
  // // https://developer.chrome.com/extensions/storage

  // // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // // More information on Permissions can we found at
  // // https://developer.chrome.com/extensions/declare_permissions
  // const counterStorage = {
  //   get: cb => {
  //     chrome.storage.sync.get(['count'], result => {
  //       cb(result.count);
  //     });
  //   },
  //   set: (value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         count: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };

  // テンプレートにもとからあるやつ
  // function setupCounter(initialValue = 0) {
  //   document.getElementById('counter').innerHTML = initialValue;

  //   document.getElementById('incrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'INCREMENT',
  //     });
  //   });

  //   document.getElementById('decrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'DECREMENT',
  //     });
  //   });
  // }

  // テンプレートにもとからあるやつ
  // function updateCounter({ type }) {
  //   counterStorage.get(count => {
  //     let newCount;

  //     if (type === 'INCREMENT') {
  //       newCount = count + 1;
  //     } else if (type === 'DECREMENT') {
  //       newCount = count - 1;
  //     } else {
  //       newCount = count;
  //     }

  //     counterStorage.set(newCount, () => {
  //       document.getElementById('counter').innerHTML = newCount;

  //       // Communicate with content script of
  //       // active tab by sending a message
  //       chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //         const tab = tabs[0];

  //         chrome.tabs.sendMessage(
  //           tab.id,
  //           {
  //             type: 'COUNT',
  //             payload: {
  //               count: newCount,
  //             },
  //           },
  //           response => {
  //             console.log('Current count value passed to contentScript file');
  //           }
  //         );
  //       });
  //     });
  //   });
  // }

  // テンプレートにもとからあるやつ
  // function restoreCounter() {
  //   // Restore count value
  //   counterStorage.get(count => {
  //     if (typeof count === 'undefined') {
  //       // Set counter value as 0
  //       counterStorage.set(0, () => {
  //         setupCounter(0);
  //       });
  //     } else {
  //       setupCounter(count);
  //     }
  //   });
  // }
  // document.addEventListener('DOMContentLoaded', restoreCounter);

  // ---- 

  function checkSellerInfo() {
    // テンプレートにもとからあるやつ　
    // document.getElementById('streetAddressBtn').addEventListener('click', () => {
    //   console.log("Button streetAddressBtn clicked!");
    // });

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


          let sellerInfo = response.sellerInfo;

          // popup内に表示

          // 住所についての調査を行う
          function checkStreetAddress(sellerInfoStreetAddress){
            if(sellerInfoStreetAddress.researchSourceRawValue == sellerInfoStreetAddress.rawValue){
              // 調査済みの住所だったらなにもしない
            }else{
              sellerInfoStreetAddress.researchSourceRawValue = sellerInfoStreetAddress.rawValue;
              
              // もし住所が逆順表記されてそうなら順番を入れ替える(Amazonでは逆順表記される)
              const lastChar = sellerInfoStreetAddress.researchSourceRawValue.slice(-1);
              // 逆順表記か否かは、末尾に都道府県が来てるかどうかで判定する（微妙か？！）
              const isInversedStreetAddress = lastChar == '都' || lastChar == '道' || lastChar == '府' || lastChar == '県';
              let researchTargetStreetAddress = {};
              if (isInversedStreetAddress){
                // Amazonは改行区切の逆順表記なので、改行で区切って入れ替える
                // TODO: Amazonでやられてる以外の表記方法だと対応できない。(他のやり方でもし日本語住所を逆順表記してるとこが確認できれば、）もっとましなやり方を考える
                let streetAddresArray = sellerInfoStreetAddress.researchSourceRawValue.split('\n').reverse();
                researchTargetStreetAddress = streetAddresArray.join('').trim();
              }else{
                researchTargetStreetAddress = sellerInfoStreetAddress.researchSourceRawValue.trim();
              }


              // 住所の生の値
              if(isInversedStreetAddress){
                document.getElementById('streetAddressVal').innerHTML = researchTargetStreetAddress + " (元の値は逆順表記)";
              }else{
                document.getElementById('streetAddressVal').innerHTML = researchTargetStreetAddress;
              }

              // 住所の正当性の確認結果
              getLatLng(researchTargetStreetAddress, (latlng) => {
                // 普通に緯度経度を返してきたら正当
                document.getElementById('streetAddressValidationResult').innerHTML = "正当"
              },(error) => {
                // もしエラーを返すためのコールバック関数が呼ばれたら、正当じゃないってこと
                document.getElementById('streetAddressValidationResult').innerHTML = error
              })
              // ↑（コールバック関数が両方呼ばれうる場合はこのやり方ダメだが、たぶん片方しか呼ばれないハズ）

              // 住所の周辺の航空写真
              // (Google Maps Embed APIキーはまだ公開しないでください。無制限に使える状態です。いくら使ってもお金かからないはずだけど、BANされるかも。ふつうはリファラを利用し、埋め込み先サイトを制限するがChrome拡張機能だとサイトとかじゃないのでリファラで制限できるのか...?)
              document.getElementById('streetAddressImg').innerHTML = `<iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCMdL_FxjySdXcAVkYtK0Q3D9r_Z3mX_A0&zoom=17&maptype=satellite&q=${researchTargetStreetAddress}"></iframe>`

              // 住所から検索した郵便番号
              const urlZipcodeReverse = `https://zipcoda.net/api?address=${researchTargetStreetAddress}`;
              console.log(`Zipocode Reverse search url: ${urlZipcodeReverse}`);
              let requestZipcodeReverse = new XMLHttpRequest();
              requestZipcodeReverse.open('GET', urlZipcodeReverse);
              requestZipcodeReverse.onreadystatechange = function () {
                  if (requestZipcodeReverse.readyState != 4) {
                      // リクエスト中
                      console.log("requesting...");
                  } else if (requestZipcodeReverse.status != 200) {
                      // 失敗
                      document.getElementById('streetAddressConvertedToPostalCode').innerHTML = "取得に失敗しました";
                  } else {
                      // 取得成功
                      const resultJson = JSON.parse(requestZipcodeReverse.responseText);
                      console.log(resultJson);
                      
                      if(resultJson.hasOwnProperty('items')){
                        if(resultJson.items.length <= 1){
                          document.getElementById('streetAddressConvertedToPostalCode').innerHTML = resultJson.items[0].zipcode;
                        }else{
                          document.getElementById('streetAddressConvertedToPostalCode').innerHTML = "対応する候補が複数存在します";
                        }
                      }else{
                        document.getElementById('streetAddressConvertedToPostalCode').innerHTML = "郵便番号は定義されていません"; 
                      }
                  }
              };
              requestZipcodeReverse.send();
            }
            // 一応returnしとくがJavaScriptオブジェクトは参照渡しなので別にreturnしなくても呼び出し元の値を操作できる
            return sellerInfoStreetAddress; 
          }

          if(sellerInfo.hasOwnProperty('streetAddress')){
            checkStreetAddress(sellerInfo.streetAddress);
          }

          // 郵便番号についての調査を行う
          function checkPostalCode(sellerInfoPostalCode){
            if(sellerInfoPostalCode.researchSourceRawValue == sellerInfoPostalCode.rawValue){
              // 調査済みの値だったら何もしない
            }else{
              sellerInfoPostalCode.researchSourceRawValue = sellerInfoPostalCode.rawValue;

              // 郵便番号の生の値
              document.getElementById('postalCodeVal').innerHTML = sellerInfoPostalCode.researchSourceRawValue;
              console.log(`postalCode : ${ sellerInfoPostalCode.researchSourceRawValue}`);

              // 郵便番号から検索した住所
              const urlZipcodeForward = `https://zipcoda.net/api?zipcode=${sellerInfoPostalCode.researchSourceRawValue}`;
              console.log(`Zipocode Forward search url: ${urlZipcodeForward}`);
              let requestZipcodeForward = new XMLHttpRequest();
              requestZipcodeForward.open('GET', urlZipcodeForward);
              requestZipcodeForward.onreadystatechange = function () {
                  if (requestZipcodeForward.readyState != 4) {
                      // リクエスト中
                      console.log("requesting...");
                  } else if (requestZipcodeForward.status != 200) {
                      // 失敗
                      document.getElementById('postalCodeConvertedToStreetAddress').innerHTML = "取得に失敗しました";
                  } else {
                      // 取得成功
                      const resultJson = JSON.parse(requestZipcodeForward.responseText);
                      console.log(resultJson);
                      
                      if(resultJson.hasOwnProperty('items')){
                        if(resultJson.items.length <= 1){
                          document.getElementById('postalCodeConvertedToStreetAddress').innerHTML = resultJson.items[0].components.join('');
                        }else{
                          document.getElementById('postalCodeConvertedToStreetAddress').innerHTML = "対応する候補が複数存在します";
                        }
                      }else{
                        document.getElementById('postalCodeConvertedToStreetAddress').innerHTML = "住所は定義されていません"; 
                      }
                  }
              };
              requestZipcodeForward.send();
            }

            return sellerInfoPostalCode; 
          }

          if(sellerInfo.hasOwnProperty('postalCode')){
            checkPostalCode(sellerInfo.postalCode);
          }

          // 電話番号について調査する
          function checkPhoneNumber(sellerInfoPhoneNumber){
            if(sellerInfoPhoneNumber.researchSourceRawValue == sellerInfoPhoneNumber.rawValue){
                // 調査済みの値だったら何もしない
            }else{
              sellerInfoPhoneNumber.researchSourceRawValue = sellerInfoPhoneNumber.rawValue;

              // 電話番号の生の値        
              document.getElementById('phoneNumberVal').innerHTML = sellerInfoPhoneNumber.researchSourceRawValue;
              // 電話番号の正当性の確認結果
              const phoneNumValidationResult = IMIEnrichmentContact(sellerInfoPhoneNumber.researchSourceRawValue);
              // メタデータって項目をもってたら電話番号の形式がおかしくてエラーってこと
              if(phoneNumValidationResult.hasOwnProperty('メタデータ')){
                document.getElementById('phoneNumberValidationResult').innerHTML = phoneNumValidationResult.メタデータ.説明;
              }else{
                document.getElementById('phoneNumberValidationResult').innerHTML = "正当";
              }
              // 電話番号の種別やMA（区域）の確認
              const urlNb3PhoneNumInfoApi = `https://nb3.jp/api/tel/${sellerInfoPhoneNumber.researchSourceRawValue}`;
              let request_nb3 = new XMLHttpRequest();
              request_nb3.open('GET', urlNb3PhoneNumInfoApi);
              request_nb3.onreadystatechange = function () {
                  if (request_nb3.readyState != 4) {
                      // リクエスト中
                      console.log("requesting...");
                  } else if (request_nb3.status != 200) {
                      // 失敗
                      document.getElementById('phoneNumberType').innerHTML = "取得に失敗しました";
                      document.getElementById('phoneNumberMa').innerHTML = "取得に失敗しました";
                  } else {
                      // 取得成功
                      const resultJson = JSON.parse(request_nb3.responseText);
                      console.log(resultJson);
                      if(resultJson.data.hasOwnProperty('kind')){
                        document.getElementById('phoneNumberType').innerHTML = resultJson.data.kind;
                      }else{
                        document.getElementById('phoneNumberType').innerHTML = '電話番号種別は定義されていません';
                      }
                      
                      if(resultJson.data.hasOwnProperty('ma')){
                        document.getElementById('phoneNumberMa').innerHTML = resultJson.data.ma;
                      }else{
                        document.getElementById('phoneNumberMa').innerHTML = "単位料金区域は定義されていません";
                      }
                  }
              };
              request_nb3.send();
            }
            return sellerInfoPhoneNumber;
          }

          if(sellerInfo.hasOwnProperty('phoneNumber')){
            checkPhoneNumber(sellerInfo.phoneNumber);
          }

         
          // メアドに関する調査をする
          function checkEmailAddress(sellerInfoEmailAddress){
            if(sellerInfoEmailAddress.researchSourceRawValue == sellerInfoEmailAddress.rawValue){
              // 調査済みの値だったら何もしない
            }else{
              sellerInfoEmailAddress.researchSourceRawValue = sellerInfoEmailAddress.rawValue;

              // Eメールアドレスの生の値
              document.getElementById('emailAddressVal').innerHTML = sellerInfoEmailAddress.researchSourceRawValue;

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

              if(isEmail(sellerInfoEmailAddress.researchSourceRawValue)){
                document.getElementById('emailAddressValidationResult').innerHTML = "正当";
              }else{
                document.getElementById('emailAddressValidationResult').innerHTML = "eメールアドレスがRFC2822に沿っていません";
              }

              // ドメイン名を名前解決してみる
              console.log("Querying DNS records...");
              const emailDomainName = `${sellerInfoEmailAddress.researchSourceRawValue}`.replace(/.*?@/, '');
              const urlDnsResolution = `http://www.dns-lg.com/ch01/${emailDomainName}/mx`; // リクエスト先URL
              console.log(urlDnsResolution);
              let request_dnsLg = new XMLHttpRequest();
              request_dnsLg.open('GET', urlDnsResolution);
              request_dnsLg.onreadystatechange = function () {
                  if (request_dnsLg.readyState != 4) {
                    // リクエスト中
                    console.log("requesting...");
                  } else if (request_dnsLg.status != 200) {
                      // 失敗
                      document.getElementById('emailAddressDnsResolutionResult').innerHTML = "取得に失敗しました";
                  } else {
                      // 取得成功
                      const resultJson = JSON.parse(request_dnsLg.responseText);
                      console.log(resultJson);

                      const isNxDomain = (resultJson.hasOwnProperty('code')) &&  (resultJson.code == 503);
                      if(isNxDomain){
                        document.getElementById('emailAddressDnsResolutionResult').innerHTML =  "NXDOMAIN, ドメイン名は存在しません"
                      }else{
                        if(resultJson.hasOwnProperty('answer')){
                          if(resultJson.answer.length >= 1){
                            document.getElementById('emailAddressDnsResolutionResult').innerHTML =  "正常, MXレコードが存在しました"
                          }else{
                            document.getElementById('emailAddressDnsResolutionResult').innerHTML =  "異常, MXレコードが存在しません"
                          }
                        }else{
                          document.getElementById('emailAddressDnsResolutionResult').innerHTML =  "エラー, 解決結果を正常にパースできません"
                        }
                      }
                  }
              };
              request_dnsLg.send();

              // メアドのドメイン名のレピュテーションを調べる
              console.log("Querying reputation...");
              const urlEmailReputation = `https://emailrep.io/${sellerInfoEmailAddress.researchSourceRawValue}`; // リクエスト先URL
              console.log(urlEmailReputation);
              let request_mailrepio = new XMLHttpRequest();
              request_mailrepio.open('GET', urlEmailReputation);
              request_mailrepio.setRequestHeader('Accept', 'application/json'); // ヘッダにこれがあればJSONで返してくれる
              request_mailrepio.onreadystatechange = function () {
                  if (request_mailrepio.readyState != 4) {
                      // リクエスト中
                      console.log("requesting...");
                  } else if (request_mailrepio.status != 200) {
                      // 失敗
                      document.getElementById('emailAddressReputation').innerHTML = "取得に失敗しました";
                      document.getElementById('emailAddressReputationSuspicious').innerHTML = "取得に失敗しました";
                      document.getElementById('emailAddressReputationRawJson').innerHTML = "取得に失敗しました";
                  } else {
                      // 取得成功
                      // const resultJson = JSON.parse(request.responseText);
                      // TODO: これ、1日のアクセス数が厳しくてたぶん10回かそれ以下くらいしか使えない感じ
                      const resultText = request_mailrepio.responseText
                      const resultJson = JSON.parse(resultText);
                      console.log(resultJson);
                      document.getElementById('emailAddressReputation').innerHTML = resultJson.reputation;
                      document.getElementById('emailAddressReputationSuspicious').innerHTML = resultJson.suspicious;
                      document.getElementById('emailAddressReputationRawJson').innerHTML =  resultText; //JSON.stringify(resultJson, null, 2);
                  }
              };
              request_mailrepio.send();
            }
            return sellerInfoEmailAddress;
          }

          if(sellerInfo.hasOwnProperty('emailAddress')){
            checkEmailAddress(sellerInfo.emailAddress);
          }

         
          

          
          
        }
      );
    });
  }
  document.addEventListener('DOMContentLoaded', checkSellerInfo);


  // ----
  // テンプレートにもとからあるやつ
  // // Communicate with background file by sending a message
  // chrome.runtime.sendMessage(
  //   {
  //     type: 'GREETINGS',
  //     payload: {
  //       message: 'Hello, my name is Pop. I am from Popup.',
  //     },
  //   },
  //   response => {
  //     console.log(response.message);
  //   }
  // );
})();
