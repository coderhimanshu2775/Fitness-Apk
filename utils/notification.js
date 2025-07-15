import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export async function scheduleReminder() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚰 Time to Hydrate!",
      body: "Don't forget to drink water!",
    },
    trigger: {
      hour: 14,
      minute: 0,
      repeats: true,
    },
  });
}
