package me.crvena.bookstore.controllers

import me.crvena.bookstore.dtos.BookDto
import me.crvena.bookstore.repositories.BookRepository
import org.springframework.data.domain.PageRequest
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class BookGraphqlController(
    private val bookRepository: BookRepository,
) {
    @QueryMapping
    fun searchBooks(
        @Argument title: String,
        @Argument page: Int = 0,
        @Argument size: Int = 10,
    ): List<BookDto> {
        val pageable = PageRequest.of(page, size)
        return bookRepository
            .findByAvailableAndTitleIgnoreCaseContaining(true, title, pageable)
            .map { BookDto.of(it) }
            .content
    }
}
