import { PresetList } from '../types';

export const PRESET_LISTS: PresetList[] = [
  {
    id: 'giveaways_names',
    category: { ar: 'المسابقات والأسماء', en: 'Giveaways & Names' },
    title: { ar: 'أسماء الفائزين والمشتركين', en: 'Participant Names' },
    items: ['Emma Watson', 'James Smith', 'Sophia Garcia', 'Alexander Brown', 'Olivia Johnson', 'Liam Miller', 'Ava Davis', 'Ethan Wilson', 'Isabella Martinez', 'Lucas Taylor'],
  },
  {
    id: 'food_decision',
    category: { ar: 'قرارات يومية', en: 'Daily Decisions' },
    title: { ar: 'ماذا نأكل اليوم؟', en: 'What to Eat Today?' },
    items: ['Pepperoni Pizza 🍕', 'Juicy Burger 🍔', 'Fresh Sushi 🍣', 'Tacos & Burritos 🌮', 'Creamy Pasta 🍝', 'Healthy Salad 🥗', 'Barbecue Ribs 🍖', 'Ramen Bowl 🍜'],
  },
  {
    id: 'truth_or_dare',
    category: { ar: 'ألعاب وتسلية', en: 'Games & Fun' },
    title: { ar: 'حقيقة أم تحدي؟ (Truth or Dare)', en: 'Truth or Dare' },
    items: [
      'Truth: What is your biggest fear?',
      'Dare: Sing out loud for 15 seconds',
      'Truth: What is your most embarrassing memory?',
      'Dare: Do 10 jumping jacks right now',
      'Truth: What is a secret talent you have?',
      'Dare: Speak in a funny accent for 2 minutes',
      'Truth: Who was your childhood celebrity crush?',
      'Dare: Let someone redesign your profile pic',
    ],
  },
  {
    id: 'numbers_1_10',
    category: { ar: 'أرقام وحساب', en: 'Numbers & Math' },
    title: { ar: 'أرقام عشوائية (1 إلى 10)', en: 'Random Numbers (1-10)' },
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  {
    id: 'team_picker',
    category: { ar: 'فرق ومجموعات', en: 'Team Division' },
    title: { ar: 'توزيع الفرق والمهام', en: 'Team Roles & Colors' },
    items: ['Red Team 🔴', 'Blue Team 🔵', 'Green Team 🟢', 'Yellow Team 🟡', 'Purple Team 🟣'],
  },
  {
    id: 'yes_or_no',
    category: { ar: 'قرارات سريعة', en: 'Quick Decision' },
    title: { ar: 'نعم أم لا؟ (Yes or No)', en: 'Yes or No?' },
    items: ['Yes ✅', 'No ❌', 'Maybe ❓', 'Spin Again 🔄'],
  },
  {
    id: 'classroom_picker',
    category: { ar: 'التعليم والمدارس', en: 'Education & Classroom' },
    title: { ar: 'اختيار طالب للإجابة', en: 'Classroom Student Picker' },
    items: ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6', 'Student 7', 'Student 8'],
  },
  {
    id: 'movie_genre',
    category: { ar: 'ترفيه وأفلام', en: 'Entertainment' },
    title: { ar: 'نوع فيلم الليلة', en: 'Movie Night Genre' },
    items: ['Action & Adventure 💥', 'Comedy 🎭', 'Sci-Fi Thriller 🚀', 'Horror Night 👻', 'Animation / Pixar 🎨', 'Documentary 🎥'],
  },
];
