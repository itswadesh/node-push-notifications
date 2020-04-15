console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon:
      "https://i.ibb.co/GRJGtJ1/43ee1cafca2f947f0be0d94aeff0fc26-chef-cartoon-profession-by-vexels.png",
  });
});
