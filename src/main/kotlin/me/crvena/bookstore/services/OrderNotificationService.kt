package me.crvena.bookstore.services

import com.google.common.cache.Cache
import com.google.common.cache.CacheBuilder
import me.crvena.bookstore.dtos.OrderResult
import me.crvena.bookstore.models.Order
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.io.IOException
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

@Service
public class OrderNotificationService {
    final val emitters: MutableMap<String, SseEmitter> = ConcurrentHashMap()

    val resultCache: Cache<String, OrderResult> =
        CacheBuilder
            .newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build()

    val logger: Logger = LoggerFactory.getLogger(OrderNotificationService::class.toString())

    fun subscribe(messageId: String): SseEmitter {
        logger.debug("Subscribe for messageId: $messageId")

        val cachedResult = resultCache.getIfPresent(messageId)
        if (cachedResult != null) {
            // Result in cache, complete
            val emitter = SseEmitter()
            send(emitter, cachedResult)
            resultCache.invalidate(messageId)
            return emitter
        }

        val emitter = SseEmitter(1000L)
        emitters.put(messageId, emitter)
        emitter.onCompletion({ emitters.remove(messageId) })
        emitter.onTimeout({
            logger.warn("SSE timed out for $messageId")
            emitter.complete()
        })
        emitter.onError({ e ->
            emitter.completeWithError(e)
        })
        return emitter
    }

    private fun send(
        emitter: SseEmitter,
        result: OrderResult,
    ) {
        try {
            emitter.send(SseEmitter.event().name("message").data(result))
            emitter.complete()
        } catch (e: IOException) {
            emitter.completeWithError(e)
        }
    }

    fun sendNotification(
        messageId: String,
        result: OrderResult,
    ) {
        val emitter = emitters.get(messageId)
        if (emitter == null) {
            resultCache.put(messageId, result)
            return
        }
        send(emitter, result)
        emitters.remove(messageId)
    }
}
