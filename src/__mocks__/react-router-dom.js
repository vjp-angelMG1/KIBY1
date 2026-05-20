const React = require('react');

module.exports = {
  useNavigate: () => jest.fn(),
  Link: ({ children }) => React.createElement('div', null, children),
  NavLink: ({ children }) => React.createElement('div', null, children),
  Navigate: ({ to }) => React.createElement('div', null, `navigate-to:${to}`),
  Routes: ({ children }) => React.createElement('div', null, children),
  Route: ({ element }) => element,
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' })
};
