#ifndef DELIVERY_H
#define DELIVERY_H

#include <string>
#include <vector>

struct DeliveryResult {
  bool reachable;
  int distance;
  std::vector<std::string> path;
};

struct LocationInfo {
  int id;
  std::string name;
  std::string department;
  int floor;
};

class DeliveryManager {
 public:
  void initialize();
  DeliveryResult findShortestPath(int destination) const;
  std::vector<LocationInfo> getLocations() const;
  std::vector<std::string> getAdjacencyListForDisplay() const;

 private:
  void addUndirectedEdge(int u, int v, int w);

  std::vector<LocationInfo> locations_;
  std::vector<std::vector<std::pair<int, int>>> adj_;
};

extern DeliveryManager g_delivery_manager;

#endif
