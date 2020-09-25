# 開発への参加の仕方
ここでは、開発に参加する際の手順を示しています。

## 動かし方
本プログラムの動かし方は以下の通りです。

### ビルド方法
```
# このリポジトリをクローンする
git clone https://github.com/.....

# クローンしてできたリポジトリに入る
cd sellerInfoValidator

# 必要なモジュールをインストール
npm install

# ビルドして結果を./buildに配置する. ファイルに変更があると自動で再ビルドされる
npm run watch
```

### GoogleChromeへのインストール方法
Google Chromeで `chrome://extensions`にアクセスします。  

右上のデベロッパーモードをオンにして、左上の「パッケージ化されていない拡張機能を読み込む」ボタンから `sellerInfoValidator/build` に当たるディレクトリを指定して読み込みます。

![image](https://user-images.githubusercontent.com/24310557/94279208-c4c27400-ff86-11ea-9585-485b6f212c99.png)


すると作成中の拡張機能が使えるようになります。

ソースに変更があれば自動でビルドされ、Chrome側でも自動で読み込まれるはずです。  
ただしショートカットキーの変更など一部の変更は、拡張機能を削除して入れ直さないと反映されません。

## コードについて
[このサイト](https://itnews.org/news_contents/product-chrome-extension-cli)を参考にChrome Extension CLIで生成されたテンプレートを利用しています。

ディレクトリ構造は以下の通りです。

```
.
├── README.md
├── build                <- ビルド結果がここに置かれる
├── config               <- ビルドコンフィグが置かれてる
├── node_modules         <- Node.jsのモジュールが置かれてる
├── package-lock.json    <- npmのパッケージ管理情報, インストールしたモジュールのバージョンとか
├── package.json         <- npmのパッケージ管理情報, インストールしたモジュールとか
├── public               <- トランスパイル等無しにそのまま公開されるファイルたち
└── src                  <- ソースコード
```

## 開発上の決まり

### 命名規則
HTML, CSS, JavaScriptについては特殊な規則は導入していません。  

ただし、HTMLのclass属性とid属性について注意があります。  
id属性はJavaScriptから使用することを考え、camelCaseにしています。  
（[Trello CSS Style Guide](https://gist.github.com/bobbygrace/9e961e8982f42eb91b80)的なやつです）

### フォーマッター
コード整形にはVisualStudio Code標準の機能をデフォルト設定で使っています。  
プルリク出す前に整形してください。

### プルリクの出し方
とくに CI/CD ツールの導入はしていませんので、手元で手動でテストが終わったらプルリクを出してくれればokです。








