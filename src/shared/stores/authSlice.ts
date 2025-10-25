import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PatientInfo = {
  patientId: string | null;
  fullName: string | null;
  dob: string | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  role: string | null;
  patient: PatientInfo | null;
  socketConnected?: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  role: null,
  patient: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        role: string;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
    },
    setPatient: (state, action: PayloadAction<PatientInfo>) => {
      state.patient = action.payload;
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },
    clearTokens: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.role = null;
      state.patient = null;
      state.socketConnected = false;
    },
  },
});

export const { setTokens, setPatient, clearTokens, setSocketConnected } = authSlice.actions;
export default authSlice.reducer;
