
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function ProductDetails() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">

            {/* Breadcrumb */}
            <div className="mb-8 text-sm text-slate-500">
              Products / Product {id}
            </div>

            <div className="grid gap-12 md:grid-cols-2">

              {/* Product Image */}
              <div className="flex min-h-96 items-center justify-center rounded-3xl bg-teal-50">
                <span className="text-8xl">💊</span>
              </div>

              {/* Product Information */}
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                  Pain Relief
                </span>

                <h2 className="mt-3 text-4xl font-bold text-slate-900">
                  Paracetamol 500mg
                </h2>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  Rs. 50
                </p>

                <div className="mt-8 border-t border-slate-200 pt-8">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Product Information
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    Paracetamol is commonly used for temporary relief of mild
                    to moderate pain and fever.
                  </p>
                </div>

                {/* Availability */}
                <div className="mt-8 rounded-xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Availability
                  </p>

                  <p className="mt-1 font-semibold text-teal-700">
                    In Stock
                  </p>
                </div>

                {/* Quantity */}
                <div className="mt-8">
                  <label className="text-sm font-medium text-slate-700">
                    Quantity
                  </label>

                  <div className="mt-2 flex w-fit items-center rounded-lg border border-slate-300">
                    <button className="px-4 py-2 text-lg text-slate-600 hover:text-teal-700">
                      −
                    </button>

                    <span className="border-x border-slate-300 px-5 py-2">
                      1
                    </span>

                    <button className="px-4 py-2 text-lg text-slate-600 hover:text-teal-700">
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button className="mt-8 w-full rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800">
                  Add to Cart
                </button>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetails

