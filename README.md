# ChoreChart

A simple chore tracking app for kids to manage their daily tasks and earn allowance. Designed as a Progressive Web App (PWA) with offline support, this app helps kids track their daily chores and earn rewards.

![ChoreChart App](https://via.placeholder.com/800x450?text=ChoreChart+App)

## Features

- Track daily recurring chores (3 items per day)
- Special daily chore that changes each day of the week
- Bonus chore option (dishwasher) worth extra credit
- Dark mode for comfortable viewing
- Reward system ($1 per completed chore set)
- Weekly summary and allowance calculation
- PWA with offline support
- Local storage for data persistence
- Mobile-friendly design

## How It Works

1. Each day has three recurring tasks (worth $1 when all completed)
2. Each day has a unique special chore (worth $1)
3. Bonus chore when available (dishwasher - worth $1)
4. Weekly summary shows total earnings for easy tracking
5. Reset feature for starting a new week

## Technology Stack

- Vue.js 3 (Composition API)
- Quasar Framework
- PWA capabilities
- LocalStorage for data persistence
- SCSS for styling

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chorechart.git
   cd chorechart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Access the app at `http://localhost:9000`

### Production Build

1. Build for production:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory

## Deployment

### Standard Web Server

Upload the contents of the `dist` directory to your web hosting service's public directory.

### As a Subdirectory

The app is configured to run in a subdirectory (`/chorechart/`). If you're hosting at a different path:

1. Update `publicPath` in `quasar.config.js`
2. Update the history base in `src/router/index.js`
3. Update the `start_url` in the PWA manifest

## Customization

- **Chores**: Update the list of daily and unique chores by modifying the `defaultData` object in `src/pages/IndexPage.vue`
- **Theme**: Adjust colors in the Quasar config and CSS files
- **Rewards**: Change the reward structure by editing the calculation functions

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.