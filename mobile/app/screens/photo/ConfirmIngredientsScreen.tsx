import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ConfirmIngredientsView } from '../../components/shared/ConfirmIngredientsView';
import { DEFAULT_FILTERS } from '../../constants/filters';
import { PhotoFlowStackParamList } from '../../types/photo';
import { RecipeFilter } from '../../types/voice';

type Props = NativeStackScreenProps<PhotoFlowStackParamList, 'PhotoConfirmIngredients'>;

function dedupe(items: string[]): string[] {
  return [...new Set(items.map((i) => i.trim().toLowerCase()).filter(Boolean))];
}

export function PhotoConfirmIngredientsScreen({ navigation, route }: Props) {
  const params = route.params;
  const hasParams = Boolean(params && Array.isArray(params.ingredients));

  useEffect(() => {
    if (!hasParams) {
      navigation.reset({ index: 0, routes: [{ name: 'CameraScan' }] });
    }
  }, [hasParams, navigation]);

  const initial = useMemo(
    () =>
      hasParams
        ? dedupe((params.ingredients || []).map((c) => c.normalized || c.raw))
        : [],
    [hasParams, params]
  );
  const [ingredients, setIngredients] = useState<string[]>(initial);
  const [filters, setFilters] = useState<RecipeFilter>(DEFAULT_FILTERS);

  if (!hasParams) return null;

  function handleRemove(ingredient: string) {
    setIngredients((prev) => prev.filter((i) => i !== ingredient));
  }

  function handleAdd(ingredient: string) {
    const normalized = ingredient.trim().toLowerCase();
    if (!normalized) return;
    setIngredients((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
  }

  function handleSubmit() {
    if (ingredients.length === 0) return;
    navigation.navigate('PhotoRecipeResults', {
      ingredients: dedupe(ingredients),
      filters,
    });
  }

  const submitDisabled = ingredients.length === 0;
  const count = params.ingredients.length;
  const subtitle =
    count > 0
      ? `Recognized ${count} ingredient${count === 1 ? '' : 's'}. Edit as needed.`
      : 'No ingredients were recognized. Add them manually below.';

  return (
    <ConfirmIngredientsView
      subtitle={subtitle}
      ingredients={ingredients}
      filters={filters}
      onAddIngredient={handleAdd}
      onRemoveIngredient={handleRemove}
      onFiltersChange={setFilters}
      onSubmit={handleSubmit}
      submitDisabled={submitDisabled}
    />
  );
}
