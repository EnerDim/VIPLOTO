// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDtMUZJEL0_nBWEpKd7mgVlsHCCO6zK-g",
    authDomain: "tsl-apps-6183d.firebaseapp.com",
    projectId: "tsl-apps-6183d",
    storageBucket: "tsl-apps-6183d.firebasestorage.app",
    messagingSenderId: "104902017801",
    appId: "1:104902017801:web:49e392e147c413de15c9d8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification?.title || 'ГосВыплата';
    const notificationOptions = {
        body: payload.notification?.body || 'У вас новое уведомление',
        icon: payload.notification?.icon || '/assets/pwa/icon_192.webp',
        badge: '/assets/pwa/icon_96.webp',
        tag: payload.notification?.tag || 'default-notification',
        requireInteraction: false,
        data: payload.data || {}
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.');
    
    event.notification.close();
    
    // Open or focus the app window
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// Claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Handle client messages
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLAIM_CLIENTS') {
        self.clients.claim();
    }
});
