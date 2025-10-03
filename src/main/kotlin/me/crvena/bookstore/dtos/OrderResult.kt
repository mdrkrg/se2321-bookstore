package me.crvena.bookstore.dtos

data class OrderResult(
    val success: Boolean,
    val order: OrderDto?,
    val error: String?,
)
