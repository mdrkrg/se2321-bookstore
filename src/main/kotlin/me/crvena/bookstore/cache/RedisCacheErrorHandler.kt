package me.crvena.bookstore.cache

import io.lettuce.core.RedisCommandTimeoutException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.cache.Cache
import org.springframework.cache.interceptor.SimpleCacheErrorHandler
import org.springframework.data.redis.RedisConnectionFailureException

class RedisCacheErrorHandler : SimpleCacheErrorHandler() {
    private final val logger: Logger = LoggerFactory.getLogger(RedisCacheErrorHandler::class.java)

    private fun isRedisConnectionError(exception: RuntimeException): Boolean =
        exception is RedisConnectionFailureException || exception is RedisCommandTimeoutException

    override fun handleCacheGetError(
        exception: RuntimeException,
        cache: Cache,
        key: Any,
    ) {
        if (isRedisConnectionError(exception)) {
            logger.error("Redis connection failed on GET. Falling back to DB. Key: {}", key, exception)
            return
        }
        super.handleCacheGetError(exception, cache, key)
    }

    override fun handleCachePutError(
        exception: RuntimeException,
        cache: Cache,
        key: Any,
        value: Any?,
    ) {
        if (isRedisConnectionError(exception)) {
            logger.error("Redis connection failed on PUT. Data will not be cached. Key: {}", key, exception)
            return
        }
        super.handleCachePutError(exception, cache, key, value)
    }

    override fun handleCacheEvictError(
        exception: RuntimeException,
        cache: Cache,
        key: Any,
    ) {
        if (isRedisConnectionError(exception)) {
            logger.error("Redis connection failed on EVICT. Key: {}", key, exception)
            return
        }
        super.handleCacheEvictError(exception, cache, key)
    }

    override fun handleCacheClearError(
        exception: RuntimeException,
        cache: Cache,
    ) {
        if (isRedisConnectionError(exception)) {
            logger.error("Redis connection failed on CLEAR.", exception)
            return
        }
        super.handleCacheClearError(exception, cache)
    }
}
