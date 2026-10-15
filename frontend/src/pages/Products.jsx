import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"

const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: "Rs. 50",
    description: "For temporary relief of mild to moderate pain and fever.",
  },
  {
    id: 2,
    name: "Cetirizine 10mg",
    category: "Allergy Relief",
    price: "Rs. 80",
    description: "An antihistamine commonly used for allergy symptoms.",
  },
  {
    id: 3,
    name: "Vitamin C 500mg",
    category: "Vitamins",
    price: "Rs. 120",
    description: "Vitamin supplement to support normal immune function.",
  },
  {
    id: 4,
    name: "Antiseptic Solution",
    category: "First Aid",
    price: "Rs. 150",
    description: "For general first-aid cleansing and antiseptic use.",
  },
]

function Products() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">

            {/* Page Header */}
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                Pharmacy Products
              </span>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                Browse our products
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Explore our pharmacy products and find the information you
                need before making a purchase.
              </p>
            </div>

            {/* Search and Category */}
            <div className="mt-10 flex flex-col gap-4 md:flex-row">

              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />

              <select
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 md:w-56"
              >
                <option>All Categories</option>
                <option>Pain Relief</option>
                <option>Allergy Relief</option>
                <option>Vitamins</option>
                <option>First Aid</option>
              </select>

            </div>

            {/* Product Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

             {products.map((product) => (
            <ProductCard
            key={product.id}
            product={product}
            />

              ))}

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Products

