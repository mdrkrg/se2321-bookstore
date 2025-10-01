package me.crvena.bookstore.event

import me.crvena.bookstore.dtos.OrderDto
import me.crvena.bookstore.dtos.PlaceOrderWrapper
import me.crvena.bookstore.models.Order
import me.crvena.bookstore.services.OrderService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.ResponseEntity
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Component

@Component class OrderReceivedListener(
    private val orderService: OrderService,
    @Qualifier("kafkaTemplate")
    private val kafka: KafkaTemplate<String, Any>,
) {
    val logger: Logger = LoggerFactory.getLogger(OrderReceivedListener::class.toString())

    @SendTo
    @KafkaListener(topics = ["order_placed"])
    fun listen(input: PlaceOrderWrapper): OrderDto {
        logger.info("Listener received: $input")
        val order = orderService.placeOrder(input.userId, input.orderRequest)
        logger.info("Order created: $order")
        val dto = OrderDto.of(order)
        kafka.send("order_success", dto)
        return dto
    }
}

@Component class OrderPlacedListener(
    private val orderService: OrderService,
) {
    val logger: Logger = LoggerFactory.getLogger(OrderPlacedListener::class.toString())

    @KafkaListener(topics = ["order_success"])
    fun listen(order: OrderDto) {
        logger.info("Listener received: $order")
    }
}
