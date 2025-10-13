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
    fun orderReceivedWsTopic(): NewTopic =
        TopicBuilder
            .name("order_received_ws")
            .partitions(10)
            .replicas(1)
            .build()

    @Bean
    fun orderReceivedSseTopic(): NewTopic =
        TopicBuilder
            .name("order_received_sse")
            .partitions(10)
            .replicas(1)
            .build()

    @Bean
    fun orderResultWsTopic(): NewTopic =
        TopicBuilder
            .name("order_result_ws")
            .partitions(10)
            .replicas(1)
            .build()

    @Bean
    fun orderResultSseTopic(): NewTopic =
        TopicBuilder
            .name("order_result_sse")
            .partitions(10)
            .replicas(1)
            .build()
}
