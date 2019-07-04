
preloadedInterstitial = null;
preloadedRewardedVideo = null;
fbName = "";
fbId = "";
fbAvatar = "";
fbLocale = "";
fbPlatform = "";
fbSdkVersion = "";
isShowBegin = false;

let progress = 0;
function LoadingProgress() {
    progress += 1;
    FBInstant.setLoadingProgress(progress);
    if (progress < 100)
        window.setTimeout(() => LoadingProgress(), 20);
    else {
        FBInstant.startGameAsync().then(function () {
            myGame.start();
        });
        PreloadInterstitial();
        PreloadVideo();
        LoginGame();
        // window.setTimeout(() => SubscribeBot(), 60000);
        window.setTimeout(() => CreateShortcutGame(), 180000);
    }
}
if (typeof FBInstant !== 'undefined')
    FBInstant.initializeAsync().then(function () {
        LoadingProgress();
    });


function PreloadInterstitial() {
    if (typeof FBInstant !== 'undefined') {
        this.preloadedInterstitial = null;
        FBInstant.getInterstitialAdAsync(
            '428105314432480_428106037765741', // Your Ad Placement Id
        ).then((interstitial) => {
            // Load the Ad asynchronously
            self.preloadedInterstitial = interstitial;
            return self.preloadedInterstitial.loadAsync();
        }).then(() => {
            console.log('Interstitial preloaded');
            if (!self.isShowBegin) {
                self.isShowBegin = true;
                window.setTimeout(() => ShowInterstitial(), 1000);
            }
        }).catch((err) => {
            console.error('Interstitial failed to preload: ' + err.message);
        });
    }
}
function ShowInterstitial(callback = null) {
    if (typeof FBInstant !== 'undefined') {
        let self = this;
        console.log("ShowInterstitial");
        this.preloadedInterstitial.showAsync()
            .then(() => {
                self.PreloadInterstitial();
                if (callback != null)
                    callback.apply();
                console.log('Interstitial ad finished successfully');
            })
            .catch((e) => {
                console.error(e.message);
                if (self.preloadedInterstitial == null)
                    self.PreloadInterstitial();
            });
    }
}
function ShowVideoInterstitial(callback = null) {
    if (typeof FBInstant !== 'undefined') {
        let self = this;
        this.preloadedRewardedVideo.showAsync()
            .then(() => {
                if (callback != null)
                    callback();
                self.PreloadVideo();
            })
            .catch((e) => {
                console.error(e.message);
                if (self.preloadedRewardedVideo == null)
                    self.PreloadVideo();
            });
    }
}
function PreloadVideo() {
    if (typeof FBInstant !== 'undefined') {
        let self = this;
        this.preloadedRewardedVideo = null;
        FBInstant.getRewardedVideoAsync(
            '428105314432480_428106104432401', // Your Ad Placement Id
        ).then((rewarded) => {
            // Load the Ad asynchronously
            self.preloadedRewardedVideo = rewarded;
            return self.preloadedRewardedVideo.loadAsync();
        }).then(() => {
            console.log('Rewarded video preloaded');
        }).catch((err) => {
            console.error('Rewarded video failed to preload: ' + err.message);
        });
    }
}
function ShowVideo(callback = null) {
    if (typeof FBInstant !== 'undefined') {
        let self = this;
        this.preloadedRewardedVideo.showAsync()
            .then(() => {
                if (callback != null)
                    callback();
                self.PreloadVideo();
            })
            .catch((e) => {
                console.error(e.message);
                if (self.preloadedRewardedVideo == null)
                    self.PreloadVideo();
                if (!self.preloadedInterstitial != null)
                    ShowInterstitialVideo(callback);
            });
    }
}
function ShowInterstitialVideo(callback = null) {
    if (typeof FBInstant !== 'undefined') {
        let self = this;
        console.log("ShowInterstitial");
        this.preloadedInterstitial.showAsync()
            .then(() => {
                self.PreloadInterstitial();
                if (callback != null)
                    callback.apply();
                console.log('Interstitial ad finished successfully');
            })
            .catch((e) => {
                console.error(e.message);
            });
    }
}
function LoginGame() {
    if (typeof FBInstant !== 'undefined') {
        this.fbName = FBInstant.player.getName();
        this.fbId = FBInstant.player.getID();
        this.fbAvatar = FBInstant.player.getPhoto();
        this.fbLocale = FBInstant.getLocale();
        this.fbPlatform = FBInstant.getPlatform();
        this.fbSdkVersion = FBInstant.getSDKVersion();
        ActiveMoreGame(true)
    }
}
function CreateShortcutGame() {
    if (typeof FBInstant !== 'undefined') {
        FBInstant.canCreateShortcutAsync()
            .then((canCreateShortcut) => {
                if (canCreateShortcut) {
                    FBInstant.createShortcutAsync()
                        .then(() => {
                        })
                        .catch(() => {
                        });
                }
            });
    }
}

function OnPause() {
    console.log('pause game')
    if (typeof FBInstant === 'undefined') return;
    let self = this;
    FBInstant.onPause(() => {
        self.ShowInterstitial();
    })
}
function Share() {
    if (typeof FBInstant === 'undefined') return;
    var xmlhttp, imgBase64;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'Base64.txt', false);
    xmlhttp.send();
    imgBase64 = xmlhttp.responseText;

    FBInstant.shareAsync({
        intent: 'Share',
        image: imgBase64,
        text: 'Nice game! Please play with me!',
        data: { myReplayData: '...' },
    }).then(function () {
        // continue with the game.
    });
}
function SubscribeBot() {
    if (typeof FBInstant === 'undefined') return;
    FBInstant.player.canSubscribeBotAsync().then(function (can_subscribe) {
        if (can_subscribe) {
            FBInstant.player.subscribeBotAsync().then(
                // Player is subscribed to the bot
            ).catch(function (e) {
                // Handle subscription failure
            });
        }
    });
}
function SwitchGame(idGame, nameGame) {
    if (typeof FBInstant === 'undefined') return;
    let self = this;
    FBInstant.switchGameAsync(idGame).catch((e) => {
        self.LogEvent(nameGame);
    });
}
function LogEvent(eventName, eventValue = null) {
    if (typeof FBInstant === 'undefined') return;
    if (eventValue == null)
        FBInstant.logEvent(eventName, 1, { custom_property: eventName });
    else
        FBInstant.logEvent(eventName, eventValue, { custom_property: eventName });
}
