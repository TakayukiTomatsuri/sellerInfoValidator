# 販売者情報チェッカー

## 機能概要
販売者の以下の情報について調べるOSINTツールです。GoogleChrome拡張機能として作成されています。
* 住所
* 郵便番号
* 電話番号
* Eメールアドレス

デタラメな情報を載せている怪しい販売者を見破るのに役立ててください。

## インストール方法
まだChromeウェブストアには公開しておりません...。

そのため開発時と同じ方法でインストールします。
### ビルド

```
# このリポジトリをクローンする
git clone https://github.com/TakayukiTomatsuri/sellerInfoValidator

# クローンしてできたリポジトリに入る
cd sellerInfoValidator

# 必要なモジュールをインストール
npm install

# ビルドして結果を./buildに配置する. ファイルに変更があると自動で再ビルドされる
npm run watch
```
### GoogleChromeにインストール
Google Chromeで `chrome://extensions`にアクセスします。  

右上のデベロッパーモードをオンにして、左上の「パッケージ化されていない拡張機能を読み込む」ボタンから `sellerInfoValidator/build` に当たるディレクトリを指定して読み込みます。  
![image](https://user-images.githubusercontent.com/24310557/94279208-c4c27400-ff86-11ea-9585-485b6f212c99.png)


すると使えるようになります。

## 操作方法
テキストを選択した状態でコンテクストメニューで、選択中のテキストを住所や電話番号などの販売者情報（住所, 郵便番号, etc..）として扱います。  
この販売者情報はタブごとに記憶されます。

![image](https://user-images.githubusercontent.com/24310557/94278584-f555de00-ff85-11ea-9337-3c89bce8bd37.png)



テキスト選択後にキーコマンドでも以下の操作ができます。これは試験段階の機能です。
```
# Windowsの場合
Command+Shift+K -> 住所として扱う
Command+Shift+U -> 電話番号として扱う
Command+Shift+H -> メアドとして扱う

# macOSの場合
Command+Shift+K -> 住所として扱う
Command+Shift+O -> 電話番号として扱う
Command+Shift+P -> メアドとして扱う
```

最後に、ブラウザ右上の拡張機能アイコンを押すと、各種販売者情報について調査した結果が出てきます。

![image](https://user-images.githubusercontent.com/24310557/94280041-e5d79480-ff87-11ea-9b7e-23f4ce7c5447.png)

## 開発参加方法
[CONTRIBUTING.md](/CONTRIBUTING.md)を読んでください。

