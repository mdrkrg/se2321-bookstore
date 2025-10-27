package me.crvena.bookstore.cache

import com.fasterxml.jackson.core.Version
import com.fasterxml.jackson.databind.module.SimpleModule
import org.springframework.data.domain.PageImpl

class PageImplModule : SimpleModule("PageImplModule", Version(1, 0, 0, null, null, null)) {
    init {
        addDeserializer(PageImpl::class.java, PageImplDeserializer())
    }
}
