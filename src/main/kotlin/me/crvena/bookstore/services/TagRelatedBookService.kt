package me.crvena.bookstore.services

import me.crvena.bookstore.dtos.BookDto
import me.crvena.bookstore.repositories.BookRepository
import me.crvena.bookstore.repositories.Neo4jTagRepository
import org.springframework.stereotype.Service

@Service
public interface TagRelatedBookService {
    fun getRelatedBooks(tag: String): List<BookDto>
}

@Service
public class TagRelatedBookServiceImpl(
    val neo4jTagRepository: Neo4jTagRepository,
    val bookRepository: BookRepository,
) : TagRelatedBookService {
    override fun getRelatedBooks(tag: String): List<BookDto> {
        val tags = neo4jTagRepository.findRelatedTagNames(tag)

        val books = bookRepository.findByTags_NameIn(tags)
        return books.map { book -> BookDto.of(book) }
    }
}
