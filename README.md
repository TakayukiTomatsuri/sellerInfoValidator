# 開発上のメモ

## 動かし方

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

Google Chromeで `chrome://extentions`にアクセス、右上のデベロッパーモードをオンにして、左上の「パッケージ化されていない拡張機能を読み込む」ボタンから `./build` を指定して読み込み。

すると作成中の拡張機能が使えるようになる。

ソースに変更があれば自動でビルドされ、Chrome側でも自動で読み込まれるはずだが、ショートカットキーの変更など一部の変更は、拡張機能を削除して入れ直さないと反映されない。

### chrome拡張機能の使い方
テキストを選択した状態でキーコマンドを打つと、選択中のテキストを以下のように扱う。  
なおキーコマンドは `./public/manifest.json` で定義されている。
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
（↑扱う項目を増やす場合を考えてキー操作だけでなくGUI操作でもできるようにすべきではある & 空いてるキーをとりあえず割り当てたので並びが変）

ブラウザ右上の拡張機能アイコンを押すと、住所や電話番号、メアドについて調査した結果が出てくる。
（いまはほとんどダミーだけど。）

## コードについて
[このサイト](https://itnews.org/news_contents/product-chrome-extension-cli)を参考にChrome Extension CLIで生成されたテンプレートを利用した。

ディレクトリ構造は以下の通り。

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


