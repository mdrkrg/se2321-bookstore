package me.crvena.bookstore.config

import me.crvena.bookstore.services.OrderWebSocketHandler
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpRequest
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry
import org.springframework.web.socket.server.HandshakeInterceptor
import org.springframework.web.util.UriTemplate

@Configuration
@EnableWebSocket
class WebSocketConfig(
    private val orderWebSocketHandler: OrderWebSocketHandler,
) : WebSocketConfigurer {
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry
            .addHandler(orderWebSocketHandler, "/api/order-result/ws/{messageId}")
            .addInterceptors(MessageIdHandshakeInterceptor())
            .setAllowedOrigins("*")
    }

    /**
     * Interceptor to retrieve messageId from path, and set session attribute.
     */
    internal class MessageIdHandshakeInterceptor : HandshakeInterceptor {
        private val logger: Logger = LoggerFactory.getLogger(MessageIdHandshakeInterceptor::class.toString())

        override fun beforeHandshake(
            request: ServerHttpRequest,
            response: ServerHttpResponse,
            wsHandler: WebSocketHandler,
            attributes: MutableMap<String, Any>,
        ): Boolean {
            val path = request.uri.path
            val template = UriTemplate("/api/order-result/ws/{messageId}")
            val pathVariables = template.match(path)

            if (pathVariables.containsKey("messageId")) {
                val messageId = pathVariables["messageId"]!!
                logger.info("Intercepted ws connection with messageId: $messageId")
                // if path var contains a message id, proceed
                attributes["messageId"] = messageId
                return true
            } else {
                // otherwise reject
                return false
            }
        }

        override fun afterHandshake(
            request: ServerHttpRequest,
            response: ServerHttpResponse,
            wsHandler: WebSocketHandler,
            exception: Exception?,
        ) {
        }
    }
}
