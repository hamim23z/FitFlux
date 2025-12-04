export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleFileExtensions: ['js', 'jsx'],
    transform: { '^.+\\.(js|jsx)$': 'babel-jest' },
    moduleNameMapper: {
      
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  }