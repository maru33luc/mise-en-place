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
    it('rechaza vacío', () => expect(validateTitle('')).toBe('El título es requerido'));
    it('rechaza solo números', () => expect(validateTitle('123')).toBe('El título no puede ser solo un número'));
    it('acepta texto normal', () => expect(validateTitle('Carbonara')).toBeNull());
  });

  describe('validateDescription', () => {
    it('rechaza vacío', () => expect(validateDescription('')).toBe('La descripción es requerida'));
    it('acepta texto', () => expect(validateDescription('Una rica receta')).toBeNull());
  });

  describe('validateIngredientName', () => {
    it('rechaza vacío', () => expect(validateIngredientName('')).toBe('El nombre del ingrediente es requerido'));
    it('rechaza numérico', () => expect(validateIngredientName('42')).toBe('El nombre del ingrediente no puede ser solo un número'));
    it('acepta nombre', () => expect(validateIngredientName('pasta')).toBeNull());
  });

  describe('validateIngredientAmount', () => {
    it('rechaza vacío/null', () => expect(validateIngredientAmount('')).toBe('La cantidad debe ser un número positivo'));
    it('rechaza <=0', () => expect(validateIngredientAmount('0')).toBe('La cantidad debe ser un número positivo'));
    it('acepta decimal', () => expect(validateIngredientAmount('1.5')).toBeNull());
  });

  describe('validateIngredientUnit', () => {
    it('rechaza vacío', () => expect(validateIngredientUnit('')).toBe('La unidad es requerida'));
    it('rechaza numérico', () => expect(validateIngredientUnit('7')).toBe('La unidad no puede ser solo un número'));
    it('acepta unidad', () => expect(validateIngredientUnit('g')).toBeNull());
  });

  describe('validateIngredients', () => {
    it('rechaza vacío', () => expect(validateIngredients([])).toBe('Agrega al menos 1 ingrediente'));
    it('acepta con al menos 1', () =>
      expect(validateIngredients([{ name: 'a', amount: 1, unit: 'g' }])).toBeNull());
  });
});