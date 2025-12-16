// QA Sprint 4: confirm Jest setup file is tracked correctly
import '@testing-library/jest-dom';


global.fetch = global.fetch || jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
