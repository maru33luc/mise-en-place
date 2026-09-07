import {
  validateTitle,
  validateDescription,
  validateIngredients,
  validateIngredientName,
  validateIngredientAmount,
  validateIngredientUnit,
} from './validators';

describe('validators', () => {
  describe('validateTitle', () => {
    it('rejects empty values', () => expect(validateTitle('')).toBe('Title is required'));
    it('rejects numeric-only values', () => expect(validateTitle('123')).toBe('Title cannot contain only numbers'));
    it('acepta texto normal', () => expect(validateTitle('Carbonara')).toBeNull());
  });

  describe('validateDescription', () => {
    it('rejects empty values', () => expect(validateDescription('')).toBe('Description is required'));
    it('accepts text', () => expect(validateDescription('A rich recipe')).toBeNull());
  });

  describe('validateIngredientName', () => {
    it('rejects empty values', () => expect(validateIngredientName('')).toBe('Ingredient name is required'));
    it('rejects numeric-only values', () => expect(validateIngredientName('42')).toBe('Ingredient name cannot contain only numbers'));
    it('accepts names', () => expect(validateIngredientName('pasta')).toBeNull());
  });

  describe('validateIngredientAmount', () => {
    it('rejects empty values', () => expect(validateIngredientAmount('')).toBe('Amount must be a positive number'));
    it('rejects <=0', () => expect(validateIngredientAmount('0')).toBe('Amount must be a positive number'));
    it('accepts numeric input values', () => expect(validateIngredientAmount(320)).toBeNull());
    it('accepts decimals', () => expect(validateIngredientAmount('1.5')).toBeNull());
  });

  describe('validateIngredientUnit', () => {
    it('rejects empty values', () => expect(validateIngredientUnit('')).toBe('Unit is required'));
    it('rejects numeric-only values', () => expect(validateIngredientUnit('7')).toBe('Unit cannot contain only numbers'));
    it('accepts units', () => expect(validateIngredientUnit('g')).toBeNull());
  });

  describe('validateIngredients', () => {
    it('rejects empty lists', () => expect(validateIngredients([])).toBe('Add at least one ingredient'));
    it('accepts at least one ingredient', () =>
      expect(validateIngredients([{ name: 'a', amount: 1, unit: 'g' }])).toBeNull());
  });
});