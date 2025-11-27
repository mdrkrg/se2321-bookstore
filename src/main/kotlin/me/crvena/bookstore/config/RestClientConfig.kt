package me.crvena.bookstore.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.JdkClientHttpRequestFactory
import org.springframework.web.client.RestClient
import java.net.http.HttpClient

@Configuration
public class RestClientConfig {
    @Bean
    fun restClient(): RestClient {
        val clientBuilder = HttpClient.newBuilder()

        // disable http 2 upgrade since fission does not support it
        clientBuilder.version(HttpClient.Version.HTTP_1_1)

        val httpClient = clientBuilder.build()

        val requestFactory = JdkClientHttpRequestFactory(httpClient)

        return RestClient
            .builder()
            .requestFactory(requestFactory)
            .build()
    }
}
