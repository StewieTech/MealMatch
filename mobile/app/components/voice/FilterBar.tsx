import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FILTER_OPTIONS, FilterKey } from '../../constants/filters';
import { theme } from '../../constants/theme';
import { RecipeFilter } from '../../types/voice';
import { FilterPill } from './FilterPill';

interface Props {
  filters: RecipeFilter;
  onChange: (filters: RecipeFilter) => void;
  title?: string;
}

export function FilterBar({ filters, onChange, title = 'QUICK FILTERS (OPTIONAL)' }: Props) {
  function toggle(key: FilterKey) {
    onChange({ ...filters, [key]: !filters[key] });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {FILTER_OPTIONS.map((option) => (
          <FilterPill
            key={option.key}
            label={option.label}
            active={Boolean(filters[option.key])}
            onToggle={() => toggle(option.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
