jest.mock('firebase/app', () => ({ initializeApp: jest.fn() }));

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve('signedIn')),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve('created')),
    signOut: jest.fn(() => Promise.resolve('signedOut')),
    onAuthStateChanged: jest.fn((auth, cb) => { cb(null); return jest.fn(); }),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(() => Promise.resolve('popup'))
  };
});

jest.mock('firebase/firestore', () => ({ getFirestore: jest.fn() }));

const authService = require('./authService');
const firebaseAuth = require('firebase/auth');

describe('authService (unit)', () => {
  it('exporta funciones y llama a firebase auth correctamente', async () => {
    await authService.loginWithEmailPassword('a@a.com','pass');
    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();

    await authService.registerWithEmailPassword('b@b.com','pw');
    expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalled();

    await authService.loginWithGoogle();
    expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
    expect(firebaseAuth.GoogleAuthProvider).toHaveBeenCalled();

    await authService.logoutUser();
    expect(firebaseAuth.signOut).toHaveBeenCalled();

    firebaseAuth.onAuthStateChanged.mockImplementationOnce((auth, cb) => { cb(null); return () => {}; });
    const unsubscribeMock = authService.subscribeToAuthChanges(() => {});
    expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalled();
    expect(typeof unsubscribeMock).toBe('function');
  });

  it('subscribeToAuthChanges llama al callback cuando cambia el auth', () => {
    const cb = jest.fn();
    authService.subscribeToAuthChanges(cb);
    expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalled();
    const innerCb = firebaseAuth.onAuthStateChanged.mock.calls[0][1];
    innerCb({ uid: 'u1' });
    expect(cb).toHaveBeenCalledWith({ uid: 'u1' });
  });
});
