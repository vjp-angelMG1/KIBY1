jest.mock('../authService', () => ({ db: {} }));

jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    doc: jest.fn(),
    query: jest.fn(),
    where: jest.fn()
  };
});

const CouponService = require('./couponService').default;
const firestore = require('firebase/firestore');

describe('CouponService unit tests', () => {
  it('getAll devuelve lista cuando getDocs tiene docs', async () => {
    firestore.getDocs.mockResolvedValueOnce({ docs: [{ id: 'c1', data: () => ({ code: 'X', discount: 10 }) }] });
    const all = await CouponService.getAll();
    expect(all).toEqual([{ id: 'c1', code: 'X', discount: 10 }]);
  });

  it('applyCoupon devuelve cupón válido cuando query no empty', async () => {
    firestore.getDocs.mockResolvedValueOnce({ empty: false, docs: [{ id: 'c2', data: () => ({ code: 'PROMO', discount: 20, active: true }) }] });
    const applied = await CouponService.applyCoupon('PROMO');
    expect(applied).toEqual({ id: 'c2', code: 'PROMO', discount: 20, active: true });
  });

  it('applyCoupon devuelve null cuando no hay coincidencias', async () => {
    firestore.getDocs.mockResolvedValueOnce({ empty: true, docs: [] });
    const applied = await CouponService.applyCoupon('NOPE');
    expect(applied).toBeNull();
  });

  it('create llama a addDoc con objeto correctamente formado', async () => {
    firestore.addDoc.mockResolvedValueOnce();
    await CouponService.create('NEW', 15, 'http://img');
    expect(firestore.addDoc).toHaveBeenCalled();
    const callArgs = firestore.addDoc.mock.calls[0][1];
    expect(callArgs.code).toBe('NEW');
    expect(callArgs.discount).toBe(15);
    expect(callArgs.active).toBe(true);
    expect(callArgs.img).toBe('http://img');
  });

  it('create usa imagen por defecto si no se especifica url', async () => {
    firestore.addDoc.mockResolvedValueOnce();
    await CouponService.create('DEFAULT', 5);
    const callArgs = firestore.addDoc.mock.calls[0][1];
    expect(callArgs.code).toBe('DEFAULT');
    expect(callArgs.img).toContain('https://placehold.co');
  });

  it('toggleStatus actualiza el documento cuando existe', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ active: false }) });
    firestore.updateDoc.mockResolvedValueOnce();
    await CouponService.toggleStatus('c1');
    expect(firestore.updateDoc).toHaveBeenCalledTimes(1);
    const [, updateData] = firestore.updateDoc.mock.calls[0];
    expect(updateData.active).toBe(true);
  });

  it('toggleStatus no hace nada si no existe el cupón', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    await CouponService.toggleStatus('c2');
    expect(firestore.updateDoc).not.toHaveBeenCalled();
  });

  it('delete llama a deleteDoc con el doc correcto', async () => {
    firestore.deleteDoc.mockResolvedValueOnce();
    await CouponService.delete('c3');
    expect(firestore.deleteDoc).toHaveBeenCalledTimes(1);
    expect(firestore.doc).toHaveBeenCalledWith({}, 'coupons', 'c3');
  });
});
