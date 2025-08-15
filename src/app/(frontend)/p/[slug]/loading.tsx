export default function Loading() {
  return (
    <article className="pt-16 pb-24 animate-pulse">
      <div className="container">
        <div className="h-10 w-1/3 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="h-64 w-full bg-gray-200 rounded mb-8" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-200 rounded mb-8" />
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded mb-12 mx-auto" />
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded mx-auto" />
      </div>
    </article>
  )
}
