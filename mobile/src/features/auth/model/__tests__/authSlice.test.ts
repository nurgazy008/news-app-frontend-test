import authReducer, {
  setAuthenticated,
  setBiometricEnabled,
  setLoading,
  logout,
} from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    isAuthenticated: false,
    isBiometricEnabled: false,
    isLoading: false,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setAuthenticated', () => {
    const state = authReducer(initialState, setAuthenticated(true));
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle setBiometricEnabled', () => {
    const state = authReducer(initialState, setBiometricEnabled(true));
    expect(state.isBiometricEnabled).toBe(true);
  });

  it('should handle setLoading', () => {
    const state = authReducer(initialState, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('should handle logout', () => {
    const authenticatedState = authReducer(
      authReducer(initialState, setAuthenticated(true)),
      setBiometricEnabled(true)
    );
    const state = authReducer(authenticatedState, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.isBiometricEnabled).toBe(false);
  });
});

