import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed About
  await prisma.about.deleteMany();
  await prisma.about.create({
    data: {
      bio: "Apostle Niyi Aniya is the Founder and Senior Pastor of Waterbrooks Ministry International, a Lagos-based Christian ministry dedicated to raising spiritually sound, purpose-driven believers and leaders.\n\nWith a strong passion for discipleship, youth development, and practical Christian living, he is known for his prophetic insight, heartfelt prayers, and clear teaching of God's Word. Through his apostolic mandate, he has inspired countless lives across nations to walk in divine purpose, spiritual authority, and supernatural grace.\n\nMarked by deep revelation, prophetic precision, and the manifestation of God's tangible presence, his ministry equips believers to be conduits of heaven's kingdom on earth, discover their purpose, and live out the God-life with integrity and excellence.",
      image: "/2.jpeg",
    },
  });

  // Seed Posts (The Word)
  await prisma.post.deleteMany();
  await prisma.post.createMany({
    data: [
      {
        slug: "the-power-of-grace-in-unprecedented-seasons",
        title: "The Power of Grace in Unprecedented Seasons",
        date: new Date(),
        coverImage: "/4.jpeg",
        excerpt:
          "God's grace is more than unmerited favor—it is divine empowerment to thrive where human strength fails and doors seem shut.",
        body: `Grace is not just a theological doctrine; it is the very atmosphere of the believer's victory. When the apostle Paul confronted insurmountable obstacles, the Lord spoke directly to his spirit: "My grace is sufficient for you, for my power is made perfect in weakness."

In seasons of uncertainty, the human instinct is to rely on intellect, connections, or sheer stamina. But kingdom operations function by a higher order. When you align your heart with divine grace, labor is swallowed up in favor. What takes others decades to achieve is accomplished in moments by the lifting power of the Spirit.

Walk into today with this consciousness: You are not disadvantaged. You are carrying an empowerment that breaks limitations.`,
        published: true,
      },
      {
        slug: "walking-in-divine-clarity",
        title: "Walking in Divine Clarity",
        date: new Date(Date.now() - 86400000 * 3),
        coverImage: "/2.jpeg",
        excerpt:
          "When God speaks, confusion dissolves. Discover how to tune your spiritual ears to the frequency of heaven in times of noise.",
        body: `The loudest voices in our world are rarely the most true. If you navigate life solely by the sensory inputs of cultural trends and worldly anxieties, your footsteps will waver.

Clarity is the inheritance of the righteous. David declared in the Psalms, "Your word is a lamp to my feet and a light to my path." Notice that the lamp addresses your immediate step, while the light illuminates the distant horizon. 

God does not always show the entire journey, but He is faithful to illuminate the next obedient step. Quiet your soul today. Turn away from the cacophony of fear, and listen for the still, small voice that whispers: "This is the way, walk in it."`,
        published: true,
      },
      {
        slug: "photizo-the-revelation-of-inextinguishable-light",
        title: "Photizo: The Revelation of Inextinguishable Light",
        date: new Date(Date.now() - 86400000 * 7),
        coverImage: "/1.jpeg",
        excerpt:
          "Light does not struggle with darkness. When divine revelation floods your spirit, transformation becomes immediate and inevitable.",
        body: `The Greek word 'Photizo' signifies more than passive illumination; it implies an imparting of life-giving light that exposes truth and destroys deception.

When God commanded light in Genesis, darkness did not enter into a debate or a struggle. It had to yield. In your life, your health, your home, and your calling, darkness only persists where illumination is absent.

When you spend time meditating on the Word, you are not merely reading ink on paper; you are absorbing spiritual photons that reorganize your inner world. Step into the fullness of Photizo today.`,
        published: true,
      },
    ],
  });

  // Seed Videos (Photizo)
  await prisma.video.deleteMany();
  await prisma.video.createMany({
    data: [
      {
        title: "Photizo: Breaking Through Invisible Barriers",
        date: new Date(),
        thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description:
          "Experience a transformative teaching with Pastor Niyi Aniya on how spiritual illumination dismantles ancestral limits and ignites kingdom purpose.",
        published: true,
      },
      {
        title: "Living Under an Open Heaven",
        date: new Date(Date.now() - 86400000 * 5),
        thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description:
          "Discover the biblical practices of alignment, consecration, and praise that sustain the continuous presence of God over your household.",
        published: true,
      },
      {
        title: "Prophetic Keys for Unshakable Faith",
        date: new Date(Date.now() - 86400000 * 12),
        thumbnail: "https://images.unsplash.com/photo-1447014421976-7fec21d26d86?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description:
          "A powerful exposition on anchoring your conviction in the eternal promises of God when facing physical or financial resistance.",
        published: true,
      },
    ],
  });

  // Seed Products (Store)
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      {
        name: "The Architecture of Faith (Hardcover)",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        price: "$25.00",
        link: "https://amazon.com",
        published: true,
      },
      {
        name: "Photizo: Illuminating Your True Calling",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        price: "$20.00",
        link: "https://amazon.com",
        published: true,
      },
      {
        name: "The Dynamics of Grace (Audio Message Series)",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
        price: "$15.00",
        link: "https://amazon.com",
        published: true,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
