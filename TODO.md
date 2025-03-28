# ChoreChart App TODO

## Core Requirements
- [x] Vue.js PWA with Quasar framework
- [x] Local storage for data persistence
- [x] Daily chore tracking system
- [x] Weekly summary and reward calculation

## Features
- [x] Daily chores section with 3 recurring tasks:
  - [x] Empty backpack
  - [x] Dishes in sink
  - [x] Change dog water
  - [x] Worth $1 when all 3 completed

- [x] Unique daily chore section:
  - [x] Different chore each day (vacuum, dust, laundry, etc.)
  - [x] Worth $1 when completed

- [x] Bonus chore section:
  - [x] Emptying dishwasher ($1)
  - [x] Only shows when needed

- [x] Weekly summary screen:
  - [x] Show completion status for each day
  - [x] Calculate total allowance earned
  - [x] Visual progress indicators

## Technical Considerations
- [x] Simple, kid-friendly UI
- [x] Offline-first functionality
- [x] Local storage for data persistence
- [x] Responsive design for various devices

## Implemented Enhancements
- [x] Dark mode/theme support
- [x] Weekday-only schedule (removed weekends)
- [x] Support for hosting in subdirectory (/chorechart/)
- [x] Comprehensive documentation

## Questions/Ideas to Consider

### User Experience
- [ ] Should there be a parental mode with password protection?
- [x] How should we handle weekly reset? Automatic or manual? (Implemented manual reset)
- [ ] Should we include visual rewards (stickers/emojis) for completed tasks?
- [x] What's the best way to indicate completed vs incomplete days visually? (Implemented color coding)

### Technical Implementation
- [ ] Do we need user accounts or is this a single-user app?
- [ ] Should we consider Firebase for optional cloud backup?
- [ ] How should we handle data migration if app is updated?
- [ ] Should we implement push notifications as reminders?

### Content and Customization
- [ ] Allow parents to change reward amounts?
- [ ] Provide predefined chore templates or start from scratch?
- [ ] Include images/icons for each chore type?
- [x] Allow customizing app color themes? (Implemented dark mode)

### Future Growth
- [ ] Consider multiple kids tracking?
- [ ] Implement chore rotation system?
- [ ] Add progress tracking over time (charts/graphs)?
- [ ] Include educational elements about money management?