import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Mode = 'text' | 'photo' | 'voice';

export function ModeTabs({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <View style={styles.row}>
      {(['text', 'photo', 'voice'] as Mode[]).map((item) => (
        <Pressable
          key={item}
          onPress={() => onChange(item)}
          style={[styles.tab, mode === item && styles.activeTab]}
        >
          <Text style={[styles.label, mode === item && styles.activeLabel]}>
            {item.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fed7aa',
  },
  activeTab: {
    backgroundColor: '#ea580c',
  },
  label: {
    color: '#7c2d12',
    fontWeight: '700',
  },
  activeLabel: {
    color: '#ffffff',
  },
});