package me.crvena.bookstore.event

import me.crvena.bookstore.dtos.OrderDto
import me.crvena.bookstore.dtos.OrderResult
import me.crvena.bookstore.dtos.PlaceOrderWrapper
import me.crvena.bookstore.exceptions.OutOfStockException
import me.crvena.bookstore.exceptions.PermissionDenied
import me.crvena.bookstore.exceptions.ResourceDoesNotExist
import me.crvena.bookstore.models.Order
import me.crvena.bookstore.services.OrderNotificationService
import me.crvena.bookstore.services.OrderService
import me.crvena.bookstore.services.OrderWebSocketHandler
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Component

@Component class OrderReceivedListener(
    private val orderService: OrderService,
    private val kafka: KafkaTemplate<String, Any>,
) {
    val logger: Logger = LoggerFactory.getLogger(OrderReceivedListener::class.toString())

    private fun processMessage(message: PlaceOrderWrapper): OrderResult {
        logger.info("Listener received: $message")
        var result: OrderResult
        try {
            val order = orderService.placeOrder(message.userId, message.orderRequest)
            logger.info("Order created: $order")
            val dto = OrderDto.of(order)
            result = OrderResult(true, dto, null)
        } catch (e: PermissionDenied) {
            result = OrderResult(false, null, e.toString())
        } catch (e: ResourceDoesNotExist) {
            result = OrderResult(false, null, e.toString())
        } catch (e: OutOfStockException) {
            result = OrderResult(false, null, e.toString())
        }
        return result
    }

    @KafkaListener(topics = ["order_received_sse"])
    fun listenSse(record: ConsumerRecord<String, PlaceOrderWrapper>) {
        val message = record.value()
        val messageId: String = record.key()
        val result = processMessage(message)
        kafka.send("order_result_sse", messageId, result)
    }

    @KafkaListener(topics = ["order_received_ws"])
    fun listenWs(record: ConsumerRecord<String, PlaceOrderWrapper>) {
        val message = record.value()
        val messageId: String = record.key()
        val result = processMessage(message)
        kafka.send("order_result_ws", messageId, result)
    }
}

@Component class OrderResultListener(
    val sseService: OrderNotificationService,
    val wsService: OrderWebSocketHandler,
) {
    val logger: Logger = LoggerFactory.getLogger(OrderResultListener::class.toString())

    @KafkaListener(topics = ["order_result_sse"])
    fun listenSse(record: ConsumerRecord<String, OrderResult>) {
        val order = record.value()
        val messageId = record.key()
        logger.info("Listener received from messageId $messageId: $order")
        sseService.sendNotification(messageId, order)
    }

    @KafkaListener(topics = ["order_result_ws"])
    fun listenWs(record: ConsumerRecord<String, OrderResult>) {
        val order = record.value()
        val messageId = record.key()
        logger.info("Listener received from messageId $messageId: $order")
        wsService.sendNotification(messageId, order)
    }
}
