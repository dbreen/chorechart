// Collection of stickers organized by categories
export const stickerCollection = {
  animals: [
    { id: 'animal1', emoji: '🐶', name: 'Dog' },
    { id: 'animal2', emoji: '🐱', name: 'Cat' },
    { id: 'animal3', emoji: '🐼', name: 'Panda' },
    { id: 'animal4', emoji: '🦊', name: 'Fox' },
    { id: 'animal5', emoji: '🦄', name: 'Unicorn' },
    { id: 'animal6', emoji: '🐬', name: 'Dolphin' }
  ],
  food: [
    { id: 'food1', emoji: '🍕', name: 'Pizza' },
    { id: 'food2', emoji: '🍦', name: 'Ice Cream' },
    { id: 'food3', emoji: '🍩', name: 'Donut' },
    { id: 'food4', emoji: '🍔', name: 'Burger' },
    { id: 'food5', emoji: '🍓', name: 'Strawberry' },
    { id: 'food6', emoji: '🍭', name: 'Lollipop' }
  ],
  faces: [
    { id: 'face1', emoji: '😊', name: 'Smile' },
    { id: 'face2', emoji: '🥳', name: 'Party' },
    { id: 'face3', emoji: '😎', name: 'Cool' },
    { id: 'face4', emoji: '🤩', name: 'Star Eyes' },
    { id: 'face5', emoji: '😍', name: 'Heart Eyes' },
    { id: 'face6', emoji: '🦸', name: 'Superhero' }
  ],
  activities: [
    { id: 'activity1', emoji: '🏆', name: 'Trophy' },
    { id: 'activity2', emoji: '⭐', name: 'Star' },
    { id: 'activity3', emoji: '🎮', name: 'Game' },
    { id: 'activity4', emoji: '🎯', name: 'Target' },
    { id: 'activity5', emoji: '🏅', name: 'Medal' },
    { id: 'activity6', emoji: '🚀', name: 'Rocket' }
  ]
};

// Get a random sticker
export function getRandomSticker() {
  const categories = Object.keys(stickerCollection);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const stickers = stickerCollection[randomCategory];
  return stickers[Math.floor(Math.random() * stickers.length)];
}

// Get all stickers as a flat array
export function getAllStickers() {
  return Object.values(stickerCollection).flat();
}
