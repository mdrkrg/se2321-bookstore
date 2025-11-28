package me.crvena.bookstore.config

import org.neo4j.driver.AuthTokens
import org.neo4j.driver.Driver
import org.neo4j.driver.GraphDatabase
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class Neo4jConfig {
    @Value("\${neo4j.uri}")
    private lateinit var uri: String

    @Value("\${neo4j.username}")
    private lateinit var username: String

    @Value("\${neo4j.password}")
    private lateinit var password: String

    @Bean(destroyMethod = "close")
    fun neo4jDriver(): Driver = GraphDatabase.driver(uri, AuthTokens.basic(username, password))
}
