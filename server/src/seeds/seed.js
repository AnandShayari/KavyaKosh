import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Poetry from '../models/Poetry.js';
import Book from '../models/Book.js';
import Post from '../models/Post.js';
import Community from '../models/Community.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kavyakosh');
  console.log('Connected for seeding...');

  await Promise.all([User.deleteMany(), Poetry.deleteMany(), Book.deleteMany(), Post.deleteMany(), Community.deleteMany()]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@kavyakosh.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
    isEmailVerified: true,
    bio: 'KavyaKosh Platform Administrator',
  });

  const author = await User.create({
    name: 'Mirza Ghalib',
    email: 'ghalib@kavyakosh.com',
    password: 'author123',
    role: 'author',
    isVerified: true,
    isEmailVerified: true,
    bio: 'Legendary Urdu poet. Master of ghazals and shayari.',
    writingStreak: 365,
    badges: [{ name: 'Legend', icon: 'crown', earnedAt: new Date() }],
  });

  const author2 = await User.create({
    name: 'Gulzar',
    email: 'gulzar@kavyakosh.com',
    password: 'author123',
    role: 'author',
    isVerified: true,
    bio: 'Award-winning poet, lyricist, and filmmaker.',
    writingStreak: 120,
  });

  const shayaris = [
    { title: 'Dil Ki Baat', content: 'Dil ki baat lab pe aane se pehle\nKuch lamhe guzar jaate hain\nPhir bhi keh dete hain hum\nJo kehna zaroori hota hai', type: 'shayari', language: 'hindi', mood: 'romantic', featured: true },
    { title: 'Raat Ka Safar', content: 'Raat ka safar shuru hota hai\nChandni ke saaye mein\nHar khamoshi ek kahani sunati hai\nDil ke kone mein chhupi hui', type: 'shayari', language: 'hindi', mood: 'sad', featured: true },
    { title: 'Mohabbat', content: 'Mohabbat ek aisi darya hai\nJisme doob kar hi samajh aati hai\nUski gehraai\nWarna kinare se kya pata chalta hai', type: 'shayari', language: 'urdu', mood: 'love' },
    { title: 'Zindagi', content: 'Zindagi ek kitaab hai\nHar page par naya paigaam\nKabhi hansati hai, kabhi rulati hai\nPar padhte rehna zaroori hai', type: 'nazm', language: 'hindi', mood: 'motivational' },
  ];

  for (const s of shayaris) {
    await Poetry.create({ ...s, author: author._id, status: 'published', views: Math.floor(Math.random() * 5000), likes: [admin._id] });
  }

  const books = [
    { title: 'Diwan-e-Ghalib', description: 'The complete collection of Mirza Ghalib\'s ghazals and poetry.', coverImage: 'https://picsum.photos/seed/book1/400/600', category: 'Poetry', price: 299, discountPrice: 199, featured: true, bestseller: true, rating: 4.8, reviewCount: 234, sales: 1500 },
    { title: 'Selected Poems of Gulzar', description: 'A curated collection of Gulzar\'s finest poetry and lyrics.', coverImage: 'https://picsum.photos/seed/book2/400/600', category: 'Poetry', price: 349, featured: true, rating: 4.6, reviewCount: 189, sales: 980 },
    { title: 'Modern Hindi Shayari', description: 'Contemporary Hindi shayari from emerging poets.', coverImage: 'https://picsum.photos/seed/book3/400/600', category: 'Shayari', price: 199, discountPrice: 149, newArrival: true, rating: 4.3, reviewCount: 67 },
    { title: 'Urdu Ghazals Anthology', description: 'Timeless ghazals from the masters of Urdu literature.', coverImage: 'https://picsum.photos/seed/book4/400/600', category: 'Ghazal', price: 449, bestseller: true, trending: true, rating: 4.9, reviewCount: 312, sales: 2100 },
  ];

  for (const b of books) {
    await Book.create({ ...b, author: author._id, status: 'published', stock: 100 });
  }

  await Community.create({
    name: 'Shayari Lovers',
    description: 'A community for shayari enthusiasts to share and discuss poetry.',
    creator: author._id,
    members: [author._id, author2._id, admin._id],
    memberCount: 3,
    category: 'Poetry',
  });

  await Post.create({
    author: author._id,
    content: 'Poetry is the language of the soul. Share your favorite shayari below! #shayari #poetry #kavyakosh',
    hashtags: ['shayari', 'poetry', 'kavyakosh'],
    likes: [admin._id, author2._id],
  });

  console.log('Seed completed!');
  console.log('Admin: admin@kavyakosh.com / admin123');
  console.log('Author: ghalib@kavyakosh.com / author123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
