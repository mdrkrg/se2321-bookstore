package me.crvena.bookstore.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.common.cache.Cache
import com.google.common.cache.CacheBuilder
import me.crvena.bookstore.dtos.OrderResult
import me.crvena.bookstore.models.Order
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.codec.json.Jackson2JsonEncoder
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

@Component
class OrderWebSocketHandler(
    private val mapper: ObjectMapper,
) : TextWebSocketHandler() {
    private val sessions = ConcurrentHashMap<String, WebSocketSession>()
    private val logger: Logger = LoggerFactory.getLogger(OrderWebSocketHandler::class.toString())

    private val resultCache: Cache<String, OrderResult> =
        CacheBuilder
            .newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build()

    override fun afterConnectionEstablished(session: WebSocketSession) {
        val messageId: String = session.attributes.get("messageId") as String
        logger.info("New WebSocket connection established: $messageId")

        val cachedResult = resultCache.getIfPresent(messageId)
        if (cachedResult != null) {
            logger.info("Sending order result for messageId: $messageId")
            session.sendMessage(TextMessage(mapper.writeValueAsString(cachedResult)))
            resultCache.invalidate(messageId)
            session.close()
            return
        }

        logger.info("OrderResult not found in cache, adding the client (messageId: $messageId) to sessions")
        sessions[messageId] = session
    }

    fun sendNotification(
        messageId: String,
        result: OrderResult,
    ) {
        val session = sessions.get(messageId)
        if (session == null) {
            logger.warn("No active session for messageId: $messageId. Caching result.")
            resultCache.put(messageId, result)
            return
        }
        logger.info("Sending order result for messageId: $messageId")
        session.sendMessage(TextMessage(mapper.writeValueAsString(result)))
        sessions.remove(messageId)
        session.close()
    }

    override fun afterConnectionClosed(
        session: WebSocketSession,
        status: CloseStatus,
    ) {
        val messageId = session.attributes["messageId"] as String?
        if (messageId != null) {
            logger.info("WebSocket connection closed for messageId: $messageId with status: $status")
            sessions.remove(messageId)
        }
    }
}
