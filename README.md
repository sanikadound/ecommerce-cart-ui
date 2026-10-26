# ShopSphere OpenCommerce - E-Commerce Checkout & Cart UI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5 / CSS3 / JS](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20ES6-blue.svg)](https://developer.mozilla.org/)
[![Status: Passed](https://img.shields.io/badge/Tests-100%25%20Passed-brightgreen.svg)]()

ShopSphere is an open-source, responsive E-Commerce shopping cart and checkout UI engineered with pure modern web technologies (HTML5, CSS3, Vanilla ES6 JavaScript).

## ROSP Practical Laboratory Contribution
- **Contributor:** Sanika Dound ([@sanikadound](https://github.com/sanikadound))
- **Target Repository:** `sanikadound/ecommerce-cart-ui`
- **Branch:** `feature-enhancement`
- **Feature Enhancements Implemented:**
  1. **Dynamic Coupon Engine:** Instant promotional code validation (`SAVE20`, `TECH15`, `FREESHIP`) with visual feedback badges.
  2. **Regional Tax Calculator:** Real-time state/regional sales tax computation based on delivery zone dropdown.
  3. **Responsive Cart Drawer:** Asynchronous quantity adjustment, item deletion, and live total recalculation.
  4. **Validated Checkout Flow:** Modal popup with client-side regex validation for 16-digit payment card, MM/YY expiry, and 3-digit CVV.
  5. **Automated Verification:** Comprehensive test suite in `test_cart_engine.py` verifying mathematical precision.

## Quick Start
Open `index.html` in any modern web browser, or launch a local server:
```powershell
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.
