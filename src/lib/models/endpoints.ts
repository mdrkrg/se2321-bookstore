interface Endpoint extends Record<
  string,
  string | ((id: string | number) => string) | Endpoint
> { }

type GResult<Input extends Endpoint> = {
  [K in keyof Input]:
  Input[K] extends string ? string :
      (Input[K] extends (id: string | number) => string ? ((id: string | number) => string) :
          (Input[K] extends Endpoint ? GResult<Input[K]> : never))
}

function g<T extends Endpoint>(base: string, subEndpoints: T): GResult<T> {
  const endpoints = {} as GResult<T>

  for (const key in subEndpoints) {
    const subEndpoint = subEndpoints[key]

    if (typeof subEndpoint === 'string') {
      (endpoints[key] as string) = `${base}${subEndpoint}`
    }
    else if (typeof subEndpoint === 'function') {
      (endpoints[key] as (id: string | number) => string)
        = (id: string | number) => `${base}${subEndpoint(id)}`
    }
    else {
      (endpoints[key] as Endpoint) = g(`${base}`, subEndpoint as Endpoint)
    }
  }

  return endpoints
}

export const endpoints = g('/api', {
  view: g('/', {
    login: 'login',
    logout: 'logout',
  }),
  user: g('/user', {
    avatars: (filename: string | number) =>
      `/avatars/${filename}`, // avatars of other users
    index: (id: string | number) => `/${id}`,
    me: g('/me', {
      index: '',
      passwd: '/password', // change password
      intro: '/introduction', // self introduction
      avatar: '/avatar', // avatar
      addrs: g('/addresses', { // my addresses
        index: '',
        delete: (id: string | number) => `/${id}`,
      }),
    }),
  }),
  comment: g('/comment', {
    index: (id: string | number) => `/${id}`,
    like: (id: string | number) => `/${id}/like`,
    unlike: (id: string | number) => `/${id}/unlike`,
  }),
  cart: g('/cart', {
    index: '',
    change: (id: string | number) => `/${id}`,
  }),
  order: '/order',
  book: g('/book', {
    index: (id: string | number) => `/${id}`,
    tags: '/tags', // get book tags
    comments: (id: string | number) => `/${id}/comments`,
  }),
  books: g('/books', {
    index: '', // search for books
    rank: '/rank', // top 10 rankings
  }),
})
