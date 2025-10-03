package me.crvena.bookstore.controllers

import me.crvena.bookstore.services.OrderNotificationService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/api/order-result")
public class OrderNotificationController(
    val notificationService: OrderNotificationService,
) {
    @GetMapping("/{messageId}", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun subscribeToOrderStatus(
        @PathVariable messageId: String,
    ): SseEmitter = notificationService.subscribe(messageId)
}
