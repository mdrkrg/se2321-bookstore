package me.crvena.bookstore.repositories

import org.neo4j.driver.Driver
import org.springframework.stereotype.Repository

@Repository
class Neo4jTagRepository(
    private val driver: Driver,
) {
    /**
     * Query the Neo4j graph to find a starting tag and all other tags
     * connected by up to 2 hops in any direction.
     *
     * @param tagName The name of the tag to query.
     * @return A unique Set of tag names.
     */
    fun findRelatedTagNames(tagName: String): Set<String> {
        val cypherQuery =
            """
            MATCH (start:Tag {name: ${"$"}startTag})-[*0..2]-(related:Tag)
            RETURN DISTINCT related.name AS name
            """.trimIndent()

        driver.session().use { session ->
            return session.executeRead { tx ->
                val result = tx.run(cypherQuery, mapOf("startTag" to tagName))
                result.list { record -> record["name"].asString() }.toSet()
            }
        }
    }
}
