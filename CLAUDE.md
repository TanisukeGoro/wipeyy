# WIPEYY DEVELOPER GUIDE

## Build Commands
- 🚀 Build: `yarn build` - Production build with webpack
- 🔄 Development: `yarn start` - Run webpack-dev-server
- 👀 Watch: `yarn watch` - Run webpack in watch mode
- 🧹 Lint: `yarn lint` (check) / `yarn lint:fix` (auto-fix)
- ✨ Format: `yarn format` (fix) / `yarn check-format` (check)

## Code Style Guidelines
- React functional components with hooks
- File extensions: `.jsx` for components, `.js` for utilities
- Naming: PascalCase for components, camelCase for functions/variables
- Imports order: React → Components → Utils → Styles
- Error handling: Try/catch with ExtensionService.log for errors
- React import not required (JSX transform enabled)
- No PropTypes (disabled in ESLint)
- 120 character line width, 4 spaces indent, single quotes
- Tailwind CSS for styling with DaisyUI components