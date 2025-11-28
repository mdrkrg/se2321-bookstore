package me.crvena.bookstore.controllers

import me.crvena.bookstore.dtos.BookDto
import me.crvena.bookstore.repositories.Neo4jTagRepository
import me.crvena.bookstore.services.TagRelatedBookService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/api/book/by-related-tags")
public class TagController(
    val tagRelatedBookService: TagRelatedBookService,
) {
    val logger = LoggerFactory.getLogger(TagController::class.java)

    @GetMapping("/")
    fun getRelatedTags(
        @RequestParam tag: String,
    ): ResponseEntity<List<BookDto>> =
        ResponseEntity.ok(
            tagRelatedBookService.getRelatedBooks(tag),
        )
}
