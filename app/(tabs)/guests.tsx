import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import { Redirect, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import GuestItem from '../../components/GuestItem';
import { colors } from '../../constants/colors';
import type { Guest } from '../../migrations/00000-createTableGuests';
import type { GuestsResponseBodyGet } from '../api/guests+api';
import type { UserResponseBodyGet } from '../api/user+api';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    height: '100%',
  },
  text: {
    color: colors.text,
  },
  list: {
    marginTop: 30,
  },
});

export default function App() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  const [isStale, setIsStale] = useState(true);

  // const renderItem = (item: { item: User }) => <UserItem user={item.item} />;

  const renderItem = (item: { item: Guest }) => (
    <GuestItem guest={item.item} setIsStale={setIsStale} />
  );

  useFocusEffect(
    useCallback(() => {
      if (!isStale) return;

      async function getUser() {
        const response = await fetch('/api/user');

        const body: UserResponseBodyGet = await response.json();

        if ('error' in body) {
          return <Redirect href="/(auth)" />;
        }
      }

      async function getGuests() {
        const response = await fetch('/api/guests');
        const body: GuestsResponseBodyGet = await response.json();

        setGuests(body.guests);
        setIsStale(false);
      }

      getUser().catch((error) => {
        console.error(error);
      });

      getGuests().catch((error) => {
        console.error(error);
      });
    }, [isStale]),
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={guests}
        renderItem={renderItem}
        keyExtractor={(item: Guest) => String(item.id)}
      />
    </SafeAreaView>
  );
}