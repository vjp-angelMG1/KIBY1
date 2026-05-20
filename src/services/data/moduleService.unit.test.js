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

const ModuleService = require('./moduleService').default;
const firestore = require('firebase/firestore');

describe('ModuleService unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll devuelve módulos cuando hay documentos', async () => {
    firestore.getDocs.mockResolvedValueOnce({ docs: [{ id: 'm1', data: () => ({ title: 'M1' }) }] });
    const modules = await ModuleService.getAll();
    expect(modules).toEqual([{ id: 'm1', title: 'M1' }]);
    expect(firestore.collection).toHaveBeenCalledWith({}, 'modules');
  });

  it('getById devuelve el módulo cuando existe', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => true, id: 'm2', data: () => ({ title: 'M2' }) });
    const moduleData = await ModuleService.getById('m2');
    expect(moduleData).toEqual({ id: 'm2', title: 'M2' });
    expect(firestore.doc).toHaveBeenCalledWith({}, 'modules', 'm2');
  });

  it('getById devuelve null cuando no existe', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    const moduleData = await ModuleService.getById('m3');
    expect(moduleData).toBeNull();
  });

  it('create transforma campos y llama addDoc', async () => {
    firestore.addDoc.mockResolvedValueOnce();

    await ModuleService.create({
      title: 'New Module',
      desc: 'Descripcion',
      category: 'Programación',
      price: '50',
      img: '',
      imgList: 'https://a.com, https://b.com',
      features: 'A, B, C'
    });

    expect(firestore.addDoc).toHaveBeenCalledTimes(1);
    const [_, savedData] = firestore.addDoc.mock.calls[0];
    expect(savedData.price).toBe(50);
    expect(savedData.images).toEqual(['https://a.com', 'https://b.com']);
    expect(savedData.features).toEqual(['A', 'B', 'C']);
    expect(savedData.img).toContain('https://placehold.co');
  });

  it('update transforma campos y llama updateDoc', async () => {
    firestore.updateDoc.mockResolvedValueOnce();

    await ModuleService.update({
      id: 'm4',
      title: 'Updated',
      price: '25',
      imgList: 'https://a.com',
      features: 'X, Y'
    });

    expect(firestore.updateDoc).toHaveBeenCalledTimes(1);
    const [docRef, updateData] = firestore.updateDoc.mock.calls[0];
    expect(firestore.doc).toHaveBeenCalledWith({}, 'modules', 'm4');
    expect(updateData.price).toBe(25);
    expect(updateData.images).toEqual(['https://a.com']);
    expect(updateData.features).toEqual(['X', 'Y']);
  });

  it('delete llama deleteDoc con el documento correcto', async () => {
    firestore.deleteDoc.mockResolvedValueOnce();
    await ModuleService.delete('m5');
    expect(firestore.deleteDoc).toHaveBeenCalledTimes(1);
    expect(firestore.doc).toHaveBeenCalledWith({}, 'modules', 'm5');
  });

  it('addPurchase no actualiza si ya existe el módulo', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ purchases: ['m1'] }) });
    await ModuleService.addPurchase('user1', 'm1');
    expect(firestore.updateDoc).not.toHaveBeenCalled();
  });

  it('addPurchase actualiza si el módulo es nuevo', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ purchases: ['m1'] }) });
    firestore.updateDoc.mockResolvedValueOnce();
    await ModuleService.addPurchase('user1', 'm2');
    expect(firestore.updateDoc).toHaveBeenCalledTimes(1);
    const updateData = firestore.updateDoc.mock.calls[0][1];
    expect(updateData.purchases).toEqual(['m1', 'm2']);
  });

  it('getMyModules devuelve [] si no hay compras', async () => {
    firestore.getDoc.mockResolvedValueOnce({ data: () => ({ purchases: [] }) });
    const modules = await ModuleService.getMyModules('user1');
    expect(modules).toEqual([]);
  });

  it('getMyModules filtra módulos comprados', async () => {
    firestore.getDoc.mockResolvedValueOnce({ data: () => ({ purchases: ['m1'] }) });
    firestore.getDocs.mockResolvedValueOnce({ docs: [{ id: 'm1', data: () => ({ title: 'M1' }) }, { id: 'm2', data: () => ({ title: 'M2' }) }] });
    const modules = await ModuleService.getMyModules('user1');
    expect(modules).toEqual([{ id: 'm1', title: 'M1' }]);
  });

  it('getBuyersForModule devuelve emails de la consulta', async () => {
    firestore.getDocs.mockResolvedValueOnce({ docs: [{ data: () => ({ email: 'a@a.com' }) }, { data: () => ({ email: 'b@b.com' }) }] });
    const buyers = await ModuleService.getBuyersForModule('m1');
    expect(buyers).toEqual(['a@a.com', 'b@b.com']);
    expect(firestore.query).toHaveBeenCalled();
  });
});
