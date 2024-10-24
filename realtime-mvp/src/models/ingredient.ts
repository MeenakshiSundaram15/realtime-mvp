export type IngredientBaseModel = {
  id: number;
  name: string;
  order: number;
};

export type NutrientType = {
  nutrient: number;
  amount: string;
};

export type IngredientModel = {
  base_type?: string;
  composite_ingredients: string;
  desc?: string;
  exclude_in_CYO: boolean;
  id: number;
  image?: number;
  ingredient_category?: number;
  ingredient_groups?: number[];
  ingredient_subcategory?: string;
  is_composited: boolean;
  kitchen_label?: string;
  name: string;
  nutrient_serving_weight: string;
  nutrients?: NutrientType[];
  order: number;
  price: string;
  serving_weight: string;
};

export type IngredientHashmapModel = {
  [ingredientId: number]: IngredientModel;
};

export type ModifierIngredientModel = {
  ingredient: number;
  serving: string;
  price: string;
  single_price: string;
  direction: 'addon' | 'removed';
  is_pvar_applied: boolean;
  discount_amount: string;
  total: string;
  bulk_quantity: number;
};

export type IngredientCategoryModel = {
  id: number;
  name: string;
  short_name?: string | null;
  order: number;
  cyo_section: number;
};

export type DisabledIngredientModel = {
  gglocation_id: number;
  gglocation_type: number;
  ingredient: number;
  expired_eod: boolean;
};
