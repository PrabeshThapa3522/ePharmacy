import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Home(){
    return(
        <div className="min-h-screen bg-slate-50">
      
        <Navbar/>
          
<main>
  <section className="bg-gradient-to-br from-teal-50 via-white to-slate-50">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 lg:py-28">

      {/* Hero Content */}
      <div>
        <span className="inline-block rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700">
          Trusted Pharmacy Services
        </span>

        <h2 className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
          Your Health,
          <span className="text-teal-700"> Our Priority.</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Access quality pharmacy products, convenient services, and
          reliable health information from Bishwas Pharmacy.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="rounded-lg bg-teal-700 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-teal-800">
            Explore Products
          </button>

          <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
            Upload Prescription
          </button>
        </div>
      </div>

      {/* Hero Visual */}
      <div className="flex justify-center">
        <div className="flex h-80 w-full max-w-md items-center justify-center rounded-3xl bg-teal-100">
          <div className="text-center">
            <div className="text-7xl">⚕️</div>
            <p className="mt-4 text-lg font-semibold text-teal-800">
              Bishwas Pharmacy
            </p>
            <p className="mt-1 text-sm text-teal-700">
              Care you can trust
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>

  {/* Services Section */}
<section className="bg-white py-20">
  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
        Our Services
      </span>

      <h2 className="mt-3 text-3xl font-bold text-slate-900">
        Pharmacy services made simple
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-slate-600">
        Convenient pharmacy services designed to make your experience
        easier and more reliable.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-3">

      {/* Service 1 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">
          💊
        </div>

        <h3 className="mt-6 text-xl font-semibold text-slate-900">
          Pharmacy Products
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          Browse available pharmacy products and find the information
          you need before making a purchase.
        </p>
      </div>

      {/* Service 2 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">
          📄
        </div>

        <h3 className="mt-6 text-xl font-semibold text-slate-900">
          Prescription Upload
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          Upload your prescription securely for review by a qualified
          pharmacist.
        </p>
      </div>

      {/* Service 3 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">
          🤖
        </div>

        <h3 className="mt-6 text-xl font-semibold text-slate-900">
          AI Pharmacy Assistant
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          Get quick answers about pharmacy services, products, and
          general pharmacy information.
        </p>
      </div>

    </div>
  </div>
</section>
</main>
<Footer/>
    </div>
    )
}
export default Home