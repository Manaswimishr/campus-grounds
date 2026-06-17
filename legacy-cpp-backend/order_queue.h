#ifndef ORDER_QUEUE_H
#define ORDER_QUEUE_H

#include <queue>
#include <stdexcept>
#include <string>
#include <vector>

struct Order {
  int id;
  std::string customer_name;
  std::string item;
  int priority;
  int timestamp;
  bool is_faculty_delivery;
  std::string delivery_location;
};

struct OrderComparator {
  bool operator()(const Order& a, const Order& b) const {
    if (a.priority != b.priority) {
      return a.priority > b.priority;
    }
    return a.timestamp > b.timestamp;
  }
};

class OrderQueueManager {
 public:
  void addOrder(const Order& o);
  Order peekNextOrder() const;
  Order serveNextOrder();
  std::vector<Order> getAllOrders() const;
  int queueSize() const;
  bool isEmpty() const;

 private:
  std::priority_queue<Order, std::vector<Order>, OrderComparator> queue_;
};

extern OrderQueueManager g_order_queue;

#endif
