#include "delivery.h"

#include <algorithm>
#include <functional>
#include <limits>
#include <queue>

DeliveryManager g_delivery_manager;

void DeliveryManager::addUndirectedEdge(int u, int v, int w) {
  adj_[u].push_back({v, w});
  adj_[v].push_back({u, w});
}

void DeliveryManager::initialize() {
  locations_ = {
      {0, "Cafe", "", 1},
      {1, "Main Entrance / Ground Floor Corridor", "General", 0},
      {2, "Staircase Left", "General", 0},
      {3, "Staircase Right", "General", 0},
      {4, "Floor 0 - Block A (Left Wing)", "General", 0},
      {5, "Floor 0 - Block B (Center)", "General", 0},
      {6, "Floor 0 - Block C (PMSE Dept)", "PMSE", 0},
      {7, "Floor 1 - Block A (CSE Dept)", "CSE", 1},
      {8, "Floor 1 - Block B (ECE Dept)", "ECE", 1},
      {9, "Floor 1 - Block C (Right Wing)", "General", 1},
      {10, "Computer Lab (Ground Floor)", "Lab", 0},
      {11, "Electronics Lab (Ground Floor)", "Lab", 0},
      {12, "Faculty Lounge (Floor 1)", "General", 1},
  };

  adj_.assign(locations_.size(), {});

  addUndirectedEdge(0, 8, 10);
  addUndirectedEdge(0, 12, 15);
  addUndirectedEdge(0, 3, 20);
  addUndirectedEdge(1, 4, 40);
  addUndirectedEdge(1, 5, 20);
  addUndirectedEdge(1, 6, 50);
  addUndirectedEdge(4, 2, 25);
  addUndirectedEdge(5, 2, 30);
  addUndirectedEdge(5, 3, 30);
  addUndirectedEdge(6, 3, 25);
  addUndirectedEdge(4, 10, 35);
  addUndirectedEdge(5, 11, 40);
  addUndirectedEdge(2, 7, 40);
  addUndirectedEdge(2, 9, 50);
  addUndirectedEdge(3, 8, 40);
  addUndirectedEdge(3, 9, 35);
  addUndirectedEdge(7, 8, 30);
  addUndirectedEdge(8, 9, 30);
  addUndirectedEdge(7, 12, 20);
  addUndirectedEdge(8, 12, 20);
}

DeliveryResult DeliveryManager::findShortestPath(int destination) const {
  const int n = static_cast<int>(locations_.size());
  const int source = 0;
  const int INF = std::numeric_limits<int>::max();

  std::vector<int> dist(n, INF);
  std::vector<int> parent(n, -1);
  std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>,
                      std::greater<std::pair<int, int>>>
      pq;

  dist[source] = 0;
  pq.push({0, source});

  while (!pq.empty()) {
    auto current = pq.top();
    pq.pop();
    int d = current.first;
    int node = current.second;

    if (d > dist[node]) {
      continue;
    }

    for (const auto& edge : adj_[node]) {
      int next = edge.first;
      int w = edge.second;
      if (dist[node] != INF && dist[node] + w < dist[next]) {
        dist[next] = dist[node] + w;
        parent[next] = node;
        pq.push({dist[next], next});
      }
    }
  }

  if (destination < 0 || destination >= n || dist[destination] == INF) {
    return {false, -1, {}};
  }

  std::vector<int> reversed_path;
  int cur = destination;
  while (cur != -1) {
    reversed_path.push_back(cur);
    cur = parent[cur];
  }
  std::reverse(reversed_path.begin(), reversed_path.end());

  std::vector<std::string> path_names;
  for (int idx : reversed_path) {
    path_names.push_back(locations_[idx].name);
  }

  return {true, dist[destination], path_names};
}

std::vector<LocationInfo> DeliveryManager::getLocations() const { return locations_; }

std::vector<std::string> DeliveryManager::getAdjacencyListForDisplay() const {
  std::vector<std::string> lines;
  for (int u = 0; u < static_cast<int>(adj_.size()); ++u) {
    std::string line = locations_[u].name + " -> ";
    for (size_t i = 0; i < adj_[u].size(); ++i) {
      int v = adj_[u][i].first;
      int w = adj_[u][i].second;
      line += locations_[v].name + " (" + std::to_string(w) + "m)";
      if (i + 1 < adj_[u].size()) {
        line += ", ";
      }
    }
    lines.push_back(line);
  }
  return lines;
}
