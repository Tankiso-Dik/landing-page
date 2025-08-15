const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const postsRedirect = {
    source: '/posts/:slug',
    destination: '/p/:slug',
    permanent: true,
  }

  const productsRedirect = {
    source: '/products/:slug',
    destination: '/p/:slug',
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, postsRedirect, productsRedirect]

  return redirects
}

export default redirects
