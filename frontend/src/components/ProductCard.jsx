import { Link } from "react-router-dom"
function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Product Image */}
      <div className="flex h-48 items-center justify-center bg-teal-50">
        <span className="text-6xl">💊</span>
      </div>

      {/* Product Information */}
      <div className="p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {product.category}
        </span>

        <h3 className="mt-2 text-lg font-semibold text-slate-900">
          {product.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            {product.price}
          </span>

          <Link to={`/products/${product.id}`}
          assName="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800">
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

