# Legacy C++ backend

This is the original backend this project was built from: a C++17
HTTP server (using [cpp-httplib](https://github.com/yhirose/cpp-httplib)
and [nlohmann/json](https://github.com/nlohmann/json), vendored under
`libs/`) exposing the same priority queue, BFS seat finder, and
Dijkstra delivery router that the web app in `../web` now runs in
TypeScript.

It's kept here unmodified, both for credit and because it's worth
showing on its own — implementing a `std::priority_queue` comparator,
a grid BFS, and Dijkstra's algorithm with a min-heap from scratch in
C++ is a meaningfully different exercise than writing the same logic
in TypeScript.

The web app does **not** depend on this server. It's a standalone
artifact you can build and run locally if you want to see the
original engine in action.

## Build

```bash
g++ -std=c++17 -O2 -o cafe_server main.cpp server.cpp order_queue.cpp seating.cpp delivery.cpp
./cafe_server
```

The server listens on `http://localhost:8080` and exposes:

- `POST /api/order/add`, `POST /api/order/serve`, `GET /api/order/queue`
- `POST /api/seat/find`, `POST /api/seat/free`, `GET /api/seat/grid`
- `GET /api/delivery/locations`, `POST /api/delivery/route`
