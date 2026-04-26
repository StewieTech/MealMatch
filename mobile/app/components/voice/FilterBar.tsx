import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  FILTER_OPTIONS,
  MAX_CUSTOM_FILTER_LENGTH,
  MAX_CUSTOM_FILTER_TAGS,
  ToggleFilterKey,
} from '../../constants/filters';
import { theme } from '../../constants/theme';
import { RecipeFilter } from '../../types/voice';
import { FilterPill } from './FilterPill';

interface Props {
  filters: RecipeFilter;
  onChange: (filters: RecipeFilter) => void;
  title?: string;
}

export function FilterBar({ filters, onChange, title = 'QUICK FILTERS (OPTIONAL)' }: Props) {
  const [draft, setDraft] = useState('');
  const customTags = useMemo(() => normalizeCustomTags(filters.customTags || []), [filters.customTags]);

  function toggle(key: ToggleFilterKey) {
    onChange({ ...filters, [key]: !filters[key] });
  }

  function updateCustomTags(next: string[]) {
    onChange({ ...filters, customTags: normalizeCustomTags(next) });
  }

  function handleAddCustomTag() {
    const normalized = normalizeTag(draft);
    if (!normalized) return;
    if (customTags.includes(normalized)) {
      setDraft('');
      return;
    }
    if (customTags.length >= MAX_CUSTOM_FILTER_TAGS) return;
    updateCustomTags([...customTags, normalized]);
    setDraft('');
  }

  function handleRemoveCustomTag(tag: string) {
    updateCustomTags(customTags.filter((item) => item !== tag));
  }

  const canAddCustomTag = Boolean(
    normalizeTag(draft) &&
      !customTags.includes(normalizeTag(draft)) &&
      customTags.length < MAX_CUSTOM_FILTER_TAGS
  );

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

      <View style={styles.addRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleAddCustomTag}
          returnKeyType="done"
          placeholder="Add custom filter"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          maxLength={MAX_CUSTOM_FILTER_LENGTH}
        />
        <Pressable
          onPress={handleAddCustomTag}
          disabled={!canAddCustomTag}
          style={[styles.addButton, !canAddCustomTag && styles.addButtonDisabled]}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {customTags.length > 0 && (
        <View style={styles.row}>
          {customTags.map((tag) => (
            <FilterPill
              key={tag}
              label={tag}
              active
              onRemove={() => handleRemoveCustomTag(tag)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function normalizeTag(value: string): string {
  return value
    .replace(/[\r\n`]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .slice(0, MAX_CUSTOM_FILTER_LENGTH);
}

function normalizeCustomTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const tag of tags) {
    const next = normalizeTag(tag);
    if (!next || seen.has(next)) continue;
    seen.add(next);
    normalized.push(next);
    if (normalized.length >= MAX_CUSTOM_FILTER_TAGS) break;
  }

  return normalized;
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
  addRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  addButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.textPrimary,
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.borderStrong,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
  },
});
