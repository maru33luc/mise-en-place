import type { Recipe } from './recipe.model';

export type MenuSection = 'starters' | 'mains' | 'desserts';

export interface MenuItem extends Recipe {
  section?: MenuSection;
}

export interface DailyMenu {
  id?: number;
  date: string;
  guestCount: number;
  sections: Record<MenuSection, MenuItem[]>;
}

export type PrepStatus = 'pending' | 'in-progress' | 'done';
export type PrepPriority = 'low' | 'medium' | 'high';

export interface PrepTask {
  id: number;
  name: string;
  ingredient: string;
  quantity: string;
  unit: string;
  technique: string;
  estimatedMinutes: number;
  priority: PrepPriority;
  status: PrepStatus;
  elapsedSeconds: number;
  notes: string;
}
