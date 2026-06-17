#include "seating.h"

#include <queue>
#include <utility>

SeatingManager g_seating_manager;

void SeatingManager::initialize() {
  layout_ = {
      {2, 2, 2, 2, 2, 2, 2, 2},
      {2, 1, 1, 1, 1, 1, 1, 2},
      {2, 1, 1, 1, 1, 1, 1, 2},
      {2, 1, 1, 1, 1, 1, 1, 2},
      {2, 1, 1, 1, 1, 1, 1, 2},
      {2, 2, 2, 2, 2, 2, 2, 2},
  };
  occupied_.assign(6, std::vector<bool>(8, false));
}

bool SeatingManager::isWithinBounds(int row, int col) const {
  return row >= 0 && row < static_cast<int>(layout_.size()) && col >= 0 &&
         col < static_cast<int>(layout_[0].size());
}

bool SeatingManager::isTableCell(int row, int col) const {
  return isWithinBounds(row, col) && layout_[row][col] == 1;
}

bool SeatingManager::isTraversable(int row, int col) const {
  if (!isWithinBounds(row, col)) {
    return false;
  }
  return layout_[row][col] == 0 || layout_[row][col] == 1;
}

SeatResult SeatingManager::findNearestFreeSeat() {
  std::queue<std::pair<int, int>> q;
  std::vector<std::vector<bool>> visited(6, std::vector<bool>(8, false));
  std::vector<std::vector<int>> distance(6, std::vector<int>(8, -1));

  const int start_row = 3;
  const int start_col = 0;
  q.push({start_row, start_col});
  visited[start_row][start_col] = true;
  distance[start_row][start_col] = 0;

  const int dr[4] = {-1, 1, 0, 0};
  const int dc[4] = {0, 0, -1, 1};

  while (!q.empty()) {
    auto current = q.front();
    q.pop();

    const int row = current.first;
    const int col = current.second;

    if (isTableCell(row, col) && !occupied_[row][col]) {
      occupied_[row][col] = true;
      return {true, row, col, distance[row][col]};
    }

    for (int i = 0; i < 4; ++i) {
      int nr = row + dr[i];
      int nc = col + dc[i];
      if (!isWithinBounds(nr, nc) || visited[nr][nc]) {
        continue;
      }
      if (!isTraversable(nr, nc)) {
        continue;
      }
      visited[nr][nc] = true;
      distance[nr][nc] = distance[row][col] + 1;
      q.push({nr, nc});
    }
  }

  return {false, -1, -1, -1};
}

bool SeatingManager::occupySeat(int row, int col) {
  if (!isTableCell(row, col) || occupied_[row][col]) {
    return false;
  }
  occupied_[row][col] = true;
  return true;
}

bool SeatingManager::freeSeat(int row, int col) {
  if (!isTableCell(row, col) || !occupied_[row][col]) {
    return false;
  }
  occupied_[row][col] = false;
  return true;
}

std::vector<std::vector<std::string>> SeatingManager::getGridState() const {
  std::vector<std::vector<std::string>> grid(6, std::vector<std::string>(8));
  for (int r = 0; r < 6; ++r) {
    for (int c = 0; c < 8; ++c) {
      if (layout_[r][c] == 2) {
        grid[r][c] = "wall";
      } else if (layout_[r][c] == 0) {
        grid[r][c] = "aisle";
      } else {
        grid[r][c] = occupied_[r][c] ? "table_occupied" : "table_free";
      }
    }
  }
  return grid;
}
