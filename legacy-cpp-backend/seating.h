#ifndef SEATING_H
#define SEATING_H

#include <string>
#include <vector>

struct SeatResult {
  bool found;
  int row;
  int col;
  int distance;
};

class SeatingManager {
 public:
  void initialize();
  SeatResult findNearestFreeSeat();
  bool occupySeat(int row, int col);
  bool freeSeat(int row, int col);
  std::vector<std::vector<std::string>> getGridState() const;

 private:
  bool isWithinBounds(int row, int col) const;
  bool isTableCell(int row, int col) const;
  bool isTraversable(int row, int col) const;

  std::vector<std::vector<int>> layout_;
  std::vector<std::vector<bool>> occupied_;
};

extern SeatingManager g_seating_manager;

#endif
