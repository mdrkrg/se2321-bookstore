package me.crvena.bookstore.services;

import me.crvena.bookstore.dao.BookDao;
import me.crvena.bookstore.dao.BookInventoryDao;
import me.crvena.bookstore.dao.CartItemDao;
import me.crvena.bookstore.dao.OrderDao;
import me.crvena.bookstore.dao.UserDao;
import me.crvena.bookstore.dtos.AdminModifyOrderRequest;
import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.dtos.OutOfStockErrorResponse.OutOfStockDetail;
import me.crvena.bookstore.models.*;
import me.crvena.bookstore.repositories.UserRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import me.crvena.bookstore.exceptions.OutOfStockException;
import me.crvena.bookstore.exceptions.PermissionDenied;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import jakarta.transaction.Transactional;
import lombok.*;

@Service
public interface OrderService {

  public Page<Order> getOrdersByUser(User user, Pageable pageable);

  public List<Order> getOrdersByUser(User user);

  public List<Order> getOrdersByUserId(Long userId);

  public List<Order> getOrdersByCreatedAtBetween(
      LocalDate createdAtStart, LocalDate createdAtEnd);

  public Page<Order> getOrdersByCreatedAtBetween(
      LocalDate createdAtStart, LocalDate createdAtEnd, Pageable pageable);

  public List<Order> getOrdersByTitleAndCreatedAtBetween(
      String title, LocalDate createdAtStart, LocalDate createdAtEnd);

  public Page<Order> getOrdersByTitleAndCreatedAtBetween(
      String title, LocalDate createdAtStart, LocalDate createdAtEnd, Pageable pageable);

  public List<Order> getOrdersByUserAndCreatedAtBetween(
      User user, LocalDate createdAtStart, LocalDate createdAtEnd);

  public Page<Order> getOrdersByUserAndCreatedAtBetween(
      User user, LocalDate createdAtStart, LocalDate createdAtEnd, Pageable pageable);

  public List<Order> getOrdersByUserAndTitleAndCreatedAtBetween(
      User user, String title, LocalDate createdAtStart, LocalDate createdAtEnd);

  public Page<Order> getOrdersByUserAndTitleAndCreatedAtBetween(
      User user, String title, LocalDate createdAtStart, LocalDate createdAtEnd, Pageable pageable);

  /**
   * Places order
   *
   * @throws CartItemDoesNotExistException
   */
  @Transactional
  public Order placeOrder(User user, OrderRequest orderRequest);

  /**
   * Places order (message streaming)
   *
   * @throws CartItemDoesNotExistException
   */
  @Transactional
  public Order placeOrder(Long userId, OrderRequest orderRequest);

  public Order modifyOrder(Order order, AdminModifyOrderRequest data);

  /**
   * Create an Order from an {@link OrderRequest}.
   * Will initilaize a set of {@link OrderItem} from {@link CartItem}s in
   * orderRequest.
   *
   * @param creator      The creator of the order.
   * @param orderRequest {@link OrderRequest} body.
   * @param cartItems    cartItems.
   */
  public static Order createFromOrderRequest(
      User creator, OrderRequest orderRequest, Map<CartItem, BigDecimal> cartItems) {
    Set<OrderItem> orderItems = new HashSet<>();
    Order order = Order.builder()
        .items(orderItems)
        .creator(creator)
        .receiver(orderRequest.getReceiver())
        .tel(orderRequest.getTel())
        .address(orderRequest.getAddress())
        .build();

    for (var item : cartItems.entrySet()) {
      OrderItem orderItem = OrderItem.createFromCartItem(
          order, item.getKey(), item.getValue());
      orderItems.add(orderItem);
    }
    return order;
  }
}

@Service
@RequiredArgsConstructor
class OrderServiceImpl implements OrderService {

  @Autowired
  private final CartItemDao cartItemDao;

  @Autowired
  private final BookDao bookDao;

  @Autowired
  private final BookInventoryDao bookInventoryDao;

  @Autowired
  private final OrderDao dao;

  @Autowired
  private final UserDao userDao;

  @Autowired
  private ObjectMapper mapper;

  public Page<Order> getOrdersByUser(User user, Pageable pageable) {
    return dao.findByCreatorOrderByIdDesc(user, pageable);
  }

  public List<Order> getOrdersByUser(User user) {
    return dao.findByCreatorOrderByIdDesc(user);
  }

  public List<Order> getOrdersByUserId(Long userId) {
    return dao.findByCreatorIdOrderByIdDesc(userId);
  }

  public List<Order> getOrdersByCreatedAtBetween(
      LocalDate createdAtStart, LocalDate createdAtEnd) {
    Instant startInstant = createdAtStart.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);
    return dao.findByCreatedAtBetweenOrderByCreatedAtDesc(
        startInstant, endInstant);
  }

  public Page<Order> getOrdersByCreatedAtBetween(
      LocalDate createdAtStart, LocalDate createdAtEnd, Pageable pageable) {
    Instant startInstant = createdAtStart.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);
    return dao.findByCreatedAtBetween(
        startInstant, endInstant, pageable);
  }

  public List<Order> getOrdersByTitleAndCreatedAtBetween(
      String title, LocalDate createdAtStart, LocalDate createdAtEnd) {
    Instant startInstant = createdAtStart.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);
    return dao.findByTitleIgnoreCaseAndCreatedAtBetweenOrderByCreatedAtDesc(
        title, startInstant, endInstant);
  }

  public Page<Order> getOrdersByTitleAndCreatedAtBetween(
      String title, LocalDate createdAtStart, LocalDate createdAtEnd, Pageable pageable) {
    Instant startInstant = createdAtStart.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);
    return dao.findByTitleIgnoreCaseAndCreatedAtBetween(
        title, startInstant, endInstant, pageable);
  }

  public List<Order> getOrdersByUserAndCreatedAtBetween(
      User user, LocalDate createdAtStart, LocalDate createdAtEnd) {
    Instant startInstant = createdAtStart.atStartOfDay().atZone(ZoneOffset.UTC).toInstant();
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).atZone(ZoneOffset.UTC).toInstant();
    return dao.findByCreatorAndCreatedAtBetweenOrderByCreatedAtDesc(
        user, startInstant, endInstant);
  }

  public Page<Order> getOrdersByUserAndCreatedAtBetween(
      User user, LocalDate createdAtStart, LocalDate createdAtEnd, Pageable pageable) {
    Instant startInstant = createdAtStart.atStartOfDay().atZone(ZoneOffset.UTC).toInstant();
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).atZone(ZoneOffset.UTC).toInstant();
    return dao.findByCreatorAndCreatedAtBetween(
        user, startInstant, endInstant, pageable);
  }

  public List<Order> getOrdersByUserAndTitleAndCreatedAtBetween(
      User user,
      String title,
      LocalDate createdAtStart,
      LocalDate createdAtEnd) {
    Instant startInstant = createdAtStart.atStartOfDay().atZone(ZoneOffset.UTC).toInstant();
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).atZone(ZoneOffset.UTC).toInstant();
    return dao.findByCreatorAndBookTitleAndCreatedAtBetween(
        user, title, startInstant, endInstant);
  }

  public Page<Order> getOrdersByUserAndTitleAndCreatedAtBetween(
      User user,
      String title,
      LocalDate createdAtStart,
      LocalDate createdAtEnd,
      Pageable pageable) {
    Instant startInstant = createdAtStart.atStartOfDay().atZone(ZoneOffset.UTC).toInstant();
    Instant endInstant = createdAtEnd.atTime(LocalTime.MAX).atZone(ZoneOffset.UTC).toInstant();
    return dao.findByCreatorAndBookTitleAndCreatedAtBetween(
        user, title, startInstant, endInstant, pageable);
  }

  /**
   * Places order (message streaming)
   *
   * @throws CartItemDoesNotExistException
   */
  @Transactional
  public Order placeOrder(Long userId, OrderRequest orderRequest) {
    // User existance is ensured
    var user = userDao.findById(userId).get();
    return placeOrder(user, orderRequest);
  }

  /**
   * Places order
   *
   * @throws CartItemDoesNotExistException
   */
  @Transactional
  public Order placeOrder(User user, OrderRequest orderRequest) {
    // validate items
    Set<OrderRequest.Item> requestCartItems = orderRequest.getItems();
    Map<CartItem, BigDecimal> validCartItems = new HashMap<>();
    List<OutOfStockDetail> outOfStockDetails = new ArrayList<>();
    requestCartItems.forEach(requestItem -> {

      CartItem item = cartItemDao.findById(requestItem.getItemId())
          .orElseThrow(() -> new ResourceDoesNotExist(
              CartItem.class, requestItem.getItemId()));

      if (!item.getCreator().equals(user)) {
        throw new PermissionDenied(
            user, "CartItem " + requestItem.getItemId() + " does not belong to this user.");
      }

      var book = item.getBook();
      var inventory = book.getInventory();

      if (inventory.getStock() < item.getNumber()) {
        outOfStockDetails.add(OutOfStockDetail.builder()
            .cartItemId(item.getId())
            .title(book.getTitle())
            .requested(item.getNumber())
            .available(inventory.getStock())
            .build());
      } else {
        validCartItems.put(item, requestItem.getPaidPrice());
      }
    });

    if (!outOfStockDetails.isEmpty()) {
      throw new OutOfStockException(
          "One or more items have insufficient quantity.",
          outOfStockDetails);
    }

    Order order = OrderService.createFromOrderRequest(
        user, orderRequest, validCartItems);

    dao.save(order);

    // decrease stock, increase sales for each book
    List<BookInventory> inventoriesToUpdate = new ArrayList<>();
    for (OrderItem orderItem : order.getItems()) {
      Book orderedBook = orderItem.getBook();
      Long quantity = orderItem.getNumber();
      // check stock again for concurrent issue
      Book currentBook = bookDao.findById(orderedBook.getId()).orElseThrow(
          () -> new ResourceDoesNotExist(Book.class, orderedBook.getId()) // Should not happen
      );
      // TODO: prefetch?
      var inventory = currentBook.getInventory();
      if (inventory.getStock() < quantity) {
        throw new OutOfStockException(
            String.format(
                "Stock for book: '%s' was modified during making order. Available: %d, Requested: %d",
                currentBook.getTitle(),
                inventory.getStock(),
                quantity),
            new OutOfStockDetail(
                null,
                currentBook.getTitle(),
                quantity,
                inventory.getStock()));
      }
      inventory.beOrdered(quantity);
      inventoriesToUpdate.add(inventory);
    }

    bookInventoryDao.saveAll(inventoriesToUpdate);
    cartItemDao.deleteAll(validCartItems.keySet());

    return order;
  }

  public Order modifyOrder(Order order, AdminModifyOrderRequest data)
      throws RuntimeException {
    try {
      mapper.updateValue(order, data);
      return dao.save(order);
    } catch (JsonMappingException e) {
      throw new RuntimeException(e.getMessage());
    }
  }
}
