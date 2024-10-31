import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { LogoutResponseBodyGet } from '../api/logout+api';
import type { UserResponseBodyGet } from '../api/user+api';

// type Props = {
//   user: User;
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.text,
    padding: 12,
    borderRadius: 12,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
  },
  text: {
    fontFamily: 'Poppins_400Regular',
    color: colors.cardBackground,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default function ProfileScreen() {
  const [user, setUser] = useState();

  useFocusEffect(
    useCallback(() => {
      async function getUser() {
        const response = await fetch('/api/user');

        const body: UserResponseBodyGet = await response.json();

        if ('error' in body) {
          Alert.alert('Error', body.error, [{ text: 'OK' }]);
          return;
        }

        if (!body) {
          router.push('/(auth)');
          return;
        }

        setUser(body);
      }

      getUser().catch((error) => {
        console.error(error);
      });
    }, []),
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
        onPress={async () => {
          const response = await fetch('/api/logout');

          if (!response.ok) {
            let errorMessage = 'Error logging out';
            try {
              const responseBody: LogoutResponseBodyGet = await response.json();
              if ('error' in responseBody) {
                errorMessage = responseBody.error;
              }
            } catch {}

            Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
            return;
          }

          router.push('/(auth)');
        }}
      >
        <Text style={styles.text}>Logout</Text>
      </Pressable>
    </View>
  );
}
