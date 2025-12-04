import '@testing-library/jest-dom';


global.fetch = global.fetch || jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
