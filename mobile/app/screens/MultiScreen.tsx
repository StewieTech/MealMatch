import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Multi'>;

export function MultiScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MealMatch</Text>
      <Text style={styles.tagline}>How are you cooking today?</Text>

      <View style={styles.tiles}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take a photo of your ingredients"
          style={({ pressed }) => [
            styles.tile,
            { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
          ]}
          onPress={() => navigation.navigate('PhotoFlow')}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="camera" size={36} color="#fff" />
          </View>
          <Text style={styles.tileLabel}>Photo</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Record a voice note of your ingredients"
          style={({ pressed }) => [
            styles.tile,
            { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
          ]}
          onPress={() => navigation.navigate('VoiceFlow')}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="mic" size={36} color="#fff" />
          </View>
          <Text style={styles.tileLabel}>Voice</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Type your ingredients manually"
          style={({ pressed }) => [
            styles.tile,
            { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
          ]}
          onPress={() =>
            navigation.navigate('VoiceFlow', {
              screen: 'ConfirmIngredients',
              params: { ingredients: [] },
            })
          }
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="create" size={36} color="#fff" />
          </View>
          <Text style={styles.tileLabel}>Type</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 48,
  },
  tiles: {
    width: '100%',
    maxWidth: 320,
    gap: 20,
  },
  tile: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tileLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
});
