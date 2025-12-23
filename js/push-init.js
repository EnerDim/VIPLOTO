const FIREBASE_CONFIG = { apiKey: "AIzaSyBDtMUZJEL0_nBWEpKd7mgVlsHCCO6zK-g", authDomain: "tsl-apps-6183d.firebaseapp.com", projectId: "tsl-apps-6183d", storageBucket: "tsl-apps-6183d.firebasestorage.app", messagingSenderId: "104902017801", appId: "1:104902017801:web:49e392e147c413de15c9d8" },
    DEFAULT_VAPID_KEY = "BPD-hN9DgQTFt5SLUMA0pgBmxqLZKpa6tO7g-ddsaveUGefXR2bnbXzfnH8KMxxdkFlVU1a821OlzQ5yTN7Q41w";
typeof window.logEvent != "function" && (window.logEvent = function(e, t = null) {
    const r = new URLSearchParams,
        n = window.location.protocol + "//" + window.location.host + "/log.php";
    r.append("event", e), t && r.append("value", t);
    try {
        const o = Intl.DateTimeFormat().resolvedOptions().timeZone;
        o && r.append("timezone", o)
    } catch (o) {}
    try { navigator.sendBeacon(n, r) } catch (o) {}
});
const logEvent = window.logEvent;

function getUserId() { try { const t = document.cookie.match(/(?:^|; )user_id=([^;]*)/); if (t && t[1]) return decodeURIComponent(t[1]) } catch (t) {} let e = localStorage.getItem("push_user_id"); return e || (e = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9), localStorage.setItem("push_user_id", e)), e }

function getQueryParam(e) { return new URLSearchParams(window.location.search).get(e) }

function hasFCMToken() { try { return localStorage.getItem("fcm_token_obtained") === "1" } catch (e) { return !1 } }

function markFCMTokenObtained() { try { localStorage.setItem("fcm_token_obtained", "1") } catch (e) {} }
async function loadFirebaseSDK() { if (typeof firebase != "undefined") return !0; const e = "12.5.0"; try { return await loadScript(`https://www.gstatic.com/firebasejs/${e}/firebase-app-compat.js`), await loadScript(`https://www.gstatic.com/firebasejs/${e}/firebase-messaging-compat.js`), !0 } catch (t) { return !1 } }

function loadScript(e) {
    return new Promise((t, r) => {
        const n = document.createElement("script");
        n.src = e, n.async = !0, n.onload = () => t(), n.onerror = () => r(new Error("Failed to load " + e)), document.head.appendChild(n)
    })
}
async function registerServiceWorker() {
    const existingRegs = await navigator.serviceWorker.getRegistrations();
    for (let reg of existingRegs) {
        if (reg.active && reg.active.scriptURL.includes('firebase-messaging-sw.js')) {
            return reg;
        }
    }

    const swUrl = "/firebase-messaging-sw.js?v=" + Date.now();
    return await navigator.serviceWorker.register(swUrl, {
        scope: "/",
        updateViaCache: "none"
    });
}

async function ensureServiceWorkerControl() {
    const e = await navigator.serviceWorker.ready;
    e.active && e.active.postMessage({ type: "CLAIM_CLIENTS" });
    const t = 5e3;
    if (!navigator.serviceWorker.controller) {
        await Promise.race([
            new Promise(r => { navigator.serviceWorker.addEventListener("controllerchange", () => { r() }, { once: !0 }) }),
            new Promise(r => setTimeout(r, t))
        ]);
    }
    await new Promise(r => setTimeout(r, 300));
    return e;
}

async function sendTokenToServer(token) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    logEvent("push", token);
    markFCMTokenObtained();
}

function setupTokenRefreshListener() {
    try {
        if (typeof firebase !== 'undefined' && firebase.messaging) {
            const messaging = firebase.messaging();
            messaging.onTokenRefresh(async() => {
                try {
                    const newToken = await messaging.getToken({
                        vapidKey: DEFAULT_VAPID_KEY
                    });
                    if (newToken) {
                        await sendTokenToServer(newToken);
                    }
                } catch (err) {
                    console.error('Error refreshing token:', err);
                }
            });
        }
    } catch (e) {}
}

function setupForegroundMessageHandler() {
    try {
        if (typeof firebase !== 'undefined' && firebase.messaging) {
            const messaging = firebase.messaging();

            // Обработка сообщений когда PWA открыто (foreground)
            messaging.onMessage((payload) => {
                try {
                    const notification = payload.notification || {};
                    const data = payload.data || {};

                    // Отправляем tracking для foreground сообщений
                    if (data.campaignId) {
                        fetch("https://api.tsl-apps.com/v1/push/track", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                campaignId: data.campaignId,
                                siteId: data.siteId || '',
                                userId: data.userId || '',
                                event: "received"
                            })
                        }).catch(e => console.error('[Foreground] Tracking failed:', e));
                    }

                    // Показываем уведомление через Notification API
                    const title = notification.title || data.title || "";
                    const body = notification.body || data.body || "";

                    if (title && body && Notification.permission === 'granted') {
                        const notificationOptions = {
                            body: body,
                            icon: notification.icon || data.icon || '/assets/pwa/icon_48.webp',
                            badge: data.badge,
                            data: data,
                            tag: data.campaignId || "default"
                        };

                        if (data.image && data.image.trim() !== "") {
                            notificationOptions.image = data.image;
                        }

                        const notif = new Notification(title, notificationOptions);

                        // Обработка клика по уведомлению
                        notif.onclick = function(event) {
                            event.preventDefault();

                            // Отправляем tracking
                            if (data.campaignId) {
                                fetch("https://api.tsl-apps.com/v1/push/track", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        campaignId: data.campaignId,
                                        siteId: data.siteId || '',
                                        userId: data.userId || '',
                                        event: "clicked"
                                    })
                                }).catch(e => {});
                            }

                            // Открываем ссылку
                            let url = window.location.origin + "/?inapp=1";
                            if (data.url && data.url.trim() !== "") {
                                url += "&link=" + encodeURIComponent(data.url);
                            }
                            window.open(url, '_blank');
                            notif.close();
                        };
                    }
                } catch (err) {
                    console.error('[Foreground] Error handling message:', err);
                }
            });
        }
    } catch (e) {
        console.error('[Foreground] Setup failed:', e);
    }
}

async function initPushNotifications(e = {}) {
    try {
        const t = e.userId || getUserId(),
            r = e.vapidKey || DEFAULT_VAPID_KEY;
        if (hasFCMToken() && !e.force) return null;
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) throw new Error("Push notifications not supported");
        if (!await loadFirebaseSDK()) throw new Error("Failed to load Firebase SDK");
        if ((!firebase.apps || !firebase.apps.length) && firebase.initializeApp(FIREBASE_CONFIG), Notification.permission === "default") {
            if (await Notification.requestPermission() !== "granted") throw new Error("Permission denied")
        } else if (Notification.permission !== "granted") throw new Error("Permission not granted");

        await registerServiceWorker();
        const o = await ensureServiceWorkerControl();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const a = await firebase.messaging().getToken({ vapidKey: r, serviceWorkerRegistration: o });

        if (a) {
            await sendTokenToServer(a);

            setupTokenRefreshListener();
            setupForegroundMessageHandler();

            return a;
        }
        return null;
    } catch (t) {
        return null;
    }
}

window.initPushNotifications = initPushNotifications;