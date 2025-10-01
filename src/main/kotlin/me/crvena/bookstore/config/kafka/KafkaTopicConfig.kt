package me.crvena.bookstore.config.kafka

import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder
import org.springframework.kafka.core.KafkaAdmin

@Configuration
class KafkaTopicConfig(
    @Value(value = "\${spring.kafka.bootstrap-servers}")
    val bootstrapAddress: String,
) {
    @Bean
    fun kafkaAdmin(): KafkaAdmin =
        KafkaAdmin(
            mapOf(
                AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG to bootstrapAddress,
            ),
        )

    @Bean
    fun orderPlacedTopic(): NewTopic =
        TopicBuilder
            .name("order_placed")
            .partitions(10)
            .replicas(1)
            .build()

    @Bean
    fun orderSuccessTopic(): NewTopic =
        TopicBuilder
            .name("order_success")
            .partitions(10)
            .replicas(1)
            .build()
}
