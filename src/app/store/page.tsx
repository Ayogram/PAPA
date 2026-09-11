import prisma from "@/lib/prisma";
import NewsletterForm from "@/components/store/NewsletterForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Store & Resources | Niyi Aniya",
  description: "Books, sermon audio collections, and ministry resources by Apostle Niyi Aniya.",
};

export default async function StorePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-3">
            Publications & Media
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-tight">
            Ministry Store
          </h1>
          <p className="text-base sm:text-xl text-[#A1A1A1] max-w-2xl mt-4 leading-relaxed font-medium">
            Arm your spiritual walk with books, message series, and study materials authored by Niyi Aniya.
          </p>
        </div>

        {/* Product Catalog Grid */}
        {products.length === 0 ? (
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-16 text-center text-[#777]">
            <p className="text-xl font-bold text-white mb-2">Catalog Coming Soon</p>
            <p className="text-sm">New books and resources are currently being prepared.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-24">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#444] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] w-full bg-[#1C1C1C] overflow-hidden">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#444] text-xs uppercase tracking-widest font-bold">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1A1]">
                        Official Resource
                      </span>
                      <span className="text-sm font-extrabold text-[#E85D2A]">
                        {product.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#E85D2A] transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {product.link ? (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-white hover:bg-[#E85D2A] text-[#0A0A0A] hover:text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-colors"
                    >
                      Get This Resource ↗
                    </a>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center bg-[#222] text-[#666] py-3.5 rounded-full font-bold uppercase tracking-wider text-xs cursor-not-allowed"
                    >
                      Available Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter / Notifications Box */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-3">
            Stay Informed
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Be the First to Know
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1A1] max-w-xl mx-auto mb-8 font-medium">
            Join the ministry notification list to receive immediate updates when new book titles and media releases are available.
          </p>

          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
