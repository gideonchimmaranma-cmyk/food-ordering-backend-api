# Food Ordering Backend API

## Project Overview

A RESTful backend API for a food ordering application. It provides user authentication, food category management, food item management, shopping cart functionality, and order processing.

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcrypt
* dotenv

## Features

### Authentication

* User registration and login.
* Password hashing with bcrypt.
* JWT-based authentication.
* Role-based access control for customers and administrators.

### Categories

* Create, retrieve, update, and delete food categories.
* Admin-only category management.

### Food Items

* Create, retrieve, update, and delete food items.
* Search food items by name.
* Filter food items by category and availability.
* Admin-only food item management.

### Shopping Cart

* Add food items to a cart.
* View cart items and total price.
* Update item quantities.
* Remove items and clear the cart.
* Calculate prices using database values.

### Orders

* Place orders using cart items.
* View personal order history.
* Retrieve individual orders.
* Cancel eligible orders.
* Administrator order management and status updates.

## Installation

1. Clone the repository.

2. Navigate into the project directory.

3. Install dependencies:

   `npm install`

4. Create a `.env` file in the project root.

5. Add your environment variables:

   `PORT=8000`

   `MONGO_URI=your_mongodb_connection_string`

   `JWT_SECRET=your_jwt_secret`

6. Start the server:

   `npm start`

## API Base URL

`http://localhost:8000`

## Main API Routes

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | /api/auth/register | Register a user        |
| POST   | /api/auth/login    | Login                  |
| GET    | /api/food-items    | Get food items         |
| POST   | /api/categories    | Create a category      |
| GET    | /api/categories    | Get categories         |
| GET    | /api/cart          | View cart              |
| POST   | /api/cart/items    | Add item to cart       |
| POST   | /api/orders        | Place an order         |
| GET    | /api/orders        | View personal orders   |
| GET    | /api/admin/orders  | Admin: view all orders |

## User Roles

* **Customer:** Can browse available food, manage their cart, and place and view their own orders.
* **Admin:** Can manage categories and food items, view all orders, and update order statuses.

## Security

* Passwords are hashed before storage.
* JWT protects authenticated routes.
* Role-based middleware restricts administrative actions.
* Order totals are calculated on the server.
* Environment variables are used for sensitive configuration.

## Project Structure

The project uses separate folders for configuration, controllers, middleware, models, and routes to keep the code organised and maintainable.
