// The counter's menu. The backend only ever stores `item` as a plain
// string (see lib/orderQueue.ts), so this list exists purely to give
// the order form real choices instead of a free-text box.

export interface MenuItem {
  id: string;
  name: string;
  category: "Coffee" | "Tea" | "Cold" | "Bakery";
  price: number;
}

export const MENU: MenuItem[] = [
  { id: "espresso", name: "Espresso", category: "Coffee", price: 60 },
  { id: "cappuccino", name: "Cappuccino", category: "Coffee", price: 90 },
  { id: "filter-coffee", name: "South Indian Filter Coffee", category: "Coffee", price: 50 },
  { id: "latte", name: "Caramel Latte", category: "Coffee", price: 110 },
  { id: "masala-chai", name: "Masala Chai", category: "Tea", price: 40 },
  { id: "green-tea", name: "Green Tea", category: "Tea", price: 45 },
  { id: "cold-brew", name: "Cold Brew", category: "Cold", price: 120 },
  { id: "iced-tea", name: "Iced Lemon Tea", category: "Cold", price: 70 },
  { id: "croissant", name: "Butter Croissant", category: "Bakery", price: 80 },
  { id: "sandwich", name: "Grilled Veg Sandwich", category: "Bakery", price: 95 },
  { id: "brownie", name: "Walnut Brownie", category: "Bakery", price: 75 },
  { id: "muffin", name: "Blueberry Muffin", category: "Bakery", price: 70 },
];
