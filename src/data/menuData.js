import { categories } from './categories.js'

const categoryCopy = {
  'weekly-pick': {
    funTitle: 'پیشنهاد هفته ✨',
    mascotMessage: 'یه پیشنهاد خوشمزه برای این هفته آماده‌ست!',
  },
  favorites: {
    funTitle: 'مورد علاقه‌ی تریاپانی‌ها ❤️',
    mascotMessage: 'یه انتخاب محبوب پیدا می‌کنی رفیق!',
  },
  'hot-drinks': {
    funTitle: 'داغ و حال‌خوب‌کن ☕',
    mascotMessage: 'یه فنجون آرامش برات دم کنم یا کافئین فول؟',
  },
  'cold-drinks': {
    funTitle: 'خنکای تگری و باطراوت 🧊',
    mascotMessage: 'گرما رو بسپار به من، جون می‌ده واسه خنک شدن!',
  },
  desserts: {
    funTitle: 'شیرینی‌های دلبر و دست‌پخت روز 🍰',
    mascotMessage: 'رژیم باشه واسه شنبه! امروز فقط باید لذت برد.',
  },
  shakes: {
    funTitle: 'بمب انرژی و شیک‌های غلیظ 🥤',
    mascotMessage: 'یه شیک بزن تا کل روز شارژت پر بمونه!',
  },
  'ice-cream': {
    funTitle: 'بستنی‌های رنگارنگ و نوستالژیک 🍦',
    mascotMessage: 'بستنی خوردن سن و سال نمی‌شناسه رفیق!',
  },
  snacks: {
    funTitle: 'لقمه‌های داغ و خوش‌خوراک 🥪',
    mascotMessage: 'صدای قاروقور شکمتو شنیدم، یه چیز مشتی برات دارم.',
  },
  'chips-corn': {
    funTitle: 'مخصوص دورهمی و خوش‌گذرونی 🍿',
    mascotMessage: 'با یه ظرف چیپس و پنیر داغ چطوری؟ رفیق پایه‌ته!',
  },
}

export const menuCategories = categories.map((category) => ({
  ...category,
  ...categoryCopy[category.id],
}))
