package me.crvena.bookstore.cache

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest

class PageImplDeserializer : JsonDeserializer<PageImpl<*>>() {
    override fun deserialize(
        p: JsonParser,
        ctxt: DeserializationContext,
    ): PageImpl<*> {
        val mapper = p.codec as ObjectMapper
        val node: JsonNode = mapper.readTree(p)

        val content = mapper.convertValue(node.get("content"), object : TypeReference<List<*>>() {})
        val number = node.get("number").asInt()
        val size = node.get("size").asInt()
        val totalElements = node.get("totalElements").asLong()

        return PageImpl(content, PageRequest.of(number, size), totalElements)
    }
}
