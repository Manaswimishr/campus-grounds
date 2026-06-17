#include <iostream>

#include "delivery.h"
#include "server.h"
#include "seating.h"

int main() {
  g_seating_manager.initialize();
  g_delivery_manager.initialize();

  httplib::Server server;
  registerRoutes(server);

  std::cout << "Cafe server running on http://localhost:8080" << std::endl;
  server.listen("0.0.0.0", 8080);
  return 0;
}
