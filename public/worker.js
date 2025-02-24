console.log('Service Worker Loaded...');

self.addEventListener('push', (e) => {
  // Check if there's any data in the push event
  const data = e.data ? e.data.json() : {};
  console.log('Push Received...', data);

  // Define notification options
  const options = {
    body: data.body || 'This is a test notification by Foundation', // Default body in case none is provided
    icon: 'https://s3.us-east-2.amazonaws.com/on.foundation/assets/svgs/F.svg',
    badge: 'https://s3.us-east-2.amazonaws.com/on.foundation/assets/svgs/F.svg', // Optional: Add badge if required
  };

  // Use event.waitUntil to ensure notification is shown
  e.waitUntil(self.registration.showNotification(data.title || 'Foundation Notification', options));
});

self.addEventListener('notificationclick', (e) => {
  console.log('Notification click received.');

  // Close the notification when clicked
  e.notification.close();

  // Optional: Handle notification click by opening a URL or focusing the client
  e.waitUntil(
    clients.openWindow('https://your-redirect-url.com'), // Change this URL to the relevant one
  );
});
