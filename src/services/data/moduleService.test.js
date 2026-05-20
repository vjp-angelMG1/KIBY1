import { ModuleService } from './index';
import { collection, getDocs, addDoc, getDoc, updateDoc, doc } from "firebase/firestore";

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(), getDocs: jest.fn(), addDoc: jest.fn(),
  getDoc: jest.fn(), updateDoc: jest.fn(), deleteDoc: jest.fn(), doc: jest.fn()
}));

jest.mock('../authService', () => ({ db: {} }));

describe('ModuleService - Tests Unitarios', () => {

  it('1. addPurchase() NO debería actualizar si el usuario ya tiene el módulo', async () => {
    // ARRANGE: Simulamos que el usuario ya tiene el módulo 'mod1' comprado
    getDoc.mockResolvedValueOnce({ 
      exists: () => true, 
      data: () => ({ purchases: ['mod1', 'mod2'] }) 
    });
    updateDoc.mockResolvedValueOnce();

    // ACT: Intentamos añadir 'mod1' de nuevo
    await ModuleService.addPurchase('user123', 'mod1');

    // ASSERT: updateDoc NO debería haberse llamado
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('2. addPurchase() SÍ debería actualizar si el módulo es nuevo para el usuario', async () => {
    // ARRANGE: Simulamos que el usuario tiene 'mod1', pero no 'mod3'
    getDoc.mockResolvedValueOnce({ 
      exists: () => true, 
      data: () => ({ purchases: ['mod1'] }) 
    });
    updateDoc.mockResolvedValueOnce();

    // ACT: Intentamos añadir 'mod3'
    await ModuleService.addPurchase('user123', 'mod3');

    // ASSERT: updateDoc DEBERÍA haberse llamado con el array actualizado
    expect(updateDoc).toHaveBeenCalledTimes(1);
    const updateData = updateDoc.mock.calls[0][1];
    expect(updateData.purchases).toEqual(['mod1', 'mod3']); // Se añadió sin borrar el anterior
  });
});