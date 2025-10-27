package me.crvena.bookstore.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import me.crvena.bookstore.cache.PageImplModule
import me.crvena.bookstore.cache.RedisCacheErrorHandler
import org.springframework.cache.annotation.CachingConfigurer
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.interceptor.CacheErrorHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.cache.RedisCacheConfiguration
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair
import java.time.Duration

@EnableCaching
@Configuration
public class CacheConfig : CachingConfigurer {
    @Bean
    fun cacheConfiguration(): RedisCacheConfiguration {
        val objectMapper =
            ObjectMapper().apply {
                registerKotlinModule()
                registerModule(PageImplModule())
                registerModule(Hibernate6Module())

                val ptv =
                    BasicPolymorphicTypeValidator
                        .builder()
                        .allowIfBaseType(Any::class.java)
                        .build()
                activateDefaultTyping(ptv, ObjectMapper.DefaultTyping.NON_FINAL)
            }

        return RedisCacheConfiguration
            .defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(60))
            .disableCachingNullValues()
            .serializeValuesWith(SerializationPair.fromSerializer(GenericJackson2JsonRedisSerializer(objectMapper)))
    }

    override fun errorHandler(): CacheErrorHandler = RedisCacheErrorHandler()
}
