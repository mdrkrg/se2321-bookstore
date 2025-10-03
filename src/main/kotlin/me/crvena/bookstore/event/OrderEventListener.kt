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

    @KafkaListener(topics = ["order_received"])
    fun listen(record: ConsumerRecord<String, PlaceOrderWrapper>) {
        val input = record.value()
        logger.info("Listener received: $input")
        var result: OrderResult
        val messageId: String = record.key()
        try {
            val order = orderService.placeOrder(input.userId, input.orderRequest)
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
        kafka.send("order_result", messageId, result)
    }
}

@Component class OrderResultListener(
    val service: OrderNotificationService,
) {
    val logger: Logger = LoggerFactory.getLogger(OrderResultListener::class.toString())

    @KafkaListener(topics = ["order_result"])
    fun listen(record: ConsumerRecord<String, OrderResult>) {
        val order = record.value()
        logger.info("Listener received: $order")
        service.sendNotification(record.key(), order)
    }
}
