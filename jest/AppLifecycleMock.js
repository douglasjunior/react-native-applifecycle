const {AppState} = require('react-native');

const AppLifecycle = {
  addEventListener: AppState.addEventListener,
  get currentState() {
    return AppState.currentState;
  },
  isAvailable: AppState.isAvailable,
};

module.exports = {
  __esModule: true,
  default: {
    AppLifecycle, 
    useAppLifecycle: jest.fn(),
  },
  useAppLifecycle: jest.fn(),
  AppLifecycle,
};
