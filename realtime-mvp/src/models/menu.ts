import { ModifierIngredientModel } from './ingredient';

export type MenuIngredientModel = {
  ingredient: number;
  serving: string;
};

export type MenuNutritionalInfoModel = {
  id: number;
  name: string;
  measurement_unit: string;
  amount: string;
};

export type MenuCategoryModel = {
  id: number;
  name: string;
  base_type: number;
  order: number;
};

export type MenuItemModel = {
  id: number;
  name: string;
  uuid: string;
  menu_category: number;
  menu_subcategory: number;
  image: number;
  ingredients: MenuIngredientModel[];
  ingredient_breakdown: ModifierIngredientModel[];
  nutritional_info: {
    [nutritionKey: string]: MenuNutritionalInfoModel;
  };
  price: string;
  tags: string[];
  preference_group: string[];
  flags: string[];
  order: number;
  disable: boolean;
  is_cyo: boolean;
  base_type: number;
  show_in_nutrition_info: boolean;
  capacity_size: string;
  bulk_quantity: number;
  base_menu: number | null;
  upsell_category: number | null;
  upsell_sort_order: number | null;
  orderType: 'takeaway' | 'dine-in' | 'byob' | 'borrow';
};

export type MenuGroupModel = {
  id: string;
  menus: MenuItemModel[];
};

export type MenuBaseTypeModel = {
  id: number;
  name: string;
  order: number;
};

export type MenuCyoSectionModel = {
  id: number;
  name: string;
  desc: string | null;
  order: number;
  selection_behavior: string;
  item_size: string;
  is_side: boolean;
};

export type MenuItemTagModel = {
  id: string;
  name: string;
  image: number;
  include_groups: number[];
  exclude_groups: number[];
};
