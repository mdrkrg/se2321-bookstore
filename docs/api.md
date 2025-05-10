# APIs

## Place order

Body:

- A list of hyperlinked `CartItem` url or id

Processing:

1. Create `OrderItem` by `CartItem`
2. Remove `CartItem` (clear cart)
3. Create `Order`

Response:

- Order object

## Book detail

Just use `/api/book/search/getBookById` or rename it

## Put into cart

`/api/cart`

### CREATE

Body:

- Book (hyperlinked)
- number

Processing:

- Create the `CartItem` with the request's user (requires middleware)

### PUT/PATCH/DELETE
Pre PUT/DELETE validation:

- Verify `CartItem`'s `creator` with request's user (requires middleware)
