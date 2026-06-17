#include "order_queue.h"

OrderQueueManager g_order_queue;

void OrderQueueManager::addOrder(const Order& o) { queue_.push(o); }

Order OrderQueueManager::peekNextOrder() const {
  if (queue_.empty()) {
    throw std::runtime_error("Queue is empty");
  }
  return queue_.top();
}

Order OrderQueueManager::serveNextOrder() {
  if (queue_.empty()) {
    throw std::runtime_error("Queue is empty");
  }
  Order next = queue_.top();
  queue_.pop();
  return next;
}

std::vector<Order> OrderQueueManager::getAllOrders() const {
  std::priority_queue<Order, std::vector<Order>, OrderComparator> copy = queue_;
  std::vector<Order> orders;
  while (!copy.empty()) {
    orders.push_back(copy.top());
    copy.pop();
  }
  return orders;
}

int OrderQueueManager::queueSize() const { return static_cast<int>(queue_.size()); }

bool OrderQueueManager::isEmpty() const { return queue_.empty(); }
