import { specialOffers } from './specialOffers.js'

const offerSubcategoryById = {
  'espresso-cookie': 'weekly-drinks',
  'iced-vanilla-latte': 'weekly-drinks',
  'warm-chocolate-waffle': 'weekly-desserts',
}

const sampleProduct = (product) => ({
  ...product,
  imagePath: '',
  isSample: true,
})

export const menuProducts = [
  ...specialOffers.map((product) => sampleProduct({
    ...product,
    categoryId: 'weekly-pick',
    subcategoryId: offerSubcategoryById[product.id],
  })),
  sampleProduct({ id: 'coffee-cookie-favorite', categoryId: 'favorites', subcategoryId: null, name: 'قهوه و کوکی', description: 'یک ترکیب ساده برای وقت استراحت.', displayPrice: '۱۲۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'cheesecake-favorite', categoryId: 'favorites', subcategoryId: null, name: 'چیزکیک روز', description: 'یک برش چیزکیک برای همراهی قهوه.', displayPrice: '۱۴۵٬۰۰۰ تومان' }),

  sampleProduct({ id: 'espresso-single', categoryId: 'hot-drinks', subcategoryId: 'hot-coffee', name: 'اسپرسو سینگل', description: 'یک فنجان قهوه‌ی اسپرسو.', displayPrice: '۸۵٬۰۰۰ تومان' }),
  sampleProduct({ id: 'french-press', categoryId: 'hot-drinks', subcategoryId: 'hot-brewed', name: 'قهوه فرنچ‌پرس', description: 'قهوه‌ی دم‌آوری‌شده با فرنچ‌پرس.', displayPrice: '۱۲۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'black-tea', categoryId: 'hot-drinks', subcategoryId: 'hot-tea', name: 'چای سیاه', description: 'یک قوری چای تازه‌دم.', displayPrice: '۷۵٬۰۰۰ تومان' }),

  sampleProduct({ id: 'orange-juice', categoryId: 'cold-drinks', subcategoryId: 'cold-juice', name: 'آب‌پرتقال', description: 'آب‌میوه‌ی خنک پرتقال.', displayPrice: '۱۱۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'berry-smoothie', categoryId: 'cold-drinks', subcategoryId: 'cold-smoothie', name: 'اسموتی توت‌فرنگی', description: 'اسموتی خنک با طعم توت‌فرنگی.', displayPrice: '۱۳۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'lemonade', categoryId: 'cold-drinks', subcategoryId: 'cold-lemonade', name: 'لیموناد', description: 'لیموناد خنک و ترش‌وشیرین.', displayPrice: '۹۵٬۰۰۰ تومان' }),
  sampleProduct({ id: 'iced-latte', categoryId: 'cold-drinks', subcategoryId: 'cold-coffee', name: 'آیس لاته', description: 'قهوه و شیر سرد با یخ.', displayPrice: '۱۱۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'berry-mocktail', categoryId: 'cold-drinks', subcategoryId: 'cold-mocktail', name: 'موکتل بری', description: 'نوشیدنی میوه‌ای خنک و بدون الکل.', displayPrice: '۱۲۵٬۰۰۰ تومان' }),
  sampleProduct({ id: 'energy-drink', categoryId: 'cold-drinks', subcategoryId: 'cold-energy', name: 'نوشیدنی انرژی‌زا', description: 'یک نوشیدنی خنک انرژی‌زا.', displayPrice: '۱۰۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'daily-cold-special', categoryId: 'cold-drinks', subcategoryId: 'cold-daily-special', name: 'نوشیدنی ویژه‌ی روز', description: 'پیشنهاد آزمایشی روز برای نوشیدنی سرد.', displayPrice: '۱۳۰٬۰۰۰ تومان' }),

  sampleProduct({ id: 'chocolate-cookie', categoryId: 'desserts', subcategoryId: 'dessert-cookies', name: 'کوکی شکلاتی', description: 'کوکی تازه با تکه‌های شکلات.', displayPrice: '۶۵٬۰۰۰ تومان' }),
  sampleProduct({ id: 'classic-cheesecake', categoryId: 'desserts', subcategoryId: 'dessert-cheesecake', name: 'چیزکیک کلاسیک', description: 'چیزکیک لطیف با پایه‌ی بیسکویتی.', displayPrice: '۱۴۵٬۰۰۰ تومان' }),
  sampleProduct({ id: 'chocolate-waffle', categoryId: 'desserts', subcategoryId: 'dessert-waffles-crepes', name: 'وافل شکلاتی', description: 'وافل گرم با سس شکلات.', displayPrice: '۱۵۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'carrot-cake', categoryId: 'desserts', subcategoryId: 'dessert-cakes', name: 'کیک هویج و گردو', description: 'کیک روز با هویج و گردو.', displayPrice: '۱۲۰٬۰۰۰ تومان' }),

  sampleProduct({ id: 'chocolate-shake', categoryId: 'shakes', subcategoryId: 'shake-classic', name: 'شیک شکلات', description: 'شیک خنک با طعم شکلات.', displayPrice: '۱۴۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'banana-mix', categoryId: 'shakes', subcategoryId: 'shake-mix', name: 'معجون موز', description: 'معجون خنک با طعم موز.', displayPrice: '۱۶۰٬۰۰۰ تومان' }),

  sampleProduct({ id: 'vanilla-scoop', categoryId: 'ice-cream', subcategoryId: 'ice-cream-scoops', name: 'بستنی اسکوپی وانیلی', description: 'بستنی وانیلی اسکوپی.', displayPrice: '۹۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'ice-cream-cone', categoryId: 'ice-cream', subcategoryId: 'ice-cream-cones', name: 'بستنی قیفی', description: 'بستنی در نان قیفی.', displayPrice: '۷۵٬۰۰۰ تومان' }),
  sampleProduct({ id: 'ice-cream-cup', categoryId: 'ice-cream', subcategoryId: 'ice-cream-sundae', name: 'جام بستنی', description: 'بستنی در جام سرو.', displayPrice: '۱۲۰٬۰۰۰ تومان' }),

  sampleProduct({ id: 'chicken-sandwich', categoryId: 'snacks', subcategoryId: 'snacks-sandwich', name: 'ساندویچ مرغ', description: 'ساندویچ گرم مرغ.', displayPrice: '۱۸۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'potato-fries', categoryId: 'snacks', subcategoryId: 'snacks-fast-food', name: 'سیب‌زمینی سرخ‌کرده', description: 'سیب‌زمینی سرخ‌شده‌ی تازه.', displayPrice: '۱۲۰٬۰۰۰ تومان' }),

  sampleProduct({ id: 'potato-chips', categoryId: 'chips-corn', subcategoryId: 'chips', name: 'چیپس', description: 'یک پرس چیپس.', displayPrice: '۸۰٬۰۰۰ تومان' }),
  sampleProduct({ id: 'cheese-corn', categoryId: 'chips-corn', subcategoryId: 'corn', name: 'ذرت مکزیکی', description: 'ذرت گرم با افزودنی‌های معمول.', displayPrice: '۱۱۰٬۰۰۰ تومان' }),
]
