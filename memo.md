

`onMessage.addLisener`
chrome.runtime.onMessage.assListenerは他の拡張プロセスの'runtime.sendMassage'やコンテンツスクリプト'tabs.sendMessage'によるメッセージを受信した際に発火する。

```javascript
// 書き方は以下の感じ
chrome.runtime.onMessage.addListener(function callback)

// functionの部分は
chrome.runtime.onMessage.addListener(
    /**
     * @para any 呼び出し元によって送られてきたスクリプト
     * @para messageSender 呼び出し元
     * @para function
     */ 
    function(any, messageSender, function){
        // メッセージを受け取った際の処理
    }
)
}

```
> こんんにちは
> 