#include "server.h"

#include <ctime>
#include <string>

#include "delivery.h"
#include "libs/json.hpp"
#include "order_queue.h"
#include "seating.h"

using json = nlohmann::json;

namespace {

int g_next_order_id = 1;

json orderToJson(const Order& order) {
  return json{
      {"id", order.id},
      {"customer_name", order.customer_name},
      {"item", order.item},
      {"priority", order.priority},
      {"timestamp", order.timestamp},
      {"is_faculty_delivery", order.is_faculty_delivery},
      {"delivery_location", order.delivery_location},
  };
}

void setCorsHeaders(httplib::Response& res) {
  res.set_header("Access-Control-Allow-Origin", "*");
  res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.set_header("Access-Control-Allow-Headers", "Content-Type");
}

void addOptionsHandler(httplib::Server& server, const std::string& route) {
  server.Options(route, [](const httplib::Request&, httplib::Response& res) {
    setCorsHeaders(res);
    res.status = 200;
    res.set_content("", "text/plain");
  });
}

void respondJson(httplib::Response& res, const json& body, int status = 200) {
  setCorsHeaders(res);
  res.status = status;
  res.set_content(body.dump(), "application/json");
}

}  // namespace

void registerRoutes(httplib::Server& server) {
  addOptionsHandler(server, "/api/order/add");
  addOptionsHandler(server, "/api/order/serve");
  addOptionsHandler(server, "/api/order/queue");
  addOptionsHandler(server, "/api/seat/find");
  addOptionsHandler(server, "/api/seat/free");
  addOptionsHandler(server, "/api/seat/grid");
  addOptionsHandler(server, "/api/delivery/locations");
  addOptionsHandler(server, "/api/delivery/route");

  server.Post("/api/order/add", [](const httplib::Request& req, httplib::Response& res) {
    try {
      const json body = json::parse(req.body);
      if (!body.contains("customer_name") || !body.contains("item") || !body.contains("priority")) {
        respondJson(res, {{"error", "Invalid request body"}}, 400);
        return;
      }

      std::string customer_name = body.at("customer_name").get<std::string>();
      std::string item = body.at("item").get<std::string>();
      int priority = body.at("priority").get<int>();
      bool is_faculty_delivery = body.value("is_faculty_delivery", false);
      std::string delivery_location = body.value("delivery_location", std::string(""));

      if (priority < 1 || priority > 3) {
        respondJson(res, {{"error", "priority must be 1, 2, or 3"}}, 400);
        return;
      }

      if (is_faculty_delivery) {
        priority = 1;
      }

      Order order{
          g_next_order_id++,
          customer_name,
          item,
          priority,
          static_cast<int>(std::time(nullptr)),
          is_faculty_delivery,
          delivery_location,
      };
      g_order_queue.addOrder(order);

      respondJson(res, {{"success", true}, {"order_id", order.id}, {"queue_size", g_order_queue.queueSize()}});
    } catch (const std::exception&) {
      respondJson(res, {{"error", "Invalid request body"}}, 400);
    }
  });

  server.Post("/api/order/serve", [](const httplib::Request&, httplib::Response& res) {
    try {
      Order served = g_order_queue.serveNextOrder();
      respondJson(res, orderToJson(served));
    } catch (const std::runtime_error& ex) {
      respondJson(res, {{"error", ex.what()}}, 400);
    }
  });

  server.Get("/api/order/queue", [](const httplib::Request&, httplib::Response& res) {
    std::vector<Order> orders = g_order_queue.getAllOrders();
    json arr = json::array();
    for (const auto& order : orders) {
      arr.push_back(orderToJson(order));
    }
    respondJson(res, {{"orders", arr}});
  });

  server.Post("/api/seat/find", [](const httplib::Request&, httplib::Response& res) {
    SeatResult result = g_seating_manager.findNearestFreeSeat();
    if (!result.found) {
      respondJson(res, {{"found", false}});
      return;
    }
    respondJson(res, {{"found", true}, {"row", result.row}, {"col", result.col}, {"distance", result.distance}});
  });

  server.Post("/api/seat/free", [](const httplib::Request& req, httplib::Response& res) {
    try {
      const json body = json::parse(req.body);
      if (!body.contains("row") || !body.contains("col")) {
        respondJson(res, {{"error", "Invalid request body"}}, 400);
        return;
      }
      int row = body.at("row").get<int>();
      int col = body.at("col").get<int>();
      if (!g_seating_manager.freeSeat(row, col)) {
        respondJson(res, {{"error", "Invalid table cell"}}, 400);
        return;
      }
      respondJson(res, {{"success", true}});
    } catch (const std::exception&) {
      respondJson(res, {{"error", "Invalid request body"}}, 400);
    }
  });

  server.Get("/api/seat/grid", [](const httplib::Request&, httplib::Response& res) {
    respondJson(res, {{"grid", g_seating_manager.getGridState()}});
  });

  server.Get("/api/delivery/locations", [](const httplib::Request&, httplib::Response& res) {
    json arr = json::array();
    for (const auto& location : g_delivery_manager.getLocations()) {
      arr.push_back({
          {"id", location.id},
          {"name", location.name},
          {"department", location.department},
          {"floor", location.floor},
      });
    }
    respondJson(res, {{"locations", arr}});
  });

  server.Post("/api/delivery/route", [](const httplib::Request& req, httplib::Response& res) {
    try {
      const json body = json::parse(req.body);
      if (!body.contains("destination")) {
        respondJson(res, {{"error", "Invalid request body"}}, 400);
        return;
      }
      int destination = body.at("destination").get<int>();
      if (destination <= 0 || destination > 12) {
        respondJson(res, {{"error", "destination must be between 1 and 12"}}, 400);
        return;
      }

      DeliveryResult result = g_delivery_manager.findShortestPath(destination);
      if (!result.reachable) {
        respondJson(res, {{"reachable", false}, {"distance", -1}, {"path", json::array()}});
        return;
      }
      respondJson(res, {{"reachable", true}, {"distance", result.distance}, {"path", result.path}});
    } catch (const std::exception&) {
      respondJson(res, {{"error", "Invalid request body"}}, 400);
    }
  });
}
